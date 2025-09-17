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
  .openapi('Item', {
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'iPhone 15 Pro',
      price: 999.99,
      category: 'smartphones',
      brand: 'Apple',
      description: 'Most recent iPhone with advanced technology',
      features: ['5G', 'Face ID', 'Câmera tripla', 'A17 Pro chip'],
      rating: 4.8,
      availability: true,
      imageUrl: 'https://example.com/iphone15pro.jpg',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  });

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
  .openapi('ItemComparison', {
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'iPhone 15 Pro',
      price: 999.99,
      category: 'smartphones',
      brand: 'Apple',
      features: ['5G', 'Face ID', 'Câmera tripla', 'A17 Pro chip'],
      description: 'Most recent iPhone with advanced technology',
      imageUrl: 'https://example.com/iphone15pro.jpg',
      rating: 4.8,
    },
  });

export const ItemsQuerySchema = z
  .object({
    category: z.string().optional().openapi({
      description:
        'Filter by product category (ex: smartphones, laptops, tablets)',
      example: 'smartphones',
    }),
    brand: z.string().optional().openapi({
      description: 'Filter by product brand (ex: Apple, Samsung, Sony)',
      example: 'Apple',
    }),
    minPrice: z.coerce.number().positive().optional().openapi({
      description: 'Minimum price to filter products',
      example: 500,
    }),
    maxPrice: z.coerce.number().positive().optional().openapi({
      description: 'Maximum price to filter products',
      example: 1500,
    }),
    search: z.string().optional().openapi({
      description: 'Search by product name or description',
      example: 'iPhone Pro',
    }),
    sortBy: z
      .enum(['name', 'price', 'rating', 'createdAt'])
      .default('createdAt')
      .openapi({
        description: 'Field to sort results',
        example: 'price',
      }),
    sortOrder: z.enum(['asc', 'desc']).default('desc').openapi({
      description: 'Sort direction (ascending or descending)',
      example: 'asc',
    }),
    page: z.coerce.number().int().min(1).default(1).openapi({
      description: 'Page number for pagination',
      example: 1,
    }),
    limit: z.coerce.number().int().min(1).max(100).default(20).openapi({
      description: 'Maximum number of items per page (maximum 100)',
      example: 20,
    }),
  })
  .openapi('ItemsQuery');

// Schema for OpenAPI (without transformation)
const CompareQueryBaseSchema = z
  .object({
    ids: z.string().openapi({
      example:
        '123e4567-e89b-12d3-a456-426614174000,123e4567-e89b-12d3-a456-426614174001,123e4567-e89b-12d3-a456-426614171305',
      description:
        'Comma-separated list of product IDs to compare (minimum 2, maximum 10 products)',
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
    id: z.string().min(1).openapi({
      description: 'Unique product ID (UUID)',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
  })
  .openapi('ItemParams');

export const CreateItemSchema = z
  .object({
    name: z.string().min(1).openapi({
      description: 'Product name',
      example: 'Samsung Galaxy S24',
    }),
    price: z.number().positive().openapi({
      description: 'Product price in reais (positive value)',
      example: 899.99,
    }),
    category: z.string().min(1).openapi({
      description: 'Product category',
      example: 'smartphones',
    }),
    brand: z.string().min(1).openapi({
      description: 'Product brand',
      example: 'Samsung',
    }),
    description: z.string().optional().openapi({
      description: 'Detailed product description (optional)',
      example: 'Smartphone Android with latest generation and integrated AI',
    }),
    features: z
      .array(z.string())
      .default([])
      .openapi({
        description: 'List of product features',
        example: ['5G', 'Câmera 200MP', 'Galaxy AI', 'Tela Dynamic AMOLED'],
      }),
    rating: z.number().min(0).max(5).optional().openapi({
      description: 'Product rating from 0 to 5 (optional)',
      example: 4.7,
    }),
    availability: z.boolean().default(true).openapi({
      description: 'Indicates if the product is available for purchase',
      example: true,
    }),
    imageUrl: z.url().optional().openapi({
      description: 'URL of the product image (optional)',
      example: 'https://example.com/galaxy-s24.jpg',
    }),
  })
  .openapi('CreateItem');

export const UpdateItemSchema = z
  .object({
    name: z.string().min(1).optional().openapi({
      description: 'New product name (optional)',
      example: 'iPhone 15 Pro Max',
    }),
    price: z.number().positive().optional().openapi({
      description: 'New product price in dollars (optional)',
      example: 800.99,
    }),
    category: z.string().min(1).optional().openapi({
      description: 'New product category (optional)',
      example: 'smartphones',
    }),
    brand: z.string().min(1).optional().openapi({
      description: 'New product brand (optional)',
      example: 'Apple',
    }),
    description: z.string().optional().openapi({
      description: 'New product description (optional)',
      example: 'iPhone 15 Pro Max with 512GB storage',
    }),
    features: z
      .array(z.string())
      .optional()
      .openapi({
        description: 'New list of product features (optional)',
        example: ['5G', 'Face ID', 'Triple camera', 'A17 Pro chip', 'Titanium'],
      }),
    rating: z.number().min(0).max(5).optional().openapi({
      description: 'New product rating from 0 to 5 (optional)',
      example: 4.9,
    }),
    availability: z.boolean().optional().openapi({
      description: 'New product availability (optional)',
      example: false,
    }),
    imageUrl: z.url().optional().openapi({
      description: 'New product image URL (optional)',
      example: 'https://example.com/iphone-15-pro-max.jpg',
    }),
  })
  .openapi('UpdateItem');

export type Item = z.infer<typeof ItemSchema>;
export type ItemComparison = z.infer<typeof ItemComparisonSchema>;
export type ItemsQuery = z.infer<typeof ItemsQuerySchema>;
export type CompareQuery = z.infer<typeof CompareQuerySchema>;
export type ItemParams = z.infer<typeof ItemParamsSchema>;
export type CreateItem = z.infer<typeof CreateItemSchema>;
export type UpdateItem = z.infer<typeof UpdateItemSchema>;
