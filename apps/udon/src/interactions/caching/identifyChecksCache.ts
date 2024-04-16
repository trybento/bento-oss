import { v1 as uuidv1 } from 'uuid';
import { AtLeast } from 'bento-common/types';

import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { getRedisClient } from 'src/utils/redis';
import { IDENTIFY_CHECK_CACHE_TTL } from 'src/utils/constants';
import { Organization } from 'src/data/models/Organization.model';
import { RedisConnections } from 'src/utils/redis/getRedisClient';
import { extractId } from 'src/utils/helpers';
import detachPromise from 'src/utils/detachPromise';
import { logger } from 'src/utils/logger';

const CACHE_KEY_ATTRIBUTE = 'launchingCacheKey';

const IDENTIFY_CHECK_CACHE_HIT_METRIC = 'bento.identifyCheck.cache'; // name of the metric within DD

const redis = getRedisClient(RedisConnections.general);

export const getCacheKey = (
  cacheable: AtLeast<Account, 'id'> | AtLeast<AccountUser, 'id'>
) => {
  if (cacheable instanceof Account) {
    return `identifyCheck:a:${cacheable.id}`;
  }
  return `identifyCheck:au:${cacheable.id}`;
};

/**
 * Invalidates the launching cache for an organization.
 * NOTE: Prefer running this async whenever possible. See {@link invalidateLaunchingCacheForOrgAsync}.
 *
 * @todo unit test that invalidation works
 */
export const invalidateLaunchingCacheForOrg = async (
  organization: number | AtLeast<Organization, 'id'>,
  contextName?: string
): Promise<void> => {
  const orgId = extractId(organization);
  logger.info(
    `Invalidating launching cache for org #${orgId} (context: ${
      contextName || 'unknown'
    })`
  );
  await Organization.update(
    { [CACHE_KEY_ATTRIBUTE]: uuidv1() },
    { where: { id: orgId } }
  );
};

export const invalidateLaunchingCacheForOrgAsync = (
  organization: number | AtLeast<Organization, 'id'>,
  contextName?: string
) => {
  detachPromise(
    () => invalidateLaunchingCacheForOrg(organization, contextName),
    `[${contextName ?? 'unknown'}] invalidate launching cache`
  );
};

export const invalidateLaunchingCacheForAccountAndUser = async (
  account: AtLeast<Account, 'id'>,
  accountUser: AtLeast<AccountUser, 'id'>
) => {
  const pipeline = redis.pipeline();
  // remove the account key
  pipeline.del(getCacheKey(account));
  // remove the account user key
  pipeline.del(getCacheKey(accountUser));
  // optimistically execute the pipeline
  await pipeline.exec();
};

export const invalidateLaunchingCacheForOrgs = async (orgIds: number[]) => {
  const orgs = await Organization.findAll({ where: { id: orgIds }, raw: true });
  await Organization.bulkCreate(
    orgs.map((o) => ({ ...o, [CACHE_KEY_ATTRIBUTE]: uuidv1() })),
    { updateOnDuplicate: [CACHE_KEY_ATTRIBUTE], returning: false }
  );
};

export const getLaunchingCacheKey = (
  cacheable: AtLeast<Organization, 'launchingCacheKey'>
): string => {
  return cacheable?.[CACHE_KEY_ATTRIBUTE];
};

/** Determine whether to use cache or not */
export const isCacheHit = async (
  organization: AtLeast<
    Organization,
    'id' | 'slug' | 'entityId' | 'launchingCacheKey'
  >,
  cacheable: Account | AccountUser,
  attributesChanged: boolean
): Promise<boolean> => {
  let cacheHit = false;

  if (!attributesChanged) {
    const cacheKey = await redis.get(getCacheKey(cacheable));
    cacheHit = organization.launchingCacheKey === cacheKey;
  }

  return cacheHit;
};

export const recordCache = async (
  organization: Organization,
  cacheable: Account | AccountUser
): Promise<void> => {
  await redis.set(
    getCacheKey(cacheable),
    getLaunchingCacheKey(organization),
    'EX',
    IDENTIFY_CHECK_CACHE_TTL // will expire after N seconds
  );
};
