import { Router } from 'express';
import type { Container } from '@/config/container';
import { createHealthRouter } from './health';
import { createItemsRouter } from './items';
import { createCompareRouter } from './compare';

export const createRoutes = (container: Container): Router => {
  const router = Router();

  router.use('/health', createHealthRouter());
  router.use('/items', createItemsRouter(container));
  router.use('/compare', createCompareRouter(container));

  return router;
};
