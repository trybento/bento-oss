import { logger, Logger as WinstonLogger } from 'src/utils/logger';

export type Level = 'info' | 'warn' | 'error' | 'debug';
export type Logger = Pick<WinstonLogger, Level>;

export const makeLogger = (jobType: string): Logger => {
  const log =
    (level: Level) =>
    (text: string | object, ...meta: any[]) =>
      logger[level](`[${jobType}] ${text}`, ...meta);

  return {
    info: log('info'),
    warn: log('warn'),
    error: log('error'),
    debug: log('debug'),
  };
};
