import { RateLimiterRedis } from 'rate-limiter-flexible';

import { getRedisClient } from 'src/utils/redis';
import { RedisConnections } from 'src/utils/redis/getRedisClient';

const apiEventDebuggerRateLimiter = new RateLimiterRedis({
  points: 1,
  duration: 10, // seconds
  storeClient: getRedisClient(RedisConnections.general),
  keyPrefix: 'api:debug',
});

/** Rate limit writing segment information */
export const consumeApiEventDebugger = async (
  organizationId: number,
  eventName: string
): Promise<boolean> => {
  try {
    await apiEventDebuggerRateLimiter.consume(
      `${organizationId}:${eventName}`,
      1
    );
    return true;
  } catch (_rateLimiterError) {
    return false;
  }
};
