export { errorHandler } from './error-handler';
export { validateBody } from './validate-body';
export { createTypedValidateParams } from './validate-params';
export { notFoundHandler } from './not-found';

import type { Request, Response, NextFunction } from 'express';

import { logger } from '@/config/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  logger.info(
    {
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
      timestamp: new Date().toISOString(),
    },
    'Incoming request'
  );

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusEmoji =
      res.statusCode >= 400 ? '❌' : res.statusCode >= 300 ? '⚠️' : '✅';

    logger.info(
      {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        duration: `${duration}ms`,
        contentLength: res.get('content-length'),
        timestamp: new Date().toISOString(),
      },
      `${statusEmoji} Request completed`
    );
  });

  next();
};
