import {
  NextFunction,
  Router,
  Request,
  Response,
  RequestHandler,
} from 'express';
import jwt from 'jsonwebtoken';
import { URL } from 'url';
import passport from 'src/middlewares/passport';
import registerUserLogin from 'src/interactions/integrations/registerUserLogin';
import {
  BASE_CLIENT_URL,
  INVALID_LOGIN_URL,
  JWT_SECRET,
  LOGIN_URL,
  SIGNUP_URL,
} from 'shared/constants';
import { User } from 'src/data/models/User.model';
import signupUser from 'src/interactions/signupUser';
import { AuthType, UserStatus } from 'src/data/models/types';
import InvalidSignupError from 'src/errors/InvalidSignupError';
import InvalidLoginError from 'src/errors/InvalidLoginError';
import NoOrganizationError from 'src/errors/NoOrganizationError';
import UserDeniedError from 'src/errors/UserDeniedError';
import InactiveUserError from 'src/errors/InactiveUserError';
import signupInvitedUser from 'src/interactions/signupInvitedUser';
import { InviteSignupTokenData } from 'src/interactions/notifications/sendInviteUserEmail';
import { setUserPassword } from 'src/interactions/setUserPassword';
import { Organization } from 'src/data/models/Organization.model';
import { getRequestId } from 'src/middlewares/requestId';
import {
  AuthAudit,
  AuthAuditEvent,
  AuthAuditEventOutcome,
} from 'src/data/models/Audit/AuthAudit.model';
import { extractDetailsToAudit } from 'src/interactions/audit/authAudit';
import { forceGoogleSSO } from 'src/utils/features';
import { logger } from 'src/utils/logger';
import OrganizationAlreadyExistsError from 'src/errors/OrganizationAlreadyExistsError';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import SSORequiredError from 'src/errors/SSORequiredError';
import { JwtPayload } from 'src/middlewares/passport/jwtStrategy';

const router = Router();

// TODO: Put this in a better place
export type AccessTokenData = {
  userEntityId: string;
  accountEntityId?: string;
  accountUserEntityId?: string;
  organizationEntityId: string | null;
};

router.post(
  '/forgot-password-link',
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body || {};
    const requestId = getRequestId(req);

    const domain = email.split('@')[1];
    const org = await Organization.findOne({ where: { domain } });
    if (org && (await forceGoogleSSO.enabled(org.id))) {
      return res
        .status(403)
        .send({ message: 'Your organization requires Google SSO' });
    }

    await queueJob({
      jobType: JobType.SendForgotPasswordLinkEmail,
      email,
      originRequestId: requestId,
    });

    await AuthAudit.create(
      {
        eventName: AuthAuditEvent.forgotPassword,
        requestId,
        requestIp: req.ip,
        payload: { email },
        outcome: AuthAuditEventOutcome.unknown,
      },
      { returning: false }
    );

    return res.status(200).send({
      message: 'OK',
    });
  }
);

router.post(
  '/reset-password',
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, password } = req.body || {};

    const audit = new AuthAudit({
      eventName: AuthAuditEvent.resetPassword,
      requestId: getRequestId(req),
      requestIp: req.ip,
      meta: { withToken: !!token, withPassword: !!password },
    });

    const failAudit = async () => {
      audit.set('outcome', AuthAuditEventOutcome.failure);
      await audit.save();
    };

    if (!token || !password) {
      await failAudit();
      return res.status(400).send({
        message: 'No token or password provided',
      });
    }

    let tokenData: JwtPayload;
    try {
      tokenData = jwt.verify(token as string, JWT_SECRET) as JwtPayload;
    } catch (e) {
      await failAudit();
      return res.status(400).send({
        message: 'Invalid password reset token',
      });
    }

    const { userEntityId } = tokenData;

    if (!userEntityId) {
      await failAudit();
      return res.status(400).send({
        message: 'Invalid password reset token',
      });
    }

    const user = await User.findOne({
      attributes: ['id', 'entityId', 'organizationId'],
      where: {
        entityId: userEntityId,
      },
      include: [
        {
          model: Organization.scope('active'),
          attributes: ['entityId'],
          required: true,
        },
      ],
    });

    if (!user) {
      await failAudit();
      return res.status(400).send({
        message: 'Invalid password reset token',
      });
    }

    try {
      await setUserPassword({
        userId: user.id,
        password,
      });

      audit.set('userId', user.id);
      audit.set('outcome', AuthAuditEventOutcome.success);
      audit.set('meta', {
        ...audit.meta,
        authUser: extractDetailsToAudit(user),
      });
      await audit.save();
    } catch (e) {
      await failAudit();
      return res.status(500).send({ message: 'Internal Server Error' });
    }

    const accessTokenData = {
      userEntityId: user.entityId,
      organizationEntityId: user.organization.entityId,
    };

    const accessToken = jwt.sign(accessTokenData, JWT_SECRET, {
      expiresIn: '14 days',
    });

    const url = new URL(BASE_CLIENT_URL);
    url.searchParams.set('accessToken', accessToken);
    url.searchParams.set('redirectIfGuideComplete', 'true');

    return res.status(200).send({ url });
  }
);

