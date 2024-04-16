import DataLoader from 'dataloader';

import { queryRunner } from 'src/data';
import { TemplateAudience } from 'src/data/models/TemplateAudience.model';
import { Loaders } from '..';
import { loadBulk } from '../helpers';

export default function templateAudiencesOfTemplateLoader(loaders: Loaders) {
  return new DataLoader<number, TemplateAudience[]>(async (templateIds) => {
    const rows = await queryRunner<
      { templateAudienceId: number; templateId: number }[]
    >({
      sql: `--sql
					SELECT
						ta.id AS "templateAudienceId",
						ta.template_id AS "templateId"
					FROM core.template_audiences ta
					WHERE ta.template_id IN (:templateIds);
				`,
      replacements: {
        templateIds,
      },
    });

    return loadBulk(
      templateIds,
      rows,
      'templateId',
      'templateAudienceId',
      loaders.templateAudienceLoader
    );
  });
}
