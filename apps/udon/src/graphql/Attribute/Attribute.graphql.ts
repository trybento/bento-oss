import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import {
  AttributeAttributeType,
  AttributeSourceType,
} from 'bento-common/graphql/attributes';
import { AttributeValueType } from 'bento-common/graphql/targeting';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { GraphQLContext } from 'src/graphql/types';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import StepPrototypeType from '../StepPrototype/StepPrototype.graphql';
import GuideBaseType from '../GuideBase/GuideBase.graphql';
import { getComputedAttributeInfo } from 'src/interactions/targeting/fetchComputedAttributeValues';
import {
  DataUsage,
  DataUsageType,
} from 'src/data/models/Analytics/DataUsage.model';
import { CustomAttributeValue } from 'src/data/models/CustomAttributeValue.model';
import { getCustomAttributeValueColumnName } from 'src/utils/helpers';

const getDataUsage = async (
  attribute: CustomAttribute,
  organizationId: number
) => {
  const du = await DataUsage.findOne({
    where: {
      name: attribute.name,
      scope: attribute.type!,
      type: DataUsageType.attribute,
      organizationId,
    },
  });

  return du;
};

const AttributeType = new GraphQLObjectType<CustomAttribute, GraphQLContext>({
  name: 'Attribute',
  fields: () => ({
    ...globalEntityId('Attribute'),
    ...entityIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The identifier for the attribute',
    },
    valueType: {
      type: new GraphQLNonNull(AttributeValueType),
      description: 'The type of the value for this attribute',
    },
    type: {
      type: AttributeAttributeType,
      description: 'The type of the attribute',
    },
    source: {
      type: AttributeSourceType,
      description: 'Where the attribute was created from',
    },
    values: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
      description:
        'Example values of this attribute as stored in relevant table. Limited for perf',
      resolve: async (attribute, _args, { organization }) => {
        const [computedType, resolver] = getComputedAttributeInfo(attribute);

        if (resolver) {
          /* Fetch values for attributes where Bento provides the data */
          return await resolver({
            attributeName: attribute.name,
            organization,
            limit: 3,
          });
        }

        const cavs = await CustomAttributeValue.findAll({
          where: {
            customAttributeId: attribute.id,
          },
          limit: 3,
        });

        return cavs.map((cav) =>
          String(cav[getCustomAttributeValueColumnName(attribute.valueType)])
        );
      },
    },
    autocompletes: {
      type: new GraphQLNonNull(new GraphQLList(StepPrototypeType)),
      description: 'What steps this attribute is tied to for autocomplete',
      resolve: async (attribute, _args, { organization, loaders }) => {
        const du = await getDataUsage(attribute, organization.id);

        if (!du?.autocompletes) return [];

        return (
          await loaders.stepPrototypeLoader.loadMany(du.autocompletes)
        ).filter(Boolean);
      },
    },
    autolaunches: {
      type: new GraphQLNonNull(new GraphQLList(GuideBaseType)),
      description: 'What guide bases this attribute is involved in launching',
      resolve: async (attribute, _args, { organization, loaders }) => {
        const du = await getDataUsage(attribute, organization.id);

        if (!du?.autolaunches) return [];

        return (await loaders.guideBaseLoader.loadMany(du.autolaunches)).filter(
          Boolean
        );
      },
    },
    mappedToAutolaunch: {
      type: GraphQLBoolean,
      resolve: async (attribute, _args, { organization }) => {
        const du = await getDataUsage(attribute, organization.id);

        return du?.autolaunches && du.autolaunches.length > 0;
      },
    },
    mappedToAutocomplete: {
      type: GraphQLBoolean,
      resolve: async (attribute, _args, { organization }) => {
        const du = await getDataUsage(attribute, organization.id);

        return du?.autocompletes && du.autocompletes.length > 0;
      },
    },
  }),
});

export default AttributeType;
