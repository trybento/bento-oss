import omit from 'lodash/omit';
import keyBy from 'lodash/keyBy';
import { v4 as uuidv4 } from 'uuid';
import cloneDeep from 'lodash/cloneDeep';

import {
  BranchingEntityType,
  FormFactorStyle,
  GuideDesignType,
  GuideFormFactor,
  GuidePageTargetingType,
  GuideTypeEnum,
  Theme,
  StepType,
  BranchingStyle,
  GuideState,
  GuideCompletionState,
} from 'bento-common/types';
import {
  BranchingChoiceKey,
  BranchingFormFactor,
  BranchingKey,
  BranchingPathBase,
  FullGuide,
  FullModule,
  GuideEntityId,
  ModuleEntityId,
  Step,
  StepEntityId,
  StepState,
  BranchingPathWithResource,
  EmbedTypenames,
} from 'bento-common/types/globalShoyuState';
import { guideNameOrFallback } from 'bento-common/utils/naming';
import { isCarouselTheme, isFlatTheme } from 'bento-common/data/helpers';
import {
  BranchingPathData,
  BranchingType,
  StepPrototypeValue,
  TemplateModuleValue,
  TemplateValue,
} from 'bento-common/types/templateData';

import { NO_MODULE_PLACEHOLDER } from 'helpers/constants';
import { GuideBase } from 'providers/PersistedGuideBaseProvider';
import { getFakeUuidEntityId } from 'bento-common/data/fullGuide';

/** Fake guide keys that don't exist on templates.
 * TODO: Select active step being edited as the first incomplete step.
 */
export const templateToGuideTransformer = (
  originalTemplate: TemplateValue,
  overridesFirstIncompleteStep?: StepEntityId
): FullGuide => {
  // Remove readonly keys.
  const template = cloneDeep(originalTemplate);

  const modules = template.modules.map((m, i, ms) =>
    templateModuleToGuideModule(
      m,
      template.entityId as GuideEntityId,
      i,
      ms,
      template.theme as Theme
    )
  );

  const steps = modules.flatMap((m) => {
    const combineModules = isCarouselTheme(template.theme as Theme);

    return m.steps.map((s, i) => {
      if (combineModules) {
        s.nextStep = m.steps[i + 1]?.entityId as StepEntityId;
        s.previousStep = m.steps[i - 1]?.entityId as StepEntityId;
      }
      return s;
    });
  });

  return {
    ...template,
    __typename: EmbedTypenames.guide,
    name: guideNameOrFallback(template.name),
    entityId: template.entityId as GuideEntityId,
    type: template.type as GuideTypeEnum,
    theme: template.theme as Theme,
    formFactor:
      template.pageTargetingType === GuidePageTargetingType.inline
        ? GuideFormFactor.inline
        : (template.formFactor as GuideFormFactor),
    formFactorStyle: template.formFactorStyle as FormFactorStyle,
    modules,
    designType: template.designType as GuideDesignType,
    firstIncompleteModule: modules?.[0]?.entityId,
    firstIncompleteStep:
      overridesFirstIncompleteStep || modules?.[0]?.steps?.[0]?.entityId,
    canResetOnboarding: false,
    isDestination: false,
    isComplete: false,
    completionState: GuideCompletionState.incomplete,
    isDone: false,
    isViewed: false,
    isSideQuest: !!template.isSideQuest,
    totalSteps: steps.length,
    completedStepsCount: 0,
    orderIndex: 0,
    pageTargetingType: template.pageTargetingType as GuidePageTargetingType,
    pageTargetingUrl: null,
    steps,
    isPreview: true,
  } as FullGuide;
};

export const templateModuleToGuideModule = (
  module: TemplateModuleValue,
  guide: GuideEntityId | null,
  i: number,
  modules: TemplateModuleValue[],
  theme: Theme | null | undefined
): FullModule => {
  const continuousStepIndexes = isFlatTheme(theme);

  const startingStepIndex = continuousStepIndexes
    ? (modules || []).reduce((acc, m, mi) => {
        if (mi < i) acc += m.stepPrototypes?.length || 0;
        return acc;
      }, 0)
    : 0;

  return {
    ...omit(module, 'stepPrototypes'),
    name: module.name,
    entityId: module.entityId as ModuleEntityId,
    steps: module.stepPrototypes.map((s, si, ss) =>
      stepBranchingTransformer(
        s,
        module.entityId as ModuleEntityId,
        guide,
        startingStepIndex + si,
        ss
      )
    ),
    totalStepsCount: module.stepPrototypes.length,
    completedStepsCount: 0,
    orderIndex: i,
    isComplete: false,
    guide,
    nextModule: modules[i + 1]?.entityId as ModuleEntityId,
    previousModule: modules[i - 1]?.entityId as ModuleEntityId,
  };
};

export type PreviewBranchingPath = BranchingPathBase & {
  template?: TemplateValue;
  module?: TemplateModuleValue;
};

export const branchingPathTransformer = (
  paths: PreviewBranchingPath[]
): BranchingPathWithResource[] =>
  paths.map((path) => ({
    ...omit(path, 'template', 'module'),
    ...(path.module
      ? {
          module: templateModuleToGuideModule(
            path.module,
            null,
            0,
            [path.module],
            null
          ),
        }
      : path.template && { guide: templateToGuideTransformer(path.template) }),
  }));

