import { denormalize } from 'normalizr';
import {
  Step,
  StepEntityId,
  Module,
  ModuleEntityId,
  Guide,
  GuideEntityId,
  FormFactorState,
  TaggedElementEntityId,
  TaggedElement,
  StepState,
  FormFactorStateKey,
  BranchingChoiceKey,
  BranchingKey,
  BranchingPath,
  FullGuide,
  FullModule,
  StepAutoCompleteInteractionEntityId,
  StepAutoCompleteInteraction,
  InlineEmbed,
  InlineEmbedEntityId,
  NpsSurveyEntityId,
  HideOnCompletionData,
} from 'bento-common/types/globalShoyuState';
import {
  EmbedFormFactor,
  GuidePageTargetingType,
  StepCtaType,
  AtLeast,
  ChecklistStyle,
} from 'bento-common/types';
import { getBodySlateString } from 'bento-common/utils/bodySlate';
import { findMap } from 'bento-common/utils/collection';
import {
  isBranchingStep,
  isFinishedGuide,
  isIncompleteGuide,
  isSavedGuide,
  isSerialCyoa,
  isAnnouncement,
  isEverboarding,
  allowedGuideTypesSettings,
  sortFinishedGuides,
  isPageTargetedGuide,
  isVisualTagTargetedGuide,
  isInlineTargetedGuide,
} from 'bento-common/data/helpers';
import { isTargetPage } from 'bento-common/utils/urls';
import {
  getInlineEmbedIdFromFormFactor,
  isFlowGuide,
  isInlineContextualGuide,
  isTooltipGuide,
} from 'bento-common/utils/formFactor';
import { SidebarVisibility } from 'bento-common/types/shoyuUIState';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';
import { isFinishedStep, isSkippedStep } from 'bento-common/utils/steps';

import {
  guideTargetingMatches,
  previewFilterFactory,
} from '../../../lib/helpers';
import { WorkingState } from '../types';
import { isBanner, isInline, isTooltip } from '../../../lib/formFactors';
import normalizrSchema from '../schema';
import {
  computeTaggedElementSort,
  isGuideHydrated,
  isPreviewFormFactor,
  sortByOrderIndexAsc,
} from '.';
import { GuideCardDetails } from '../../../../types/global';
import { UseLocationState } from 'bento-common/hooks/useLocation';

export const taggedElementSelector = (
  taggedElementEntityId: TaggedElementEntityId | undefined,
  state: WorkingState
): TaggedElement | undefined => {
  return taggedElementEntityId
    ? state.taggedElements[taggedElementEntityId]
    : undefined;
};

export type SerialCyoaInfo = {
  guide: Guide | undefined;
  step: Step | undefined;
  branches: Guide[];
  branchInProgress: boolean;
  dismissDisabled: boolean;
  total: number;
  complete: number;
  incomplete: number;
  dismissed: boolean;
  isFinished: boolean;
};

/**
 * Returns all tagged elements available and sorted based on their guide/step counterparts.
 */
export const allTaggedElementsSelector = (
  state: WorkingState
): TaggedElement[] => {
  return (
    Object.values<TaggedElement>(state.taggedElements)
      // sort tags
      .sort((a, b) => {
        return (
          computeTaggedElementSort(state, a) -
          computeTaggedElementSort(state, b)
        );
      })
  );
};

/**
 * Get all active auto-injected inline embeds. Embeds which are for a specific
 * guide must also have the guide in the state and not be complete to be
 * included.
 *
 * NOTE: this doesn't order the embeds based on when the guide was launched
 * so it could potentially show different guides between page refreshes if the
 * user does indeed have multiple active guides which are targeted to a single
 * url/selector combo. Since that's a fairly unlikely case I didn't bother
 * optimizing for it.
 */
export const inlineEmbedsSelector = (
  state: WorkingState,
  previewId?: string
): InlineEmbed[] =>
  Object.values<InlineEmbed>(state.inlineEmbeds).filter(
    (embed) =>
      // filter by preview mode or not
      ((previewId && embed?.previewId === previewId) ||
        (!previewId && !embed.previewId)) &&
      // if the embed is linked to a guide (i.e. inline context guide)
      // only include it if the guide is incomplete
      (!embed.guide || state.guides[embed.guide]?.isComplete === false)
  );

export const inlineEmbedSelector = (
  state: WorkingState,
  inlineEmbedEntityId: InlineEmbedEntityId | undefined
): InlineEmbed | undefined =>
  Object.values<InlineEmbed>(state.inlineEmbeds).find(
    (embed) => embed.entityId === inlineEmbedEntityId
  );

export const onboardingInlineEmbedSelector = (
  state: WorkingState | undefined,
  inlineEmbeds: Record<InlineEmbedEntityId, InlineEmbed> = {}
): InlineEmbed | undefined =>
  Object.values<InlineEmbed>(state?.inlineEmbeds || inlineEmbeds).find(
    (embed) => !embed.guide
  );

