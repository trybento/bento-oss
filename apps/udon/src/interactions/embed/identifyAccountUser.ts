import { isEqual, omit } from 'lodash';
import { BentoSettings, DataSource, OrgState } from 'bento-common/types';
import { EXT_ATTRIBUTE_VALUE } from 'bento-common/utils/constants';

import { logger } from 'src/utils/logger';
import findOrCreateAccount from 'src/interactions/findOrCreateAccount';
import findOrCreateAccountUser from 'src/interactions/findOrCreateAccountUser';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import NoOrganizationError from 'src/errors/NoOrganizationError';
import NoAccountError from 'src/errors/NoAccountError';
import NoAccountUserError from 'src/errors/NoAccountUserError';
import { Organization } from 'src/data/models/Organization.model';
import InactiveOrganizationError from 'src/errors/InactiveOrganizationError';
import { queueIdentifyChecks } from 'src/jobsBull/jobs/handleIdentifyChecks/identifyChecks.helpers';
import detachPromise from 'src/utils/detachPromise';
import { checkForUnixDate } from 'src/utils/helpers';
import { trackAccountUserAppActivity } from '../analytics/trackAccountUserAppActivity';
import identifyOrganizationHost from './identifyOrganizationHost';
import runAttributeDiagnostics from '../clientDiagnostics/runAttributeDiagnostics';
import { enableIdentifyDiagnostics } from 'src/utils/internalFeatures/internalFeatures';
import recordAndSetCustomAttributes from '../recordEvents/recordAndSetCustomAttributes';
import { isCacheHit } from '../caching/identifyChecksCache';

type Args = Pick<BentoSettings, 'appId' | 'chromeExtension'> & {
  /** Bento initialization ID */
  initId?: string;
  hostname?: string;
  accountArgs: {
    id: string;
    name: string;
    createdAt: string;
    [key: string]: string | number | boolean;
  };
  accountUserArgs: {
    id: string;
    email: string;
    fullName: string;
    createdAt: string;
    [key: string]: string | number | boolean;
  };
};

export default async function identifyAccountUser({
  initId,
  appId,
  accountArgs,
  accountUserArgs,
  hostname = '',
  chromeExtension = false,
}: Args) {
  const organization = await Organization.findOne({
    where: {
      entityId: appId,
    },
    include: [OrganizationSettings],
  });

  if (!organization) {
    throw new NoOrganizationError(appId);
  }

  if (organization.state === OrgState.Inactive) {
    throw new InactiveOrganizationError(appId);
  }

  const {
    id: rawAccountFromArgsId,
    name: accountFromArgsName,
    createdAt: accountCreatedAt,
    ...restAccountAttributes
  } = accountArgs;

  const {
    id: accountUserFromArgsId,
    email: accountUserFromArgsEmail,
    fullName: accountUserFromArgsFullName,
    avatarUrl: _accountUserFromArgsAvatarUrl,
    createdAt: accountUserCreatedAt,
    ...restAccountUserAttributes
  } = accountUserArgs;

  const accountFromArgsId = rawAccountFromArgsId;

  const { account: foundOrCreatedAccount, accountChanged } =
    await findOrCreateAccount({
      organization,
      accountInput: {
        externalId: String(accountFromArgsId),
        name: accountFromArgsName,
        createdInOrganizationAt: checkForUnixDate(accountCreatedAt),
      },
      recordLastActiveAt: true,
    });

  if (!foundOrCreatedAccount) {
    throw new NoAccountError(accountFromArgsId, 'Could not find or create');
  }

  const accountAttrsChanged = await recordAndSetCustomAttributes(
    {
      obj: foundOrCreatedAccount,
      attributes: restAccountAttributes,
      source: DataSource.snippet,
    },
    { logger }
  );

  if (accountAttrsChanged) {
    await foundOrCreatedAccount.reload();
  }

  const accountCacheHit = await isCacheHit(
    organization,
    foundOrCreatedAccount,
    accountChanged || accountAttrsChanged
  );

  const { accountUser: foundOrCreatedAccountUser, accountUserChanged } =
    await findOrCreateAccountUser({
      account: foundOrCreatedAccount,
      accountUserInput: {
        externalId: String(accountUserFromArgsId),
        email: accountUserFromArgsEmail,
        fullName: accountUserFromArgsFullName,
        role: accountUserArgs.role as string,
        createdInOrganizationAt: checkForUnixDate(accountUserCreatedAt),
      },
      organization,
      source: 'identify',
    });

  if (!foundOrCreatedAccountUser) {
    throw new NoAccountUserError(accountFromArgsId, 'Could not find or create');
  }

  const accountUserAttrsChanged = await recordAndSetCustomAttributes(
    {
      obj: foundOrCreatedAccountUser,
      attributes: restAccountUserAttributes,
      source: DataSource.snippet,
    },
    { logger }
  );

  if (accountUserAttrsChanged) {
    await foundOrCreatedAccountUser.reload();
  }

  const accountUserCacheHit = await isCacheHit(
    organization,
    foundOrCreatedAccountUser,
    accountUserChanged || accountUserAttrsChanged
  );

  trackAccountUserAppActivity({
    accountUser: foundOrCreatedAccountUser,
    organizationEntityId: organization.entityId,
  });

  await queueIdentifyChecks({
    behavior: {
      checkAccounts: true,
      checkAccountUsers: true,
      recordAttributes: false,
      accountChanged: accountChanged || accountAttrsChanged,
      accountUserChanged: accountUserChanged || accountUserAttrsChanged,
      emitSocketEvents: false,
    },
    accountEntityId: foundOrCreatedAccount.entityId,
    accountUserEntityId: foundOrCreatedAccountUser.entityId,
    accountAttributes: restAccountAttributes,
    accountUserAttributes: restAccountUserAttributes,
    initId,
  });

  if (accountArgs?.bentoExtension !== EXT_ATTRIBUTE_VALUE) {
    /* If the login is from extension, don't bother running diagnostics */
    detachPromise(async () => {
      await identifyOrganizationHost(
        organization.id,
        hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
      );
      // only run the attribute diagnostics if the account or user is new or
      // some of their attributes changed
      const diagnosticsEnabled = await enableIdentifyDiagnostics.enabled();
      if (
        diagnosticsEnabled &&
        // request comes from the chrome extension
        (chromeExtension ||
          // or the account has changed
          accountChanged ||
          // or the account user has changed
          accountUserChanged ||
          // or account attributes has changed
          !isEqual(
            foundOrCreatedAccount.attributes,
            omit(accountArgs, ['id', 'name', 'createdAt'])
          ) ||
          // or account user attributes has changed
          !isEqual(
            foundOrCreatedAccountUser.attributes,
            omit(accountUserArgs, ['id', 'fullName', 'email', 'createdAt'])
          ))
      ) {
        await runAttributeDiagnostics(
          organization.id,
          accountArgs,
          accountUserArgs
        );
      }
    }, 'identify diagnostics');
  } else {
    logger.info(
      `[identifyAccountUser] Extension user logged in: ${foundOrCreatedAccountUser.email}, account: ${foundOrCreatedAccount.name}`
    );
  }

  return {
    organization,
    organizationSettings: organization.organizationSettings,
    account: foundOrCreatedAccount,
    accountUser: foundOrCreatedAccountUser,
    /** Whether valid cache was found for both account/User */
    cacheHit: accountCacheHit && accountUserCacheHit,
  };
}
