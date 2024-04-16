import { groupBy } from 'lodash';
import { queryRunner } from 'src/data';
import { BranchingBranch } from 'src/data/models/types';

type Args = {
  stepIds: number[];
};

/**
 * Dict of branching choices with selection data, by step ID
 */
type BranchingMap = Record<number, BranchingBranch[]>;

export default async function getBranchingBranchesForStep({
  stepIds,
}: Args): Promise<BranchingMap> {
  if (stepIds.length === 0) return {};

  const data = (await queryRunner({
    sql: `--sql
		SELECT
			s.id AS "stepId",
			sp.branching_choices AS "branchingChoices",
			bp.choice_key AS "choiceKey"
		FROM core.triggered_branching_paths tbp
		JOIN core.branching_paths bp
			ON tbp.branching_path_id = bp.id
		JOIN core.steps s
			ON tbp.triggered_from_step_id = s.id
		JOIN core.step_prototypes sp
			ON s.created_from_step_prototype_id = sp.id
		WHERE
			tbp.triggered_from_step_id IN (:stepIds);`,
    replacements: {
      stepIds,
    },
  })) as {
    stepId: number;
    branchingChoices: BranchingBranch[];
    choiceKey: string;
  }[];

  const dataByStepId = groupBy(data, 'stepId');

  return stepIds.reduce<BranchingMap>((a, sId) => {
    const data = dataByStepId[sId];

    if (!data) {
      a[sId] = [];
    } else {
      const choices = data[0].branchingChoices;
      const selections = new Set(data.map((c) => c.choiceKey));

      a[sId] = choices.map((c) => ({
        ...c,
        selected: selections.has(c.choiceKey),
      }));
    }

    return a;
  }, {});
}
