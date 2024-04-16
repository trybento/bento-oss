import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { isBefore } from 'date-fns';
import {
  GuideBaseState,
  GuideDesignType,
  GuideFormFactor,
  SplitTestState,
  GuideTypeEnum,
} from 'bento-common/types';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { isSplitTestGuide } from 'bento-common/data/helpers';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import AccountType from 'src/graphql/Account/Account.graphql';
import AccountUserType from 'src/graphql/AccountUser/AccountUser.graphql';
import FileUploadType from 'src/graphql/FileUpload/FileUpload.graphql';
import GuideType from 'src/graphql/Guide/Guide.graphql';
import GuideModuleBaseType from 'src/graphql/GuideModuleBase/GuideModuleBase.graphql';
import TemplateType, {
  GuideDesignTypeEnumType,
  GuideFormFactorEnumType,
  GuidePageTargetingEnumType,
  GuideTypeEnumType,
  SplitTestStateEnumType,
} from 'src/graphql/Template/Template.graphql';
import StepType from 'src/graphql/Step/Step.graphql';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GraphQLContext } from 'src/graphql/types';
import { ThemeType } from '../Organization/Organization.graphql';
import { getGuideBaseState } from 'src/data/models/common';
import mixInCompletionStatsToViews, {
  MixinResultType,
} from 'src/interactions/analytics/stats/mixInCompletionStatsToViews';
import { GuideData } from 'src/data/models/Analytics/GuideData.model';
import { FormFactorStyleResolverField } from '../Guide/Guide.helpers';
import {
  isAnnouncementGuide,
  isTooltipGuide,
  isInlineGuide,
} from 'bento-common/utils/formFactor';

export const GuideBaseStateEnumType = enumToGraphqlEnum({
  name: 'GuideBaseState',
  description: 'The current activeness state of the guide',
  enumType: GuideBaseState,
});

const ctaTrackingStartDate = new Date('2022-05-23');

export const GuideCompletionPercentageFilterEnum = new GraphQLEnumType({
  name: 'GuideCompletionPercentageFilterEnum',
  values: {
    all: { value: 'all' },
    any: { value: 'any' },
    notStarted: { value: 'notStarted' },
    complete: { value: 'complete' },
    lessThanOneQuarter: { value: 'lessThanOneQuarter' },
    lessThanHalf: { value: 'lessThanHalf' },
    lessThanThreeQuarters: { value: 'lessThanThreeQuarters' },
    lessThanOneHundred: { value: 'lessThanOneHundred' },
  },
});

