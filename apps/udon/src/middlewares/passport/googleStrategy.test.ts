import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { Profile } from 'passport-google-oauth20';
import { cloneDeep, pick } from 'lodash';
import { BASE_CLIENT_URL, SIGNUP_URL, JWT_SECRET } from 'src/shared/constants';
import { faker } from '@faker-js/faker';
import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { strategyCallback } from './googleStrategy';
import { Organization } from 'src/data/models/Organization.model';
import {
  AuthAudit,
  AuthAuditEvent,
  AuthAuditEventOutcome,
} from 'src/data/models/Audit/AuthAudit.model';
import { UserDenyList } from 'src/data/models/UserDenyList.model';
import { User } from 'src/data/models/User.model';

const mockGoogleProfile: Profile = {
  profileUrl: 'profileUrl',
  _raw: '',
  _json: {
    hd: 'domain',
    email: 'email address',
    iss: '',
    aud: '',
    sub: '',
    iat: 1,
    exp: 1,
  },
  provider: 'google',
  id: 'userId',
  displayName: 'Dummy User',
  emails: [{ value: 'email address', verified: 'true' }],
  photos: [{ value: 'http://something.com/avatar.jpg' }],
};

function getDummyProfile(params?: {
  forcedDomain?: string;
  forcedUsername?: string;
  setHostedDomain?: boolean;
}) {
  const profile = cloneDeep(mockGoogleProfile);
  const domain =
    params?.forcedDomain !== undefined
      ? params?.forcedDomain
      : faker.internet.domainName();
  const email = params?.forcedUsername
    ? `${params.forcedUsername}@${domain}`
    : faker.internet.email({
        firstName: 'dummy',
        lastName: 'user',
        provider: domain,
      });

  profile._json.email = email;
  profile._json.hd = params?.setHostedDomain === false ? undefined : domain;
  profile.emails![0].value = email;
  profile.id = faker.string.uuid();

  return profile;
}

