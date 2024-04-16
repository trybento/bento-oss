import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { Template } from 'src/data/models/Template.model';

export default function templateSplitSourcesLoader(loaders: Loaders) {
  return new Dataloader<number, Template[]>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
					tst.destination_template_id AS "templateId",
					tst.source_template_id AS "sourceTemplateId"
				FROM core.template_split_targets tst
				WHERE tst.destination_template_id IN (:templateIds)
				ORDER BY tst.source_template_id ASC;
      `,
      replacements: {
        templateIds: templateIds as number[],
      },
    })) as { sourceTemplateId: number; templateId: number }[];

    return loadBulk(
      templateIds,
      rows,
      'templateId',
      'sourceTemplateId',
      loaders.templateLoader
    );
  });
}
