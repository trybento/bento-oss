import { GraphQLSchema } from 'graphql';

import VisualBuilderQuery from './VisualBuilderQuery';
import VisualBuilderMutation from './VisualBuilderMutation';

export const visualBuilderSchemaFields = {
  query: VisualBuilderQuery,
  mutation: VisualBuilderMutation,
};

const schema = new GraphQLSchema(visualBuilderSchemaFields);

export default schema;
