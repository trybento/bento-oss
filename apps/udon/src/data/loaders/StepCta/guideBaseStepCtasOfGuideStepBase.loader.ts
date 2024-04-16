import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { GuideBaseStepCta } from 'src/data/models/GuideBaseStepCta.model';

export default function guideBaseStepCtasOfGuideStepBaseLoader(
  loaders: Loaders
) {
  return new Dataloader<number, GuideBaseStepCta[]>(
    async (guideStepBaseIds) => {
      const rows = await queryRunner<
        {
          id: number;
          guideBaseStepId: number;
        }[]
      >({
        sql: `--sql
          SELECT
            gbsc.id as "id",
            gbsc.guide_base_step_id as "guideBaseStepId"
          FROM
            core.guide_base_step_ctas gbsc
            JOIN core.step_prototype_ctas spc ON gbsc.created_from_step_prototype_cta_id = spc.id
          WHERE
            gbsc.guide_base_step_id IN (:guideStepBaseIds)
            AND gbsc.created_from_step_prototype_cta_id IS NOT NULL
          ORDER BY
            gbsc.order_index ASC;
        `,
        replacements: {
          guideStepBaseIds,
        },
      });

      return loadBulk(
        guideStepBaseIds,
        rows,
        'guideBaseStepId',
        'id',
        loaders.guideBaseStepCtaLoader
      );
    }
  );
}
