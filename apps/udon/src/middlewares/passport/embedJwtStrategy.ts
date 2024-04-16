import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { OrgState } from 'src/../../common/types';

import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Organization } from 'src/data/models/Organization.model';
import InvalidAuthPayloadError from 'src/errors/InvalidAuthPayloadError';
import { AuthenticatedEmbedRequest } from 'src/graphql/types';

const JWT_SECRET = process.env.JWT_SECRET!;

export default function jwtStrategy() {
  return new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      const { accountEntityId, accountUserEntityId, organizationEntityId } =
        jwtPayload;
      try {
        if (!accountEntityId || !accountUserEntityId || !organizationEntityId) {
          throw new InvalidAuthPayloadError();
        }

        const accountUser = await AccountUser.findOne({
          where: {
            entityId: accountUserEntityId,
          },
          include: [
            {
              model: Organization,
              where: {
                entityId: organizationEntityId,
              },
              required: true,
            },
            {
              model: Account.scope('notArchived'),
              where: {
                entityId: accountEntityId,
              },
              required: true,
            },
          ],
        });

        if (!accountUser) {
          // this might be due to org/account not matching
          throw new Error('Account user not found');
        }

        if (accountUser.organization.state === OrgState.Inactive)
          throw new InvalidAuthPayloadError();

        const requestUser: AuthenticatedEmbedRequest['user'] = {
          account: accountUser.account,
          accountUser,
          organization: accountUser.organization,
        };

        return done(null, requestUser);
      } catch (e) {
        return done(e, false);
      }
    }
  );
}
