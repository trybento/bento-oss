import { GraphQLError, GraphQLFieldResolver } from 'graphql';
import { isEmpty } from 'lodash';
import type {
  GraphQLRequestContext,
  ApolloServerPlugin,
} from 'apollo-server-plugin-base';

import { logger } from 'src/utils/logger';
import genLoaders from 'src/data/loaders';
import {
  AuthenticatedEmbedRequest,
  AuthenticatedRequest,
  AuthenticatedVisualBuilderRequest,
  EmbedContext,
  GraphQLContext,
  VisualBuilderContext,
} from './types';
import { createRequestContext } from 'src/utils/asyncHooks';
import { closePubSub } from './pubsub';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Organization } from 'src/data/models/Organization.model';
import { Account } from 'src/data/models/Account.model';
import { getBentoInitId } from 'src/middlewares/requestId';
import { enableGatedGuideAndStepPropagation } from 'src/utils/features';

type GraphQLAsyncContext = {
  query?: string;
  organization?: string;
};

type ExtendedGraphQLError = GraphQLError &
  GraphQLAsyncContext & {
    sql?: string;
    contextStack?: string;
  };

/** Threshold where we start dumping some logs to alert */
const SLOW_REQUEST_THRESHOLD = 15 * 1000;

/**
 * Enrich error messages with gQl specific context information
 */
export const captureAndLogError = <TContext = GraphQLContext | EmbedContext>(
  rawError: ExtendedGraphQLError,
  requestContext: GraphQLRequestContext<TContext>
) => {
  const { context } = requestContext;

  const error = !isEmpty(rawError.originalError)
    ? (rawError.originalError as ExtendedGraphQLError)
    : rawError;

  (context as unknown as GraphQLContext | EmbedContext).logger?.error(
    '[GraphQL] error',
    error
  );
};

/**
 * Loop through errors of request context and handle
 */
const captureMultipleErrors = <T>(requestContext: GraphQLRequestContext<T>) => {
  const { errors } = requestContext;

  ((errors || []) as ExtendedGraphQLError[]).forEach((error) => {
    if (error) captureAndLogError(error, requestContext);
  });
};

// Apollo plugins allow for registering life-cycle hooks.
// This plugin allows us to intercept errors for logging in a way that is context-aware.
// https://www.apollographql.com/docs/apollo-server/integrations/plugins/#creating-a-plugin
export const loggerPlugin = <TContext>(
  useAsyncContext: boolean
): ApolloServerPlugin => ({
  async requestDidStart(requestContext: GraphQLRequestContext) {
    const query = parseQuery(requestContext?.request?.query || '');
    const org = (requestContext.context as GraphQLContext)?.organization;

    if (useAsyncContext) {
      createRequestContext({
        useTrace: true,
        query,
        organization: org.slug,
      });
    }

    return {
      async didEncounterErrors(requestContext: GraphQLRequestContext) {
        captureMultipleErrors(requestContext);
      },
      didEncounterError(requestContext: GraphQLRequestContext<TContext>) {
        captureMultipleErrors<TContext>(requestContext);
      },
    };
  },
});

/** Just get something like "query ActiveGuidesQuery" */
const parseQuery = (query: string) =>
  query ? query.split('{')?.[0].split('(')?.[0] : '?';

export enum GraphQlServerType {
  admin = 'admin',
  embed = 'embed',
  visualBuilder = 'visualBuilder',
}

/** Time how long it takes to resolve a request by query */
export const createTimerPlugin = (
  _metricName: string,
  _type: GraphQlServerType
): ApolloServerPlugin => ({
  async requestDidStart({ request, context }) {
    const start = Date.now();
    const query = parseQuery(request.query || '');
    const { organization } = context as EmbedContext | GraphQLContext;
    const getTiming = () => Date.now() - start;

    return {
      async willSendResponse({ context, errors }) {
        const timing = getTiming();

        if (timing > SLOW_REQUEST_THRESHOLD)
          logger.warn(
            `[graphql] Slow request: ${query} for org ${organization.slug}`,
            {
              query,
              errors,
              context,
            }
          );
      },
    };
  },
});

export async function genContextFromReq(
  req: AuthenticatedRequest
): Promise<GraphQLContext> {
  const { user, organization } = req.user;

  const gatedGuideAndStepPropagation =
    await enableGatedGuideAndStepPropagation.enabled(organization);

  return {
    user,
    organization,
    loaders: genLoaders(),
    logger,
    gatedGuideAndStepPropagation,
  };
}

export async function genEmbedContextFromReq(
  req: AuthenticatedEmbedRequest
): Promise<EmbedContext> {
  const { organization, account, accountUser } = req.user;

  const gatedGuideAndStepPropagation =
    await enableGatedGuideAndStepPropagation.enabled(organization);

  return {
    bentoInitId: getBentoInitId(req as any),
    organization,
    account,
    accountUser,
    loaders: genLoaders(),
    logger,
    gatedGuideAndStepPropagation,
  };
}

export async function genVisualBuilderContextFromReq(
  req: AuthenticatedVisualBuilderRequest
): Promise<VisualBuilderContext> {
  const { user, organization } = req.user;

  const gatedGuideAndStepPropagation =
    await enableGatedGuideAndStepPropagation.enabled(organization);

  return {
    user,
    organization,
    loaders: genLoaders(),
    logger,
    gatedGuideAndStepPropagation,
  };
}

/** Close pubsub channels */
export const closePubSubs = async () => await closePubSub();

/**
 * This will create a sentry transaction and apply it to the context so
 */
export function withSubscriptionResolverPreparation<
  S,
  A,
  C extends EmbedContext | GraphQLContext
>(
  _name: string,
  cb: GraphQLFieldResolver<S, C, A>
): GraphQLFieldResolver<S, C, A> {
  return async (...args) => {
    const [, , context] = args;

    // update context resources so they have all the latest data
    // NOTE: do this after the sentry transaction starts so these show up in the
    // traces
    if ((context as EmbedContext).accountUser) {
      const embedContext = context as EmbedContext;
      const accountUser = await AccountUser.findOne({
        where: { id: embedContext.accountUser.id },
        include: [Account, Organization],
      });
      embedContext.accountUser = accountUser!;
      embedContext.account = accountUser!.account;
      embedContext.organization = accountUser!.organization;
    }

    return cb(...args);
  };
}

/** Raise a simpler error to the client that doesn't indicate a systematic issue */
export const graphQlError = (message: string) => ({ errors: [message] });
