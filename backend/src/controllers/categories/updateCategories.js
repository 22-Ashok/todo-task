import { query } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';;

export const updateCategory = async (req, res, next) => {
  try {
    // 1. Extract the needed data
    const categoryId = req.params.id; // Comes from the URL: /categories/:id
    const { name, icon, color, description } = req.body; // Comes from the Zod validated body
    const userId = req.user.id;       // Comes from your protect middleware

    // Build dynamic update query to only set provided fields
    const setClauses = ['name = $1'];
    const values = [name];
    let paramIndex = 2;

    if (icon !== undefined) {
      setClauses.push(`icon = $${paramIndex}`);
      values.push(icon || null);
      paramIndex++;
    }
    if (color !== undefined) {
      setClauses.push(`color = $${paramIndex}`);
      values.push(color || null);
      paramIndex++;
    }
    if (description !== undefined) {
      setClauses.push(`description = $${paramIndex}`);
      values.push(description || null);
      paramIndex++;
    }

    values.push(categoryId, userId);
    const categoryIdIndex = paramIndex;
    paramIndex++;
    const userIdIndex = paramIndex;

    const result = await query(
      `UPDATE categories 
       SET ${setClauses.join(', ')} 
       WHERE id = $${categoryIdIndex} AND user_id = $${userIdIndex} 
       RETURNING *`,
      values
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