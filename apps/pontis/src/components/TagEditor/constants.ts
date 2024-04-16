import {
  GuideDesignType,
  GuideFormFactor,
  GuidePageTargetingType,
  GuideState,
  GuideTypeEnum,
  StepType,
  TagEditorData,
  Theme,
  WysiwygEditorState,
} from 'bento-common/types';
import {
  EmbedTypenames,
  FullGuide,
  Guide,
  GuideEntityId,
  Module,
  ModuleEntityId,
  Step,
  StepEntityId,
  StepState,
} from 'bento-common/types/globalShoyuState';
import { SlateBodyElement } from 'bento-common/types/slate';
import pick from 'lodash/pick';

// Types.
export type TagEditorCreateTagEvent = {};
export type TagEditorSelectStepEvent = {
  stepEntityId: StepEntityId;
  bodySlate?: SlateBodyElement[];
};
export type TagEditorDeleteStepEvent = {
  stepEntityId: StepEntityId;
};

export const pickTagDataFromEditorState = (
  state: WysiwygEditorState<TagEditorData>,
) => ({
  ...pick(state.data.taggedElement, [
    'type',
    'alignment',
    'xOffset',
    'yOffset',
    'relativeToText',
    'tooltipAlignment',
    'style',
    'entityId',
  ]),
  ...pick(state, [
    'elementSelector',
    'elementText',
    'elementHtml',
    'url',
    'wildcardUrl',
    'entityId',
  ]),
});

export const guidePreviewData: Guide = {
  __typename: EmbedTypenames.guide,
  entityId: 'fake-guide-id' as GuideEntityId,
  name: 'Preview guide',
  type: GuideTypeEnum.user,
  theme: Theme.nested,
  isSideQuest: false,
  formFactor: GuideFormFactor.sidebar,
  designType: GuideDesignType.onboarding,
  state: GuideState.active,
  taggedElements: [],
  isComplete: false,
  isDone: false,
  isViewed: false,
  isDestination: false,
  completedStepsCount: 0,
  totalSteps: 1,
  firstIncompleteModule: 'fake-module-id' as ModuleEntityId,
  firstIncompleteStep: 'fake-step-id' as StepEntityId,
  pageTargetingType: GuidePageTargetingType.anyPage,
  pageTargetingUrl: null,
  orderIndex: 0,
  isCyoa: false,
  canResetOnboarding: false,
};

export const modulePreviewData: Module = {
  entityId: 'fake-module-id' as ModuleEntityId,
  name: 'Preview module',
  orderIndex: 0,
  isPreview: true,
  isComplete: false,
  totalStepsCount: 1,
  completedStepsCount: 0,
};

export const stepPreviewData: Step = {
  entityId: 'fake-step-id' as StepEntityId,
  name: 'Preview Step',
  stepType: StepType.optional,
  state: StepState.incomplete,
  mediaReferences: [],
  bodySlate: [
    {
      id: '',
      type: 'paragraph',
      children: [
        {
          id: '',
          text: 'This is a sample description for this step.',
          type: 'text',
          children: null,
        },
      ],
      template: true,
    },
  ],
  module: 'fake-module-id' as ModuleEntityId,
  guide: 'fake-guide-id' as GuideEntityId,
  orderIndex: 0,
  hasViewedStep: false,
  isComplete: false,
  wasCompletedAutomatically: false,
  manualCompletionDisabled: false,
  isPreview: true,
};

export const fullGuidePreviewData: FullGuide = {
  ...guidePreviewData,
  modules: [
    {
      ...modulePreviewData,
      steps: [{ ...stepPreviewData }],
    },
  ],
  steps: [{ ...stepPreviewData }],
};
