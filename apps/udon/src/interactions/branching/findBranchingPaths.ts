import { BranchingPath } from 'src/data/models/BranchingPath.model';

type Args = {
  /** Entity ID */
  branchingKey: string;
  organizationId: number;
};

/** All branching paths listening to the completion of a step with specified branchingKey */
export async function findBranchingPaths({
  branchingKey,
  organizationId,
}: Args) {
  if (!branchingKey) {
    throw new Error('No Template ID given');
  }

  return BranchingPath.findAll({
    where: {
      branchingKey,
      organizationId,
    },
  });
}
