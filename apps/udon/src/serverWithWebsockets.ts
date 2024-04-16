import http from 'http';
import URL from 'url';
import { Socket } from 'net';
import { execute, GraphQLError, subscribe } from 'graphql';
import { useServer } from 'graphql-ws/lib/use/ws';
import { Context, ServerOptions } from 'graphql-ws';

import Schema, { adminSchemaFields } from 'src/graphql/Schema';
import EmbedSchema, { embedSchemaFields } from 'src/graphql/embed/EmbedSchema';
import generateContextFromBearer from 'src/graphql/generateContextFromBearer';
import embedGenerateContextFromBearer from 'src/graphql/embedGenerateContextFromBearer';
import app from 'src/server';
import embeddableWS from 'src/websockets/embeddableWebsockets';
import { parseParams } from './utils/helpers';
import embedGraphqlWS from './websockets/embedGraphqlWebsocket';
import graphqlWS from './websockets/adminGraphqlWebsocket';
import adminWS from './websockets/adminWebsocket';
import {
  deleteAccountUserTrack,
  endPreviousGuideViewingGql,
  getAccountUserTrack,
  setAccountUserTrack,
} from './websockets/trackView.helpers';
import { logger } from './utils/logger';
import InvalidAuthPayloadError from './errors/InvalidAuthPayloadError';

type WsSchema = 'admin' | 'embed';

type EmbedWSBaseContext = Context<{
  /** Bento initialization Id, useful to trace events related to a single initialize() */
  initId?: string;
  /** The end-user's auth token */
  authToken?: string;
}>;

const server = http.createServer(app);

/** Gracefully shutdown graphql ws listeners */
export const closeGraphQlWs = () =>
  Promise.all(
    [graphqlWS, embedGraphqlWS, adminWS].map(
      (wsServer) => new Promise((resolve) => wsServer.close(resolve))
    )
  );

const getEmbedContextData = async (ctx: EmbedWSBaseContext) => {
  const token = ctx.connectionParams?.authToken;
  if (!token) throw new InvalidAuthPayloadError('No bearer token found');
  return await embedGenerateContextFromBearer(token);
};

const getAdminContextData = async (ctx) => {
  const token = ctx.connectionParams?.Authorization.split(' ')[1];
  if (!token) throw new InvalidAuthPayloadError('No bearer token found');
  return await generateContextFromBearer(token);
};

const getContextData = async (ctx) =>
  ctx.connectionParams?.authToken
    ? getEmbedContextData(ctx)
    : getAdminContextData(ctx);

const logErrors = (
  errors: readonly GraphQLError[],
  _context: {
    organization: string;
    subscriptionName?: string;
    socket?: string;
  }
) => errors.forEach((error) => logger.error(error));

/**
 * Send to logging only until we have clarity what surfaces here
 *
 * Note: as of 1/18/23 still not sure when this actually fires but leaving it
 * just in case it does catch something
 */
const onErrorFactory: (schema: WsSchema) => ServerOptions['onError'] =
  (schema) => async (ctx, _m, errors) => {
    const { organization } = await getContextData(ctx);
    logErrors(errors, {
      organization: organization.slug,
      socket: `${schema}Graphql`,
    });
  };

const onSubscribeFactory: (schema: WsSchema) => ServerOptions['onSubscribe'] =
  (schema) => async (_ctx, msg) => {
    // ...
  };

const onNextFactory: (schema: WsSchema) => ServerOptions['onNext'] =
  (schema) => (_c, _m, args, result) => {
    const subscriptionName = Object.keys(result.data as object)[0];
    if (result.errors) {
      logErrors(result.errors, {
        organization: args.contextValue.organization.slug,
        subscriptionName,
        socket: `${schema}Graphql`,
      });
    }
    args.contextValue.loaders.reset();
  };

export function initiateWebsocketServer() {
  server.on(
    'upgrade',
    (request: http.IncomingMessage, socket: Socket, head) => {
      const parsed = new URL.URL(
        request.url!,
        `http://${request.headers.host}/`
      );
      const pathname = parsed.pathname;
      const parsedTags = {
        ...parseParams(parsed.searchParams),
      };

      if (pathname === '/graphql') {
        graphqlWS.handleUpgrade(request, socket, head, (client) => {
          graphqlWS.emit('connection', client, request);
        });
      } else if (pathname === '/embed') {
        embeddableWS.handleUpgrade(request, socket, head, (client) => {
          embeddableWS.emit('connection', client, request);
        });
      } else if (pathname === '/embed/graphql') {
        embedGraphqlWS.handleUpgrade(request, socket, head, (client) => {
          embedGraphqlWS.emit('connection', client, request);
        });
      } else if (pathname === '/admin') {
        adminWS.handleUpgrade(request, socket, head, (client) => {
          adminWS.emit('connection', client, request);
        });
      } else {
        socket.destroy();
      }
    }
  );

  useServer(
    {
      schema: Schema,
      roots: adminSchemaFields,
      execute,
      subscribe,
      context: getAdminContextData,
      onConnect: (ctx) => {
        {
          /* TODO: Add logging */
        }
      },
      onSubscribe: onSubscribeFactory('admin'),
      onNext: onNextFactory('admin'),
      onError: onErrorFactory('admin'),
      onComplete: (ctx, msg) => {
        {
          /* TODO: Add logging */
        }
      },
    },
    graphqlWS
  );

  useServer(
    {
      schema: EmbedSchema,
      roots: embedSchemaFields,
      execute,
      subscribe,
      context: getEmbedContextData,
      onConnect: async (ctx: EmbedWSBaseContext) => {
        const { accountUser, organization } = await getEmbedContextData(ctx);
        if (accountUser && organization) {
          setAccountUserTrack(accountUser.entityId, organization.entityId);
        }
      },
      onDisconnect: async (ctx) => {
        try {
          const { accountUser } = await getEmbedContextData(ctx);
          if (accountUser) {
            const track = getAccountUserTrack(accountUser.entityId);

            if (!track) return;

            for (const formFactor of Object.keys(track.data)) {
              endPreviousGuideViewingGql(accountUser.entityId, formFactor);
            }

            deleteAccountUserTrack(accountUser.entityId);
          }
        } catch (innerError: any) {
          logger.error('[Embed/Socket] onDisconnect error:', innerError);
        }
      },
      onSubscribe: onSubscribeFactory('embed'),
      onNext: onNextFactory('embed'),
      onError: onErrorFactory('embed'),
      onComplete: (ctx, msg) => {
        {
          /* TODO: Add logging */
        }
      },
    },
    embedGraphqlWS
  );
}

export default server;