export const taggedElementsByGuideSelector = (
  state: WorkingState,
  guideEntityId: GuideEntityId | undefined
): TaggedElement[] => {
  return Object.values<TaggedElement>(state.taggedElements).filter(
    (tag) => tag.guide === guideEntityId
  );
};

export const taggedElementsByGuidesSelector = (
  state: WorkingState,
  guideEntityIds: GuideEntityId[]
): TaggedElement[] => {
  const taggedElementsByEntityId = guideEntityIds.reduce<
    Record<TaggedElementEntityId, TaggedElement>
  >((acc, geId) => {
    guideSelector(geId, state)?.taggedElements?.forEach((teId) => {
      const tag = taggedElementSelector(teId, state);
      if (tag) {
        acc[tag.entityId] = tag;
      }
    });
    return acc;
  }, {});
  return Object.values(taggedElementsByEntityId);
};

/**
 * Returns a tagged element directly related to the guide,
 * meaning not of any of its steps.
 */
export const taggedElementOfGuideSelector = (
  state: WorkingState,
  guideEntityId: GuideEntityId | undefined
): TaggedElement | undefined => {
  const guide = guideSelector(guideEntityId, state);
  if (guide) {
    return findMap(
      guide.taggedElements || [],
      (teId) => taggedElementSelector(teId, state),
      (tag) => {
        return !!tag && !tag.step;
      }
    );
  }
  return undefined;
};

export const targetingTaggedElementOfGuideSelector = (
  state: WorkingState,
  guideEntityId: GuideEntityId | undefined
): TaggedElement | undefined => {
  const guide = guideSelector(guideEntityId, state);

  if (isVisualTagTargetedGuide(guide)) {
    return taggedElementOfGuideSelector(state, guideEntityId);
  }
  return undefined;
};

/**
 * Returns the tagged element that belongs to a given step of a given guide.
 *
 * If the guide is not yet hydrated, then we fallback to selecting the tagged element
 * directly from the state list. This is useful within the context of ATC to further
 * check other criteria before determining whether a guide/tag will show.
 *
 * @todo directly associate steps to tags and optimize this selector
 */
export const taggedElementOfStepSelector = (
  state: WorkingState,
  guideEntityId: StepEntityId | undefined,
  stepEntityId: StepEntityId | undefined
): TaggedElement | undefined => {
  const guide = guideSelector(guideEntityId, state);
  if (isGuideHydrated(guide)) {
    return findMap(
      guide!.taggedElements || [],
      (teId) => taggedElementSelector(teId, state),
      (tag) => {
        return !!tag && tag.step === stepEntityId;
      }
    );
  }

  return findMap(
    Object.values(state.taggedElements),
    (tag) => taggedElementSelector(tag.entityId, state),
    (tag) => {
      return !!tag && tag.guide === guideEntityId && tag.step === stepEntityId;
    }
  );
};

/**
 * Returns the starting tagged element of a guide, according to guide's targeting criteria
 * and form factor.
 *
 * For all guides targeted by visual tag, except Flows, it will be the tag associated with the guide.
 * For Flows or all other guides, it will be the tag associated with the first step.
 *
 * @todo unit test
 */
export const startingTaggedElementOfGuideSelector = (
  state: WorkingState,
  guideEntityId: GuideEntityId | undefined
) => {
  const guide = guideSelector(guideEntityId, state);

  if (isVisualTagTargetedGuide(guide) && !isFlowGuide(guide?.formFactor)) {
    return taggedElementOfGuideSelector(state, guideEntityId);
  }

  const firstStep = firstStepOfGuideSelector(state, guideEntityId);
  return taggedElementOfStepSelector(state, guideEntityId, firstStep?.entityId);
};

export const stepAutoCompleteInteractionSelector = (
  stepAutoCompleteInteractionEntityId:
    | StepAutoCompleteInteractionEntityId
    | undefined,
  state: WorkingState
): StepAutoCompleteInteraction | undefined => {
  return stepAutoCompleteInteractionEntityId
    ? state.stepAutoCompleteInteractions[stepAutoCompleteInteractionEntityId]
    : undefined;
};

export const stepAutoCompleteInteractionsByPageUrlSelector = (
  pageUrl: string | null | undefined,
  state: WorkingState
): StepAutoCompleteInteraction[] => {
  if (pageUrl) {
    return Object.values<StepAutoCompleteInteraction>(
      state.stepAutoCompleteInteractions
    ).filter((interaction) => isTargetPage(pageUrl, interaction.wildcardUrl));
  }

  return [];
};

export const stepSelector = (
  stepEntityId: StepEntityId | undefined | null,
  state: WorkingState
): Step | undefined => (stepEntityId ? state.steps[stepEntityId] : undefined);

export const moduleSelector = (
  moduleEntityId: ModuleEntityId | undefined,
  state: WorkingState
): Module | undefined => {
  return moduleEntityId ? state.modules[moduleEntityId] : undefined;
};

export const guideSelector = <T extends Guide>(
  guideEntityId: GuideEntityId | null | undefined,
  state: WorkingState
): T | undefined => {
  return guideEntityId ? (state.guides[guideEntityId] as T) : undefined;
};

