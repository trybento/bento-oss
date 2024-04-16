import { logger } from 'src/utils/logger';
import { randomInt } from './helpers';

/** Run an async method in wrapper to see how long it takes */
const withPerfTimer = async <T>(
  label: string,
  cb: (count: () => {}) => Promise<T>,
  doneHook?: (time: number) => void
) => {
  const start = Date.now();
  const name = `[${label}-#${randomInt(1000, 9999)}]-perf:`;

  let count = 0;
  const ret = await cb(() => count++);

  const timeTaken = Date.now() - start;

  logger.debug(
    `${name} completed with in ${timeTaken}ms ${
      count > 0 ? `, counted ${count}x` : ''
    }`
  );

  if (doneHook) doneHook(timeTaken);
  return ret;
};

export default withPerfTimer;
