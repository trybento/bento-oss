import { normalize } from 'normalizr';
import {
  EmbedFormFactor,
  GuideCompletionState,
  GuideDesignType,
  GuideFormFactor,
  GuidePageTargetingType,
} from 'bento-common/types';
import standard from 'bento-common/sampleGuides/standardGuide';
import placeholderNestedGuide from 'bento-common/sampleGuides/placeholderNestedGuide';
import sampleFlatGuide from 'bento-common/sampleGuides/flatGuide';
import sampleStandaloneBranchingStepGuide from 'bento-common/sampleGuides/standaloneBranchingStepGuide';
import { SidebarVisibility, View } from 'bento-common/types/shoyuUIState';
import { activeGuidesViews } from 'bento-common/frontend/shoyuStateHelpers';
import { FullGuide } from 'bento-common/types/globalShoyuState';

import normalizrSchema, {
  NormalizedGuidesData,
} from '../stores/mainStore/schema';
import {
  transitionLogic,
  TransitionLogicData,
} from './GuideAndStepTransitions';
import { detectOnboardingInlineEmbed } from '../stores/mainStore/helpers';
import { fakeJourneyWithGuide } from '../system/airTraffic/airTraffic.test.helpers';

jest.mock('../lib/graphqlClient');

jest.mock('../stores/mainStore/helpers', () => ({
  ...jest.requireActual('../stores/mainStore/helpers'),
  detectOnboardingInlineEmbed: jest.fn(),
}));

afterEach(() => {
  jest.resetAllMocks();
});

type CommonTransitionDataDefaults = Pick<
  TransitionLogicData,
  | 'isMainStoreInitialized'
  | 'guideIsHydrated'
  | 'guideWasHydrated'
  | 'newModule'
  | 'lastCYOAGuide'
  | 'prevLastCYOAGuide'
  | 'skipModuleViewIfOnlyOne'
  | 'sidebarVisibility'
  | 'everboardingGuideForPage'
  | 'prevEverboardingGuideForPage'
>;

type TransitionDataDefaults = CommonTransitionDataDefaults &
  Pick<
    TransitionLogicData,
    | 'uiActions'
    | 'animationDelay'
    | 'dispatch'
    | 'selectStep'
    | 'selectGuide'
    | 'activeJourney'
    | 'activeJourneySelectedGuide'
    | 'startJourney'
    | 'endJourney'
    | 'lockAirTraffic'
    | 'unlockAirTraffic'
  >;

const transitionLogicCommonDefaults: CommonTransitionDataDefaults = {
  isMainStoreInitialized: true,
  guideIsHydrated: true,
  guideWasHydrated: true,
  newModule: undefined,
  lastCYOAGuide: undefined,
  prevLastCYOAGuide: undefined,
  skipModuleViewIfOnlyOne: false,
  sidebarVisibility: SidebarVisibility.show,
  everboardingGuideForPage: undefined,
  prevEverboardingGuideForPage: undefined,
};

const pageTargetedContextualGuide: Omit<FullGuide, 'steps'> = {
  ...placeholderNestedGuide,
  pageTargetingType: GuidePageTargetingType.specificPage,
  isSideQuest: true,
  formFactor: GuideFormFactor.sidebar,
  designType: GuideDesignType.everboarding,
};

const {
  result: [
    nestedEntityId,
    flatEntityId,
    branchingEntityId,
    pageTargetedEntityId,
  ],
  entities: { guides, modules, steps },
} = normalize(
  [
    standard,
    sampleFlatGuide,
    sampleStandaloneBranchingStepGuide,
    pageTargetedContextualGuide,
  ],
  [normalizrSchema.guide]
) as NormalizedGuidesData;

type Args = Pick<
  TransitionLogicData,
  | 'guide'
  | 'module'
  | 'step'
  | 'dispatch'
  | 'selectStep'
  | 'selectGuide'
  | 'uiActions'
  | 'animationDelay'
  | 'startJourney'
  | 'endJourney'
  | 'unlockAirTraffic'
  | 'lockAirTraffic'
>;

let {
  dispatch,
  selectStep,
  selectGuide,
  uiActions,
  animationDelay,
  startJourney,
  endJourney,
  lockAirTraffic,
  unlockAirTraffic,
}: Args = {} as Args;
let animationDelayCbs: (() => void)[];
let transitionLogicDefaults: TransitionDataDefaults;

