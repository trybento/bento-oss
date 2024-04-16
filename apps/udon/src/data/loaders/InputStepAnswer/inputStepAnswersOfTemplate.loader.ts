import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { InputStepAnswer } from 'src/data/models/inputStepAnswer.model';

export default function inputStepAnswersOfTemplate(loaders: Loaders) {
  return new Dataloader<number, InputStepAnswer[]>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
					t.id AS "templateId",
					isa.id AS "inputStepAnswerId"
				FROM core.input_step_answers isa
				JOIN core.input_step_bases isb
					ON isa.input_step_base_id = isb.id
				JOIN core.guide_step_bases gsb
					ON isb.guide_step_base_id = gsb.id
					AND gsb.deleted_at IS NULL
				JOIN core.guide_bases gb
					ON gsb.guide_base_id = gb.id
				JOIN core.templates t
					ON gb.created_from_template_id = t.id
				WHERE isa.step_id IS NOT NULL
					AND t.id IN (:templateIds)
      `,
      replacements: {
        templateIds: templateIds as number[],
      },
    })) as { inputStepAnswerId: number; templateId: number }[];

    return loadBulk(
      templateIds,
      rows,
      'templateId',
      'inputStepAnswerId',
      loaders.inputStepAnswerLoader
    );
  });
}
