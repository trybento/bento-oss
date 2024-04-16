import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { Organization } from 'src/data/models/Organization.model';
import {
  BentoApiKeyType,
  SegmentApiKey,
} from 'src/data/models/SegmentApiKey.model';
import InvalidAuthPayloadError from 'src/errors/InvalidAuthPayloadError';
import { getApiKeyFromHeaders } from 'src/routes/api/api.helpers';
import { logger } from 'src/utils/logger';

export interface RequestWithKeyType extends Request {
  _keyTypes?: Array<BentoApiKeyType>;
}

export default function apiTokenStrategy() {
  return new Strategy(async (req: RequestWithKeyType, done) => {
    const { headers } = req;

    try {
      const apiKey = getApiKeyFromHeaders(headers);

      if (!apiKey) throw new InvalidAuthPayloadError('No API key provided');

      const bentoApiKey = await SegmentApiKey.findOne({
        where: {
          key: apiKey,
          type: req._keyTypes,
        },
        include: [Organization],
      });

      if (!bentoApiKey)
        throw new InvalidAuthPayloadError('Invalid API key provided');

      done(null, bentoApiKey);
    } catch (e: any) {
      logger.debug(`[apiTokenStrategy] Auth failed, ${e.message}`, e);
      done(e, false);
    }
  });
}
