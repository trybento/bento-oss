import { queryRunner } from 'src/data';
import { Guide } from 'src/data/models/Guide.model';
import { GuideModule } from 'src/data/models/GuideModule.model';

export default async function currentIncompleteGuideModule(
  guide: Guide
): Promise<GuideModule | null> {
  const rows = (await queryRunner({
    sql: `--sql
      SELECT guide_modules.id
      FROM core.guides
      JOIN core.guide_modules
      	ON guides.id = guide_modules.guide_id
      JOIN core.steps
      	ON steps.guide_module_id = guide_modules.id
      WHERE steps.is_complete IS FALSE
      	AND guides.id = :guideId
				AND guide_modules.deleted_at IS NULL
      GROUP BY guides.id, guide_modules.id
      ORDER BY guide_modules.order_index ASC
    `,
    replacements: {
      guideId: guide.id,
    },
  })) as { id: number }[];

  const firstIncompleteGuideModuleId = rows?.[0]?.id;
  if (!firstIncompleteGuideModuleId) return null;

  return GuideModule.findOne({
    where: {
      id: firstIncompleteGuideModuleId,
    },
  });
}
