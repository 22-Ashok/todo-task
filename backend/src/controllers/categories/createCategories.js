import { query } from '../../config/db.js';

export const createCategory = async (req, res, next) => {
  try {
    // 1. Get the validated name from the Zod middleware
    const { name } = req.body;
    
    // 2. Get the user_id from the protect middleware
    const userId = req.user.id; 

    // 3. Save to your exact database structure
    const newCategory = await query(
      `INSERT INTO categories (name, user_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [name, userId]
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