import { GraphQLObjectType } from 'graphql';
import { VisualBuilderContext } from '../types';
import updateVisualBuilderSession from './VisualBuilderSession/mutations/updateVisualBuilderSession';

export default new GraphQLObjectType<unknown, VisualBuilderContext>({
  name: 'Mutation',
  fields: {
    updateVisualBuilderSession,
  },
});
