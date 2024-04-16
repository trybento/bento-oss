import { createLogger, format, Logger, transports } from 'winston';
import { IS_DEPLOYED, IS_DEVELOPMENT, IS_TEST } from '../constants';

const LOG_FILTER_WORDS = process.env.LOG_FILTER_WORDS
  ? process.env.LOG_FILTER_WORDS.split(',')
  : null;

/**
 * Intended for dev only: allow filtering out logs by words to
 *   reduce clutter in the terminal and make it easier to parse the
 *   info you want.
 * Don't use in production - we don't want to iterate and
 *   string parse for every log call there.
 */
const suppressFilteredLogs = format((info) => {
  if (info.message?.length === 0) return false;
  if (
    IS_DEVELOPMENT &&
    LOG_FILTER_WORDS &&
    LOG_FILTER_WORDS.some((fw) => info.message?.includes(fw))
  )
    return false;

  return info;
});

const createFormat = () => {
  if (IS_DEPLOYED) {
    return format.combine(format.json());
  } else {
    return format.combine(
      format.colorize(),
      format.simple(),
      suppressFilteredLogs()
    );
  }
};

const level = IS_DEPLOYED ? 'info' : IS_TEST ? 'warn' : 'debug';

export const logger: Logger = createLogger({
  level,
  format: format.json(),
  transports: [
    new transports.Console({
      format: createFormat(),
      handleExceptions: true,
      handleRejections: true,
      level,
    } as transports.ConsoleTransportOptions),
  ],
});

const ignored = new Set();

const addIgnoredMessages = () => {
  /* Dev process not restarting cleanly sometimes creating a lot of noise.
   * If it's actually a problem we should see other errors and it throws into a loop
   */
  if (IS_DEVELOPMENT) {
    ignored.add('IPC channel is already disconnected');
    ignored.add('Channel closed');
  }
};

/* This won't prevent a crash, just throw a log */
process.on('uncaughtExceptionMonitor', (error) => {
  if (error.message && ignored.has(error.message)) return;

  error.message = `[uncaught] ${error.message}`;
  logger.error('Uncaught exception', error);
  console.error('Uncaught exception', error);

  /* Exit on unhandled so we don't spam the terminal with channel errors */
  if (IS_DEVELOPMENT) process.exit(1);
});

addIgnoredMessages();
