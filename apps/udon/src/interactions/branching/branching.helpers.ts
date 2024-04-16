import { groupBy } from 'lodash';

import {
  GuideCompletionState,
  Nullable,
  SelectedModelAttrsPick,
} from 'bento-common/types';

import { guideBaseChanged, guideChanged } from 'src/data/events';
import promises from 'src/utils/promises';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { Step } from 'src/data/models/Step.model';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { Guide } from 'src/data/models/Guide.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { TriggeredBranchingAction } from 'src/data/models/TriggeredBranchingAction.model';
import { TriggeredBranchingPath } from 'src/data/models/TriggeredBranchingPath.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { DeleteLevel } from 'src/jobsBull/jobs/guideDeletion/helpers';
import { logger } from 'src/utils/logger';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';

/**
 * Deactivating a guide means to remove it and its guideBase if empty,
 *   but preserve progress and mark as inactive if there's activity
 */
export const resetGuidesById = async ({
  accountUser,
  guideIds,
}: {
  accountUser: AccountUser;
  guideIds: number[];
}) =>
  withSentrySpan(
    async () => {
      const guidesToDeactivate = await Guide.findAll({
        where: {
          id: guideIds,
        },
        include: [
          GuideBase,
          {
            model: Step,
            attributes: ['id', 'completedAt'],
          },
        ],
      });

      const guideParticipantsToDeactivate = await GuideParticipant.findAll({
        where: {
          guideId: guideIds,
        },
      });

      const guideParticipantsToDeactivateByGuideId = groupBy(
        guideParticipantsToDeactivate,
        'guideId'
      );

      /** Go through all and reset them depending on status */
      await promises.each(
        guidesToDeactivate,
        async (guide) => {
          const guideParticipants =
            guideParticipantsToDeactivateByGuideId[guide.id];
          if (!guideParticipants)
            throw new Error('Guide participants not found');

          const otherGuideParticipants = guideParticipants.filter(
            (participant) => participant.accountUserId !== accountUser.id
          );
          const isUserSoleGuideParticipant =
            otherGuideParticipants.length === 0;

          const guideBase = guide.createdFromGuideBase;

          if (!guideBase) throw new Error('Guide base not found');

          if (isUserSoleGuideParticipant) {
            // User guide or account guide with one participant
            await guide.destroy();

            await queueJob({
              jobType: JobType.DeleteGuides,
              organizationId: accountUser.organizationId,
              deleteLevel: DeleteLevel.Guide,
              deleteObjectId: guide.id,
            });
          } else {
            // Account guide with multiple participants
            await GuideParticipant.destroy({
              where: {
                guideId: guide.id,
                accountUserId: accountUser.id,
              },
            });
          }

          const guideOfGuideBase = await Guide.findOne({
            where: {
              createdFromGuideBaseId: guideBase.id,
            },
            attributes: ['id'],
          });

          logger.debug(
            `[resetGuidesById] gb has guides after delete: ${!!guideOfGuideBase}`
          );

          if (!guideOfGuideBase) {
            /** No longer has child guides, destroy it */
            await guideBase.destroy();

            await queueJob({
              jobType: JobType.DeleteGuides,
              organizationId: accountUser.organizationId,
              deleteLevel: DeleteLevel.GuideBase,
              deleteObjectId: guideBase.id,
            });
          }
        },
        {
          concurrency: 2,
        }
      );
    },
    {
      name: 'branching.resetGuidesById',
      op: 'interaction',
    }
  );

/**
 * @todo consider moving this closer to where it is being used
 */
export const markGuideIncomplete = async (guideId: number) => {
  return Promise.all([
    Guide.update(
      {
        completionState: GuideCompletionState.incomplete,
        completedAt: null,
        doneAt: null,
      },
      {
        where: {
          id: guideId,
        },
      }
    ),
    GuideParticipant.update(
      {
        doneAt: null,
      },
      {
        where: {
          guideId,
        },
      }
    ),
  ]);
};

