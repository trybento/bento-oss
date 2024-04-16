import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { $enum } from 'ts-enum-util';
import {
  boolean,
  dynamic,
  enums,
  is,
  object,
  optional,
  string,
} from 'superstruct';
import passport from 'passport';
import { IsoDatePart, Uuid } from 'bento-common/validation/customRules';
import { AdminRequestMessage, AdminRequests } from 'bento-common/types';
import generateAutolaunchAudit from 'src/interactions/reporting/generateAutolaunchAudit';
import { AuthenticatedRequest } from 'src/graphql/types';
import SimpleRateLimiter from 'src/utils/SimpleRateLimiter';
import { IS_PROD } from 'src/utils/constants';
import { getRequestRateKey } from 'src/websockets/websockets.helpers';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

// Init router and path
const router = Router();

router.get(
  '/autolaunch-report',
  passport.authenticate(['jwt'], { session: false }),
  async (req: Request, res: Response) => {
    const authRequest = req as unknown as AuthenticatedRequest;
    const organization = authRequest.user?.organization;

    if (!organization)
      return res.status(400).send({ message: 'Invalid organization auth' });

    const report = await generateAutolaunchAudit({ organization });
    res.status(200).send({ report });
  }
);

const stepProgressStruct = object({
  type: enums($enum(AdminRequests).getValues()),
  organizationEntityId: Uuid,
  dateOptions: object({ start: IsoDatePart, end: IsoDatePart }),
  filename: string(),
});

const otherReportsStruct = object({
  type: enums($enum(AdminRequests).getValues()),
  organizationEntityId: Uuid,
  templateEntityId: Uuid,
  getSeens: optional(boolean()),
  filename: string(),
});

const reportSchema = dynamic((value) =>
  // @ts-ignore
  (value as AdminRequestMessage).type === AdminRequests.stepProgressRequest
    ? stepProgressStruct
    : otherReportsStruct
);

const generateReportRateLimiter = new SimpleRateLimiter({
  keyPrefix: 'generate-report',
  points: 1,
  duration: 10 * 60,
});

router.post(
  '/generate-report',
  passport.authenticate(['jwt'], { session: false }),
  async (req: Request, res: Response) => {
    const authRequest = req as unknown as AuthenticatedRequest;
    const organization = authRequest.user?.organization;

    if (!organization)
      return res.status(400).send({ message: 'Invalid organization auth' });

    const payload = req.body as AdminRequestMessage & { filename: string };
    if (!is(payload, reportSchema)) {
      return res.status(400).send({ message: 'Invalid report request' });
    }

    const consume = await generateReportRateLimiter.check(
      getRequestRateKey(payload)
    );

    if (!consume && IS_PROD) {
      return res.status(StatusCodes.TOO_MANY_REQUESTS).send({
        message:
          'Too many requests. Please wait a few minutes before trying again.',
      });
    }

    await queueJob({
      jobType: JobType.GenerateReportCsv,
      ...payload,
      requesterEmail: authRequest.user.user.email,
    });

    return res.status(200).end();
  }
);

// Export the base-router
export default router;
