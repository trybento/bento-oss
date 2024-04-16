import request from 'supertest';
import { faker } from '@faker-js/faker';
import server from 'src/server';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

const getContext = setupAndSeedDatabaseForTests('bento');

const getIdentifyPayload = (
  appId: string,
  account?: Record<string, any>,
  accountUser?: Record<string, any>
) => {
  return {
    appId,
    account: {
      id: faker.string.uuid(),
      name: faker.company.buzzPhrase(),
      createdAt: faker.date.recent(),
      alpha: faker.string.alpha(),
      numeric: faker.string.numeric(),
      alphaNumeric: faker.string.alphanumeric(),
      ...account,
    },
    accountUser: {
      id: faker.string.uuid(),
      alpha: faker.string.alpha(),
      numeric: faker.string.numeric(),
      alphaNumeric: faker.string.alphanumeric(),
      ...accountUser,
    },
  };
};

jest.mock('src/jobsBull/queues', () => ({
  ...jest.requireActual('src/jobsBull/queues'),
  queueJob: jest.fn(),
}));

jest.mock('src/utils/internalFeatures/internalFeatures', () => ({
  ...jest.requireActual('src/utils/internalFeatures/internalFeatures'),
  enableIdentifyValidation: {
    enabled: jest.fn(() => true),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /embed/identify', () => {
  test('return the token if successful', async () => {
    const { organization } = getContext();
    const appId = organization.entityId;
    const payload = getIdentifyPayload(appId);
    const response = await request(server)
      .post('/embed/identify')
      .send(payload);
    const accountCreated = await Account.findOne({
      where: { externalId: payload.account.id },
    });
    const accountUserCreated = await AccountUser.findOne({
      where: { externalId: payload.accountUser.id },
    });

    expect(response.status).toBe(200);
    expect(response.body?.token).toMatch(JWT_REGEX);
    expect(accountCreated).not.toBeUndefined();
    expect(accountUserCreated).not.toBeUndefined();
    expect(queueJob).toHaveBeenCalledWith(
      expect.objectContaining({ jobType: JobType.HandleIdentifyChecks })
    );
  });

  test('return errors if fails because of validation', async () => {
    const { organization } = getContext();
    const appId = organization.entityId;
    const payload = getIdentifyPayload(appId, {
      foo: { foobar: 'foo' },
    });
    const response = await request(server)
      .post('/embed/identify')
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body?.errors).toEqual([
      expect.objectContaining({
        key: 'foo',
        message: expect.stringContaining(
          'At path: account.foo -- Expected the value to satisfy a union of'
        ),
        path: ['account', 'foo'],
      }),
    ]);
    expect(queueJob).not.toHaveBeenCalled();
  });
});
