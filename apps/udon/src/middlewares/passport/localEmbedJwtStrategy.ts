import { Strategy } from 'passport-custom';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Organization } from 'src/data/models/Organization.model';
import { User } from 'src/data/models/User.model';

export default function localEmbedJwtStrategy() {
  return new Strategy(async (req, done) => {
    const allowedLocalAgents = ['graphiql', 'graphqlplayground', 'insomnia'];

    const userAgent = req.get('user-agent');
    if (!userAgent) {
      return done(null, false);
    }

    const isLocalReq = !!allowedLocalAgents.find(
      (agent) => userAgent.toLowerCase().indexOf(agent) >= 0
    );

    if (!isLocalReq) {
      return done(null, false);
    }

    let whereQuery = {};
    if (req.query.userEntityId) {
      whereQuery = {
        entityId: req.query.userEntityId,
      };
    }

    const user = await User.findOne({
      where: whereQuery,
    });

    if (!user) {
      return done(null, false);
    }

    const organization = await Organization.findOne({
      where: {
        id: user.organizationId,
      },
    });

    if (!organization) {
      return done(null, false);
    }

    const accountUser = await AccountUser.findOne({
      where: {
        email: user.email,
      },
    });

    if (!accountUser) {
      return done(null, false);
    }

    const account = await Account.scope('notArchived').findOne({
      where: {
        id: accountUser.accountId,
      },
    });

    if (!account) {
      return done(null, false);
    }

    const requestUser = {
      organization,
      accountUser,
      account,
    };

    return done(null, requestUser);
  });
}
