import { query } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';


export const deleteTodo = async (req, res, next) => {
  try {
    // 1. Extract the needed data
    const todoId = req.params.id; // Comes from the URL: /todos/:id
    const userId = req.user.id;   // Comes from your protect middleware

    // 2. Perform the Delete
    // CRITICAL SECURITY: We mandate that BOTH the todo id and user_id match.
    const result = await query(
      `DELETE FROM todos 
       WHERE id = $1 AND user_id = $2 
       RETURNING id`,
      [todoId, userId]
    );

    // 3. Check if it actually deleted anything
    // If it returns 0 rows, the task either doesn't exist, 
    // or the user is trying to delete someone else's task.
    if (result.rows.length === 0) {
      return next(new AppError('Task not found or you do not have permission to delete it.', 404));
    }

    // 4. Send the successful response
    // HTTP Status 204 means "No Content". It is the REST API standard for a successful delete.
    res.status(204).send();

  } catch (error) {
    next(error);
  }
};