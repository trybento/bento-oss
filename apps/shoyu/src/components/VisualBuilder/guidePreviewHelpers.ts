import { isIncompleteGuide } from 'bento-common/data/helpers';
import {
  FullGuide,
  Guide,
  GuideEntityId,
  Step,
  StepEntityId,
  StepState,
} from 'bento-common/types/globalShoyuState';
import {
  ClientStorage,
  readFromClientStorage,
  removeFromClientStorage,
  saveToClientStorage,
} from 'bento-common/utils/clientStorage';
import { debugMessage } from 'bento-common/utils/debugging';
import { isFlowGuide } from 'bento-common/utils/formFactor';
import { omit } from 'bento-common/utils/lodash';

type Progress = {
  guide: Guide | undefined;
  steps: Record<StepEntityId, Step> | undefined;
};

const LS_KEY = 'bento-wysiwygPreviewProgress';
let guideEntityId: GuideEntityId | null;

function cleanupPreviewProgress() {
  removeFromClientStorage(ClientStorage.sessionStorage, LS_KEY);
}

function getPreviewProgress(
  entityId: GuideEntityId | undefined
): Progress | undefined {
  if (!entityId) return;

  const progress = readFromClientStorage<Progress>(
    ClientStorage.sessionStorage,
    LS_KEY
  );

  if (progress?.guide?.entityId !== entityId) {
    cleanupPreviewProgress();
    return undefined;
  }
  return progress;
}

/**
 * Record the progress of the guide that was initialized.
 */
export function recordPreviewProgress(newProgress: Progress) {
  const { guide } = newProgress;

  if (guide && guide.isPreview && guide.entityId === guideEntityId) {
    /**
     * TBD: Only record incomplete guides, otherwise we run the
     * risk of not showing the preview on reload.
     */

    if (isIncompleteGuide(guide)) {
      saveToClientStorage<Progress>(
        ClientStorage.sessionStorage,
        LS_KEY,
        newProgress
      );
    } else {
      cleanupPreviewProgress();
    }
  }
}

/**
 * For flow guides, we need to mark the steps prior to the selected step as complete,
 * otherwise there may be weird interactions like being navigated to the first step
 * after completing the last.
 */
const completePriorFlowSteps = (guide: FullGuide): FullGuide => {
  if (!isFlowGuide(guide.formFactor)) {
    return guide;
  }

  const currentStep = guide.steps.find(
    (step) => step.entityId === guide.firstIncompleteStep
  );

  if (!currentStep) {
    return guide;
  }

  return {
    ...guide,
    steps: guide.steps.map((step) => {
      if (step.orderIndex < currentStep.orderIndex) {
        return {
          ...step,
          isComplete: true,
          completedAt: new Date(),
          state: StepState.complete,
        };
      }

      return step;
    }),
    modules: guide.modules.map((module) => ({
      ...module,
      steps: module.steps.map((step) => {
        if (step.orderIndex < currentStep.orderIndex) {
          return {
            ...step,
            isComplete: true,
            completedAt: new Date(),
            state: StepState.complete,
          };
        }

        return step;
      }),
    })),
  };
};

/**
 * Get the preview progress, initialize the guide
 * being tracked and return an updated guide.
 * The storage should be present on refresh and
 * page navigation.
 * Closing the editor tab clears the storage.
 */
export function initializePreviewProgress(
  fullGuide: FullGuide | undefined,
  initialLoad: boolean | undefined
): FullGuide | undefined {
  if (!fullGuide?.entityId) {
    debugMessage('[BENTO] PreviewProgress: No guide ID was provided');
    return fullGuide;
  }

  guideEntityId = fullGuide.entityId;

  if (initialLoad) {
    cleanupPreviewProgress();
    debugMessage('[BENTO] PreviewProgress: Initial load, cleaning progress');

    return completePriorFlowSteps(fullGuide);
  }

  const progress = getPreviewProgress(fullGuide.entityId);

  if (!progress?.guide) {
    debugMessage('[BENTO] PreviewProgress: No progress was found for guide', {
      entityId: fullGuide.entityId,
    });

    return completePriorFlowSteps(fullGuide);
  }

  const updatedSteps: FullGuide['steps'] = fullGuide.steps.map((s) => {
    return { ...s, ...(progress.steps?.[s.entityId] || {}) };
  });

  const updatedModules: FullGuide['modules'] = fullGuide.modules.map((m) => {
    return {
      ...m,
      steps: m.steps.map((s) => ({
        ...s,
        ...(progress.steps?.[s.entityId] || {}),
      })),
    };
  });

  const newData = {
    ...fullGuide,
    ...omit(progress.guide, ['modules', 'steps']),
    modules: updatedModules,
    steps: updatedSteps,
  };

  debugMessage(
    '[BENTO] PreviewProgress: Patching preview progress from storage',
    { newData }
  );

  return newData;
}
