import type { Request, Response, NextFunction } from 'express';

export interface CacheService {
  generateETag(): string;
  getLastModified(): Date;
}

export interface RequestWithCache extends Request {
  cacheService?: CacheService;
}

export function cacheHeaders(cacheService: CacheService) {
  return (req: RequestWithCache, res: Response, next: NextFunction): void => {
    const etag = cacheService.generateETag();
    const lastModified = cacheService.getLastModified();

    req.cacheService = cacheService;

    res.set('ETag', etag);
    res.set('Last-Modified', lastModified.toUTCString());

    const clientETag = req.get('If-None-Match');
    const clientLastModified = req.get('If-Modified-Since');

    if (clientETag === etag) {
      res.status(304).end();
      return;
    }

    if (clientLastModified) {
      const clientDate = new Date(clientLastModified);
      if (clientDate >= lastModified) {
        res.status(304).end();
        return;
      }
    }

    next();
  };
}

/**
 * Helper function to create a cache middleware with specific configurations
 */
export function createCacheMiddleware(options: {
  generateETag: () => string;
  getLastModified: () => Date;
}) {
  return cacheHeaders({
    generateETag: options.generateETag,
    getLastModified: options.getLastModified,
  });
}
