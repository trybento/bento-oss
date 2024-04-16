import { normalize } from 'normalizr';
import { WritableDraft } from 'immer/dist/internal';

import {
  FullGuide,
  GlobalStateActionPayloads,
  Guide,
  GuideHydrationState,
  Module,
  ModuleEntityId,
  Step,
  StepState,
} from 'bento-common/types/globalShoyuState';
import { deProxify, isFinishedGuide } from 'bento-common/data/helpers';
import { AtLeast, GuideDesignType } from 'bento-common/types';

import schema, { NormalizedGuideData } from '../schema';
import { WorkingState } from '../types';
import {
  cleanOrphanedItems,
  cleanOrphanedTaggedElements,
  mergeTaggedElements,
} from '../helpers';
import mainStore from '..';
import { recordPreviewProgress } from '../../../components/VisualBuilder/guidePreviewHelpers';

// TODO: Has to be a better way of specifying these types

export default function guideChanged(
  state: WorkingState,
  payload: GlobalStateActionPayloads['guideChanged']
) {
  const {
    result: guideEntityId,
    entities: { guides, modules, steps, taggedElements },
  } = normalize(payload.guide, schema.guide) as NormalizedGuideData;

  const guide = guides[guideEntityId];
  if (guide) {
    const updatedGuide: Guide = {
      ...(state.guides[guideEntityId] || {}),
      ...guide,
      hydrationState: GuideHydrationState.hydrated,
    };
    if (guide.modules) {
      updatedGuide.steps = guide.modules.flatMap(
        (m) => modules?.[m].steps || []
      );
    }
    state.guides[guideEntityId] = updatedGuide;
  }

  const initialModulesLoad =
    Object.keys(state.modules).length === 0 ||
    !(guide?.modules || []).some((mEntityId) => state.modules[mEntityId]);

  // add new or merge existing module items
  if (modules) {
    let currentNewModuleEntityId: ModuleEntityId | undefined = Object.values<
      Module | WritableDraft<Module>
    >(state.modules).find((module) => module.isNew)?.entityId;

    for (const moduleEntityId of Object.keys(modules)) {
      const existingModule: Module | undefined = state.modules[moduleEntityId];
      const isNew =
        existingModule?.isNew || (!initialModulesLoad && !existingModule);

      // In multi module branching, only mark one module
      // as new to avoid spammy animations. Shouldn't interfere
      // between formFactors but it could be fixed by taking
      // into consideration that if neccessary.
      // Module with lowest orderIndex has the highest
      // priority.
      if (
        isNew &&
        (!currentNewModuleEntityId ||
          modules[moduleEntityId].orderIndex <
            /**
             * If currentNewModuleEntityId is no longer in the guide,
             * allow other modules to be marked as new.
             */
            (modules[currentNewModuleEntityId]?.orderIndex || 999))
      ) {
        currentNewModuleEntityId = moduleEntityId as ModuleEntityId;
      }

      state.modules[moduleEntityId] = {
        ...(existingModule || {}),
        ...modules[moduleEntityId],
        // New modules most likely are branching.
        isNew: false,
      };
    }

    if (currentNewModuleEntityId)
      state.modules[currentNewModuleEntityId].isNew = true;
  }

  if (steps) {
    state.steps = {
      ...state.steps,
      ...steps,
    };
  }

  cleanOrphanedItems(state, [guideEntityId]);

  if (state.guides[guideEntityId]?.isPreview) {
    // Update the completion state for module previews.
    for (const moduleEntityId of state.guides[guideEntityId].modules || []) {
      const m = state.modules[moduleEntityId];
      if (m)
        state.modules[moduleEntityId].isComplete =
          m.completedStepsCount === m.totalStepsCount;
    }
  } else {
    /**
     * There shouldn't be a case where deleting tags from
     * a preview is desirable. Particularly important for Flow
     * guides since the guide updates do not include the associated
     * tags.
     */
    cleanOrphanedTaggedElements(state, [guide.entityId], guide.taggedElements);
  }

  if (taggedElements) {
    mergeTaggedElements(state, taggedElements);
  }

  const updatedGuide = state.guides[guideEntityId];

  if (updatedGuide?.isPreview) {
    recordPreviewProgress({
      guide: updatedGuide,
      steps: deProxify(state.steps),
    });
  }

  if (
    updatedGuide?.isPreview &&
    isFinishedGuide(updatedGuide) &&
    updatedGuide.designType === GuideDesignType.announcement
  ) {
    const updatedGuideData: AtLeast<FullGuide, 'entityId'> = {
      entityId: guide.entityId,
      isComplete: false,
      isDone: false,
      savedAt: undefined,
      firstIncompleteStep: updatedGuide.steps![0],
    };

    const updatedStepData: AtLeast<Step, 'entityId'> = {
      entityId: updatedGuide.steps![0],
      isComplete: false,
      state: StepState.incomplete,
    };

    // reset preview modals and banners after a short delay
    setTimeout(() => {
      mainStore.getState().dispatch({
        type: 'stepChanged',
        step: updatedStepData,
      });
      mainStore.getState().dispatch({
        type: 'guideChanged',
        guide: updatedGuideData,
      });
    }, 1000);
  }
}
