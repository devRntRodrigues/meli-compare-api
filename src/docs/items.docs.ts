import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import {
  ItemsQuerySchema,
  ItemParamsSchema,
  CreateItemSchema,
  UpdateItemSchema,
} from '../schemas/item.schema';
import {
  PaginatedItemsResponseSchema,
  ItemResponseSchema,
  ErrorResponseSchema,
} from '../schemas/response';

export const registerItemsPaths = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/items',
    tags: ['Items'],
    summary: 'List all items',
    description:
      'Returns a paginated list of items with optional filtering and sorting',
    request: {
      query: ItemsQuerySchema,
    },
    responses: {
      200: {
        description: 'List of items retrieved successfully',
        content: {
          'application/json': {
            schema: PaginatedItemsResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad request - Invalid query parameters',
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

  registry.registerPath({
    method: 'get',
    path: '/items/{id}',
    tags: ['Items'],
    summary: 'Get item by ID',
    description: 'Returns a specific item by its unique identifier',
    request: {
      params: ItemParamsSchema,
    },
    responses: {
      200: {
        description: 'Item found successfully',
        content: {
          'application/json': {
            schema: ItemResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad request - Invalid item ID format',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
      404: {
        description: 'Item not found',
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

  registry.registerPath({
    method: 'post',
    path: '/items',
    tags: ['Items'],
    summary: 'Create a new item',
    description: 'Creates a new item with the provided data',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateItemSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Item created successfully',
        content: {
          'application/json': {
            schema: ItemResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad request - Invalid item data',
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

  registry.registerPath({
    method: 'put',
    path: '/items/{id}',
    tags: ['Items'],
    summary: 'Update an existing item',
    description: 'Updates an existing item with the provided data',
    request: {
      params: ItemParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: UpdateItemSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Item updated successfully',
        content: {
          'application/json': {
            schema: ItemResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad request - Invalid item data or ID format',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
      404: {
        description: 'Item not found',
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

  registry.registerPath({
    method: 'delete',
    path: '/items/{id}',
    tags: ['Items'],
    summary: 'Delete an item',
    description: 'Deletes an existing item by its unique identifier',
    request: {
      params: ItemParamsSchema,
    },
    responses: {
      204: {
        description: 'Item deleted successfully',
      },
      400: {
        description: 'Bad request - Invalid item ID format',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
      404: {
        description: 'Item not found',
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
