import promises from 'src/utils/promises';
import { every, flatMap, groupBy, keyBy } from 'lodash';
import { Op } from 'sequelize';

import { logger } from 'src/utils/logger';
import { QueryDatabase, queryRunner } from 'src/data';
import { Step, StepCompletedByType } from 'src/data/models/Step.model';
import { setStepCompletion } from 'src/interactions/setStepCompletion';
import checkStepEventMappingRulesSatisfied, {
  EventProperties,
} from 'src/interactions/targeting/checkStepEventMappingRulesSatisfied';

type Args = {
  accountUserExternalId: string;
  accountExternalId?: string;
  eventName: string;
  eventProperties: EventProperties | Attributes;
  organization: Organization;
};

import { createPartition } from 'src/utils/helpers';
import {
  triggerGuideBaseChangedForSteps,
  triggerGuideChangedForSteps,
  triggerAvailableGuidesChangedForGuides,
} from 'src/data/eventUtils';
import { Account } from 'src/data/models/Account.model';
import { Guide } from 'src/data/models/Guide.model';
import { Organization } from 'src/data/models/Organization.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { StepEventMappingRule } from 'src/data/models/StepEventMappingRule.model';
import { StepEventMapping } from 'src/data/models/StepEventMapping.model';
import { isBentoEvent } from 'bento-common/data/helpers';
import { Attributes } from './recordEvents/recordEvents.helpers';

const ENFORCE_GROUPID = false;

// fetch step event mappings
// for each step event mapping,
//   - fetch its rule
//   - if the eventProperties doesnt match the rule, return
//   - fetch the step prototypes
//   - fetch any associated steps that are incomplete
//   - mark those steps as complete

/**
 * Check whether or not a segment event should trigger autocomplete
 *   WARNING: High traffic API
 */
