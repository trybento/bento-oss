import { Level, Logger, makeLogger } from 'src/jobsBull/logger';

type LogEntry = { level: Level; text: string | object };
export type MockLogger = Logger & {
  logEntries: LogEntry[];
};

/**
 * A mock utility class that wraps the Logger class of bullmq (used by async jobs).
 */
export const mockLogger = (): MockLogger => {
  const logger = makeLogger('test');
  const logEntries: LogEntry[] = [];

  const log =
    (level: Level) =>
    (text: string | object, ...meta: any[]) => {
      logEntries.push({ level, text });

      return logger[level](`${text}`, ...meta);
    };

  return {
    info: log('info'),
    warn: log('warn'),
    error: log('error'),
    debug: log('debug'),
    logEntries,
  };
};
