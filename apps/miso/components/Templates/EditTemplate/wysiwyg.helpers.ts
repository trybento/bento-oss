import {
  getEmptyFullStep,
  getFakeUuidStepEntityId,
  getFakeUuidTagEntityId,
} from 'bento-common/data/fullGuide';
import { tooltipTitleForGuide } from 'bento-common/data/helpers';
import {
  DEFAULT_FLOW_TAG_STYLE,
  DEFAULT_FLOW_TAG_TYPE,
  GuideFormFactor,
  TagInput,
  Theme,
} from 'bento-common/types';
import {
  FullGuide,
  FullModule,
  Step,
  StepEntityId,
  TaggedElement,
} from 'bento-common/types/globalShoyuState';
import {
  StepPrototypeValue,
  TemplateModuleValue,
} from 'bento-common/types/templateData';
import { isFlowGuide } from 'bento-common/utils/formFactor';
import { getNewTag } from 'components/Tags/helpers';
import { getEmptyStep } from 'utils/getEmptyStep';
import keyBy from 'lodash/keyBy';

export const createTaggedElement = (
  guide: FullGuide,
  {
    context,
    stepEntityId,
    stepName,
  }: {
    context?: 'template' | 'step';
    stepEntityId?: StepEntityId;
    stepName?: string;
  } = {
    context: 'step',
  }
): {
  newStep: Step | undefined;
  newTag: TaggedElement;
} => {
  const isFlow = isFlowGuide(guide.formFactor);
  let newStep: Step;

  const newTag = getNewTag({
    entityId: getFakeUuidTagEntityId(),
    url: '',
    elementSelector: '',
    wildcardUrl: '',
    ...(isFlow && {
      type: DEFAULT_FLOW_TAG_TYPE,
      style: DEFAULT_FLOW_TAG_STYLE,
    }),
  });

  if (context === 'step' && !stepEntityId) {
    const currentModule = guide.modules[0];
    // Create step for tag.
    const newStepIndex = currentModule.steps.length;
    newStep = getEmptyFullStep({
      entityId: getFakeUuidStepEntityId(),
      orderIndex: newStepIndex,
      guide: guide.entityId,
      module: currentModule.entityId,
      guideFormFactor: GuideFormFactor.flow,
      theme: Theme.nested,
    });
  }

  newTag.step = stepEntityId || newStep?.entityId;
  newTag.guide = guide.entityId;
  newTag.tooltipTitle = tooltipTitleForGuide(
    stepName ? { name: stepName } : newStep,
    guide
  );

  return { newStep, newTag };
};

export const taggedElementToTagInput = (
  taggedElement: TaggedElement
): TagInput => {
  const {
    entityId,
    alignment,
    elementSelector,
    relativeToText,
    style,
    tooltipAlignment,
    type,
    url,
    wildcardUrl,
    xOffset,
    yOffset,
  } = taggedElement;

  return {
    entityId,
    elementHtml: '',
    elementText: '',
    alignment,
    elementSelector,
    relativeToText,
    style,
    tooltipAlignment,
    type,
    url,
    wildcardUrl,
    xOffset,
    yOffset,
  };
};

export const fullStepToStepPrototype = (
  fullStep: Step,
  taggedElement: TaggedElement | undefined
): Omit<StepPrototypeValue, 'autoCompleteInteractions' | 'body'> => {
  const {
    entityId,
    name,
    bodySlate,
    stepType,
    ctas,
    inputs,
    mediaReferences,
    manualCompletionDisabled,
  } = fullStep;

  const taggedElements: TagInput[] = [];
  if (taggedElement) {
    taggedElements.push(taggedElementToTagInput(taggedElement));
  }

  return {
    entityId,
    name,
    bodySlate,
    stepType,
    ctas,
    inputs,
    mediaReferences,
    manualCompletionDisabled,
    taggedElements,
  };
};

export const fullModuleToTemplateModule = (
  fullModule: FullModule,
  taggedElements: TaggedElement[],
  /**
   * Optional: Used to reconcile data that doesn't exist
   * from the fullModule with the current values of an
   * existing template module.
   */
  templateModule?: TemplateModuleValue
): TemplateModuleValue => {
  const { entityId, name, steps } = fullModule;

  const stepPrototypesByEntityId = keyBy<StepPrototypeValue>(
    templateModule?.stepPrototypes || [],
    'entityId'
  );

  const taggedElementsByStepEntityId = keyBy(taggedElements, 'step');

  return {
    entityId,
    name,
    displayTitle: name,
    description: '',
    stepPrototypes: steps.map((s) => {
      const stepPrototypeValue: StepPrototypeValue | undefined =
        stepPrototypesByEntityId[s.entityId];

      const updatedStepData = fullStepToStepPrototype(
        s,
        taggedElementsByStepEntityId[s.entityId]
      );

      return {
        /**
         * Include step defaults in case they aren't
         * part of the fullModule or the templateModule.
         * Create a new one per step to avoid ref sharing across steps.
         */
        ...getEmptyStep(),
        ...(stepPrototypeValue || {}),
        ...updatedStepData,
      };
    }),
  };
};
