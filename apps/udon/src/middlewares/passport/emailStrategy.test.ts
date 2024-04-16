import { faker } from '@faker-js/faker';
import { $enum } from 'ts-enum-util';
import { without } from 'lodash';
import { getMockReq } from '@jest-mock/express';
import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { AuthType, UserStatus } from 'src/data/models/types';
import { createUserAuth } from 'src/interactions/signupUser';
import { emailStrategyCallback } from './emailStrategy';
import InvalidLoginError from 'src/errors/InvalidLoginError';
import InactiveUserError from 'src/errors/InactiveUserError';
import {
  AuthAudit,
  AuthAuditEvent,
  AuthAuditEventOutcome,
} from 'src/data/models/Audit/AuthAudit.model';
import { UserDenyList } from 'src/data/models/UserDenyList.model';

const mockedRequest = getMockReq({
  id: 'eb173de9-cc72-4eb8-b98e-e1b8c02829ce',
  ip: '127.0.0.1',
});

describe('Email authentication strategy', () => {
  const getContext = setupAndSeedDatabaseForTests('bento');

  beforeEach(async () => {
    await Promise.all([
      UserDenyList.create(
        { text: 'domain-blocked.com' },
        { ignoreDuplicates: true }
      ),
      UserDenyList.create(
        { text: 'person@email-blocked.com' },
        { ignoreDuplicates: true }
      ),
    ]);
  });

  afterEach(async () => {
    await UserDenyList.truncate();
  });

  test('valid user is allow in', async () => {
    const { user } = getContext();
    const done = jest.fn();
    await createUserAuth(AuthType.email, 'password', user.id);
    await emailStrategyCallback(mockedRequest, user.email, 'password', done);
    expect(done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ id: user.id })
    );
  });

  test('invalid password is not allowed', async () => {
    const { user } = getContext();
    const done = jest.fn();
    await createUserAuth(AuthType.email, 'password', user.id);
    await emailStrategyCallback(mockedRequest, user.email, 'notpassword', done);
    expect(done).toHaveBeenCalledWith(new InvalidLoginError(), false);
  });

  test('invalid email is not allowed', async () => {
    const done = jest.fn();
    await emailStrategyCallback(
      mockedRequest,
      faker.internet.email(),
      'notpassword',
      done
    );
    expect(done).toHaveBeenCalledWith(new InvalidLoginError(), false);
  });

  test('user with no email auth is not allowed', async () => {
    const { user } = getContext();
    const done = jest.fn();
    await emailStrategyCallback(mockedRequest, user.email, 'password', done);
    expect(done).toHaveBeenCalledWith(new InvalidLoginError(), false);
  });

  test.each(without($enum(UserStatus).getValues(), UserStatus.active))(
    'inactive user is not allowed',
    async (status) => {
      const { user } = getContext();
      const done = jest.fn();
      await user.update({ status });
      await emailStrategyCallback(mockedRequest, user.email, 'password', done);
      expect(done).toHaveBeenCalledWith(new InactiveUserError(), false);
    }
  );

  test('Deny-list: should block login based on domain', async () => {
    const done = jest.fn();
    const email = 'person@domain-blocked.com';

    await emailStrategyCallback(mockedRequest, email, 'password', done);

    expect(done).toHaveBeenCalledWith(
      new InvalidLoginError('Your company is not yet set up to use Bento'),
      false
    );

    const auditEvent = await AuthAudit.findOne({
      where: {
        eventName: AuthAuditEvent.logIn,
        outcome: AuthAuditEventOutcome.failure,
        payload: { email },
      },
      order: [['id', 'DESC']],
    });

    expect(auditEvent).not.toBeNull();
    expect(auditEvent).toHaveProperty('meta.denied', true);
  });

  test('Deny-list: should block login based on email address', async () => {
    const done = jest.fn();
    const email = 'person@email-blocked.com';

    await emailStrategyCallback(mockedRequest, email, 'password', done);

    expect(done).toHaveBeenCalledWith(
      new InvalidLoginError('Your company is not yet set up to use Bento'),
      false
    );

    const auditEvent = await AuthAudit.findOne({
      where: {
        eventName: AuthAuditEvent.logIn,
        outcome: AuthAuditEventOutcome.failure,
        payload: { email },
      },
      order: [['id', 'DESC']],
    });

    expect(auditEvent).not.toBeNull();
    expect(auditEvent).toHaveProperty('meta.denied', true);
  });
});
