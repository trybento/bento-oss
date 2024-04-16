import {
  InternalFeatureFlag,
  InternalFeatureFlagOptions,
  InternalFeatureFlagStrategies,
} from 'src/data/models/Utility/InternalFeatureFlag.model';
import { FEATURE_FLAG_CACHE_TTL } from 'src/utils/constants';
import { getRedisClient } from 'src/utils/redis';
import detachPromise from '../detachPromise';
import { logger } from '../logger';
import { percentage, rateDict } from './strategies';
import { RedisConnections } from '../redis/getRedisClient';

const CHECK_INTERVAL = Number(process.env.IFF_CACHE_TTL || 2 * 60); // 2 min in seconds

const redis = getRedisClient(RedisConnections.general);

type EnabledCheckPayload = Record<string, string>;

export interface InternalFlagData {
  name: string;
  strategy: InternalFeatureFlagStrategies;
  options?: InternalFeatureFlagOptions | null;
}

export class InternalFlag {
  name: string;
  ttl: number;

  constructor(name: string, ttl?: number) {
    this.name = name;
    this.ttl = ttl || FEATURE_FLAG_CACHE_TTL;
  }

  private getCacheKey(): string {
    return `iff:${this.name}`;
  }

  /**
   * Wipes all cached flags, so we'll get the most up-to-date version from DB
   */
  public resetCache() {
    const cacheKey = this.getCacheKey();

    detachPromise(() => redis.del(cacheKey), 'clear iff cache on start');
  }

  async enabled(payload?: EnabledCheckPayload) {
    const cacheKey = this.getCacheKey();
    const cached = await redis.get(cacheKey).then((value) => {
      try {
        if (value) {
          const parsedValue = JSON.parse(value);
          return parsedValue.name && parsedValue.strategy
            ? (parsedValue as InternalFlagData)
            : null;
        }
        return null;
      } catch (innerError) {}
      return null;
    });

    const flag =
      cached ??
      (await InternalFeatureFlag.findOne({
        where: { name: this.name },
        attributes: ['strategy', 'options'],
      }));

    if (!flag) return false;

    if (!cached) {
      // cache the result for next time
      detachPromise(async () => {
        await redis.set(
          cacheKey,
          JSON.stringify({
            name: this.name,
            strategy: flag.strategy,
            options: flag.options,
          }),
          'EX',
          FEATURE_FLAG_CACHE_TTL // will expire after N seconds
        );
      }, 'cache internal feature flag');
    }

    // used to run one-off validations
    const firstRun = cached === undefined;

    switch (flag.strategy) {
      case InternalFeatureFlagStrategies.All:
        return true;

      case InternalFeatureFlagStrategies.Percentage:
        if (
          firstRun &&
          (typeof flag?.options?.percentage !== 'number' ||
            flag.options.percentage < 0 ||
            flag.options.percentage > 100)
        ) {
          logger.error(`[BENTO] flag has invalid options`, {
            flag,
          });
          return false;
        }
        return percentage(flag.options as { percentage: number });

      case InternalFeatureFlagStrategies.stringMatch: {
        if (
          firstRun &&
          (!flag.options?.stringMatch?.key || !flag.options?.stringMatch?.value)
        ) {
          logger.error(`[BENTO] env check flags require value and name`, {
            flag,
          });
          return false;
        }

        const { key, value } = flag.options!.stringMatch!;
        const valueToMatch = payload?.[key] ?? process.env[key] ?? '';

        const _values = Array.isArray(value) ? value : [value];

        return _values.some((v) => valueToMatch.includes(v));
      }
      case InternalFeatureFlagStrategies.rateDict: {
        const dict = flag.options!.rateDict;
        const key = payload?.key;

        if (!dict || !key) return false;

        return rateDict(key, dict);
      }
      case InternalFeatureFlagStrategies.None:
      default:
        return false;
    }
  }

  public async invalidateCache(): Promise<void> {
    await redis.del(this.getCacheKey());
  }
}

export function internalFeatureFlag(
  /** Name of the internal feature flag */
  name: string,
  /** Specific cache TTL in seconds, defaults to 10 minutes */
  ttl?: number,
  puntReset = false
) {
  if (ttl && ttl < CHECK_INTERVAL) {
    throw new Error(
      `Cache TTL is lower than the deletion checks interval (${CHECK_INTERVAL})`
    );
  }

  const flag = new InternalFlag(name, ttl);

  /** Reset cache on start */
  if (!puntReset) flag.resetCache();

  return flag;
}
