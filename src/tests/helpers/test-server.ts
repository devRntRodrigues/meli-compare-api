import type { Application } from 'express';
import { createApp } from '@/app';
import { createContainer } from '@/config/container';
import type { Container } from '@/config/container';

export class TestServer {
  private app: Application;
  private container: Container;

  constructor() {
    this.container = createContainer();
    this.app = createApp(this.container);
  }

  getApp(): Application {
    return this.app;
  }

  getContainer(): Container {
    return this.container;
  }

  async cleanup(): Promise<void> {
    // Cleanup any resources if needed
    // For now, we don't have database connections or other resources to clean up
  }
}

export const createTestServer = (): TestServer => {
  return new TestServer();
};
