import type { ZodType, ZodError } from 'zod';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

import { sendError } from '@/config/response-handler';
import { env } from '@/config/env';
import type { RequestWithQuery } from '@/types/express';

// Type-safe middleware that validates and transforms query parameters
export function createTypedValidateQuery<T extends Record<string, unknown>>(
  schema: ZodType<T>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        const validationError: ZodError = result.error;
        sendError({
          res,
          isDev: env.NODE_ENV === 'development',
          err: validationError,
        });
        return;
      }

      // Replace req.query completely with validated data
      // This is the most reliable way to ensure the transformation works
      Object.defineProperty(req, 'query', {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });

      next();
    } catch (error: unknown) {
      sendError({
        res,
        isDev: env.NODE_ENV === 'development',
        err: error,
      });
    }
  };
}

// Helper function to create a typed handler that produces RequestWithQuery<T>
export function createTypedHandler<TQuery extends Record<string, unknown>>(
  handler: (
    req: RequestWithQuery<TQuery>,
    res: Response
  ) => Promise<Response> | Response
): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // At this point, the query should have been validated by the middleware
      // We can safely cast it because the validation middleware ensures the type
      const typedReq = req as RequestWithQuery<TQuery>;
      await handler(typedReq, res);
    } catch (error: unknown) {
      next(error);
    }
  };
}
