import jwt, { TokenExpiredError } from 'jsonwebtoken';

import genLoaders from 'src/data/loaders';
import { logger } from 'src/utils/logger';
import { AccessTokenData } from 'src/routes/auth';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Organization } from 'src/data/models/Organization.model';
import { EmbedContext } from './types';
import { enableGatedGuideAndStepPropagation } from 'src/utils/features';
import InvalidAuthPayloadError from 'src/errors/InvalidAuthPayloadError';

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function embedGenerateContextFromBearer(
  token: string
): Promise<EmbedContext> {
  let accessTokenData: AccessTokenData;
  try {
    accessTokenData = jwt.verify(token, JWT_SECRET) as AccessTokenData;
  } catch (e: any) {
    /* Throw auth error so we can handle it as a "known" error */
    if (e instanceof TokenExpiredError)
      throw new InvalidAuthPayloadError('JWT expired');
    throw e;
  }

  const { accountUserEntityId, organizationEntityId } = accessTokenData;

  if (!accountUserEntityId) throw new Error('No accountUser ID provided');

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
        required: true,
      },
    ],
  });

  if (!accountUser) {
    // this might be due to org/account not matching
    throw new Error('Account user not found');
  }

  const gatedGuideAndStepPropagation =
    await enableGatedGuideAndStepPropagation.enabled(accountUser.organization);

  return {
    account: accountUser.account,
    accountUser,
    organization: accountUser.organization,
    logger,
    loaders: genLoaders(),
    gatedGuideAndStepPropagation,
  };
}
