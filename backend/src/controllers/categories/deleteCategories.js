import { query } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';

export const deleteCategory = async (req, res, next) => {
  try {

    const categoryId = req.params.id; // Comes from the URL: /categories/:id
    const userId = req.user.id;       // Comes from your protect middleware

    const result = await query(
      `DELETE FROM categories 
       WHERE id = $1 AND user_id = $2 
       RETURNING id`,
      [categoryId, userId]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Category not found or you do not have permission to delete it.', 404));
    }

    res.status(204).send();

  } catch (error) {
    next(error);
  }
};