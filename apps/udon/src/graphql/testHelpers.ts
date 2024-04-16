import { ApolloServer } from 'apollo-server';
import { VariableValues, GraphQLResponse } from 'apollo-server-types';
import { IMocks } from '@graphql-tools/mock';

import {
  setupAndSeedDatabaseForTests,
  SupportedSeeds,
} from './../data/datatests';

import * as ffMethods from 'src/utils/features';

import { graphqlEmbedServer } from 'src/graphql/graphqlEmbedServer';
import { graphqlAdminServer } from 'src/graphql/graphqlAdminServer';
import {
  AuthenticatedEmbedRequest,
  AuthenticatedRequest,
  EmbedRequestUser,
  AdminRequestUser,
} from './types';
import { genContextFromReq, genEmbedContextFromReq } from './utils';

type ExecuteParams = {
  embed?: boolean;
  query: string;
  variables?: VariableValues;
  context?: AdminRequestUser | EmbedRequestUser;
};

export type GraphQLTestContextGetter = (
  embed?: boolean
) => AdminRequestUser | EmbedRequestUser;

export type GraphQLTestQueryExecutor = <R>(
  params: Omit<ExecuteParams, 'embed'>
) => Promise<GraphQLResponse & R>;

export type GraphQLTestHelpers = {
  getAdminContext: () => AdminRequestUser;
  getEmbedContext: () => EmbedRequestUser;
  executeAdminQuery: GraphQLTestQueryExecutor;
  executeEmbedQuery: GraphQLTestQueryExecutor;
};

export function setupGraphQLTestServer(
  companyName: SupportedSeeds,
  mocks?: IMocks
): GraphQLTestHelpers {
  let defaultAdminContext: AdminRequestUser;
  let defaultEmbedContext: EmbedRequestUser;
  let executeContext: AdminRequestUser | EmbedRequestUser | undefined;

  const getContextResources = setupAndSeedDatabaseForTests(companyName);

  beforeEach(async () => {
    const contextResources = getContextResources();
    defaultAdminContext = {
      organization: contextResources.organization,
      user: contextResources.user,
    };
    defaultEmbedContext = {
      organization: contextResources.organization,
      account: contextResources.account,
      accountUser: contextResources.accountUser,
    };
  });

  const adminServer = new ApolloServer({
    ...graphqlAdminServer,
    context: () =>
      genContextFromReq({
        user: executeContext || defaultAdminContext,
      } as AuthenticatedRequest),
    mocks,
  });
  const embedServer = new ApolloServer({
    ...graphqlEmbedServer,
    context: () =>
      genEmbedContextFromReq({
        user: executeContext || defaultEmbedContext,
      } as AuthenticatedEmbedRequest),
    mocks,
  });

  async function execute<R>({
    embed,
    query,
    variables,
    context,
  }: ExecuteParams) {
    executeContext = context;
    const res = await (embed ? embedServer : adminServer).executeOperation({
      query,
      variables,
    });

    if (res.errors) console.error('[executeGql] Error:', res.errors);

    executeContext = undefined;
    return res as R;
  }

  return {
    getAdminContext: () => defaultAdminContext,
    getEmbedContext: () => defaultEmbedContext,
    executeAdminQuery: (params: Omit<ExecuteParams, 'embed'>) =>
      execute({ embed: false, ...params }),
    executeEmbedQuery: <R>(params: Omit<ExecuteParams, 'embed'>) =>
      execute<R>({ embed: true, ...params }),
  };
}

/**
 * Doesn't actually work, don't think the mock runs in correct context
 * Need to paste the snippet into an associated test file :()
 */
export const mockFeatureFlag = (ffMethodName: keyof typeof ffMethods) =>
  jest.mock('src/utils/features', () => ({
    ...jest.requireActual('src/utils/features'),
    [ffMethodName]: {
      enabled: jest.fn(() => true),
    },
  }));
