import * as swaggerUi from 'swagger-ui-express';
import type { RequestHandler } from 'express';
import type { OpenAPIV3 } from 'openapi-types';

export const swaggerServe = swaggerUi.serve as unknown as RequestHandler;
export const swaggerSetup = (doc: OpenAPIV3.Document): RequestHandler =>
  swaggerUi.setup(doc) as unknown as RequestHandler;
