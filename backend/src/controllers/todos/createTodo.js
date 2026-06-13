import { query } from '../../config/db.js';

export const createTodo = async (req, res, next) => {
  try {
    // 1. Get the authenticated user's ID
    const userId = req.user.id;

    // 2. Extract validated data from the Zod body
    // We use JS default parameters to handle the optional fields cleanly
    const { 
      title, 
      description = null, 
      category_id = null, 
      priority = 'medium', 
      due_date = null 
    } = req.body;

    // 3. Save to the database
    const newTodo = await query(
      `INSERT INTO todos (user_id, category_id, title, description, priority, due_date) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [userId, category_id, title, description, priority, due_date]
    );

    // 4. Send the successful response
    res.status(201).json({
      status: 'success',
      data: {
        todo: newTodo.rows[0]
      }
    });

  } catch (error) {
    next(error);
  }
};