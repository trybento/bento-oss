import jwt from 'jsonwebtoken';

import {
  notifyEmailViaCourier,
  NOTIF_EVENT_NAMES,
} from '../../utils/notifications/notifyWithCourier';
import { JWT_SECRET, BASE_CLIENT_URL } from 'shared/constants';
import { User } from 'src/data/models/User.model';
import { Organization } from 'src/data/models/Organization.model';

const COURIER_TEMPLATE_ID = 'SBFC26WWQJ4XD7KG8KVG8MMM17QJ';

export interface InviteSignupTokenData {
  userEntityId: string;
  orgName: string;
}

export async function sendInviteUserEmail({
  invitedByName,
  user,
  organization,
}: {
  invitedByName: string;
  user: User;
  organization: Organization;
}) {
  if (!user) return;

  const jwtData: InviteSignupTokenData = {
    userEntityId: user.entityId,
    orgName: organization.name!,
  };
  const token = jwt.sign(jwtData, JWT_SECRET, { expiresIn: '7 days' });

  return notifyEmailViaCourier({
    eventId: COURIER_TEMPLATE_ID,
    eventName: NOTIF_EVENT_NAMES.InviteUser,
    recipientId: user.entityId,
    email: user.email,
    data: {
      inviteUrl: `${BASE_CLIENT_URL}/invite-sign-up/${token}`,
      orgName: organization.name,
      invitedBy: invitedByName,
    },
    organizationId: user.organizationId,
  });
}
