import { DefaultStepCtaGetterArgs, getDefaultStepCtas } from '../data/helpers';
import {
  GuideFormFactor,
  GuideTypeEnum,
  Theme,
  GuideDesignType,
  GuidePageTargetingType,
  StepType,
  GuideCompletionState,
} from '../types';
import {
  EmbedTypenames,
  FullGuide,
  GuideEntityId,
  ModuleEntityId,
  StepEntityId,
  StepState,
} from '../types/globalShoyuState';
import { SAMPLE_IMAGE_MEDIA_REFERENCE } from '../utils/templates';

const FORM_FACTOR = GuideFormFactor.legacy;
const THEME = Theme.card;

const commonCtaGetterArgs: Omit<DefaultStepCtaGetterArgs, 'stepType'> = {
  guideFormFactor: FORM_FACTOR,
  branchingMultiple: undefined,
  branchingType: undefined,
  theme: THEME,
};

const guide = '1696a12d-57af-4b8a-b4ae-2cc35fa9b5df' as GuideEntityId;
const modules = ['458b77a3-2c3d-4fb8-b677-3a01a9a671e0' as ModuleEntityId];
const steps = ['f12bed9c-b870-4a6f-af8c-d7dc60f09bc6' as StepEntityId];

const placeholderCardGuide: Omit<FullGuide, 'steps'> = {
  __typename: EmbedTypenames.guide,
  isPreview: true,
  entityId: guide,
  name: 'This is an example of a "card" guide',
  theme: THEME,
  type: GuideTypeEnum.user,
  isSideQuest: false,
  designType: GuideDesignType.onboarding,
  completionState: GuideCompletionState.incomplete,
  isComplete: false,
  isDone: false,
  isViewed: true,
  isDestination: false,
  completedStepsCount: 0,
  totalSteps: 1,
  firstIncompleteStep: steps[0],
  firstIncompleteModule: modules[0],
  orderIndex: 0,
  description: '',
  formFactor: FORM_FACTOR,
  pageTargeting: {
    type: GuidePageTargetingType.anyPage,
    url: undefined,
  },
  pageTargetingType: GuidePageTargetingType.anyPage,
  pageTargetingUrl: null,
  isCyoa: false,
  canResetOnboarding: false,
  taggedElements: [],
  modules: [
    {
      entityId: modules[0],
      guide,
      name: '',
      orderIndex: 0,
      isComplete: false,
      completedStepsCount: 0,
      totalStepsCount: 1,
      steps: [
        {
          entityId: steps[0],
          mediaReferences: [SAMPLE_IMAGE_MEDIA_REFERENCE],
          isComplete: false,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          state: StepState.incomplete,
          module: modules[0],
          guide,
          name: 'This is a sample card',
          orderIndex: 0,
          bodySlate: [
            {
              id: '170d15a8-9176-4c67-8927-bb5ae52760ee',
              type: 'paragraph',
              children: [
                {
                  id: '285ec1bc-1d2a-4a42-88a2-421a5c83256f',
                  text: 'This is a sample card',
                  type: 'text',
                  h1: true,
                  originNodeId: '0a58d60a-289e-41ee-851c-ac928421cd51',
                  copiedFromNodeId: '1dfb871a-756d-492e-bbfc-c8f0863ecb5d',
                },
              ],
              originNodeId: 'd731aa6d-2566-4d2e-82e5-b512d1612bef',
              copiedFromNodeId: '24389070-8969-4019-9bf5-e636ee3f20ac',
            },
            {
              id: '170d15a8-9176-4c67-8927-bb5ae52760ee',
              type: 'paragraph',
              children: [
                {
                  id: '285ec1bc-1d2a-4a42-88a2-421a5c83256f',
                  text: 'You probably want a short and snappy description with a clear call-to-action here!',
                  type: 'text',
                  originNodeId: '0a58d60a-289e-41ee-851c-ac928421cd51',
                  copiedFromNodeId: '1dfb871a-756d-492e-bbfc-c8f0863ecb5d',
                },
              ],
              originNodeId: 'd731aa6d-2566-4d2e-82e5-b512d1612bef',
              copiedFromNodeId: '24389070-8969-4019-9bf5-e636ee3f20ac',
            },
          ],
          hasViewedStep: false,
          stepType: StepType.required,
          ctas: getDefaultStepCtas({
            stepType: StepType.required,
            ...commonCtaGetterArgs,
          }),
          nextStep: undefined,
          previousStep: undefined,
        },
      ],
    },
  ],
};

export default placeholderCardGuide;
