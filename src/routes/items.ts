import { Router } from 'express';
import { ItemController } from '@/controllers/item.controller';
import type { Container } from '@/config/container';
import {
  createTypedValidateQuery,
  createTypedHandler,
} from '@/middlewares/validate-query';
import {
  createTypedValidateParams,
  createTypedParamsHandler,
} from '@/middlewares/validate-params';
import {
  validateBody,
  createTypedBodyHandler,
  createTypedBodyAndParamsHandler,
} from '@/middlewares/validate-body';
import { cacheHeaders } from '@/middlewares/cache-headers';
import {
  ItemsQuerySchema,
  ItemParamsSchema,
  CreateItemSchema,
  UpdateItemSchema,
} from '@/schemas/item.schema';
import type {
  ItemsQuery,
  ItemParams,
  CreateItem,
  UpdateItem,
} from '@/schemas/item.schema';

export const createItemsRouter = (container: Container): Router => {
  const router = Router();
  const itemController = new ItemController(container.itemService);

  // Middleware of cache that uses the ItemService to generate ETag and Last-Modified
  const cacheMiddleware = cacheHeaders(container.itemService);

  router.get(
    '/',
    createTypedValidateQuery(ItemsQuerySchema),
    cacheMiddleware,
    createTypedHandler<ItemsQuery>(itemController.findAll)
  );

  router.get(
    '/:id',
    createTypedValidateParams(ItemParamsSchema),
    cacheMiddleware,
    createTypedParamsHandler<ItemParams>(itemController.findById)
  );

  router.post(
    '/',
    validateBody(CreateItemSchema),
    createTypedBodyHandler<CreateItem>(itemController.create)
  );

  router.put(
    '/:id',
    createTypedValidateParams(ItemParamsSchema),
    validateBody(UpdateItemSchema),
    createTypedBodyAndParamsHandler<UpdateItem, ItemParams>(
      itemController.update
    )
  );

  router.delete(
    '/:id',
    createTypedValidateParams(ItemParamsSchema),
    createTypedParamsHandler<ItemParams>(itemController.delete)
  );

  return router;
};
