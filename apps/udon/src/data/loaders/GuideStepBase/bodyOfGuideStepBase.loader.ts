import Dataloader from 'dataloader';
import { keyBy } from 'lodash';
import { SlateBodyElement } from 'bento-common/types/slate';

import { queryRunner } from 'src/data';
import { slateToMarkdown } from 'src/utils/slate';
import { Loaders } from '..';
import promises from 'src/utils/promises';

export default function bodyOfGuideStepBaseLoader(_loaders: Loaders) {
  return new Dataloader<number, string | null>(async (guideStepBaseIds) => {
    const rows = (await queryRunner({
      sql: `--sql
				SELECT
          gsb.id AS "guideStepBaseId",
					COALESCE(gsb.body, sp.body) AS "body",
					COALESCE(gsb.body_slate, sp.body_slate) AS "bodySlate"
				FROM
          core.guide_step_bases gsb
				  JOIN core.step_prototypes sp ON sp.id = gsb.created_from_step_prototype_id
				WHERE
          gsb.id IN (:guideStepBaseIds)
					AND gsb.deleted_at IS NULL;
			`,
      replacements: {
        guideStepBaseIds,
      },
    })) as {
      guideStepBaseId: number;
      body: string | null;
      bodySlate: SlateBodyElement[] | null;
    }[];

    const rowsByGuideStepBaseId = keyBy(rows, 'guideStepBaseId');

    return promises.map(guideStepBaseIds, (guideStepBaseId) => {
      /**
       * Since we're iterating over the input and expecting to find a matching record,
       * we need to consider the possibility of not finding a matching record (i.e. Step got deleted?)
       */
      const stepContent = rowsByGuideStepBaseId[guideStepBaseId] as
        | (typeof rows)[number]
        | undefined;

      if (stepContent?.bodySlate) {
        return slateToMarkdown(stepContent.bodySlate);
      }

      return stepContent?.body || null;
    });
  });
}
