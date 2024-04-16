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
  TooltipShowOn,
  TooltipSize,
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
import sampleTooltipTaggedElement from './sampleTooltipTaggedElement';

const FORM_FACTOR = GuideFormFactor.tooltip;
const THEME = Theme.nested;
const ctaSettings = getDefaultCtaSetting(FORM_FACTOR);

const guideEntityId = 'c396582d-ad4f-4a86-a7c4-644db05d9e5d' as GuideEntityId;
const moduleEntityId = '236149ed-bb30-40b8-a566-65be812a4379' as ModuleEntityId;
const stepEntityIds = [
  '160f7e1e-4b3d-4ed5-9652-e7dbe10fcadd',
] as StepEntityId[];

const sampleTooltipGuide: Omit<FullGuide, 'steps'> = {
  __typename: EmbedTypenames.guide,
  isPreview: true,
  entityId: guideEntityId,
  name: '',
  theme: THEME,
  type: GuideTypeEnum.user,
  formFactor: FORM_FACTOR,
  formFactorStyle: {
    hasArrow: true,
    hasBackgroundOverlay: false,
    tooltipShowOn: TooltipShowOn.hover,
    tooltipSize: TooltipSize.small,
  },
  isSideQuest: true,
  designType: GuideDesignType.everboarding,
  firstIncompleteModule:
    '236149ed-bb30-40b8-a566-65be812a4379' as ModuleEntityId,
  firstIncompleteStep: '160f7e1e-4b3d-4ed5-9652-e7dbe10fcadd' as StepEntityId,
  completionState: GuideCompletionState.incomplete,
  isComplete: false,
  isDone: false,
  isViewed: false,
  isDestination: false,
  completedStepsCount: 0,
  totalSteps: 1,
  pageTargeting: {
    type: GuidePageTargetingType.visualTag,
    url: undefined,
  },
  pageTargetingType: GuidePageTargetingType.visualTag,
  pageTargetingUrl: null,
  orderIndex: 0,
  isCyoa: false,
  canResetOnboarding: false,
  taggedElements: [
    {
      ...sampleTooltipTaggedElement,
      entityId: '2859e600-4186-4f33-84a5-11e33c4ac875',
      guide: guideEntityId,
      formFactor: GuideFormFactor.tooltip,
    },
  ],
  modules: [
    {
      guide: guideEntityId,
      entityId: moduleEntityId,
      name: '',
      orderIndex: 0,
      isComplete: false,
      completedStepsCount: 0,
      totalStepsCount: 1,
      steps: [
        {
          isPreview: true,
          mediaReferences: [],
          guide: guideEntityId,
          module: moduleEntityId,
          entityId: stepEntityIds[0],
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
              text: 'Learn more',
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
                  text: 'The way we think you should use a tag, is less about calling out where people should click, and more about providing that extra context that is sometimes needed.',
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

export default sampleTooltipGuide;
