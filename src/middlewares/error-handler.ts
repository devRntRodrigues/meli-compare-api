import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import { sendError } from '@/config/response-handler';
import { env } from '@/config/env';
import { AppError } from '@/utils/app-error';
import { HttpStatus } from '@/config/constants';
import { logger } from '@/config/logger';
import type { RequestWithAll } from '@/types/express';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isDev = env.NODE_ENV !== 'production';

  logger.error(
    {
      err: err instanceof Error ? err : new Error(String(err)),
      request: {
        method: req.method,
        url: req.url,
        path: req.path,
        query: req.query,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.get('User-Agent'),
        headers: {
          'content-type': req.get('content-type'),
        },
        body: req.body,
        id: (req as RequestWithAll).id,
      },
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    },
    'Unhandled error occurred'
  );

  if (err instanceof AppError) {
    sendError({ res, err, isDev });
    return;
  }

  const wrapped = new AppError(
    'Internal server error',
    HttpStatus._INTERNAL_ERROR
  );

  sendError({ res, err: wrapped, isDev });
};