/**
 * @todo correct step prototype query, its modified from the query
 *
 * Note: Guide preview
 */
export const stepBranchingTransformer = (
  stepPrototype: StepPrototypeValue,
  moduleEntityId: ModuleEntityId,
  guideEntityId: GuideEntityId | null,
  i: number,
  steps: StepPrototypeValue[]
): Step => {
  const branchingKey = (stepPrototype.branchingKey ||
    stepPrototype.entityId ||
    uuidv4()) as BranchingKey;

  const branchingPathsByChoiceKey = keyBy(
    stepPrototype.branchingPathData || [],
    'choiceKey'
  ) as any;

  const branchingChoicesByChoiceKey = keyBy(
    stepPrototype.branchingChoices || [],
    'choiceKey'
  ) as any;

  return {
    ...stepPrototype,
    stepType: stepPrototype.stepType as StepType,
    state: StepState.incomplete,
    module: moduleEntityId,
    guide: guideEntityId,
    orderIndex: i,
    mediaReferences: stepPrototype.mediaReferences ?? [],
    isComplete: false,
    inputs: stepPrototype.inputs?.map((i) => ({
      ...i,
      entityId: i.entityId ?? getFakeUuidEntityId(),
      answer: '',
    })),
    hasViewedStep: false,
    wasCompletedAutomatically: false,
    manualCompletionDisabled: stepPrototype.manualCompletionDisabled ?? false,
    nextStep: steps[i + 1]
      ? (steps[i + 1].entityId as StepEntityId)
      : undefined,
    previousStep: steps[i - 1]
      ? (steps[i - 1].entityId as StepEntityId)
      : undefined,
    ctas: stepPrototype.ctas?.map((c) => ({
      ...c,
      entityId: c.entityId ?? getFakeUuidEntityId(),
    })),
    branching: stepPrototype.branchingChoices && {
      key: branchingKey,
      type: stepPrototype.branchingEntityType as unknown as BranchingEntityType,
      question: stepPrototype.branchingQuestion,
      multiSelect: stepPrototype.branchingMultiple,
      dismissDisabled: !!stepPrototype.branchingDismissDisabled,
      formFactor: stepPrototype.branchingFormFactor as BranchingFormFactor,
      branches:
        stepPrototype.branchingChoices?.map(({ choiceKey, label }) => {
          return {
            key: choiceKey as BranchingChoiceKey,
            branchingKey,
            label,
            selected: false,
            style: (branchingPathsByChoiceKey[choiceKey]?.style ||
              branchingChoicesByChoiceKey[choiceKey]?.style) as BranchingStyle,
          };
        }) || undefined,
    },
  };
};

/**
 * @todo correct template type, its modified from the query
 */
export const addBranchingKeysToPreviewTemplate = (
  template: TemplateValue
): TemplateValue => ({
  ...template,
  modules: template.modules.map((m) => ({
    ...m,
    stepPrototypes: m.stepPrototypes.map((s) => {
      const branchingKey = (s as any).branchingKey || s.entityId || uuidv4();
      const branchingChoicesByChoiceKey = keyBy(
        s.branchingChoices || [],
        'choiceKey'
      );

      return {
        ...s,
        branchingKey,
        branchingEntityType:
          s.branchingEntityType || s.branchingPathData?.[0]?.entityType,
        branchingChoices:
          s.branchingPathData?.map((bp) => ({
            // @ts-ignore
            label: bp.label || branchingChoicesByChoiceKey[bp.choiceKey]?.label,
            choiceKey: bp.choiceKey,
            selected: false,
            style: branchingChoicesByChoiceKey[bp.choiceKey]?.style,
          })) || null,
        branchingPathData:
          s.branchingPathData?.map((bp) => ({
            ...bp,
            branchingKey: branchingKey,
          })) || null,
      };
    }),
  })),
});

/**
 * Get list of module/template entityIds from branchingPaths
 */
export const branchingPathsToEntityIdList = (
  branchingPaths: BranchingPathData[]
) =>
  branchingPaths?.reduce(
    (pathResources, path) => {
      if (path) {
        if (path.templateEntityId) {
          pathResources[0].push(path.templateEntityId);
        } else if (
          path.moduleEntityId &&
          path.moduleEntityId !== NO_MODULE_PLACEHOLDER
        ) {
          pathResources[1].push(path.moduleEntityId);
        }
      }
      return pathResources;
    },
    [[], []]
  ) || [[], []];

/** Attach the destination content so it can be parsed from directly off the branch */
export const composeBranchingPaths = ({
  branchingPaths,
  templates,
  modules,
}: {
  branchingPaths: BranchingPathData[];
  templates: readonly any[];
  modules: readonly any[];
}): PreviewBranchingPath[] =>
  branchingPaths.map<PreviewBranchingPath>((path) => ({
    ...path,
    choiceKey: path.choiceKey as BranchingChoiceKey,
    branchingKey: path.branchingKey as BranchingKey,
    entityType: path.entityType as BranchingType,
    ...((path.templateEntityId
      ? {
          template: templates.find(
            (t) => t.entityId === path.templateEntityId
          ) as any,
        }
      : path.moduleEntityId && {
          module: modules.find((m) => m.entityId === path.moduleEntityId),
        }) as any),
  }));

