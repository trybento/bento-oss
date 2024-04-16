import Dataloader from 'dataloader';
import { keyBy } from 'lodash';
import { SlateBodyElement } from 'bento-common/types/slate';

import { queryRunner } from 'src/data';
import { markdownToSlate } from 'src/utils/slate';
import { Loaders } from '..';
import promises from 'src/utils/promises';

export default function bodySlateOfGuideStepBaseLoader(_loaders: Loaders) {
  return new Dataloader<
    {
      /** For which Step */
      guideStepBaseId: number;
      /**
       * Whether to fallback to `body` in case `bodySlate` is missing
       * @default false
       */
      fallback?: boolean;
    },
    SlateBodyElement[] | null,
    string
  >(
    async (args) => {
      const guideStepBaseIds = args.map((arg) => arg.guideStepBaseId);

      const rows = (await queryRunner({
        sql: `--sql
          SELECT
            gsb.id AS "guideStepBaseId",
            COALESCE(gsb.body_slate, sp.body_slate) AS "bodySlate",
            COALESCE(gsb.body, sp.body) AS "body"
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
        bodySlate: SlateBodyElement[] | null;
        body: string | null;
      }[];

      const rowsByGuideStepBaseId = keyBy(rows, 'guideStepBaseId');

      return promises.map(args, (arg) => {
        /**
         * Since we're iterating over the input and expecting to find a matching record,
         * we need to consider the possibility of not finding a matching record (i.e. Step got deleted?)
         */
        const stepContent = rowsByGuideStepBaseId[arg.guideStepBaseId] as
          | (typeof rows)[number]
          | undefined;

        /**
         * In case bodySlate is missing but body exists and a fallback is desired,
         * we use the body to generate the Slate content.
         */
        if (!stepContent?.bodySlate && stepContent?.body && !!arg.fallback) {
          return markdownToSlate(stepContent.body);
        }

        return stepContent?.bodySlate || null;
      });
    },
    {
      cacheKeyFn: ({ guideStepBaseId, fallback }) =>
        `${guideStepBaseId}-${String(fallback)}`,
    }
  );
}
