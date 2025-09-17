import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { HealthResponseSchema, ErrorResponseSchema } from '../schemas/response';

export const registerHealthPaths = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/health',
    tags: ['Health'],
    summary: 'Check API health status',
    description: 'Returns the current health status of the API',
    responses: {
      200: {
        description: 'API is healthy',
        content: {
          'application/json': {
            schema: HealthResponseSchema,
          },
        },
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
};
