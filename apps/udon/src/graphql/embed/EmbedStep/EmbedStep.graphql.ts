import { InputStepAnswer } from 'src/data/models/inputStepAnswer.model';
import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';

import { StepState } from 'bento-common/types/globalShoyuState';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import { StepCtaType } from 'bento-common/types';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import EntityIdType, { entityIdField } from 'bento-common/graphql/EntityId';
import {
  fetchAndMapDynamicAttributes,
  replaceBodySlateDynamicAttributes,
} from 'src/interactions/replaceDynamicAttributes';
import { Step } from 'src/data/models/Step.model';
import { StepCompletedByType } from 'src/data/models/Step.model';
import {
  BranchingFormFactorEnumType,
  StepTypeEnumType,
} from 'src/graphql/graphQl.types';
import { calculateStepOrderIndex } from 'src/interactions/calculateStepOrderIndex';
import { EmbedContext } from 'src/graphql/types';
import { BranchingPathEntityType } from 'src/graphql/BranchingPath/BranchingPath.graphql';
import { resolveStepState } from './helpers';
import EmbedStepCtaType from '../EmbedStepCta/EmbedStepCta.graphql';
import EmbedInputStep from '../EmbedInputStep/EmbedInputStep.graphql';
import { doneAtResolver } from 'src/graphql/Guide/Guide.helpers';
import { BranchingStyleResolverField } from 'src/graphql/Branching/branchingStyle';
import AccountUserType from 'src/graphql/AccountUser/AccountUser.graphql';
import { BranchingBranch } from 'src/data/models/types';
import MediaReferenceType from 'src/graphql/Media/MediaReference.graphql';

export const StepStateEnumType = enumToGraphqlEnum({
  name: 'StepState',
  description: 'Indicates the current state of this step',
  enumType: StepState,
});

export const EmbedBranchType = new GraphQLObjectType<
  BranchingBranch,
  EmbedContext
>({
  name: 'EmbedBranch',
  fields: () => ({
    key: {
      type: GraphQLString,
      resolve: ({ choiceKey }) => choiceKey,
    },
    label: {
      type: GraphQLString,
    },
    selected: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ selected }) => !!selected,
    },
    style: BranchingStyleResolverField,
  }),
});

export const EmbedGuideBranchedFromChoiceType = new GraphQLObjectType<
  Step,
  EmbedContext
>({
  name: 'EmbedGuideBranchedFromChoice',
  fields: () => ({
    branchingKey: {
      type: GraphQLString,
    },
    choiceKey: {
      type: GraphQLString,
    },
  }),
});

export const EmbedBranchingType = new GraphQLObjectType<Step, EmbedContext>({
  name: 'EmbedBranching',
  fields: () => ({
    key: {
      type: GraphQLString,
    },
    type: {
      type: BranchingPathEntityType,
      description: 'The type of target that is created by the action',
    },
    question: {
      type: GraphQLString,
    },
    multiSelect: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    dismissDisabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    formFactor: {
      type: BranchingFormFactorEnumType,
    },
    branches: {
      type: new GraphQLList(new GraphQLNonNull(EmbedBranchType)),
    },
  }),
});

