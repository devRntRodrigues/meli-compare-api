import { createApp } from './app';
import { createContainer } from '@/config/container';
import { env } from '@/config/env';

const container = createContainer();
const app = createApp(container);

const server = app.listen(env.PORT, () => {
  container.logger.info(`Server running on port ${env.PORT}`);
  container.logger.info(`API documentation available at http://localhost:${env.PORT}/api-docs`);
});

process.on('SIGTERM', () => {
  container.logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    container.logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  container.logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    container.logger.info('Process terminated');
    process.exit(0);
  });
});
