import { getFakeUuidStepEntityId } from 'bento-common/data/fullGuide';
import {
  getDefaultStepCtas,
  isCarouselTheme,
  isVideoGalleryTheme,
} from 'bento-common/data/helpers';
import { GuideFormFactor, StepType, Theme } from 'bento-common/types';
import { StepPrototypeValue } from 'bento-common/types/templateData';
import { isFlowGuide } from 'bento-common/utils/formFactor';

/**
 * Creates a new empty step with
 * default values and a fake ID.
 *
 * Note: The step includes a fake
 * ID needed for consolidation
 * and preview operations. Do not forget
 * to have that removed before submitting it
 * to the server.
 */
export const getEmptyStep = (
  guideFormFactor?: GuideFormFactor,
  theme?: Theme,
  override?: Partial<StepPrototypeValue>
): StepPrototypeValue => {
  const stepType =
    isCarouselTheme(theme) ||
    isVideoGalleryTheme(theme) ||
    isFlowGuide(guideFormFactor)
      ? StepType.fyi
      : StepType.optional;

  return {
    entityId: getFakeUuidStepEntityId(),
    name: '',
    body: null,
    bodySlate: null,
    eventMappings: [],
    taggedElements: [],
    autoCompleteInteractions: [],
    mediaReferences: [],
    manualCompletionDisabled: false,
    stepType,
    ctas: getDefaultStepCtas({
      stepType,
      guideFormFactor,
      branchingMultiple: undefined,
      branchingType: undefined,
      theme: theme || Theme.nested,
    }),
    ...override,
  };
};
