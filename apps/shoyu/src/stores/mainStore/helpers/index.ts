import { $enum } from 'ts-enum-util';
import {
  AtLeast,
  EmbedFormFactor,
  GuideCompletionState,
} from 'bento-common/types';
import {
  FormFactorState,
  FormFactorStateKey,
  FullGuide,
  Guide,
  GuideEntityId,
  GuideHydrationState,
  InlineEmbed,
  InlineEmbedEntityId,
  ModuleEntityId,
  NpsSurvey,
  Step,
  StepEntityId,
  StepState,
  TaggedElement,
  TaggedElementEntityId,
} from 'bento-common/types/globalShoyuState';
import {
  getInlineEmbedIdFromFormFactor,
  isFlowGuide,
} from 'bento-common/utils/formFactor';
import {
  DEFAULT_PRIORITY_RANKING,
  INLINE_CONTEXT_FORM_FACTOR_PREFIX,
} from 'bento-common/utils/constants';
import {
  isCompleteStep,
  isIncompleteStep,
  isSkippedStep,
} from 'bento-common/utils/steps';
import { difference } from 'bento-common/utils/lodash';

import { MainStoreState, WorkingState } from '../types';
import {
  stepsSelectorOfGuide,
  guideSelector,
  guideSelectorByModule,
  guideSelectorByStep,
  stepsSelectorOfModule,
  formFactorSelector,
  inlineEmbedSelector,
  moduleSelectorByStep,
  stepSelector,
  taggedElementsByGuidesSelector,
} from './selectors';

export function findFirstIncompleteStep(steps: AtLeast<Step, 'state'>[]) {
  return steps.find((step) => isIncompleteStep(step.state));
}

/**
 * NOTE: A Flow-type guide that contains a skipped step should be considered skipped,
 * regardless of the position of that Step given the user wouldn't be able to navigate
 * end-to-end within the Flow. Also, it is theoretically impossible to have incomplete flows
 * at the beginning and skipped at the end.
 */
export function computeStepsCompletionState(
  guide: Guide,
  steps: Step[]
): {
  completion: StepState;
  guideCompletedStepsCount: number;
  moduleCompletedStepsCounts: Record<ModuleEntityId, number>;
} {
  const isFlow = isFlowGuide(guide.formFactor);
  const hasSkippedSteps = steps.some((step) => isSkippedStep(step.state));

  return steps.reduce<{
    completion: StepState;
    guideCompletedStepsCount: number;
    moduleCompletedStepsCounts: Record<ModuleEntityId, number>;
  }>(
    (state, step) => ({
      completion:
        isFlow && hasSkippedSteps
          ? StepState.skipped
          : isIncompleteStep(step.state)
          ? StepState.incomplete
          : isSkippedStep(step.state) && !isIncompleteStep(state.completion)
          ? StepState.skipped
          : state.completion,
      guideCompletedStepsCount: isCompleteStep(step.state)
        ? state.guideCompletedStepsCount + 1
        : state.guideCompletedStepsCount,
      moduleCompletedStepsCounts: {
        ...state.moduleCompletedStepsCounts,
        [step.module]:
          (state.moduleCompletedStepsCounts[step.module] || 0) +
          (step.isComplete ? 1 : 0),
      },
    }),
    {
      completion: StepState.complete,
      guideCompletedStepsCount: 0,
      moduleCompletedStepsCounts: {},
    }
  );
}

export function getGuideCompletionUpdateData(
  guide: Guide,
  steps: Step[]
): Pick<
  Guide,
  | 'entityId'
  | 'completionState'
  | 'isComplete'
  | 'isDone'
  | 'completedAt'
  | 'doneAt'
  | 'completedStepsCount'
  | 'firstIncompleteModule'
  | 'firstIncompleteStep'
> & { moduleCompletedStepsCounts: Record<ModuleEntityId, number> } {
  const { completion, guideCompletedStepsCount, moduleCompletedStepsCounts } =
    computeStepsCompletionState(guide, steps);
  const nowAt = new Date();
  const firstIncompleteStep = findFirstIncompleteStep(steps);
  const isComplete = completion === StepState.complete;
  const isDone = isComplete || completion === StepState.skipped;
  const completionState = isComplete
    ? GuideCompletionState.complete
    : isDone
    ? GuideCompletionState.done
    : GuideCompletionState.incomplete;

  return {
    entityId: guide.entityId,
    completionState,
    isComplete,
    isDone,
    completedAt: isComplete ? guide.completedAt || nowAt : undefined,
    doneAt: isDone ? guide.doneAt || nowAt : undefined,
    completedStepsCount: guideCompletedStepsCount,
    firstIncompleteStep: firstIncompleteStep?.entityId,
    firstIncompleteModule: firstIncompleteStep?.module,
    moduleCompletedStepsCounts,
  };
}

