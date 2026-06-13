import { query } from '../../config/db.js';

export const getAllTodos = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // 1. Extract all possible query parameters from the URL
    // Example URL: /todos?search=api&is_completed=false&sort=due-soon
    const { search, category_id, is_completed, sort } = req.query;

    // 2. Build the base query
    let sqlQuery = `SELECT * FROM todos WHERE user_id = $1`;
    const queryParams = [userId];
    let paramIndex = 2; // Keeps track of the $ numbers dynamically

    // 3. Apply the SEARCH filter (Checks both title AND description)
    if (search) {
      sqlQuery += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`); 
      paramIndex++;
    }

    // 4. Apply the CATEGORY filter
    if (category_id) {
      sqlQuery += ` AND category_id = $${paramIndex}`;
      queryParams.push(category_id);
      paramIndex++;
    }

    // 5. Apply the COMPLETION filter
    // Note: URL query parameters always arrive as strings (e.g., "true" or "false")
    if (is_completed !== undefined) {
      sqlQuery += ` AND is_completed = $${paramIndex}`;
      queryParams.push(is_completed === 'true'); // Converts the string to an actual boolean
      paramIndex++;
    }

    // 6. Apply the SORTING logic
    if (sort === 'newest') {
      sqlQuery += ` ORDER BY created_at DESC`;
    } else if (sort === 'oldest') {
      sqlQuery += ` ORDER BY created_at ASC`;
    } else if (sort === 'due-soon') {
      // ASC NULLS LAST ensures tasks with no due date don't crowd the top of the list!
      sqlQuery += ` ORDER BY due_date ASC NULLS LAST`;
    } else if (sort === 'z-a') {
      sqlQuery += ` ORDER BY title DESC`;
    } else {
      // DEFAULT SORT: Incomplete tasks first, then closest due date, then newest created
      sqlQuery += ` ORDER BY is_completed ASC, due_date ASC NULLS LAST, created_at DESC`; 
    }

    // 7. Execute the dynamic query
    const result = await query(sqlQuery, queryParams);

    // 8. Send the response
    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      data: {
        todos: result.rows
      }
    });

  } catch (error) {
    next(error);
  }
};