const GuideBaseType = new GraphQLObjectType<GuideBase, GraphQLContext>({
  name: 'GuideBase',
  description: 'A guide base from which guide instances can be created',
  fields: () => ({
    ...globalEntityId('GuideBase'),
    ...entityIdField(),
    name: {
      type: GraphQLString,
      description: 'The name of the guide base',
      resolve: async (guideBase, _args, { loaders }) => {
        return (
          await loaders.templateLoader.load(
            guideBase.createdFromTemplateId || 0
          )
        ).name;
      },
    },
    type: {
      type: new GraphQLNonNull(GuideTypeEnumType),
      resolve: async (guideBase, _args, { loaders }) => {
        return (
          await loaders.templateLoader.load(
            guideBase.createdFromTemplateId || 0
          )
        ).type;
      },
    },
    activatedAt: {
      type: GraphQLDateTime,
      description: 'When the guide base was activated/launched',
    },
    description: {
      type: GraphQLString,
      description: 'A description of the guide base',
      resolve: async (guideBase, _args, { loaders }) => {
        return (
          await loaders.templateLoader.load(
            guideBase.createdFromTemplateId || 0
          )
        ).description;
      },
    },
    account: {
      type: new GraphQLNonNull(AccountType),
      description: 'The account associated with the guide base',
      resolve: (guideBase, _, { loaders }) =>
        loaders.accountLoader.load(guideBase.accountId),
    },
    state: {
      type: new GraphQLNonNull(GuideBaseStateEnumType),
      description: 'The current activeness state of the guide base',
      resolve: async (guideBase, _, { loaders }) => {
        if (!guideBase.createdFromTemplateId) return GuideBaseState.inactive;

        const template = await loaders.templateLoader.load(
          guideBase.createdFromTemplateId || 0
        );

        if (template.archivedAt) return GuideBaseState.archived;

        return getGuideBaseState(guideBase);
      },
    },
    guideModuleBases: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GuideModuleBaseType))
      ),
      description: 'The guide modules that belongs to the guide',
      resolve: (guideBase) =>
        guideBase.$get('guideModuleBases', { order: [['orderIndex', 'asc']] }),
    },
    guides: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GuideType))),
      description: 'The guides created from the guide base',
      resolve: (guideBase, _, { loaders }) =>
        loaders.guidesCreatedFromGuideBaseLoader.load(guideBase.id),
    },
    accountGuide: {
      type: GuideType,
      description:
        'The account-based onboarding guide created if the guide base is an "account" type',
      resolve: async (guideBase, _, { loaders }) => {
        const type = (
          await loaders.templateLoader.load(
            guideBase.createdFromTemplateId || 0
          )
        ).type;

        if (type !== GuideTypeEnum.account) return null;
        const guides = await loaders.guidesCreatedFromGuideBaseLoader.load(
          guideBase.id
        );

        return guides[0];
      },
    },
    participants: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      description:
        'The account users who have been assigned to a guide in the guide base',
      resolve: (guideBase, _, { loaders }) => {
        return loaders.participantsOfGuideBaseLoader.load(guideBase.id);
      },
    },
    participantsWhoViewed: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      description:
        'The account users active in this guide who have ALSO viewed the guide',
      deprecationReason: 'Same as usersViewedAStep',
      resolve: async (guideBase, _, { loaders }) =>
        mixInCompletionStatsToViews(
          guideBase.id,
          loaders,
          loaders.participantsWhoViewedGuideBaseLoader,
          MixinResultType.accountUsers
        ),
    },
    participantsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The account users active in this guide',
      resolve: async (guideBase, _, { loaders }) => {
        const participants = await loaders.participantsOfGuideBaseLoader.load(
          guideBase.id
        );
        return participants.length;
      },
    },
    participantsWhoViewedCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The count of participants in all instances of the guide base who have viewed the guide',
      resolve: async (guideBase) =>
        (await getGuideBaseData(guideBase, 'usersViewedAStep')) || 0,
    },
    stepsCompletedCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async (guideBase) =>
        (await getGuideBaseData(guideBase, 'stepsCompleted')) || 0,
    },
    usersViewedAStep: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      description: 'Users who have viewed a step within this guide base',
      resolve: async (guideBase, _, { loaders }) =>
        await mixInCompletionStatsToViews(
          guideBase.id,
          loaders,
          loaders.usersViewedAStepInGuideBaseLoader,
          MixinResultType.accountUsers
        ),
    },
    usersCompletedAStep: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      description: 'Users who have completed a step within this guide base',
      resolve: async (guideBase, _, { loaders }) =>
        await loaders.usersCompletedAStepInGuideBaseLoader.load(guideBase.id),
    },
    usersCompletedAStepCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async (guideBase) =>
        (await getGuideBaseData(guideBase, 'usersCompletedAStep')) || 0,
    },
    ctasClicked: {
      type: GraphQLInt,
      description:
        'CTA clicked information for announcement type guide bases, if available',
      deprecationReason: 'Use usersClickedCta instead',
      resolve: async (guideBase, _, { loaders }) => {
        const template = await loaders.templateLoader.load(
          guideBase.createdFromTemplateId || 0
        );

        /* Just return null if it is too old to track or is not relevant */
        if (
          (template?.designType !== GuideDesignType.announcement &&
            !isTooltipGuide(template?.formFactor) &&
            // Inline contextual.
            !(
              template.isSideQuest &&
              template.formFactor === GuideFormFactor.inline
            )) ||
          !guideBase.activatedAt ||
          isBefore(guideBase.activatedAt, ctaTrackingStartDate)
        ) {
          return null;
        }

        return (await getGuideBaseData(guideBase, 'ctasClicked')) || 0;
      },
    },
    usersClickedCta: {
      type: GraphQLInt,
      description: 'Distinct users that clicked a CTA',
      resolve: async (guideBase, _, { loaders }) => {
        const template = await loaders.templateLoader.load(
          guideBase.createdFromTemplateId || 0
        );

        /* Just return null if it is too old to track or is not relevant */
        if (
          (!isAnnouncementGuide(template?.formFactor) &&
            !isTooltipGuide(template?.formFactor) &&
            // Inline contextual.
            !(template?.isSideQuest && isInlineGuide(template?.formFactor))) ||
          !guideBase.activatedAt ||
          isBefore(guideBase.activatedAt, ctaTrackingStartDate)
        ) {
          return null;
        }

        return (await getGuideBaseData(guideBase, 'usersClickedCta')) || 0;
      },
    },
    createdFromTemplate: {
      type: TemplateType,
      description:
        'The entity ID of the template from which this guide base was created',
      resolve: (guideBase, _, { loaders }) =>
        guideBase.createdFromTemplateId &&
        loaders.templateLoader.load(guideBase.createdFromTemplateId || 0),
    },
    isModifiedFromTemplate: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Wether the guide-base content was directly modified',
    },
    lastCompletedStep: {
      type: StepType,
      description:
        'The last completed step in any of the guides created from this guide base',
      resolve: (guideBase, _, { loaders }) =>
        loaders.lastCompletedStepOfGuideBaseLoader.load(guideBase.id),
    },
    averageCompletionPercentage: {
      type: new GraphQLNonNull(GraphQLFloat),
      description:
        'The average completion percentage across all instances of this guide',
      resolve: async (guideBase) =>
        (await getGuideBaseData(guideBase, 'avgProgress')) || 0,
    },
    averageStepsViewed: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async (guideBase) =>
        (await getGuideBaseData(guideBase, 'avgStepsViewed')) || 0,
    },
    averageStepsCompleted: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async (guideBase) =>
        (await getGuideBaseData(guideBase, 'avgStepsCompleted')) || 0,
    },
    fileUploads: {
      deprecationReason: 'Scheduled to be removed',
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(FileUploadType))
      ),
      description: 'The file uploads uploaded as part of this GuideBase',
      resolve: () => [],
    },
    hasFileUploads: {
      deprecationReason: 'Scheduled to be removed',
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Does this guide base have any file uploads associated with it',
      resolve: async () => false,
    },
    wasAutoLaunched: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether the guide was auto-launched',
    },
    lastActiveAt: {
      type: GraphQLDateTime,
      description: 'The last time the guide base was active by a user',
      resolve: (guideBase, _, { loaders }) =>
        loaders.lastActiveAtOfGuideBaseLoader.load(guideBase.id),
    },
    isSideQuest: {
      type: GraphQLBoolean,
      description: 'Whether this guide is a side quest or a main quest.',
      resolve: async (guideBase, _args, { loaders }) => {
        return (
          await loaders.templateLoader.load(
            guideBase.createdFromTemplateId || 0
          )
        )?.isSideQuest;
      },
    },
    pageTargetingType: {
      type: new GraphQLNonNull(GuidePageTargetingEnumType),
      description: 'The type of page targeting mechanism',
      resolve: async (guideBase, _args, { loaders }) => {
        return (
          await loaders.templateLoader.load(
            guideBase.createdFromTemplateId || 0
          )
        )?.pageTargetingType;
      },
    },
    pageTargetingUrl: {
      type: GraphQLString,
      description: 'The URL for side quests page targeting, if enabled',
      resolve: async (guideBase, _args, { loaders }) => {
        return (
          await loaders.templateLoader.load(
            guideBase.createdFromTemplateId || 0
          )
        )?.pageTargetingUrl;
      },
    },
    designType: {
      type: new GraphQLNonNull(GuideDesignTypeEnumType),
      description: 'The design type of the guide',
      resolve: async (guideBase, _args, { loaders }) => {
        return (
          await loaders.templateLoader.load(
            guideBase.createdFromTemplateId || 0
          )
        )?.designType;
      },
    },
    formFactor: {
      type: GuideFormFactorEnumType,
      description: 'The form factor this guide is meant to display as.',
      resolve: async (guideBase, _args, { loaders }) => {
        return (
          await loaders.templateLoader.load(
            guideBase.createdFromTemplateId || 0
          )
        )?.formFactor;
      },
    },
    formFactorStyle: FormFactorStyleResolverField,
    theme: {
      type: new GraphQLNonNull(ThemeType),
      description: 'The theme for this guide-base',
      resolve: async (guideBase, _args, { loaders }) => {
        return (
          await loaders.templateLoader.load(
            guideBase.createdFromTemplateId || 0
          )
        )?.theme;
      },
    },
    obsoletedAt: {
      type: GraphQLDateTime,
      description:
        'When this guide base was made obsolete due to targeting no longer matching',
    },
    isCyoa: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether this guide is CYOA (single step guide that branches to another guide)',
      resolve: async (guideBase, _args, { loaders }) => {
        return !!(
          await loaders.templateLoader.load(
            guideBase.createdFromTemplateId || 0
          )
        )?.isCyoa;
      },
    },
    isTargetedForSplitTesting: {
      type: new GraphQLNonNull(SplitTestStateEnumType),
      description:
        'Whether or not active split tests are targeting this template',
      resolve: async (guideBase, _args, { loaders }) => {
        const type = (
          await loaders.templateLoader.load(
            guideBase.createdFromTemplateId || 0
          )
        )?.type;
        return isSplitTestGuide(type)
          ? SplitTestState.none
          : guideBase.createdFromTemplateId
          ? loaders.templateTargetedBySplitTestingLoader.load(
              guideBase.createdFromTemplateId
            )
          : SplitTestState.none;
      },
    },
  }),
});

export default GuideBaseType;

const getGuideBaseData = async <K extends keyof GuideData>(
  guideBase: GuideBase,
  key: K
): Promise<GuideData[K] | undefined> => {
  const guideData = await guideBase.$get('guideData');
  return guideData?.[key];
};
