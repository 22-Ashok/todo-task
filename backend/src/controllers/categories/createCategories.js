import { query } from '../../config/db.js';

export const createCategory = async (req, res, next) => {
  try {
    // 1. Get the validated fields from the Zod middleware
    const { name, icon, color, description } = req.body;
    
    // 2. Get the user_id from the protect middleware
    const userId = req.user.id; 

    // 3. Save to the database
    const newCategory = await query(
      `INSERT INTO categories (name, user_id, icon, color, description) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, userId, icon || null, color || null, description || null]
    );

    res.status(201).json({
      status: 'success',
      data: {
        category: newCategory.rows[0]
      }
    });

  } catch (error) {
    next(error);
  }
};