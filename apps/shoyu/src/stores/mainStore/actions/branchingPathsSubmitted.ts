import {
  BranchingChoiceKey,
  GlobalStateActionPayload,
} from 'bento-common/types/globalShoyuState';
import { WorkingState } from '../types';
import { stepSelector } from '../helpers/selectors';
import branchingPathSelected from './branchingPathSelected';

export default function branchingPathsSubmitted(
  state: WorkingState,
  { stepEntityId }: GlobalStateActionPayload<'branchingPathsSubmitted'>
) {
  const step = stepSelector(stepEntityId, state);
  if (step) {
    const { choiceKeys, choiceLabels } = (
      step.branching?.branches || []
    ).reduce(
      (acc, branch) => {
        if (branch.selected) {
          acc.choiceKeys.push(branch.key);
          acc.choiceLabels.push(branch.label);
        }
        return acc;
      },
      { choiceKeys: [], choiceLabels: [] } as {
        choiceLabels: string[];
        choiceKeys: BranchingChoiceKey[];
      }
    );

    branchingPathSelected(state, {
      stepEntityId: step.entityId,
      branchingKey: step.branching!.key,
      choiceLabels,
      choiceKeys,
      updateCompletionOnServer: true,
    });
  }
}
