import { AppError } from '../utils/AppError.js';

// --- HELPER FUNCTIONS FOR POSTGRES ERRORS ---

// Handle duplicate field values (e.g., Email already exists)
const handlePsqlUniqueViolation = (err) => {
  // Postgres puts the specific duplicate value in the 'detail' property
  const message = `This information is already in use. Please try another value or log in.`;
  return new AppError(message, 400); // 400 Bad Request
};

// Handle invalid data types sent to Postgres
const handlePsqlInvalidDataType = (err) => {
  const message = `Invalid data type sent to database.`;
  return new AppError(message, 400);
};


// --- THE MAIN ERROR HANDLER ---

export const globalErrorHandler = (err, req, res, next) => {
  // Create a copy of the error object so we don't mutate the original
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  // --------------------------------------------------------
  // DATABASE ERROR INTERCEPTION (Postgres Specific)
  // --------------------------------------------------------
  
  // '23505' is the Postgres error code for unique constraint violation
  if (err.code === '23505') {
    error = handlePsqlUniqueViolation(err);
  }

  // '22P02' is the Postgres error code for invalid text representation
  if (err.code === '22P02') {
    error = handlePsqlInvalidDataType(err);
  }

  // --------------------------------------------------------
  // FINAL RESPONSE CONSTRUCTION
  // --------------------------------------------------------

  const errorResponse = {
    status: error.status,
    message: error.message,
  };

  // Attach Zod errors if they exist
  if (error.errors) {
    errorResponse.errors = error.errors;
  }

  // Send the clean, consistent response
  res.status(error.statusCode).json(errorResponse);
};