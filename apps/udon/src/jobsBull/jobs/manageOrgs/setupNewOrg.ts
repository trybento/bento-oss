import { FeatureFlag } from 'src/data/models/FeatureFlag.model';
import { FeatureFlagEnabled } from 'src/data/models/FeatureFlagEnabled.model';
import { Organization } from 'src/data/models/Organization.model';
import seedGlobalDefaultTemplates from 'src/interactions/library/seedGlobalDefaultTemplates';
import { JobHandler } from 'src/jobsBull/handler';
import { SetupNewOrgJob } from 'src/jobsBull/job';

/**
 * Enable feature flags and create templates
 */
const handler: JobHandler<SetupNewOrgJob> = async (job, logger) => {
  const { orgId } = job.data;

  try {
    if (!orgId) throw 'No org id provided to seed to';

    const organization = await Organization.findOne({
      where: { id: orgId },
    });

    if (!organization) throw `No organization by id ${orgId}`;

    /* Turn on the starter set of feature flags */
    const defaultFlagsForNewOrgs = await FeatureFlag.findAll({
      where: {
        enabledForNewOrgs: true,
        enabledForAll: false,
      },
      attributes: ['id'],
    });

    await FeatureFlagEnabled.bulkCreate(
      defaultFlagsForNewOrgs.map((dff) => ({
        organizationId: organization.id,
        featureFlagId: dff.id,
      })),
      { ignoreDuplicates: true, returning: false }
    );

    /* Seed in templates */
    await seedGlobalDefaultTemplates({
      targetOrganization: organization,
    });
  } catch (e: any) {
    logger.error(`[setupNewOrg] error setting up org: ${e.message}`, e);
    /* Rethrow to let handleTask handle the error */
    throw e;
  }
};

export default handler;
