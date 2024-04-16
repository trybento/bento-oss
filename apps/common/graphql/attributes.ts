import { AttributeType, DataSource } from '../types';
import { enumToGraphqlEnum } from '../utils/graphql';

export const AttributeAttributeType = enumToGraphqlEnum({
  name: 'AttributeType',
  enumType: AttributeType,
});

export const AttributeSourceType = enumToGraphqlEnum({
  name: 'AttributeSoutceType',
  enumType: DataSource,
});
