import { NextFunction, Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StructError, object, string, enums, any } from 'superstruct';
import { $enum } from 'ts-enum-util';
import StatusCodes from 'http-status-codes';
import cors from 'cors';
import isUuid from 'is-uuid';

import {
  AccountUserProperties,
  BranchingEntityType,
  CustomApiEventEntityType,
  Events,
} from 'bento-common/types';
import assertBentoSettings from 'bento-common/validation/bentoSettings.schema';

import passport from 'src/middlewares/passport';
import { logger } from 'src/utils/logger';
import identifyAccountUser from 'src/interactions/embed/identifyAccountUser';
import { Step, StepModelScope } from 'src/data/models/Step.model';
import { updateGuideLastActiveAt } from 'src/interactions/updateGuideLastActiveAt';
import { recordBrokenVideo } from 'src/interactions/notifications/recordBrokenVideo';
import { videoValidWithVerify } from 'src/utils/videoUrls';
import { resetGuideBranchingPaths } from 'src/interactions/branching/resetGuideBranchingPaths';
import { resetStepBranchingPaths } from 'src/interactions/branching/resetStepBranchingPaths';
import InactiveOrganizationError from 'src/errors/InactiveOrganizationError';
import NoAccountError from 'src/errors/NoAccountError';
import NoAccountUserError from 'src/errors/NoAccountUserError';
import ArchivedAccountError from 'src/errors/ArchivedAccountError';
import NoOrganizationError from 'src/errors/NoOrganizationError';
import InactiveUserError from 'src/errors/InactiveUserError';
import { availableGuidesChanged, guideChanged } from 'src/data/events';
import { Guide } from 'src/data/models/Guide.model';
import detachPromise from 'src/utils/detachPromise';
import InvalidPayloadError from 'src/errors/InvalidPayloadError';
import fetchFeatureFlags from 'src/interactions/fetchFeatureFlags';
import { BranchingPath } from 'src/data/models/BranchingPath.model';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Organization } from 'src/data/models/Organization.model';
import { AuthenticatedEmbedRequest } from 'src/graphql/types';
import DiagnosticsEvent from 'src/data/models/Analytics/DiagnosticsEvent.model';
import { getBentoInitId } from 'src/middlewares/requestId';
import { getIdentifyCheckKey } from 'src/interactions/embed/identifyChecks';
import { getRedisClient } from 'src/utils/redis';
import { RedisConnections } from 'src/utils/redis/getRedisClient';
import { getEventMetadata } from 'src/interactions/embed/sdk/getEventMetadata';
import { validate } from 'src/middlewares/validation';
import searchZendeskArticles from 'src/interactions/integrations/zendesk/searchZendeskArticles';
import getZendeskArticle from 'src/interactions/integrations/zendesk/getZendeskArticle';
import { analytics } from 'src/interactions/analytics/analytics';
import updateAccountUserProperties from 'src/interactions/embed/updateAccountUserProperties';

const JWT_SECRET = process.env.JWT_SECRET!;

const router = Router();

const redis = getRedisClient(RedisConnections.general);

router.post(
  '/reset-dropdown',
  passport.authenticate(['embedJwt'], { session: false }),
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { organization, accountUser } =
        req.user as AuthenticatedEmbedRequest['user'];

      const { stepEntityId } = req.body || {};

      if (!stepEntityId) {
        return res.status(404).send({ message: 'No step entity ID provided' });
      }

      const step = await Step.scope(
        StepModelScope.withPrototypeBranchingInfo
      ).findOne({
        where: {
          entityId: stepEntityId,
          organizationId: organization.id,
        },
        include: [{ model: Guide, attributes: ['entityId'] }],
      });

      if (!step) {
        return res.status(404).send({ message: 'Not found' });
      }
      const guide = await Guide.findOne({
        where: {
          id: step.guideId,
        },
      });

      const associatedBranchingPath = await BranchingPath.findOne({
        where: { branchingKey: step.createdFromStepPrototype.entityId },
      });
      if (
        associatedBranchingPath?.entityType === BranchingEntityType.Guide &&
        accountUser
      ) {
        await resetGuideBranchingPaths({
          accountUser,
          guideEntityId: guide!.entityId,
        });
      } else {
        await resetStepBranchingPaths({ accountUser, step });
      }

      await updateGuideLastActiveAt({ guide: guide! });

      if (guide) {
        guideChanged(guide.entityId);
      }

      availableGuidesChanged(accountUser.externalId);

      return res.status(200).json({
        message: 'OK',
      });
    } catch (innerError) {
      return res.status(500).json({ message: 'Failed to reset.' });
    }
  }
);

