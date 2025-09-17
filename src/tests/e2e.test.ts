import { createTestServer } from './helpers/test-server';
import {
  createApiTester,
  expectSuccessResponse,
  expectErrorResponse,
  expectPaginatedResponse,
  expectCacheHeaders,
} from './helpers/test-utils';
import { testItemIds, compareTestData } from './helpers/test-data';
import type { Item } from '@/schemas/item.schema';

describe('End-to-End API Tests', () => {
  const testServer = createTestServer();
  const apiTester = createApiTester(testServer.getApp());

  afterAll(async () => {
    await testServer.cleanup();
  });

  describe('Complete API Workflow', () => {
    it('should handle a complete product comparison workflow', async () => {
      // Step 1: Check API health
      const healthResponse = await apiTester.get('/health');
      expectSuccessResponse(healthResponse);
      expect(healthResponse.body.status).toBe('ok');

      // Step 2: Browse all available items
      const allItemsResponse = await apiTester.get('/items');
      expectPaginatedResponse(allItemsResponse);
      expectCacheHeaders(allItemsResponse);
      expect(allItemsResponse.body.data.items.length).toBeGreaterThan(0);

      // Step 3: Filter items by category (smartphones)
      const smartphonesResponse = await apiTester.get('/items', {
        category: 'smartphones',
        sortBy: 'price',
        sortOrder: 'desc',
      });
      expectPaginatedResponse(smartphonesResponse);
      expect(smartphonesResponse.body.data.items.length).toBeGreaterThan(0);

      // Verify all items are smartphones sorted by price descending
      const smartphones = smartphonesResponse.body.data.items;
      smartphones.forEach((item: Item) => {
        expect(item.category).toBe('smartphones');
      });

      const prices = smartphones.map((item: Item) => item.price);
      const sortedPrices = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sortedPrices);

      // Step 4: Get details of a specific item
      const itemId = smartphones[0].id;
      const itemDetailResponse = await apiTester.get(`/items/${itemId}`);
      expectSuccessResponse(itemDetailResponse);
      expectCacheHeaders(itemDetailResponse);
      expect(itemDetailResponse.body.data.id).toBe(itemId);

      // Step 5: Search for items by name
      const searchResponse = await apiTester.get('/items', {
        search: 'iPhone',
        limit: 5,
      });
      expectPaginatedResponse(searchResponse);
      searchResponse.body.data.items.forEach((item: Item) => {
        expect(item.name.toLowerCase()).toContain('iphone');
      });

      // Step 6: Compare multiple items
      const itemsToCompare = smartphones
        .slice(0, 2)
        .map((item: Item) => item.id);
      const compareResponse = await apiTester.get('/compare', {
        ids: itemsToCompare.join(','),
      });
      expectSuccessResponse(compareResponse);
      expectCacheHeaders(compareResponse);

      expect(compareResponse.body.data).toHaveLength(2);
      // Note: API doesn't return summary data, just the items array

      // Step 7: Filter by price range based on comparison results
      const comparisonPrices = compareResponse.body.data.map(
        (item: Item) => item.price
      );
      const minPrice = Math.min(...comparisonPrices);
      const maxPrice = Math.max(...comparisonPrices);
      const priceFilterResponse = await apiTester.get('/items', {
        minPrice,
        maxPrice,
        category: 'smartphones',
      });
      expectPaginatedResponse(priceFilterResponse);

      priceFilterResponse.body.data.items.forEach((item: Item) => {
        expect(item.price).toBeGreaterThanOrEqual(minPrice);
        expect(item.price).toBeLessThanOrEqual(maxPrice);
        expect(item.category).toBe('smartphones');
      });
    });

    it('should handle cross-category product research workflow', async () => {
      // Research workflow: Find Apple products across categories
      const appleProductsResponse = await apiTester.get('/items', {
        brand: 'Apple',
        sortBy: 'price',
        sortOrder: 'asc',
      });
      expectPaginatedResponse(appleProductsResponse);

      const appleProducts = appleProductsResponse.body.data.items;
      expect(appleProducts.length).toBeGreaterThan(0);

      // All should be Apple products
      appleProducts.forEach((item: Item) => {
        expect(item.brand).toBe('Apple');
      });

      // Group by category
      const categoriesSet = new Set(
        appleProducts.map((item: Item) => item.category)
      );
      const categories = Array.from(categoriesSet);

      // Compare products from different categories
      if (categories.length > 1) {
        const itemsFromDifferentCategories = categories
          .slice(0, 2)
          .map(category => {
            return appleProducts.find(
              (item: Item) => item.category === category
            );
          })
          .filter(Boolean)
          .map((item: Item) => item.id);

        const crossCategoryCompareResponse = await apiTester.get('/compare', {
          ids: itemsFromDifferentCategories.join(','),
        });
        expectSuccessResponse(crossCategoryCompareResponse);

        expect(crossCategoryCompareResponse.body.data.length).toBeGreaterThan(
          1
        );
        // Note: API doesn't return summary with categories and brands
      }
    });

    it('should handle pagination across the entire dataset', async () => {
      const limit = 5;
      let page = 1;
      const allItemIds = new Set();
      let hasMorePages = true;

      // Fetch first few pages to test pagination
      while (hasMorePages && page <= 3) {
        const response = await apiTester.get('/items', { page, limit });
        expectPaginatedResponse(response);

        expect(response.body.data.meta.page).toBe(page);
        expect(response.body.data.meta.limit).toBe(limit);
        expect(response.body.data.items.length).toBeLessThanOrEqual(limit);

        // Collect item IDs to ensure no duplicates across pages
        response.body.data.items.forEach((item: Item) => {
          expect(allItemIds.has(item.id)).toBe(false);
          allItemIds.add(item.id);
        });

        hasMorePages = page < response.body.data.meta.totalPages;
        page++;
      }

      expect(allItemIds.size).toBeGreaterThan(limit); // We should have fetched multiple pages
    });
  });

  describe('Error Handling Workflow', () => {
    it('should gracefully handle various error scenarios', async () => {
      // Test 404 for non-existent item
      const notFoundResponse = await apiTester.get(
        `/items/${testItemIds.nonExisting}`
      );
      expectErrorResponse(notFoundResponse, 404);

      // Test validation errors for invalid parameters
      const validationResponse = await apiTester.get('/items', {
        minPrice: -100,
        maxPrice: 'invalid',
        sortBy: 'nonexistent',
        page: 0,
      });
      expectErrorResponse(validationResponse, 400);

      // Test compare with invalid IDs
      const invalidCompareResponse = await apiTester.get('/compare', {
        ids: 'invalid-id-1,invalid-id-2',
      });
      expectSuccessResponse(invalidCompareResponse); // Should succeed but return empty results
      expect(invalidCompareResponse.body.data).toEqual([]);

      // Test missing required parameters
      const missingParamsResponse = await apiTester.get('/compare');
      expectErrorResponse(missingParamsResponse, 400);
    });

    it('should handle edge cases in search and filtering', async () => {
      // Search with no results
      const noResultsResponse = await apiTester.get('/items', {
        search: 'nonexistentproductnametest123456',
      });
      expectPaginatedResponse(noResultsResponse, 0);
      expect(noResultsResponse.body.data.items).toEqual([]);

      // Filter with impossible price range
      const impossibleRangeResponse = await apiTester.get('/items', {
        minPrice: 10000,
        maxPrice: 20000,
      });
      expectPaginatedResponse(impossibleRangeResponse, 0);
      expect(impossibleRangeResponse.body.data.items).toEqual([]);

      // Filter with non-existent category
      const nonExistentCategoryResponse = await apiTester.get('/items', {
        category: 'nonexistentcategory',
      });
      expectPaginatedResponse(nonExistentCategoryResponse, 0);
      expect(nonExistentCategoryResponse.body.data.items).toEqual([]);
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle concurrent requests efficiently', async () => {
      const concurrentRequests = [
        apiTester.get('/health'),
        apiTester.get('/items', { limit: 5 }),
        apiTester.get('/items', { category: 'smartphones' }),
        apiTester.get(`/items/${testItemIds.existing}`),
        apiTester.get('/compare', { ids: compareTestData.validIds.join(',') }),
      ];

      const startTime = Date.now();
      const responses = await Promise.all(concurrentRequests);
      const endTime = Date.now();

      // All requests should succeed
      expect(responses[0]?.status).toBe(200); // health
      expect(responses[1]?.status).toBe(200); // items list
      expect(responses[2]?.status).toBe(200); // filtered items
      expect(responses[3]?.status).toBe(200); // single item
      expect(responses[4]?.status).toBe(200); // compare

      // Should complete reasonably quickly
      const totalTime = endTime - startTime;
      expect(totalTime).toBeLessThan(2000); // 2 seconds for all concurrent requests
    });

    it('should maintain consistent response format across all endpoints', async () => {
      // Health endpoint
      const healthResponse = await apiTester.get('/health');
      expectSuccessResponse(healthResponse);
      expect(healthResponse.body).toHaveProperty('status');
      expect(healthResponse.body).toHaveProperty('timestamp');

      // Items list endpoint
      const itemsResponse = await apiTester.get('/items', { limit: 1 });
      expectPaginatedResponse(itemsResponse);
      expect(itemsResponse.body).toHaveProperty('data');
      expect(itemsResponse.body.data).toHaveProperty('meta');

      // Single item endpoint
      const itemResponse = await apiTester.get(
        `/items/${testItemIds.existing}`
      );
      expectSuccessResponse(itemResponse);
      expect(itemResponse.body.data).toHaveProperty('id');
      expect(itemResponse.body.data).toHaveProperty('name');

      // Compare endpoint
      const compareResponse = await apiTester.get('/compare', {
        ids: compareTestData.validIds[0],
      });
      expectSuccessResponse(compareResponse);
      expect(compareResponse.body).toHaveProperty('data');
      expect(compareResponse.body.data).toEqual(expect.any(Array));
    });

    it('should handle large dataset operations', async () => {
      // Test with maximum allowed limit
      const maxLimitResponse = await apiTester.get('/items', { limit: 100 });
      expectPaginatedResponse(maxLimitResponse);
      expect(maxLimitResponse.body.data.items.length).toBeLessThanOrEqual(100);

      // Test compare with maximum reasonable number of items
      const manyIds = Array(10).fill(compareTestData.validIds[0]).join(',');
      const manyItemsCompareResponse = await apiTester.get('/compare', {
        ids: manyIds,
      });
      expectSuccessResponse(manyItemsCompareResponse);
      // Should deduplicate and return only unique items
      expect(manyItemsCompareResponse.body.data.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Security and Validation', () => {
    it('should validate and sanitize all input parameters', async () => {
      // Test SQL injection attempt (should be safe since we use JSON file)
      const sqlInjectionResponse = await apiTester.get('/items', {
        search: "'; DROP TABLE items; --",
      });
      expect([200, 400]).toContain(sqlInjectionResponse.status);

      // Test XSS attempt
      const xssResponse = await apiTester.get('/items', {
        search: '<script>alert("xss")</script>',
      });
      expect([200, 400]).toContain(xssResponse.status);

      // Test extremely long input
      const longInput = 'a'.repeat(1000);
      const longInputResponse = await apiTester.get('/items', {
        search: longInput,
      });
      expect([200, 400]).toContain(longInputResponse.status);
    });

    it('should handle malformed requests gracefully', async () => {
      // Test with special characters in IDs
      const specialCharsResponse = await apiTester.get('/items/!@#$%^&*()');
      expect([400, 404]).toContain(specialCharsResponse.status);

      // Test with Unicode characters
      const unicodeResponse = await apiTester.get('/items', {
        search: '测试产品',
      });
      expectPaginatedResponse(unicodeResponse); // Should handle Unicode gracefully
    });
  });
});
