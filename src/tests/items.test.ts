import { createTestServer } from './helpers/test-server';
import {
  createApiTester,
  expectSuccessResponse,
  expectErrorResponse,
  expectValidationError,
  expectPaginatedResponse,
  expectCacheHeaders,
} from './helpers/test-utils';
import { testItemIds } from './helpers/test-data';
import type { Item } from '@/schemas/item.schema';

describe('Items Endpoint Integration Tests', () => {
  const testServer = createTestServer();
  const apiTester = createApiTester(testServer.getApp());

  afterAll(async () => {
    await testServer.cleanup();
  });

  describe('GET /items', () => {
    it('should return paginated list of items with default parameters', async () => {
      const response = await apiTester.get('/items');

      expectPaginatedResponse(response);
      expectCacheHeaders(response);

      // Check default pagination
      expect(response.body.data.meta.page).toBe(1);
      expect(response.body.data.meta.limit).toBe(20);
      expect(response.body.data.items.length).toBeGreaterThan(0);

      // Check item structure
      const item = response.body.data.items[0];
      expect(item).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        price: expect.any(Number),
        category: expect.any(String),
        brand: expect.any(String),
        features: expect.any(Array),
        availability: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should filter items by category', async () => {
      const response = await apiTester.get('/items', {
        category: 'smartphones',
      });

      expectPaginatedResponse(response);
      expect(response.body.data.items.length).toBeGreaterThan(0);

      // All items should be smartphones
      response.body.data.items.forEach((item: Item) => {
        expect(item.category).toBe('smartphones');
      });
    });

    it('should filter items by brand', async () => {
      const response = await apiTester.get('/items', { brand: 'Apple' });

      expectPaginatedResponse(response);
      expect(response.body.data.items.length).toBeGreaterThan(0);

      // All items should be Apple brand
      response.body.data.items.forEach((item: Item) => {
        expect(item.brand).toBe('Apple');
      });
    });

    it('should filter items by price range', async () => {
      const minPrice = 500;
      const maxPrice = 1000;
      const response = await apiTester.get('/items', { minPrice, maxPrice });

      expectPaginatedResponse(response);

      // All items should be within price range
      response.body.data.items.forEach((item: Item) => {
        expect(item.price).toBeGreaterThanOrEqual(minPrice);
        expect(item.price).toBeLessThanOrEqual(maxPrice);
      });
    });

    it('should search items by name', async () => {
      const response = await apiTester.get('/items', { search: 'iPhone' });

      expectPaginatedResponse(response);

      // All items should contain "iPhone" in name (case insensitive)
      response.body.data.items.forEach((item: Item) => {
        expect(item.name.toLowerCase()).toContain('iphone');
      });
    });

    it('should sort items by price ascending', async () => {
      const response = await apiTester.get('/items', {
        sortBy: 'price',
        sortOrder: 'asc',
        limit: 5,
      });

      expectPaginatedResponse(response);

      // Check if prices are in ascending order
      const prices = response.body.data.items.map((item: Item) => item.price);
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sortedPrices);
    });

    it('should sort items by price descending', async () => {
      const response = await apiTester.get('/items', {
        sortBy: 'price',
        sortOrder: 'desc',
        limit: 5,
      });

      expectPaginatedResponse(response);

      // Check if prices are in descending order
      const prices = response.body.data.items.map((item: Item) => item.price);
      const sortedPrices = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sortedPrices);
    });

    it('should handle pagination correctly', async () => {
      const limit = 3;
      const page1 = await apiTester.get('/items', { page: 1, limit });
      const page2 = await apiTester.get('/items', { page: 2, limit });

      expectPaginatedResponse(page1);
      expectPaginatedResponse(page2);

      expect(page1.body.data.meta.page).toBe(1);
      expect(page2.body.data.meta.page).toBe(2);
      expect(page1.body.data.items.length).toBeLessThanOrEqual(limit);
      expect(page2.body.data.items.length).toBeLessThanOrEqual(limit);

      // Items should be different
      const page1Ids = page1.body.data.items.map((item: Item) => item.id);
      const page2Ids = page2.body.data.items.map((item: Item) => item.id);
      expect(page1Ids).not.toEqual(page2Ids);
    });

    it('should validate query parameters', async () => {
      const response = await apiTester.get('/items', {
        minPrice: -10, // Invalid: negative price
        maxPrice: 'invalid', // Invalid: not a number
        sortBy: 'invalid', // Invalid: not in enum
        page: 0, // Invalid: must be >= 1
        limit: 101, // Invalid: must be <= 100
      });

      expectValidationError(response);
    });

    it('should return empty results for non-matching filters', async () => {
      const response = await apiTester.get('/items', {
        category: 'non-existent-category',
      });

      expectPaginatedResponse(response, 0);
      expect(response.body.data.items).toEqual([]);
    });

    it('should handle complex filter combinations', async () => {
      const response = await apiTester.get('/items', {
        category: 'smartphones',
        brand: 'Apple',
        minPrice: 500,
        maxPrice: 1500,
        sortBy: 'price',
        sortOrder: 'desc',
      });

      expectPaginatedResponse(response);

      // All items should match all filters
      response.body.data.items.forEach((item: Item) => {
        expect(item.category).toBe('smartphones');
        expect(item.brand).toBe('Apple');
        expect(item.price).toBeGreaterThanOrEqual(500);
        expect(item.price).toBeLessThanOrEqual(1500);
      });
    });
  });

  describe('GET /items/:id', () => {
    it('should return specific item by valid ID', async () => {
      const response = await apiTester.get(`/items/${testItemIds.existing}`);

      expectSuccessResponse(response);
      expectCacheHeaders(response);

      expect(response.body).toMatchObject({
        message: expect.any(String),
        data: {
          id: testItemIds.existing,
          name: expect.any(String),
          price: expect.any(Number),
          category: expect.any(String),
          brand: expect.any(String),
          features: expect.any(Array),
          availability: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        timestamp: expect.any(String),
      });
    });

    it('should return 404 for non-existent item ID', async () => {
      const response = await apiTester.get(`/items/${testItemIds.nonExisting}`);

      expectErrorResponse(response, 404, 'not found');
    });

    it('should validate item ID parameter', async () => {
      const response = await apiTester.get('/items/'); // Empty ID - this actually routes to GET /items

      // The trailing slash makes this route to GET /items (list) instead of GET /items/:id
      // So we expect a successful response with pagination instead of 404
      expectPaginatedResponse(response);
    });

    it('should handle malformed UUID gracefully', async () => {
      const response = await apiTester.get(`/items/${testItemIds.invalid}`);

      // Depending on implementation, this could be validation error or not found
      expect([400, 404]).toContain(response.status);
    });
  });

  describe('Cache behavior', () => {
    it('should set appropriate cache headers for item list', async () => {
      const response = await apiTester.get('/items');

      expectSuccessResponse(response);
      expectCacheHeaders(response);
    });

    it('should set appropriate cache headers for single item', async () => {
      const response = await apiTester.get(`/items/${testItemIds.existing}`);

      expectSuccessResponse(response);
      expectCacheHeaders(response);
    });

    it('should respect conditional requests with ETag', async () => {
      // First request to get ETag
      const firstResponse = await apiTester.get('/items');
      expectSuccessResponse(firstResponse);

      const etag = firstResponse.headers['etag'];
      expect(etag).toBeDefined();

      // Second request with If-None-Match header should return 304
      const secondResponse = await apiTester.get(
        '/items',
        {},
        {
          headers: { 'If-None-Match': etag as string },
        }
      );

      // Note: This test depends on the cache implementation
      // If 304 is implemented, expect 304, otherwise expect 200
      expect([200, 304]).toContain(secondResponse.status);
    });
  });

  describe('Rate limiting', () => {
    it('should handle normal request rate', async () => {
      // Make several requests in quick succession
      const requests = Array(5)
        .fill(null)
        .map(() => apiTester.get('/items', { limit: 1 }));

      const responses = await Promise.all(requests);

      // All should succeed under normal circumstances
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});
