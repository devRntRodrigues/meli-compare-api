import { Router } from 'express';
import { HealthController } from '@/controllers/health.controller';

export const createHealthRouter = (): Router => {
  const router = Router();
  const healthController = new HealthController();

  router.get('/', healthController.handle);

  return router;
};
