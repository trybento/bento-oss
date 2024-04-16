import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import EntityId, { entityIdField } from 'bento-common/graphql/EntityId';

import EmbedStepType from 'src/graphql/embed/EmbedStep/EmbedStep.graphql';
import { EmbedContext } from 'src/graphql/types';
import { GuideModule } from 'src/data/models/GuideModule.model';

const EmbedGuideModule = new GraphQLObjectType<GuideModule, EmbedContext>({
  name: 'EmbedGuideModule',
  description: 'A module that exists within a guide',
  fields: () => ({
    ...globalEntityId('EmbedGuideModule'),
    ...entityIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the guide module',
      resolve: async (module, _, { loaders }) => {
        return loaders.nameOfGuideModuleLoader.load(module.id);
      },
    },
    orderIndex: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The index of the guide module within the guide',
    },
    steps: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(EmbedStepType))
      ),
      description: 'The steps belong to this guide module',
      resolve: (guideModule, _, { loaders }) =>
        loaders.stepsOfGuideModuleLoader.load(guideModule.id),
    },
    totalStepsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The number of steps in the guide module',
      resolve: async (guideModule, _, { loaders }) => {
        const allSteps = await loaders.stepsOfGuideModuleLoader.load(
          guideModule.id
        );
        return allSteps.length;
      },
    },
    completedStepsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The number of completed steps in the guide module',
      resolve: async (guideModule, _, { loaders }) => {
        const allSteps = await loaders.stepsOfGuideModuleLoader.load(
          guideModule.id
        );
        const completedStepsCount = allSteps.filter(
          (step) => step.isComplete
        ).length;
        return completedStepsCount;
      },
    },
    isComplete: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Are all steps in this module completed',
      resolve: async (guideModule, _, { loaders }) => {
        const steps = await loaders.stepsOfGuideModuleLoader.load(
          guideModule.id
        );
        return steps.every((s) => s.isComplete);
      },
    },
    guide: {
      type: EntityId,
      description: 'The entityId of the guide this guide module belongs to',
      resolve: async (guideModule, _, { loaders }) => {
        const guide = await loaders.guideLoader.load(guideModule.guideId);
        return guide.entityId;
      },
    },
    nextModule: {
      type: EntityId,
      description: 'The next module entityId in the guide, if it exists',
      resolve: async (guideModule, _, { loaders }) => {
        const guideModules = await loaders.modulesOfGuideLoader.load(
          guideModule.guideId
        );
        const refIndex = guideModules.findIndex(
          (gm) => gm.id === guideModule.id
        );

        if (refIndex === -1 || refIndex === guideModules.length - 1) {
          return null;
        }

        return guideModules[refIndex + 1].entityId;
      },
    },
    previousModule: {
      type: EntityId,
      description: 'The previous module entityId in the guide, if it exists',
      resolve: async (guideModule, _, { loaders }) => {
        const guideModules = await loaders.modulesOfGuideLoader.load(
          guideModule.guideId
        );
        const refIndex = guideModules.findIndex(
          (gm) => gm.id === guideModule.id
        );

        if (refIndex <= 0) {
          return null;
        }

        return guideModules[refIndex - 1].entityId;
      },
    },
    firstIncompleteStep: {
      type: EntityId,
      description: 'The first incomplete step in the module',
      resolve: async (guideModule, _, { loaders }) => {
        const steps = await loaders.stepsOfGuideModuleLoader.load(
          guideModule.id
        );
        return steps.find((s) => !s.isComplete)?.entityId;
      },
    },
  }),
});

export default EmbedGuideModule;
