import Dataloader from 'dataloader';
import promises from 'src/utils/promises';
import { keyBy } from 'lodash';
import { GuideFormFactor } from 'bento-common/types';
import { rawTooltipTitleForGuide } from 'bento-common/data/helpers';

import { queryRunner } from 'src/data';
import { Loaders } from '..';
import { rawDesignTypeGetter } from 'src/data/models/common';

/**
 * WARNING: Assumes `gatedGuideAndStepPropagation` feature is enabled for this Org.
 * You shouldn't be using this loader if that is not the case.
 */
export default function titleOfStepTaggedElementLoader(_loaders: Loaders) {
  return new Dataloader<number, string>(
    //
    async (stepTagIds) => {
      const rows = (await queryRunner({
        sql: `--sql
          select
            ste.id as "stepTagId",
            t.display_title as "templateName",
            t.is_side_quest as "isSideQuest",
            t.form_factor as "formFactor",
            COALESCE(gsb.name, sp.name) as "stepName"
          from
            core.step_tagged_elements ste
            join core.guides g
							on g.id = ste.guide_id
            join core.templates t
							on t.id = g.created_from_template_id
            left join core.steps s
							on s.id = ste.step_id
            left join core.guide_step_bases gsb
							on gsb.id = s.created_from_guide_step_base_id
							AND gsb.deleted_at IS NULL
            left join core.step_prototypes sp
							on sp.id = s.created_from_step_prototype_id
          where
            ste.id in (:stepTagIds);
        `,
        replacements: {
          stepTagIds,
        },
      })) as {
        stepTagId: number;
        templateName: string;
        isSideQuest: boolean;
        formFactor: GuideFormFactor;
        stepName: string | null;
      }[];

      const rowsByStepTagId = keyBy(rows, 'stepTagId');

      return promises.map(stepTagIds, (stepTagId) => {
        const row = rowsByStepTagId[stepTagId] as
          | (typeof rowsByStepTagId)[number]
          | undefined;
        const designType =
          row && rawDesignTypeGetter(row.isSideQuest, row.formFactor);
        return rawTooltipTitleForGuide(
          designType,
          row?.templateName,
          row?.stepName
        );
      });
    }
  );
}
