import { faker } from '@faker-js/faker';
import { $enum } from 'ts-enum-util';

import {
  MAX_RETRY_TIMES,
  setupAndSeedDatabaseForTests,
} from 'src/data/datatests';
import UserAuth from 'src/data/models/UserAuth.model';
import { AuthType } from 'src/data/models/types';
import signupUser, { createUserAuth } from './signupUser';
import { Organization } from 'src/data/models/Organization.model';
import { User } from 'src/data/models/User.model';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import { UserOrganization } from 'src/data/models/UserOrganization.model';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { slugify } from 'src/utils/helpers';
import InvalidSignupError from 'src/errors/InvalidSignupError';
import { BENTO_DOMAIN } from 'shared/constants';
import NoOrganizationError from 'src/errors/NoOrganizationError';
import OrganizationAlreadyExistsError from 'src/errors/OrganizationAlreadyExistsError';
import SSORequiredError from 'src/errors/SSORequiredError';

let forceGoogleSSO = false;

jest.mock('src/utils/features', () => ({
  ...jest.requireActual('src/utils/features'),
  forceGoogleSSO: {
    enabled: jest.fn(() => forceGoogleSSO),
  },
}));

const getContext = setupAndSeedDatabaseForTests('bento');

jest.retryTimes(MAX_RETRY_TIMES);

const passwordExpectation = expect.stringMatching(/^\$/i);

describe('createUserAuth', () => {
  test.each([
    [AuthType.google, 'google_oauth_key', 'google_oauth_key'],
    [AuthType.email, 'password', passwordExpectation],
  ])(
    'creates a %s auth for the user',
    async (authType, key, expectedAuthKey) => {
      const { user } = getContext();
      await createUserAuth(authType, key, user.id);
      const userAuth = await UserAuth.findOne({
        where: { userId: user.id, type: authType },
      });
      expect(userAuth).toMatchObject({
        key: expectedAuthKey,
        userId: user.id,
        type: authType,
      });
    }
  );
});

function getDummySignupData(forcedDomain?: string) {
  const domain = forcedDomain || faker.internet.domainName();
  const name = ['dummy', 'User'];
  return {
    orgName: faker.company.name(),
    email: faker.internet.email({
      firstName: name[0],
      lastName: name[1],
      provider: domain,
    }),
    domain: domain,
    fullName: name.join(' '),
    authKey: faker.string.uuid(),
    isSignup: true,
  };
}

describe('signupUser', () => {
  const emailSignupData = getDummySignupData();
  const googleSignupData = getDummySignupData();

  beforeEach(() => {
    forceGoogleSSO = false;
    jest.restoreAllMocks();
  });

  test.each([
    [AuthType.email, emailSignupData, passwordExpectation],
    [AuthType.google, googleSignupData, googleSignupData.authKey],
  ])('%s happy path', async (authType, signupData, expectedAuthKey) => {
    const { organization: bentoOrg } = getContext();
    const user = await signupUser({ ...signupData, authType });
    const newOrg = await Organization.findOne({
      where: { id: user.organizationId },
    });
    expect(newOrg).toMatchObject({
      name: signupData.orgName,
      slug: slugify(signupData.orgName),
    });

    const orgSettings = await OrganizationSettings.findOne({
      where: { organizationId: newOrg!.id },
    });

    if (orgSettings) {
      expect(orgSettings.fallbackCommentsEmail).toEqual(signupData.email);
    }

    const orgUsers = await User.findAll({
      where: { organizationId: newOrg!.id },
    });
    expect(orgUsers).toHaveLength(1);
    const [orgUser] = orgUsers;
    expect(orgUser.id).toBe(user.id);

    const userAuth = await UserAuth.findOne({
      where: { userId: user.id, type: authType },
    });
    expect(userAuth).toMatchObject({ key: expectedAuthKey });

    const userOrg = await UserOrganization.findOne({
      where: { userId: user.id, organizationId: newOrg!.id },
    });
    expect(userOrg).toMatchObject({ isDefault: true });

    const account = await Account.findOne({
      where: { externalId: newOrg!.entityId, organizationId: bentoOrg.id },
    });
    expect(account).toMatchObject({ name: signupData.orgName });

    const accountUser = await AccountUser.findOne({
      where: { accountId: account!.id, externalId: user.entityId },
    });
    expect(accountUser).toMatchObject({
      fullName: user.fullName,
      email: user.email,
      internal: false,
    });
  });

  test.each($enum(AuthType).getValues())(
    'fails for gmail',
    async (authType) => {
      const signupData = getDummySignupData('gmail.com');
      await expect(signupUser({ ...signupData, authType })).rejects.toThrow(
        InvalidSignupError
      );
    }
  );

  test('fails for email signup when org exists', async () => {
    const signupData = getDummySignupData(BENTO_DOMAIN);
    await expect(
      signupUser({ ...signupData, authType: AuthType.email })
    ).rejects.toThrow(OrganizationAlreadyExistsError);
  });

  test('fails to create user when org does not exist', async () => {
    const signupData = getDummySignupData();
    await expect(
      signupUser({ ...signupData, authType: AuthType.email, isSignup: false })
    ).rejects.toThrow(NoOrganizationError);
  });

  test('fails for email when SSO is forced', async () => {
    forceGoogleSSO = true;

    const signupData = getDummySignupData('trybento.co');

    await expect(
      signupUser({ ...signupData, authType: AuthType.email, isSignup: true })
    ).rejects.toThrow(SSORequiredError);
  });
});