/**
 * If this guide module was spawned from branching, find out which guide module it branched from
 * Should call only when we confirmed the guide module us dynamically added, otherwise won't check
 * @returns id of source guide module, but -1 if unknown
 */
export const getOriginGuideModuleId = async (guideModule: GuideModule) => {
  let sourceStepId: number | undefined;
  // We use createdGuideModuleBaseId because before Oct we didn't store createdGuideModuleId
  const triggeredBranchingAction = await TriggeredBranchingAction.findOne({
    where: {
      createdGuideModuleBaseId: guideModule.createdFromGuideModuleBaseId!,
    },
  });

  let triggeredBranchingPath: TriggeredBranchingPath | null;
  if (!triggeredBranchingAction) {
    triggeredBranchingPath = await TriggeredBranchingPath.findOne({
      where: { createdGuideModuleId: guideModule.id },
    });
    sourceStepId = triggeredBranchingPath?.triggeredFromStepId;
  } else if (triggeredBranchingAction) {
    /* TBA is now legacy and deprecated. We may need to migrate if we care about preserving older guides */
    sourceStepId = triggeredBranchingAction.triggeredFromStepId;
  }

  if (!sourceStepId) return -1;

  const step = await Step.findOne({
    where: { id: sourceStepId },
  });

  if (!step) return -1;

  // In the future this should also return the branching path's orderIndex.
  // However we don't have that now for legacy
  // We can change that once legacy is RIP
  return step.guideModuleId;
};

export async function destroyGuideModuleBaseAndAssociatedRecords({
  guideModuleBase,
}) {
  if (!guideModuleBase) return;

  const { organizationId } = guideModuleBase;

  const guideBase = (await GuideBase.findOne({
    where: {
      id: guideModuleBase.guideBaseId,
    },
    attributes: ['entityId'],
  })) as Nullable<SelectedModelAttrsPick<GuideBase, 'entityId'>>;

  if (!guideBase) {
    throw new Error('Guide base not found');
  }

  const guideModules = (await GuideModule.findAll({
    where: {
      createdFromGuideModuleBaseId: guideModuleBase.id,
    },
    attributes: ['id', 'guideId', 'organizationId'],
    include: [{ model: Guide, attributes: ['entityId'] }],
  })) as Array<
    SelectedModelAttrsPick<GuideModule, 'id' | 'guideId' | 'organizationId'> & {
      guide: SelectedModelAttrsPick<Guide, 'entityId'>;
    }
  >;

  const guideEntityIds = guideModules.reduce<Set<string>>((a, guideModule) => {
    a.add(guideModule.guide.entityId);

    return a;
  }, new Set());

  await destroyGuideModuleAndAssociatedRecords({
    guideModules,
    organizationId,
  });

  guideEntityIds.forEach((entityId) => {
    guideChanged(entityId);
  });

  const obsoleteGsb = await GuideStepBase.findAll({
    where: {
      guideModuleBaseId: guideModuleBase.id,
      organizationId,
    },
    attributes: ['id'],
  });

  const obsoleteGsbIds = obsoleteGsb.map((gsb) => gsb.id);

  await GuideStepBase.destroy({
    where: {
      id: obsoleteGsbIds,
    },
  });

  await queueJob({
    jobType: JobType.DeleteObjects,
    type: 'guideStepBase',
    objectIds: obsoleteGsbIds,
    organizationId,
  });

  await guideModuleBase.destroy();

  guideBaseChanged(guideBase.entityId);
}

export async function destroyGuideModuleAndAssociatedRecords({
  guideModules,
  organizationId,
}: {
  guideModules: SelectedModelAttrsPick<GuideModule, 'id'>[];
  organizationId: number;
}) {
  const gmIds = guideModules.map((gm) => gm.id);
  await GuideModule.destroy({
    where: {
      id: gmIds,
      organizationId,
    },
  });

  await queueJob({
    jobType: JobType.DeleteObjects,
    type: 'guideModule',
    organizationId: organizationId,
    objectIds: gmIds,
  });
}