/**
 * GUIDE-BASE HELPERS
 */

export const guideBaseToGuideTransformer = (
  originalGuideBase: GuideBase
): FullGuide => {
  // Remove readonly keys.
  const guideBase = cloneDeep(originalGuideBase);

  const modules = guideBase.guideModuleBases.map((m, i, ms) =>
    guideBaseModuleToGuideModule(
      m,
      guideBase.entityId as GuideEntityId,
      i,
      ms,
      guideBase.theme as Theme
    )
  );

  const steps = modules.flatMap((m) => {
    const combineModules = isCarouselTheme(guideBase.theme as Theme);
    return m.steps.map((s, i) => {
      if (combineModules) {
        s.nextStep = m.steps[i + 1]?.entityId as StepEntityId;
        s.previousStep = m.steps[i - 1]?.entityId as StepEntityId;
      }
      return s;
    });
  });

  return {
    taggedElements: [],
    ...guideBase,
    name: guideBase.name,
    entityId: guideBase.entityId as GuideEntityId,
    type: guideBase.type as GuideTypeEnum,
    theme: guideBase.theme as Theme,
    formFactor:
      guideBase.pageTargetingType === GuidePageTargetingType.inline
        ? GuideFormFactor.inline
        : (guideBase.formFactor as GuideFormFactor),
    formFactorStyle: guideBase.formFactorStyle,
    modules,
    designType: guideBase.designType as GuideDesignType,
    firstIncompleteModule: modules?.[0]?.entityId,
    firstIncompleteStep: modules?.[0]?.steps?.[0]?.entityId,
    canResetOnboarding: false,
    isDestination: false,
    isComplete: false,
    state: GuideState.active,
    isDone: false,
    isViewed: false,
    isCyoa: false,
    isSideQuest: !!guideBase.isSideQuest,
    totalSteps: steps.length,
    completedStepsCount: 0,
    orderIndex: 0,
    pageTargetingType: guideBase.pageTargetingType as GuidePageTargetingType,
    pageTargetingUrl: null,
    steps,
    isPreview: true,
  } as FullGuide;
};

export const guideBaseModuleToGuideModule = (
  module,
  guide: GuideEntityId | null,
  i: number,
  modules,
  theme: Theme | null | undefined
): FullModule => {
  const continuousStepIndexes = isFlatTheme(theme);

  const startingStepIndex = continuousStepIndexes
    ? (modules || []).reduce((acc, m, mi) => {
        if (mi < i) acc += m.guideStepBases?.length || 0;
        return acc;
      }, 0)
    : 0;

  return {
    ...omit(module, 'guideStepBases'),
    name: module.name,
    entityId: module.entityId as ModuleEntityId,
    steps: module.guideStepBases.map((s, si, ss) =>
      guideBaseStepTransformer(
        s,
        module.entityId as ModuleEntityId,
        guide,
        startingStepIndex + si,
        ss
      )
    ),
    totalStepsCount: module.guideStepBases.length,
    completedStepsCount: 0,
    orderIndex: i,
    isComplete: false,
    guide,
    nextModule: modules[i + 1]?.entityId as ModuleEntityId,
    previousModule: modules[i - 1]?.entityId as ModuleEntityId,
  };
};

export const guideBaseStepTransformer = (
  step,
  moduleEntityId: ModuleEntityId,
  guideEntityId: GuideEntityId | null,
  i: number,
  steps
): Step => {
  const branchingKey = (step.branchingKey ||
    step.entityId ||
    uuidv4()) as BranchingKey;

  const branchingPathsByChoiceKey = keyBy(
    step.branchingPathData || [],
    'choiceKey'
  ) as any;

  return {
    ...step,
    entityId: (step.entityId as StepEntityId) || (uuidv4() as StepEntityId),
    stepType: step.stepType as StepType,
    state: StepState.incomplete,
    module: moduleEntityId,
    guide: guideEntityId,
    orderIndex: i,
    isComplete: false,
    hasViewedStep: false,
    wasCompletedAutomatically: false,
    nextStep: steps[i + 1]?.entityId as StepEntityId,
    previousStep: steps[i - 1]?.entityId as StepEntityId,
    branching: step.branchingChoices && {
      key: branchingKey,
      type: step.branchingEntityType as BranchingEntityType,
      question: step.branchingQuestion,
      multiSelect: step.branchingMultiple,
      dismissDisabled: !!step.branchingDismissDisabled,
      formFactor: step.branchingFormFactor as BranchingFormFactor,
      branches:
        step.branchingChoices?.map(({ choiceKey, label }) => {
          return {
            key: choiceKey as BranchingChoiceKey,
            branchingKey,
            label,
            selected: false,
            style: branchingPathsByChoiceKey[choiceKey]
              ?.style as BranchingStyle,
          };
        }) || undefined,
    },
  };
};
