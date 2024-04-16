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
import { SAMPLE_IMAGE_MEDIA_REFERENCE_2 } from '../utils/templates';

const FORM_FACTOR = GuideFormFactor.inline;
const THEME = Theme.card;
const GUIDE_ID = 'd710c51c-8cfa-4832-94c4-60750adeg3a8' as GuideEntityId;
const MODULE_IDS = ['079f2a4a-085e-478c-b377-df59da9dc42c' as ModuleEntityId];
const STEP_IDS = ['3042255e-da91-4579-983e-403ee9b7b179' as StepEntityId];
const ctaSettings = getDefaultCtaSetting(FORM_FACTOR);

const cardGuide: Omit<FullGuide, 'steps'> = {
  __typename: EmbedTypenames.guide,
  isPreview: true,
  entityId: GUIDE_ID,
  name: 'Launch your first campaign',
  theme: THEME,
  type: GuideTypeEnum.user,
  isSideQuest: true,
  designType: GuideDesignType.everboarding,
  completionState: GuideCompletionState.incomplete,
  isComplete: false,
  isDone: false,
  isViewed: true,
  isDestination: false,
  completedStepsCount: 0,
  totalSteps: 1,
  firstIncompleteModule: MODULE_IDS[0],
  firstIncompleteStep: STEP_IDS[0],
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
          nextStep: undefined,
          previousStep: undefined,
        },
      ],
    },
  ],
};

export default cardGuide;
