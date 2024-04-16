import Dataloader from 'dataloader';
import { keyBy } from 'lodash';
import { SlateBodyElement } from 'bento-common/types/slate';

import { queryRunner } from 'src/data';
import { markdownToSlate } from 'src/utils/slate';
import { Loaders } from '..';
import promises from 'src/utils/promises';

/**
 * WARNING: Assumes `gatedGuideAndStepPropagation` feature is enabled for this Org.
 * You shouldn't be using this loader if that is not the case.
 */
export default function bodySlateOfStepLoader(_loaders: Loaders) {
  return new Dataloader<
    {
      /** For which Step */
      stepId: number;
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
      const stepIds = args.map((arg) => arg.stepId);

      const rows = (await queryRunner({
        sql: `--sql
          SELECT
            s.id AS "stepId",
            COALESCE(gsb.body_slate, sp.body_slate) AS "bodySlate",
            COALESCE(gsb.body, sp.body) AS "body"
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
        bodySlate: SlateBodyElement[] | null;
        body: string | null;
      }[];

      const rowsByStepId = keyBy(rows, 'stepId');

      return promises.map(args, (arg) => {
        /**
         * Since we're iterating over the input and expecting to find a matching record,
         * we need to consider the possibility of not finding a matching record (i.e. Step got deleted?)
         */
        const stepContent = rowsByStepId[arg.stepId] as
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
      cacheKeyFn: ({ stepId, fallback }) => `${stepId}-${String(fallback)}`,
    }
  );
}
