import { UserStatus } from 'src/data/models/types';
import { AuthType } from 'src/data/models/types';

import { User } from 'src/data/models/User.model';

import { withTransaction } from 'src/data';
import { createUserAuth } from './signupUser';
import {
  AuthAudit,
  AuthAuditEvent,
  AuthAuditEventOutcome,
} from 'src/data/models/Audit/AuthAudit.model';
import InvalidSignupError from 'src/errors/InvalidSignupError';
import { Organization } from 'src/data/models/Organization.model';
import { forceGoogleSSO } from 'src/utils/features';
import SSORequiredError from 'src/errors/SSORequiredError';

type Data = {
  userEntityId: string;
  fullName: string;
  authKey: string;
};

const signupInvitedUser = ({ userEntityId, fullName, authKey }: Data) =>
  withTransaction(async () => {
    const user = await User.findOne({
      where: {
        entityId: userEntityId,
      },
      include: {
        model: Organization,
        attributes: ['id'],
      },
    });

    if (!user || user.status !== UserStatus.invited) {
      throw new InvalidSignupError();
    }

    if (await forceGoogleSSO.enabled(user.organization)) {
      throw new SSORequiredError();
    }

    await createUserAuth(AuthType.email, authKey, user.id);

    await user.update({
      fullName,
      status: UserStatus.active,
    });

    await AuthAudit.create(
      {
        eventName: AuthAuditEvent.userAcceptedInvite,
        userId: user.id,
        payload: { fullName },
        outcome: AuthAuditEventOutcome.unknown,
      },
      { returning: false }
    );

    return user;
  });

export default signupInvitedUser;
