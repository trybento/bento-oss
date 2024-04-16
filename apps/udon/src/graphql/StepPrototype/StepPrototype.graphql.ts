import {
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';
import { StepType } from 'bento-common/types';
import EntityId, { entityIdField } from 'bento-common/graphql/EntityId';
import { AutoCompleteInteractionUnionType } from 'bento-common/graphql/autoCompleteInteractions';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { slateToMarkdown, markdownToSlate } from 'src/utils/slate';
import StepEventMappingType from '../StepEventMapping/StepEventMapping.graphql';
import TemplateType from '../Template/Template.graphql';
import ModuleType from '../Module/Module.graphql';
import {
  BranchingEntityEnumType,
  BranchingFormFactorEnumType,
  StepTypeEnumType,
} from '../graphQl.types';
import StepPrototypeTaggedElementType from '../StepPrototypeTaggedElement/StepPrototypeTaggedElement.graphql';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { GraphQLContext } from 'src/graphql/types';
import BranchingPathType from '../BranchingPath/BranchingPath.graphql';
import { BranchingPath } from 'src/data/models/BranchingPath.model';
import { Template } from 'src/data/models/Template.model';
import StepPrototypeCtaType from '../StepPrototypeCta/StepPrototypeCta.graphql';
import StepPrototypeAutoCompleteInteractionType from '../StepPrototypeAutoCompleteInteraction/StepPrototypeAutoCompleteInteraction.graphql';
import InputStepPrototypeType from 'src/graphql/InputStep/InputStepPrototype.graphql';
import { BranchingStyleResolverField } from '../Branching/branchingStyle';
import { logger } from 'src/utils/logger';
import withPerfTimer from 'src/utils/perfTimer';
import {
  getStepBranchingPerformance,
  StepBranchingPerformanceType,
} from './stepPrototypeGql.helpers';
import MediaReferenceType from '../Media/MediaReference.graphql';
import { isBranchingStep } from 'src/utils/stepHelpers';

export const BranchingChoiceType = new GraphQLObjectType<
  StepPrototype,
  GraphQLContext
>({
  name: 'BranchingChoice',
  fields: () => ({
    choiceKey: {
      type: GraphQLString,
    },
    label: {
      type: GraphQLString,
    },
    selected: {
      type: GraphQLBoolean,
    },
    style: BranchingStyleResolverField,
  }),
});

const StepCompletionStatsType = new GraphQLObjectType<
  StepPrototype,
  GraphQLContext
>({
  name: 'StepCompletionStatsType',
  description:
    'Number of steps associated with this sp, and how many are completed',
  fields: () => ({
    stepsCompleted: {
      type: GraphQLInt,
    },
    viewedSteps: {
      type: GraphQLInt,
    },
    totalSteps: {
      type: GraphQLInt,
    },
  }),
});

const StepPrototypeType = new GraphQLObjectType<StepPrototype, GraphQLContext>({
  name: 'StepPrototype',
  description: 'A prototype of a step that can be added to an account guide',
  fields: () => ({
    ...globalEntityId('StepPrototype'),
    ...entityIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the step prototype',
    },
    body: {
      type: GraphQLString,
      description: 'The descriptive text of the step prototype',
      resolve: (stepPrototype) => {
        if (stepPrototype.bodySlate) {
          return slateToMarkdown(stepPrototype.bodySlate);
        }

        return stepPrototype.body;
      },
    },
    stepType: {
      type: new GraphQLNonNull(StepTypeEnumType),
      description: 'Whether or not step is required, optional, fyi, etc...',
    },
    bodySlate: {
      type: GraphQLJSON,
      description: 'The Slate.JS RTE representation of the Step prototype body',
      resolve: (stepPrototype) => {
        if (stepPrototype.bodySlate) {
          return stepPrototype.bodySlate;
        } else if (stepPrototype.body) {
          return markdownToSlate(stepPrototype.body);
        }
      },
    },
    inputType: { type: GraphQLString },
    isAutoCompletable: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Can the step be completed via auto completion',
      resolve: async (stepPrototype, _, { loaders }) => {
        if (stepPrototype.stepType === StepType.fyi) return false;

        const stepEventMappings =
          await loaders.stepEventMappingsOfStepPrototypeLoader.load(
            stepPrototype.id
          );
        return stepEventMappings.length > 0;
      },
    },
    eventMappings: {
      deprecationReason:
        'should be migrated over to `autoCompleteInteractions`',
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(StepEventMappingType))
      ),
      description: 'Events or attributes that can auto-complete the step',
      resolve: async (stepPrototype, _, { loaders }) => {
        return await loaders.stepEventMappingsOfStepPrototypeLoader.load(
          stepPrototype.id
        );
      },
    },
    module: {
      type: ModuleType,
      description: 'The module in which this stepPrototype exists',
      resolve: (stepPrototype, _, { loaders }) =>
        loaders.moduleOfStepPrototypeLoader.load(stepPrototype.id),
    },
    templates: {
      type: new GraphQLNonNull(new GraphQLList(TemplateType)),
      description: 'Templates this step prototype is part of',
      resolve: (stepPrototype, _, { loaders }) =>
        loaders.templatesUsingStepPrototypeLoader.load(stepPrototype.id),
    },
    taggedElements: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(StepPrototypeTaggedElementType))
      ),
      args: {
        templateEntityId: {
          type: EntityId,
          description:
            'Filter to include only tagged elements belonging to a specified template',
        },
      },
      description:
        'Page elements selected to which to attach a context tag when this step is available',
      resolve: (stepPrototype, { templateEntityId }, { loaders }) =>
        loaders.stepPrototypeTaggedElementsOfStepPrototypeAndTemplateLoader.load(
          {
            stepPrototypeId: stepPrototype.id,
            templateEntityId,
          }
        ),
    },
    dismissLabel: {
      type: GraphQLString,
    },
    ctas: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(StepPrototypeCtaType))
      ),
      description: 'The CTAs of a step',
      resolve: async (step, _args, { loaders }) =>
        await loaders.stepPrototypeCtasOfStepPrototypeLoader.load(step.id),
    },
    branchingQuestion: {
      type: GraphQLString,
    },
    branchingMultiple: {
      type: GraphQLBoolean,
    },
    branchingDismissDisabled: {
      type: GraphQLBoolean,
    },
    branchingKey: {
      type: GraphQLString,
    },
    mediaReferences: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(MediaReferenceType))
      ),
      description: 'The media references associated to this step.',
      resolve: async (step, _, { loaders }) =>
        loaders.mediaReferencesOfStepPrototypeLoader.load(step.id),
    },
    branchingChoices: {
      type: new GraphQLList(new GraphQLNonNull(BranchingChoiceType)),
      resolve: async (step, _args, _ctx) => {
        return (
          step.branchingChoices?.map((choice) => ({
            ...choice,
            /**
             * This is needed by the `BranchingStyleResolverField` to resolve
             * each possible branching style type.
             */
            formFactor: step.branchingFormFactor,
          })) || []
        );
      },
    },
    branchingFormFactor: {
      type: BranchingFormFactorEnumType,
    },
    branchingEntityType: {
      type: BranchingEntityEnumType,
      resolve: async (stepPrototype) => {
        if (isBranchingStep(stepPrototype.stepType)) {
          return (
            await BranchingPath.findOne({
              where: { branchingKey: stepPrototype.entityId },
            })
          )?.entityType;
        }
        return null;
      },
    },
    branchingPaths: {
      type: new GraphQLList(new GraphQLNonNull(BranchingPathType)),
      resolve: async (stepPrototype, _a, { loaders }) => {
        const branchingPaths = await BranchingPath.findAll({
          where: {
            branchingKey: stepPrototype.entityId,
          },
          order: [['orderIndex', 'ASC']],
        });
        for (const path of branchingPaths) {
          loaders.branchingPathEntityLoader.prime(path.entityId, path);
          loaders.branchingPathLoader.prime(path.id, path);
        }
        return branchingPaths;
      },
    },
    branchingPerformance: {
      type: new GraphQLList(new GraphQLNonNull(StepBranchingPerformanceType)),
      args: {
        templateEntityId: {
          type: EntityId,
          description: 'Filter to include only stats from specified template',
        },
      },
      resolve: (stepPrototype, { templateEntityId }) =>
        getStepBranchingPerformance(stepPrototype, templateEntityId),
    },
    autoCompleteInteraction: {
      deprecationReason:
        'should be migrated over to `autoCompleteInteractions`',
      type: StepPrototypeAutoCompleteInteractionType,
      description: 'The auto complete interaction of a step',
      resolve: async (stepPrototype, _args, { loaders }) => {
        const interactions =
          await loaders.stepPrototypeAutoCompleteInteractionsOfStepPrototypeLoader.load(
            stepPrototype.id
          );
        return interactions[0] || null;
      },
    },
    /** @todo transform into a loader */
    autoCompleteInteractions: {
      type: new GraphQLList(AutoCompleteInteractionUnionType),
      description: 'Auto-complete interactions of a Step',
      resolve: async (stepPrototype, _args, _ctx) => {
        const interactions = await stepPrototype.$get(
          'newAutoCompleteInteractions',
          {
            scope: 'guideCompletions',
            attributes: ['id', 'interactionType'],
          }
        );

        return interactions.map(({ interactionType, ...interaction }) => ({
          interactionType,
          templateEntityId: interaction.ofGuideCompletions?.template?.entityId,
        }));
      },
    },
    stepCompletionStats: {
      type: new GraphQLNonNull(StepCompletionStatsType),
      args: {
        templateEntityId: {
          type: EntityId,
          description: 'Filter to include only stats from specified template',
        },
      },
      description: 'Counts of steps and steps completed',
      resolve: (
        stepPrototype,
        { templateEntityId },
        { loaders, organization }
      ) =>
        withPerfTimer(
          'stepCompletionStats',
          async () => {
            const templateId = templateEntityId
              ? (
                  await Template.findOne({
                    where: { entityId: templateEntityId },
                  })
                )?.id
              : undefined;
            const res = await loaders.stepCompletionOfStepPrototypesLoader.load(
              {
                stepPrototypeId: stepPrototype.id,
                templateId,
              }
            );

            return {
              stepsCompleted: res.stepsCompleted,
              viewedSteps: res.viewedSteps,
              totalSteps: res.stepsInViewedGuides,
            };
          },
          (time) => {
            if (time > 5 * 1000)
              logger.warn(
                `[stepCompletionStats] long stat query for ${organization.name} spId ${stepPrototype.id}: ${time}ms`
              );
          }
        ),
    },
    inputs: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(InputStepPrototypeType))
      ),
      description: 'The input prototypes of a step',
      resolve: async (step, _args, { loaders }) => {
        return loaders.inputPrototypesOfStepPrototypeLoader.load(step.id);
      },
    },
    manualCompletionDisabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Wether an auto complete step can be manually completed.',
      resolve: (step) => !!step.manualCompletionDisabled,
    },
    snappyAt: {
      type: GraphQLDateTime,
    },
  }),
});

export default StepPrototypeType;
