import jwt from 'jsonwebtoken';
import { BASE_CLIENT_URL, JWT_SECRET, LOGIN_URL } from 'shared/constants';
import { logger } from 'src/utils/logger';
import { User } from 'src/data/models/User.model';
import { Organization } from 'src/data/models/Organization.model';
import { UserOrganization } from 'src/data/models/UserOrganization.model';

const SELECT_ORGANIZATION_URL = `${BASE_CLIENT_URL}/login/select-organization`;

/**
 * Handle a temp oauth code to get and log an access token
 */
export default async function registerUserLogin(user: User) {
  let redirectUrl: string;

  let accessTokenData: {
    userEntityId: string;
    organizationEntityId: string | null;
  };

  const organization = await Organization.findOne({
    where: {
      id: user.organizationId,
    },
  });

  const userOrgs = await UserOrganization.findAll({
    where: { userId: user.id },
  });
  const isMultiOrg = user.isSuperadmin || userOrgs.length > 1;

  if (isMultiOrg) {
    // Allow superadmin users to select separately which organization they want to log in as
    accessTokenData = {
      userEntityId: user.entityId,
      organizationEntityId: null,
    };

    redirectUrl = SELECT_ORGANIZATION_URL;
  } else {
    if (!organization) {
      logger.info(
        `User attempted login, no org found: ${user.entityId}, ${user.email}`
      );
      return LOGIN_URL;
    }

    accessTokenData = {
      userEntityId: user.entityId,
      organizationEntityId: organization.entityId,
    };

    redirectUrl = BASE_CLIENT_URL;
  }

  const accessToken = jwt.sign(accessTokenData, JWT_SECRET, {
    expiresIn: '14 days',
  });

  const url = new URL(redirectUrl);
  url.searchParams.set('accessToken', accessToken);
  url.searchParams.set('redirectIfGuideComplete', 'true');
  return url.toString();
}
