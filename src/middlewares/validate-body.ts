import type { ZodType } from 'zod';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type {
  RequestWithBody,
  RequestWithBodyAndParams,
} from '@/types/express';

import { sendError } from '@/config/response-handler';
import { env } from '../config/env';

export function validateBody<T extends Record<string, unknown>>(
  schema: ZodType<T>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        sendError({
          res,
          isDev: env.NODE_ENV === 'development',
          err: result.error,
        });
        return;
      }

      (req.body as unknown as T) = result.data;
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

// Helper to create a typed handler after validateBody middleware
export function createTypedBodyHandler<TBody extends Record<string, unknown>>(
  handler: (
    req: RequestWithBody<TBody>,
    res: Response
  ) => Promise<Response> | Response
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req as RequestWithBody<TBody>, res);
    } catch (error) {
      next(error);
    }
  };
}

// Helper to create a typed handler for body + params after both validators
export function createTypedBodyAndParamsHandler<
  TBody extends Record<string, unknown>,
  TParams extends Record<string, unknown>,
>(
  handler: (
    req: RequestWithBodyAndParams<TBody, TParams>,
    res: Response
  ) => Promise<Response> | Response
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(
        req as unknown as RequestWithBodyAndParams<TBody, TParams>,
        res
      );
    } catch (error) {
      next(error);
    }
  };
}
