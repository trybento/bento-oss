import { ApolloServer } from 'apollo-server-express';

import EmbedSchema from './embed/EmbedSchema';
import {
  genEmbedContextFromReq,
  loggerPlugin,
  createTimerPlugin,
  GraphQlServerType,
} from './utils';
import { IS_DEVELOPMENT, IS_TEST } from 'src/utils/constants';
import { AuthenticatedEmbedRequest, EmbedContext } from './types';

export const graphqlEmbedServer = {
  schema: EmbedSchema,
  context: ({ req }: { req: AuthenticatedEmbedRequest }) =>
    genEmbedContextFromReq(req),
  cache: 'bounded',
  persistedQueries: false,
  introspection: IS_DEVELOPMENT,
  plugins: IS_TEST
    ? []
    : [
        loggerPlugin<EmbedContext>(false),
        createTimerPlugin('graphqlEmbed.requestTime', GraphQlServerType.embed),
      ],
} as ConstructorParameters<typeof ApolloServer>[0];