export function updateGuideCompletion(
  state: WorkingState,
  guideEntityId: GuideEntityId
) {
  const guide = guideSelector(guideEntityId, state);
  const steps = stepsSelectorOfGuide(guideEntityId, state);

  if (!guide) {
    throw new Error(
      `[BENTO] updateGuideCompletion: Guide not found (${guideEntityId})`
    );
  }

  const { moduleCompletedStepsCounts, ...updatedGuideData } =
    getGuideCompletionUpdateData(guide, steps);

  state.guides[guideEntityId] = { ...guide, ...updatedGuideData };

  for (const [moduleEntityId, completedStepsCount] of Object.entries(
    moduleCompletedStepsCounts
  )) {
    state.modules[moduleEntityId].completedStepsCount = completedStepsCount;
  }
}

export function cleanOrphanedItems(
  state: WorkingState,
  excludeGuides: GuideEntityId[] = []
) {
  // drop orphaned guides
  const guidesInAnyFormFactor = new Set(
    Object.values<FormFactorState>(state.formFactors).flatMap((ff) => ff.guides)
  );
  const inlineContextGuides = Object.values<InlineEmbed>(state.inlineEmbeds)
    .map((embed) => embed.guide)
    .filter(Boolean);
  const isPreview = excludeGuides.some((g) => state.guides[g].isPreview);

  /** guideEntityId-branchKey identifiers for selected branches */
  const branchedFromIdentifiers = Object.values<Step>(state.steps).reduce(
    (acc, step) => {
      (step.branching?.branches || []).forEach((b) => {
        if (b.selected) acc.push(`${step.guide}-${b.key}`);
      });
      return acc;
    },
    [] as string[]
  );

  for (const guide of Object.values<Guide>(state.guides)) {
    const guideBranchedFromIdentifier = guide.branchedFromGuide
      ? `${guide.branchedFromGuide}-${guide.branchedFromChoice?.choiceKey}`
      : null;

    const removeBranchedGuide =
      guideBranchedFromIdentifier &&
      !branchedFromIdentifiers.includes(guideBranchedFromIdentifier);

    if (
      (removeBranchedGuide ||
        (!guidesInAnyFormFactor.has(guide.entityId) &&
          !inlineContextGuides.includes(guide.entityId))) &&
      guide.isPreview === isPreview &&
      !excludeGuides.includes(guide.entityId)
    ) {
      delete state.guides[guide.entityId];
    }
  }

  // drop orphaned modules
  Object.keys(state.modules).forEach((moduleEntityId) => {
    const guide = guideSelectorByModule(
      moduleEntityId as ModuleEntityId,
      state
    );
    if (!guide || !guide.modules?.includes(moduleEntityId as ModuleEntityId)) {
      delete state.modules[moduleEntityId];
    }
  });

  // drop orphaned steps
  Object.keys(state.steps).forEach((stepEntityId) => {
    const guide = guideSelectorByStep(stepEntityId as StepEntityId, state);
    const module = moduleSelectorByStep(stepEntityId as StepEntityId, state);
    if (
      !guide ||
      !module ||
      !guide.steps?.includes(stepEntityId as StepEntityId) ||
      !module?.steps?.includes(stepEntityId as StepEntityId)
    ) {
      delete state.steps[stepEntityId];
    }
  });
}

export function isPreviewFormFactor(
  state: MainStoreState,
  formFactor?: FormFactorStateKey
): boolean {
  if (formFactor) {
    const formFactorState = formFactorSelector(state, formFactor);
    return formFactorState
      ? !!formFactorState.isPreview
      : !$enum(EmbedFormFactor)
          .getValues()
          .includes(formFactor as EmbedFormFactor);
  }
  return false;
}

export function stringToDate(date?: string): Date | undefined {
  return typeof date === 'string' ? new Date(date) : undefined;
}

