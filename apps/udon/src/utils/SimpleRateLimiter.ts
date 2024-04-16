import { RateLimiterRedis, IRateLimiterOptions } from 'rate-limiter-flexible';

import { getRedisClient } from 'src/utils/redis';
import { RedisConnections } from './redis/getRedisClient';

const storeClient = getRedisClient(RedisConnections.general);

/**
 * Wrapper around RateLimiterRedis to make it dead simple
 *   and just return T/F  without the try/catch setup
 */
export default class SimpleRateLimiter {
  limiter: RateLimiterRedis;
  constructor(opts: IRateLimiterOptions) {
    this.limiter = new RateLimiterRedis({
      ...opts,
      storeClient,
    });
  }

  public async check(key: string): Promise<boolean> {
    try {
      await this.limiter.consume(key);
      return true;
    } catch {
      return false;
    }
  }
}
