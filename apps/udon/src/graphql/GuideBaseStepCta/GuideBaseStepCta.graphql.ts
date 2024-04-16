import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GuideBaseStepCta } from 'src/data/models/GuideBaseStepCta.model';
import { GraphQLContext } from '../types';
import GuideStepBaseType from 'src/graphql/GuideStepBase/GuideStepBase.graphql';
import StepPrototypeCtaType from '../StepPrototypeCta/StepPrototypeCta.graphql';
import globalEntityId from '../helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import {
  StepCtaStyleEnumType,
  StepCtaTypeEnumType,
  StepCtaSettingsType,
} from 'bento-common/graphql/stepCtas';
import TemplateType from '../Template/Template.graphql';

const GuideBaseStepCtaType = new GraphQLObjectType<
  GuideBaseStepCta,
  GraphQLContext
>({
  name: 'GuideBaseStepCta',
  fields: () => ({
    ...globalEntityId('GuideBaseStepCta'),
    ...entityIdField(),
    step: {
      type: new GraphQLNonNull(GuideStepBaseType),
      resolve: async (cta, _, { loaders }) =>
        await loaders.guideStepBaseLoader.load(cta.guideBaseStepId),
    },
    text: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (cta, _, { loaders }) => {
        return (
          await loaders.stepPrototypeCtaLoader.load(
            cta.createdFromStepPrototypeCtaId || 0
          )
        )?.text;
      },
    },
    url: {
      type: GraphQLString,
      resolve: async (cta, _, { loaders }) => {
        return (
          await loaders.stepPrototypeCtaLoader.load(
            cta.createdFromStepPrototypeCtaId || 0
          )
        )?.url;
      },
    },
    type: {
      type: new GraphQLNonNull(StepCtaTypeEnumType),
      resolve: async (cta, _, { loaders }) => {
        return (
          await loaders.stepPrototypeCtaLoader.load(
            cta.createdFromStepPrototypeCtaId || 0
          )
        )?.type;
      },
    },
    style: {
      type: new GraphQLNonNull(StepCtaStyleEnumType),
      resolve: async (cta, _, { loaders }) => {
        return (
          await loaders.stepPrototypeCtaLoader.load(
            cta.createdFromStepPrototypeCtaId || 0
          )
        )?.style;
      },
    },
    settings: {
      type: StepCtaSettingsType,
      description: 'The settings of the step CTA',
      resolve: async (cta, _, { loaders }) => {
        return (
          await loaders.stepPrototypeCtaLoader.load(
            cta.createdFromStepPrototypeCtaId || 0
          )
        )?.settings;
      },
    },
    destinationGuide: {
      deprecationReason: 'Use destinationGuideObj',
      type: GraphQLString,
      resolve: async (cta, _args, { loaders }) => {
        const launchableTemplateId = (
          await loaders.stepPrototypeCtaLoader.load(
            cta.createdFromStepPrototypeCtaId || 0
          )
        )?.launchableTemplateId;

        if (!launchableTemplateId) return null;

        return (await loaders.templateLoader.load(launchableTemplateId))
          ?.entityId;
      },
    },
    // TODO: Rename to 'destinationGuide'.
    destinationGuideObj: {
      type: TemplateType,
      resolve: (cta, _args, { loaders }) => {
        if (!cta.launchableTemplateId) return null;
        return loaders.templateLoader.load(cta.launchableTemplateId);
      },
    },
    orderIndex: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Index that indicates the order for ctas.',
      resolve: async (cta, _, { loaders }) => {
        return (
          await loaders.stepPrototypeCtaLoader.load(
            cta.createdFromStepPrototypeCtaId || 0
          )
        )?.orderIndex;
      },
    },
    createdFromStepPrototypeCta: {
      type: StepPrototypeCtaType,
      description: 'The step prototype CTA that this CTA comes from',
      resolve: async (cta, _, { loaders }) => {
        return loaders.stepPrototypeCtaLoader.load(
          cta.createdFromStepPrototypeCtaId || 0
        );
      },
    },
  }),
});

export default GuideBaseStepCtaType;
