import { createTestServer } from './helpers/test-server';
import { createApiTester, expectSuccessResponse } from './helpers/test-utils';

describe('Health Endpoint Integration Tests', () => {
  const testServer = createTestServer();
  const apiTester = createApiTester(testServer.getApp());

  afterAll(async () => {
    await testServer.cleanup();
  });

  describe('GET /health', () => {
    it('should return health status successfully', async () => {
      const response = await apiTester.get('/health');

      expectSuccessResponse(response);
      expect(response.body).toMatchObject({
        status: 'ok',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
      });
    });

    it('should return valid timestamp in ISO format', async () => {
      const response = await apiTester.get('/health');

      expectSuccessResponse(response);
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toISOString()).toBe(response.body.timestamp);
    });

    it('should return positive uptime', async () => {
      const response = await apiTester.get('/health');

      expectSuccessResponse(response);
      expect(response.body.uptime).toBeGreaterThan(0);
    });

    it('should have consistent response structure across multiple calls', async () => {
      const response1 = await apiTester.get('/health');
      const response2 = await apiTester.get('/health');

      expectSuccessResponse(response1);
      expectSuccessResponse(response2);

      // Both responses should have the same structure
      expect(Object.keys(response1.body)).toEqual(Object.keys(response2.body));

      // Uptime should increase between calls
      expect(response2.body.uptime).toBeGreaterThanOrEqual(
        response1.body.uptime
      );
    });
  });
});
