import {
  GuideDesignType,
  GuideFormFactor,
  GuidePageTargetingType,
  GuideTypeEnum,
  StepCtaStyle,
  StepCtaType,
  Theme,
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
import { getDefaultCtaSetting } from '../data/helpers';

const FORM_FACTOR = GuideFormFactor.banner;
const THEME = Theme.nested;
const ctaSettings = getDefaultCtaSetting(FORM_FACTOR);

const sampleBannerGuide: Omit<FullGuide, 'steps'> = {
  __typename: EmbedTypenames.guide,
  isPreview: true,
  entityId: '01eeb632-5b3c-4149-9a57-97570f301c6d' as GuideEntityId,
  name: 'Banner',
  theme: THEME,
  type: GuideTypeEnum.user,
  formFactor: FORM_FACTOR,
  isSideQuest: true,
  designType: GuideDesignType.announcement,
  firstIncompleteModule:
    '01ec28eb-a124-4c66-a727-9557e8e20f4c' as ModuleEntityId,
  firstIncompleteStep: '4f2b0d1b-33df-47f9-acdf-62d2114797fb' as StepEntityId,
  completionState: GuideCompletionState.incomplete,
  isComplete: false,
  isDone: false,
  isViewed: false,
  isDestination: false,
  completedStepsCount: 0,
  totalSteps: 1,
  pageTargeting: {
    type: GuidePageTargetingType.anyPage,
    url: undefined,
  },
  pageTargetingType: GuidePageTargetingType.anyPage,
  pageTargetingUrl: null,
  orderIndex: 0,
  isCyoa: false,
  canResetOnboarding: false,
  taggedElements: [],
  modules: [
    {
      guide: '01eeb632-5b3c-4149-9a57-97570f301c6d' as GuideEntityId,
      entityId: '01ec28eb-a124-4c66-a727-9557e8e20f4c' as ModuleEntityId,
      name: '',
      orderIndex: 0,
      isComplete: false,
      completedStepsCount: 0,
      totalStepsCount: 1,
      steps: [
        {
          guide: '01eeb632-5b3c-4149-9a57-97570f301c6d' as GuideEntityId,
          mediaReferences: [],
          module: '01ec28eb-a124-4c66-a727-9557e8e20f4c' as ModuleEntityId,
          entityId: '4f2b0d1b-33df-47f9-acdf-62d2114797fb' as StepEntityId,
          isComplete: false,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          name: '',
          orderIndex: 0,
          hasViewedStep: false,
          stepType: StepType.required,
          ctas: [
            {
              type: StepCtaType.url,
              style: StepCtaStyle.link,
              text: 'Read more',
              settings: ctaSettings,
            },
          ],
          state: StepState.incomplete,
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
      ],
    },
  ],
};

export default sampleBannerGuide;
