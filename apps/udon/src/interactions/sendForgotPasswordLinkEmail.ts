import { trim } from 'lodash';
import jwt from 'jsonwebtoken';

import { BASE_CLIENT_URL, JWT_SECRET } from 'src/shared/constants';
import { sendEmailAsync } from '../utils/notifications/sendEmail';
import { NOTIFICATIONS_ADDRESS } from 'src/utils/constants';
import { User } from 'src/data/models/User.model';

type Args = {
  email: string;
};

/**
 * WARNING: An audit log must be generated outside of this helper fn,
 * please make sure that continues to be the case when using this
 * basically anywhere.
 **/
export async function sendForgotPasswordLinkEmail({ email }: Args) {
  const user = await User.findOne({
    attributes: ['entityId', 'email'],
    where: {
      email: trim(email.toLowerCase()),
    },
  });

  if (!user) return false;

  const token = jwt.sign(
    {
      userEntityId: user.entityId,
    },
    JWT_SECRET,
    { expiresIn: '10 minutes' }
  );

  const resetPasswordUrl = `${BASE_CLIENT_URL}/reset-password?token=${token}`;

  const disclaimerText =
    'You are receiving this because you have requested to reset the password of your Bento account via your email.';

  const text = `You have requested to reset the password of your Bento account. Please follow this URL to set a new password:

${resetPasswordUrl}

This URL will expire in 10 minutes.

-
${disclaimerText}`;

  const html = `You have requested to reset the password of your Bento account. Please <a href="${resetPasswordUrl}">click here</a> to set a new password. This link will expire in 10 minutes.
<br />
<br />
—
<br />
${disclaimerText}`;

  await sendEmailAsync({
    to: user.email,
    from: {
      name: `Bento Everboarding`,
      email: NOTIFICATIONS_ADDRESS,
    },
    subject: 'Your Bento reset password request',
    text,
    html,
  });

  return true;
}
