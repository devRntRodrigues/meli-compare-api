import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { randomUUID } from 'crypto';

export const requestIdMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.id = req.get('X-Request-ID') || randomUUID();
  res.set('X-Request-ID', req.id);
  next();
};
