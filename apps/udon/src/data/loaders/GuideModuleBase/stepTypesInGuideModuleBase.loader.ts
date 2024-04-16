import Dataloader from 'dataloader';
import { StepType } from 'bento-common/types';

import { QueryDatabase, queryRunner } from 'src/data';

export default function stepTypesInGuideModuleBaseLoader() {
  return new Dataloader<number, StepType[]>(async (guideModuleBaseIds) => {
    const rows = await queryRunner<
      {
        guideModuleBaseId: number;
        stepType: StepType;
      }[]
    >({
      sql: `--sql
        SELECT DISTINCT
					gmb.id as "guideModuleBaseId",
					sp.step_type AS "stepType"
				FROM core.guide_module_bases gmb
				JOIN core.guide_step_bases gsb
					ON gsb.guide_module_base_id = gmb.id
					AND gsb.deleted_at IS NULL
				JOIN core.step_prototypes sp
					ON sp.id = gsb.created_from_step_prototype_id
				WHERE
					gmb.id IN (:guideModuleBaseIds);
      `,
      replacements: {
        guideModuleBaseIds,
      },
      queryDatabase: QueryDatabase.primary,
    });

    const stepTypesById = rows.reduce<Record<number, StepType[]>>((a, v) => {
      if (a[v.guideModuleBaseId]) {
        a[v.guideModuleBaseId].push(v.stepType);
      } else {
        a[v.guideModuleBaseId] = [v.stepType];
      }
      return a;
    }, {});

    return guideModuleBaseIds.map(
      (guideModuleBaseId) => stepTypesById[guideModuleBaseId] ?? []
    );
  });
}
