import { SelectedModelAttrs } from 'bento-common/types';

import promises from 'src/utils/promises';
import {
  DataUsage,
  DataUsageType,
} from 'src/data/models/Analytics/DataUsage.model';
import { Organization } from 'src/data/models/Organization.model';
import fetchAutocompletedStepsForAttribute from 'src/interactions/fetchAutocompletedStepsForAttribute';
import fetchAttributesForOrganization from 'src/interactions/targeting/fetchAttributesForOrganization';
import fetchAutolaunchedGuideBasesForAttribute from 'src/interactions/targeting/fetchAutolaunchedGuideBasesForAttribute';
import { JobHandler } from 'src/jobsBull/handler';
import { JobType, RunDataUsageCacheJob } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';
import { RollupTypeEnum, setLastRunTime } from './rollup.helpers';

/** Keep a smaller batch size because attrs can scale to users */
const BATCH_SIZE = 20;

/**
 * Queue rollups here so we can dedupe
 */
const handler: JobHandler<RunDataUsageCacheJob> = async (job, logger) => {
  const payload = job.data;

  /* No org ID means update for all */
  if (!payload.organizationId) {
    logger.debug('[runDataUsageCache] Running data usage cache for all orgs');
    await queueDataFetchForAllOrgs();

    /* Not entire accurate but will indicate activity and create the row */
    await setLastRunTime(RollupTypeEnum.DataUsageRollups);
    return;
  }

  await updateDataUsageCacheForOrg(payload.organizationId, payload.offset);
};

const updateDataUsageCacheForOrg = async (
  organizationId: number,
  offset = 0
) => {
  const organization = (await Organization.findOne({
    attributes: ['id'],
    where: { id: organizationId },
  })) as SelectedModelAttrs<Organization, 'id'>;

  if (!organization) return;

  const attrs = await fetchAttributesForOrganization(
    {
      organization,
      /* Only handle the "default" attrs on the first set */
      fullList: offset === 0,
    },
    {
      limit: BATCH_SIZE,
      offset,
    }
  );

  await promises.each(attrs, async (attr) => {
    const autocompletes = await fetchAutocompletedStepsForAttribute({
      attributeName: attr.name,
      organization,
    });

    const autolaunches = await fetchAutolaunchedGuideBasesForAttribute({
      attribute: attr,
      organization,
    });

    const coreData = {
      name: attr.name,
      type: DataUsageType.attribute,
      scope: attr.type!,
      organizationId,
    };

    const usageData = {
      autocompletes,
      autolaunches,
    };

    /* Really wish bulkCreate or upsert worked well */
    const [usage, isNew] = await DataUsage.findOrCreate({
      where: coreData,
      defaults: { ...coreData, ...usageData },
    });

    if (!isNew) await usage.update(usageData);
  });

  if (attrs.length >= BATCH_SIZE)
    await queueJob({
      jobType: JobType.RunDataUsageCache,
      organizationId,
      offset: offset + BATCH_SIZE,
    });
};

/** Sub-queue jobs for each individual org to prevent immense tasks */
const queueDataFetchForAllOrgs = async () => {
  const orgs = await Organization.scope('active').findAll();

  await promises.each(orgs, (org) =>
    queueJob({
      jobType: JobType.RunDataUsageCache,
      organizationId: org.id,
    })
  );
};

export default handler;
