import Dataloader from 'dataloader';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import { queryRunner } from 'src/data';

type BranchedFromData = {
  choiceKey: string;
  branchingKey: string;
};

export default function branchedFromChoiceOfGuideLoader() {
  return new Dataloader<number, BranchedFromData | null>(async (guideIds) => {
    const rows = (await queryRunner({
      sql: `
      SELECT
        bp.choice_key as "choiceKey",
        bp.branching_key as "branchingKey",
        tbp.created_guide_id as "guideId"
      FROM
        core.branching_paths bp
      JOIN core.triggered_branching_paths tbp 
      ON
        tbp.branching_path_id = bp.id
      WHERE
        tbp.created_guide_id in (:guideIds);
        `,
      replacements: {
        guideIds,
      },
    })) as (BranchedFromData & { guideId: number })[];

    const rowsByGuideId = keyBy(rows, 'guideId');
    return guideIds.map((gId) =>
      rowsByGuideId[gId]?.choiceKey !== undefined
        ? omit(rowsByGuideId[gId], 'guideId')
        : null
    );
  });
}
