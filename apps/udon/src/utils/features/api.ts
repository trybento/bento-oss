import { SelectedModelAttrs } from 'bento-common/types';

import { FEATURE_FLAG_CACHE_TTL } from '../constants';
import { getRedisClient } from 'src/utils/redis';
import { InternalFlag } from 'src/utils/internalFeatures/api';
import { Organization } from 'src/data/models/Organization.model';
import detachPromise from 'src/utils/detachPromise';
import fetchSpecificFeatureFlags from 'src/interactions/fetchSpecificFeatureFlags';
import { RedisConnections } from '../redis/getRedisClient';
import { extractId } from '../helpers';

export const allFlags: FlagData[] = [];
export const flagLookup: Record<string, FlagImpl> = {};

export interface FlagData {
  name: string;
  sendToAdmin: boolean;
  sendToEmbeddable: boolean;
  alias?: FlagData;
  enabled(
    org: SelectedModelAttrs<Organization, 'id'> | number
  ): Promise<boolean>;
}

type FlagOpts = {
  admin?: boolean;
  embed?: boolean;
  alias?: FlagData;
  internalFlag?: InternalFlag;
  /**
   * Keep a FF but leave it permanently in one state despite the setting
   *
   * Note: this may be confusing to see when altering from the DB. Only use for cases
   *   where we want to disable but may think we'll bring back the feature after some
   *   soon-ish follow-up
   */
  override?: boolean;
};

const redis = getRedisClient(RedisConnections.general);

class FlagImpl {
  name: string;
  sendToAdmin: boolean;
  sendToEmbeddable: boolean;
  alias?: FlagData;
  internalFlag?: InternalFlag;
  override?: boolean;

  constructor(
    name: string,
    { admin = true, embed = true, alias, internalFlag, override }: FlagOpts = {}
  ) {
    this.name = name;
    this.sendToAdmin = admin;
    this.sendToEmbeddable = embed;
    this.alias = alias;
    this.internalFlag = internalFlag;
    this.override = override;
  }

  async isInternalFlagEnabled() {
    if (this.internalFlag) {
      return this.internalFlag.enabled();
    }
    return true;
  }

  private getName(): string {
    return this.alias?.name || this.name;
  }

  private getCacheKey(
    organization: number | SelectedModelAttrs<Organization, 'id'>
  ): string {
    return `ff:${extractId(organization)}:${this.getName()}`;
  }

  async enabled(organization: SelectedModelAttrs<Organization, 'id'> | number) {
    if (!(await this.isInternalFlagEnabled())) {
      return false;
    }

    if (this.override !== undefined) return this.override;

    const name = this.alias?.name || this.name;
    const cacheKey = this.getCacheKey(organization);
    const cached = await redis.get(cacheKey);

    if (cached === null) {
      // if cache is missing
      const enabled = (
        await fetchSpecificFeatureFlags(organization, [name])
      ).includes(name);

      // cache the result for next time
      detachPromise(async () => {
        await redis.set(
          cacheKey,
          String(enabled),
          'EX',
          FEATURE_FLAG_CACHE_TTL // will expire after N seconds
        );
      }, 'cache org feature flag');

      return enabled;
    }

    return typeof cached === 'string' ? cached === 'true' : cached;
  }
}

export function featureFlag(name: string, opts?: FlagOpts): FlagData {
  const flag = new FlagImpl(name, opts);
  allFlags.push(flag);
  flagLookup[flag.name] = flag;
  return flag;
}

export async function filterFeatureFlags(
  flags: string[],
  client: 'server' | 'embed' | 'admin'
) {
  const enabledFlags: string[] = [];
  for (const name of flags) {
    const flag = flagLookup[name];
    if (!flag || !(await flag.isInternalFlagEnabled())) {
      continue;
    }
    if (
      client === 'server' ||
      (client === 'admin' && flag.sendToAdmin) ||
      (client === 'embed' && flag.sendToEmbeddable)
    ) {
      enabledFlags.push(name);
    }
  }
  return enabledFlags;
}