export const guidesByEntityIdSelector = <T extends Guide>(
  state: WorkingState,
  guides: GuideEntityId[]
) => {
  return guides
    .reduce<T[]>((acc, guideEntityId) => {
      const guide = guideSelector<T>(guideEntityId, state);
      if (guide) {
        acc.push(guide!);
      }
      return acc;
    }, [])
    .sort(sortByOrderIndexAsc);
};

export const everboardingGuideForPageByEntityIdSelector = <T extends Guide>(
  state: WorkingState,
  guides: GuideEntityId[]
): T | undefined => {
  return guidesByEntityIdSelector<T>(state, guides).find(
    (g) => isEverboarding(g?.designType) && isPageTargetedGuide(g)
  );
};

export const formFactorSelector = (
  state: WorkingState,
  formFactor?: FormFactorStateKey
): FormFactorState | undefined => {
  if (formFactor) {
    return state.formFactors[formFactor];
  }
  return undefined;
};

export const questGuidesSelector = (
  state: WorkingState,
  sideQuest = false,
  formFactor?: FormFactorStateKey
): Guide[] => {
  const isPreview = formFactor ? isPreviewFormFactor(state, formFactor) : false;
  const matchFormFactorPreviewState = previewFilterFactory(isPreview);
  return (
    formFactor
      ? formFactorGuidesSelector(state, formFactor)
      : Object.values<Guide>(state.guides)
  )
    .filter(
      (guide) =>
        guide?.isSideQuest === sideQuest && matchFormFactorPreviewState(guide)
    )
    .sort(sortByOrderIndexAsc);
};

export const mainQuestGuidesSelector = (
  state: WorkingState,
  formFactor?: FormFactorStateKey
) => questGuidesSelector(state, false, formFactor);

export const sideQuestGuidesSelector = (
  state: WorkingState,
  formFactor?: FormFactorStateKey
) => questGuidesSelector(state, true, formFactor);

export const dismissedAnnouncementsSelector = (
  state: WorkingState,
  formFactor?: FormFactorStateKey
): Guide[] => {
  const _formFactor =
    formFactor && isPreviewFormFactor(state, formFactor)
      ? formFactor
      : undefined;
  return sideQuestGuidesSelector(state, _formFactor).filter(
    (g) =>
      !isTooltip(g.formFactor) &&
      !isBanner(g.formFactor) &&
      isAnnouncement(g.designType) &&
      isFinishedGuide(g)
  );
};

export const tagSelectorByStep = (
  stepEntityId: StepEntityId | undefined,
  state: WorkingState
): TaggedElement | undefined => {
  if (!stepEntityId) return undefined;
  return Object.values<TaggedElement>(state.taggedElements).find(
    (tag) => tag.step === stepEntityId
  );
};

type NextUrlOfFlowSelectorOptions =
  | {
      /** Which is the current step, from which we will find the next step URL */
      currentStep: Step | undefined;
      nextStep?: never;
    }
  | {
      /** Which is the next step, from which we will find the URL */
      nextStep: Step | undefined;
      currentStep?: never;
    };

/**
 * Returns the next URL of a Flow guide.
 * Takes into account whether we're in preview mode or not.
 *
 * If we're in preview mode, the plaholder URL is favored and the wildcard URL serves as a fallback.
 * If we're not in preview mode, only the wildcard URL is used.
 *
 * NOTE: The Placeholder URLs does not belong to the end-user context and shouldn't ever be used
 * in real experiences!
 *
 * @todo unit test
 */
export const nextUrlOfFlowSelector = (
  state: WorkingState,
  options: NextUrlOfFlowSelectorOptions
): string | undefined => {
  let nextStep: Step | undefined = options.nextStep;

  if (!nextStep) {
    const siblingsEntityId = siblingStepEntityIdsOfStepSelector(
      state,
      options.currentStep?.entityId
    );
    nextStep = stepSelector(siblingsEntityId?.next, state);
  }

  const nextTag = tagSelectorByStep(nextStep?.entityId, state);
  const isPreview = nextStep?.isPreview || nextTag?.isPreview;

  if (nextTag) {
    return isPreview ? nextTag.url || nextTag.wildcardUrl : nextTag.wildcardUrl;
  }
  return undefined;
};

export const moduleSelectorByStep = (
  stepEntityId: StepEntityId | undefined,
  state: WorkingState
): Module | undefined => {
  const step = stepSelector(stepEntityId, state);

  if (step?.module) {
    return moduleSelector(step.module, state);
  }

  return undefined;
};

export const guideSelectorByStep = (
  stepEntityId: StepEntityId | undefined,
  state: WorkingState
): Guide | undefined => {
  const step = stepSelector(stepEntityId, state);

  if (step?.guide) {
    return guideSelector(step.guide, state);
  } else if (step) {
    return Object.values<Guide>(state.guides).find((guide) =>
      guide.steps?.includes(stepEntityId!)
    );
  }

  return undefined;
};

