import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';

import ModuleType from 'src/graphql/Module/Module.graphql';
import StepType from 'src/graphql/Step/Step.graphql';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { GraphQLContext } from 'src/graphql/types';

const GuideModuleType = new GraphQLObjectType<GuideModule, GraphQLContext>({
  name: 'GuideModule',
  description: 'A module that exists within a guide',
  fields: () => ({
    ...globalEntityId('GuideModule'),
    ...entityIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the guide module',
      deprecationReason: 'Use `name` from `GuideModuleBase` instead',
      resolve: async (guideModule, _, { loaders }) => {
        return loaders.nameOfGuideModuleLoader.load(guideModule.id);
      },
    },
    orderIndex: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The index of the guide module within the guide',
    },
    steps: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StepType))),
      description: 'The steps belong to this guide module',
      resolve: (guideModule, _, { loaders }) =>
        loaders.stepsOfGuideModuleLoader.load(guideModule.id),
    },
    createdFromModule: {
      type: ModuleType,
      description: 'The module from which this guide module was created',
      resolve: (guideModule, _, { loaders }) =>
        guideModule.createdFromModuleId &&
        loaders.moduleLoader.load(guideModule.createdFromModuleId),
    },
  }),
});

export default GuideModuleType;
