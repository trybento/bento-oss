import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';
import { isAnnouncementGuide } from 'bento-common/utils/formFactor';
import { entityIdField } from 'bento-common/graphql/EntityId';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import AccountUserType from 'src/graphql/AccountUser/AccountUser.graphql';
import FileUploadType from 'src/graphql/FileUpload/FileUpload.graphql';
import StepPrototypeType, {
  BranchingChoiceType,
} from 'src/graphql/StepPrototype/StepPrototype.graphql';
import UserType from 'src/graphql/User/User.graphql';
import {
  BranchingFormFactorEnumType,
  StepTypeEnumType,
} from '../graphQl.types';
import { GraphQLContext } from 'src/graphql/types';
import { Step } from 'src/data/models/Step.model';
import GuideBaseStepCtaType from '../GuideBaseStepCta/GuideBaseStepCta.graphql';
import StepAutoCompleteInteractionType from '../StepAutoCompleteInteraction/StepAutoCompleteInteraction.graphql';
import { slateToMarkdown } from 'src/utils/slate';
import MediaReferenceType from '../Media/MediaReference.graphql';
import GuideType from '../Guide/Guide.graphql';
import { isBranchingStep } from 'src/utils/stepHelpers';
import { calculateStepOrderIndex } from 'src/interactions/calculateStepOrderIndex';

const StepCompletedByEnumType = new GraphQLEnumType({
  name: 'StepCompletedBy',
  description: 'What kind of entity triggered the step completion',
  values: {
    accountUser: { value: 'account_user' },
    auto: { value: 'auto' },
    user: { value: 'user' },
  },
});

