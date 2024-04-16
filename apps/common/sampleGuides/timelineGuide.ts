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
} from 'bento-common/types';
import {
  EmbedTypenames,
  FullGuide,
  GuideEntityId,
  ModuleEntityId,
  StepEntityId,
  StepState,
} from 'bento-common/types/globalShoyuState';
import { getDefaultCtaSetting } from '../data/helpers';
import {
  SAMPLE_FAKE_IMAGE_URL_2,
  SAMPLE_IMAGE_MEDIA_REFERENCE_2,
} from '../utils/templates';

const FORM_FACTOR = GuideFormFactor.inline;
const THEME = Theme.timeline;
const GUIDE_ID = 'b6538f55-644d-4d21-9758-2e131ba76adf' as GuideEntityId;
const MODULE_IDS = ['3ff10961-41e7-47ab-af7f-43c766e79d87' as ModuleEntityId];
const STEP_IDS = [
  'bd763e54-50bf-4202-8b7d-401e0101d61e' as StepEntityId,
  'e2aa9964-907a-48f1-9a34-1afc1ffba9c2' as StepEntityId,
  '351bb750-34c9-4f43-920b-90007cd4f785' as StepEntityId,
  'dc496b37-534e-4d86-8c0d-f8629e199190' as StepEntityId,
];
const ctaSettings = getDefaultCtaSetting(FORM_FACTOR);

