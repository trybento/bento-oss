import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

import { entityIdField } from 'bento-common/graphql/EntityId';
import { isInputStep } from 'bento-common/data/helpers';

import StepType from 'src/graphql/Step/Step.graphql';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';

import ModuleType from 'src/graphql/Module/Module.graphql';
import GuideStepBaseType from 'src/graphql/GuideStepBase/GuideStepBase.graphql';
import AccountUserType from 'src/graphql/AccountUser/AccountUser.graphql';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import { GraphQLContext } from 'src/graphql/types';
import { isBranchingStep } from 'src/utils/stepHelpers';

const GuideModuleBaseType = new GraphQLObjectType<
  GuideModuleBase,
  GraphQLContext
>({
  name: 'GuideModuleBase',
  description: 'A module that exists within a guide base',
  fields: () => ({
    ...globalEntityId('GuideModuleBase'),
    ...entityIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the guide module base',
      resolve: async (guideModuleBase, _, { loaders }) => {
        return loaders.nameOfGuideModuleBaseLoader.load(guideModuleBase.id);
      },
    },
    hasBranchingStep: {
      type: GraphQLBoolean,
      resolve: async (guideModuleBase, _, { loaders }) => {
        const availableStepTypes =
          await loaders.stepTypesInGuideModuleBaseLoader.load(
            guideModuleBase.id
          );
        return availableStepTypes.some((st) => isBranchingStep(st));
      },
    },
    hasInputStep: {
      type: GraphQLBoolean,
      resolve: async (guideModuleBase, _, { loaders }) => {
        const availableStepTypes =
          await loaders.stepTypesInGuideModuleBaseLoader.load(
            guideModuleBase.id
          );
        return availableStepTypes.some((st) => isInputStep(st));
      },
    },
    orderIndex: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The index of the guide module within the guide',
    },
    guideStepBases: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GuideStepBaseType))
      ),
      description: 'The step bases belong to this guide module base',
      resolve: (guideModuleBase, _, { loaders }) =>
        loaders.guideStepBasesOfGuideModuleBaseLoader.load(guideModuleBase.id),
    },
    participants: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      description:
        'The account users who have been assigned to a guide module in the guide module base',
      resolve: (guideModuleBase, _, { loaders }) => {
        return loaders.participantsOfGuideModuleBaseLoader.load(
          guideModuleBase.id
        );
      },
    },
    participantsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The count of account users who have been assigned to a guide module in the guide module base',
      resolve: (guideModuleBase, _, { loaders }) => {
        return loaders.countParticipantsOfGuideModuleBaseLoader.load(
          guideModuleBase.id
        );
      },
    },
    participantsWhoViewed: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      description:
        'The account users active in this guide module who have ALSO viewed the guide module',
      resolve: (guideModuleBase, _, { loaders }) => {
        return loaders.participantsWhoViewedGuideModuleBaseLoader.load(
          guideModuleBase.id
        );
      },
    },
    participantsWhoViewedCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The count of participants in all instances of the guide module base who have viewed the guide module',
      resolve: async (guideModuleBase, _, { loaders }) =>
        loaders.countParticipantsWhoViewedGuideModuleBaseLoader.load(
          guideModuleBase.id
        ),
    },
    addedDynamicallyAt: {
      type: GraphQLDateTime,
      description: 'When was the guide module base dynamically added',
    },
    shouldOnlyAddToNewGuidesDynamically: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether the guide module base should be added to a guide dynamically or not',
    },
    dynamicallyAddedByStep: {
      type: StepType,
      description: 'The step that dynamically added this guide module base',
      resolve: async (guideModuleBase, _, { loaders }) =>
        loaders.stepByWhichGuideModuleBaseDynamicallyAddedLoader.load(
          guideModuleBase.id
        ),
    },
    createdFromModule: {
      type: ModuleType,
      description: 'The module from which this guide module was created',
      resolve: (guideModuleBase, _, { loaders }) =>
        guideModuleBase.createdFromModuleId &&
        loaders.moduleLoader.load(guideModuleBase.createdFromModuleId),
    },
  }),
});

export default GuideModuleBaseType;
