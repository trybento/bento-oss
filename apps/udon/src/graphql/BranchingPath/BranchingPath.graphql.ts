import {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import EntityIdType, { entityIdField } from 'bento-common/graphql/EntityId';

import TemplateType from 'src/graphql/Template/Template.graphql';
import ModuleType from 'src/graphql/Module/Module.graphql';

import { BranchingPath } from 'src/data/models/BranchingPath.model';
import { GraphQLContext } from 'src/graphql/types';

const BranchingPathActionType = new GraphQLEnumType({
  name: 'BranchingPathActionType',
  values: {
    create: { value: 'create' },
  },
});

export const BranchingPathEntityType = new GraphQLEnumType({
  name: 'BranchingPathEntityType',
  values: {
    guide: {
      value: 'guide',
    },
    module: {
      value: 'module',
    },
    template: {
      value: 'template',
      deprecationReason: 'Use "guide"',
    },
  },
});

const BranchingPathType = new GraphQLObjectType<BranchingPath, GraphQLContext>({
  name: 'BranchingPath',
  fields: () => ({
    ...globalEntityId('BranchingPath'),
    ...entityIdField(),
    choiceKey: {
      type: GraphQLString,
    },
    branchingKey: {
      type: GraphQLString,
    },
    orderIndex: {
      type: GraphQLInt,
    },
    actionType: {
      type: new GraphQLNonNull(BranchingPathActionType),
      description: 'The type of action that is performed',
    },
    entityType: {
      type: new GraphQLNonNull(BranchingPathEntityType),
      description: 'The type of entity that is created by the action',
    },
    templateEntityId: {
      type: EntityIdType,
      description: 'The entity id for the template associated with this branch',
      resolve: async (branchingPath, _, { loaders }) =>
        branchingPath.templateId
          ? (await loaders.templateLoader.load(branchingPath.templateId))
              .entityId
          : null,
    },
    template: {
      type: TemplateType,
      description:
        'If the entityType is "template" or "guide", the template from which a guide is generated',
      resolve: (branchingPath, _, { loaders }) =>
        branchingPath.templateId
          ? loaders.templateLoader.load(branchingPath.templateId)
          : null,
    },
    moduleEntityId: {
      type: EntityIdType,
      description: 'The entity id for the template associated with this branch',
      resolve: async (branchingPath, _, { loaders }) =>
        branchingPath.moduleId
          ? (await loaders.moduleLoader.load(branchingPath.moduleId)).entityId
          : null,
    },
    module: {
      type: ModuleType,
      description:
        'If the entityType is "module", the module that gets added onto the users guide',
      resolve: (branchingPath, _, { loaders }) =>
        branchingPath.moduleId
          ? loaders.moduleLoader.load(branchingPath.moduleId)
          : null,
    },
    triggeredCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (branchingPath, _, { loaders }) =>
        loaders.triggeredCountOfBranchingPathLoader.load(branchingPath.id),
    },
  }),
});

export default BranchingPathType;
