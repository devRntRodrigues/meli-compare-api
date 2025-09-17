import type { Request } from 'express';

// Base request interface with validated body
export interface RequestWithBody<T = Request['body']>
  extends Omit<Request, 'body'> {
  body: T;
}

// Base request interface with validated params
export interface RequestWithParams<T = Request['params']>
  extends Omit<Request, 'params'> {
  params: T;
}

// Base request interface with validated query
export interface RequestWithQuery<T = Request['query']>
  extends Omit<Request, 'query'> {
  query: T;
}

// Combined interfaces for multiple validation types
export interface RequestWithBodyAndParams<
  TBody = unknown,
  TParams = Request['params'],
> extends Omit<Request, 'body' | 'params'> {
  body: TBody;
  params: TParams;
}

export interface RequestWithQueryAndParams<
  TQuery = Request['query'],
  TParams = Request['params'],
> extends Omit<Request, 'query' | 'params'> {
  query: TQuery;
  params: TParams;
}

export interface RequestWithAll<
  TBody = Request['body'],
  TQuery = Request['query'],
  TParams = Request['params'],
> extends Omit<Request, 'body' | 'query' | 'params'> {
  body: TBody;
  query: TQuery;
  params: TParams;
}