export const guideSelectorByModule = (
  moduleEntityId: ModuleEntityId | undefined,
  state: WorkingState
): Guide | undefined => {
  const module = moduleSelector(moduleEntityId, state);
  return module?.guide ? guideSelector(module.guide, state) : undefined;
};

export const stepsSelectorOfModule = (
  moduleEntityId: ModuleEntityId | undefined,
  state: WorkingState
): Step[] =>
  (moduleEntityId &&
    moduleSelector(moduleEntityId, state)
      ?.steps?.map((stepEntityId) => stepSelector(stepEntityId, state)!)
      .filter(Boolean)
      .sort(sortByOrderIndexAsc)) ||
  [];

export const modulesSelectorOfGuide = (
  guideEntityId: GuideEntityId | undefined,
  state: WorkingState
): Module[] =>
  (guideEntityId &&
    guideSelector(guideEntityId, state)
      ?.modules?.map((moduleEntityId) => moduleSelector(moduleEntityId, state)!)
      .filter(Boolean)
      .sort(sortByOrderIndexAsc)) ||
  [];

/**
 * Returns all Steps of a Guide in correct order.
 */
export const stepsSelectorOfGuide = (
  guideEntityId: GuideEntityId | undefined,
  state: WorkingState
): Step[] => {
  return (
    (guideEntityId &&
      guideSelector(guideEntityId, state)
        ?.steps?.map((stepEntityId) => stepSelector(stepEntityId, state)!)
        .filter(Boolean)
        .sort(sortByOrderIndexAsc)) ||
    []
  );
};

export const stepsInSelectedGuideSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
) =>
  stepsSelectorOfGuide(
    formFactorSelector(state, formFactor)?.selectedGuide,
    state
  );

export const modulesInSelectedGuideSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
) =>
  modulesSelectorOfGuide(
    formFactorSelector(state, formFactor)?.selectedGuide,
    state
  );

export const newModuleSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
): Module | undefined => {
  return modulesInSelectedGuideSelector(state, formFactor).find((m) => m.isNew);
};

/**
 * Determine what guide to auto-focus when opening sidebar, if any.
 * Should favor any everboarding over any onboarding
 */
export const autoSelectGuideSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey,
  appLocation: UseLocationState,
  guidesToShow: GuideEntityId[]
) => {
  const nextOnboarding = leadingGuideSelector(state, formFactor);
  const nextEverboarding = everboardingGuidesSelector(
    state,
    formFactor,
    appLocation.href
  )?.[0];

  const nextOnboardingAllowed =
    nextOnboarding && guidesToShow.includes(nextOnboarding.entityId);
  const nextEverboardingAllowed =
    nextEverboarding && guidesToShow.includes(nextEverboarding.entityId);

  return nextEverboardingAllowed
    ? nextEverboarding
    : nextOnboardingAllowed
    ? nextOnboarding
    : undefined;
};

export const newGuideSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
): Guide | undefined =>
  mainQuestGuidesSelector(state, formFactor).find((g) => !g.isViewed);

export const leadingGuideSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
): Guide | undefined =>
  mainQuestGuidesSelector(state, formFactor).find(isIncompleteGuide);

export const nextLeadingGuideSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
): Guide | undefined =>
  guideSelector(leadingGuideSelector(state, formFactor)?.nextGuide, state);

export const leadingAnnouncementsSelector = (
  state: WorkingState,
  /** Determines up to which orderIndex we should look for announcements */
  maxOrderIndex: number = DEFAULT_PRIORITY_RANKING,
  /** Application page url */
  pageUrl: string | null | undefined
): Guide[] => {
  return sideQuestGuidesSelector(state).filter(
    (g) =>
      isAnnouncement(g.designType) &&
      isIncompleteGuide(g) &&
      g.orderIndex < maxOrderIndex &&
      (g.pageTargetingType === GuidePageTargetingType.anyPage ||
        (g.pageTargetingType === GuidePageTargetingType.specificPage &&
          isTargetPage(pageUrl, g.pageTargetingUrl)))
  );
};

export const lastFinishedGuideSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
): Guide | undefined => {
  return mainQuestGuidesSelector(state, formFactor)
    .sort(
      // orders by "finished at" desc
      (a, b) =>
        Math.max(b.completedAt?.getTime() || 0, b.doneAt?.getTime() || 0) -
        Math.max(a.completedAt?.getTime() || 0, a.doneAt?.getTime() || 0)
    )
    .find(isFinishedGuide);
};

export const selectedGuideForFormFactorSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
): Guide | undefined => {
  const formFactorState = formFactorSelector(state, formFactor);
  const inlineEmbed = inlineEmbedSelector(
    state,
    getInlineEmbedIdFromFormFactor(formFactor)
  );

  return guideSelector(
    inlineEmbed?.guide ?? formFactorState?.selectedGuide,
    state
  );
};

export const selectedArticleForFormFactorSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
) => {
  const formFactorState = formFactorSelector(state, formFactor);

  return formFactorState?.article;
};

export const selectedModuleForFormFactorSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
): Module | undefined => {
  const formFactorState = formFactorSelector(state, formFactor);
  return moduleSelector(formFactorState?.selectedModule, state);
};

