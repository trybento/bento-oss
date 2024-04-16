import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import InvalidAuthPayloadError from 'src/errors/InvalidAuthPayloadError';
import { User } from 'src/data/models/User.model';
import { Organization } from 'src/data/models/Organization.model';
import NoOrganizationError from 'src/errors/NoOrganizationError';
import NoUserError from 'src/errors/NoUserError';
import InvalidLoginError from 'src/errors/InvalidLoginError';
import { isEmailOnDenyList } from './utils';
import { fromUnixTime, isBefore } from 'date-fns';

export interface JwtPayload {
  userEntityId: string;
  organizationEntityId: string;
  iat: number;
}

export type Callback = (
  error: Error | unknown | null,
  user: { user: User; organization: Organization } | false
) => void;

const JWT_SECRET = process.env.JWT_SECRET!;

export const strategyCallback = async (
  jwtPayload: JwtPayload,
  done: Callback
) => {
  const { userEntityId, organizationEntityId, iat } = jwtPayload;
  try {
    if (!userEntityId || !organizationEntityId) {
      throw new InvalidAuthPayloadError();
    }

    const user = await User.findOne({
      where: {
        entityId: userEntityId,
      },
    });

    if (!user) {
      throw new NoUserError(userEntityId);
    }

    if (
      user.sessionsValidFrom &&
      isBefore(fromUnixTime(iat), user.sessionsValidFrom)
    ) {
      throw new InvalidLoginError('Re-authentication required');
    }

    const organization = await Organization.findOne({
      where: {
        entityId: organizationEntityId,
      },
    });

    if (!organization) {
      throw new NoOrganizationError(organizationEntityId);
    }

    if (await isEmailOnDenyList(user.email)) {
      throw new InvalidLoginError(
        'Your company is not yet set up to use Bento'
      );
    }

    const requestUser = {
      user,
      organization,
    };

    return done(null, requestUser);
  } catch (err) {
    return done(err, false);
  }
};

export default function jwtStrategy() {
  return new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    strategyCallback
  );
}
