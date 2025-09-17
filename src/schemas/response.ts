import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ItemSchema, ItemComparisonSchema } from './item.schema';

extendZodWithOpenApi(z);

export const PaginationMetaSchema = z
  .object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  })
  .openapi('PaginationMeta');

export const PaginatedItemsResponseSchema = z
  .object({
    data: z.array(ItemSchema),
    meta: PaginationMetaSchema,
  })
  .openapi('PaginatedItemsResponse');

export const ItemResponseSchema = z
  .object({
    data: ItemSchema,
  })
  .openapi('ItemResponse');

export const CompareResponseSchema = z
  .object({
    data: z.array(ItemComparisonSchema),
  })
  .openapi('CompareResponse');

export const HealthResponseSchema = z
  .object({
    status: z.literal('ok'),
    timestamp: z.string().datetime(),
    uptime: z.number(),
  })
  .openapi('HealthResponse');

export const ErrorResponseSchema = z
  .object({
    type: z.string(),
    title: z.string(),
    status: z.number().int(),
    detail: z.string().optional(),
    instance: z.string().optional(),
  })
  .openapi('Error');

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
export type PaginatedItemsResponse = z.infer<
  typeof PaginatedItemsResponseSchema
>;
export type ItemResponse = z.infer<typeof ItemResponseSchema>;
export type CompareResponse = z.infer<typeof CompareResponseSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
