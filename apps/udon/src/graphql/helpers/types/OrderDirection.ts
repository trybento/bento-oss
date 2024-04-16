import { GraphQLEnumType } from 'graphql';

export const OrderDirection = new GraphQLEnumType({
  name: 'OrderDirection',
  description: 'The order direction',
  values: {
    asc: { value: 'asc' },
    desc: { value: 'desc' },
  },
});
