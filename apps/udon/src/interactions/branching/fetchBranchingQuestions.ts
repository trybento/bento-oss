import { Op } from 'sequelize';
import { StepType } from 'bento-common/types';

import { Organization } from 'src/data/models/Organization.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import {
  BranchingQuestion,
  BranchingQuestionChoice,
} from 'src/graphql/BranchingQuestion/BranchingQuestion.graphql';

export default async function fetchBranchingQuestions(
  organization: Organization
) {
  const stepPrototypes = await StepPrototype.scope([
    'withBranchingPaths',
    { method: ['withModuleStepPrototype', true] },
  ]).findAll({
    where: {
      organizationId: organization.id,
      stepType: {
        [Op.in]: [StepType.branching, StepType.branchingOptional],
      },
    },
  });
  if (!stepPrototypes) {
    return [];
  }
  return stepPrototypes.reduce((acc, sp) => {
    const branchingPaths = sp.branchingPaths;
    if (branchingPaths) {
      acc.push({
        id: `BranchingQuestion:${sp.id}`,
        question: sp.branchingQuestion || '',
        // You would think this should be sp.branchingKey but that column is deprecated.
        branchingKey: sp.entityId,
        choices: (sp.branchingChoices || []).reduce(
          (acc, { choiceKey, label }): BranchingQuestionChoice[] => {
            const branchingPath = branchingPaths.find(
              (bp) => bp.choiceKey === choiceKey
            );
            if (branchingPath) {
              acc.push({
                id: branchingPath.entityId,
                choiceKey,
                label,
              });
            }
            return acc;
          },
          [] as BranchingQuestionChoice[]
        ),
      });
    }
    return acc;
  }, [] as BranchingQuestion[]);
}