/**
 * WARNING: This should be kept in sync with the `POST /diagnostics/identify`
 * endpoint, that is intended to run diagnostics on the most part of this
 * logic to help surface identify/launching issues.
 */
router.post(
  '/identify',
  async (req: Request, res: Response, _next: NextFunction) => {
    const {
      appId,
      account: accountArgs,
      accountUser: accountUserArgs,
      autoIdentify,
      chromeExtension,
    } = req.body || {};

    const baseDDTags = { appId, autoIdentify: !!autoIdentify + '' };

    let organization: Organization | null;
    let account: Account | null;
    let accountUser: AccountUser | null;
    let cacheHit: boolean;
    try {
      assertBentoSettings(req.body);

      ({ organization, account, accountUser, cacheHit } =
        await identifyAccountUser({
          initId: getBentoInitId(req),
          appId,
          chromeExtension,
          accountArgs,
          accountUserArgs,
          hostname:
            (req.headers['x-forwarded-host'] as string) || req.headers.origin,
        }));
    } catch (err: any) {
      if (err instanceof InactiveOrganizationError) {
        return res.status(StatusCodes.UNAUTHORIZED).send({ message: err.note });
      } else if (
        err instanceof NoAccountError ||
        err instanceof NoAccountUserError ||
        err instanceof NoOrganizationError ||
        err instanceof InactiveUserError
      ) {
        return res.status(StatusCodes.NOT_FOUND).send({ message: err.note });
      } else if (err instanceof ArchivedAccountError) {
        return res.status(StatusCodes.FORBIDDEN).send({ message: err.note });
      } else if (err instanceof InvalidPayloadError) {
        return res.status(StatusCodes.BAD_REQUEST).send({ message: err.note });
      }

      // catch and rethrow validation errors
      // response should be handled by global error handler
      if (err instanceof StructError) {
        throw err;
      }

      logger.error(`[identify] error`, err);

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Server error' });
    }

    const tokenData = {
      organizationEntityId: organization.entityId,
      accountEntityId: account.entityId,
      accountUserEntityId: accountUser.entityId,
    };

    const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: '14 days' });

    if (!token) {
      const errMsg = `[embed/identify] could not generate token. tokenData: ${JSON.stringify(
        tokenData
      )}.`;
      logger.error('No token error', errMsg);
      res.status(500).json({ message: 'Could not generate token' });
    }

    const enabledFeatureFlags = await fetchFeatureFlags(organization);

    return res.status(200).json({
      token,
      enabledFeatureFlags,
      /** Whether the checks for account/User would hit the cache */
      cacheHit,
    });
  }
);

/**
 * WARNING: We shouldn't expose any data since we don't guarantee
 * the client owns the associated bento initialization ID, otherwise
 * we risk leaking data to malicious parties
 */
