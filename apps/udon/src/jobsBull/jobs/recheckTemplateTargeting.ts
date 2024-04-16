import { withTransaction } from 'src/data';
import { Template } from 'src/data/models/Template.model';
import { triggerAvailableGuidesChangedForGuideBases } from 'src/data/eventUtils';
import { recheckTemplateTargetingForExistingAccounts } from '../../interactions/targeting/recheckTemplateTargetingForExistingAccounts';
import { JobHandler } from '../handler';
import { RecheckTemplateTargetingJob } from '../job';

/**
 * Check current guide bases to see if more users match the new targeting
 * this is a side effect of targeting rule changes and thus shouldn't block them
 *
 * TODO: update to check who is currently on socket, then launch only for them
 *   so they will receive the guide in real time. see #3881
 */
const handler: JobHandler<RecheckTemplateTargetingJob> = async (
  job,
  logger
) => {
  await withTransaction(async () => {
    const payload = job.data;
    const { organizationId, templateId } = payload;

    const template = await Template.findOne({
      where: { id: templateId, organizationId },
    });

    if (!template) return;

    logger.debug(
      `[recheckTemplateTargeting] Handling rechecks for ${template.entityId}`
    );

    const relaunchedGuideBases =
      await recheckTemplateTargetingForExistingAccounts({
        template,
      });

    if (relaunchedGuideBases.length > 0)
      triggerAvailableGuidesChangedForGuideBases(relaunchedGuideBases);
  });
};

export default handler;
