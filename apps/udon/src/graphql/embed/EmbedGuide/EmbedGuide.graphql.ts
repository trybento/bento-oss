import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

import { StepState } from 'bento-common/types/globalShoyuState';
import EntityIdType, { entityIdField } from 'bento-common/graphql/EntityId';
import { guideNameOrFallback } from 'bento-common/utils/naming';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import EmbedAccountType from 'src/graphql/embed/EmbedAccount/EmbedAccount.graphql';
import EmbedGuideModuleType from 'src/graphql/embed/EmbedGuideModule/EmbedGuideModule.graphql';
import {
  GuideFormFactorEnumType,
  GuideTypeEnumType,
  GuidePageTargetingEnumType,
  GuideDesignTypeEnumType,
} from 'src/graphql/Template/Template.graphql';
import {
  completedStepsCountResolver,
  doneAtResolver,
  FormFactorStyleResolverField,
  guideStepsByState,
  guideViewedSteps,
  savedAtResolver,
} from 'src/graphql/Guide/Guide.helpers';
import {
  GuideCompletionStateEnumType,
  GuideStateEnumType,
} from 'src/graphql/Guide/Guide.graphql';
import EmbedGuideBaseType from 'src/graphql/embed/EmbedGuideBase/EmbedGuideBase.graphql';
import {
  canResetOnboardingResolver,
  dynamicAttributesResolver,
} from '../resolvers';
import { ThemeType } from 'src/graphql/Organization/Organization.graphql';
import EmbedStepType, {
  EmbedGuideBranchedFromChoiceType,
} from 'src/graphql/embed/EmbedStep/EmbedStep.graphql';
import { getNextGuide, getPreviousGuide } from './helpers';
import EmbedInlineEmbedType from '../EmbedInlineEmbeds/EmbedInlineEmbed.graphql';
import EmbedTaggedElementType from '../EmbedTaggedElement/EmbedTaggedElement.graphql';

export const PageTargetingType = new GraphQLObjectType({
  name: 'PageTargeting',
  fields: () => ({
    type: {
      type: new GraphQLNonNull(GuidePageTargetingEnumType),
      description: 'The type of page targeting mechanism',
    },
    url: {
      type: GraphQLString,
      description: 'The URL for side quests page targeting, if enabled',
    },
  }),
});

