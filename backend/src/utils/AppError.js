export class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    
    this.statusCode = statusCode;
    // Automatically set status based on the HTTP code (4xx = fail, 5xx = error)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; 
    
    if (errors) {
      this.errors = errors;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}