const handleLoginError =
  (redirect: boolean, authenticate: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    let url: string;

    try {
      authenticate(req, res, next);
    } catch (error) {
      if (
        error instanceof NoOrganizationError ||
        error instanceof UserDeniedError
      ) {
        url = `${LOGIN_URL}/error/no-organization`;
      } else {
        url = INVALID_LOGIN_URL;
        if (
          error instanceof InvalidLoginError ||
          error instanceof InactiveUserError
        ) {
          logger.error('Login error', error);
        } else {
          return next(error);
        }
      }
      if (redirect) {
        return res.redirect(url);
      }
      return res.status(400).send({ url });
    }
  };

const handleLoginSuccess =
  (redirect: boolean) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const url = req.user
      ? await registerUserLogin(req.user as User)
      : INVALID_LOGIN_URL;
    if (redirect) {
      return res.redirect(url);
    }
    return res.status(req.user ? 200 : 400).send({ url });
  };

const getLoginHandlers = (redirect: boolean, authenticate: RequestHandler) => [
  handleLoginError(redirect, authenticate),
  handleLoginSuccess(redirect),
];

router.post(
  '/email',
  ...getLoginHandlers(false, passport.authenticate('local', { session: false }))
);

type EmailSignupBody = {
  email: string;
  password: string;
  orgName: string;
  fullName: string;
};

router.post(
  '/email/signup',
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, orgName, fullName } =
      (req.body as EmailSignupBody) || {};

    if (!email || !password || !orgName || !fullName) {
      return res.status(400).send({ message: 'Invalid auth payload' });
    }

    const [, domain] = email.split('@');

    if (!domain) {
      return res.status(400).send({ message: 'Invalid auth payload' });
    }

    try {
      const user = await signupUser({
        orgName,
        email,
        domain,
        fullName,
        authType: AuthType.email,
        authKey: password,
        isSignup: true,
      });

      if (user) {
        await queueJob({
          jobType: JobType.SendEmailVerificationEmail,
          email,
        });

        return res.status(204).send();
      }

      // should be no way to get here
      return res.status(500).send({ message: 'Internal Server Error' });
    } catch (err: any) {
      if (err instanceof OrganizationAlreadyExistsError) {
        return res.status(400).send({
          message:
            'Your organization is already set up on Bento. Ask your organization owner to invite you, or try logging in with Google instead.',
        });
      }

      if (err instanceof InvalidSignupError) {
        return res.status(401).send({ message: err.message });
      }

      if (err instanceof UserDeniedError) {
        return res
          .status(400)
          .send({ message: 'Your company is not yet set up to use Bento' });
      }

      if (err instanceof SSORequiredError) {
        return res.status(400).send({ message: err.message });
      }

      return res
        .status(500)
        .send({ message: 'An unknown error has occurred.' });
    }
  }
);

type InviteSignupBody = {
  token: string;
  password: string;
  fullName: string;
};

router.post(
  '/invite/signup',
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, password, fullName } = (req.body as InviteSignupBody) || {};

    if (!token) {
      return res.status(400).send({
        message: '[Invite] No token provided',
      });
    }

    let tokenData: InviteSignupTokenData;
    try {
      tokenData = jwt.verify(
        token as string,
        JWT_SECRET
      ) as InviteSignupTokenData;
    } catch (e) {
      return res.status(400).send({
        message: '[Invite] Invalid verification token',
      });
    }

    const { userEntityId } = tokenData;

    if (!userEntityId || !password || !fullName) {
      return res.status(400).send({ message: '[Invite] Invalid auth payload' });
    }

    try {
      await signupInvitedUser({
        userEntityId,
        fullName,
        authKey: password,
      });

      return res.status(204).send();
    } catch (err: any) {
      if (
        err instanceof InvalidSignupError ||
        err instanceof InvalidLoginError
      ) {
        return res
          .status(400)
          .send({ message: '[Invite] Invalid auth payload' });
      }

      if (err instanceof SSORequiredError) {
        return res.status(400).send({ message: err.message });
      }

      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
);

type EmailVerificationData = {
  userEntityId: string;
};

router.get(
  '/email/verify',
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query || {};

    if (!token) {
      return res.status(400).send({
        message: 'No token provided',
      });
    }

    let tokenData: EmailVerificationData;
    try {
      tokenData = jwt.verify(
        token as string,
        JWT_SECRET
      ) as EmailVerificationData;
    } catch (e) {
      return res.status(400).send({
        message: 'Invalid verification token',
      });
    }

    const { userEntityId } = tokenData;

    if (!userEntityId) {
      return res.status(400).send({
        message: 'Invalid verification token',
      });
    }

    const user = await User.findOne({ where: { entityId: userEntityId } });
    if (!user) {
      return res.status(400).send({
        message: 'Invalid verification token',
      });
    }

    await user.update({ status: UserStatus.active });

    return res.redirect(`${LOGIN_URL}?verified=true`);
  }
);

router.get('/google', (req: Request, res: Response, next: NextFunction) => {
  const stateData = {};
  const state = jwt.sign(stateData, JWT_SECRET, { noTimestamp: true });

  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
    state,
    session: false,
    failureRedirect: `${LOGIN_URL}?isInvalid=true`,
  })(req, res, next);
});

router.get(
  '/google/signup',
  (req: Request, res: Response, next: NextFunction) => {
    const stateData = { isSignup: true };
    const state = jwt.sign(stateData, JWT_SECRET, { noTimestamp: true });

    return passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account',
      state,
      session: false,
      failureRedirect: `${SIGNUP_URL}?isInvalid=true`,
    })(req, res, next);
  }
);

router.get(
  '/google/callback',
  ...getLoginHandlers(
    true,
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${LOGIN_URL}?isInvalid=true`,
    })
  )
);

export default router;