export const selectedStepForFormFactorSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
): Step | undefined => {
  const formFactorState = formFactorSelector(state, formFactor);
  return stepSelector(formFactorState?.selectedStep, state);
};

export const formFactorGuidesSelector = <T extends Guide>(
  state: WorkingState,
  formFactor: FormFactorStateKey
): T[] =>
  (formFactorSelector(state, formFactor)?.guides || [])
    .map((entityId) => guideSelector<T>(entityId, state))
    .filter(Boolean) as T[];

export const firstModuleOfGuideSelector = (
  state: WorkingState,
  guideEntityId: GuideEntityId | undefined
): Module | undefined => modulesSelectorOfGuide(guideEntityId, state)?.[0];

export const firstStepOfGuideSelector = (
  state: WorkingState,
  guideEntityId: GuideEntityId | undefined
): Step | undefined => stepsSelectorOfGuide(guideEntityId, state)?.[0];

/**
 * Returns the list of all saved for later guides.
 * Currently only modals can be saved for later and will be returned here.
 */
export const savedForLaterGuidesSelector = (
  state: WorkingState,
  formFactor?: FormFactorStateKey
): Guide[] =>
  sideQuestGuidesSelector(
    state,
    formFactor && isPreviewFormFactor(state, formFactor)
      ? formFactor
      : EmbedFormFactor.modal
  ).filter(isSavedGuide);

/**
 * Returns the list of all everboarding guides available within the end-user's context
 * (i.e. page, visual tag, etc.), based on the guide's targeting type.
 *
 * Shouldn't include Tooltips because they are not eligible for the sidebar.
 */
export const everboardingGuidesSelector = (
  state: WorkingState,
  formFactor?: FormFactorStateKey,
  pageUrl?: string
): Guide[] =>
  sideQuestGuidesSelector(state, formFactor).filter((guide) => {
    if (
      !isEverboarding(guide.designType) ||
      isTooltip(guide.formFactor) ||
      isFinishedGuide(guide) ||
      // Do not show inline contextual guides as available.
      isInline(guide.formFactor)
    ) {
      return false;
    }

    const formFactorState = formFactorSelector(
      state,
      formFactor || EmbedFormFactor.sidebar
    );

    /**
     * Or if this guide selection have been recovered from client storage,
     * meaning we wanna keep this available within the active guides view
     * for the entire user session.
     */
    if (
      formFactorState?.initialGuide === guide.entityId ||
      (isInlineTargetedGuide(guide) &&
        formFactorState?.guides.includes(guide.entityId))
    ) {
      return true;
    }

    const tag = targetingTaggedElementOfGuideSelector(state, guide.entityId);

    return guideTargetingMatches(guide, pageUrl, tag);
  });

/**
 * Find the first contextual guide that specifically targets the given URL and belongs
 * to the given form factor.
 *
 * @deprecated not being used, might be removed in the future
 **/
export const everboardingGuideForPageSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey,
  pageUrl: string | undefined
): Guide | undefined => {
  return everboardingGuidesSelector(state, formFactor, pageUrl).find((guide) =>
    isPageTargetedGuide(guide)
  );
};

export const finishedOnboardingGuidesSelector = (
  state: WorkingState,
  formFactor?: FormFactorStateKey
) =>
  mainQuestGuidesSelector(state, formFactor).filter((g) => {
    return isFinishedGuide(g) && !g.isCyoa;
  });

/**
 * Returns the list of all everboarding guides that have been
 * completed.
 */
export const completeEverboardingGuidesSelector = (
  state: WorkingState,
  formFactor?: FormFactorStateKey,
  pageUrl?: string
): Guide[] =>
  sideQuestGuidesSelector(state, formFactor).filter((guide) => {
    const allow =
      isEverboarding(guide.designType) &&
      !isTooltip(guide.formFactor) &&
      isFinishedGuide(guide) &&
      // Do not show inline contextual guides as available.
      !isInline(guide.formFactor);

    if (!allow) return false;

    const tag = targetingTaggedElementOfGuideSelector(state, guide.entityId);
    return guideTargetingMatches(guide, pageUrl, tag);
  });

export const availableIncompleteGuidesSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey,
  pageUrl?: string
) => {
  const onboardingGuide = incompleteOnboardingGuideSelector(state, formFactor);
  return [
    ...(onboardingGuide ? [onboardingGuide] : []),
    ...everboardingGuidesSelector(state, formFactor, pageUrl),
    ...savedForLaterGuidesSelector(state, formFactor),
  ];
};

export const availableIncompleteChecklistGuidesSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey,
  pageUrl?: string
) => [
  ...incompleteOnboardingGuidesSelector(state, formFactor),
  ...everboardingGuidesSelector(state, formFactor, pageUrl),
];

export const incompleteOnboardingGuidesSelector = (
  state: WorkingState,
  formFactor?: FormFactorStateKey
): Guide[] =>
  mainQuestGuidesSelector(state, formFactor).filter(isIncompleteGuide);

