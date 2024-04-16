import {
  GuideFormFactor,
  GuideTypeEnum,
  Theme,
  GuideDesignType,
  GuidePageTargetingType,
  StepType,
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

const FORM_FACTOR = GuideFormFactor.inline;
const THEME = Theme.videoGallery;
const GUIDE_ID = 'd710c51c-8cfa-4832-94c4-60750addg3a8' as GuideEntityId;
const MODULE_IDS = ['079f2a4a-085e-478c-b377-df59db9dc42c' as ModuleEntityId];
const totalSteps = 2;
const getStepEntityId = (idx: number) =>
  `2042255a-da91-4579-983e-403ee9c7b17${idx}` as StepEntityId;

const guide: Omit<FullGuide, 'steps'> = {
  __typename: EmbedTypenames.guide,
  isPreview: true,
  entityId: GUIDE_ID,
  name: 'Quick start videos',
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
  totalSteps,
  firstIncompleteModule: MODULE_IDS[0],
  firstIncompleteStep: getStepEntityId(0),
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
      completedStepsCount: 0,
      totalStepsCount: totalSteps,
      steps: [...Array(totalSteps)].map((_, idx) => ({
        mediaReferences: [],
        entityId: getStepEntityId(idx),
        isComplete: false,
        wasCompletedAutomatically: false,
        manualCompletionDisabled: false,
        state: StepState.incomplete,
        module: MODULE_IDS[0],
        guide: GUIDE_ID,
        name: `Video title ${idx + 1}`,
        orderIndex: 0,
        bodySlate: [
          {
            id: '182550e5-0b7f-4d0b-8ced-5ead5b5ce47a',
            type: 'youtube-video',
            videoId: 'NpEaa2P7qZI',
            playsInline: true,
            children: [
              {
                text: '',
                type: 'text',
              },
            ],
          },
        ],
        hasViewedStep: false,
        stepType: StepType.required,
        ctas: [],
        nextStep: idx === totalSteps - 1 ? undefined : getStepEntityId(idx + 1),
        previousStep: idx === 0 ? undefined : getStepEntityId(idx - 1),
      })),
    },
  ],
};

export default guide;
