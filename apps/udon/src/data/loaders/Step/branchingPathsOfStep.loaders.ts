import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { BranchingPath } from 'src/data/models/BranchingPath.model';

/**
 * @deprecated prefer joining the branchingPath instead
 */
export const getBranchingTypeOfStep = async (
  stepBranchingKey: string | undefined
): Promise<BranchingPath['entityType'] | undefined> =>
  stepBranchingKey
    ? (
        await BranchingPath.findOne({
          where: { branchingKey: stepBranchingKey },
        })
      )?.entityType
    : undefined;

/**
 * @deprecated use branchingOfStepLoader instead
 */
export default function branchingPathsOfStepLoader(loaders: Loaders) {
  return new Dataloader<number, BranchingPath[]>(async (stepIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          bp.id as id,
          s.id as "stepId"
        FROM
          core.branching_paths bp
          JOIN core.step_prototypes sp ON sp.entity_id = bp.branching_key
          JOIN core.steps s ON s.created_from_step_prototype_id = sp.id
        WHERE
          s.id IN (:stepIds);
        `,
      replacements: {
        stepIds,
      },
    })) as { id: number; stepId: number }[];

    return loadBulk(stepIds, rows, 'stepId', 'id', loaders.branchingPathLoader);
  });
}
