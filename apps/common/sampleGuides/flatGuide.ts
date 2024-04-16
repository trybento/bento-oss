import {
  DefaultStepCtaGetterArgs,
  getDefaultCtaSetting,
  getDefaultStepCtas,
} from '../data/helpers';
import {
  GuideDesignType,
  GuideFormFactor,
  GuideTypeEnum,
  Theme,
  StepType,
  StepCtaType,
  StepCtaStyle,
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

const FORM_FACTOR = GuideFormFactor.legacy;
const THEME = Theme.flat;

const commonCtaGetterArgs: Omit<DefaultStepCtaGetterArgs, 'stepType'> = {
  guideFormFactor: FORM_FACTOR,
  branchingMultiple: undefined,
  branchingType: undefined,
  theme: THEME,
};

const guideEntityId = '1696412d-573f-4b8a-b4ae-2cc36ca9b5dd' as GuideEntityId;
const moduleEntityId = '2604d4f4-9d52-4646-9666-ed5c9da5b83b' as ModuleEntityId;
const stepEntityIds = [
  '2604d4f4-9d52-4646-9666-fd5c9da5b83a',
  '2604d4f4-9d52-4646-9366-fd5c9da5b83a',
  '2604d4f4-9c52-4646-9666-fd5c9da5b83a',
] as StepEntityId[];

const sampleFlatGuide: Omit<FullGuide, 'steps'> = {
  __typename: EmbedTypenames.guide,
  isPreview: true,
  entityId: guideEntityId,
  name: 'The path to success',
  theme: THEME,
  type: GuideTypeEnum.user,
  formFactor: FORM_FACTOR,
  isSideQuest: false,
  designType: GuideDesignType.onboarding,
  nextGuide: null,
  previousGuide: null,
  firstIncompleteModule: moduleEntityId,
  firstIncompleteStep: 'step-0' as StepEntityId,
  completionState: GuideCompletionState.incomplete,
  isComplete: false,
  isDone: false,
  isViewed: true,
  isDestination: false,
  completedStepsCount: 1,
  totalSteps: 3,
  pageTargetingType: null,
  pageTargetingUrl: null,
  orderIndex: 0,
  isCyoa: false,
  canResetOnboarding: false,
  taggedElements: [],
  modules: [
    {
      entityId: moduleEntityId,
      guide: guideEntityId,
      name: 'Introduction',
      orderIndex: 0,
      isComplete: false,
      completedStepsCount: 1,
      totalStepsCount: 3,
      steps: [
        {
          entityId: stepEntityIds[0],
          mediaReferences: [],
          isComplete: true,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          name: '📋 Set up your menu',
          orderIndex: 0,
          hasViewedStep: false,
          stepType: StepType.required,
          ctas: getDefaultStepCtas({
            stepType: StepType.required,
            ...commonCtaGetterArgs,
          }),
          nextStep: stepEntityIds[1],
          state: StepState.incomplete,
          module: moduleEntityId,
          guide: guideEntityId,
          bodySlate: [
            {
              id: 'def36d2b-f514-4dd3-83e8-6b2fa4ef4a06',
              type: 'paragraph',
              children: [
                {
                  id: '5248fb22-738f-4161-b8e7-85aa397e2822',
                  text: 'The main reason people come to restaurant websites is to check out your menu, so let’s start here!',
                  type: 'text',
                  originNodeId: 'c9d48fbb-1399-4617-a70a-1a00529210e6',
                  copiedFromNodeId: '0097ecc5-499b-4f93-9f45-e6f14b480fad',
                },
              ],
              originNodeId: '4c361145-2e3a-4553-9433-0bbeb3b1113f',
              copiedFromNodeId: '93baafa2-b3ae-4fc6-95ed-cb4cb3fe2e7e',
            },
          ],
        },
        {
          entityId: stepEntityIds[1],
          mediaReferences: [],
          isComplete: false,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          name: '🎨 Customize your website',
          orderIndex: 1,
          hasViewedStep: false,
          stepType: StepType.required,
          ctas: [
            {
              text: 'Customize my website',
              type: StepCtaType.urlComplete,
              style: StepCtaStyle.solid,
              url: '',
              settings: getDefaultCtaSetting(FORM_FACTOR),
            },
          ],
          nextStep: stepEntityIds[2],
          previousStep: stepEntityIds[0],
          state: StepState.incomplete,
          module: moduleEntityId,
          guide: guideEntityId,
          bodySlate: [
            {
              id: 'def36d2b-f514-4dd3-83e8-6b2fa4ef4a06',
              type: 'paragraph',
              children: [
                {
                  id: '5248fb22-738f-4161-b8e7-85aa397e2822',
                  text: `AcmeCo makes it easy to give your website personality and flair. We've already started a template for you.`,
                  type: 'text',
                  originNodeId: 'c9d48fbb-1399-4617-a70a-1a00529210e6',
                  copiedFromNodeId: '0097ecc5-499b-4f93-9f45-e6f14b480fad',
                },
              ],
              originNodeId: '4c361145-2e3a-4553-9433-0bbeb3b1113f',
              copiedFromNodeId: '93baafa2-b3ae-4fc6-95ed-cb4cb3fe2e7e',
            },
          ],
        },
        {
          entityId: stepEntityIds[2],
          mediaReferences: [],
          isComplete: false,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          name: '💰 Allow customers to order online',
          orderIndex: 2,
          hasViewedStep: false,
          stepType: StepType.required,
          ctas: [
            {
              text: 'Option A',
              type: StepCtaType.complete,
              style: StepCtaStyle.link,
              url: '',
              settings: getDefaultCtaSetting(FORM_FACTOR),
            },
            {
              text: 'Option B',
              type: StepCtaType.complete,
              style: StepCtaStyle.link,
              url: '',
              settings: getDefaultCtaSetting(FORM_FACTOR),
            },
          ],
          nextStep: null,
          previousStep: stepEntityIds[1],
          state: StepState.incomplete,
          module: moduleEntityId,
          guide: guideEntityId,
          bodySlate: [
            {
              id: 'def36d2b-f514-4dd3-83e8-6b2fa4ef4a06',
              type: 'paragraph',
              children: [
                {
                  id: '5248fb22-738f-4161-b8e7-85aa397e2822',
                  text: 'A recent survey showed that given the option, over 40% of customers would prefer to order directly from your website than using a third party app - AcmeCo online ordering makes it easy!',
                  type: 'text',
                  originNodeId: 'c9d48fbb-1399-4617-a70a-1a00529210e6',
                  copiedFromNodeId: '0097ecc5-499b-4f93-9f45-e6f14b480fad',
                },
              ],
              originNodeId: '4c361145-2e3a-4553-9433-0bbeb3b1113f',
              copiedFromNodeId: '93baafa2-b3ae-4fc6-95ed-cb4cb3fe2e7e',
            },
          ],
        },
      ],
    },
  ],
};

export default sampleFlatGuide;
