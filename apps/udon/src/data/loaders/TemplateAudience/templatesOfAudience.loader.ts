import DataLoader from 'dataloader';

import { queryRunner } from 'src/data';
import { Template } from 'src/data/models/Template.model';
import { Loaders } from '..';
import { loadBulk } from '../helpers';

export default function templatesOfAudienceLoader(loaders: Loaders) {
  return new DataLoader<number, Template[]>(async (audienceIds) => {
    const rows = await queryRunner<
      { audienceId: number; templateId: number }[]
    >({
      sql: `--sql
				SELECT
					a.id AS "audienceId",
					ta.template_id AS "templateId"
				FROM core.audiences a
				JOIN core.template_audiences ta
					ON ta.audience_entity_id = a.entity_id
				WHERE
					a.id IN (:audienceIds)
					AND a.deleted_at IS NULL;
				`,
      replacements: {
        audienceIds,
      },
    });

    return loadBulk(
      audienceIds,
      rows,
      'audienceId',
      'templateId',
      loaders.templateLoader
    );
  });
}
