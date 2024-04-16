import { SelectedModelAttrsPick } from 'bento-common/types';

import { GuideBaseStepAutoCompleteInteraction } from 'src/data/models/GuideBaseStepAutoCompleteInteraction.model';
import { StepAutoCompleteInteraction } from 'src/data/models/StepAutoCompleteInteraction.model';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { Step } from 'src/data/models/Step.model';
import { createStepAutoCompleteInteractions } from './createStepAutoCompleteInteractions';
import { QueryDatabase, queryRunner } from 'src/data';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';

type Args = {
  guideStepBases: SelectedModelAttrsPick<
    GuideStepBase,
    'id' | 'createdFromStepPrototypeId'
  >[];
};

/**
 * Create the auto complete interactions for the given GuideStepBases.
 *
 * WARNING: This will NOT update existing instances but that shouldn't be needed since we're not anymore
 * propagating common fields down to the Guide-base level anymore.
 *
 * @returns Promise the created GuideBaseStepAutoCompleteInteraction and StepAutoCompleteInteraction instances
 */
export async function createGuideBaseStepAutoCompleteInteractions({
  guideStepBases,
}: Args): Promise<
  [GuideBaseStepAutoCompleteInteraction[], StepAutoCompleteInteraction[]]
> {
  const [guideBaseStepIds, stepPrototypeIds] = guideStepBases.reduce<
    [number[], number[]]
  >(
    (acc, gsb) => {
      const [baseIds, prototypeIds] = acc;
      baseIds.push(gsb.id);
      if (gsb.createdFromStepPrototypeId) {
        prototypeIds.push(gsb.createdFromStepPrototypeId);
      }
      return acc;
    },
    [[], []]
  );

  return withSentrySpan(
    async () => {
      if (stepPrototypeIds.length === 0) return [[], []];

      const gbCreationData = await queryRunner<
        {
          guideBaseStepId: number;
          createdFromSpacInteractionId: number;
          organizationId: number;
        }[]
      >({
        sql: `--sql
          SELECT
            gsb.id AS "guideBaseStepId",
            spaci.id AS "createdFromSpacInteractionId",
            spaci.organization_id AS "organizationId"
          FROM
            core.guide_step_bases gsb
            JOIN core.step_prototype_auto_complete_interactions spaci
              ON spaci.step_prototype_id = gsb.created_from_step_prototype_id
            JOIN core.guide_bases gb
              ON gb.id = gsb.guide_base_id
            LEFT JOIN core.guide_base_step_auto_complete_interactions gbsaci
              ON (
                gbsaci.created_from_step_prototype_auto_complete_interaction_id = spaci.id
                AND gbsaci.guide_base_step_id = gsb.id
              )
          WHERE
            gsb.id IN (:guideBaseStepIds)
            AND spaci.step_prototype_id IN (:stepPrototypeIds)
            AND gb.created_from_template_id IS NOT NULL
            AND gb.deleted_at IS NULL
            AND gbsaci.id IS NULL; -- Creates only if not exists
        `,
        replacements: {
          guideBaseStepIds,
          stepPrototypeIds,
        },
        queryDatabase: QueryDatabase.primary,
      });

      const createdGuideBaseInteractions =
        await GuideBaseStepAutoCompleteInteraction.bulkCreate(gbCreationData, {
          returning: true,
          ignoreDuplicates: true,
        });

      const associatedSteps = (await Step.findAll({
        attributes: ['id', 'createdFromGuideStepBaseId'],
        where: {
          createdFromGuideStepBaseId: guideBaseStepIds,
          createdFromStepPrototypeId: stepPrototypeIds,
        },
      })) as SelectedModelAttrsPick<
        Step,
        'id' | 'createdFromGuideStepBaseId'
      >[];

      const createdStepInteractions = await createStepAutoCompleteInteractions({
        steps: associatedSteps,
      });

      return [createdGuideBaseInteractions, createdStepInteractions];
    },

    {
      name: 'createGuideBaseStepAutoCompleteInteractions',
      data: { guideBaseStepIds, stepPrototypeIds },
    }
  );
}
