import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      (req as any)[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          fields[field] = err.message;
        });

        next(new AppError('Validation failed', 400, 'VALIDATION_ERROR'));
        return;
      }
      next(error);
    }
  };
};
