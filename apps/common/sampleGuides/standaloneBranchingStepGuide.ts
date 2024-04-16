import { DefaultStepCtaGetterArgs, getDefaultStepCtas } from '../data/helpers';
import {
  BranchingEntityType,
  CYOABackgroundImagePosition,
  GuideCompletionState,
  GuideDesignType,
  GuideFormFactor,
  GuidePageTargetingType,
  GuideTypeEnum,
  StepType,
  Theme,
} from '../types';
import {
  BranchingChoiceKey,
  BranchingFormFactor,
  BranchingKey,
  EmbedTypenames,
  FullGuide,
  GuideEntityId,
  ModuleEntityId,
  StepEntityId,
  StepState,
} from '../types/globalShoyuState';

const FORM_FACTOR = GuideFormFactor.inline;
const THEME = Theme.nested;

const commonCtaGetterArgs: Omit<DefaultStepCtaGetterArgs, 'stepType'> = {
  guideFormFactor: FORM_FACTOR,
  branchingMultiple: undefined,
  branchingType: undefined,
  theme: THEME,
};

const sampleStandaloneBranchingStepGuide: Omit<FullGuide, 'steps'> = {
  __typename: EmbedTypenames.guide,
  entityId: 'f84f403f-939a-4ba4-a851-877dd01ef6ec' as GuideEntityId,
  name: '',
  theme: THEME,
  type: GuideTypeEnum.user,
  description: '',
  completionState: GuideCompletionState.incomplete,
  isComplete: false,
  isDone: false,
  isViewed: false,
  isDestination: false,
  isSideQuest: false,
  designType: GuideDesignType.onboarding,
  formFactor: FORM_FACTOR,
  formFactorStyle: null,
  completedStepsCount: 0,
  totalSteps: 1,
  orderIndex: 0,
  firstIncompleteModule: 'module-0' as ModuleEntityId,
  firstIncompleteStep: 'step-0' as StepEntityId,
  pageTargeting: {
    type: GuidePageTargetingType.anyPage,
    url: undefined,
  },
  pageTargetingType: GuidePageTargetingType.anyPage,
  pageTargetingUrl: null,
  isCyoa: true,
  canResetOnboarding: true,
  taggedElements: [],
  modules: [
    {
      guide: 'f84f403f-939a-4ba4-a851-877dd01ef6ec' as GuideEntityId,
      entityId: 'module-0' as ModuleEntityId,
      name: 'single step test',
      orderIndex: 0,
      isComplete: false,
      completedStepsCount: 0,
      totalStepsCount: 1,
      steps: [
        {
          guide: 'f84f403f-939a-4ba4-a851-877dd01ef6ec' as GuideEntityId,
          mediaReferences: [],
          module: 'module-0' as ModuleEntityId,
          entityId: 'step-0' as StepEntityId,
          isComplete: false,
          wasCompletedAutomatically: false,
          manualCompletionDisabled: false,
          name: 'single step branching',
          orderIndex: 0,
          bodySlate: [
            {
              id: '4324e3f3-1ee8-4bf9-9849-ddccef167b4b',
              type: 'paragraph',
              children: [
                {
                  id: '1940df5d-5615-4bc9-8a96-61f3bf7a8070',
                  text: '',
                  type: 'text',
                  children: null,
                },
              ],
              template: true,
            },
          ],
          hasViewedStep: false,
          stepType: StepType.branching,
          ctas: getDefaultStepCtas({
            stepType: StepType.branching,
            ...commonCtaGetterArgs,
          }),
          state: StepState.incomplete,
          branching: {
            key: '794970b0-e9ff-4fca-bacb-e06b28c659ef' as BranchingKey,
            type: BranchingEntityType.Guide,
            question:
              'A question for your users, like: What is the main thing you want to do?',
            multiSelect: false,
            dismissDisabled: false,
            formFactor: BranchingFormFactor.cards,
            branches: [
              {
                key: 'an_answer' as BranchingChoiceKey,
                label: 'An answer',
                selected: false,
                style: {
                  backgroundImageUrl: null,
                  backgroundImagePosition:
                    CYOABackgroundImagePosition.background,
                },
              },
              {
                key: 'a_different_answer' as BranchingChoiceKey,
                label: 'A different answer',
                selected: false,
                style: {
                  backgroundImageUrl: null,
                  backgroundImagePosition:
                    CYOABackgroundImagePosition.background,
                },
              },
              {
                key: 'a_third_answer' as BranchingChoiceKey,
                label: 'A third answer',
                selected: false,
                style: {
                  backgroundImageUrl: null,
                  backgroundImagePosition:
                    CYOABackgroundImagePosition.background,
                },
              },
            ],
          },
        },
      ],
    },
  ],
};

export default sampleStandaloneBranchingStepGuide;
