import type { LoggerOptions } from 'pino';
import pino from 'pino';

import { env } from './env';

const isTest = env.NODE_ENV === 'test';

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

const testOptions: LoggerOptions = {
  ...baseOptions,
  level: 'silent',
};

const options = isTest ? testOptions : devOptions;

export const logger = pino(options);

export type Logger = typeof logger;
