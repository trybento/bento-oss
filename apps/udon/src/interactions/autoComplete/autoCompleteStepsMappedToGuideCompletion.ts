import { GuideState } from 'bento-common/types';
import {
  AutoCompleteInteractionCompletableType,
  AutoCompleteInteractionType,
} from 'bento-common/types/stepAutoComplete';
import promises from 'src/utils/promises';
import { Op } from 'sequelize';

import { QueryDatabase, queryRunner } from 'src/data';
import { Logger } from 'src/jobsBull/logger';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Step, StepCompletedByType } from 'src/data/models/Step.model';
import { setStepCompletion } from '../setStepCompletion';
import AutoCompleteInteractionGuideCompletion from 'src/data/models/AutoCompleteInteractionGuideCompletion.model';

type Args = {
  account: Account;
  accountUser: AccountUser;
};

export async function autoCompleteStepsMappedToGuideCompletion(
  { account, accountUser }: Args,
  logger?: Logger
): Promise<void> {
  const firstAutoCompleteByGuideEntry =
    await AutoCompleteInteractionGuideCompletion.findOne({
      attributes: ['id'],
      where: {
        organizationId: account.organizationId,
      },
    });

  // if no auto-complete interaction is found for this org, then we can safely skip further checks
  if (!firstAutoCompleteByGuideEntry) return;

  const affectedStepsIds = (await queryRunner({
    sql: `--sql
      with
        -- find all completed guides within the account user context
        completed_guides as (
          select
            g.created_from_template_id as "completed_template_id"
          from
            core.guides g
            join core.guide_participants gp
              on (gp.guide_id = g.id and gp.account_user_id = :accountUserId)
          where
            g.organization_id = :organizationId
            and g.account_id = :accountId
            and g.state = :guideState -- active
            and g.launched_at <= now() -- launched
            and g.completed_at is not null -- completed
            and gp.obsoleted_at is null -- not obsoleted
        ),
        -- find all satisfied step auto-complete interactions based on completed guides
        satisfied_interactions as (
          select
            aui.completable_id as "step_prototype_id"
          from
            core.auto_complete_interactions aui
            join core.auto_complete_interaction_guide_completions gc on gc.auto_complete_interaction_id = aui.id
          where
            aui.organization_id = :organizationId
            and aui.interaction_type = :interactionType
            and aui.completable_type = :completableType
            and gc.template_id in (
              select completed_template_id from completed_guides
            )
        )
      select
        distinct s.id
      from core.guides g
        join core.guide_participants gp
          on (gp.guide_id = g.id and gp.account_user_id = :accountUserId)
        join core.guide_modules gm on gm.guide_id = g.id
        join core.steps s on s.guide_module_id = gm.id
      where
        g.organization_id = :organizationId
        and g.account_id = :accountId
        and g.state = :guideState -- active
        and g.launched_at <= now() -- launched
        and gp.obsoleted_at is null -- not obsoleted
				AND gm.deleted_at IS NULL
        and s.completed_at is null -- not yet completed
        and s.created_from_step_prototype_id in (
          -- created from a completed interaction
          select step_prototype_id from satisfied_interactions
        )
    `,
    replacements: {
      organizationId: account.organizationId,
      interactionType: AutoCompleteInteractionType.guideCompletion,
      completableType: AutoCompleteInteractionCompletableType.stepPrototype,
      guideState: GuideState.active,
      accountId: account.id,
      accountUserId: accountUser.id,
    },
    queryDatabase: QueryDatabase.primary,
  })) as { id: number }[];

  // find all affected step instances
  const affectedSteps = await Step.findAll({
    where: { id: { [Op.in]: affectedStepsIds.map((r) => r.id) } },
  });

  // mark each step as complete
  await promises.mapSeries(affectedSteps, async (step) => {
    logger?.info(
      `Auto-completing step #${step.id} for accountUser #${accountUser.id} based on guide completion`
    );
    await setStepCompletion({
      step,
      isComplete: true,
      completedByType: StepCompletedByType.Auto,
      accountUser: accountUser,
    });
  });
}
