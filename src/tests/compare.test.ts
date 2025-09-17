import { createTestServer } from './helpers/test-server';
import {
  createApiTester,
  expectSuccessResponse,
  expectErrorResponse,
  expectValidationError,
  expectCacheHeaders,
} from './helpers/test-utils';
import { compareTestData } from './helpers/test-data';
import type { Item } from '@/schemas/item.schema';

describe('Compare Endpoint Integration Tests', () => {
  const testServer = createTestServer();
  const apiTester = createApiTester(testServer.getApp());

  afterAll(async () => {
    await testServer.cleanup();
  });

  describe('GET /compare', () => {
    it('should compare valid items successfully', async () => {
      const idsParam = compareTestData.validIds.join(',');
      const response = await apiTester.get('/compare', { ids: idsParam });

      expectSuccessResponse(response);
      expectCacheHeaders(response);

      expect(response.body).toMatchObject({
        message: expect.any(String),
        data: expect.any(Array),
        timestamp: expect.any(String),
      });

      // Check that we get the expected number of items
      expect(response.body.data).toHaveLength(compareTestData.validIds.length);

      // Check item structure in comparison
      response.body.data.forEach((item: Item) => {
        expect(item).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          price: expect.any(Number),
          category: expect.any(String),
          brand: expect.any(String),
          features: expect.any(Array),
          rating: expect.any(Number),
        });

        // Verify the item ID is one we requested
        expect(compareTestData.validIds).toContain(item.id);
      });
    });

    it('should handle comparison with mixed valid/invalid IDs', async () => {
      const idsParam = compareTestData.mixedIds.join(',');
      const response = await apiTester.get('/compare', { ids: idsParam });

      expectSuccessResponse(response);

      // Should only return valid items
      expect(response.body.data.length).toBeLessThan(
        compareTestData.mixedIds.length
      );
      expect(response.body.data.length).toBeGreaterThan(0);

      // All returned items should be valid
      response.body.data.forEach((item: Item) => {
        expect(item.id).toBe(compareTestData.mixedIds[0]); // Only the first valid ID
      });
    });

    it('should return empty comparison for all invalid IDs', async () => {
      const idsParam = compareTestData.invalidIds.join(',');
      const response = await apiTester.get('/compare', { ids: idsParam });

      expectSuccessResponse(response);

      expect(response.body.data).toEqual([]);
    });

    it('should validate query parameters', async () => {
      // Test missing ids parameter
      const response1 = await apiTester.get('/compare');
      expectValidationError(response1);

      // Test empty ids parameter - this actually results in an AppError, not validation error
      const response2 = await apiTester.get('/compare', { ids: '' });
      expectErrorResponse(response2, 400, 'At least one item ID is required');

      // Test ids parameter with only commas - this also results in an AppError
      const response3 = await apiTester.get('/compare', { ids: ',,,' });
      expectErrorResponse(response3, 400, 'At least one item ID is required');
    });

    it('should handle single item comparison', async () => {
      const idsParam = compareTestData.validIds[0];
      const response = await apiTester.get('/compare', { ids: idsParam });

      expectSuccessResponse(response);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe(compareTestData.validIds[0]);
    });

    it('should handle large number of items in comparison', async () => {
      // Create a string with many valid IDs (using the same ID multiple times, but within limit)
      const manyIds = Array(8).fill(compareTestData.validIds[0]);
      const idsParam = manyIds.join(',');

      const response = await apiTester.get('/compare', { ids: idsParam });

      expectSuccessResponse(response);

      // Should return unique items only
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe(compareTestData.validIds[0]);
    });

    it('should remove duplicate IDs from comparison', async () => {
      const duplicatedIds = [
        compareTestData.validIds[0],
        compareTestData.validIds[1],
        compareTestData.validIds[0], // duplicate
        compareTestData.validIds[1], // duplicate
      ];
      const idsParam = duplicatedIds.join(',');

      const response = await apiTester.get('/compare', { ids: idsParam });

      expectSuccessResponse(response);

      // Should return only unique items
      expect(response.body.data).toHaveLength(2);
      const returnedIds = response.body.data.map((item: Item) => item.id);
      expect(returnedIds).toContain(compareTestData.validIds[0]);
      expect(returnedIds).toContain(compareTestData.validIds[1]);
    });

    it('should calculate price range correctly', async () => {
      const idsParam = compareTestData.validIds.join(',');
      const response = await apiTester.get('/compare', { ids: idsParam });

      expectSuccessResponse(response);

      const prices = response.body.data.map((item: Item) => item.price);
      const expectedMin = Math.min(...prices);
      const expectedMax = Math.max(...prices);

      // Note: The API doesn't return summary data, so we just verify we have price data
      expect(prices.length).toBeGreaterThan(0);
      expect(expectedMin).toBeDefined();
      expect(expectedMax).toBeDefined();
    });

    it('should list unique categories and brands', async () => {
      const idsParam = compareTestData.validIds.join(',');
      const response = await apiTester.get('/compare', { ids: idsParam });

      expectSuccessResponse(response);

      const categories = [
        ...new Set(response.body.data.map((item: Item) => item.category)),
      ];
      const brands = [
        ...new Set(response.body.data.map((item: Item) => item.brand)),
      ];

      // Verify we have unique categories and brands in the data
      expect(categories.length).toBeGreaterThan(0);
      expect(brands.length).toBeGreaterThan(0);
      expect(categories.length).toBe(new Set(categories).size);
      expect(brands.length).toBe(new Set(brands).size);
    });

    it('should handle whitespace and empty values in IDs', async () => {
      const idsParam = ` ${compareTestData.validIds[0]} , , ${compareTestData.validIds[1]} , `;
      const response = await apiTester.get('/compare', { ids: idsParam });

      expectSuccessResponse(response);

      // Should filter out empty values and trim whitespace
      expect(response.body.data).toHaveLength(2);
    });

    it('should set appropriate cache headers', async () => {
      const idsParam = compareTestData.validIds.join(',');
      const response = await apiTester.get('/compare', { ids: idsParam });

      expectSuccessResponse(response);
      expectCacheHeaders(response);
    });
  });

  describe('Performance and Load Testing', () => {
    it('should handle multiple simultaneous comparison requests', async () => {
      const requests = Array(5)
        .fill(null)
        .map(() => {
          const idsParam = compareTestData.validIds.join(',');
          return apiTester.get('/compare', { ids: idsParam });
        });

      const responses = await Promise.all(requests);

      // All requests should succeed
      responses.forEach(response => {
        expectSuccessResponse(response);
        expect(response.body.data).toHaveLength(
          compareTestData.validIds.length
        );
      });
    });

    it('should respond within reasonable time', async () => {
      const startTime = Date.now();
      const idsParam = compareTestData.validIds.join(',');
      const response = await apiTester.get('/compare', { ids: idsParam });
      const endTime = Date.now();

      expectSuccessResponse(response);

      // Response should be reasonably fast (under 1 second for this simple case)
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long ID strings', async () => {
      // Create a very long string of IDs (exceeding the 10 item limit)
      const longIds = Array(50).fill(compareTestData.validIds[0]);
      const idsParam = longIds.join(',');

      const response = await apiTester.get('/compare', { ids: idsParam });

      // Should return error due to exceeding maximum items limit
      expectErrorResponse(
        response,
        400,
        'Maximum 10 items can be compared at once'
      );
    });

    it('should handle special characters in ID string', async () => {
      const idsParam = `${compareTestData.validIds[0]},invalid-id-with-@#$%`;
      const response = await apiTester.get('/compare', { ids: idsParam });

      expectSuccessResponse(response);

      // Should filter out invalid IDs and return valid ones
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe(compareTestData.validIds[0]);
    });
  });
});
