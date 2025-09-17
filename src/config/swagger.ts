import type { Express } from 'express';
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import { swaggerServe, swaggerSetup } from '@/middlewares/swagger-midleware';
import { registerHealthPaths } from '@/docs/health.docs';
import { registerItemsPaths } from '@/docs/items.docs';
import { registerComparePaths } from '@/docs/compare.docs';

export const setupSwagger = (app: Express): void => {
  const registry = new OpenAPIRegistry();

  registerHealthPaths(registry);
  registerItemsPaths(registry);
  registerComparePaths(registry);

  const generator = new OpenApiGeneratorV3(registry.definitions);
  const openApiDoc = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Meli Compare API',
      version: '1.0.0',
      description: 'API of Meli Compare',
    },
  });

  app.use('/api-docs', swaggerServe);
  // @ts-expect-error - swaggerSetup is not typed correctly
  app.get('/api-docs', swaggerSetup(openApiDoc));
};
