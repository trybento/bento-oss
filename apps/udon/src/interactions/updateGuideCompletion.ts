import {
  GuideCompletionState,
  GuideTypeEnum,
  SelectedModelAttrs,
  StepType,
} from 'bento-common/types';
import { isFlowGuide } from 'bento-common/utils/formFactor';

import { QueryDatabase, queryRunner } from 'src/data';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { Template } from 'src/data/models/Template.model';
import { User } from 'src/data/models/User.model';
import { queueIdentifyChecks } from 'src/jobsBull/jobs/handleIdentifyChecks/identifyChecks.helpers';
import detachPromise from 'src/utils/detachPromise';
import { invalidateLaunchingCacheForAccountAndUser } from './caching/identifyChecksCache';
import recordGuideCompletion from './recordEvents/recordGuideCompletion';

type Args<G extends Guide> = {
  accountUser?: AccountUser;
  user?: User;
  guide: G & {
    createdFromTemplate: SelectedModelAttrs<Template, 'formFactor'>;
  };
  timestamp: Date;
};

type QueryRow = {
  stepId: number;
  stepType: StepType;
  skippedAt?: Date;
};

/**
 * Check if guide is complete
 * If not, check if it's done (incomplete steps are optional)
 *
 * A guide can be "done" for a user and allow them to move on if:
 * - For user guides: required steps are complete, optional are complete or skipped
 * - For account guides: all steps are completed or skipped
 *
 * A guide is "complete" if:
 * - All steps are completed
 *
 *
 * @todo unit test that skipping a Step within a flow marks it as done
 */
export async function updateGuideCompletion<G extends Guide = Guide>({
  accountUser,
  guide,
  user,
  timestamp = new Date(),
}: Args<G>) {
  const incompleteStepsInGuide = (await queryRunner({
    sql: `--sql
      SELECT
        s.id as "stepId",
        sp.step_type AS "stepType",
        -- additional columns we want if looking for step participants
        spp.skipped_at AS "skippedAt"
      FROM
        core.steps s
        JOIN core.step_prototypes sp ON sp.id = s.created_from_step_prototype_id
        JOIN core.guide_modules gm ON s.guide_module_id = gm.id
        JOIN core.guides g ON g.id = gm.guide_id
        -- join with step participants if account user is given
        LEFT JOIN core.step_participants spp ON (
          spp.step_id = s.id 
          AND spp.account_user_id = :accountUserId
        )
      WHERE
        g.id = :guideId
				AND gm.deleted_at IS NULL
        AND s.completed_at IS NULL
    `,
    replacements: {
      accountUserId: accountUser?.id || 0,
      guideId: guide.id,
    },
    queryDatabase: QueryDatabase.primary,
  })) as QueryRow[];

  const template = await guide.$get('createdFromTemplate', {
    attributes: ['type'],
  });

  if (!template) {
    throw new Error('Missing template associated with guide');
  }

  const isAccountGuide = template.type === GuideTypeEnum.account;
  const guideParticipant = await getGuideParticipant(guide.id, accountUser?.id);

  const allStepsComplete = incompleteStepsInGuide.length === 0;

  const isGuideMarkedComplete = !!guide.completedAt;

  /*
   * If the steps are all complete, we are complete
   * If we are complete, we are done
   */
  if (allStepsComplete || isGuideMarkedComplete) {
    await updateGuideComplete({
      guide,
      timestamp: allStepsComplete ? timestamp : null,
    });

    if (allStepsComplete) {
      detachPromise(
        () => recordGuideCompletion({ accountUser, guide, user }),
        'updateGuideCompletion: recordGuideCompletion'
      );
      if (isAccountGuide) {
        await markGuideParticipantsDone({ guide, timestamp });
      } else if (guideParticipant && !guideParticipant.doneAt) {
        await updateGuideParticipantDone({
          guideParticipant,
          timestamp,
        });
      }

      if (accountUser) {
        detachPromise(async () => {
          const account = await accountUser.$get('account', {
            attributes: ['entityId', 'id'],
          });

          if (!account) return;

          // first invalidate associated cache
          await invalidateLaunchingCacheForAccountAndUser(account, accountUser);

          // then queue an identify check to launch associated guides (i.e. on guide completed)
          await queueIdentifyChecks({
            behavior: {
              checkAccounts: true,
              checkAccountUsers: true,
              recordAttributes: false, // nothing
              accountChanged: false, // has
              accountUserChanged: false, // changed
              emitSocketEvents: true, // emit socket events to notify the client
            },
            accountEntityId: account.entityId,
            accountUserEntityId: accountUser.entityId,
          });
        }, '[updateGuideCompletion] invalidating cache and queueing identify');
      }
    }

    return guide;
  }

  const requiredStepsComplete =
    incompleteStepsInGuide.filter((step) => step.stepType === StepType.required)
      .length === 0;

  if (isAccountGuide && requiredStepsComplete) {
    /** Not all steps complete, not required are */
    await markGuideParticipantsDone({ guide, timestamp });
  }

  if (!accountUser || !guideParticipant) return guide;

  let isDone = false;

  if (isAccountGuide) {
    const allStepsSkippedOrComplete = incompleteStepsInGuide.every(
      (step) => !!step.skippedAt
    );
    /** Everything incomplete is skipped or complete (won't be in list) */
    isDone = allStepsSkippedOrComplete;
  } else {
    const optionalSteps = incompleteStepsInGuide.filter(
      (step) => step.stepType !== StepType.required
    );

    const allOptionalStepsAreDone = optionalSteps.every(
      (step) => !!step.skippedAt
    );

    const stepsWereInteractedWith =
      allOptionalStepsAreDone || optionalSteps.some((step) => !!step.skippedAt);

    isDone =
      /** Required steps are complete (won't be in list), optional steps are viewed/skipped */
      (requiredStepsComplete && allOptionalStepsAreDone) ||
      /** Or this is a Flow-type guide and at least one step is skipped */
      (isFlowGuide(guide.createdFromTemplate.formFactor) &&
        stepsWereInteractedWith);
  }

  await updateGuideDone(guide, isDone ? timestamp : null);
  await updateGuideParticipantDone({
    guideParticipant,
    timestamp: isDone ? timestamp : null,
  });

  return guide;
}

