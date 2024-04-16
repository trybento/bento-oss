import { NextFunction, Router, Request, Response } from 'express';
import { assert, object, string, StructError } from 'superstruct';
import { StatusCodes } from 'http-status-codes';

import passport from 'src/middlewares/passport';
import { Organization } from 'src/data/models/Organization.model';
import NoAccountUserError from 'src/errors/NoAccountUserError';
import { AdminRequestUser, AuthenticatedRequest } from 'src/graphql/types';
import { logger } from 'src/utils/logger';
import { getEligibleOrganizations } from 'src/routes/login/login.helpers';
import {
  launchingDiagnosticsInput,
  runDiagnosticsForTemplateAndUser,
  runLaunchingDiagnostics,
} from 'src/interactions/troubleshooter/troubleshooting';
import { IS_DEVELOPMENT, IS_STAGING } from 'src/utils/constants';
import { emptyMiddleware } from 'src/utils/helpers';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { RollupTypeEnum } from 'src/jobsBull/jobs/rollupTasks/rollup.constants';
import NoContentError from 'src/errors/NoContentError';
import { validate } from 'src/middlewares/validation';

const router = Router();

/** For people too lazy to get the token to debug on inconsequential envs */
const REQUIRE_AUTH = !IS_DEVELOPMENT;

/**
 * Diagnostics endpoint that should help us answer the following
 * question:
 *
 * What guides this user would have gotten?
 */
router.post(
  '/launching',
  REQUIRE_AUTH
    ? emptyMiddleware
    : passport.authenticate(['jwt'], { session: false }),
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      assert(req.body, launchingDiagnosticsInput);
      const { accountUserEntityId } = req.body;

      const searchableOrgIds = (
        REQUIRE_AUTH
          ? await Organization.findAll({ attributes: ['id'] })
          : await getEligibleOrganizations(
              ((req.user || {}) as AdminRequestUser)!.user,
              ['id']
            )
      ).map((o) => o.id);

      const { acLaunchReport, auLaunchReport } = await runLaunchingDiagnostics({
        accountUserEntityId,
        searchableOrgIds,
      });

      return res.status(200).send({
        message: 'OK',
        reports: {
          account: acLaunchReport,
          accountUser: auLaunchReport,
        },
      });
    } catch (innerError) {
      if (innerError instanceof StructError) {
        throw innerError;
      }

      if (innerError instanceof NoAccountUserError) {
        res.status(StatusCodes.NOT_FOUND).send();
        return;
      }

      logger.error(innerError);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: 'Sorry, an error occurred',
      });
    }
  }
);

/**
 * Above but specialized for looking up a particular template-user combo
 */
router.post(
  '/launching-lookup',
  passport.authenticate(['jwt'], { session: false }),
  validate({
    body: object({
      accountEntityId: string(),
      accountUserEntityId: string(),
      templateEntityId: string(),
    }),
  }),
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { accountEntityId, accountUserEntityId, templateEntityId } =
        req.body;

      const authRequest = req as unknown as AuthenticatedRequest;
      const organization = authRequest.user?.organization;

      const results = await runDiagnosticsForTemplateAndUser({
        accountEntityId,
        accountUserEntityId,
        templateEntityId,
        organization,
      });

      /* Send all this to have all data to render in one place */
      return res.status(200).send({
        message: 'OK',
        ...results,
      });
    } catch (innerError: any) {
      if (
        innerError instanceof NoAccountUserError ||
        innerError instanceof NoContentError
      ) {
        res.status(StatusCodes.NOT_FOUND).send();
        return;
      }

      logger.error(innerError.message, innerError);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: 'Sorry, an error occurred',
      });
    }
  }
);

/**
 * Queues the suite of rollups for debugging/force-update purposes
 */
router.post(
  '/rollup',
  passport.authenticate(['jwt'], { session: false }),
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!IS_STAGING && !IS_DEVELOPMENT)
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).send();

    const authRequest = req as unknown as AuthenticatedRequest;
    logger.info(
      `[/rollup] ${authRequest.user?.user?.email} requested a rollup`
    );

    await queueJob({
      jobType: JobType.QueueRollup,
      rollupType: RollupTypeEnum.AnalyticRollups,
    });

    await queueJob({
      jobType: JobType.QueueRollup,
      rollupType: RollupTypeEnum.GuideRollups,
    });

    res.status(200).send();
  }
);

export default router;
