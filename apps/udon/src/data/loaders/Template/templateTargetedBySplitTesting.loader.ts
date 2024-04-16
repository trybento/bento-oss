import Dataloader from 'dataloader';
import { keyBy } from 'lodash';
import { SplitTestState } from 'bento-common/types';

import { queryRunner } from 'src/data';

export default function templateTargetedBySplitTestingLoader() {
  return new Dataloader<number, SplitTestState>(async (templateIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
					tst.destination_template_id AS "templateId",
					tst.source_template_id AS "sourceTemplateId",
					t.is_auto_launch_enabled AS "launching",
					COUNT(gb.id) AS "launchedGuideBases"
				FROM core.template_split_targets tst
				JOIN core.templates t ON tst.source_template_id = t.id
				LEFT JOIN core.guide_bases gb ON gb.created_from_split_test_id = tst.source_template_id
				WHERE tst.destination_template_id IN (:templateIds)
				GROUP BY tst.destination_template_id, tst.source_template_id, t.is_auto_launch_enabled
				ORDER BY tst.source_template_id ASC
      `,
      replacements: {
        templateIds: templateIds as number[],
      },
    })) as {
      sourceTemplateId: number;
      templateId: number;
      launching: boolean;
      launchedGuideBases: number;
    }[];

    /* Assumes only 1 test can target a template */
    const rowsByTemplateId = keyBy(rows, 'templateId');
    return templateIds.map((templateId) =>
      rowsByTemplateId[templateId]
        ? rowsByTemplateId[templateId].launching
          ? SplitTestState.live
          : rowsByTemplateId[templateId].launchedGuideBases > 0
          ? SplitTestState.stopped
          : SplitTestState.draft
        : SplitTestState.none
    );
  });
}
