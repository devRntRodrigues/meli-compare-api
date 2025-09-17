import type { Request, Response } from 'express';
import { HealthResponseSchema } from '@/schemas/response';

export class HealthController {
  handle(_req: Request, res: Response): void {
    const response = HealthResponseSchema.parse({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });

    res.json(response);
  }
}
