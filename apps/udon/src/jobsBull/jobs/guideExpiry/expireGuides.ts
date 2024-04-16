import { Op, Sequelize } from 'sequelize';
import { groupBy } from 'lodash';
import { GuideState } from 'bento-common/types';

import { JobHandler } from 'src/jobsBull/handler';
import { Logger } from 'src/jobsBull/logger';
import { Guide } from 'src/data/models/Guide.model';
import { invalidateLaunchingCacheForOrgs } from 'src/interactions/caching/identifyChecksCache';

export const expireGuides = async (_payload: unknown, logger: Logger) => {
  // Find all active guides that are still incomplete, were created from an expirable template
  // and belongs to an organization that is active
  const guidesToExpire = await Guide.scope([
    'active',
    'incomplete',
    'ofActiveOrganization',
    'ofExpirableTemplate',
  ]).findAll({
    where: {
      expireAt: {
        [Op.lte]: Sequelize.fn('NOW'),
      },
    },
    attributes: ['id'],
  });

  if (!guidesToExpire.length) {
    logger.info('Found no guides to expire');
    return;
  }

  // NOTE: We perform the findAll vs update separately here because Sequelize wasn't really
  // capable of querying the associated models within the update statement
  const [expiredRows, expiredGuides] = await Guide.update(
    {
      state: GuideState.expired,
    },
    {
      where: {
        id: guidesToExpire.map((g) => g.id),
      },
      returning: ['id', 'organization_id'] as any,
    }
  );

  logger.info(`Expired ${expiredRows} guides in total`);

  const expiredGuidesByOrgId = groupBy(expiredGuides, 'organizationId');

  const affectedOrgIds = Object.keys(expiredGuidesByOrgId);

  affectedOrgIds.forEach((orgId) => {
    logger.info(
      `Expired ${expiredGuidesByOrgId[orgId].length} guides within org #${orgId}`
    );
  });

  // invalidate launching cache for affected orgs
  await invalidateLaunchingCacheForOrgs(affectedOrgIds.map((id) => Number(id)));
};

const handler: JobHandler<unknown> = async (job, logger) => {
  await expireGuides(job.data, logger);
};

export default handler;
