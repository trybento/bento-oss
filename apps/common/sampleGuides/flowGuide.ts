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
  GuidePageTargetingType,
} from '../types';
import {
  EmbedTypenames,
  FullGuide,
  GuideEntityId,
  ModuleEntityId,
  StepEntityId,
  StepState,
} from '../types/globalShoyuState';
import sampleTooltipTaggedElement from './sampleTooltipTaggedElement';

const FORM_FACTOR = GuideFormFactor.flow;
const THEME = Theme.nested;

const commonCtaGetterArgs: Omit<DefaultStepCtaGetterArgs, 'stepType'> = {
  guideFormFactor: FORM_FACTOR,
  branchingMultiple: undefined,
  branchingType: undefined,
  theme: THEME,
};

const guideEntityId = 'cc0349b9-290e-4af2-93d8-1a76f44c5802' as GuideEntityId;
const moduleEntityId = '5dd17e6c-7b9b-4c27-8537-4fb1174360e2' as ModuleEntityId;
const stepEntityIds = [
  'f2aa92c2-b123-4d8b-bd85-0ac52cc55361',
  'feba8810-ecbd-40de-84f0-9e50db0ef825',
  'fc23deb0-d56a-4ed4-8331-a0fe4446c08e',
] as StepEntityId[];

const sampleFlowGuide: Omit<FullGuide, 'steps'> = {
  __typename: EmbedTypenames.guide,
  isPreview: true,
  entityId: guideEntityId,
  name: 'Sample flow guide',
  theme: THEME,
  type: GuideTypeEnum.user,
  formFactor: FORM_FACTOR,
  isSideQuest: false,
  designType: GuideDesignType.onboarding,
  nextGuide: null,
  previousGuide: null,
  /** Still required to prevent general guide helpers crashing */
  pageTargeting: { type: GuidePageTargetingType.visualTag, url: undefined },
  firstIncompleteModule: moduleEntityId,
  firstIncompleteStep: stepEntityIds[0],
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
  taggedElements: [
    {
      ...sampleTooltipTaggedElement,
      entityId: '45ede8cb-4b1c-4222-9d26-c70faba628f4',
      guide: guideEntityId,
      step: stepEntityIds[0],
      formFactor: GuideFormFactor.flow,
    },
    {
      ...sampleTooltipTaggedElement,
      entityId: '66ffb190-7724-4e7f-8919-66ceae3d4a84',
      guide: guideEntityId,
      step: stepEntityIds[1],
      formFactor: GuideFormFactor.flow,
    },
  ],
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

export default sampleFlowGuide;
