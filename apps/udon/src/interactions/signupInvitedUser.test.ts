import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { UserStatus } from 'src/data/models/types';
import signupInvitedUser from './signupInvitedUser';
import { faker } from '@faker-js/faker';
import InvalidSignupError from 'src/errors/InvalidSignupError';
import SSORequiredError from 'src/errors/SSORequiredError';

let forceGoogleSSO = false;

jest.mock('src/utils/features', () => ({
  ...jest.requireActual('src/utils/features'),
  forceGoogleSSO: {
    enabled: jest.fn(() => forceGoogleSSO),
  },
}));

const getContext = setupAndSeedDatabaseForTests('bento');

describe('signupInvitedUser', () => {
  beforeEach(() => {
    forceGoogleSSO = false;
    jest.restoreAllMocks();
  });

  test(`fails if the user status is not '${UserStatus.invited}'`, async () => {
    const { user } = getContext();

    await user.update({ status: UserStatus.active });

    await expect(
      signupInvitedUser({
        userEntityId: user.entityId,
        fullName: 'dummy User',
        authKey: faker.string.uuid(),
      })
    ).rejects.toThrow(InvalidSignupError);
  });

  test('fails if SSO is enforced', async () => {
    forceGoogleSSO = true;

    const { user } = getContext();

    await user.update({ status: UserStatus.invited });

    await expect(
      signupInvitedUser({
        userEntityId: user.entityId,
        fullName: 'dummy User',
        authKey: faker.string.uuid(),
      })
    ).rejects.toThrow(SSORequiredError);
  });
});
