import type { LoggerOptions } from 'pino';
import pino from 'pino';

import { env } from './env';

const isTest = env.NODE_ENV === 'test';
const isProd = env.NODE_ENV === 'production';

const baseOptions: LoggerOptions = {
  level: 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: label => {
      return { level: label };
    },
    log: object => {
      return object;
    },
  },
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
};

// In development environment, we should log everything in a pretty format
const devOptions: LoggerOptions = {
  ...baseOptions,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      messageFormat: '{msg}',
      errorLikeObjectKeys: ['err', 'error'],
      errorProps: 'message,stack,code,type',
      levelFirst: true,
    },
  },
};

// In test environment, we should not log anything
const testOptions: LoggerOptions = {
  ...baseOptions,
  level: 'silent',
};

// In production, logs should be in JSON for easier parsing by observability tools, and we should redact sensitive data
const prodOptions: LoggerOptions = {
  ...baseOptions,
  level: 'info',
  formatters: {
    level: (label, number) => {
      return {
        level: label,
        levelValue: number,
      };
    },
    log: object => {
      return {
        ...object,
        environment: env.NODE_ENV,
        service: 'meli-compare-api',
      };
    },
  },
  redact: {
    paths: [
      'password',
      'secret',
      'token',
      'authorization',
      'cookie',
      'req.headers.authorization',
      'req.headers.cookie',
    ],
    censor: '[REDACTED]',
  },
};

const options = isTest ? testOptions : isProd ? prodOptions : devOptions;

export const logger = pino(options);

export type Logger = typeof logger;
