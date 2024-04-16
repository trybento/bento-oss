import { EmbedFormFactor } from 'bento-common/types';
import {
  FullGuide,
  Guide,
  StepAutoCompleteInteraction,
} from 'bento-common/types/globalShoyuState';
import {
  formFactorSelector,
  guideSelector,
  selectedGuideForFormFactorSelector,
  selectedStepForFormFactorSelector,
} from '../helpers/selectors';

import { WorkingState } from '../types';
import guideChanged from './guideChanged';
import formFactorCreated from './formFactorCreated';
import stepSelected from './stepSelected';
import {
  isAnnouncementGuide,
  isTooltipGuide,
} from 'bento-common/utils/formFactor';
import { cleanOrphanedItems } from '../helpers';
import mainStore from '..';
import stepAutoCompleteInteractionsChanged from './stepAutoCompleteInteractionsChanged';
import { v4 as uuidv4 } from 'uuid';

export type PreviewGuideSetPayload = {
  previewId: string;
  guide: FullGuide;
  additionalGuides?: FullGuide[];
  /**
   * The `formFactor` override should be used to handle the sidebar previews
   * for guides with legacy form factor.
   */
  formFactor?: EmbedFormFactor;
};

export default function previewGuideSet(
  state: WorkingState,
  {
    guide,
    additionalGuides = [],
    previewId,
    formFactor,
  }: PreviewGuideSetPayload
) {
  const guideExists = !!state.guides[guide.entityId];
  guideChanged(state, { guide: { ...guide, isPreview: true } });

  if (
    guideExists &&
    formFactorSelector(state, previewId)?.formFactor === formFactor
  ) {
    const isGuideSelected =
      selectedGuideForFormFactorSelector(state, previewId)?.entityId ===
      guide.entityId;
    const selectedStep = selectedStepForFormFactorSelector(state, previewId);
    const selectedStepExists =
      !!selectedStep && !!state.steps[selectedStep.entityId];
    if (isGuideSelected && !selectedStepExists) {
      stepSelected(state, {
        formFactor: previewId,
        step: guide.firstIncompleteStep,
      });
    }

    // if the guide and selected step already exist and the
    // form factor is the same then this doesn't need to do anything else
    return;
  }

  const guideFromSelection = guideSelector(guide.entityId, state);

  const allGuides = [guideFromSelection!, ...additionalGuides] as Guide[];

  formFactorCreated(state, {
    id: previewId,
    formFactor:
      formFactor ||
      (guideFromSelection?.formFactor as unknown as EmbedFormFactor),
    guides: allGuides,
    isPreview: true,
  });

  if (additionalGuides.length > 0)
    setTimeout(() => {
      mainStore.getState().dispatch({
        type: 'availableGuidesChanged',
        availableGuides: allGuides,
        keepExistingSelections: true,
      });
    }, 100);

  if (
    !isAnnouncementGuide(guide.formFactor) &&
    !isTooltipGuide(guide.formFactor)
  ) {
    stepSelected(state, {
      formFactor: previewId,
      step: guide.firstIncompleteStep,
    });
  }

  const stepAutoCompleteInteractions: StepAutoCompleteInteraction[] =
    guide.steps.flatMap((step) =>
      step.autoCompleteInteraction
        ? [
            {
              ...step.autoCompleteInteraction,
              entityId: uuidv4(),
              isPreview: true,
              step: step.entityId,
              guide: step.guide,
            },
          ]
        : []
    );

  if (stepAutoCompleteInteractions.length > 0) {
    stepAutoCompleteInteractionsChanged(state, {
      stepAutoCompleteInteractions,
    });
  }

  cleanOrphanedItems(state);
}
