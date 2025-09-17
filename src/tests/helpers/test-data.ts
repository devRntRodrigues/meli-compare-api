import type { Item, CreateItem } from '@/schemas/item.schema';

export const testItems: Item[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'iPhone 15 Pro',
    price: 999.99,
    category: 'smartphones',
    brand: 'Apple',
    description: 'Latest iPhone with A17 Pro chip and titanium design',
    features: ['A17 Pro chip', '48MP camera', 'Titanium design', 'USB-C', '5G'],
    rating: 4.8,
    availability: true,
    imageUrl: 'https://example.com/iphone15pro.jpg',
    createdAt: '2024-01-01T10:00:00.000Z',
    updatedAt: '2024-01-01T10:00:00.000Z',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Samsung Galaxy S24 Ultra',
    price: 1199.99,
    category: 'smartphones',
    brand: 'Samsung',
    description: 'Premium Android smartphone with S Pen',
    features: ['Snapdragon 8 Gen 3', '200MP camera', 'S Pen', '120Hz display', '5G'],
    rating: 4.7,
    availability: true,
    imageUrl: 'https://example.com/galaxys24ultra.jpg',
    createdAt: '2024-01-02T10:00:00.000Z',
    updatedAt: '2024-01-02T10:00:00.000Z',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'MacBook Pro 14',
    price: 1999.99,
    category: 'laptops',
    brand: 'Apple',
    description: 'Professional laptop with M3 chip',
    features: ['M3 chip', '14-inch Liquid Retina XDR', '16GB RAM', '512GB SSD', 'Touch ID'],
    rating: 4.9,
    availability: true,
    imageUrl: 'https://example.com/macbookpro14.jpg',
    createdAt: '2024-01-03T10:00:00.000Z',
    updatedAt: '2024-01-03T10:00:00.000Z',
  },
];

export const createTestItem: CreateItem = {
  name: 'Test Product',
  price: 299.99,
  category: 'test-category',
  brand: 'Test Brand',
  description: 'Test product description',
  features: ['Feature 1', 'Feature 2', 'Feature 3'],
  rating: 4.5,
  availability: true,
  imageUrl: 'https://example.com/test-product.jpg',
};

export const invalidTestItem = {
  name: '', // Invalid: empty name
  price: -10, // Invalid: negative price
  category: '',
  brand: '',
  rating: 6, // Invalid: rating > 5
};

export const testItemIds = {
  existing: '123e4567-e89b-12d3-a456-426614174000',
  nonExisting: '123e4567-e89b-12d3-a456-000000000000',
  invalid: 'invalid-uuid',
};

export const compareTestData = {
  validIds: [
    '123e4567-e89b-12d3-a456-426614174000',
    '123e4567-e89b-12d3-a456-426614174001',
  ],
  mixedIds: [
    '123e4567-e89b-12d3-a456-426614174000', // exists
    '123e4567-e89b-12d3-a456-000000000000', // doesn't exist
  ],
  invalidIds: ['invalid-uuid-1', 'invalid-uuid-2'],
};
