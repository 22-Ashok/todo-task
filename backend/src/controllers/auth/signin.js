import bcrypt from 'bcrypt';
import { query } from '../../config/db.js';
import { signToken } from '../../utils/signinToken.js';
import { AppError } from '../../utils/AppError.js';

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user in the database by their email
    // We select * because we NEED the hashed password to compare it
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    // 2. If the user doesn't exist, throw an error
    if (!user) {
      // Note: We say "Incorrect email OR password" for security. 
      // If we say "Email not found", hackers can use it to guess which emails are registered!
      return next(new AppError('Incorrect email or password', 401)); 
    }

    // 3. Compare the typed password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 4. If everything is correct, generate the token
    const token = signToken(user.id);

    // 5. Remove the password from the user object before sending it to the frontend!
    user.password = undefined;

    // 6. Send the successful response
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });

  } catch (error) {
    next(error);
  }
};