export function updateGuideSteps(
  state: WorkingState,
  guideEntityId: GuideEntityId | undefined
) {
  const guide = guideSelector(guideEntityId, state);
  if (guide) {
    guide.steps = guide.modules?.flatMap((m) =>
      stepsSelectorOfModule(m, state).map((s) => s.entityId)
    );
  }
}

export function isEverboardingInline(
  state: MainStoreState,
  formFactor: FormFactorStateKey
) {
  return (
    formFactor.startsWith(INLINE_CONTEXT_FORM_FACTOR_PREFIX) &&
    inlineEmbedSelector(
      state,
      getInlineEmbedIdFromFormFactor(formFactor) as InlineEmbedEntityId
    )?.guide
  );
}

/**
 * Computes tagged elements sort order based on associated guide `orderIndex`,
 * while favoring destination guides.
 *
 * NOTE: Step-level tagged elements should always come after their guide-level counterparts.
 * @todo unit test
 */
export function computeTaggedElementSort(
  state: WorkingState,
  tag: TaggedElement
): number {
  const guide = guideSelector(tag.guide, state);
  const gSortOrder =
    typeof guide?.orderIndex !== 'undefined'
      ? guide.orderIndex
      : DEFAULT_PRIORITY_RANKING;
  const mSortOrder = moduleSelectorByStep(tag.step, state)?.orderIndex || 0;
  const sSortOrder = stepSelector(tag.step, state)?.orderIndex || 0;
  return gSortOrder + mSortOrder + sSortOrder;
}

export function isGuideHydrating(
  guide?: Pick<Guide | FullGuide, 'hydrationState'>
) {
  return guide?.hydrationState === GuideHydrationState.hydrating;
}

export function isGuideHydrated(
  guide?: Pick<Guide | FullGuide, 'hydrationState'>
) {
  return guide?.hydrationState === GuideHydrationState.hydrated;
}

export function isGuideHydrationFailed(
  guide?: Pick<Guide | FullGuide, 'hydrationState'>
) {
  return guide?.hydrationState === GuideHydrationState.failed;
}

export function cleanOrphanedTaggedElements(
  state: WorkingState,
  guides: GuideEntityId[],
  taggedElements: TaggedElementEntityId[] | undefined
) {
  const existing = taggedElementsByGuidesSelector(state, guides).map(
    (t) => t.entityId
  );
  for (const entityId of difference(existing, taggedElements || [])) {
    delete state.taggedElements[entityId];
  }
}

export function mergeTaggedElements(
  state: WorkingState,
  taggedElements: Record<TaggedElementEntityId, TaggedElement>
) {
  state.taggedElements = Object.keys(taggedElements).reduce((acc, entityId) => {
    acc[entityId] = {
      ...state.taggedElements[entityId],
      ...taggedElements[entityId],
    };
    return acc;
  }, state.taggedElements);
}

/**
 * Useful to determine which object is the leading based on the order index.
 *
 * @deprecated rely on air traffic control instead
 * @return The leading object (Guide or NPS Survey)
 */
export function getLeadingObject(
  ...args: Array<Guide | NpsSurvey | undefined>
): Guide | NpsSurvey | undefined {
  return args
    .filter(Boolean)
    .sort((a, b) => a!.orderIndex - b!.orderIndex)?.[0];
}

/**
 * Sort objects based on `orderIndex`, ascending.
 */
export function sortByOrderIndexAsc<T extends { orderIndex: number }>(
  a: T,
  b: T
) {
  return a.orderIndex - b.orderIndex;
}

/*
 * Detect whether an *Onboarding* inline embed exists within the document.
 *
 * NOTE: Inline embeds without an embedid are treated as Onboarding since they must have been
 * added via code.
 */
export function detectOnboardingInlineEmbed(
  inlineEmbedOrFn: InlineEmbed | undefined | (() => InlineEmbed | undefined)
): boolean {
  const onboardingInlineEmbed =
    typeof inlineEmbedOrFn === 'function' ? inlineEmbedOrFn() : inlineEmbedOrFn;
  const inlineEmbeds = document.querySelectorAll(
    'bento-embed:not([uipreviewid])'
  );
  return (
    inlineEmbeds.length > 0 &&
    Array.from(inlineEmbeds).some(
      (embed) =>
        !embed.hasAttribute('embedid') ||
        embed.getAttribute('embedid') === onboardingInlineEmbed?.entityId
    )
  );
}