const StepType = new GraphQLObjectType<Step, GraphQLContext>({
  name: 'Step',
  description: 'A step that exists within a guide',
  fields: () => ({
    ...globalEntityId('Step'),
    ...entityIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the step',
      /** @todo check what exactly needs the fallback and consider removing the special casing below */
      resolve: async (step, _, { loaders }) => {
        const name = await loaders.nameOfStepLoader.load(step.id);

        /* Fall back to template name if it's an announcement */
        if (!name) {
          const guide = await loaders.guideLoader.load(step.guideId);
          const template = await loaders.templateLoader.load(
            guide.createdFromTemplateId || 0
          );

          if (isAnnouncementGuide(template?.formFactor)) {
            return template.name;
          }
          return null;
        }

        return name;
      },
    },
    guide: {
      type: GuideType,
      resolve: (step, _, { loaders }) => loaders.guideLoader.load(step.guideId),
    },
    body: {
      type: GraphQLString,
      description: 'The descriptive text of the step',
      deprecationReason:
        'Maybe deprecate because it is not a case that exists anymore',
      resolve: async (step, _, { loaders }) => {
        return loaders.bodyOfStepLoader.load(step.id);
      },
    },
    bodySlate: {
      type: GraphQLJSON,
      description: 'The Slate.JS RTE representation of the Step body',
      resolve: async (step, _, { loaders }) => {
        return loaders.bodySlateOfStepLoader.load({
          stepId: step.id,
          fallback: true,
        });
      },
    },
    isComplete: {
      type: new GraphQLNonNull(GraphQLBoolean),
      deprecationReason: "Use 'completedAt'",
      description: 'Whether the step has been marked as completed',
    },
    orderIndex: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async (step, _, { loaders }) => {
        const guideSteps = await loaders.stepsOfGuideLoader.load(step.guideId);
        return calculateStepOrderIndex(step, guideSteps);
      },
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    stepType: {
      type: new GraphQLNonNull(StepTypeEnumType),
      description: 'Whether or not step is required, optional, fyi, etc...',
      resolve: async (step, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            step.createdFromStepPrototypeId
          )
        ).stepType;
      },
    },
    completedAt: {
      type: GraphQLDateTime,
      description: 'When was the step completed',
    },
    completedByType: {
      type: StepCompletedByEnumType,
      description: 'What kind of entity triggered the step completion',
    },
    completedByUser: {
      type: UserType,
      resolve: (step, _, { loaders }) =>
        step.completedByUserId &&
        loaders.userLoader.load(step.completedByUserId),
    },
    completedByAccountUser: {
      type: AccountUserType,
      resolve: (step, _, { loaders }) =>
        step.completedByAccountUserId &&
        loaders.accountUserLoader.load(step.completedByAccountUserId),
    },
    nextStep: {
      deprecatedReason: 'Not being used, might be removed',
      type: StepType,
      description: 'The step that comes after',
      resolve: async (step, _a, { loaders }) => {
        const guideSteps = await loaders.stepsOfGuideLoader.load(step.guideId);

        const refStepIndex = guideSteps.findIndex((s) => s.id === step.id);

        if (refStepIndex === -1 || refStepIndex === guideSteps.length - 1) {
          return null;
        }

        const nextStep = guideSteps[refStepIndex + 1];

        if (nextStep) {
          loaders.stepLoader.prime(nextStep.id, nextStep);
          loaders.stepEntityLoader.prime(nextStep.entityId, nextStep);
        }
        return nextStep;
      },
    },
    isAutoCompletable: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Can the step be completed via auto completion',
      resolve: async (step, _, { loaders }) => {
        const stepEventMappings =
          await loaders.stepEventMappingsOfStepLoader.load(step.id);
        return stepEventMappings.length > 0;
      },
    },
    createdFromStepPrototype: {
      type: new GraphQLNonNull(StepPrototypeType),
      description: 'The step prototype that this step comes from',
      resolve: (step, _, { loaders }) =>
        loaders.stepPrototypeLoader.load(step.createdFromStepPrototypeId),
    },
    countUsersViewed: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The number of account users who have viewed this step',
      resolve: async (step, _, { loaders }) =>
        loaders.countUsersViewedStepLoader.load(step.id),
    },
    usersViewed: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      description: 'A list of account users who viewed this step',
      resolve: (step, _, { loaders }) => {
        return loaders.usersViewedStepLoader.load(step.id);
      },
    },
    usersSkipped: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      description: 'A list of account users who skipped this step',
      resolve: (step, _, { loaders }) => {
        return loaders.usersSkippedStepLoader.load(step.id);
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
      resolve: () => false,
    },
    dismissLabel: {
      deprecationReason: 'not being used, might be removed',
      type: GraphQLString,
      resolve: async (step, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            step.createdFromStepPrototypeId
          )
        ).dismissLabel;
      },
    },
    ctas: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GuideBaseStepCtaType))
      ),
      description: 'The CTAs of a step',
      resolve: async (step, _args, { loaders }) =>
        loaders.guideBaseStepCtasOfGuideStepBaseLoader.load(
          step.createdFromGuideStepBaseId
        ),
    },
    branchingQuestion: {
      type: GraphQLString,
      resolve: async (step, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            step.createdFromStepPrototypeId
          )
        ).branchingQuestion;
      },
    },
    branchingMultiple: {
      type: GraphQLBoolean,
      resolve: async (step, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            step.createdFromStepPrototypeId
          )
        ).branchingMultiple;
      },
    },
    branchingDismissDisabled: {
      type: GraphQLBoolean,
      resolve: async (step, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            step.createdFromStepPrototypeId
          )
        ).branchingDismissDisabled;
      },
    },
    branchingKey: {
      type: GraphQLString,
      resolve: async (step, _, { loaders }) => {
        const prototype = await loaders.stepPrototypeLoader.load(
          step.createdFromStepPrototypeId
        );

        if (prototype && isBranchingStep(prototype.stepType)) {
          return prototype.entityId;
        }

        return null;
      },
    },
    branchingChoices: {
      type: new GraphQLList(new GraphQLNonNull(BranchingChoiceType)),
      resolve: async (step, _args, { loaders }) => {
        const prototype = await loaders.stepPrototypeLoader.load(
          step.createdFromStepPrototypeId
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
      resolve: async (step, _, { loaders }) => {
        return (
          await loaders.stepPrototypeLoader.load(
            step.createdFromStepPrototypeId
          )
        ).branchingFormFactor;
      },
    },
    autoCompleteInteraction: {
      type: StepAutoCompleteInteractionType,
      description: 'The auto complete interaction of a step',
      resolve: async (step, _args, { loaders }) => {
        const interactions =
          await loaders.stepAutoCompleteInteractionsOfStepLoader.load(step.id);
        return interactions[0] || null;
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
  }),
});

export default StepType;