function flushAnimationDelayCbs() {
  animationDelayCbs.forEach((cb) => cb());
  animationDelayCbs = [];
}

beforeEach(() => {
  dispatch = jest.fn();
  selectStep = jest.fn();
  selectGuide = jest.fn();
  startJourney = jest.fn();
  endJourney = jest.fn();
  lockAirTraffic = jest.fn();
  unlockAirTraffic = jest.fn();
  uiActions = {
    viewChanged: jest.fn(),
    showSuccessChanged: jest.fn(),
    stepTransitionDirectionChanged: jest.fn(),
    handleBack: jest.fn(),
    handleShowActiveGuides: jest.fn(),
    handleShowMoreActiveGuides: jest.fn(),
    handleShowTicketForm: jest.fn(),
    handleShowKbArticle: jest.fn(),
  };
  animationDelayCbs = [];
  animationDelay = jest.fn((cb) => {
    animationDelayCbs.push(cb);
  });
  transitionLogicDefaults = {
    ...transitionLogicCommonDefaults,
    uiActions,
    animationDelay,
    dispatch,
    selectStep,
    selectGuide,
    startJourney,
    endJourney,
    lockAirTraffic,
    unlockAirTraffic,
    activeJourney: undefined,
    activeJourneySelectedGuide: undefined,
  };
});