router.get(
  '/identify/checks',
  passport.authenticate(['embedJwt'], { session: false }),
  async (req: Request, res: Response, _next: NextFunction) => {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', new Date(Date.now() - 86400000).toUTCString()); // yesterday

    const bentoInitId = getBentoInitId(req);
    if (!bentoInitId) {
      res.status(StatusCodes.BAD_REQUEST).send();
      return;
    }

    try {
      let attempts = 0;
      let timeoutId: NodeJS.Timeout | undefined;

      const redisKey = getIdentifyCheckKey(bentoInitId);

      const redisHandler = async () => {
        attempts++;

        if ((await redis.exists(redisKey)) === 1) {
          res.status(StatusCodes.OK).send();
          return;
        }

        // delays should be: 10, 28, 51, 80, 111, 147, 185, 226, 270, 316ms,...
        const backoff = attempts ** 1.5 * 10;
        timeoutId = setTimeout(redisHandler, backoff);
      };

      // As soon as the request is closed (regardless of success/error),
      // this makes sure we will unsubscribe to the topic
      req.on('close', () => void clearTimeout(timeoutId));

      // Immediately execute the first check
      void redisHandler();
    } catch (innerError) {
      logger.error(
        `Failed to poll identify checks for #${bentoInitId}`,
        innerError
      );
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }
);

router.post(
  '/video-error',
  passport.authenticate(['embedJwt'], { session: false }),
  async (req: Request, res: Response) => {
    const { videoId, videoUrl, stepEntityId } = req.body || {};

    /* Perform async so we have time to double check */
    detachPromise(
      () =>
        (async () => {
          let useVideoId: string = videoId;
          if (!videoId) [, useVideoId] = videoUrl.split('/embed/');

          /* We do a check here for safety */
          const valid = await videoValidWithVerify(videoUrl, useVideoId, 4);

          logger.debug(`[video-error] Checked ${videoUrl}, valid: ${valid}`);

          const { organization } =
            req.user as AuthenticatedEmbedRequest['user'];

          if (valid) return;

          await recordBrokenVideo({
            videoId: useVideoId,
            videoUrl,
            stepEntityId,
          });
        })(),
      'video error check'
    );

    return res.status(201).send({
      message: 'OK',
    });
  }
);

router.post(
  '/diagnostics',
  cors({ origin: '*' }),
  (req: Request, res: Response) => {
    const { appId, event, ...payload } = req.body || {};
    if (appId && isUuid.anyNonNil(appId)) {
      detachPromise(async () => {
        const organization = await Organization.findOne({
          where: { entityId: appId },
          attributes: ['id'],
        });
        if (organization) {
          await DiagnosticsEvent.create({
            organizationId: organization.id,
            event,
            payload,
          });
        }
      }, 'diagnosticEventLogging');
    }

    return res.status(201).send();
  }
);

router.get(
  '/get-url',
  cors({ origin: '*' }),
  async (_req: Request, res: Response) => {
    res.setHeader('Content-type', 'text/plain');
    res
      .status(200)
      .end(
        `${process.env.EMBED_VERSION_LESS_URL}-${
          process.env.COMMIT_SHA || 'app'
        }.js`
      );
  }
);

router.get(
  '/events/:eventName/metadata',
  passport.authenticate(['embedJwt'], { session: false }),
  validate({
    params: object({ eventName: string() }),
    query: object({
      entityType: enums($enum(CustomApiEventEntityType).getValues()),
    }),
  }),
  async (req, res) => {
    const { eventName } = req.params;
    const { entityType } = req.query;
    const { accountUser, account } =
      req.user as AuthenticatedEmbedRequest['user'];

    const entityId =
      entityType === CustomApiEventEntityType.account
        ? account.entityId
        : accountUser.entityId;

    const metadata = await getEventMetadata({
      entityId,
      entityType,
      eventName,
    });

    res.status(200).json(metadata);
  }
);

router.post(
  '/update-properties',
  passport.authenticate(['embedJwt'], { session: false }),
  validate({
    body: object({
      key: string(),
      value: any(),
    }),
  }),
  async (req: Request, res: Response) => {
    const { user } = req;
    const { accountUser } = user as AuthenticatedEmbedRequest['user'];

    const payload = (req.body || {}) as {
      key: keyof AccountUserProperties;
      value: any;
    };

    logger.debug(
      `[update-properties] account user ${accountUser.id} updating ${payload.key} to ${payload.value}`
    );

    if (
      payload.key === 'onboardedSidebar' &&
      accountUser.properties.onboardedSidebar !== payload.value
    )
      await updateAccountUserProperties({
        accountUser,
        properties: [{ key: payload.key, value: payload.value }],
      });

    res.status(200).end();
  }
);

router.get(
  '/kb/search',
  passport.authenticate(['embedJwt'], { session: false }),
  async (req, res) => {
    const { query } = req.query as { query: string };
    const { accountUser, organization } =
      req.user as AuthenticatedEmbedRequest['user'];

    void analytics.accountUser.newEvent(Events.helpCenterSearched, {
      accountUserEntityId: accountUser.entityId,
      organizationEntityId: organization.entityId,
    });

    /* Directly access ZD for now. Will adapt for other integrations in future */
    const articles = await searchZendeskArticles({
      organizationId: accountUser.organizationId,
      query,
    });

    res.status(200).json({ articles });
  }
);

router.get(
  '/kb/article',
  passport.authenticate(['embedJwt'], { session: false }),
  async (req, res) => {
    const { articleId } = req.query as { articleId: string };
    const { accountUser } = req.user as AuthenticatedEmbedRequest['user'];

    /* Directly access ZD for now. Will adapt for other integrations in future */
    const article = await getZendeskArticle({
      organizationId: accountUser.organizationId,
      articleId,
    });

    res.status(200).json({ article });
  }
);

export default router;
