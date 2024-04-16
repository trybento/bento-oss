import { dynamicAttributesResolver } from './../resolvers';
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { entityIdField } from 'bento-common/graphql/EntityId';
import {
  StepCtaStyleEnumType,
  StepCtaTypeEnumType,
  StepCtaSettingsType,
} from 'bento-common/graphql/stepCtas';

import { GuideBaseStepCta } from 'src/data/models/GuideBaseStepCta.model';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { EmbedContext } from '../../types';
import {
  GuideDesignTypeEnumType,
  GuideFormFactorEnumType,
} from 'src/graphql/Template/Template.graphql';
import { PageTargetingType } from '../EmbedGuide/EmbedGuide.graphql';

const EmbedStepCTADestinationType = new GraphQLObjectType({
  name: 'EmbedStepCtaDestination',
  fields: () => ({
    key: {
      type: new GraphQLNonNull(GraphQLString),
    },
    formFactor: {
      type: GuideFormFactorEnumType,
      description:
        'The form factor this destination guide is meant to display as',
    },
    designType: {
      type: new GraphQLNonNull(GuideDesignTypeEnumType),
      description: 'The design type of the destination guide',
    },
    pageTargeting: {
      type: new GraphQLNonNull(PageTargetingType),
      description: 'The page targeting details of the destination guide',
    },
  }),
});

const EmbedStepCtaType = new GraphQLObjectType<GuideBaseStepCta, EmbedContext>({
  name: 'EmbedStepCta',
  fields: {
    ...globalEntityId('EmbedStepCta'),
    ...entityIdField(),
    text: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (cta, _, { loaders }) => {
        return (
          await loaders.stepPrototypeCtaLoader.load(
            cta.createdFromStepPrototypeCtaId!
          )
        ).text;
      },
    },
    url: {
      type: GraphQLString,
      resolve: async (cta, _, { loaders, account, accountUser }) => {
        const ref = await loaders.stepPrototypeCtaLoader.load(
          cta.createdFromStepPrototypeCtaId!
        );
        return (
          ref.url && dynamicAttributesResolver(ref.url, account, accountUser)
        );
      },
    },
    type: {
      type: new GraphQLNonNull(StepCtaTypeEnumType),
      resolve: async (cta, _, { loaders }) => {
        return (
          await loaders.stepPrototypeCtaLoader.load(
            cta.createdFromStepPrototypeCtaId!
          )
        ).type;
      },
    },
    style: {
      type: new GraphQLNonNull(StepCtaStyleEnumType),
      resolve: async (cta, _, { loaders }) => {
        return (
          await loaders.stepPrototypeCtaLoader.load(
            cta.createdFromStepPrototypeCtaId!
          )
        ).style;
      },
    },
    settings: {
      type: StepCtaSettingsType,
      description: 'The settings of the step CTA',
      resolve: async (cta, _, { loaders }) => {
        return (
          await loaders.stepPrototypeCtaLoader.load(
            cta.createdFromStepPrototypeCtaId!
          )
        ).settings;
      },
    },
    destination: {
      description: 'The destination details for this cta, when of launch-type',
      type: EmbedStepCTADestinationType,
      resolve: async (cta, _args, { loaders }) => {
        const ref = await loaders.stepPrototypeCtaLoader.load(
          cta.createdFromStepPrototypeCtaId!
        );

        if (!ref.launchableTemplateId) return null;

        const template = await loaders.templateLoader.load(
          ref.launchableTemplateId
        );

        if (!template) return null;

        return {
          key: template.entityId,
          designType: template.designType,
          formFactor: template.formFactor,
          pageTargeting: {
            type: template.pageTargetingType,
            url: template.pageTargetingUrl,
          },
        };
      },
    },
  },
});

export default EmbedStepCtaType;
