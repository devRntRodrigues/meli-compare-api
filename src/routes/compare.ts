import { Router } from 'express';
import { ItemController } from '@/controllers/item.controller';
import type { Container } from '@/config/container';
import {
  createTypedValidateQuery,
  createTypedHandler,
} from '@/middlewares/validate-query';
import { cacheHeaders } from '@/middlewares/cache-headers';
import { CompareQuerySchema } from '@/schemas/item.schema';
import type { CompareQuery } from '@/schemas/item.schema';

export const createCompareRouter = (container: Container): Router => {
  const router = Router();
  const itemController = new ItemController(container.itemService);

  // Middleware of cache that uses the ItemService to generate ETag and Last-Modified
  const cacheMiddleware = cacheHeaders(container.itemService);

  router.get(
    '/',
    createTypedValidateQuery(CompareQuerySchema),
    cacheMiddleware,
    createTypedHandler<CompareQuery>(itemController.compare)
  );

  return router;
};
