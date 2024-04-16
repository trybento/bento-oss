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

const FORM_FACTOR = GuideFormFactor.sidebar;
const THEME = Theme.nested;

const commonCtaGetterArgs: Omit<DefaultStepCtaGetterArgs, 'stepType'> = {
  guideFormFactor: FORM_FACTOR,
  branchingMultiple: undefined,
  branchingType: undefined,
  theme: THEME,
};

const guideEntityId = 'f7310b2d-0711-4dc3-95e4-af52df477226' as GuideEntityId;
const moduleEntityId = 'aa50f8e9-8931-4773-a370-4a78725ad0a1' as ModuleEntityId;
const stepEntityIds = [
  'f8f8ed60-1bb1-4123-8e55-22420370c4b5',
  '39b42848-ef94-4dd9-a075-b49ed76aa018',
  '868109cd-a661-4589-9e12-8f81ba5b3567',
] as StepEntityId[];

const standardGuide: Omit<FullGuide, 'steps'> = {
  __typename: EmbedTypenames.guide,
  isPreview: true,
  entityId: guideEntityId,
  name: 'Creating & managing guides',
  theme: THEME,
  type: GuideTypeEnum.user,
  isSideQuest: true,
  designType: GuideDesignType.everboarding,
  completionState: GuideCompletionState.incomplete,
  isComplete: false,
  isDone: false,
  isViewed: false,
  isDestination: false,
  completedStepsCount: 0,
  totalSteps: 3,
  firstIncompleteModule: moduleEntityId,
  firstIncompleteStep: stepEntityIds[0],
  orderIndex: 0,
  description:
    'Learn the core concepts of building and previewing guides in Bento.',
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
      entityId: moduleEntityId,
      guide: guideEntityId,
      name: '🏗  Building templates in Bento',
      orderIndex: 0,
      isComplete: false,
      completedStepsCount: 0,
      totalStepsCount: 3,
      steps: [
        {
          entityId: stepEntityIds[0],
          mediaReferences: [],
          isComplete: false,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          state: StepState.incomplete,
          module: moduleEntityId,
          guide: guideEntityId,
          name: '🍿 Overview (the what & the why)',
          orderIndex: 0,
          bodySlate: [
            {
              id: 'def36d2b-f514-4dd3-83e8-6b2fa4ef4a06',
              type: 'paragraph',
              children: [
                {
                  h2: true,
                  id: '5248fb22-738f-4161-b8e7-85aa397e2822',
                  text: 'What does success look like?',
                  type: 'text',
                  originNodeId: 'c9d48fbb-1399-4617-a70a-1a00529210e6',
                  copiedFromNodeId: '0097ecc5-499b-4f93-9f45-e6f14b480fad',
                },
              ],
              originNodeId: '4c361145-2e3a-4553-9433-0bbeb3b1113f',
              copiedFromNodeId: '93baafa2-b3ae-4fc6-95ed-cb4cb3fe2e7e',
            },
            {
              id: '170d15a8-9176-4c67-8927-bb5ae52760ee',
              type: 'paragraph',
              children: [
                {
                  id: '285ec1bc-1d2a-4a42-88a2-421a5c83256f',
                  text: 'Bento enables you to build modular onboarding (and everboarding) flows for new customers. But hopefully you knew that already – otherwise, how did you find this?',
                  type: 'text',
                  originNodeId: '0a58d60a-289e-41ee-851c-ac928421cd51',
                  copiedFromNodeId: '1dfb871a-756d-492e-bbfc-c8f0863ecb5d',
                },
              ],
              originNodeId: 'd731aa6d-2566-4d2e-82e5-b512d1612bef',
              copiedFromNodeId: '24389070-8969-4019-9bf5-e636ee3f20ac',
            },
            {
              id: 'f47c957a-720e-4b8e-bd12-65015fd4987f',
              type: 'paragraph',
              children: [
                {
                  id: 'a1f574a0-f127-4cfc-b634-9fe430431f74',
                  text: 'But more importantly, we want ',
                  type: 'text',
                  originNodeId: '59db0d6b-807c-4219-a1b9-03548c17a5ad',
                  copiedFromNodeId: 'f760b8f5-a550-4ffd-80b0-d2f47408f297',
                },
                {
                  id: '3483bf95-49c0-4e1e-b7ad-7fda48e6b64f',
                  bold: true,
                  text: 'you',
                  type: 'text',
                  originNodeId: '59db0d6b-807c-4219-a1b9-03548c17a5ad',
                  copiedFromNodeId: 'af86eeed-63c6-4f09-8246-42c6def57b95',
                },
                {
                  id: '51f49fc1-07d4-414f-a535-36c0c37f3b4a',
                  text: ' to feel that success for yourself. ',
                  type: 'text',
                  originNodeId: '59db0d6b-807c-4219-a1b9-03548c17a5ad',
                  copiedFromNodeId: 'ab0ef766-9e26-499c-943a-bb7ce929f947',
                },
              ],
              originNodeId: '03d00f5b-9db7-4ca9-8012-d2f012af5ec0',
              copiedFromNodeId: '07535d35-faa3-4f19-9820-bddeda8dadd8',
            },
            {
              id: '76b1ff92-2acc-423c-8865-95f2ed72efbe',
              type: 'callout',
              children: [
                {
                  id: '534b3b66-a5d9-489f-a8d5-3864d877c969',
                  type: 'paragraph',
                  children: [
                    {
                      text: 'We believe your first moment of success is when ',
                      type: 'text',
                    },
                    {
                      id: 'c2cfbaf6-fe27-422c-bb1c-08e4c083beb9',
                      bold: true,
                      text: "you've built the simple steps of an onboarding checklist and can see it live in your app.",
                      type: 'text',
                    },
                  ],
                  originNodeId: 'dd67492d-280f-4afd-9266-cb15c08b81e7',
                  copiedFromNodeId: '25c411aa-4601-499c-a975-b30adb0e32de',
                },
              ],
              calloutType: 'tip',
              originNodeId: '59997d6b-335c-415a-9cce-363600d1f8ff',
              copiedFromNodeId: '905c2baa-75da-4f22-92dd-ff710f5d8554',
            },
            {
              id: '672c5530-ac98-4128-8434-28487409e236',
              type: 'paragraph',
              children: [
                {
                  id: '2a93d6e1-d1b7-44fb-b226-016a6389bed6',
                  text: "Do you agree? If so, let's continue. And if not, give us a shout and let's chat through your goals!",
                  type: 'text',
                  originNodeId: 'd41f7e15-7ad6-4579-94a0-2ca0e1d91e84',
                  copiedFromNodeId: '096433fd-d3a1-4597-8e26-779b18d8eefa',
                },
              ],
              originNodeId: '7cb76053-bb38-42b6-bdaf-a8d070266155',
              copiedFromNodeId: 'db796fd9-f3d4-459f-9f49-0d9c6877f653',
            },
          ],
          hasViewedStep: false,
          stepType: StepType.required,
          ctas: getDefaultStepCtas({
            stepType: StepType.required,
            ...commonCtaGetterArgs,
          }),
          previousStep: undefined,
          nextStep: stepEntityIds[1],
        },
        {
          entityId: stepEntityIds[1],
          mediaReferences: [],
          isComplete: false,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          state: StepState.incomplete,
          module: moduleEntityId,
          guide: guideEntityId,
          name: '🧱  Core concepts to know',
          orderIndex: 1,
          bodySlate: [
            {
              type: 'paragraph',
              children: [
                {
                  h2: true,
                  text: 'And now, the "how"',
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
                  text: "So we're off building your guide! The first thing to know is that Bento is structured as modules and guides.",
                  type: 'text',
                  originNodeId: 'd6f0469b-8952-4429-abb5-81b553596467',
                  copiedFromNodeId: 'a2de41c6-291f-4366-bb22-c5a3e0ed2baa',
                },
              ],
              originNodeId: '09f5d4c8-cf58-4512-933b-81778cba30aa',
              copiedFromNodeId: '8c36d734-da49-4548-9ce1-56a16a84af2f',
            },
            {
              id: '20537bf8-c1c5-4fdf-bd39-779304767e9a',
              type: 'paragraph',
              children: [
                {
                  id: '48ab4dd8-e961-43a2-b6ca-ce9dfe991f63',
                  text: 'Think of Bento ',
                  type: 'text',
                  originNodeId: '2e302dd9-4ace-46a4-820f-fe5fa87300c2',
                  copiedFromNodeId: '67c528ba-acf4-45b2-8f9a-04b4e49d104b',
                },
                {
                  id: 'cea1ed83-1d1e-4c63-8294-dc429406d686',
                  bold: true,
                  text: 'guides',
                  type: 'text',
                  originNodeId: '1d32fd95-4021-4a0c-a03b-82a54a351d8c',
                  copiedFromNodeId: '0fcc42cb-a144-49f2-a240-6782a1995fbc',
                },
                {
                  id: 'c26048d3-904c-497a-9640-babc8a24ddfb',
                  text: ' as a ',
                  type: 'text',
                  originNodeId: 'cdb98699-bdeb-4e84-8500-59d0bce5afd8',
                  copiedFromNodeId: '03406283-3d8d-43fa-a819-33cc6de7f1eb',
                },
                {
                  text: '📚',
                  type: 'text',
                },
                {
                  id: 'ffbae091-b18d-4045-bf13-fe7de955c7b5',
                  text: '"book" and its ',
                  type: 'text',
                  originNodeId: '4c467886-abd8-4f18-82fb-bcf2c68e3693',
                  copiedFromNodeId: '3f1fd543-0067-4649-b54b-01eef6f2768f',
                },
                {
                  id: '38b080a0-785d-4574-b95f-ae82420876f0',
                  bold: true,
                  text: 'modules ',
                  type: 'text',
                  originNodeId: '7c09cde1-74fe-496d-bb0a-a79442337ff3',
                  copiedFromNodeId: '65693b73-a60e-4ab0-b2c0-dd0563c3f4e4',
                },
                {
                  id: '33cf5398-0e2b-4564-9fe7-4894d344e085',
                  text: 'as chapters of that book. ',
                  type: 'text',
                  originNodeId: 'cf008463-3e12-4993-a16c-9b1872c226da',
                  copiedFromNodeId: 'e0442436-fb0e-4b7b-a8cd-c5b3c483e8ff',
                },
                {
                  id: '82cd4a54-d9c2-444f-bbbc-3703278847bc',
                  text: "What you're reading right now is a ",
                  type: 'text',
                  originNodeId: '7310b0de-8e8c-4a58-98ab-3f98e556d747',
                  copiedFromNodeId: 'b2850250-c9b3-43ed-98e5-9b7ae7748b46',
                },
                {
                  id: '858ef3fc-7b97-4184-866f-1953725bc5d2',
                  bold: true,
                  text: 'step',
                  type: 'text',
                  originNodeId: '7310b0de-8e8c-4a58-98ab-3f98e556d747',
                  copiedFromNodeId: '6cbc37eb-e59e-40c3-be3d-cfe060dfe766',
                },
                {
                  id: 'a73c1ebe-bace-4d25-a601-ef5aed29a427',
                  text: '.',
                  type: 'text',
                  originNodeId: '7310b0de-8e8c-4a58-98ab-3f98e556d747',
                  copiedFromNodeId: '68b6cfa1-f21e-4be5-bbbe-cd1fda75b9bd',
                },
              ],
              originNodeId: '7470133e-f6c0-4ea3-80b6-86ae6b3277a7',
              copiedFromNodeId: '54b80401-807f-45ea-82d6-dd2ef68dce82',
            },
            {
              id: '94ab26d8-1885-497d-bec7-6c43a99ff940',
              type: 'callout',
              children: [
                {
                  text: "✨ We recommend building a few modules first (what's a bucket of steps a user needs to take to get to value?) and then you can add them to a guide. That way, you don't have to figure out the ",
                },
                {
                  text: 'order',
                  italic: true,
                },
                {
                  text: ' of operations just yet.',
                },
              ],
              calloutType: 'info',
              originNodeId: '19e4508f-2096-4511-90be-ba243270054e',
              copiedFromNodeId: '3dd12382-f9ac-47e6-9737-a31cc0a5f854',
            },
            {
              id: '0420a7fd-1ee7-49fe-9a9e-27a73eb7aa8c',
              url: 'https://uploads.trybento.co/media/0016238c-6010-11eb-8c72-a7c10548a5e9/154fa9a5-588c-47a4-8949-0f3afb1ebc39_ScreenShot2021-05-21at5.40.40PM.png',
              type: 'paragraph',
              children: [
                {
                  text: '',
                },
              ],
              originNodeId: 'eaaa797c-6227-48b6-a8c2-c75d5df5b7b8',
              copiedFromNodeId: 'aaaa796c-226b-4b43-ac9e-3b0364439da3',
            },
            {
              id: '0807a10c-6f97-4ff4-8beb-c200ee2c4e00',
              type: 'paragraph',
              children: [
                {
                  text: '',
                },
              ],
              originNodeId: '5446bee2-ada9-41ff-ad7a-de9d8d9a9170',
              copiedFromNodeId: '0c371a17-e99d-437d-bf2e-f9f1b4e6780d',
            },
          ],
          hasViewedStep: false,
          stepType: StepType.fyi,
          ctas: [
            {
              text: '📕 Build modules',
              type: StepCtaType.urlComplete,
              style: StepCtaStyle.solid,
              url: 'https://everboarding.trybento.co/library/step-groups',
              settings: getDefaultCtaSetting(FORM_FACTOR),
            },
          ],
          previousStep: stepEntityIds[0],
          nextStep: stepEntityIds[2],
        },
        {
          entityId: stepEntityIds[2],
          mediaReferences: [],
          isComplete: false,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          state: StepState.incomplete,
          module: moduleEntityId,
          guide: guideEntityId,
          name: '📝  Build step details',
          orderIndex: 2,
          bodySlate: [
            {
              type: 'paragraph',
              children: [
                {
                  text: "Now you're building the core – steps! Steps can be tracked, so we recommend a mix of ",
                  type: 'text',
                },
                {
                  bold: true,
                  text: 'informative ',
                  type: 'text',
                },
                {
                  text: '(like this)',
                  type: 'text',
                },
                {
                  bold: true,
                  text: ' and required',
                  type: 'text',
                },
                {
                  text: ' steps.',
                  type: 'text',
                },
              ],
            },
            {
              id: '3153af33-7ab4-4414-b268-643c7d3f8ca0',
              type: 'callout',
              children: [
                {
                  text: 'As for content? Switch it up! some users prefer watching videos, while others prefer GIFs and screenshots',
                  type: 'text',
                },
              ],
              calloutType: 'info',
              originNodeId: 'c945ef1a-7ecb-45e8-821e-362a552f4681',
              copiedFromNodeId: '856df487-cafd-4349-8b9f-0f69a2e446a6',
            },
            {
              id: 'edb5907c-1b86-4f7c-befb-33e1531ca72f',
              type: 'paragraph',
              children: [
                {
                  h2: true,
                  id: 'd0d94f7b-8949-4361-922b-758dbe2cbf7e',
                  text: 'Tips',
                  type: 'text',
                  originNodeId: 'c97c505e-b36a-4df9-b8a2-630b160fa6cf',
                  copiedFromNodeId: 'd0e89b4c-be08-4faa-885a-4c3bc78e6ac1',
                },
              ],
              originNodeId: '13b017be-03eb-412f-a721-0470395a6386',
              copiedFromNodeId: '7d5379fa-b50b-4f7c-b387-c1f31a9f62e9',
            },
            {
              type: 'numbered-list',
              children: [
                {
                  id: '8d1be51c-3121-4315-bad2-490be055f8af',
                  type: 'list-item',
                  children: [
                    {
                      id: 'c69c9174-f25b-43ab-bf9f-276800ccc604',
                      text: 'Keep it ',
                      type: 'text',
                    },
                    {
                      bold: true,
                      text: 'action oriented',
                      type: 'text',
                    },
                  ],
                  originNodeId: '1b8594b6-37d6-4379-b704-f8a7acb2318c',
                  copiedFromNodeId: '0a453c79-c40e-4643-9608-43d87d936738',
                },
                {
                  type: 'list-item',
                  children: [
                    {
                      text: 'Keep it ',
                      type: 'text',
                    },
                    {
                      bold: true,
                      text: 'short. ',
                      type: 'text',
                    },
                    {
                      text: 'If you need more, link out to a longer doc',
                      type: 'text',
                    },
                  ],
                },
                {
                  type: 'list-item',
                  children: [
                    {
                      text: 'Use ',
                      type: 'text',
                    },
                    {
                      bold: true,
                      text: 'bullets',
                      type: 'text',
                    },
                    {
                      text: ' and ',
                      type: 'text',
                    },
                    {
                      bold: true,
                      text: 'lists',
                      type: 'text',
                    },
                    {
                      text: ' or ',
                      type: 'text',
                    },
                    {
                      bold: true,
                      text: 'images / gifs',
                      type: 'text',
                    },
                    {
                      text: ' (check out the + menu)',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
            {
              id: '2e913f27-fe65-44de-bdd3-a623b1c26ff7',
              type: 'paragraph',
              children: [
                {
                  text: '',
                  type: 'text',
                },
                {
                  id: '407ba95a-d10a-4e48-a621-bbb2494b329c',
                  url: 'https://uploads.trybento.co/media/0016238c-6010-11eb-8c72-a7c10548a5e9/e7d087ad-d632-411d-bfdd-c1d47eb9cd81_drag_drop.gif',
                  type: 'image',
                  children: [
                    {
                      text: '',
                    },
                  ],
                  originNodeId: 'a911df11-6cd8-4540-973e-fdb8622545e7',
                  copiedFromNodeId: '08834f7b-a41e-42d1-90a5-0c1475a64086',
                },
                {
                  text: '☝️ ',
                },
                {
                  text: 'Btw, you can drag and drop steps by hovering over the row',
                  type: 'text',
                },
              ],
              originNodeId: '976d9902-b1aa-4fd5-9f27-c4b03a6a95d2',
              copiedFromNodeId: '94f3f105-e282-40d0-a6d3-15ec244a8612',
            },
          ],
          hasViewedStep: false,
          stepType: StepType.fyi,
          ctas: getDefaultStepCtas({
            stepType: StepType.fyi,
            ...commonCtaGetterArgs,
          }),
          previousStep: stepEntityIds[1],
          nextStep: undefined,
        },
      ],
    },
  ],
};

export default standardGuide;
