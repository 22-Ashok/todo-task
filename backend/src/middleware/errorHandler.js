import { AppError } from '../utils/AppError.js';

// --- HELPER FUNCTIONS FOR POSTGRES ERRORS ---

// Handle duplicate field values (e.g., Email already exists)
const handlePsqlUniqueViolation = (err) => {
  // 1. Check if the error is from the Categories table
  if (err.constraint === 'unique_category_per_user') {
    // err.detail looks like: "Key (name, user_id)=(work, 1) is duplicated."
    // We use a quick regex to extract just the word "work"
    const match = err.detail.match(/Key \(name, user_id\)=\((.*?),/);
    const categoryName = match ? match[1] : 'that name';

    return new AppError(`You already have a category named "${categoryName}". Please choose a different name.`, 400);
  }

  // 2. Check if the error is from the Users table
  // Note: 'users_email_key' is the default name Postgres gives to a unique email column. 
  // If your database named it differently, just console.log(err.constraint) to see what it is!
  if (err.constraint === 'users_email_key' || err.constraint === 'users_email_unique') {
    return new AppError('An account with this email already exists. Please log in instead.', 400);
  }

  // 3. The Fallback
  // If you add new unique tables in the future and forget to add them above, 
  // this acts as your safe, generic backup.
  return new AppError('This exact information is already in use. Please try another value.', 400);
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