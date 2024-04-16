import {
  BranchingChoiceKey,
  BranchingKey,
  FormFactorState,
  GlobalStateActionPayload,
  ModuleEntityId,
} from 'bento-common/types/globalShoyuState';
import { deProxify } from 'bento-common/data/helpers';
import mainStore from '..';
import {
  branchingChoiceResourceSelector,
  guideSelectorByStep,
  stepSelector,
} from '../helpers/selectors';
import { WorkingState } from '../types';
import { resetDropdown } from '../../../api';

export default function moduleBranchingReset(
  state: WorkingState,
  { stepEntityId }: GlobalStateActionPayload<'moduleBranchingReset'>
) {
  const guide = guideSelectorByStep(stepEntityId, state);
  const step = stepSelector(stepEntityId, state);

  const resetStepSelection = () => {
    if (guide && step)
      Object.values<FormFactorState>(state.formFactors).forEach((ff) => {
        if (ff.selectedGuide === guide.entityId)
          ff.selectedStep = step.entityId;
      });
  };

  if (guide?.isPreview) {
    const choiceKeysToReset: BranchingChoiceKey[] = [];
    const stepData = deProxify({
      entityId: step!.entityId,
      /**
       * Technically 'isComplete' should be 'false' but since the
       * server doesn't reset it, we try to replicate that.
       */
      isComplete: step!.isComplete,
      branching: {
        ...step!.branching!,
        branches: step!.branching!.branches.map((b) => {
          choiceKeysToReset.push(b.key);
          return {
            ...b,
            selected: false,
          };
        }),
      },
    });

    const branchingData = branchingChoiceResourceSelector(
      state,
      stepEntityId as any as BranchingKey,
      choiceKeysToReset
    );

    const moduleEntityIdsToDelete: ModuleEntityId[] = [];
    (branchingData.modules || []).forEach((m) => {
      // Prevents preview from crashing for targetless branches.
      if (!m?.entityId) return;
      moduleEntityIdsToDelete.push(m.entityId);
    });

    guide.modules = (guide.modules || []).filter(
      (m) => !moduleEntityIdsToDelete.includes(m)
    );

    resetStepSelection();

    setTimeout(() => {
      mainStore.getState().dispatch({ type: 'stepChanged', step: stepData });
    }, 10);
  } else {
    resetStepSelection();

    resetDropdown({
      stepEntityId: stepEntityId,
      slateNodeId: '-',
    });
  }
}
