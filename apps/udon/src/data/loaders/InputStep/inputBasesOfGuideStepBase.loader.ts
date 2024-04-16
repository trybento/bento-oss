import Dataloader from 'dataloader';
import { StepType } from 'bento-common/types';

import { queryRunner } from 'src/data';

import { loadBulk } from 'src/data/loaders/helpers';
import { InputStepBase } from 'src/data/models/inputStepBase.model';
import { Loaders } from '..';

const inputBasesOfGuideStepBaseLoader = (loaders: Loaders) =>
  new Dataloader<number, InputStepBase[]>(async (guideStepBaseId) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          ib.id as "id",
          ib.guide_step_base_id as "guideStepBaseId"
        FROM
          core.input_step_bases ib
				JOIN core.guide_step_bases gsb
					ON gsb.id = ib.guide_step_base_id
					AND gsb.deleted_at IS NULL
				JOIN core.step_prototypes sp
					ON sp.id = gsb.created_from_step_prototype_id
        WHERE
          ib.guide_step_base_id IN (:guideStepBaseId)
          AND sp.step_type = :inputStepType
        ORDER BY ib.order_index ASC;
      `,
      replacements: {
        guideStepBaseId,
        inputStepType: StepType.input,
      },
    })) as { id: number; guideStepBaseId: number }[];

    return loadBulk(
      guideStepBaseId,
      rows,
      'guideStepBaseId',
      'id',
      loaders.inputStepBaseLoader
    );
  });

export default inputBasesOfGuideStepBaseLoader;
