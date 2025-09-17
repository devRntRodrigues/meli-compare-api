import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const ItemSchema = z
  .object({
    id: z.uuid(),
    name: z.string().min(1),
    price: z.number().positive(),
    category: z.string().min(1),
    brand: z.string().min(1),
    description: z.string().optional(),
    features: z.array(z.string()).default([]),
    rating: z.number().min(0).max(5).optional(),
    availability: z.boolean().default(true),
    imageUrl: z.url().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi('Item');

export const ItemComparisonSchema = z
  .object({
    id: z.uuid(),
    name: z.string(),
    price: z.number(),
    category: z.string(),
    brand: z.string(),
    features: z.array(z.string()),
    description: z.string().optional(),
    imageUrl: z.url().optional(),
    rating: z.number().optional(),
  })
  .openapi('ItemComparison');

export const ItemsQuerySchema = z
  .object({
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    search: z.string().optional(),
    sortBy: z
      .enum(['name', 'price', 'rating', 'createdAt'])
      .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .openapi('ItemsQuery');

// Schema for OpenAPI (without transformation)
const CompareQueryBaseSchema = z
  .object({
    ids: z.string().openapi({
      example: 'id1,id2,id3',
      description: 'Comma-separated list of item IDs',
    }),
  })
  .openapi('CompareQuery');

// Schema for runtime validation (with transformation)
export const CompareQuerySchema = z
  .object({
    ids: z.string(),
  })
  .transform(data => ({
    ids: data.ids
      .split(',')
      .map(id => id.trim())
      .filter(Boolean),
  }));

// Export for OpenAPI documentation (without transformation)
export const CompareQueryDocSchema = CompareQueryBaseSchema;

export const ItemParamsSchema = z
  .object({
    id: z.string().min(1),
  })
  .openapi('ItemParams');

export const CreateItemSchema = z
  .object({
    name: z.string().min(1),
    price: z.number().positive(),
    category: z.string().min(1),
    brand: z.string().min(1),
    description: z.string().optional(),
    features: z.array(z.string()).default([]),
    rating: z.number().min(0).max(5).optional(),
    availability: z.boolean().default(true),
    imageUrl: z.url().optional(),
  })
  .openapi('CreateItem');

export const UpdateItemSchema = z
  .object({
    name: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    category: z.string().min(1).optional(),
    brand: z.string().min(1).optional(),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    rating: z.number().min(0).max(5).optional(),
    availability: z.boolean().optional(),
    imageUrl: z.url().optional(),
  })
  .openapi('UpdateItem');

export type Item = z.infer<typeof ItemSchema>;
export type ItemComparison = z.infer<typeof ItemComparisonSchema>;
export type ItemsQuery = z.infer<typeof ItemsQuerySchema>;
export type CompareQuery = z.infer<typeof CompareQuerySchema>;
export type ItemParams = z.infer<typeof ItemParamsSchema>;
export type CreateItem = z.infer<typeof CreateItemSchema>;
export type UpdateItem = z.infer<typeof UpdateItemSchema>;
