import { ApolloServer } from 'apollo-server-express';
import VisualBuilderSchema from './visualBuilder/VisualBuilderSchema';
import {
  loggerPlugin,
  createTimerPlugin,
  GraphQlServerType,
  genVisualBuilderContextFromReq,
} from './utils';
import { IS_DEVELOPMENT, IS_TEST } from 'src/utils/constants';
import {
  AuthenticatedVisualBuilderRequest,
  VisualBuilderContext,
} from './types';

export const graphqlVisualBuilderServer = {
  schema: VisualBuilderSchema,
  context: ({ req }: { req: AuthenticatedVisualBuilderRequest }) =>
    genVisualBuilderContextFromReq(req),
  cache: 'bounded',
  persistedQueries: false,
  introspection: IS_DEVELOPMENT,
  plugins: IS_TEST
    ? []
    : [
        loggerPlugin<VisualBuilderContext>(false),
        createTimerPlugin(
          'graphqlVisualBuilder.requestTime',
          GraphQlServerType.visualBuilder
        ),
      ],
} as ConstructorParameters<typeof ApolloServer>[0];
