import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { CompareQueryDocSchema } from '../schemas/item.schema';
import {
  CompareResponseSchema,
  ErrorResponseSchema,
} from '../schemas/response';

export const registerComparePaths = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/compare',
    tags: ['Compare'],
    summary: 'Compare multiple items',
    description:
      'Compare multiple items by their IDs. Returns a simplified comparison view of the selected items.',
    request: {
      query: CompareQueryDocSchema,
    },
    responses: {
      200: {
        description: 'Items comparison retrieved successfully',
        content: {
          'application/json': {
            schema: CompareResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad request - Invalid item IDs or missing IDs parameter',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
      404: {
        description: 'One or more items not found',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
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
