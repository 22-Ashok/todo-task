import { AppError } from '../utils/AppError.js';

export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const result = await schema.safeParseAsync(req.body);

      if (!result.success) {
        // Create our custom error, passing the 400 status and the formatted Zod errors
        const error = new AppError('Validation failed', 400, result.error.format());
        return next(error); // This immediately skips to the global error handler
      }

      req.body = result.data;
      next();
    } catch (error) {
      next(new AppError('Internal validation failure', 500));
    }
  };
};