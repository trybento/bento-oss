import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { StepPrototypeCta } from 'src/data/models/StepPrototypeCta.model';
import StepPrototypeType from '../StepPrototype/StepPrototype.graphql';
import { GraphQLContext } from '../types';
import globalEntityId from '../helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import {
  StepCtaStyleEnumType,
  StepCtaTypeEnumType,
  StepCtaSettingsType,
} from 'bento-common/graphql/stepCtas';
import TemplateType from '../Template/Template.graphql';

const StepPrototypeCtaType = new GraphQLObjectType<
  StepPrototypeCta,
  GraphQLContext
>({
  name: 'StepPrototypeCta',
  fields: () => ({
    ...globalEntityId('StepPrototypeCta'),
    ...entityIdField(),
    stepPrototype: {
      type: new GraphQLNonNull(StepPrototypeType),
      resolve: async (cta, _, { loaders }) =>
        await loaders.stepPrototypeLoader.load(cta.stepPrototypeId),
    },
    text: {
      type: new GraphQLNonNull(GraphQLString),
    },
    url: {
      type: GraphQLString,
    },
    type: {
      type: new GraphQLNonNull(StepCtaTypeEnumType),
    },
    style: {
      type: new GraphQLNonNull(StepCtaStyleEnumType),
    },
    destinationGuide: {
      deprecationReason: 'Use destinationGuideObj',
      description: 'The entity id of the guide this cta should launch, if any',
      type: GraphQLString,
      resolve: async (cta, _args, { loaders }) => {
        if (!cta.launchableTemplateId) return null;
        return (await loaders.templateLoader.load(cta.launchableTemplateId))
          ?.entityId;
      },
    },
    // TODO: Rename to 'destinationGuide'.
    destinationGuideObj: {
      description: 'The guide this cta should launch, if any',
      type: TemplateType,
      resolve: (cta, _args, { loaders }) => {
        if (!cta.launchableTemplateId) return null;
        return loaders.templateLoader.load(cta.launchableTemplateId);
      },
    },
    settings: {
      type: StepCtaSettingsType,
      description: 'The settings of the step CTA',
    },
    orderIndex: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Index that indicates the order for ctas.',
    },
  }),
});

export default StepPrototypeCtaType;