const updateGuideComplete = async ({
  guide,
  timestamp,
}: {
  guide: Guide;
  timestamp: Date | null;
}) => {
  await guide.update({
    completionState: timestamp
      ? GuideCompletionState.complete
      : GuideCompletionState.incomplete,
    completedAt: timestamp,
  });
};

async function updateGuideDone(guide: Guide, timestamp: Date | null) {
  await guide.update({
    completionState: timestamp
      ? GuideCompletionState.done
      : GuideCompletionState.incomplete,
    doneAt: timestamp,
  });
}

const updateGuideParticipantDone = async ({
  guideParticipant,
  timestamp,
}: {
  guideParticipant: GuideParticipant;
  timestamp: Date | null;
}) => {
  await guideParticipant.update({
    doneAt: timestamp,
  });
};

const getGuideParticipant = async (guideId: number, accountUserId?: number) => {
  if (!accountUserId || !guideId) return null;

  return GuideParticipant.findOne({
    where: {
      accountUserId,
      guideId,
    },
  });
};

/** Checks all other guide participants to see if they're done */
const markGuideParticipantsDone = async ({ guide, timestamp }) => {
  const guideParticipantIdList = (await queryRunner({
    sql: `--sql
			select gp.id as "guideParticipantId"
			from core.guides g
			join core.steps s
				on (g.id = s.guide_id)
      join core.step_prototypes sp
        on sp.id = s.created_from_step_prototype_id
			join core.guide_participants gp
				on (gp.guide_id = g.id)
			left join core.step_participants spa
				on (s.id = spa.step_id and gp.account_user_id = spa.account_user_id)
			where g.id = :guideId
				and s.completed_at is null
				and sp.step_type IN (:eligibleStepTypes)
				and gp.done_at is null
				AND g.deleted_at IS NULL
			group by gp.id
			having count(s.id) = count(spa.skipped_at)`,
    replacements: {
      guideId: guide.id,
      eligibleStepTypes: Object.values(StepType).filter(
        (value) => value !== StepType.required
      ),
    },
    queryDatabase: QueryDatabase.primary,
  })) as { guideParticipantId: number }[];

  await GuideParticipant.update(
    {
      doneAt: timestamp,
    },
    {
      where: {
        id: guideParticipantIdList.map((row) => row.guideParticipantId),
      },
    }
  );
};
