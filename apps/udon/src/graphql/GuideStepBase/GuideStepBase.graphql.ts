import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';
import { some } from 'lodash';
import { entityIdField } from 'bento-common/graphql/EntityId';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import AccountUserType from 'src/graphql/AccountUser/AccountUser.graphql';
import FileUploadType from 'src/graphql/FileUpload/FileUpload.graphql';
import StepPrototypeType, {
  BranchingChoiceType,
} from 'src/graphql/StepPrototype/StepPrototype.graphql';
import StepType from 'src/graphql/Step/Step.graphql';
import {
  BranchingFormFactorEnumType,
  StepTypeEnumType,
} from '../graphQl.types';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { GraphQLContext } from 'src/graphql/types';
import BranchingPathType from '../BranchingPath/BranchingPath.graphql';
import GuideBaseStepCtaType from '../GuideBaseStepCta/GuideBaseStepCta.graphql';
import GuideBaseStepAutoCompleteInteractionType from '../GuideBaseStepAutoCompleteInteraction/GuideBaseStepAutoCompleteInteraction.graphql';
import { getPercentageUsersCompletedGuideStepBase } from 'src/interactions/analytics/stats/getPercentageUsersCompletedGuideStepBase';
import {
  MixinResultType,
  mixInStepCompletionStatsToViews,
} from 'src/interactions/analytics/stats/mixInCompletionStatsToViews';
import InputStepBaseType from 'src/graphql/InputStep/InputStepBase.graphql';
import { BranchingPath } from 'src/data/models/BranchingPath.model';
import MediaReferenceType from '../Media/MediaReference.graphql';
import GuideBaseStepTaggedElementType from '../GuideBaseStepTaggedElement/GuideBaseStepTaggedElement.graphql';

