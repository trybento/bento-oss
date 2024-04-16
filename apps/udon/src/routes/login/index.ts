import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import StatusCodes from 'http-status-codes';

const { BAD_REQUEST } = StatusCodes;

import { AccessTokenData } from 'src/routes/auth';
import { User } from 'src/data/models/User.model';
import {
  confirmUserPartOfOrg,
  getEligibleOrganizations,
} from './login.helpers';
import {
  AuthAudit,
  AuthAuditEvent,
  AuthAuditEventOutcome,
} from 'src/data/models/Audit/AuthAudit.model';
import { getRequestId } from 'src/middlewares/requestId';
import { extractDetailsToAudit } from 'src/interactions/audit/authAudit';

const JWT_SECRET = process.env.JWT_SECRET!;

const router = Router();

router.get(
  '/organizations',
  cors({ origin: '*' }),
  async (req: Request, res: Response) => {
    const bearerHeader = req.headers['authorization'];

    const audit = new AuthAudit({
      eventName: AuthAuditEvent.fetchOrganizations,
      requestId: getRequestId(req),
      requestIp: req.ip,
    });

    const unauthorizedResult = async () => {
      audit.set('outcome', AuthAuditEventOutcome.failure);
      await audit.save();
      res.status(403).json({
        error: 'Unauthorized',
      });
    };

    if (!bearerHeader) {
      return unauthorizedResult();
    }

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    if (!bearerToken) {
      return unauthorizedResult();
    }

    const tokenData = jwt.verify(bearerToken, JWT_SECRET) as AccessTokenData;

    const { userEntityId } = tokenData;

    const user = await User.findOne({ where: { entityId: userEntityId } });

    if (!user) return unauthorizedResult();

    const orgs = await getEligibleOrganizations(user);

    audit.set('userId', user.id);
    audit.set('meta', { orgs, authUser: extractDetailsToAudit(user) });
    audit.set('outcome', AuthAuditEventOutcome.success);
    await audit.save();

    res.status(200).send({
      organizations: orgs.map(({ entityId, name }) => ({ entityId, name })),
    });
  }
);

/** Superusers come through here to finally set their orgs */
router.post(
  '/set-organization',
  cors({ origin: '*' }),
  async (req: Request, res: Response) => {
    const { organizationEntityId } = req.body || {};

    const audit = new AuthAudit({
      eventName: AuthAuditEvent.setOrganization,
      requestId: getRequestId(req),
      requestIp: req.ip,
      payload: { organizationEntityId },
    });

    const failAudit = async () => {
      audit.set('outcome', AuthAuditEventOutcome.failure);
      await audit.save();
    };

    if (organizationEntityId === undefined) {
      await failAudit();
      return res.status(BAD_REQUEST).json({
        error: 'No organization entity ID supplied',
      });
    }

    const bearerHeader = req.headers['authorization'];

    const unauthorizedResult = async () => {
      await failAudit();
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Unauthorized',
      });
    };

    if (!bearerHeader) {
      return unauthorizedResult();
    }

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    if (!bearerToken) {
      return unauthorizedResult();
    }

    const accessTokenData = jwt.verify(
      bearerToken,
      JWT_SECRET
    ) as AccessTokenData;

    audit.set('meta', { userEntityId: accessTokenData.userEntityId });

    const updatedAccessTokenData = {
      ...accessTokenData,
      organizationEntityId,
    };

    /* Dbl-check we should allow this user to this org */
    const [eligible, user] = await confirmUserPartOfOrg(
      accessTokenData.userEntityId,
      organizationEntityId
    );

    if (!eligible) return unauthorizedResult();

    const updatedAccessToken = jwt.sign(updatedAccessTokenData, JWT_SECRET);

    audit.set('outcome', AuthAuditEventOutcome.success);
    audit.set('meta', { authUser: extractDetailsToAudit(user!) });
    await audit.save();
    res.status(200).json({ accessToken: updatedAccessToken });
  }
);

export default router;
