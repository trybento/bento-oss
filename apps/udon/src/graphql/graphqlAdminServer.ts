import { ApolloServer } from 'apollo-server-express';

import Schema from './Schema';
import { IS_DEVELOPMENT, IS_TEST } from 'src/utils/constants';
import {
  genContextFromReq,
  loggerPlugin,
  createTimerPlugin,
  GraphQlServerType,
} from './utils';
import { AuthenticatedRequest, GraphQLContext } from './types';

export const graphqlAdminServer = {
  schema: Schema,
  context: ({ req }: { req: AuthenticatedRequest }) => genContextFromReq(req),
  cache: 'bounded',
  persistedQueries: false,
  introspection: IS_DEVELOPMENT,
  plugins: IS_TEST
    ? []
    : [
        loggerPlugin<GraphQLContext>(true),
        createTimerPlugin('graphql.requestTime', GraphQlServerType.admin),
      ],
} as ConstructorParameters<typeof ApolloServer>[0];
