import { query } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';;

export const updateCategory = async (req, res, next) => {
  try {
    // 1. Extract the needed data
    const categoryId = req.params.id; // Comes from the URL: /categories/:id
    const { name } = req.body;        // Comes from the Zod validated body
    const userId = req.user.id;       // Comes from your protect middleware

    const result = await query(
      `UPDATE categories 
       SET name = $1 
       WHERE id = $2 AND user_id = $3 
       RETURNING *`,
      [name, categoryId, userId]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Category not found or you do not have permission to edit it.', 404));
    }

    // 4. Send the successful response
    res.status(200).json({
      status: 'success',
      data: {
        category: result.rows[0]
      }
    });

  } catch (error) {
    next(error);
  }
};