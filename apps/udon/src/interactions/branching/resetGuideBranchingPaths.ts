import { Nullable, SelectedModelAttrsPick } from 'bento-common/types';

import { queryRunner } from 'src/data';
import promises from 'src/utils/promises';
import { Guide } from 'src/data/models/Guide.model';
import { TriggeredBranchingPath } from 'src/data/models/TriggeredBranchingPath.model';
import { Step } from 'src/data/models/Step.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';
import { markGuideIncomplete, resetGuidesById } from './branching.helpers';
import InvalidRequestError from 'src/errors/InvalidRequest';
import InvalidPayloadError from 'src/errors/InvalidPayloadError';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

type ResetGuidePathArgs = {
  accountUser: AccountUser;
  guideEntityId: string;
};

/**
 * This gets the first guide branching and resets to it, but a future consideration
 * would be resetting to only the last major branching path instead of the first.
 *
 * WARNING: Since guide branching reset is treated at the Guide level, this has
 * the potential to affect multiple branching Steps within the same guide, which
 * might not be desired.
 */
export async function resetGuideBranchingPaths({
  accountUser,
  guideEntityId,
}: ResetGuidePathArgs) {
  await withSentrySpan(
    async () => {
      // get the specified or latest branching guide
      const branchingGuide = (await Guide.findOne({
        attributes: ['id'],
        where: { entityId: guideEntityId },
      })) as Nullable<SelectedModelAttrsPick<Guide, 'id'>>;

      if (!branchingGuide) {
        throw new InvalidPayloadError('No branching guide found to reset');
      }

      // Get the guides which were launched after the branching guide
      const guidesAfterBranchingGuide = await queryRunner<
        {
          id: number;
          completed: string;
          triggeredId: number | null;
          triggeredFromStepId: number | null;
        }[]
      >({
        sql: `--sql
          SELECT
            g.id AS "id",
            g.completed_at as "completed",
            tbp.id as "triggeredId",
            tbp.triggered_from_step_id as "triggeredFromStepId"
          FROM
            core.guides g
            JOIN core.templates t ON t.id = g.created_from_template_id
            JOIN core.guide_participants gp ON g.id = gp.guide_id
						-- We back-reference here to target a specific step, in case there are multiple branching steps
            LEFT JOIN core.triggered_branching_paths tbp ON g.id = tbp.created_guide_id
          WHERE
            gp.account_user_id = :accountUserId
            AND tbp.triggered_from_guide_id = :branchingGuideId
            AND t.is_side_quest = FALSE
          ORDER BY
            gp.account_user_id ASC,
            gp.created_at ASC
        `,
        replacements: {
          accountUserId: accountUser.id,
          branchingGuideId: branchingGuide.id,
        },
      });

      const resetData = guidesAfterBranchingGuide.reduce<{
        hasCompleted: boolean;
        guideIds: number[];
        stepIds: number[];
      }>(
        (a, v) => {
          if (v.completed || !v.triggeredId) a.hasCompleted = true;
          if (!!v.triggeredFromStepId) a.stepIds.push(v.triggeredFromStepId);
          if (!!v.id) a.guideIds.push(v.id);

          return a;
        },
        {
          hasCompleted: false,
          guideIds: [],
          stepIds: [],
        }
      );

      if (resetData.hasCompleted) {
        throw new InvalidRequestError(
          "Can't reset when user has completed the branching destination guides"
        );
      }

      // Find the step and reset its values
      const branchingSteps = await Step.findAll({
        where: {
          id: resetData.stepIds,
        },
      });

      // Nothing requires resetting - safe to punt
      if (!branchingSteps.length) return;

      // Inactive or delete the ones after it
      await resetGuidesById({
        accountUser,
        guideIds: resetData.guideIds,
      });

      // Destroy triggered branching action if items are removed
      const obsoleteTriggeredPaths = await TriggeredBranchingPath.findAll({
        where: {
          triggeredFromGuideId: branchingGuide.id,
        },
        attributes: ['id'],
      });

      const tbpIds = obsoleteTriggeredPaths.map((tbp) => tbp.id);

      // Remove references so they won't count when re-querying
      await TriggeredBranchingPath.update(
        {
          triggeredFromStepId: null,
        },
        {
          where: {
            id: tbpIds,
          },
        }
      );

      // Clean up branching paths later
      await queueJob({
        jobType: JobType.DeleteObjects,
        type: 'triggeredBranchingPaths',
        organizationId: accountUser.organizationId,
        objectIds: tbpIds,
      });

      // Mark each step as incomplete
      await promises.each(
        branchingSteps,
        async (branchingStep) => {
          await branchingStep.markAsIncomplete();
        },
        { concurrency: 2 }
      );

      // Mark guide as incomplete
      await markGuideIncomplete(branchingGuide.id);
    },
    {
      name: `branching.resetGuideBranchingPaths`,
      op: 'interaction',
    }
  );
}
