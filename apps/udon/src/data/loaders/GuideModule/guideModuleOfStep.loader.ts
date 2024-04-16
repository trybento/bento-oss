import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { loadBulk } from 'src/data/loaders/helpers';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { Loaders } from '..';

const guideModuleOfStepLoader = (loaders: Loaders) =>
  new Dataloader<number, GuideModule[]>(async (stepIds) => {
    const rows = (await queryRunner({
      sql: `--sql
    SELECT
      s.id AS "stepId",
      gm.id AS "guideModuleId"
    FROM core.steps s
    JOIN core.guide_modules gm
      ON gm.id = s.guide_module_id
    WHERE s.id IN (:stepIds)
			AND gm.deleted_at IS NULL
    `,
      replacements: {
        stepIds,
      },
    })) as { stepId: number; guideModuleId: number }[];

    return loadBulk(
      stepIds,
      rows,
      'stepId',
      'guideModuleId',
      loaders.guideModuleLoader
    );
  });

export default guideModuleOfStepLoader;
