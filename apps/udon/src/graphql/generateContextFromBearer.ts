import jwt, { TokenExpiredError } from 'jsonwebtoken';

import genLoaders from 'src/data/loaders';
import { AccessTokenData } from 'src/routes/auth';
import { logger } from 'src/utils/logger';
import { UserOrganization } from 'src/data/models/UserOrganization.model';
import { User } from 'src/data/models/User.model';
import { Organization } from 'src/data/models/Organization.model';
import { GraphQLContext } from './types';
import { enableGatedGuideAndStepPropagation } from 'src/utils/features';
import InvalidAuthPayloadError from 'src/errors/InvalidAuthPayloadError';

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function generateContextFromBearer(
  token: string
): Promise<GraphQLContext> {
  let accessTokenData: AccessTokenData;
  try {
    accessTokenData = jwt.verify(token, JWT_SECRET) as AccessTokenData;
  } catch (e: any) {
    /* Throw auth error so we can handle it as a "known" error */
    if (e instanceof TokenExpiredError)
      throw new InvalidAuthPayloadError('JWT expired');
    throw e;
  }

  const { userEntityId, organizationEntityId } = accessTokenData;

  const user = await User.findOne({
    where: {
      entityId: userEntityId,
    },
  });

  const organization = await Organization.findOne({
    where: {
      entityId: organizationEntityId,
    },
  });

  if (!user) throw new Error('No user found');
  if (!organization) throw new Error('No organization found');

  if (!user.isSuperadmin) {
    const uo = await UserOrganization.findOne({
      where: {
        userId: user.id,
        organizationId: organization.id,
      },
    });

    if (!uo) throw new Error('User and org do not match');
  }

  const gatedGuideAndStepPropagation =
    await enableGatedGuideAndStepPropagation.enabled(organization);

  return {
    user,
    organization,
    logger,
    loaders: genLoaders(),
    gatedGuideAndStepPropagation,
  };
}
