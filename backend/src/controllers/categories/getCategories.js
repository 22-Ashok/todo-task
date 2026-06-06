import { query } from '../../config/db.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // 1. Extract query parameters from the URL
    // Example URL: /categories?search=groceries&sort=newest
    const { search, sort } = req.query;

    // 2. Build the base query and the parameter array
    let sqlQuery = `SELECT * FROM categories WHERE user_id = $1`;
    const queryParams = [userId];
    
    // We use this to keep track of our $1, $2, $3 variables
    let paramIndex = 2; 

    // 3. Apply the SEARCH filter (if provided)
    if (search) {
      // ILIKE is Postgres-specific. It means "Case-Insensitive Match"
      sqlQuery += ` AND name ILIKE $${paramIndex}`;
      
      // % means "match anything before or after". 
      // So searching "gro" will find "Groceries"
      queryParams.push(`%${search}%`); 
      paramIndex++;
    }

    // 4. Apply the SORT filter
    // We NEVER let the user pass raw text into ORDER BY. We strictly check it against allowed values.
    if (sort === 'newest') {
      sqlQuery += ` ORDER BY created_at DESC`;
    } else if (sort === 'oldest') {
      sqlQuery += ` ORDER BY created_at ASC`;
    } else if (sort === 'z-a') {
      sqlQuery += ` ORDER BY name DESC`;
    } else {
      // The default behavior if they don't specify a sort
      sqlQuery += ` ORDER BY name ASC`; 
    }

    // 5. Execute the dynamic query
    const result = await query(sqlQuery, queryParams);

    // 6. Send the response
    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      data: {
        categories: result.rows
      }
    });

  } catch (error) {
    next(error);
  }
};