describe.each([EmbedFormFactor.inline, EmbedFormFactor.sidebar])(
  'Form factor: %s',
  (formFactor) => {
    describe.each([true, false])('isPreview: %s', (isPreview) => {
      test('nothing happens when nothing changed', () => {
        const guide = { ...guides[nestedEntityId], isPreview };
        const guideModule = modules![guide!.modules![0]];
        const step = steps![guideModule.steps![0]];
        transitionLogic({
          ...transitionLogicDefaults,
          guide,
          prevGuide: guide,
          selectedGuideEntityId: guide.entityId,
          module: guideModule,
          prevModule: guideModule,
          step,
          prevStep: step,
          view: View.step,
          prevView: View.step,
          formFactor,
          embedFormFactor: formFactor,
          renderedFormFactor: formFactor,
          prevRenderedFormFactor: formFactor,
          nextStepToComplete: undefined,
          isSidebarExpanded: false,
          onboardingInlineEmbed: undefined,
        });

        expect(dispatch).not.toHaveBeenCalled();
        if (isPreview) {
          expect(selectStep).toHaveBeenCalledWith(step.entityId);
        } else {
          expect(selectStep).not.toHaveBeenCalled();
        }
        expect(uiActions.viewChanged).not.toHaveBeenCalled();
        expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
        expect(uiActions.stepTransitionDirectionChanged).not.toHaveBeenCalled();
        expect(uiActions.handleBack).not.toHaveBeenCalled();
        expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
        expect(animationDelay).not.toHaveBeenCalled();
        expect(animationDelayCbs).toHaveLength(0);
      });

      describe('guide changed', () => {
        test('nothing happens when the guide changes but is not hydrated', () => {
          const prevGuide = guides[nestedEntityId];
          const guide = guides[flatEntityId];
          const prevModule = modules![prevGuide.modules![0]];
          const prevStep = steps![prevModule.steps![0]];
          transitionLogic({
            ...transitionLogicDefaults,
            guide,
            prevGuide,
            selectedGuideEntityId: guide.entityId,
            module: undefined,
            prevModule,
            step: undefined,
            prevStep,
            guideIsHydrated: false,
            newModule: undefined,
            view: View.step,
            prevView: View.step,
            formFactor,
            embedFormFactor: formFactor,
            renderedFormFactor: formFactor,
            prevRenderedFormFactor: formFactor,
            nextStepToComplete: undefined,
            isSidebarExpanded: false,
            onboardingInlineEmbed: undefined,
          });

          expect(dispatch).not.toHaveBeenCalled();
          expect(selectStep).not.toHaveBeenCalled();
          if (formFactor === EmbedFormFactor.sidebar) {
            expect(uiActions.viewChanged).toHaveBeenCalled();
          } else {
            expect(uiActions.viewChanged).not.toHaveBeenCalled();
          }
          expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
          expect(
            uiActions.stepTransitionDirectionChanged
          ).not.toHaveBeenCalled();
          expect(uiActions.handleBack).not.toHaveBeenCalled();
          expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
          expect(animationDelay).not.toHaveBeenCalled();
          expect(animationDelayCbs).toHaveLength(0);
        });

        test.each([
          {
            prevGuide: guides[nestedEntityId],
            guide: guides[flatEntityId],
            guideIsHydrated: true,
            guideWasHydrated: true,
          },
          {
            prevGuide: guides[flatEntityId],
            guide: guides[flatEntityId],
            guideIsHydrated: true,
            guideWasHydrated: false,
          },
        ])(
          'selects the first incomplete step when the guide changes or is hydrated: %p',
          ({ prevGuide, guide, guideIsHydrated, guideWasHydrated }) => {
            transitionLogic({
              ...transitionLogicDefaults,
              guide,
              prevGuide,
              selectedGuideEntityId: guide.entityId,
              module: undefined,
              prevModule: undefined,
              step: undefined,
              prevStep: undefined,
              guideIsHydrated,
              guideWasHydrated,
              newModule: undefined,
              view: View.step,
              prevView: View.step,
              formFactor,
              embedFormFactor: formFactor,
              renderedFormFactor: formFactor,
              prevRenderedFormFactor: formFactor,
              nextStepToComplete: undefined,
              isSidebarExpanded: false,
              onboardingInlineEmbed: undefined,
            });

            expect(dispatch).not.toHaveBeenCalled();
            expect(selectStep).toHaveBeenCalledWith(guide.firstIncompleteStep);
            expect(uiActions.viewChanged).not.toHaveBeenCalled();
            expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
            expect(
              uiActions.stepTransitionDirectionChanged
            ).not.toHaveBeenCalled();
            expect(uiActions.handleBack).not.toHaveBeenCalled();
            expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
            expect(animationDelay).not.toHaveBeenCalled();
            expect(animationDelayCbs).toHaveLength(0);
          }
        );

        test(`shows available guides when the guide is deselected in the ${formFactor}`, () => {
          transitionLogic({
            ...transitionLogicDefaults,
            guide: undefined,
            prevGuide: guides[nestedEntityId],
            selectedGuideEntityId: undefined,
            module: undefined,
            prevModule: undefined,
            step: undefined,
            prevStep: undefined,
            guideIsHydrated: false,
            newModule: undefined,
            view: View.step,
            prevView: View.step,
            formFactor,
            embedFormFactor: formFactor,
            renderedFormFactor: formFactor,
            prevRenderedFormFactor: formFactor,
            nextStepToComplete: undefined,
            isSidebarExpanded: false,
            onboardingInlineEmbed: undefined,
          });

          expect(dispatch).not.toHaveBeenCalled();
          expect(selectStep).not.toHaveBeenCalledWith();
          expect(uiActions.viewChanged).not.toHaveBeenCalled();
          expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
          expect(
            uiActions.stepTransitionDirectionChanged
          ).not.toHaveBeenCalled();
          expect(uiActions.handleBack).not.toHaveBeenCalled();
          expect(uiActions.handleShowActiveGuides).toHaveBeenCalled();
          expect(animationDelay).not.toHaveBeenCalled();
          expect(animationDelayCbs).toHaveLength(0);
        });

        if (formFactor === EmbedFormFactor.sidebar) {
          test.each(activeGuidesViews)(
            'nothing happens when the guide is deselected in the sidebar and the view is already not a guide: %s',
            (view) => {
              transitionLogic({
                ...transitionLogicDefaults,
                guide: undefined,
                prevGuide: guides[nestedEntityId],
                selectedGuideEntityId: undefined,
                module: undefined,
                prevModule: undefined,
                step: undefined,
                prevStep: undefined,
                guideIsHydrated: false,
                newModule: undefined,
                view,
                prevView: View.step,
                formFactor,
                embedFormFactor: formFactor,
                renderedFormFactor: formFactor,
                prevRenderedFormFactor: formFactor,
                nextStepToComplete: undefined,
                isSidebarExpanded: false,
                onboardingInlineEmbed: undefined,
              });

              expect(dispatch).not.toHaveBeenCalled();
              expect(selectStep).not.toHaveBeenCalledWith();
              expect(uiActions.viewChanged).not.toHaveBeenCalled();
              expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
              expect(
                uiActions.stepTransitionDirectionChanged
              ).not.toHaveBeenCalled();
              expect(uiActions.handleBack).not.toHaveBeenCalled();
              expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
              expect(animationDelay).not.toHaveBeenCalled();
              expect(animationDelayCbs).toHaveLength(0);
            }
          );

          test('shows the active guides when the guide is deselected in the sidebar', () => {
            transitionLogic({
              ...transitionLogicDefaults,
              guide: undefined,
              prevGuide: guides[nestedEntityId],
              selectedGuideEntityId: undefined,
              module: undefined,
              prevModule: undefined,
              step: undefined,
              prevStep: undefined,
              guideIsHydrated: false,
              newModule: undefined,
              view: View.step,
              prevView: View.step,
              formFactor,
              embedFormFactor: formFactor,
              renderedFormFactor: formFactor,
              prevRenderedFormFactor: formFactor,
              nextStepToComplete: undefined,
              isSidebarExpanded: false,
              onboardingInlineEmbed: undefined,
            });

            expect(dispatch).not.toHaveBeenCalled();
            expect(selectStep).not.toHaveBeenCalledWith();
            expect(uiActions.viewChanged).not.toHaveBeenCalled();
            expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
            expect(
              uiActions.stepTransitionDirectionChanged
            ).not.toHaveBeenCalled();
            expect(uiActions.handleBack).not.toHaveBeenCalled();
            expect(uiActions.handleShowActiveGuides).toHaveBeenCalled();
            expect(animationDelay).not.toHaveBeenCalled();
            expect(animationDelayCbs).toHaveLength(0);
          });
        }
      });

      describe('step changed', () => {
        test.each(
          (() => {
            const guide = guides[nestedEntityId];
            const guideModule = modules![guide.modules![0]];
            const initialStep = steps![guideModule.steps![0]];
            const newStep = steps![guideModule.steps![1]];
            return [
              { guide, guideModule, initialStep, newStep },
              { guide, guideModule, initialStep, newStep },
              { guide, guideModule, initialStep: undefined, newStep },
            ];
          })()
        )(
          'view changes and step is selected when the step is different: %p',
          ({ guide, guideModule, initialStep, newStep }) => {
            transitionLogic({
              ...transitionLogicDefaults,
              guide,
              prevGuide: guide,
              selectedGuideEntityId: guide.entityId,
              module: guideModule,
              prevModule: guideModule,
              step: newStep,
              prevStep: initialStep,
              newModule: undefined,
              view: View.step,
              prevView: View.step,
              formFactor,
              embedFormFactor: formFactor,
              renderedFormFactor: formFactor,
              prevRenderedFormFactor: formFactor,
              nextStepToComplete: undefined,
              isSidebarExpanded: false,
              onboardingInlineEmbed: undefined,
            });

            expect(dispatch).toHaveBeenCalledWith({
              type: 'stepSelected',
              formFactor,
              step: newStep.entityId,
            });
            expect(selectStep).not.toHaveBeenCalled();
            expect(uiActions.viewChanged).toHaveBeenCalledWith(View.step);
            expect(uiActions.showSuccessChanged).toHaveBeenCalledWith(false);
            expect(
              uiActions.stepTransitionDirectionChanged
            ).not.toHaveBeenCalled();
            expect(uiActions.handleBack).not.toHaveBeenCalled();
            expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
            expect(animationDelay).not.toHaveBeenCalled();
            expect(animationDelayCbs).toHaveLength(0);
          }
        );
      });

      describe('module changes', () => {
        if (formFactor === EmbedFormFactor.inline) {
          test.each([
            steps![modules![guides[flatEntityId]!.modules![0]].steps![0]],
            undefined,
          ])(
            'first step of new module is selected when module changes in the inline embed',
            (step) => {
              const guide = guides[nestedEntityId];
              const guideModule = modules![guide!.modules![0]];
              transitionLogic({
                ...transitionLogicDefaults,
                guide,
                prevGuide: guide,
                selectedGuideEntityId: guide.entityId,
                module: guideModule,
                prevModule: undefined,
                step,
                prevStep: undefined,
                newModule: undefined,
                view: View.step,
                prevView: View.step,
                formFactor,
                embedFormFactor: formFactor,
                renderedFormFactor: formFactor,
                prevRenderedFormFactor: formFactor,
                nextStepToComplete: undefined,
                isSidebarExpanded: false,
                onboardingInlineEmbed: undefined,
              });

              expect(dispatch).not.toHaveBeenCalled();
              expect(selectStep).toHaveBeenCalledWith(guideModule.steps![0]);
              if (step) {
                expect(uiActions.viewChanged).toHaveBeenCalled();
                expect(uiActions.showSuccessChanged).toHaveBeenCalledWith(
                  false
                );
              } else {
                expect(uiActions.viewChanged).not.toHaveBeenCalled();
                expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
              }
              expect(
                uiActions.stepTransitionDirectionChanged
              ).not.toHaveBeenCalled();
              expect(uiActions.handleBack).not.toHaveBeenCalled();
              expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
              expect(animationDelay).not.toHaveBeenCalled();
              expect(animationDelayCbs).toHaveLength(0);
            }
          );
        }
      });

      describe('new module added', () => {
        test('selects the first step in a newly added module (after delay)', () => {
          const guide = guides[nestedEntityId];
          const guideModule = modules![guide!.modules![0]];
          const newModule = modules![guides[flatEntityId].modules![0]];
          const step = { ...steps![guideModule.steps![0]], isComplete: true };
          transitionLogic({
            ...transitionLogicDefaults,
            guide,
            prevGuide: guide,
            selectedGuideEntityId: guide.entityId,
            module: guideModule,
            prevModule: guideModule,
            step,
            prevStep: step,
            newModule,
            view: View.step,
            prevView: View.step,
            formFactor,
            embedFormFactor: formFactor,
            renderedFormFactor: formFactor,
            prevRenderedFormFactor: formFactor,
            nextStepToComplete: undefined,
            isSidebarExpanded: false,
            onboardingInlineEmbed: undefined,
          });

          expect(dispatch).not.toHaveBeenCalled();
          expect(selectStep).not.toHaveBeenCalled();
          expect(uiActions.viewChanged).not.toHaveBeenCalled();
          expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
          expect(
            uiActions.stepTransitionDirectionChanged
          ).not.toHaveBeenCalled();
          expect(uiActions.handleBack).not.toHaveBeenCalled();
          expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
          expect(animationDelay).toHaveBeenCalledTimes(1);
          expect(animationDelayCbs).toHaveLength(1);

          flushAnimationDelayCbs();

          expect(dispatch).toHaveBeenCalledWith({
            type: 'stepSelected',
            formFactor,
            step: newModule.steps![0],
          });
          expect(selectStep).not.toHaveBeenCalled();
          expect(uiActions.viewChanged).not.toHaveBeenCalled();
          expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
          expect(
            uiActions.stepTransitionDirectionChanged
          ).not.toHaveBeenCalled();
          expect(uiActions.handleBack).not.toHaveBeenCalled();
          expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
          expect(animationDelay).toHaveBeenCalledTimes(1);
          expect(animationDelayCbs).toHaveLength(0);
        });
      });

      describe.each([
        {
          completionState: GuideCompletionState.complete,
          isComplete: true,
          isDone: true,
          wasDone: false,
        },
        {
          completionState: GuideCompletionState.complete,
          isComplete: true,
          isDone: true,
          wasDone: true,
        },
        {
          completionState: GuideCompletionState.done,
          isComplete: false,
          isDone: true,
          wasDone: false,
        },
      ])(
        'guide finished',
        ({ completionState, isComplete, isDone, wasDone }) => {
          test('branching guide', () => {
            const prevGuide = { ...guides[branchingEntityId], isDone: wasDone };
            const guide = {
              ...prevGuide,
              nextGuide: flatEntityId,
              completionState,
              isComplete,
              isDone,
            };
            const guideModule = modules![guide!.modules![0]];
            const step = steps![guideModule.steps![0]];
            transitionLogic({
              ...transitionLogicDefaults,
              guide,
              prevGuide,
              selectedGuideEntityId: guide.entityId,
              module: guideModule,
              prevModule: guideModule,
              step,
              prevStep: step,
              formFactor,
              embedFormFactor: formFactor,
              renderedFormFactor: formFactor,
              prevRenderedFormFactor: formFactor,
              view: View.step,
              prevView: View.step,
              nextStepToComplete: undefined,
              isSidebarExpanded: false,
              onboardingInlineEmbed: undefined,
            });

            expect(selectGuide).toHaveBeenCalledWith(guide.nextGuide);
            expect(selectStep).not.toHaveBeenCalled();
            expect(uiActions.viewChanged).not.toHaveBeenCalled();
            expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
            expect(
              uiActions.stepTransitionDirectionChanged
            ).not.toHaveBeenCalled();
            expect(uiActions.handleBack).not.toHaveBeenCalled();
            expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
            expect(animationDelay).not.toHaveBeenCalled();
            expect(animationDelayCbs).toHaveLength(0);
          });

          test('non-branching guide', () => {
            const prevGuide = { ...guides[nestedEntityId], isDone: wasDone };
            const guide = {
              ...prevGuide,
              nextGuide: flatEntityId,
              isComplete,
              isDone,
            };
            const guideModule = modules![guide!.modules![0]];
            const step = steps![guideModule.steps![0]];
            transitionLogic({
              ...transitionLogicDefaults,
              guide,
              prevGuide,
              selectedGuideEntityId: guide.entityId,
              module: guideModule,
              prevModule: guideModule,
              step,
              prevStep: step,
              view: View.step,
              prevView: View.step,
              formFactor,
              embedFormFactor: formFactor,
              renderedFormFactor: formFactor,
              prevRenderedFormFactor: formFactor,
              nextStepToComplete: undefined,
              isSidebarExpanded: false,
              onboardingInlineEmbed: undefined,
            });

            expect(dispatch).not.toHaveBeenCalledWith();
            expect(selectStep).not.toHaveBeenCalled();
            expect(uiActions.viewChanged).not.toHaveBeenCalled();
            expect(uiActions.showSuccessChanged).toHaveBeenCalledTimes(1);
            expect(uiActions.showSuccessChanged).toHaveBeenCalledWith(true);
            expect(
              uiActions.stepTransitionDirectionChanged
            ).not.toHaveBeenCalled();
            expect(uiActions.handleBack).not.toHaveBeenCalled();
            expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
            expect(animationDelay).toHaveBeenCalledTimes(1);
            expect(animationDelayCbs).toHaveLength(1);

            flushAnimationDelayCbs();

            expect(dispatch).not.toHaveBeenCalledWith();
            expect(selectStep).not.toHaveBeenCalled();
            expect(uiActions.viewChanged).not.toHaveBeenCalled();
            expect(uiActions.showSuccessChanged).toHaveBeenCalledTimes(2);
            expect(
              uiActions.stepTransitionDirectionChanged
            ).not.toHaveBeenCalled();
            expect(uiActions.handleBack).not.toHaveBeenCalled();
            expect(selectGuide).toHaveBeenCalledWith(flatEntityId);
            expect(uiActions.handleShowActiveGuides).toHaveBeenCalledTimes(0);
            expect(animationDelay).toHaveBeenCalledTimes(1);
            expect(animationDelayCbs).toHaveLength(0);
          });
        }
      );

      describe.each([
        [true, true],
        [true, false],
        [false, true],
        [false, false],
      ])(
        'available page targeted context guide - viewed: %s',
        (isViewed, isInlineEmbedPresent) => {
          const everboardingGuideForPage = {
            ...guides[pageTargetedEntityId],
            isPreview,
            isViewed,
            pageTargetingType: GuidePageTargetingType.specificPage,
          };
          test.each([
            everboardingGuideForPage,
            undefined,
            guides[nestedEntityId],
          ])(
            'not yet selected, prev context guide: %p',
            (prevEverboardingGuideForPage) => {
              const guide = { ...guides[nestedEntityId], isPreview };
              const guideModule = modules![guide!.modules![0]];
              const step = steps![guideModule.steps![0]];

              (detectOnboardingInlineEmbed as jest.Mock).mockReturnValueOnce(
                isInlineEmbedPresent
              );

              transitionLogic({
                ...transitionLogicDefaults,
                guide,
                prevGuide: guide,
                selectedGuideEntityId: guide.entityId,
                module: guideModule,
                prevModule: guideModule,
                step,
                prevStep: step,
                view: View.step,
                prevView: View.step,
                formFactor,
                embedFormFactor: formFactor,
                renderedFormFactor: formFactor,
                prevRenderedFormFactor: formFactor,
                everboardingGuideForPage,
                prevEverboardingGuideForPage,
                nextStepToComplete: undefined,
                isSidebarExpanded: false,
                onboardingInlineEmbed: undefined,
              });

              expect(dispatch).not.toHaveBeenCalled();
              expect(uiActions.viewChanged).not.toHaveBeenCalled();
              expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
              expect(
                uiActions.stepTransitionDirectionChanged
              ).not.toHaveBeenCalled();
              expect(uiActions.handleBack).not.toHaveBeenCalled();
              expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
              expect(animationDelay).not.toHaveBeenCalled();
              expect(animationDelayCbs).toHaveLength(0);

              flushAnimationDelayCbs();

              if (
                formFactor === EmbedFormFactor.sidebar &&
                (prevEverboardingGuideForPage !== everboardingGuideForPage ||
                  !isViewed)
              ) {
                if (!isInlineEmbedPresent && !isViewed) {
                  expect(startJourney).toHaveBeenCalled();
                }
                expect(selectStep).not.toHaveBeenCalled();
              } else {
                expect(startJourney).not.toHaveBeenCalled();
                if (isPreview) {
                  expect(selectStep).toHaveBeenCalledWith(step.entityId);
                } else {
                  expect(selectStep).not.toHaveBeenCalled();
                }
              }
              expect(uiActions.viewChanged).not.toHaveBeenCalled();
              expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
              expect(
                uiActions.stepTransitionDirectionChanged
              ).not.toHaveBeenCalled();
              expect(uiActions.handleBack).not.toHaveBeenCalled();
              expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
              expect(animationDelay).toHaveBeenCalledTimes(0);
              expect(animationDelayCbs).toHaveLength(0);
            }
          );

          test('no longer on the correct url', () => {
            const guide = {
              ...guides[pageTargetedEntityId],
              isPreview,
              pageTargeting: {
                type: GuidePageTargetingType.specificPage,
              },
            };
            const guideModule = modules![guide!.modules![0]];
            const step = steps![guideModule.steps![0]];
            transitionLogic({
              ...transitionLogicDefaults,
              guide,
              prevGuide: guide,
              selectedGuideEntityId: guide.entityId,
              module: guideModule,
              prevModule: guideModule,
              step,
              prevStep: step,
              view: View.step,
              prevView: View.step,
              formFactor,
              embedFormFactor: formFactor,
              renderedFormFactor: formFactor,
              prevRenderedFormFactor: formFactor,
              nextStepToComplete: undefined,
              isSidebarExpanded: false,
              onboardingInlineEmbed: undefined,
            });

            expect(dispatch).not.toHaveBeenCalled();
            expect(uiActions.viewChanged).not.toHaveBeenCalled();
            expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
            expect(
              uiActions.stepTransitionDirectionChanged
            ).not.toHaveBeenCalled();
            expect(uiActions.handleBack).not.toHaveBeenCalled();
            expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
            expect(animationDelay).not.toHaveBeenCalled();
            expect(animationDelayCbs).toHaveLength(0);

            flushAnimationDelayCbs();

            if (formFactor === EmbedFormFactor.sidebar) {
              expect(selectGuide).toHaveBeenCalledWith(undefined, false);
              expect(selectStep).not.toHaveBeenCalled();
            } else {
              expect(startJourney).not.toHaveBeenCalled();
              if (isPreview) {
                expect(selectStep).toHaveBeenCalledWith(step.entityId);
              } else {
                expect(selectStep).not.toHaveBeenCalled();
              }
            }
            expect(uiActions.viewChanged).not.toHaveBeenCalled();
            expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
            expect(
              uiActions.stepTransitionDirectionChanged
            ).not.toHaveBeenCalled();
            expect(uiActions.handleBack).not.toHaveBeenCalled();
            expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
            expect(animationDelay).toHaveBeenCalledTimes(0);
            expect(animationDelayCbs).toHaveLength(0);
          });

          test('wont unselect finished guide when no longer on the correct url', () => {
            const guide = {
              ...guides[pageTargetedEntityId],
              isPreview,
              pageTargetingType: GuidePageTargetingType.specificPage,
              isComplete: true,
            };
            const guideModule = modules![guide!.modules![0]];
            const step = steps![guideModule.steps![0]];
            transitionLogic({
              ...transitionLogicDefaults,
              guide,
              prevGuide: guide,
              selectedGuideEntityId: guide.entityId,
              module: guideModule,
              prevModule: guideModule,
              step,
              prevStep: step,
              view: View.step,
              prevView: View.step,
              formFactor,
              embedFormFactor: formFactor,
              renderedFormFactor: formFactor,
              prevRenderedFormFactor: formFactor,
              nextStepToComplete: undefined,
              isSidebarExpanded: false,
              onboardingInlineEmbed: undefined,
            });

            expect(dispatch).not.toHaveBeenCalled();
            expect(uiActions.viewChanged).not.toHaveBeenCalled();
            expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
            expect(
              uiActions.stepTransitionDirectionChanged
            ).not.toHaveBeenCalled();
            expect(uiActions.handleBack).not.toHaveBeenCalled();
            expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
            expect(animationDelay).not.toHaveBeenCalled();
            expect(animationDelayCbs).toHaveLength(0);

            flushAnimationDelayCbs();

            if (formFactor === EmbedFormFactor.sidebar) {
              expect(selectGuide).not.toHaveBeenCalledWith(undefined, false);
            } else {
              expect(startJourney).not.toHaveBeenCalled();
              if (isPreview) {
                expect(selectStep).toHaveBeenCalledWith(step.entityId);
              } else {
                expect(selectStep).not.toHaveBeenCalled();
              }
            }
            expect(uiActions.viewChanged).not.toHaveBeenCalled();
            expect(uiActions.showSuccessChanged).not.toHaveBeenCalled();
            expect(
              uiActions.stepTransitionDirectionChanged
            ).not.toHaveBeenCalled();
            expect(uiActions.handleBack).not.toHaveBeenCalled();
            expect(uiActions.handleShowActiveGuides).not.toHaveBeenCalled();
            expect(animationDelay).toHaveBeenCalledTimes(0);
            expect(animationDelayCbs).toHaveLength(0);
          });
        }
      );
    });
  }
);

