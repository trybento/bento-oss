import jwt from 'jsonwebtoken';
import {
  Profile,
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import { Request } from 'express';

import { withTransaction } from 'src/data';
import {
  BASE_CLIENT_URL,
  GOOGLE_LOGIN_CALLBACK_URL,
  JWT_SECRET,
  SIGNUP_URL,
} from 'shared/constants';
import UserAuth from 'src/data/models/UserAuth.model';
import { User } from 'src/data/models/User.model';
import { AuthType, UserStatus } from 'src/data/models/types';
import signupUser, { createUserAuth } from 'src/interactions/signupUser';
import InvalidLoginError from 'src/errors/InvalidLoginError';
import InvalidSignupError from 'src/errors/InvalidSignupError';
import NoOrganizationError from 'src/errors/NoOrganizationError';
import UserDeniedError from 'src/errors/UserDeniedError';
import { checkExistingUser, isEmailOnDenyList } from './utils';
import InactiveUserError from 'src/errors/InactiveUserError';
import {
  AuthAudit,
  AuthAuditEvent,
  AuthAuditEventOutcome,
} from 'src/data/models/Audit/AuthAudit.model';
import { getRequestId } from '../requestId';
import { extractDetailsToAudit } from 'src/interactions/audit/authAudit';
import { logger } from 'src/utils/logger';

type OAuthStateData = { isSignup?: boolean };

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'abc';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'xyz';

export async function strategyCallback(
  req: Request,
  _accessToken: string,
  _refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) {
  const {
    res,
    next,
    query: { state },
  } = req;

  const { isSignup } = jwt.verify(
    state as string,
    JWT_SECRET
  ) as OAuthStateData;

  if (res == null || next == null) {
    throw new Error('express state is incorrect');
  }
  const externalId = profile.id;
  if (!externalId) {
    throw new Error('Google OAuth did not return a profile id');
  }
  const email = profile.emails ? profile.emails[0].value : profile._json.email;
  if (!email) {
    throw new Error('Google OAuth did not return an email');
  }

  const audit = new AuthAudit({
    eventName: AuthAuditEvent.logIn,
    requestId: getRequestId(req),
    requestIp: req.ip,
    meta: { strategy: 'google' },
    payload: { email, externalId },
  });

  try {
    if (await isEmailOnDenyList(email)) {
      throw new UserDeniedError();
    }

    const user = await withTransaction(async () => {
      const googleAuth = await UserAuth.findOne({
        attributes: ['userId'],
        where: { key: externalId, type: AuthType.google },
      });

      if (googleAuth) {
        return checkExistingUser(googleAuth.userId);
      }

      // Find invited user by email.
      const invitedUser = await User.findOne({
        where: {
          email,
          status: UserStatus.invited,
        },
      });

      if (invitedUser) {
        await invitedUser.update({ status: UserStatus.active });
        await createUserAuth(AuthType.google, externalId, invitedUser.id);
        return invitedUser;
      }

      const [, emailDomain] = email.split('@');
      const domain = profile?._json.hd || emailDomain;

      if (!domain) {
        throw new Error(`Missing domain for email '${email}'`);
      }

      return await signupUser({
        orgName: domain?.split('.')[0],
        email,
        domain,
        fullName: profile.displayName,
        isSignup,
        authType: AuthType.google,
        authKey: externalId,
      });
    });

    audit.set('outcome', AuthAuditEventOutcome.success);
    audit.set('userId', user.id);
    audit.set('meta', { ...audit.meta, authUser: extractDetailsToAudit(user) });
    return done(null, user);
  } catch (err: any) {
    audit.set('outcome', AuthAuditEventOutcome.failure);

    if (err instanceof InactiveUserError) {
      return done(null, false, { message: 'User not active' });
    }
    if (err instanceof InvalidSignupError) {
      return res.redirect(`${SIGNUP_URL}?isInvalid=true`);
    }
    if (err instanceof InvalidLoginError) {
      return done(null, false, { message: 'Invalid login' });
    }
    if (err instanceof NoOrganizationError) {
      return res.redirect(`${BASE_CLIENT_URL}/login/error/no-organization`);
    }
    if (err instanceof UserDeniedError) {
      audit.set('meta', { ...audit.meta, denied: true });
      return res.redirect(`${BASE_CLIENT_URL}/login/error/no-organization`);
    }

    /** Misc errors we didn't anticipate */
    logger.error(
      `[googleStrategy] Error occurred on login: ${err.message}`,
      err
    );

    done(null, false);
  } finally {
    await audit.save();
  }
}

export default function googleStrategy(): GoogleStrategy {
  return new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_LOGIN_CALLBACK_URL,
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      passReqToCallback: true,
    },
    strategyCallback
  );
}