const EmbedGuideType = new GraphQLObjectType({
  name: 'EmbedGuide',
  description: 'A guide displayed to an end user',
  fields: {
    ...globalEntityId('EmbedGuide'),
    ...entityIdField(),
    type: {
      type: new GraphQLNonNull(GuideTypeEnumType),
      resolve: async (guide, _, { loaders }) => {
        return (
          await loaders.templateLoader.load(guide.createdFromTemplateId || 0)
        )?.type;
      },
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the guide',
      /**
       * Shouldn't ever return the internal name of a guide.
       */
      resolve: async (guide, _, { loaders }) => {
        const template = await loaders.templateLoader.load(
          guide.createdFromTemplateId || 0
        );

        return guideNameOrFallback(template.name);
      },
    },
    theme: {
      type: new GraphQLNonNull(ThemeType),
      description: 'The theme for this guide',
      resolve: async (guide, _, { loaders }) => {
        return (
          await loaders.templateLoader.load(guide.createdFromTemplateId || 0)
        )?.theme;
      },
    },
    description: {
      type: GraphQLString,
      description: 'A description of the guide',
      resolve: async (guide, _, { loaders }) => {
        return (
          await loaders.templateLoader.load(guide.createdFromTemplateId || 0)
        )?.description;
      },
    },
    guideBase: {
      type: new GraphQLNonNull(EmbedGuideBaseType),
      resolve: (guide, _, { loaders }) =>
        loaders.guideBaseLoader.load(guide.createdFromGuideBaseId || 0),
    },
    completionState: {
      type: GuideCompletionStateEnumType,
      description: 'The completion state of the guide',
    },
    completedAt: {
      type: GraphQLDateTime,
      description: 'Time the guide was marked as completed',
      resolve: (guide) => guide.completedAt,
    },
    doneAt: {
      type: GraphQLDateTime,
      description: 'Time the guide was marked done',
      resolve: doneAtResolver,
    },
    savedAt: {
      type: GraphQLDateTime,
      description: 'Time the user saved the guide',
      resolve: savedAtResolver,
    },
    isViewed: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether the user is seeing the guide for the first time',
      resolve: async (guide, _, { accountUser, loaders }) => {
        const guideParticipant =
          await loaders.guideParticipantForGuideAndAccountUserLoader.load({
            guideId: guide.id,
            accountUserId: accountUser.id,
          });
        return !!guideParticipant?.firstViewedAt;
      },
    },
    isDestination: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether the user was added due to this guide being launched from another',
      resolve: async (guide, _, { accountUser, loaders }) => {
        const guideParticipant =
          await loaders.guideParticipantForGuideAndAccountUserLoader.load({
            guideId: guide.id,
            accountUserId: accountUser.id,
          });
        return !!guideParticipant?.isDestination;
      },
    },
    nextGuide: {
      type: EntityIdType,
      description:
        'Entity id of the guide after this one (only for main quest guides)',
      resolve: async (guide, _, { accountUser, loaders }) => {
        const template = await loaders.templateLoader.load(
          guide.createdFromTemplateId || 0
        );
        if (template?.isSideQuest) return null;

        const guides = await loaders.availableGuidesForAccountUserLoader.load(
          accountUser.id
        );

        const mainQuestGuides = guides.filter((g) => {
          return (
            !g.createdFromTemplate!.isSideQuest &&
            (template?.isCyoa
              ? // Exclude completed guides for CYOA guides.
                g.id === guide.id ||
                (!g.completedAt && !g.guideParticipants.some((gp) => gp.doneAt))
              : true)
          );
        });

        const nextGuide = getNextGuide(mainQuestGuides, guide);
        return nextGuide?.entityId;
      },
    },
    previousGuide: {
      type: EntityIdType,
      description:
        'Entity id of the guide after this one (only for main quest guides)',
      resolve: async (guide, _, { loaders, accountUser }) => {
        const template = await loaders.templateLoader.load(
          guide.createdFromTemplateId || 0
        );
        if (template?.isSideQuest) return null;

        const guides = await loaders.availableGuidesForAccountUserLoader.load(
          accountUser.id
        );
        const mainQuestGuides = guides.filter(
          (g) => !g.createdFromTemplate!.isSideQuest
        );
        const prevGuide = getPreviousGuide(mainQuestGuides, guide);
        return prevGuide?.entityId;
      },
    },
    orderIndex: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "The order this guide is in the user's quests",
      resolve: (guide, _, { loaders, accountUser }) => {
        return loaders.orderIndexOfGuideLoader.load({
          accountUserId: accountUser.id,
          guideId: guide.id,
        });
      },
    },
    modules: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(EmbedGuideModuleType))
      ),
      description: 'The guide modules that belongs to the guide',
      resolve: (guide, _a, { loaders }) =>
        loaders.modulesOfGuideLoader.load(guide.id),
    },
    steps: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(EmbedStepType))
      ),
      description: 'The steps which belong to this guide',
      resolve: (guide, _, { loaders }) =>
        // return full steps here in preparation for removing modules so we
        // don't have to do a graphql shuffle to change the type
        loaders.stepsOfGuideLoader.load(guide.id),
    },
    taggedElements: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(EmbedTaggedElementType))
      ),
      description:
        'Tagged elements which belong to this guide or any of its steps, in any order',
      resolve: (guide, _, { loaders, accountUser }) =>
        loaders.taggedElementsOfGuideLoader.load([accountUser.id, guide.id]),
    },
    completedStepsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The number of completed steps in the guide',
      resolve: completedStepsCountResolver,
    },
    totalSteps: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The number of steps in the guide',
      resolve: async (guide, _, { loaders }) => {
        const allSteps = await loaders.stepsOfGuideLoader.load(guide.id);
        return allSteps.length;
      },
    },
    firstIncompleteModule: {
      type: EntityIdType,
      description: 'The first incomplete module for this guide',
      resolve: async (guide, _, { loaders }) => {
        const step = await loaders.firstIncompleteStepOfGuideLoader.load(
          guide.id
        );
        if (step) {
          const module = await loaders.guideModuleLoader.load(
            step.guideModuleId
          );
          return module.entityId;
        }
        return null;
      },
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
    account: {
      type: new GraphQLNonNull(EmbedAccountType),
      description: 'The account to which the guide belongs',
      resolve: (guide, _, { loaders }) =>
        loaders.accountLoader.load(guide.accountId),
    },
    isSideQuest: {
      type: GraphQLBoolean,
      description: 'Whether this guide is a side quest or a main quest.',
      resolve: async (guide, _, { loaders }) => {
        return (
          await loaders.templateLoader.load(guide.createdFromTemplateId || 0)
        )?.isSideQuest;
      },
    },
    pageTargetingType: {
      type: new GraphQLNonNull(GuidePageTargetingEnumType),
      description: 'The type of page targeting mechanism',
      resolve: async (guide, _, { loaders }) => {
        return (
          await loaders.templateLoader.load(guide.createdFromTemplateId || 0)
        )?.pageTargetingType;
      },
    },
    pageTargetingUrl: {
      type: GraphQLString,
      description: 'The URL for side quests page targeting, if enabled',
      resolve: async (guide, _args, { account, accountUser, loaders }) => {
        const ref = await loaders.templateLoader.load(
          guide.createdFromTemplateId || 0
        );
        return (
          ref.pageTargetingUrl &&
          dynamicAttributesResolver(ref.pageTargetingUrl, account, accountUser)
        );
      },
    },
    formFactor: {
      type: GuideFormFactorEnumType,
      description: 'The form factor this guide is meant to display as.',
      resolve: async (guide, _, { loaders }) => {
        return (
          await loaders.templateLoader.load(guide.createdFromTemplateId || 0)
        )?.formFactor;
      },
    },
    formFactorStyle: FormFactorStyleResolverField,
    designType: {
      type: new GraphQLNonNull(GuideDesignTypeEnumType),
      description: 'The design type of the guide',
      resolve: async (guide, _, { loaders }) => {
        return (
          await loaders.templateLoader.load(guide.createdFromTemplateId || 0)
        )?.designType;
      },
    },
    /** @todo check if we can infer state from gb */
    state: {
      type: GuideStateEnumType,
      description: 'The current activeness state of the guide',
    },
    canResetOnboarding: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Determines if the guide should allow to reset onboarding',
      resolve: canResetOnboardingResolver,
    },
    isCyoa: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether this guide is CYOA (single step guide that branches to another guide)',
      resolve: async (guide, _, { loaders }) => {
        return !!(
          await loaders.templateLoader.load(guide.createdFromTemplateId || 0)
        )?.isCyoa;
      },
    },
    branchedFromGuide: {
      type: EntityIdType,
      description: 'Which branching guide spawned this guide, if any',
      resolve: async (guide, _, { loaders }) =>
        loaders.branchedFromGuideLoader.load(guide.id),
    },
    branchedFromChoice: {
      type: EmbedGuideBranchedFromChoiceType,
      description: 'Which branching choice key spawned this guide, if any',
      resolve: (guide, _, { loaders }) =>
        loaders.branchedFromChoiceOfGuideLoader.load(guide.id),
    },
    inlineEmbed: {
      type: EmbedInlineEmbedType,
      description: 'The inline embed where this guide should be shown',
      resolve: (guide, _, { loaders }) =>
        loaders.guideInlineEmbedLoader.load(guide.id),
    },
    stepsByState: {
      type: new GraphQLNonNull(
        new GraphQLObjectType({
          name: 'GuideStepsByState',
          fields: {
            [StepState.incomplete]: { type: new GraphQLList(EmbedStepType) },
            [StepState.complete]: { type: new GraphQLList(EmbedStepType) },
            [StepState.skipped]: { type: new GraphQLList(EmbedStepType) },
            viewed: { type: new GraphQLList(EmbedStepType) },
          },
        })
      ),
      resolve: async (...args) => {
        const [guide, _a, ctx] = args;
        const stepsByState = await guideStepsByState(...args);
        const viewedSteps = await guideViewedSteps(
          guide,
          ctx.accountUser,
          ctx.loaders
        );
        return {
          ...stepsByState,
          viewed: viewedSteps,
        };
      },
    },
  },
});

export default EmbedGuideType;