export const incompleteOnboardingGuideSelector = (
  state: WorkingState,
  formFactor?: FormFactorStateKey
): Guide | undefined =>
  incompleteOnboardingGuidesSelector(state, formFactor)[0];

export const lastBranchingGuideSelector = (
  state: WorkingState,
  formFactor?: FormFactorStateKey
) => {
  const mainGuides = mainQuestGuidesSelector(state, formFactor);

  // Pick the most recent branching guide.
  return mainGuides.reduce((result: Guide | undefined, g) => {
    if (
      g.canResetOnboarding &&
      (result ? g.orderIndex < result.orderIndex : g)
    ) {
      result = g;
    }

    return result;
  }, undefined);
};

export const lastSerialCyoaInfoSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey | undefined
) => {
  // Pick the most recent serial CYOA guide that is not finished.
  return mainQuestGuidesSelector(state, formFactor).reduce(
    (result: SerialCyoaInfo, g) => {
      if (
        !g.isCyoa ||
        (result?.guide && result.guide.orderIndex < g.orderIndex)
      )
        return result;

      /**
       * After a guide branch is selected (non serial CYOA) and there
       * is a serial CYOA in progress, the steps are not added to the global
       * state anymore, causing 'step' to always be undefined.
       */
      const step = stepsSelectorOfGuide(g.entityId, state)?.[0];

      if (!isSerialCyoa(step?.branching?.type, step?.branching?.multiSelect))
        return result;

      const branches = branchedGuidesOfGuideSelector(
        state,
        formFactor,
        g?.entityId
      );

      const dismissDisabled = !!step?.branching?.dismissDisabled;
      const dismissed = isSkippedStep(step?.state);

      const total = step?.branching?.branches?.length || 0;
      const complete = branches.filter((branch) =>
        isFinishedGuide(branch)
      ).length;
      const incomplete = total - complete;

      const selectedBranchesCount =
        step?.branching?.branches.filter((b) => b.selected).length || 0;
      /**
       * If there are more branches selected than completed,
       * consider the CYOA guide to be in progress.
       */
      const branchInProgress = selectedBranchesCount > complete;

      /**
       * CYOA is finished if:
       * - There is no guide.
       * - Cannot select another path. (single)
       * - All paths are complete. (multi)
       */
      const isFinished = !g?.entityId || dismissed || incomplete === 0;

      return {
        guide: g,
        step,
        branches,
        branchInProgress,
        dismissDisabled,
        total,
        complete,
        incomplete,
        dismissed,
        isFinished,
      };
    },
    {
      guide: undefined,
      step: undefined,
      branches: [],
      branchInProgress: false,
      dismissDisabled: false,
      total: 0,
      isNew: true,
      complete: 0,
      incomplete: 0,
      dismissed: false,
      isFinished: true,
    } as SerialCyoaInfo
  );
};

export const branchingStepInGuideSelector = (
  state: WorkingState,
  guideEntityId: GuideEntityId | undefined
) =>
  stepsSelectorOfGuide(guideEntityId, state).find((s) =>
    isBranchingStep(s.stepType)
  );

export const activeTooltipSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
): Guide | undefined => {
  const formFactorState = formFactorSelector(state, formFactor);
  const formFactorGuides = formFactorGuidesSelector(state, formFactor);
  return formFactorGuides.find(
    (guide) =>
      guide.entityId === formFactorState?.selectedGuide ||
      (isTooltipGuide(guide.formFactor) && !isFinishedGuide(guide))
  );
};

export const branchedGuidesOfGuideSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey | undefined,
  guideEntityId: GuideEntityId | undefined
) => {
  const mainGuides = mainQuestGuidesSelector(state, formFactor);
  return mainGuides.filter(
    (g) => g.branchedFromGuide && g.branchedFromGuide === guideEntityId
  );
};

export const canResetOnboardingSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
): boolean => {
  const currentGuide = selectedGuideForFormFactorSelector(state, formFactor);
  const branchingGuide = lastBranchingGuideSelector(state, formFactor);

  const isAnyBranchCompleted = branchedGuidesOfGuideSelector(
    state,
    formFactor,
    branchingGuide?.entityId
  ).some((g) => isFinishedGuide(g));

  return (
    !!branchingGuide &&
    !isAnyBranchCompleted &&
    currentGuide?.branchedFromGuide === branchingGuide.entityId &&
    !isFinishedGuide(currentGuide)
  );
};

export const guideIsHydratedSelector = (
  state: WorkingState,
  guideEntityId?: GuideEntityId
) => isGuideHydrated(guideSelector(guideEntityId, state));

export const isGuideSelectedSelector = (
  state: WorkingState,
  guideEntityId?: GuideEntityId
) =>
  guideEntityId
    ? Object.values<FormFactorState>(state.formFactors).some(
        ({ selectedGuide }) => selectedGuide === guideEntityId
      )
    : false;

/**
 * Gets the next incomplete step that is not
 * the currently selected one, useful for transitions
 * where guide.firstIncompleteStep hasn't been updated.
 */
export const nextIncompleteStepOfGuideSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
): Step | undefined => {
  const guide = selectedGuideForFormFactorSelector(state, formFactor);
  const currentStep = selectedStepForFormFactorSelector(state, formFactor);
  const currentStepOrderIndex = currentStep?.orderIndex ?? -1;

  return stepsSelectorOfGuide(guide?.entityId, state).find(
    (step, stepIndex) => {
      return (
        !isFinishedStep(step.state) &&
        step.entityId !== currentStep?.entityId &&
        stepIndex > currentStepOrderIndex
      );
    }
  );
};

export const branchingPathSelector = (
  state: WorkingState,
  branchingKey: BranchingKey,
  choiceKey: BranchingChoiceKey
): BranchingPath => state.branchingPaths.paths[`${branchingKey}-${choiceKey}`];

export const branchingChoiceResourceSelector = (
  state: WorkingState,
  branchingKey: BranchingKey,
  choiceKeys: BranchingChoiceKey[]
): { guides?: FullGuide[]; modules?: FullModule[] } => {
  const branchingPaths = choiceKeys.map((choiceKey) =>
    branchingPathSelector(state, branchingKey, choiceKey)
  );

  if (branchingPaths[0]?.guide) {
    const branchingPathChoicesByGuideEntityId: Record<
      GuideEntityId,
      FullGuide['branchedFromChoice']
    > = branchingPaths.reduce((acc, bp) => {
      if (bp.guide)
        acc[bp.guide] = {
          choiceKey: bp.choiceKey,
          branchingKey: bp.branchingKey,
        };
      return acc;
    }, {});

    return {
      guides: (
        denormalize(
          Object.keys(branchingPathChoicesByGuideEntityId),
          [normalizrSchema.guide],
          state.branchingPaths
        ) as FullGuide[]
      ).map((g) => {
        g.branchedFromChoice = branchingPathChoicesByGuideEntityId[g.entityId];
        return g;
      }),
    };
  } else if (branchingPaths[0]?.module) {
    const moduleEntityIds = branchingPaths.map((bp) => bp.module);
    return {
      modules: denormalize(
        moduleEntityIds,
        [normalizrSchema.module],
        state.branchingPaths
      ) as FullModule[],
    };
  }
  return {};
};

export const guidesDetailsSelector = (
  state: WorkingState,
  guides: (GuideEntityId | AtLeast<Guide, 'entityId'>)[]
) =>
  guides.reduce((acc, g) => {
    const entityId = typeof g === 'string' ? g : g.entityId;
    const guide = guideSelector(entityId, state);

    const firstStep = guide?.stepsInfo?.[0];
    const lastStep = guide?.stepsInfo?.[guide.totalSteps - 1];

    const firstStepName = firstStep?.name || '-';
    const lastStepName = (lastStep?.name ?? firstStepName) || '-';
    const stepCount = guide?.stepsInfo?.length ?? 0;

    acc[entityId] = {
      firstIncompleteStep: guide?.stepsByState?.incomplete?.[0],
      firstStepName,
      lastStepName,
      stepCount,
      description:
        guide?.description ||
        (isAnnouncement(guide?.designType) || isTooltipGuide(guide?.formFactor)
          ? getBodySlateString(firstStep?.bodySlate) || '-'
          : ''),
    };

    return acc;
  }, {} as Record<GuideEntityId, GuideCardDetails>);

/**
 * Returns available guides in the following order:
 * - Current active guide.
 * - Incomplete everboarding guides.
 * - Onboarding guides that aren't complete but the user already saw.
 * - Saved for later announcements.
 */
export const availableGuidesSelector = (
  state: WorkingState,
  pageUrl: string | null | undefined,
  formFactor?: FormFactorStateKey
): Guide[] => {
  const currentGuide = incompleteOnboardingGuideSelector(state, formFactor);

  return [
    ...(currentGuide ? [currentGuide] : []),
    // Although the sidebar toggle isn't shown for certain visibility settings
    // we still want to show everboarding guides when a customer implements a custom
    // toggle.
    ...everboardingGuidesSelector(state, formFactor, pageUrl!),
    ...mainQuestGuidesSelector(state, formFactor).filter(
      (g) =>
        // Discard current guide.
        g.entityId !== currentGuide?.entityId &&
        // Completed guides are shown as 'previousGuides'.
        !isFinishedGuide(g)
    ),
    ...savedForLaterGuidesSelector(state, formFactor),
  ];
};

/**
 * Returns all guides the end-user has/had access to, regardless
 * of state and form factor (unsorted).
 */
export const allGuidesSelector = (state: WorkingState) =>
  Object.values(state.guides);

/**
 * Returns completed guides in the following order:
 * - Onboarding guides.
 * - Announcements.
 */
