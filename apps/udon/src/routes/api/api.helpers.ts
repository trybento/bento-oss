import { NextFunction, Request, Response, Router } from 'express';
import { IncomingHttpHeaders } from 'http';
import isUuid from 'is-uuid';
import passport from 'passport';

import {
  BentoApiKeyType,
  SegmentApiKey,
} from 'src/data/models/SegmentApiKey.model';
import InvalidAuthPayloadError from 'src/errors/InvalidAuthPayloadError';
import { RequestWithKeyType } from 'src/middlewares/passport/apiTokenStrategy';
import { handleBase64String } from 'src/utils/helpers';
import BaseController from './controllers/BaseController';

export interface ApiAuthenticatedRequest extends RequestWithKeyType {
  user: SegmentApiKey;
}

/**
 * Extract the authorization api key from the headers.
 * See inline comments for link to api key format, or how to send.
 *
 * @param authHeader the http headers object
 */
export const getApiKeyFromHeaders = (
  headers: IncomingHttpHeaders
): string | null => {
  const authHeader = headers['authorization'];

  if (!authHeader) return null;

  const base64Key = authHeader.split(' ')[1];
  if (!base64Key) return null;

  /**
   * What the apiKey should look like is documented below:
   * @docs https://docs.trybento.co/docs/guides/sending-data-manually-to-bento
   */
  const apiKey = handleBase64String(base64Key, 'from').split(':')[0];

  if (!apiKey || !isUuid.anyNonNil(apiKey)) return null;

  return apiKey;
};

type DefaultRouteFactoryArgs = {
  controller: BaseController;
  router: Router;
};

/** Applies standard routes */
export const defaultRoutesFactory = ({
  controller,
  router,
}: DefaultRouteFactoryArgs) => {
  router.get('/', apiTokenMiddleware, controller.get);
  router.post('/', apiTokenMiddleware, controller.post);
  router.put('/', apiTokenMiddleware, controller.put);
  router.delete('/', apiTokenMiddleware, controller.delete);
};

/** Attach the key specification to the middleware */
export const apiTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req['_keyTypes'] = [BentoApiKeyType.api];

  passport.authenticate('apiToken', { session: false })(req, res, next);
};

/** Important for determining which org the ops will take place */
export const getAuthenticatedOrgFromReq = (req: Request) => {
  const _req = req as ApiAuthenticatedRequest;

  if (!_req.user.organization)
    throw new InvalidAuthPayloadError('Malformed authentication payload');

  return _req.user.organization;
};

/**
 * Extract a generic bearer token from the Authorization header
 * in the format "Bearer <token>".
 */
export const getBearerTokenFromHeaders = (req: Request) => {
  const authHeader = req.get('Authorization');

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (token) {
      return token;
    }
  }

  return null;
};
