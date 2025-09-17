import type { Request, Response } from 'express';

import { sendError } from '@/config/response-handler';
import { AppError } from '@/utils/app-error';
import { HttpStatus } from '@/config/constants';

export function notFoundHandler(req: Request, res: Response) {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    HttpStatus._NOT_FOUND
  );
  return sendError({ res, err: error });
}