export const previousGuidesSelector = (
  state: WorkingState,
  sidebarVisibility: SidebarVisibility,
  pageUrl: string | null | undefined,
  formFactor: FormFactorStateKey
) => {
  const allowedGuideTypes = allowedGuideTypesSettings(
    sidebarVisibility,
    formFactor
  );
  const result = {
    onboarding: [] as Guide[],
    announcements: [] as Guide[],
    total: 0,
  };

  if (allowedGuideTypes.completed) {
    result.onboarding.push(
      // Complete everboarding guides.
      ...completeEverboardingGuidesSelector(state, formFactor, pageUrl!).sort(
        sortFinishedGuides(false)
      ),
      // Finished onboarding guides
      ...finishedOnboardingGuidesSelector(state, formFactor).sort(
        sortFinishedGuides(false)
      )
    );
    result.announcements.push(
      // Dismissed announcements.
      ...dismissedAnnouncementsSelector(state, formFactor).sort(
        sortFinishedGuides(false)
      )
    );
  }

  result.total = result.onboarding.length + result.announcements.length;

  return result;
};

export const isBranchingCompletedByCtaSelector = (
  state: WorkingState,
  stepEntityId: StepEntityId | undefined
): boolean => {
  const step = stepSelector(stepEntityId, state);

  return !!(
    isBranchingStep(step?.stepType) &&
    step?.ctas?.some((cta) => cta.type === StepCtaType.complete)
  );
};

export const siblingStepEntityIdsOfStepSelector = (
  state: WorkingState,
  stepEntityId: StepEntityId | undefined
): { previous: StepEntityId | undefined; next: StepEntityId | undefined } => {
  const step = stepSelector(stepEntityId, state);
  const module = moduleSelector(step?.module, state);
  const previousModule = moduleSelector(module?.previousModule, state);
  const nextModule = moduleSelector(module?.nextModule, state);

  return {
    previous:
      step?.previousStep ||
      previousModule?.steps?.[previousModule.steps.length - 1],
    next: step?.nextStep || nextModule?.steps?.[0],
  };
};

/** Supported themes: Carousel. */
export const wasInlineContextualGuideDismissedSelector = (
  state: WorkingState,
  guideEntityId: GuideEntityId | undefined
): boolean => {
  const guide = guideSelector(guideEntityId, state);
  if (!isInlineContextualGuide(guide?.theme)) return false;
  const steps = stepsSelectorOfGuide(guideEntityId, state);
  return (
    !guideIsHydratedSelector(state, guide!.entityId) ||
    steps.some((s) => s.state === StepState.skipped)
  );
};

export const isEverboardingInlineSelector = (
  state: WorkingState,
  formFactor: FormFactorStateKey
): boolean => {
  return !!inlineEmbedSelector(
    state,
    getInlineEmbedIdFromFormFactor(formFactor) as InlineEmbedEntityId
  )?.guide;
};

/**
 * Returns all NPS Surveys the end-user has/had access to, regardless
 * of state and form factor (unsorted).
 *
 * NOTE: At any given moment there can be only a single NPS Survey available
 * to the user, but we act as if many were possible.
 *
 * Also, surveys are ephemeral and will go away as soon as interacted with.
 */
export const allNpsSurveysSelector = (state: WorkingState) =>
  Object.values(state.npsSurveys);

export const npsSurveySelector = (
  state: WorkingState,
  entityId: NpsSurveyEntityId
) => {
  return entityId ? state.npsSurveys[entityId] : undefined;
};

export const shouldHideCompleteStepSelector = (
  state: WorkingState,
  stepEntityId: StepEntityId | undefined,
  guideSuccessShowing: boolean
): HideOnCompletionData => {
  const step = stepSelector(stepEntityId, state);
  const guide = guideSelector(step?.guide, state);
  const hideCompletedSteps = (guide?.formFactorStyle as ChecklistStyle)
    ?.hideCompletedSteps;
  const finishedGuide = isFinishedGuide(guide);

  if (!hideCompletedSteps)
    return {
      value: false,
      delayed: false,
    };

  if (finishedGuide && guideSuccessShowing)
    return {
      value: true,
      delayed: false,
    };

  return {
    value: !!(
      isFinishedStep(step?.state) &&
      !finishedGuide &&
      !isBranchingStep(step?.stepType)
    ),
    delayed: true,
  };
};

export const shouldHideCompleteModuleSelector = (
  state: WorkingState,
  moduleEntityId: ModuleEntityId | undefined,
  guideSuccessShowing: boolean
): HideOnCompletionData => {
  const module = moduleSelector(moduleEntityId, state);
  const guide = guideSelector(module?.guide, state);
  const hideCompletedSteps = (guide?.formFactorStyle as ChecklistStyle)
    ?.hideCompletedSteps;
  const finishedGuide = isFinishedGuide(guide);

  if (!hideCompletedSteps)
    return {
      value: false,
      delayed: false,
    };

  if (finishedGuide && guideSuccessShowing)
    return {
      value: true,
      delayed: false,
    };

  const steps = stepsSelectorOfModule(module?.entityId, state);
  const hasBranchinsStep = steps.some(isBranchingStep);

  return {
    value: !!(module?.isComplete && !finishedGuide && !hasBranchinsStep),
    delayed: true,
  };
};
