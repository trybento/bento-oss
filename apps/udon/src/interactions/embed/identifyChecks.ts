import { getRedisClient } from 'src/utils/redis';
import { logger } from 'src/utils/logger';
import { RedisConnections } from 'src/utils/redis/getRedisClient';

const redis = getRedisClient(RedisConnections.general);

export const getIdentifyCheckKey = (checkId: string) => {
  return `identifyCheck:job:${checkId}`;
};

export const recordIdentifyCheckFinished = async (
  checkId: string | undefined
) => {
  try {
    if (checkId) {
      /**
       * WARNING: Since this is a pipeline, the order of operations here do matter
       * and will ultimately impact the assertion that is made within the `exec`
       * command below.
       */
      const pipeline = redis.pipeline();
      pipeline.exists(getIdentifyCheckKey(checkId));
      pipeline.set(
        getIdentifyCheckKey(checkId),
        1,
        'EX',
        2 * 60 // expires in 2min since this is high-traffic,
      );
      await pipeline.exec().then((results) => {
        // throw first error
        const errs = results.map((tuple) => tuple[0]).filter(Boolean);
        if (errs.length > 0) throw errs[0];
        // warn if key was already there
        if (results[0][1] === 1) {
          logger.warn(
            `[recordIdentifyCheckFinished] conflicting checkId key found: ${checkId}`
          );
        }
      });
    }
  } catch (innerError) {
    logger.error(
      `Failed to record finished identify check #${String(checkId)}`
    );
  }
};