describe('Google authentication strategy', () => {
  setupAndSeedDatabaseForTests('bento');

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

  test('login: no org', async () => {
    const state = jwt.sign({}, JWT_SECRET, { noTimestamp: true });
    const done = jest.fn();
    const redirect = jest.fn();
    await strategyCallback(
      {
        res: { redirect } as unknown as Response,
        next: () => {},
        query: { state },
      } as unknown as Request,
      '',
      '',
      getDummyProfile(),
      done
    );

    expect(redirect).toHaveBeenCalledWith(
      `${BASE_CLIENT_URL}/login/error/no-organization`
    );

    expect(done).not.toHaveBeenCalled();
  });

  test('signup: happy path', async () => {
    const state = jwt.sign({ isSignup: true }, JWT_SECRET, {
      noTimestamp: true,
    });
    const done = jest.fn();
    const profile = getDummyProfile();
    await strategyCallback(
      {
        res: {} as unknown as Response,
        next: () => {},
        query: { state },
      } as unknown as Request,
      '',
      '',
      profile,
      done
    );

    expect(done).toHaveBeenCalledWith(
      null,
      expect.objectContaining(pick(profile, ['fullName', 'email']))
    );
  });

  test('signup: gmail', async () => {
    const state = jwt.sign({ isSignup: true }, JWT_SECRET, {
      noTimestamp: true,
    });
    const done = jest.fn();
    const redirect = jest.fn();
    await strategyCallback(
      {
        res: { redirect } as unknown as Response,
        next: () => {},
        query: { state },
      } as unknown as Request,
      '',
      '',
      getDummyProfile({ forcedDomain: 'gmail.com' }),
      done
    );

    expect(redirect).toHaveBeenCalledWith(`${SIGNUP_URL}?isInvalid=true`);
    expect(done).not.toHaveBeenCalled();
  });

  test('Should fall back to the email domain if no hosted domain exists', async () => {
    const state = jwt.sign({ isSignup: true }, JWT_SECRET, {
      noTimestamp: true,
    });

    const done = jest.fn();
    const redirect = jest.fn();
    const domain = faker.internet.domainName();

    const profile = getDummyProfile({
      forcedDomain: domain,
      setHostedDomain: false,
    });

    await strategyCallback(
      {
        res: { redirect } as unknown as Response,
        next: () => {},
        query: { state },
      } as unknown as Request,
      '',
      '',
      profile,
      done
    );

    expect(redirect).not.toHaveBeenCalled();
    expect(done).toHaveBeenCalledWith(
      null,
      expect.objectContaining(pick(profile, ['fullName', 'email']))
    );

    const [email] = profile.emails || [];

    expect(email).not.toBeUndefined();

    const user = await User.findOne({
      where: { email: email.value },
      include: {
        model: Organization,
        required: true,
      },
    });

    expect(user).not.toBeNull();

    const organization = user?.organization;

    expect(organization?.domain).toBe(domain);
  });

  test('Deny-list: should block login based on domain', async () => {
    const state = jwt.sign({}, JWT_SECRET, { noTimestamp: true });

    const done = jest.fn();
    const redirect = jest.fn();

    const profile = getDummyProfile({ forcedDomain: 'domain-blocked.com' });

    await strategyCallback(
      {
        res: { redirect } as unknown as Response,
        next: () => {},
        query: { state },
      } as unknown as Request,
      '',
      '',
      profile,
      done
    );

    expect(redirect).toHaveBeenCalledWith(
      `${BASE_CLIENT_URL}/login/error/no-organization`
    );

    expect(done).not.toHaveBeenCalled();

    const auditEvent = await AuthAudit.findOne({
      where: {
        eventName: AuthAuditEvent.logIn,
        outcome: AuthAuditEventOutcome.failure,
        payload: {
          email: profile.emails![0].value,
        },
      },
      order: [['id', 'DESC']],
    });

    expect(auditEvent).not.toBeNull();
    expect(auditEvent).toHaveProperty('meta.denied', true);
  });

  test('Deny-list: should block login based on email address', async () => {
    const state = jwt.sign({}, JWT_SECRET, { noTimestamp: true });

    const done = jest.fn();
    const redirect = jest.fn();

    const profile = getDummyProfile({
      forcedUsername: 'person',
      forcedDomain: 'email-blocked.com',
    });

    await strategyCallback(
      {
        res: { redirect } as unknown as Response,
        next: () => {},
        query: { state },
      } as unknown as Request,
      '',
      '',
      profile,
      done
    );

    expect(redirect).toHaveBeenCalledWith(
      `${BASE_CLIENT_URL}/login/error/no-organization`
    );

    expect(done).not.toHaveBeenCalled();

    const auditEvent = await AuthAudit.findOne({
      where: {
        eventName: AuthAuditEvent.logIn,
        outcome: AuthAuditEventOutcome.failure,
        payload: {
          email: profile.emails![0].value,
        },
      },
      order: [['id', 'DESC']],
    });

    expect(auditEvent).not.toBeNull();
    expect(auditEvent).toHaveProperty('meta.denied', true);
  });

  test('Deny-list: should block sign-up based on domain', async () => {
    const state = jwt.sign({ isSignup: true }, JWT_SECRET, {
      noTimestamp: true,
    });

    const done = jest.fn();
    const redirect = jest.fn();

    const profile = getDummyProfile({ forcedDomain: 'domain-blocked.com' });

    await strategyCallback(
      {
        res: { redirect } as unknown as Response,
        next: () => {},
        query: { state },
      } as unknown as Request,
      '',
      '',
      profile,
      done
    );

    expect(redirect).toHaveBeenCalledWith(
      `${BASE_CLIENT_URL}/login/error/no-organization`
    );

    expect(done).not.toHaveBeenCalled();

    const auditEvent = await AuthAudit.findOne({
      where: {
        eventName: AuthAuditEvent.logIn,
        outcome: AuthAuditEventOutcome.failure,
        payload: {
          email: profile.emails![0].value,
        },
      },
      order: [['id', 'DESC']],
    });

    expect(auditEvent).not.toBeNull();
    expect(auditEvent).toHaveProperty('meta.denied', true);
  });

  test('Deny-list: should block sign-up based on email address', async () => {
    const state = jwt.sign({ isSignup: true }, JWT_SECRET, {
      noTimestamp: true,
    });

    const done = jest.fn();
    const redirect = jest.fn();

    const profile = getDummyProfile({
      forcedUsername: 'person',
      forcedDomain: 'email-blocked.com',
    });

    await strategyCallback(
      {
        res: { redirect } as unknown as Response,
        next: () => {},
        query: { state },
      } as unknown as Request,
      '',
      '',
      profile,
      done
    );

    expect(redirect).toHaveBeenCalledWith(
      `${BASE_CLIENT_URL}/login/error/no-organization`
    );

    expect(done).not.toHaveBeenCalled();

    const auditEvent = await AuthAudit.findOne({
      where: {
        eventName: AuthAuditEvent.logIn,
        outcome: AuthAuditEventOutcome.failure,
        payload: {
          email: profile.emails![0].value,
        },
      },
      order: [['id', 'DESC']],
    });

    expect(auditEvent).not.toBeNull();
    expect(auditEvent).toHaveProperty('meta.denied', true);
  });
});
