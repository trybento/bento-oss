import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import EntityIdType, { entityIdField } from 'bento-common/graphql/EntityId';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import { GuideCompletionState } from 'bento-common/types';
import { guideNameOrFallback } from 'bento-common/utils/naming';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import AccountType from 'src/graphql/Account/Account.graphql';
import AccountUserType from 'src/graphql/AccountUser/AccountUser.graphql';
import GuideModuleType from 'src/graphql/GuideModule/GuideModule.graphql';
import StepType from 'src/graphql/Step/Step.graphql';
import TemplateType, {
  GuideTypeEnumType,
  GuideAllowedEmbedTypeEnumType,
  GuideFormFactorEnumType,
  GuidePageTargetingEnumType,
  GuideDesignTypeEnumType,
} from 'src/graphql/Template/Template.graphql';
import {
  completedStepsCountResolver,
  FormFactorStyleResolverField,
} from './Guide.helpers';
import { GraphQLContext } from 'src/graphql/types';
import { Guide } from 'src/data/models/Guide.model';
import { ThemeType } from '../Organization/Organization.graphql';
import GuideBaseType from '../GuideBase/GuideBase.graphql';

export const GuideStateEnumType = new GraphQLEnumType({
  name: 'GuideState',
  description: 'The current activeness state of the guide',
  values: {
    draft: { value: 'draft' },
    active: { value: 'active' },
    inactive: { value: 'inactive' },
    expired: { value: 'expired' },
  },
});

export const GuideCompletionStateEnumType = enumToGraphqlEnum({
  name: 'GuideCompletionState',
  description: 'The completion state of the guide',
  enumType: GuideCompletionState,
});

export const GuideLastActiveWithinFilterEnum = new GraphQLEnumType({
  name: 'GuideLastActiveWithinFilterEnum',
  values: {
    all: { value: 'all' },
    lastDay: { value: 'lastDay' },
    lastWeek: { value: 'lastWeek' },
    lastMonth: { value: 'lastMonth' },
  },
});

