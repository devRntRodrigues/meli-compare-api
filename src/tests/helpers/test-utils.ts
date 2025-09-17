import request from 'supertest';
import type { Application } from 'express';


export interface TestResponse<T = any> {
  status: number;
  body: T;
  headers: Record<string, string>;
}

export class ApiTester {
  constructor(private app: Application) {}

  async get<T = any>(path: string, query?: Record<string, unknown>, options?: { headers?: Record<string, string> }): Promise<TestResponse<T>> {
    const req = request(this.app).get(path);
    
    if (query) {
      req.query(query);
    }

    if (options?.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        req.set(key, value);
      });
    }

    const response = await req;
    return {
      status: response.status,
      body: response.body,
      headers: response.headers,
    };
  }

  async post<T = any>(path: string, data?: any): Promise<TestResponse<T>> {
    const response = await request(this.app)
      .post(path)
      .send(data);

    return {
      status: response.status,
      body: response.body,
      headers: response.headers,
    };
  }

  async put<T = any>(path: string, data?: any): Promise<TestResponse<T>> {
    const response = await request(this.app)
      .put(path)
      .send(data);

    return {
      status: response.status,
      body: response.body,
      headers: response.headers,
    };
  }

  async delete<T = any>(path: string): Promise<TestResponse<T>> {
    const response = await request(this.app).delete(path);

    return {
      status: response.status,
      body: response.body,
      headers: response.headers,
    };
  }
}

export const createApiTester = (app: Application): ApiTester => {
  return new ApiTester(app);
};

export const expectSuccessResponse = (response: TestResponse, expectedStatus = 200) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toBeDefined();
};

export const expectErrorResponse = (
  response: TestResponse,
  expectedStatus: number,
  expectedMessage?: string
) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toMatchObject({
    message: expect.any(String),
    code: expectedStatus,
    timestamp: expect.any(String),
  });

  if (expectedMessage) {
    expect(response.body.message).toContain(expectedMessage);
  }
};

export const expectValidationError = (response: TestResponse, expectedErrors?: string[]) => {
  expectErrorResponse(response, 400);
  expect(response.body.issues).toBeDefined();
  
  if (expectedErrors) {
    // Extract error messages from the treeified Zod error structure
    const extractMessages = (obj: any): string[] => {
      const messages: string[] = [];
      if (obj.errors && Array.isArray(obj.errors)) {
        messages.push(...obj.errors);
      }
      if (obj.properties) {
        Object.values(obj.properties).forEach((prop: any) => {
          messages.push(...extractMessages(prop));
        });
      }
      return messages;
    };
    
    const errorMessages = extractMessages(response.body.issues);
    expectedErrors.forEach(expectedError => {
      expect(errorMessages.some(msg => msg.includes(expectedError))).toBe(true);
    });
  }
};

export const expectPaginatedResponse = (response: TestResponse, expectedTotal?: number) => {
  expectSuccessResponse(response);
  expect(response.body).toMatchObject({
    message: expect.any(String),
    data: {
      items: expect.any(Array),
      meta: {
        page: expect.any(Number),
        limit: expect.any(Number),
        total: expect.any(Number),
        totalPages: expect.any(Number),
        hasNext: expect.any(Boolean),
        hasPrev: expect.any(Boolean),
      },
    },
    timestamp: expect.any(String),
  });

  if (expectedTotal !== undefined) {
    expect(response.body.data.meta.total).toBe(expectedTotal);
  }
};

export const expectCacheHeaders = (response: TestResponse) => {
  expect(response.headers).toMatchObject({
    etag: expect.any(String),
    'last-modified': expect.any(String),
  });
};
