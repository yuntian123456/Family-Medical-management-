import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

interface HttpError extends Error {
  statusCode?: number;
  expose?: boolean; // Add this to control message exposure for client errors
}

export const errorHandlerMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction 
) => {
  console.error('Error occurred:', err.name);
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);
  if (err.statusCode) {
     console.error('Status Code:', err.statusCode);
  }


  // Handle Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`Prisma Error Code: ${err.code}`);
    switch (err.code) {
      case 'P2002': // Unique constraint failed
        return res.status(409).json({ 
          error: `A record with this value already exists. Fields: ${err.meta?.target}` 
        });
      case 'P2025': // Record to update or delete not found
        return res.status(404).json({ 
          error: 'The requested record was not found.' 
        });
      // Add more Prisma error codes as needed
      default:
        return res.status(500).json({ 
          error: 'An unexpected database error occurred.' 
        });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    // This error occurs when input data fails validation according to the schema (e.g. wrong type, missing required field)
    console.error('Prisma Validation Error:', err.message);
    return res.status(400).json({ 
        error: 'Invalid input data. Please check your request.',
        details: err.message // Providing the detailed message from Prisma might be too verbose or expose too much.
                           // Consider a more generic message in production.
    });
  }
  
  // Handle JWT Errors
  if (err instanceof TokenExpiredError) {
    return res.status(401).json({ error: 'Unauthorized: Token expired' });
  }
  if (err instanceof JsonWebTokenError) { // Catches other JWT errors like malformed token
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }

  // Handle custom HTTP errors (e.g. from services or other middleware)
  // If err.expose is true, we can send the message directly.
  if (err.statusCode) {
    const message = err.expose ? err.message : 'An error occurred.';
    return res.status(err.statusCode).json({ error: message });
  }

  // Default to 500 Internal Server Error
  // Avoid exposing generic Error.message in production for non-explicitly exposed errors.
  if (process.env.NODE_ENV === 'production' && (!err.statusCode || err.statusCode >= 500)) {
    return res.status(500).json({ error: 'Internal Server Error' });
  } else {
    // In development, or for client errors (4xx) where message might be useful
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
};