const timelineGuide: Omit<FullGuide, 'steps'> = {
  __typename: EmbedTypenames.guide,
  isPreview: true,
  entityId: GUIDE_ID,
  name: 'Launch your first campaign',
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
  totalSteps: 4,
  firstIncompleteModule: MODULE_IDS[0],
  firstIncompleteStep: STEP_IDS[1],
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
      entityId: MODULE_IDS[0],
      guide: GUIDE_ID,
      name: 'This step group name should not be displayed',
      orderIndex: 0,
      isComplete: false,
      completedStepsCount: 1,
      totalStepsCount: 4,
      steps: [
        {
          entityId: STEP_IDS[0],
          mediaReferences: [SAMPLE_IMAGE_MEDIA_REFERENCE_2],
          isComplete: true,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          state: StepState.complete,
          module: MODULE_IDS[0],
          guide: GUIDE_ID,
          name: '⬆️ Import your contacts',
          orderIndex: 0,
          bodySlate: [
            {
              id: '115a738a-e66e-47e8-a779-fb47dc26fe93',
              type: 'paragraph',
              children: [
                {
                  text: "Welcome to AcmeCo! We're the favorite platform among carrier pigeon flocks for sending automated and personalized mail.",
                },
              ],
            },
            {
              id: '64005304-c195-4d19-81ff-38fc605c371c',
              url: SAMPLE_FAKE_IMAGE_URL_2,
              type: 'image',
              children: [{ text: '' }],
            },
            {
              id: 'ab324e94-cfe2-40a9-9c89-335e33f4cca9',
              type: 'paragraph',
              children: [{ h2: true, text: 'Import your contacts' }],
            },
            {
              id: '12b1bc3e-fbba-48bf-9810-53a8b0f8b706',
              type: 'paragraph',
              children: [
                {
                  text: 'While our mail delivery is manual, our pigeons are equipped with world class API trackers. Go ahead and upload your contacts here. Make sure to:',
                },
              ],
            },
            {
              id: 'e0b74086-368d-4aef-babf-8262970b67e9',
              type: 'bulleted-list',
              children: [
                {
                  id: '6dea084d-2967-44f7-a99d-2bbd944e3fe7',
                  type: 'list-item',
                  children: [{ text: 'Provide a zip code and country' }],
                },
                {
                  id: '8e1e869c-16d7-4cc1-9b00-20209b087e78',
                  type: 'list-item',
                  children: [
                    {
                      text: 'Denote whether the location is a commercial or residential building',
                    },
                  ],
                },
              ],
            },
          ],
          hasViewedStep: false,
          stepType: StepType.required,
          ctas: [
            {
              text: 'Upload contacts now',
              type: StepCtaType.url,
              style: StepCtaStyle.solid,
              url: 'https://trybento.co',
              settings: ctaSettings,
            },
            {
              text: "I'll do this later",
              type: StepCtaType.skip,
              style: StepCtaStyle.link,
              settings: ctaSettings,
            },
          ],
          nextStep: STEP_IDS[1],
          previousStep: undefined,
        },
        {
          entityId: STEP_IDS[1],
          mediaReferences: [],
          isComplete: false,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          state: StepState.incomplete,
          module: MODULE_IDS[0],
          guide: GUIDE_ID,
          name: '✍️ Create your first campaign',
          orderIndex: 1,
          bodySlate: [
            {
              id: 'c307db0c-36e0-4aec-bac8-fd9f0b0a8969',
              type: 'paragraph',
              children: [
                {
                  text: 'When writing your first campaign, we suggest these best practices:',
                },
              ],
            },
            {
              id: '218e6d10-8287-4a1b-b696-69f01d0f20d6',
              type: 'numbered-list',
              children: [
                {
                  id: '7aa273d7-cc06-4006-9ad6-5c8fc84cc96a',
                  type: 'list-item',
                  children: [
                    { bold: true, text: 'Make it timely.' },
                    {
                      text: " You don't want to send Christmas cards in January!",
                    },
                  ],
                },
                {
                  id: '64332d9d-1a6e-489f-9783-38d26e389ce7',
                  type: 'list-item',
                  children: [
                    { bold: true, text: 'Make it short.' },
                    {
                      text: ' As Abraham Lincoln wisely said: "I didn\'t have time to write you a short letter, so I wrote you a long one." Have better time management than Mr. Lincoln.',
                    },
                  ],
                },
                {
                  id: '31245a9c-523d-4d76-a5ab-49bcb88b252b',
                  type: 'list-item',
                  children: [
                    { bold: true, text: 'Give it personality!' },
                    {
                      text: " After all, you're sending via carrier pigeon. If it were boring, you could have used email.",
                    },
                  ],
                },
              ],
            },
            {
              id: '0db779c0-26a3-44dc-a57c-d71d8209ef3e',
              type: 'paragraph',
              children: [{ text: 'Here are some of our favorite tips:' }],
            },
            {
              id: 'c92553d4-ced7-4b39-b3a0-c7e4864dbf7c',
              type: 'youtube-video',
              videoId: 'Pd-M9U00Ais',
              children: [
                {
                  id: '6a5d1e15-6c86-43c8-b318-afd53195eaab',
                  text: '',
                  type: 'text',
                },
              ],
            },
            {
              id: '9e6c2d24-cc13-4ee3-9bbb-d7d7965414f7',
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ],
          hasViewedStep: false,
          stepType: StepType.required,
          ctas: [
            {
              text: 'Create my first campaign',
              type: StepCtaType.url,
              style: StepCtaStyle.solid,
              url: 'https://trybento.co',
              settings: ctaSettings,
            },
            {
              text: "I'll do this later",
              type: StepCtaType.skip,
              style: StepCtaStyle.link,
              settings: ctaSettings,
            },
          ],
          nextStep: STEP_IDS[2],
          previousStep: STEP_IDS[0],
        },
        {
          entityId: STEP_IDS[2],
          mediaReferences: [],
          isComplete: false,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          state: StepState.incomplete,
          module: MODULE_IDS[0],
          guide: GUIDE_ID,
          name: '👀 Preview and iterate',
          orderIndex: 2,
          bodySlate: [
            {
              id: '668a27fe-2451-4d69-97f6-58a65ac79d67',
              type: 'paragraph',
              children: [
                {
                  text: 'Our state-of-the-art letter writing software allows you to send sample letters to friends, who get a real pigeon delivery experience. They can also attach a response which will be mailed back to you.',
                },
              ],
            },
            {
              id: '0204511c-fac3-490c-a8a8-817d91eab046',
              url: 'https://s3-us-west-1.amazonaws.com/uploads-staging.trybento.co/media/0016238c-6010-11eb-8c72-a7c10548a5e9/46705513-6903-4903-b47c-387865404ae7_survey.jpeg',
              type: 'image',
              children: [{ text: '' }],
            },
            {
              id: '43ea418e-5686-484d-bf74-3753619ed4b1',
              type: 'paragraph',
              children: [
                { h2: true, text: 'Designing a great feedback survey' },
              ],
            },
            {
              id: '7b06c9e1-f174-46bf-8a92-34ebeaa9510d',
              type: 'paragraph',
              children: [
                {
                  text: 'Our survey tool is straightforward, and we even give you 2 templates to work off of. But our take is that you should:',
                },
              ],
            },
            {
              id: 'b58da9aa-c794-41ba-bed3-532ba9c787fd',
              type: 'bulleted-list',
              children: [
                {
                  id: '4dd61d88-00d7-4ad7-b81c-f25e780b7fe3',
                  type: 'list-item',
                  children: [
                    { text: 'Pair quantitative feedback with qualitative' },
                  ],
                },
                {
                  id: '020c652f-c5af-4a00-bfe1-6ae018fb544a',
                  type: 'list-item',
                  children: [
                    {
                      text: 'For example, ask your friend to rate the quality of the letter on a scale, and also ask if they have additional suggestions on how to make it better.',
                    },
                  ],
                },
                {
                  id: '1bc99e08-2bd0-4a0c-b664-a09e0f6da324',
                  type: 'list-item',
                  children: [
                    { text: 'A specific question could be: ' },
                    {
                      text: '"What sentence did you gloss over (and therefore I can drop)?"',
                      italic: true,
                    },
                  ],
                },
              ],
            },
          ],
          hasViewedStep: false,
          stepType: StepType.required,
          ctas: [
            {
              text: 'Done',
              type: StepCtaType.complete,
              style: StepCtaStyle.solid,
              settings: ctaSettings,
            },
            {
              text: 'Skip',
              type: StepCtaType.skip,
              style: StepCtaStyle.link,
              settings: ctaSettings,
            },
          ],
          nextStep: STEP_IDS[3],
          previousStep: STEP_IDS[1],
        },
        {
          entityId: STEP_IDS[3],
          mediaReferences: [],
          isComplete: false,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          state: StepState.incomplete,
          module: MODULE_IDS[0],
          guide: GUIDE_ID,
          name: '🚀 Feed and set live!',
          orderIndex: 3,
          bodySlate: [
            {
              id: '483dc742-0206-4d53-ae98-25c4bc4c597d',
              type: 'paragraph',
              children: [
                { text: 'Our carrier pigeons can fly up to ' },
                { bold: true, text: '800 miles' },
                {
                  text: " in any weather conditions to deliver your letters safely. When you're ready to send your first campaign, go ahead and deposit feed into the carrier pigeon feeding zone.",
                },
              ],
            },
            {
              id: 'a1e4e3f4-4da3-46bd-af8d-4dff54aa58c8',
              type: 'paragraph',
              children: [
                { text: '' },
                {
                  id: '098b5c64-81b5-4f17-8cd3-0a4812e41bc3',
                  url: 'http://trybento.co',
                  type: 'link',
                  children: [{ text: 'Read more' }],
                },
                {
                  text: ' about our guidance for how much food per mile you should deposit.',
                },
              ],
            },
            {
              id: 'e0202554-17c6-4a6f-929f-cd2cf4042bef',
              type: 'youtube-video',
              videoId: 'qCEZENykjd8',
              children: [
                {
                  id: 'c560b9fa-98c3-4490-b49a-e9b92b513aa9',
                  text: '',
                  type: 'text',
                },
              ],
            },
            {
              id: '90e6a440-d05d-451c-887b-d4a1217e2f47',
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ],
          hasViewedStep: false,
          stepType: StepType.required,
          ctas: [
            {
              text: 'Done',
              type: StepCtaType.complete,
              style: StepCtaStyle.solid,
              settings: ctaSettings,
            },
          ],
          nextStep: undefined,
          previousStep: STEP_IDS[2],
        },
      ],
    },
  ],
};

export default timelineGuide;
