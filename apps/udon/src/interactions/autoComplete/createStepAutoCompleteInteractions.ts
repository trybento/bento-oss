import { SelectedModelAttrsPick } from 'bento-common/types';

import { QueryDatabase, queryRunner } from 'src/data';
import { Step } from 'src/data/models/Step.model';
import { StepAutoCompleteInteraction } from 'src/data/models/StepAutoCompleteInteraction.model';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';

type Args = {
  steps: SelectedModelAttrsPick<Step, 'id' | 'createdFromGuideStepBaseId'>[];
};

/**
 * (Idempotent) Create step auto complete interactions for the given Steps.
 *
 * WARNING: This will NOT update existing instances but that shouldn't be needed since we're not anymore
 * propagating common fields down to the Step level anymore.
 *
 * @returns Promise the created StepAutoCompleteInteraction instances
 */
export async function createStepAutoCompleteInteractions({
  steps,
}: Args): Promise<StepAutoCompleteInteraction[]> {
  const [stepIds, guideBaseStepIds] = steps.reduce<[number[], number[]]>(
    (acc, step) => {
      const [sIds, baseIds] = acc;
      sIds.push(step.id);
      if (step.createdFromGuideStepBaseId) {
        baseIds.push(step.createdFromGuideStepBaseId);
      }
      return acc;
    },
    [[], []]
  );

  return withSentrySpan(
    async () => {
      if (!guideBaseStepIds.length) return [];

      const creationData = await queryRunner<
        {
          stepId: number;
          createdFromGuideBaseStepAutoCompleteInteractionId: number | null;
          organizationId: number;
        }[]
      >({
        sql: `--sql
          SELECT
            s.id AS "stepId",
            gbsaci.id AS "createdFromGuideBaseStepAutoCompleteInteractionId",
            gbsaci.organization_id AS "organizationId"
          FROM
            core.steps s
            JOIN core.guide_base_step_auto_complete_interactions gbsaci
              ON s.created_from_guide_step_base_id = gbsaci.guide_base_step_id
            JOIN core.guides g
              ON s.guide_id = g.id
            LEFT JOIN core.step_auto_complete_interactions saci
              ON (
                saci.created_from_guide_base_step_auto_complete_interaction_id = gbsaci.id
                AND saci.step_id = s.id
              )
          WHERE
            s.id IN (:stepIds)
            AND gbsaci.guide_base_step_id IN (:guideBaseStepIds)
            AND gbsaci.created_from_step_prototype_auto_complete_interaction_id IS NOT NULL
            AND g.created_from_guide_base_id IS NOT NULL
            AND g.deleted_at IS NULL
            AND saci.id IS NULL; -- Creates only if not exists
        `,
        replacements: {
          stepIds,
          guideBaseStepIds,
        },
        queryDatabase: QueryDatabase.primary,
      });

      return StepAutoCompleteInteraction.bulkCreate(creationData, {
        ignoreDuplicates: true,
      });
    },

    {
      name: 'createStepAutoCompleteInteractions',
      data: { stepIds, guideBaseStepIds },
    }
  );
}
