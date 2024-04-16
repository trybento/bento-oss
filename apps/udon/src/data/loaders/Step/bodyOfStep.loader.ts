import Dataloader from 'dataloader';
import { keyBy } from 'lodash';
import { SlateBodyElement } from 'bento-common/types/slate';

import { queryRunner } from 'src/data';
import { slateToMarkdown } from 'src/utils/slate';
import { Loaders } from '..';
import promises from 'src/utils/promises';

/**
 * WARNING: Assumes `gatedGuideAndStepPropagation` feature is enabled for this Org.
 * You shouldn't be using this loader if that is not the case.
 */
export default function bodyOfStepLoader(_loaders: Loaders) {
  return new Dataloader<number, string | null>(async (stepIds) => {
    const rows = (await queryRunner({
      sql: `--sql
				SELECT
					s.id AS "stepId",
					COALESCE(gsb.body, sp.body) AS "body",
					COALESCE(gsb.body_slate, sp.body_slate) AS "bodySlate"
				FROM
          core.steps s
				JOIN core.guide_step_bases gsb
					ON gsb.id = s.created_from_guide_step_base_id
					AND gsb.deleted_at IS NULL
				JOIN core.step_prototypes sp
					ON sp.id = s.created_from_step_prototype_id
				WHERE
          s.id IN (:stepIds);
			`,
      replacements: {
        stepIds,
      },
    })) as {
      stepId: number;
      body: string | null;
      bodySlate: SlateBodyElement[] | null;
    }[];

    const rowsByStepId = keyBy(rows, 'stepId');

    return promises.map(stepIds, (stepId) => {
      /**
       * Since we're iterating over the input and expecting to find a matching record,
       * we need to consider the possibility of not finding a matching record (i.e. Step got deleted?)
       */
      const stepContent = rowsByStepId[stepId] as
        | (typeof rows)[number]
        | undefined;

      if (stepContent?.bodySlate) {
        return slateToMarkdown(stepContent.bodySlate);
      }

      return stepContent?.body || null;
    });
  });
}
