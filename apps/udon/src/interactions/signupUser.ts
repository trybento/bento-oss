import { addDays } from 'date-fns';

import { TRIAL_PERIOD_IN_DAYS } from 'src/utils/constants';
import { UserStatus } from 'src/data/models/types';
import { setUserPassword } from 'src/interactions/setUserPassword';
import { AuthType } from 'src/data/models/types';
import { BENTO_DOMAIN } from 'shared/constants';
import { Organization } from 'src/data/models/Organization.model';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import { User } from 'src/data/models/User.model';
import UserAuth from 'src/data/models/UserAuth.model';
import { UserOrganization } from 'src/data/models/UserOrganization.model';
import { logger } from 'src/utils/logger';
import { identifyCreatedUserAsBentoAccountUser } from './identifyCreatedUserAsBentoAccountUser';
import { withTransaction } from 'src/data';
import InvalidSignupError from 'src/errors/InvalidSignupError';
import NoOrganizationError from 'src/errors/NoOrganizationError';
import UserDeniedError from 'src/errors/UserDeniedError';
import { slugify } from 'src/utils/helpers';
import { OrgState, Theme } from 'bento-common/types';
import { isNil } from 'bento-common/utils/lodash';
import { isEmailOnDenyList } from 'src/middlewares/passport/utils';
import OrganizationAlreadyExistsError from 'src/errors/OrganizationAlreadyExistsError';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import detachPromise from 'src/utils/detachPromise';
import { forceGoogleSSO } from 'src/utils/features';
import SSORequiredError from 'src/errors/SSORequiredError';

export type SignupUserData = {
  orgName: string;
  email: string;
  domain: string;
  fullName: string;
  authType: AuthType;
  authKey: string;
  isSignup?: boolean;
};

const defaultUserStatusMap = {
  [AuthType.email]: UserStatus.unverified,
  [AuthType.google]: UserStatus.active,
};

export async function createUserAuth(
  authType: AuthType,
  key: string,
  userId: number
) {
  switch (authType) {
    case AuthType.email: {
      await setUserPassword({
        userId,
        password: key,
      });
      break;
    }
    default: {
      await UserAuth.upsert({ key, userId, type: authType });
      break;
    }
  }
}

async function getUniqueOrgSlug(baseSlug: string) {
  let existingOrgWithSlug: Organization | null = null;
  let slug = baseSlug;
  for (let i = 0; existingOrgWithSlug != null && i < 100; i++) {
    existingOrgWithSlug = await Organization.findOne({
      where: { slug },
    });
    if (existingOrgWithSlug) {
      slug = baseSlug + i;
    }
  }
  return slug;
}

const signupUser = ({
  orgName,
  email,
  domain,
  fullName,
  authType,
  authKey,
  isSignup,
}: SignupUserData) =>
  withTransaction(async () => {
    if (await isEmailOnDenyList(email)) {
      throw new UserDeniedError();
    }

    let organization = await Organization.findOne({
      where: {
        domain,
      },
    });

    if (!organization) {
      if (isSignup) {
        if (domain === 'gmail.com') {
          if (['production', 'test'].includes(process.env.NODE_ENV!)) {
            throw new InvalidSignupError('gmail');
          } else {
            domain += `-${orgName}`;
          }
        }

        const slug = await getUniqueOrgSlug(slugify(orgName));

        const now = new Date();

        organization = await Organization.create({
          name: orgName,
          slug,
          domain,
          state: OrgState.Trial,
          trialStartedAt: now,
          trialEndedAt: addDays(now, TRIAL_PERIOD_IN_DAYS),
        });

        await OrganizationSettings.update(
          { fallbackCommentsEmail: email, theme: Theme.flat },
          { where: { organizationId: organization.id } }
        );

        /**
         * Run the setup after the current transaction, otherwise
         * the organization might not yet exist in the database
         * when the job runs.
         */
        detachPromise(() =>
          queueJob({
            jobType: JobType.SetupNewOrg,
            orgId: organization!.id,
          })
        );
      } else {
        logger.info(`Unknown domain [${authType}]: ${domain}`);
        throw new NoOrganizationError();
      }
    } else if (authType === AuthType.email) {
      if (await forceGoogleSSO.enabled(organization)) {
        throw new SSORequiredError();
      }

      throw new OrganizationAlreadyExistsError(organization.id);
    }

    const [user, isNewUser] = await User.findOrCreate({
      where: {
        organizationId: organization.id,
        email,
      },
      defaults: {
        email,
        fullName,
        organizationId: organization.id,
        status: defaultUserStatusMap[authType],
        sessionsValidFrom: new Date(),
      },
    });

    await createUserAuth(authType, authKey, user.id);

    if (isNil(organization.ownedByUserId))
      // Set new User as Org owner
      await organization.update({ owned_by_user_id: user.id });

    if (isNewUser) {
      await UserOrganization.create({
        userId: user.id,
        organizationId: organization.id,
        isSuperadmin: domain === BENTO_DOMAIN,
        isDefault: true,
      });

      await identifyCreatedUserAsBentoAccountUser({
        user: user,
        organization,
      });
    }

    return user;
  });

export default signupUser;
