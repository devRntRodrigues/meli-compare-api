import { treeifyError, ZodError } from 'zod';
import type { Response } from 'express';

import { AppError } from '../utils/app-error';
import { timestamp } from '../utils/timestamp';

import type {
  ErrorResponseBody,
  SuccessResponseBody,
} from '@/schemas/http.schema';
import { httpMessages, HttpStatus } from './constants';

type SuccessResponseArgs = {
  res: Response;
  data: unknown;
  message?: string;
  status?: HttpStatus;
};

type ErrorResponseArgs = {
  res: Response;
  err: unknown;
  isDev?: boolean;
};

export const sendError = (
  data: ErrorResponseArgs
): Response<ErrorResponseBody> => {
  if (data.err instanceof ZodError) {
    return data.res.status(HttpStatus._BAD_REQUEST).json({
      message: httpMessages[HttpStatus._BAD_REQUEST],
      code: HttpStatus._BAD_REQUEST,
      issues: treeifyError(data.err),
      timestamp: timestamp(),
    });
  }

  if (data.err instanceof AppError) {
    return data.res.status(data.err._code).json({
      message: data.err.message || httpMessages[data.err._code as HttpStatus],
      code: data.err._code,
      timestamp: timestamp(),
      ...(data.isDev && { stack: data.err.stack }),
    });
  }

  const stack = data.err instanceof Error ? data.err.stack : undefined;

  return data.res.status(HttpStatus._INTERNAL_ERROR).json({
    message: httpMessages[HttpStatus._INTERNAL_ERROR],
    code: HttpStatus._INTERNAL_ERROR,
    timestamp: timestamp(),
    ...(data.isDev && { stack }),
  });
};

export const sendSuccess = <T>(
  data: SuccessResponseArgs
): Response<SuccessResponseBody<T>> => {
  return data.res.status(data.status || HttpStatus._OK).json({
    message: data.message || httpMessages[data.status || HttpStatus._OK],
    data: data.data,
    timestamp: timestamp(),
  });
};
