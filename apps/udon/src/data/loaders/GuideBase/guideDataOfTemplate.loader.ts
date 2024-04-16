import Dataloader from 'dataloader';
import { queryRunner } from 'src/data';
import { GuideData } from 'src/data/models/Analytics/GuideData.model';

import { Loaders } from '..';
import { loadBulk } from '../helpers';

export default function guideDataOfTemplate(loaders: Loaders) {
  return new Dataloader<number, GuideData[]>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `--sql
       SELECT
				gd.id AS "guideDataId",
				gb.created_from_template_id AS "templateId"
			FROM
        core.guide_bases gb
        JOIN analytics.guide_data gd ON gd.guide_base_id = gb.id
        JOIN core.accounts a ON (
          gb.account_id = a.id
          AND a.deleted_at IS NULL
        )
			WHERE
				gb.created_from_template_id IN (:templateIds);
      `,
      replacements: {
        templateIds,
      },
    })) as { templateId: number; guideDataId: number }[];

    return loadBulk(
      templateIds,
      rows,
      'templateId',
      'guideDataId',
      loaders.guideDataLoader
    );
  });
}
