import { query } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';

export const updateTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.id;

    // 1. Check if the user actually sent any data to update
    const fieldsToUpdate = Object.keys(req.body);
    
    if (fieldsToUpdate.length === 0) {
      return next(new AppError('Please provide at least one field to update.', 400));
    }

    // 2. Build the Dynamic SQL Query
    const setClause = []; // Will hold things like: "title = $1", "is_completed = $2"
    const values = [];    // Will hold the actual values: ["New Title", true]
    let paramIndex = 1;   // Keeps track of our $ numbers

    // Loop through the validated req.body and construct the arrays
    for (const key of fieldsToUpdate) {
      setClause.push(`${key} = $${paramIndex}`);
      values.push(req.body[key]);
      paramIndex++;
    }

    // 3. Add the ID and User ID for the WHERE clause at the end
    values.push(todoId);       // This becomes the second-to-last $ parameter
    values.push(userId);       // This becomes the final $ parameter

    const sqlQuery = `
      UPDATE todos 
      SET ${setClause.join(', ')} 
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} 
      RETURNING *
    `;

    // 4. Execute the Query
    const result = await query(sqlQuery, values);

    // 5. Verify Ownership / Existence
    if (result.rows.length === 0) {
      return next(new AppError('Task not found or you do not have permission to edit it.', 404));
    }

    // 6. Send Response
    res.status(200).json({
      status: 'success',
      data: {
        todo: result.rows[0]
      }
    });

  } catch (error) {
    next(error);
  }
};