describe('ATC + transitions for contextual guides', () => {
  const formFactor = EmbedFormFactor.sidebar;
  const everboardingGuideForPage = {
    ...guides[pageTargetedEntityId],
    isPreview: false,
    isViewed: false,
    pageTargetingType: GuidePageTargetingType.specificPage,
  };

  describe.each([true, false])(
    'journey guides will be selected: inline present %s',
    (isInlineEmbedPresent) => {
      test.each([true, false])('included in journey %s', (inJourney) => {
        const guide = { ...guides[nestedEntityId] };
        const guideModule = modules![guide!.modules![0]];
        const step = steps![guideModule.steps![0]];

        (detectOnboardingInlineEmbed as jest.Mock).mockReturnValueOnce(
          isInlineEmbedPresent
        );

        transitionLogic({
          ...transitionLogicDefaults,
          guide,
          prevGuide: guide,
          selectedGuideEntityId: guide.entityId,
          module: guideModule,
          prevModule: guideModule,
          step,
          prevStep: step,
          view: View.step,
          prevView: View.step,
          formFactor,
          embedFormFactor: formFactor,
          renderedFormFactor: formFactor,
          prevRenderedFormFactor: formFactor,
          everboardingGuideForPage,
          nextStepToComplete: undefined,
          isSidebarExpanded: false,
          onboardingInlineEmbed: undefined,
          activeJourney: fakeJourneyWithGuide(
            inJourney ? everboardingGuideForPage.entityId : ''
          ),
          activeJourneySelectedGuide: inJourney
            ? everboardingGuideForPage
            : undefined,
        });

        if (inJourney) {
          expect(selectGuide).toHaveBeenCalledWith(
            everboardingGuideForPage.entityId,
            !isInlineEmbedPresent
          );
        } else {
          expect(selectGuide).not.toHaveBeenCalled();
        }
      });
    }
  );
});
