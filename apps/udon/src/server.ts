import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { HttpError } from 'http-errors';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';
import { StructError } from 'superstruct';
import { TokenExpiredError } from 'jsonwebtoken';

import passport from 'src/middlewares/passport';
import requestID from 'src/middlewares/requestId';
import expressRateLimiter from './middlewares/expressRateLimiter';
import BaseRouter from './routes';
import AuthRouter from './routes/auth';
import DiagnosticsRouter from './routes/diagnostics';
import LoginRouter from './routes/login';
import EmbedRouter from './routes/embed';
import InternalRouter from './routes/internal';
import ApiRouter from './routes/api';
import S3Router from './routes/s3';
import IntegrationsRouter from './routes/integrations';
import { logger } from 'src/utils/logger';

const app = express();
const { BAD_REQUEST, UNAUTHORIZED, REQUEST_TIMEOUT } = StatusCodes;

import { graphqlAdminServer } from 'src/graphql/graphqlAdminServer';
import { graphqlEmbedServer } from 'src/graphql/graphqlEmbedServer';
import { BODY_SIZE_LIMIT } from 'shared/constants';
import { IS_DEPLOYED, IS_DEVELOPMENT, IS_E2E } from './utils/constants';
import BaseError from './errors/baseError';
import timeoutUnless from './middlewares/timeoutUnless';
import { validJson } from 'bento-common/utils/strings';
import InvalidPayloadError from './errors/InvalidPayloadError';
import { graphqlVisualBuilderServer } from './graphql/graphqlVisualBuilderServer';

/**
 * When deployed to AWS, the incoming IP address will be that of the AWS load balancer,
 * not the client. That will cause problems with things like IP-based rate-limiting.
 * Therefore, tell Express to instead use the x-forwarded-for values for variables
 * like `req.ip` and `req.ips`.
 */
if (IS_DEPLOYED) {
  app.enable('trust proxy');
}

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

function jsonVerifier(
  req: Request,
  _res: Response,
  buf: Buffer,
  encoding: BufferEncoding
) {
  const body = buf.toString(encoding);
  if (req.path === '/embed/graphql' && (body === '{}' || body.length === 0)) {
    throw new InvalidPayloadError('Empty JSON');
  }

  if (!validJson(body)) throw new InvalidPayloadError('Malformed JSON payload');
}

app.use(requestID);
app.use(
  timeoutUnless.unless({
    path: [
      { url: '/graphql', methods: ['GET', 'POST'] },
      { url: '/embed/graphql', methods: ['GET', 'POST'] },
    ],
  })
);
app.use((req: Request, res: Response, next: NextFunction) => {
  express.json({
    verify: jsonVerifier,
    limit: BODY_SIZE_LIMIT,
  })(req, res, next);
});
app.use(express.urlencoded({ extended: true, limit: BODY_SIZE_LIMIT }));
app.use(express.text({ limit: BODY_SIZE_LIMIT }));
app.use(cors());
app.use(passport.initialize());

if (!IS_E2E) {
  app.use(expressRateLimiter);
}

/** For Passport */
const embedGraphqlStrategies = ['embedJwt', 'jwt'];
const graphQlStrategies = ['jwt'];
const visualBuilderGraphQlStrategies = ['visualBuilderJwt'];

// Show routes called in console during development
if (IS_DEVELOPMENT) {
  app.use(morgan('dev'));
  embedGraphqlStrategies.push('localEmbedJwt');
  graphQlStrategies.push('localDevGraphql');
} else if (!!process.env.ENABLE_MORGAN) {
  app.use(
    morgan(
      'method=:method path=":url" host=:req[Host] service=:response-time ms status=:status ip=:remote-addr bytes=:res[content-length]'
    )
  );
}

// Security
if (IS_DEPLOYED) {
  app.use(helmet());
}

// Add APIs
app.use('/', BaseRouter);
app.use('/auth', AuthRouter);
app.use('/login', LoginRouter);
app.use('/embed', EmbedRouter);
app.use('/internal', InternalRouter);
app.use('/s3', S3Router);
app.use('/diagnostics', DiagnosticsRouter);
app.use('/api', ApiRouter);
app.use('/integrations', IntegrationsRouter);

app.use(
  '/graphql',
  passport.authenticate(graphQlStrategies, {
    session: false,
  })
);
const graphqlServer = new ApolloServer(graphqlAdminServer);

void graphqlServer.start().then(() => {
  graphqlServer.applyMiddleware({ app, path: '/graphql' });
});

app.use(
  '/embed/graphql',
  // TODO: Check if there is a better way of handling this. 'jwt' added to allow previews to use admin UI token.
  passport.authenticate(embedGraphqlStrategies, {
    session: false,
    // Needed to return error instead of plain text
    failWithError: true,
  })
);

const embedGraphqlServer = new ApolloServer(graphqlEmbedServer);

void embedGraphqlServer.start().then(() => {
  embedGraphqlServer.applyMiddleware({ app, path: '/embed/graphql' });
});

app.use(
  '/visual-builder/graphql',
  passport.authenticate(visualBuilderGraphQlStrategies, {
    session: false,
    failWithError: true,
  })
);

const visualBuilderGraphqlServer = new ApolloServer(graphqlVisualBuilderServer);

void visualBuilderGraphqlServer.start().then(() => {
  visualBuilderGraphqlServer.applyMiddleware({
    app,
    path: '/visual-builder/graphql',
  });
});

const requestError = (err: HttpError | BaseError | Error) => {
  logger.error('Request error:', err);
};

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  // Needed to transform passport response into valid json
  // and prevent Shoyu/urql from complaining
  if (err.name === 'AuthenticationError') {
    return res.status(UNAUTHORIZED).json({
      error: err.message,
    });
  }

  // Needed to transform errors coming from Superstruct into
  // pretty responses for the client
  if (err instanceof StructError) {
    /**
     * @todo add support for multiple errors if needed
     * @link https://docs.superstructjs.org/guides/05-handling-errors
     */
    return res.status(BAD_REQUEST).json({
      message: `Validation error`,
      errors: [
        {
          value: err.value,
          key: err.key,
          path: err.path,
          message: err.message,
        },
      ],
    });
  }

  let code = BAD_REQUEST;

  if (err instanceof HttpError) {
    code = err.statusCode;
    switch (err.code) {
      case 'ECONNABORTED':
      case 'ETIMEDOUT': // to avoid regressions
        // fail silently
        break;

      default:
        requestError(err);
    }
  } else if (err instanceof BaseError) {
    code = err.code;
  } else if (err instanceof TokenExpiredError) {
    code = StatusCodes.UNAUTHORIZED;
  }
  // the version of http-errors used within `connect-timeout`
  // cause this not to be an instance of HttpError, therefore
  // needs to be handled separately
  else if ((err as any).code === 'ETIMEDOUT') {
    code = REQUEST_TIMEOUT; // override
    logger.warn(
      `${err.message} (${(err as any).code}): ${req.method} ${req.url}`
    );
  }

  return res.status(code).json({ error: err.message });
});

// Export express instance
export default app;
