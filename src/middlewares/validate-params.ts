import type { ZodType } from 'zod';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { RequestWithParams } from '@/types/express';

import { sendError } from '@/config/response-handler';
import { env } from '@/config/env';

// Typed middleware that returns a RequestHandler that produces RequestWithParams<T>
export function createTypedValidateParams<T extends Record<string, unknown>>(
  schema: ZodType<T>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.params);

      if (!result.success) {
        sendError({
          res,
          isDev: env.NODE_ENV === 'development',
          err: result.error,
        });
        return;
      }

      // Mutate the existing object instead of reassigning
      const target = req.params as Record<string, unknown>;
      for (const key of Object.keys(target))
        delete (target as Record<string, unknown>)[key];
      Object.assign(target, result.data);

      next();
    } catch (error) {
      sendError({
        res,
        isDev: env.NODE_ENV === 'development',
        err: error,
      });
    }
  };
}

// Helper function to create a typed handler that produces RequestWithParams<T>
export function createTypedParamsHandler<
  TParams extends Record<string, unknown>,
>(
  handler: (
    req: RequestWithParams<TParams>,
    res: Response
  ) => Promise<Response> | Response
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req as RequestWithParams<TParams>, res);
    } catch (error) {
      next(error);
    }
  };
}
