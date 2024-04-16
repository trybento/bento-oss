import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { strategyCallback, JwtPayload } from './jwtStrategy';
import { getUnixTime, subMinutes } from 'date-fns';
import InvalidLoginError from 'src/errors/InvalidLoginError';
import { User } from 'src/data/models/User.model';
import { Organization } from 'src/data/models/Organization.model';
import { setUserPassword } from 'src/interactions/setUserPassword';

const getContext = setupAndSeedDatabaseForTests('bento');

describe('JWT authentication strategy', () => {
  test('should reject if JWT token was created before session cutoff', async () => {
    const { organization, user } = getContext();

    await user.update({ sessionsValidFrom: new Date() });

    const jwtPayload: JwtPayload = {
      organizationEntityId: organization.entityId,
      userEntityId: user.entityId,
      iat: getUnixTime(subMinutes(new Date(), 5)),
    };

    const done = jest.fn();

    await strategyCallback(jwtPayload, done);

    const [call] = done.mock.calls;

    expect(call).toBeDefined();
    expect(call[0]).toBeInstanceOf(InvalidLoginError);
    expect(call[0]).toHaveProperty('message', 'Re-authentication required');
    expect(call[1]).toBe(false);
  });

  test('should pass if JWT was created after session cutoff', async () => {
    const { organization, user } = getContext();

    await user.update({ sessionsValidFrom: subMinutes(new Date(), 5) });

    const jwtPayload: JwtPayload = {
      organizationEntityId: organization.entityId,
      userEntityId: user.entityId,
      iat: getUnixTime(new Date()),
    };

    const done = jest.fn();

    await strategyCallback(jwtPayload, done);

    const [call] = done.mock.calls;

    expect(call).toBeDefined();
    expect(call[0]).toBe(null);
    expect(call[1]).toHaveProperty('user');
    expect(call[1]).toHaveProperty('organization');

    const { user: callbackUser, organization: callbackOrganization } = call[1];

    expect(callbackUser).toBeInstanceOf(User);
    expect(callbackUser).toHaveProperty('entityId', user.entityId);
    expect(callbackOrganization).toBeInstanceOf(Organization);
    expect(callbackOrganization).toHaveProperty(
      'entityId',
      organization.entityId
    );
  });

  test('should pass if no session cutoff is set', async () => {
    const { organization, user } = getContext();

    await user.update({ sessionsValidFrom: null });

    const jwtPayload: JwtPayload = {
      organizationEntityId: organization.entityId,
      userEntityId: user.entityId,
      iat: getUnixTime(new Date()),
    };

    const done = jest.fn();

    await strategyCallback(jwtPayload, done);

    const [call] = done.mock.calls;

    expect(call).toBeDefined();
    expect(call[0]).toBe(null);
    expect(call[1]).toHaveProperty('user');
    expect(call[1]).toHaveProperty('organization');

    const { user: callbackUser, organization: callbackOrganization } = call[1];

    expect(callbackUser).toBeInstanceOf(User);
    expect(callbackUser).toHaveProperty('entityId', user.entityId);
    expect(callbackOrganization).toBeInstanceOf(Organization);
    expect(callbackOrganization).toHaveProperty(
      'entityId',
      organization.entityId
    );
  });

  test('should block existing tokens after password reset', async () => {
    const { organization, user } = getContext();

    const jwtPayload: JwtPayload = {
      organizationEntityId: organization.entityId,
      userEntityId: user.entityId,
      iat: getUnixTime(new Date()),
    };

    const done = jest.fn();

    await strategyCallback(jwtPayload, done);
    await setUserPassword({ userId: user.id, password: 'newPassword' });
    await strategyCallback(jwtPayload, done);

    const before = done.mock.calls[0];

    expect(before).toBeDefined();
    expect(before[0]).toBe(null);
    expect(before[1]).toHaveProperty('user');
    expect(before[1]).toHaveProperty('organization');

    const after = done.mock.calls[1];

    expect(after).toBeDefined();
    expect(after[0]).toBeInstanceOf(Error);
    expect(after[0]).toHaveProperty('message', 'Re-authentication required');
    expect(after[1]).toBe(false);
  });
});