const GuideStepBaseType = new GraphQLObjectType<GuideStepBase, GraphQLContext>({
  name: 'GuideStepBase',
  description: 'A step that exists within a guide base',
  fields: () => ({
    ...globalEntityId('GuideStepBase'),
    ...entityIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the step',
      resolve: async (guideStepBase, _, { loaders }) => {
        return loaders.nameOfGuideStepBaseLoader.load(guideStepBase.id);
      },
    },
    body: {
      type: GraphQLString,
      description: 'The descriptive text of the step',
      resolve: async (guideStepBase, _, { loaders }) => {
        return loaders.bodyOfGuideStepBaseLoader.load(guideStepBase.id);
      },
    },
    bodySlate: {
      type: GraphQLJSON,
      description: 'The Slate.JS RTE representation of the Step body',
      resolve: async (guideStepBase, _, { loaders }) => {
        return loaders.bodySlateOfGuideStepBaseLoader.load({
          guideStepBaseId: guideStepBase.id,
          fallback: true,
        });
      },
    },
    stepType: {
      type: new GraphQLNonNull(StepTypeEnumType),
      description: 'Whether or not step is required, optional, fyi, etc...',
      resolve: async (guideStepBase, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            guideStepBase.createdFromStepPrototypeId || 0
          )
        )?.stepType;
      },
    },
    orderIndex: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    isAutoCompletable: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Can the step be completed via auto completion',
      resolve: async (guideStepBase, _, { loaders }) => {
        if (!guideStepBase.createdFromStepPrototypeId) return false;

        const stepEventMappings =
          await loaders.stepEventMappingsOfStepPrototypeLoader.load(
            guideStepBase.createdFromStepPrototypeId
          );
        return stepEventMappings.length > 0;
      },
    },
    mediaReferences: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(MediaReferenceType))
      ),
      description: 'The media references associated to this step.',
      resolve: async (guideStepBase, _, { loaders }) =>
        guideStepBase.createdFromStepPrototypeId
          ? loaders.mediaReferencesOfStepPrototypeLoader.load(
              guideStepBase.createdFromStepPrototypeId
            )
          : [],
    },
    createdFromStepPrototype: {
      type: StepPrototypeType,
      description: 'The step prototype that this guide step base comes from',
      resolve: (guideStepBase, _, { loaders }) => {
        return guideStepBase.createdFromStepPrototypeId
          ? loaders.stepPrototypeLoader.load(
              guideStepBase.createdFromStepPrototypeId
            )
          : null;
      },
    },
    steps: {
      deprecationReason:
        'Should not be used due to performance concerns. Is likely to be removed.',
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StepType))),
      description:
        'The step instances that were created from this guide step base',
      resolve: (guideStepBase, _, { loaders }) =>
        loaders.stepsOfGuideStepBaseLoader.load(guideStepBase.id),
    },
    countUsersViewed: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The number of account users who have viewed this guide step base',
      resolve: async (guideStepBase, _, { loaders }) =>
        mixInStepCompletionStatsToViews(
          guideStepBase.id,
          loaders,
          loaders.usersViewedGuideStepBaseLoader,
          MixinResultType.count
        ),
    },
    usersCompleted: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      description: 'A list of account users who completed this guide step base',
      resolve: (guideStepBase, _, { loaders }) => {
        return loaders.usersCompletedGuideStepBaseLoader.load(guideStepBase.id);
      },
    },
    usersViewed: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      description: 'A list of account users who viewed this guide step base',
      resolve: async (guideStepBase, _, { loaders }) =>
        mixInStepCompletionStatsToViews(
          guideStepBase.id,
          loaders,
          loaders.usersViewedGuideStepBaseLoader,
          MixinResultType.accountUsers
        ),
    },
    percentageCompleted: {
      type: new GraphQLNonNull(GraphQLFloat),
      description:
        'The percentage of users who have completed the guide step base',
      resolve: async (guideStepBase, _, _c) => {
        return getPercentageUsersCompletedGuideStepBase(guideStepBase.id);
      },
    },
    fileUploads: {
      deprecatedReason: 'Scheduled to be removed',
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(FileUploadType))
      ),
      description:
        'Files that have been uploaded in steps created from this guide step base',
      resolve: () => [],
    },
    hasFileUploads: {
      deprecatedReason: 'Scheduled to be removed',
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Does the guide step base have any file uploads',
      resolve: async () => false,
    },
    taggedElements: {
      type: new GraphQLNonNull(
        GraphQLList(GraphQLNonNull(GuideBaseStepTaggedElementType))
      ),
      resolve: (guideStepBase, _, { loaders }) => {
        return guideStepBase.createdFromStepPrototypeId
          ? loaders.stepPrototypeTaggedElementsOfStepPrototypeLoader.load(
              guideStepBase.createdFromStepPrototypeId
            )
          : [];
      },
    },
    dismissLabel: {
      type: GraphQLString,
      resolve: async (guideStepBase, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            guideStepBase.createdFromStepPrototypeId || 0
          )
        )?.dismissLabel;
      },
    },
    ctas: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GuideBaseStepCtaType))
      ),
      description: 'The CTAs of a step',
      resolve: async (step, _args, { loaders }) =>
        await loaders.guideBaseStepCtasOfGuideStepBaseLoader.load(step.id),
    },
    branchingQuestion: {
      type: GraphQLString,
      resolve: async (guideStepBase, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            guideStepBase.createdFromStepPrototypeId || 0
          )
        )?.branchingQuestion;
      },
    },
    branchingMultiple: {
      type: GraphQLBoolean,
      resolve: async (guideStepBase, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            guideStepBase.createdFromStepPrototypeId || 0
          )
        )?.branchingMultiple;
      },
    },
    branchingDismissDisabled: {
      type: GraphQLBoolean,
      resolve: async (guideStepBase, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            guideStepBase.createdFromStepPrototypeId || 0
          )
        )?.branchingDismissDisabled;
      },
    },
    branchingKey: {
      type: GraphQLString,
      resolve: async (guideStepBase, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            guideStepBase.createdFromStepPrototypeId || 0
          )
        )?.entityId;
      },
    },
    branchingChoices: {
      type: new GraphQLList(new GraphQLNonNull(BranchingChoiceType)),
      resolve: async (guideStepBase, _, { loaders }) => {
        const prototype = await loaders.stepPrototypeLoader.load(
          guideStepBase.createdFromStepPrototypeId || 0
        );

        return (
          prototype?.branchingChoices?.map((choice) => ({
            ...choice,
            /**
             * This is needed by the `BranchingStyleResolverField` to resolve
             * each possible branching style type.
             */
            formFactor: prototype.branchingFormFactor,
          })) || []
        );
      },
    },
    branchingFormFactor: {
      type: BranchingFormFactorEnumType,
      resolve: async (guideStepBase, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            guideStepBase.createdFromStepPrototypeId || 0
          )
        )?.branchingFormFactor;
      },
    },
    branchingPaths: {
      type: new GraphQLList(new GraphQLNonNull(BranchingPathType)),
      resolve: async (guideStepBase, _a, { loaders }) => {
        const prototype = await loaders.stepPrototypeLoader.load(
          guideStepBase.createdFromStepPrototypeId || 0
        );

        if (!prototype) return [];

        const branchingPaths = await BranchingPath.findAll({
          where: {
            branchingKey: prototype.entityId,
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
    autoCompleteInteraction: {
      type: GuideBaseStepAutoCompleteInteractionType,
      description: 'The auto complete interaction of a step',
      resolve: async (guideStepBase, _args, { loaders }) => {
        const interactions =
          await loaders.guideBaseStepAutoCompleteInteractionsOfGuideStepBaseLoader.load(
            guideStepBase.id
          );
        return interactions[0] || null;
      },
    },
    inputs: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(InputStepBaseType))
      ),
      description: 'The input prototypes of a step',
      resolve: async (guideStepBase, _args, { loaders }) => {
        return loaders.inputBasesOfGuideStepBaseLoader.load(guideStepBase.id);
      },
    },
    manualCompletionDisabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Wether an auto complete step can be manually completed.',
      resolve: async (guideStepBase, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            guideStepBase.createdFromStepPrototypeId || 0
          )
        )?.manualCompletionDisabled;
      },
    },
  }),
});

export default GuideStepBaseType;
