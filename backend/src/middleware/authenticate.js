import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export const protect = async (req, res, next) => {
  try {
    // 1. Get the token from the request headers
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // The header usually looks like: "Bearer eyJhbGciOiJIUzI1..."
      // We split it by the space and take the second part (the actual token)
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token was found, the user is not logged in
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2. Verify the token
    // We use try/catch inside here specifically to catch bad/expired tokens
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // If the token is modified, fake, or expired, jwt.verify throws an error
      return next(new AppError('Invalid or expired token. Please log in again.', 401));
    }

    // 3. Check if the user still exists in the database
    // The decoded object contains the { id } we passed into signToken earlier
    const result = await query('SELECT id, name, email FROM users WHERE id = $1', [
      decoded.id,
    ]);
    const currentUser = result.rows[0];

    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 4. Grant Access!
    // Attach the user object to the request. This is the secret sauce!
    // Now, EVERY middleware or controller after this one has access to req.user
    req.user = currentUser;
    
    next();
  } catch (error) {
    // Catch any unexpected database or server errors
    next(error);
  }
};