const StepType = new GraphQLObjectType<Step, EmbedContext>({
  name: 'EmbedStep',
  description: 'A step that exists within a guide',
  fields: {
    ...globalEntityId('EmbedStep'),
    ...entityIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the step',
      resolve: async (step, _, { loaders }) => {
        return loaders.nameOfStepLoader.load(step.id);
      },
    },
    bodySlate: {
      type: GraphQLJSON,
      description: 'The contents of the step',
      resolve: async (step, _, { accountUser, loaders }) => {
        // NOTE: Using 'account' from context causes guide-changed subscriptions to fail.
        const account = await loaders.accountLoader.load(accountUser.accountId);
        const attrs = fetchAndMapDynamicAttributes(account, accountUser);

        const bodySlate = await loaders.bodySlateOfStepLoader.load({
          stepId: step.id,
        });
        return replaceBodySlateDynamicAttributes(bodySlate, attrs);
      },
    },
    isComplete: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether the step has been marked as completed',
    },
    completedAt: {
      type: GraphQLDateTime,
      description: 'When this step was completed',
    },
    completedByUser: {
      type: AccountUserType,
      description: 'The user who completed this step',
      resolve: (step, _a, { loaders }) =>
        step.completedByAccountUserId
          ? loaders.accountUserLoader.load(step.completedByAccountUserId)
          : null,
    },
    stepType: {
      type: new GraphQLNonNull(StepTypeEnumType),
      description: 'Optional, required, fyi, etc.',
      resolve: async (step, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            step.createdFromStepPrototypeId
          )
        ).stepType;
      },
    },
    mediaReferences: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(MediaReferenceType))
      ),
      description: 'The media references associated to this step.',
      resolve: async (step, _, { loaders }) =>
        step.createdFromStepPrototypeId
          ? loaders.mediaReferencesOfStepPrototypeLoader.load(
              step.createdFromStepPrototypeId
            )
          : [],
    },
    wasCompletedAutomatically: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether the step was completed automatically',
      resolve: (step) => step.completedByType === StepCompletedByType.Auto,
    },
    module: {
      type: new GraphQLNonNull(EntityIdType),
      description: 'The entityId of the module that contains this step',
      resolve: async (step, _args, { loaders }) => {
        const guideModule = await loaders.guideModuleOfStepLoader.load(step.id);
        return guideModule[0].entityId;
      },
    },
    guide: {
      type: new GraphQLNonNull(EntityIdType),
      description: 'The entityId of the guide that contains this step',
      resolve: async (step, _args, { loaders }) => {
        const guide = await loaders.guideOfStepLoader.load(step.id);
        return guide[0].entityId;
      },
    },
    orderIndex: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The order index of the step within the guide',
      resolve: async (step, _, { loaders }) => {
        const guideSteps = await loaders.stepsOfGuideLoader.load(step.guideId);
        return calculateStepOrderIndex(step, guideSteps);
      },
    },
    manualCompletionDisabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Wether an auto complete step can be manually completed.',
      resolve: async (step, _, { loaders }) => {
        return !!(
          await loaders.stepPrototypeLoader.load(
            step.createdFromStepPrototypeId
          )
        ).manualCompletionDisabled;
      },
    },
    previousStepEntityId: {
      type: EntityIdType,
      description: 'The step entityId that comes before',
      resolve: async (step, _, { loaders }) => {
        const guideSteps = await loaders.stepsOfGuideLoader.load(step.guideId);

        const refStepIndex = guideSteps.findIndex((s) => s.id === step.id);

        if (refStepIndex <= 0) {
          return null;
        }

        return guideSteps[refStepIndex - 1].entityId;
      },
    },
    nextStepEntityId: {
      type: EntityIdType,
      description: 'The step that comes after',
      resolve: async (step, _, { loaders }) => {
        const guideSteps = await loaders.stepsOfGuideLoader.load(step.guideId);

        const refStepIndex = guideSteps.findIndex((s) => s.id === step.id);

        if (refStepIndex === -1 || refStepIndex === guideSteps.length - 1) {
          return null;
        }

        return guideSteps[refStepIndex + 1].entityId;
      },
    },
    state: {
      type: new GraphQLNonNull(StepStateEnumType),
      description: 'The state of the step',
      resolve: resolveStepState,
    },
    hasViewedStep: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'If the user has viewed this step',
      resolve: async (step, _, { accountUser, loaders }) => {
        const stepParticipant =
          await loaders.stepParticipantForStepAndAccountUserLoader.load({
            accountUserId: accountUser.id,
            stepId: step.id,
          });

        return !!stepParticipant?.[0]?.firstViewedAt;
      },
    },
    dismissLabel: {
      type: GraphQLString,
      resolve: async (step, _, { loaders }) => {
        return !!(
          await loaders.stepPrototypeLoader.load(
            step.createdFromStepPrototypeId
          )
        ).dismissLabel;
      },
    },
    ctas: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(EmbedStepCtaType))
      ),
      description: 'The CTAs of a step',
      resolve: async (step, _args, context) => {
        const { loaders } = context;
        const ctas = await loaders.guideBaseStepCtasOfGuideStepBaseLoader.load(
          step.createdFromGuideStepBaseId
        );
        const guide = await loaders.guideLoader.load(step.guideId);
        const guideDoneAt = await doneAtResolver(guide, null, context);

        return guide.completedAt || guideDoneAt
          ? ctas.filter((cta) => cta.type !== StepCtaType.save)
          : ctas;
      },
    },
    branching: {
      type: new GraphQLNonNull(EmbedBranchingType),
      description: 'The branching information of this Step',
      resolve: async (step, _, { loaders }) => {
        return loaders.branchingOfStepLoader.load(step.id);
      },
    },
    inputs: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(EmbedInputStep))
      ),
      description: 'The inputs of a step',
      /** @todo lookup input data from prototype instead of base */
      resolve: async (step, _args, { loaders }, _info) => {
        if (step.createdFromGuideStepBaseId) {
          const inputs = await loaders.inputBasesOfGuideStepBaseLoader.load(
            step.createdFromGuideStepBaseId
          );

          if (inputs.length === 0) {
            return [];
          }

          const answers =
            await loaders.inputStepAnswerOfStepForEmbeddableLoader.loadMany(
              inputs.map((input) => ({
                inputStepBaseId: input.id,
                stepId: step.id,
              }))
            );

          return answers.map((answer, i) =>
            answer
              ? {
                  ...inputs[i].toJSON(),
                  answer: (answer as InputStepAnswer).answer,
                }
              : inputs[i]
          );
        }

        return [];
      },
    },
  },
});

export default StepType;
