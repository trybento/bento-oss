import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { AttributeAttributeType } from 'bento-common/graphql/attributes';
import { AttributeValueType } from 'bento-common/graphql/targeting';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { VisualBuilderContext } from 'src/graphql/types';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';

const AttributeType = new GraphQLObjectType<
  CustomAttribute,
  VisualBuilderContext
>({
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
  }),
});

export default AttributeType;