export async function autoCompleteStepsMappedToEvent({
  accountUserExternalId,
  accountExternalId,
  eventName,
  eventProperties,
  organization,
}: Args): Promise<Step[]> {
  const [_stepCount, steps] = (await (async () => {
    const stepEventMappings = await StepEventMapping.findAll({
      where: {
        eventName,
        organizationId: organization.id,
      },
      // we really only use the id here
      attributes: ['id'],
    });

    if (stepEventMappings.length === 0) {
      logger.debug(`No mappings found for event: ${eventName}`);
      return [0, []];
    }

    let accountUser: AccountUser | null;
    if (accountExternalId) {
      accountUser = await AccountUser.findOne({
        where: {
          externalId: accountUserExternalId,
          organizationId: organization.id,
          '$account.external_id$': accountExternalId,
        },
        include: [
          {
            model: Account.scope('notArchived'),
            as: 'account',
          },
        ],
      });
    } else {
      logger.info(
        `[autocomplete] Payload from org ${organization.entityId} included no account external Id`
      );

      /* Only error out if we're at the stage we want to enforce the groupId */
      if (ENFORCE_GROUPID)
        throw new Error('No groupId was included in the context'); // Or we could return -1 to trigger the alert checks after

      accountUser = await AccountUser.findOne({
        where: {
          externalId: accountUserExternalId,
          organizationId: organization.id,
        },
      });
    }

    if (!accountUser) {
      logger.debug('No account user found');
      return [0, []];
    }

    const stepEventMappingIds = stepEventMappings.map((sem) => sem.id);

    const stepEventMappingRules = await StepEventMappingRule.findAll({
      where: {
        stepEventMappingId: stepEventMappingIds,
      },
    });

    const stepEventMappingRulesByStepEventMappingId = groupBy(
      stepEventMappingRules,
      'stepEventMappingId'
    );

    const useCompleteForWholeAccount = isBentoEvent(eventName);

    const allCorrespondingStepIdRows = (await queryRunner({
      sql: `--sql
        SELECT DISTINCT
          steps.id as "stepId"
          , step_event_mappings.id as "stepEventMappingId"
        FROM core.step_event_mappings
        JOIN core.step_prototypes
        	ON step_event_mappings.step_prototype_id = step_prototypes.id
        JOIN core.guide_step_bases
        	ON step_prototypes.id = guide_step_bases.created_from_step_prototype_id
					AND guide_step_bases.deleted_at IS NULL
        JOIN core.steps
        	ON steps.created_from_guide_step_base_id = guide_step_bases.id
        JOIN core.guide_modules
        	ON steps.guide_module_id = guide_modules.id
        JOIN core.guides
        	ON guide_modules.guide_id = guides.id
        JOIN core.templates
          ON templates.id = guides.created_from_template_id
        JOIN core.guide_participants
        	ON (guides.id = guide_participants.guide_id)
				WHERE guides.account_id = (:accountId)
					AND (${
            useCompleteForWholeAccount
              ? `step_event_mappings.complete_for_whole_account`
              : `templates.type = 'account'`
          }
						OR guide_participants.account_user_id = :accountUserId
					)
          AND step_prototypes.step_type != 'fyi'
					AND guides.deleted_at IS NULL
					AND guide_modules.deleted_at IS NULL
					AND step_prototypes.step_type != 'branching'
					AND step_event_mappings.id IN (:stepEventMappingIds)
					AND steps.is_complete IS FALSE
      `,
      replacements: {
        accountId: accountUser.accountId,
        accountUserId: accountUser.id,
        stepEventMappingIds: stepEventMappingIds,
      },
      queryDatabase: QueryDatabase.primary,
    })) as {
      stepId: number;
      stepEventMappingId: number;
    }[];

    const allSteps = await Step.findAll({
      where: {
        id: allCorrespondingStepIdRows.map((row) => row.stepId),
      },
      include: [{ model: Guide, include: [GuideBase] }],
    });

    const allStepsById = keyBy(allSteps, 'id');

    const allStepsByStepEventMappingId = allCorrespondingStepIdRows.reduce(
      (acc, currentValue) => {
        const stepEventMappingId = Number(currentValue.stepEventMappingId);
        const stepId = Number(currentValue.stepId);
        const steps = acc[stepEventMappingId] || [];

        acc[stepEventMappingId] = [...steps, allStepsById[stepId]];
        return acc;
      },
      {}
    );

    await createPartition();

    const stepsToComplete = flatMap(stepEventMappings, (stepEventMapping) => {
      const rules =
        stepEventMappingRulesByStepEventMappingId[stepEventMapping.id] || [];
      const hasAdditionalRulesToSatisfy = rules.length > 0;
      if (hasAdditionalRulesToSatisfy) {
        const areRulesSatisfied = every(rules, (rule) =>
          checkStepEventMappingRulesSatisfied(rule, eventProperties)
        );

        if (!areRulesSatisfied) return [];
      }

      return allStepsByStepEventMappingId[stepEventMapping.id];
    }).filter(Boolean) as Step[];

    await promises.map(stepsToComplete, async (step) => {
      /* We shouldn't have this case logically since we do checks earlier, but steps are completing w/o au's */
      if (!accountUser)
        logger.warn(
          `[autoCompleteStepsMappedToEvent] Setting autocomplete w/ no au. sid:${step.id}, o: ${organization.name}, eName: ${eventName}`
        );

      await setStepCompletion({
        step,
        isComplete: true,
        completedByType: StepCompletedByType.Auto,
        accountUser: accountUser!,
      });
    });

    return [allCorrespondingStepIdRows.length, stepsToComplete];
  })()) as [number, Step[]];

  if (steps.length > 0) {
    const guides = await Guide.findAll({
      where: {
        id: [...new Set(steps.map((s) => s.guideId))],
        // @ts-ignore
        completedAt: { [Op.ne]: null },
      },
    });

    if (guides.length > 0) {
      triggerAvailableGuidesChangedForGuides(guides);
    }

    triggerGuideChangedForSteps(steps);
    triggerGuideBaseChangedForSteps(steps);
  }

  return steps;
}