const GuideType = new GraphQLObjectType<Guide, GraphQLContext>({
  name: 'Guide',
  description: 'A guide used in an customer account journey',
  fields: () => ({
    ...globalEntityId('Guide'),
    ...entityIdField(),
    updatedAt: {
      type: GraphQLDateTime,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the guide',
      /**
       * Similarly to EmbedGuide, this shouldn't ever return the internal name of a guide.
       */
      resolve: async (guide, _, { loaders }) => {
        const ref = await loaders.templateLoader.load(
          guide.createdFromTemplateId || 0
        );
        return guideNameOrFallback(ref?.name);
      },
    },
    type: {
      type: new GraphQLNonNull(GuideTypeEnumType),
      resolve: async (guide, _, { loaders }) => {
        const template = await loaders.templateLoader.load(
          guide.createdFromTemplateId || 0
        );

        return template?.type;
      },
    },
    description: {
      type: GraphQLString,
      description: 'A description of the guide',
      resolve: async (guide, _, { loaders }) => {
        const ref = await loaders.templateLoader.load(
          guide.createdFromTemplateId || 0
        );
        return ref?.description;
      },
    },
    completedStepsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The number of completed steps in the guide',
      resolve: completedStepsCountResolver,
    },
    stepsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The number of completed steps in the guide',
      resolve: async (guide, _, { loaders }) => {
        const allSteps = await loaders.stepsOfGuideLoader.load(guide.id);
        return allSteps.length;
      },
    },
    guideModules: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GuideModuleType))
      ),
      description: 'The guide modules that belongs to the guide',
      resolve: (guide) =>
        guide.$get('guideModules', { order: [['orderIndex', 'asc']] }),
    },
    firstIncompleteStep: {
      type: EntityIdType,
      description: 'The first incomplete step for this guide',
      resolve: async (guide, _, { loaders }) => {
        const step = await loaders.firstIncompleteStepOfGuideLoader.load(
          guide.id
        );
        return step?.entityId;
      },
    },
    createdFromTemplate: {
      type: TemplateType,
      description:
        'The entity ID of the template from which this guide was created',
      resolve: (guide, _, { loaders }) =>
        guide.createdFromTemplateId &&
        loaders.templateLoader.load(guide.createdFromTemplateId),
    },
    createdFromGuideBase: {
      type: GuideBaseType,
      resolve: (guide, _, { loaders }) =>
        loaders.guideBaseLoader.load(guide.createdFromGuideBaseId),
    },
    state: {
      type: new GraphQLNonNull(GuideStateEnumType),
      description: 'The current activeness state of the guide',
    },
    completionState: {
      type: GuideCompletionStateEnumType,
      description: 'The completion state of the guide',
    },
    lastCompletedStep: {
      type: StepType,
      resolve: (guide, _, { loaders }) =>
        loaders.lastCompletedStepOfGuideLoader.load(guide.id),
    },
    completionPercentage: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The percentage of steps completed in this guide',
      resolve: async (guide, _, { loaders }) => {
        const steps = await loaders.stepsOfGuideLoader.load(guide.id);
        const stepsCount = steps.length;
        if (stepsCount === 0) return 0;
        const completedSteps = steps.filter((step) => step.isComplete);
        const completedStepsCount = completedSteps.length;

        return Math.ceil((+completedStepsCount / stepsCount) * 100);
      },
    },
    account: {
      type: new GraphQLNonNull(AccountType),
      description: 'The account to which the guide belongs',
      resolve: (guide, _, { loaders }) =>
        loaders.accountLoader.load(guide.accountId),
    },
    participants: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      description: 'The account users that are participating in this guide',
      resolve: (guide, _, { loaders }) =>
        loaders.participantsOfGuideLoader.load(guide.id),
    },
    lastActiveAt: {
      type: GraphQLDateTime,
      description: 'The timestamp of the last activity made on the guide',
    },
    completedAt: {
      type: GraphQLDateTime,
      description: 'The timestamp of when the guide was completed',
    },
    allowedEmbedType: {
      deprecationReason: 'use formFactor',
      type: GuideAllowedEmbedTypeEnumType,
    },
    isSideQuest: {
      type: GraphQLBoolean,
      description: 'Whether this guide is a side quest or a main quest.',
      resolve: async (guide, _, { loaders }) => {
        const ref = await loaders.templateLoader.load(
          guide.createdFromTemplateId || 0
        );
        return ref?.isSideQuest;
      },
    },
    isCyoa: {
      type: GraphQLBoolean,
      description:
        'Whether this guide is CYOA (single step guide that branches to another guide)',
      resolve: async (guide, _, { loaders }) => {
        const ref = await loaders.templateLoader.load(
          guide.createdFromTemplateId || 0
        );
        return !!ref?.isCyoa;
      },
    },
    pageTargetingType: {
      type: new GraphQLNonNull(GuidePageTargetingEnumType),
      description: 'The type of page targeting mechanism',
      resolve: async (guide, _, { loaders }) => {
        const ref = await loaders.templateLoader.load(
          guide.createdFromTemplateId || 0
        );
        return ref?.pageTargetingType;
      },
    },
    pageTargetingUrl: {
      type: GraphQLString,
      description: 'The URL for side quests page targeting, if enabled',
      resolve: async (guide, _, { loaders }) => {
        const ref = await loaders.templateLoader.load(
          guide.createdFromTemplateId || 0
        );
        return ref?.pageTargetingUrl;
      },
    },
    formFactor: {
      type: GuideFormFactorEnumType,
      description: 'The form factor this guide is meant to display as.',
      resolve: async (guide, _, { loaders }) => {
        const ref = await loaders.templateLoader.load(
          guide.createdFromTemplateId || 0
        );
        return ref?.formFactor;
      },
    },
    formFactorStyle: FormFactorStyleResolverField,
    designType: {
      type: new GraphQLNonNull(GuideDesignTypeEnumType),
      description: 'The design type of the guide',
      resolve: async (guide, _, { loaders }) => {
        const ref = await loaders.templateLoader.load(
          guide.createdFromTemplateId || 0
        );
        return ref?.designType;
      },
    },
    theme: {
      type: new GraphQLNonNull(ThemeType),
      description: 'The theme for this guide',
      resolve: async (guide, _, { loaders }) => {
        const ref = await loaders.templateLoader.load(
          guide.createdFromTemplateId || 0
        );
        return ref?.theme;
      },
    },
  }),
});

export default GuideType;
