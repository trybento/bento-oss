import { faker } from '@faker-js/faker';

import { AccountUser } from 'src/data/models/AccountUser.model';
import { Account } from 'src/data/models/Account.model';
import { User } from 'src/data/models/User.model';
import { Organization } from 'src/data/models/Organization.model';
import { closeAllRedisConnections } from 'src/utils/redis/getRedisClient';

import { sequelize } from '.';

import {
  upFactory as seederFactory,
  downFactory as cleanupFactory,
} from './db/seeders/20201114022413-initial_org_and_templates';
import { OrganizationSettings } from './models/OrganizationSettings.model';
import { closeSequelize } from './data.helpers';
import { UserOrganization } from './models/UserOrganization.model';
import TimeoutManager from 'src/utils/TimeoutManager';
import { closeBullMQQueues } from 'src/jobsBull/queues';

jest.mock('shared/constants', () => ({
  ...jest.requireActual('shared/constants'),
  BENTO_DOMAIN: faker.internet.domainName(),
}));

jest.mock('src/jobsBull/queues', () => ({
  ...jest.requireActual('src/jobsBull/queues'),
  queueJob: jest.fn(),
}));

const MAX_EXIT_TIMEOUT = 10000;

/** Retry certain suites n times before failing, since some are flaky */
export const MAX_RETRY_TIMES = 3;

/** Close all std hanging processes before ending tests to let Jest exit */
export const closeConnections = async () => {
  TimeoutManager.clearAll();
  await closeSequelize();
  await closeAllRedisConnections();
  await closeBullMQQueues();
};

/** Company names we have seeders for */
export type SupportedSeeds = 'acmeco' | 'bento' | 'paydayio';

type ContextResources = {
  organization: Organization;
  user: User;
  account: Account;
  accountUser: AccountUser;
};

type ContextGetter<T extends () => void> = () => ContextResources &
  ReturnType<T>;

const createdOrgs: Organization[] = [];
const orgCreate = Organization.create.bind(Organization);
// @ts-ignore
Organization.create = jest.fn(async (...args) => {
  // @ts-ignore
  const createdOrg = (await orgCreate(...args)) as Organization;
  createdOrgs.push(createdOrg);
  return createdOrg;
});

export const setupAndSeedDatabaseForTests = (
  companyName: SupportedSeeds,
  additionalContextSeeder: (context?: ContextResources) => {
    [key: string]: any;
  } = () => ({})
): ContextGetter<typeof additionalContextSeeder> => {
  // @ts-ignore
  let context: ContextResources;
  let organization: Organization;

  beforeEach(async () => {
    const seededOrganization = await seederFactory(companyName, true)(
      sequelize.getQueryInterface(),
      sequelize
    );
    const fullName = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const user = await User.create({
      organizationId: seededOrganization.id,
      fullName,
      email: faker.internet.email({
        firstName: 'User',
        lastName: 'One',
        provider: faker.internet.domainName(),
      }),
      sessionsValidFrom: null,
    });

    const [account, fetchedOrganization] = await Promise.all([
      Account.create({
        organizationId: seededOrganization.id,
        name: `${companyName} Account 1`,
        externalId: faker.string.uuid(),
        attributes: {},
      }),
      Organization.findOne({
        where: { id: seededOrganization.id },
        include: [OrganizationSettings],
      }),
      UserOrganization.create({
        userId: user.id,
        organizationId: seededOrganization.id,
        isDefault: false,
      }),
    ]);

    const accountUser = await AccountUser.create({
      accountId: account.id,
      organizationId: seededOrganization.id,
      fullName,
      externalId: faker.string.uuid(),
      attributes: {},
    });

    organization = fetchedOrganization!;

    context = {
      organization,
      user,
      account,
      accountUser,
    };

    const additionalContext = await additionalContextSeeder(context);

    context = { ...context, ...additionalContext };
  });

  afterEach(async () => {
    await cleanupFactory(undefined, organization.slug)(
      sequelize.getQueryInterface(),
      sequelize
    );
  });

  afterAll(async () => {
    for (const org of createdOrgs) {
      await org.destroy();
    }
    await closeConnections();
  }, MAX_EXIT_TIMEOUT);

  return () => context;
};

/**
 * Close connections so we don't hang the test suite
 * Call this if some imports end up loading some server/connection stuff
 * */
export const applyFinalCleanupHook = () => {
  afterAll(async () => {
    await closeConnections();
  }, MAX_EXIT_TIMEOUT);
};

/**
 * We need to run a dummy test when we set up a test suite
 *   but not run anything. because otherwise the hooks
 *   will not trigger.
 */
export const useDummyTest = () => {
  test('dummy test', () => {
    expect(true).toBeTruthy();
  });
};
