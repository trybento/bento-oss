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
  TagEditorData,
  Theme,
} from 'bento-common/types';
import {
  ContextTagAlignment,
  ContextTagTooltipAlignment,
  ContextTagType,
  FullGuide,
  Step,
  StepEntityId,
  TaggedElement,
} from 'bento-common/types/globalShoyuState';
import { isFlowGuide } from 'bento-common/utils/formFactor';

export const getNewTag = (
  overrides: Partial<TagEditorData['taggedElement']> = {},
) =>
  ({
    alignment: ContextTagAlignment.topRight,
    relativeToText: false,
    tooltipAlignment: ContextTagTooltipAlignment.right,
    type: ContextTagType.dot,
    xOffset: 0,
    yOffset: 0,
    style: null,
    ...overrides,
  }) as TagEditorData['taggedElement'];

export const createTaggedElement = (
  guide: FullGuide,
  {
    context,
    stepEntityId,
  }: {
    context?: 'template' | 'step';
    stepEntityId?: StepEntityId;
  } = {
    context: 'step',
  },
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
  newTag.tooltipTitle = tooltipTitleForGuide(newStep, guide);

  return { newStep, newTag };
};
