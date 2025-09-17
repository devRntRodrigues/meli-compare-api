import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { Container } from '@/config/container';
import { setupSwagger } from '@/config/swagger';
import { createRoutes } from '@/routes';
import { requestIdMiddleware } from '@/middlewares/request-id';
import { errorHandler } from '@/middlewares/error-handler';
import { notFoundHandler } from '@/middlewares/not-found';
import { requestLogger } from '@/middlewares';
import { httpMessages, HttpStatus } from './config/constants';

export const createApp = (container: Container): express.Application => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.use(requestIdMiddleware);

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      type: 'about:blank',
      title: 'Too Many Requests',
      status: HttpStatus._TOO_MANY_REQUESTS,
      detail: httpMessages[HttpStatus._TOO_MANY_REQUESTS],
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  app.use(requestLogger);

  setupSwagger(app);

  app.use(createRoutes(container));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
