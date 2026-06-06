import bcrypt from 'bcrypt';
import { query } from '../config/db.js'; // <-- Notice the curly braces here!
import { signToken } from '../utils/signinToken.js';


export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save to database
    const newUserData = await query(
      `INSERT INTO users (name, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );

    const newUser = newUserData.rows[0];

    // GENERATE THE JWT TOKEN
    const token = signToken(newUser.id);

    // Send response with the token
    res.status(201).json({
      status: 'success',
      token, // Send token to the client so they are instantly logged in
      data: {
        user: newUser
      }
    });

  } catch (error) {
    next(error);
  }
};