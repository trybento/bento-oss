import { GuideState, SelectedModelAttrs } from 'bento-common/types';
import { isFlatTheme } from 'bento-common/data/helpers';
import { withTransaction } from 'src/data';
import { attrsFromGuideStepBase, Step } from 'src/data/models/Step.model';
import createTaggedElements from 'src/interactions/taggedElements/createTaggedElements';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import {
  GuideModuleBase,
  GuideModuleBaseModelScope,
  GuideModuleBaseWithStepBases,
} from 'src/data/models/GuideModuleBase.model';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { enableStepProgressSyncing } from 'src/utils/features';
import { createStepAutoCompleteInteractions } from './autoComplete/createStepAutoCompleteInteractions';
import { computeExpireAtBasedOnTemplate } from 'src/utils/guideExpiration';
import { JobType } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';

type CreateFromGuideBaseArgs = {
  /** Origin */
  guideBase: SelectedModelAttrs<
    GuideBase,
    | 'id'
    | 'accountId'
    | 'createdFromTemplateId'
    | 'isModifiedFromTemplate'
    | 'organizationId'
  >;
  /** What should be the new guide's state */
  state?: GuideState;
  /**
   * Launch date of the guide.
   * @default "now" when state is active, otherwise `null`
   */
  launchedAt?: Date;
  /** Whether to check for and potentially reactivate inactive guide participants */
  checkForInactiveForAccountUserId?: number;
  /** Include to prevent duplicate guides */
  accountUser?: AccountUser;
};

export default async function createGuideFromGuideBase({
  guideBase,
  state,
  launchedAt = new Date(),
  checkForInactiveForAccountUserId,
  accountUser,
}: CreateFromGuideBaseArgs): Promise<Guide> {
  return withTransaction(async () => {
    if (checkForInactiveForAccountUserId) {
      /* If we have an existing inactive guide for this account user */
      const existingGuideParticipant = await GuideParticipant.findOne({
        where: {
          accountUserId: checkForInactiveForAccountUserId,
          organizationId: guideBase.organizationId,
        },
        include: [
          {
            model: Guide,
            where: {
              createdFromGuideBaseId: guideBase.id,
              state: 'inactive',
            },
          },
        ],
      });

      if (existingGuideParticipant?.guide) {
        await existingGuideParticipant.guide.update({
          state: GuideState.active,
        });

        return existingGuideParticipant.guide;
      }
    }

    if (accountUser) {
      /* If requested, check existing guide/guideParticipant */
      const gp = await GuideParticipant.findOne({
        where: {
          accountUserId: accountUser.id,
        },
        include: [
          {
            model: Guide,
            where: {
              createdFromGuideBaseId: guideBase.id,
            },
          },
        ],
      });

      if (gp?.guide) return gp.guide;
    }

    const isActive = state === GuideState.active;
    let expireAt: Date | null = null;

    const template = await guideBase.$get('createdFromTemplate', {
      attributes: ['theme', 'expireBasedOn', 'expireAfter'],
    });

    if (!template) {
      throw new Error('Missing template associated with guide base');
    }

    if (isActive) {
      expireAt = computeExpireAtBasedOnTemplate(template, launchedAt);
    }

    const guide = await Guide.create({
      createdFromGuideBaseId: guideBase.id,
      accountId: guideBase.accountId,
      state: state || GuideState.draft,
      launchedAt: isActive ? launchedAt : null,
      expireAt,
      createdFromTemplateId: guideBase.createdFromTemplateId!,
      organizationId: guideBase.organizationId,
    });

    const guideModuleBases = (await GuideModuleBase.scope([
      GuideModuleBaseModelScope.withStepBases,
      GuideModuleBaseModelScope.byOrderIndex,
    ]).findAll({
      where: {
        guideBaseId: guideBase.id,
        shouldOnlyAddToNewGuidesDynamically: false,
      },
    })) as GuideModuleBaseWithStepBases[];

    for (const guideModuleBase of guideModuleBases) {
      const [guideModule] = await GuideModule.upsert(
        {
          createdFromGuideModuleBaseId: guideModuleBase.id,
          guideId: guide.id,
          createdFromModuleId: guideModuleBase.createdFromModuleId,
          organizationId: guideModuleBase.organizationId,
          orderIndex: guideModuleBase.orderIndex,
        },
        {
          returning: true,
          conflictFields: ['guide_id', 'created_from_module_id'] as any,
        }
      );

      const stepAttrs = guideModuleBase.guideStepBases.map((stepBase) =>
        attrsFromGuideStepBase(stepBase, {
          guideModuleId: guideModule.id,
          guideId: guide.id,
        })
      );

      const createdSteps = await Step.bulkCreate(stepAttrs, {
        ignoreDuplicates: true,
      });

      await createTaggedElements({
        steps: createdSteps,
        guide,
        organizationId: guideBase.organizationId,
      });

      await createStepAutoCompleteInteractions({ steps: createdSteps });
    }

    if (isActive) {
      const useStepSync = await enableStepProgressSyncing.enabled(
        guideBase.organizationId
      );

      /**
       * @todo ask whether we can remove the flat theme condition
       * @see https://productivitynewco.slack.com/archives/C04TRED2USX/p1702679089637419
       */
      if (accountUser && !isFlatTheme(template.theme) && useStepSync) {
        await queueJob({
          jobType: JobType.PreCompleteSteps,
          guideId: guide.id,
          accountUserId: accountUser.id,
        });
      }
    }

    return guide;
  });
}
