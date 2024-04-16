import { GraphQLSchema } from 'graphql';

import EmbedQuery from './EmbedQuery';
import EmbedMutation from './EmbedMutation';
import EmbedSubscription from './EmbedSubscription';

export const embedSchemaFields = {
  query: EmbedQuery,
  mutation: EmbedMutation,
  subscription: EmbedSubscription,
};

const schema = new GraphQLSchema(embedSchemaFields);

export default schema;
