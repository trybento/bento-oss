import {
  Strategy as EmailStrategy,
  VerifyFunctionWithRequest,
} from 'passport-local';

import { getRequestId } from 'src/middlewares/requestId';
import InvalidLoginError from 'src/errors/InvalidLoginError';
import { User } from 'src/data/models/User.model';
import {
  AuthAudit,
  AuthAuditEvent,
  AuthAuditEventOutcome,
} from 'src/data/models/Audit/AuthAudit.model';
import { queryRunner } from 'src/data';
import { checkExistingUser, isEmailOnDenyList } from './utils';
import { extractDetailsToAudit } from 'src/interactions/audit/authAudit';
import { forceGoogleSSO } from 'src/utils/features';
import UserDeniedError from 'src/errors/UserDeniedError';

const LOGIN_SQL = `--sql
  SELECT
    id
  FROM
    core.user_auths
  WHERE
    user_id = :userId
    AND type = 'email'
    AND key = crypt(:password, key);
`;

export const emailStrategyCallback: VerifyFunctionWithRequest = async (
  req,
  email,
  password,
  done
) => {
  const audit = new AuthAudit({
    eventName: AuthAuditEvent.logIn,
    requestId: getRequestId(req),
    requestIp: req.ip,
    meta: { strategy: 'email', withPassword: !!password },
    payload: { email },
  });

  try {
    if (await isEmailOnDenyList(email)) {
      throw new UserDeniedError();
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new InvalidLoginError();
    }
    if (await forceGoogleSSO.enabled(user.organizationId)) {
      throw new InvalidLoginError('Your organization requires Google SSO');
    }
    await checkExistingUser(user);
    const rows = (await queryRunner({
      sql: LOGIN_SQL,
      replacements: { userId: user.id, password },
    })) as { id: number }[];
    if (rows.length === 0) {
      throw new InvalidLoginError();
    }

    audit.set('outcome', AuthAuditEventOutcome.success);
    audit.set('userId', user.id);
    audit.set('meta', {
      ...audit.meta,
      authUser: extractDetailsToAudit(user),
    });
    return done(null, user);
  } catch (err) {
    audit.set('outcome', AuthAuditEventOutcome.failure);

    if (err instanceof UserDeniedError) {
      audit.set('meta', { ...audit.meta, denied: true });
      done(
        new InvalidLoginError('Your company is not yet set up to use Bento'),
        false
      );
    } else {
      done(err, false);
    }
  } finally {
    await audit.save();
  }
};

export default function emailStrategy() {
  return new EmailStrategy({ passReqToCallback: true }, emailStrategyCallback);
}
