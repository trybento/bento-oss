import { NormalizedSchema, schema } from 'normalizr';
import {
  Guide,
  Module,
  Step,
  TaggedElement,
  BranchingPath,
  StepAutoCompleteInteraction,
  GuideEntityId,
  ModuleEntityId,
  StepEntityId,
  InlineEmbed,
  TaggedElementEntityId,
  NpsSurvey,
  EmbedTypenames,
} from 'bento-common/types/globalShoyuState';
import { getImplicitStepCtas, hasKey } from 'bento-common/data/helpers';
import { GuideCompletionState } from 'bento-common/types';

import { stringToDate } from './helpers';

type GuideEntities = {
  guides: Record<GuideEntityId, Guide>;
  modules?: Record<ModuleEntityId, Module>;
  steps?: Record<StepEntityId, Step>;
  taggedElements?: Record<TaggedElementEntityId, TaggedElement>;
};

export type NormalizedGuideData = NormalizedSchema<
  GuideEntities,
  GuideEntityId
>;

export type NormalizedGuidesData = NormalizedSchema<
  GuideEntities,
  GuideEntityId[]
>;

const procressDefaultStepCtas = (step) => {
  const ctas = step.ctas || [];
  const includedCtaTypes: Record<string, boolean> = ctas.reduce((acc, cta) => {
    acc[cta.type] = true;
    return acc;
  }, {});

  /** Check if step has implict CTAs,
   * otherwise, add them.
   */
  const implicitCtas = getImplicitStepCtas({
    stepType: step.stepType,
    branchingMultiple: step.branching?.multiSelect,
    branchingType: step.branching?.type,
  }).filter((icta) => !includedCtaTypes[icta.type]);

  return implicitCtas.concat(ctas);
};

const step = new schema.Entity<Step>(
  'steps',
  {},
  {
    idAttribute: 'entityId',
    processStrategy: (step) => {
      const ctas = procressDefaultStepCtas(step);

      return {
        ...step,
        ...(hasKey(step, 'completedAt') && {
          completedAt: stringToDate(step.completedAt),
        }),
        nextStep: step.nextStep || step.nextStepEntityId,
        previousStep: step.previousStep || step.previousStepEntityId,
        ctas,
      };
    },
  }
);

const moduleSchema = new schema.Entity<Module>(
  'modules',
  { steps: [step] },
  { idAttribute: 'entityId' }
);

const taggedElement = new schema.Entity<TaggedElement>(
  'taggedElements',
  {},
  {
    idAttribute: 'entityId',
    processStrategy: (tag) => {
      return { ...tag, dismissedAt: stringToDate(tag.dismissedAt) };
    },
  }
);

const guide = new schema.Entity<Guide>(
  'guides',
  { modules: [moduleSchema], taggedElements: [taggedElement] },
  {
    idAttribute: 'entityId',
    processStrategy: (guide) => {
      return {
        ...guide,
        __typename: guide.__typename ?? EmbedTypenames.guide,
        // converts completedAt from string to date
        ...(hasKey(guide, 'completedAt') && {
          completedAt: stringToDate(guide.completedAt),
        }),
        // converts doneAt from string to date
        ...(hasKey(guide, 'doneAt') && {
          doneAt: stringToDate(guide.doneAt),
        }),
        // converts savedAt from string to date
        ...(hasKey(guide, 'savedAt') && {
          savedAt: stringToDate(guide.savedAt),
        }),
        // backfill isComplete from either isComplete or completionState
        isComplete: !!(
          // guide.isComplete needed for previews.
          (
            guide.isComplete ||
            guide.completionState === GuideCompletionState.complete
          )
        ),
        isDone: [
          GuideCompletionState.complete,
          GuideCompletionState.done,
        ].includes(guide.completionState),
      };
    },
  }
);

const stepAutoCompleteInteraction =
  new schema.Entity<StepAutoCompleteInteraction>(
    'stepAutoCompleteInteractions',
    {},
    { idAttribute: 'entityId' }
  );

const branchingPath = new schema.Entity<BranchingPath>(
  'branchingPaths',
  { module: moduleSchema, guide },
  { idAttribute: (bp) => `${bp.branchingKey}-${bp.choiceKey}` }
);

const inlineEmbed = new schema.Entity<InlineEmbed>(
  'inlineEmbeds',
  {},
  { idAttribute: 'entityId' }
);

const npsSurvey = new schema.Entity<NpsSurvey>(
  'npsSurveys',
  {},
  {
    idAttribute: 'entityId',
    processStrategy: (survey) => ({
      ...survey,
      __typename: survey.__typename ?? EmbedTypenames.npsSurvey,
    }),
  }
);

const normalizrSchema = {
  branchingPath,
  taggedElement,
  stepAutoCompleteInteraction,
  guide,
  module: moduleSchema,
  step,
  inlineEmbed,
  npsSurvey,
};

export default normalizrSchema;
