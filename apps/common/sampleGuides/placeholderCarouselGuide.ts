import {
  DefaultStepCtaGetterArgs,
  getDefaultCtaSetting,
  getDefaultStepCtas,
} from '../data/helpers';
import {
  GuideFormFactor,
  GuideTypeEnum,
  Theme,
  GuideDesignType,
  GuidePageTargetingType,
  StepType,
  StepCtaStyle,
  StepCtaType,
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
const THEME = Theme.carousel;

const commonCtaGetterArgs: Omit<DefaultStepCtaGetterArgs, 'stepType'> = {
  guideFormFactor: FORM_FACTOR,
  branchingMultiple: undefined,
  branchingType: undefined,
  theme: THEME,
};

const guide = '5ff38430-3145-4387-b8c4-86d01c0db307' as GuideEntityId;
const modules = ['41dbd002-d482-4f73-b787-398d82e65bcb' as ModuleEntityId];
const steps = [
  'c359136c-0c4f-4ad8-ac05-6ead75c9346b' as StepEntityId,
  '0e27f5ee-77c8-4ab8-bd63-3ac49a377b44' as StepEntityId,
  '59d7d0bf-40e0-4a58-9758-ec70c6d1ac62' as StepEntityId,
];
const ctaSettings = getDefaultCtaSetting(FORM_FACTOR);

const placeholderCarouselGuide: Omit<FullGuide, 'steps'> = {
  __typename: EmbedTypenames.guide,
  isPreview: true,
  entityId: guide,
  name: 'This is an example of an "inline" guide',
  theme: THEME,
  type: GuideTypeEnum.user,
  isSideQuest: false,
  designType: GuideDesignType.onboarding,
  completionState: GuideCompletionState.incomplete,
  isComplete: false,
  isDone: false,
  isViewed: true,
  isDestination: false,
  completedStepsCount: 1,
  totalSteps: 3,
  firstIncompleteStep: steps[2],
  firstIncompleteModule: modules[1],
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
      isComplete: true,
      completedStepsCount: 1,
      totalStepsCount: 3,
      steps: [
        {
          entityId: steps[0],
          mediaReferences: [],
          isComplete: true,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          state: StepState.complete,
          module: modules[0],
          guide,
          name: 'This is a completed step',
          orderIndex: 0,
          bodySlate: [
            {
              id: '170d15a8-9176-4c67-8927-bb5ae52760ee',
              type: 'paragraph',
              children: [
                {
                  id: '285ec1bc-1d2a-4a42-88a2-421a5c83256f',
                  text: 'Guides using the compact theme will slide the content of a step in when the user selects it.',
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
          nextStep: steps[1],
          previousStep: undefined,
        },
        {
          entityId: steps[1],
          mediaReferences: [],
          isComplete: false,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          state: StepState.incomplete,
          module: modules[0],
          guide,
          name: 'This is a typical step',
          orderIndex: 0,
          bodySlate: [
            {
              id: '70d5703d-a76d-4d36-8a8e-1ac47d277a98',
              type: 'paragraph',
              children: [
                {
                  id: 'abbbe972-2a91-4b9e-85b0-ed422aea101e',
                  text: 'Bento supports a number of cool advanced features! ✨',
                  type: 'text',
                  originNodeId: 'cbd85ff2-8326-4211-b962-b7229f35513c',
                  copiedFromNodeId: '78ea6af4-c736-429f-b1ee-b7df7f174b3d',
                },
              ],
              originNodeId: 'e74f5b60-83f9-42bf-96c2-6093961508bc',
              copiedFromNodeId: 'f604f158-e4dd-4d1e-b115-25ec54cc7f97',
            },
            {
              id: 'fe486f55-9ca9-418d-b48b-0cf54818d82f',
              type: 'paragraph',
              children: [
                {
                  id: '013b477f-92fe-476a-af8b-0b6bf510ecb2',
                  text: 'Which of these would you like to explore next?',
                  type: 'text',
                  originNodeId: '2617e9a8-8460-416b-9af4-919f9e7544fb',
                  copiedFromNodeId: '3dea5064-660b-43c6-a856-7d774a7ddc66',
                },
              ],
              originNodeId: '5de8ca50-b3a4-47e9-8825-7a07efca9476',
              copiedFromNodeId: 'd24d39e9-c42d-49c0-b424-dbe98e5736d6',
            },
            {
              id: '5b5fde31-4601-4cde-bcfd-fb0fa876a2c7',
              type: 'select',
              options: [
                {
                  label: 'Branching',
                  value: 'branching',
                },
                {
                  label: 'Choose your own adventure',
                  value: 'CYOA',
                },
                {
                  label: 'Automatic step completion',
                  value: 'step_completion',
                },
                {
                  label: 'Launching guides (manual and automatic)',
                  value: 'launching',
                },
                {
                  label: 'Changing content for 1 customer',
                  value: 'customize',
                },
                {
                  label: 'Dynamic URLs / personalized content',
                  value: 'dynamic_attributes',
                },
                {
                  label: 'Commenting & collaboration',
                  value: 'comments',
                },
              ],
              children: [
                {
                  text: '',
                },
              ],
              valueType: 'text',
              placeholder: 'Pick a feature',
              attributeKey: 'advanced_feature',
              originNodeId: '03784fd0-65d0-4ff1-a6ea-a85fa19d3cfd',
              attributeType: 'account_user',
              copiedFromNodeId: '9d94bc26-4dbc-499c-9c22-d65d6fa0355d',
            },
          ],
          hasViewedStep: false,
          stepType: StepType.required,
          ctas: getDefaultStepCtas({
            stepType: StepType.optional,
            ...commonCtaGetterArgs,
          }),
          nextStep: steps[2],
          previousStep: steps[0],
        },
        {
          entityId: steps[2],
          mediaReferences: [],
          isComplete: false,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          state: StepState.incomplete,
          module: modules[0],
          guide,
          name: "And here's another one",
          orderIndex: 1,
          bodySlate: [
            {
              type: 'paragraph',
              children: [
                {
                  h2: true,
                  text: 'Call out the key benefits',
                  type: 'text',
                },
              ],
            },
            {
              id: 'a1e2c4d2-295d-43f4-9582-db9c88b41204',
              type: 'paragraph',
              children: [
                {
                  id: 'c9e490cf-03ca-427d-a0a4-418c241b4403',
                  text: "You'll have room to explain the why and any best practices",
                  type: 'text',
                  originNodeId: 'd6f0469b-8952-4429-abb5-81b553596467',
                  copiedFromNodeId: 'a2de41c6-291f-4366-bb22-c5a3e0ed2baa',
                },
              ],
              originNodeId: '09f5d4c8-cf58-4512-933b-81778cba30aa',
              copiedFromNodeId: '8c36d734-da49-4548-9ce1-56a16a84af2f',
            },
            {
              type: 'bulleted-list',
              children: [
                {
                  id: '8d1be51c-3121-4315-bad2-490be055f8af',
                  type: 'list-item',
                  children: [
                    {
                      id: 'c69c9174-f25b-43ab-bf9f-276800ccc604',
                      text: 'With lots of ways to style',
                      type: 'text',
                    },
                  ],
                  originNodeId: '1b8594b6-37d6-4379-b704-f8a7acb2318c',
                  copiedFromNodeId: '0a453c79-c40e-4643-9608-43d87d936738',
                },
              ],
            },
          ],
          hasViewedStep: false,
          stepType: StepType.required,
          ctas: [
            {
              text: 'Calls to action',
              type: StepCtaType.complete,
              style: StepCtaStyle.solid,
              settings: ctaSettings,
            },
            {
              text: 'Can be styled',
              type: StepCtaType.skip,
              style: StepCtaStyle.link,
              settings: ctaSettings,
            },
          ],
          nextStep: undefined,
          previousStep: steps[1],
        },
      ],
    },
  ],
};

export default placeholderCarouselGuide;
