import { GraphQLSchema } from 'graphql';

import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';

export const adminSchemaFields = {
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
};

const schema = new GraphQLSchema(adminSchemaFields);

export default schema;
