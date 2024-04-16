import { trim } from 'lodash';
import jwt from 'jsonwebtoken';

import { logger } from 'src/utils/logger';
import { BASE_SERVER_URL, JWT_SECRET } from 'shared/constants';
import {
  notifyEmailViaCourier,
  NOTIF_EVENT_NAMES,
} from '../utils/notifications/notifyWithCourier';
import { User } from 'src/data/models/User.model';

type Args = {
  email: string;
};

const EMAIL_VERIFICATION_URL = `${BASE_SERVER_URL}/auth/email/verify`;
const COURIER_TEMPLATE_ID = 'BFAGCEDQRP4KNVH9S8KXG99K0H8M';

export default async function sendEmailVerificationEmail({ email }: Args) {
  const user = await User.findOne({
    where: {
      email: trim(email.toLowerCase()),
    },
  });

  if (!user) {
    logger.warn('[sendEmailVerificationEmail] User not found. Skipping.');
    return;
  }

  const jwtData = { userEntityId: user.entityId };
  const token = jwt.sign(jwtData, JWT_SECRET);

  return notifyEmailViaCourier({
    eventId: COURIER_TEMPLATE_ID,
    eventName: NOTIF_EVENT_NAMES.EmailVerification,
    recipientId: user.entityId,
    email,
    data: { verifyUrl: `${EMAIL_VERIFICATION_URL}?token=${token}` },
    organizationId: user.organizationId,
  });
}
