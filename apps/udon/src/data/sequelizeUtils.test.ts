import testUtils from 'src/testUtils/test.util';
import { setupAndSeedDatabaseForTests } from './datatests';

import { Account } from './models/Account.model';
import { AccountUser } from './models/AccountUser.model';
import { sequelizeBulkUpsert } from './sequelizeUtils';

const getContext = setupAndSeedDatabaseForTests('bento');

describe('sequelizeUtils.bulkUpsert', () => {
  test('can create if new', async () => {
    const { account, organization } = getContext();

    const data = testUtils.fake.accountUser(organization, account);

    const upsert = await sequelizeBulkUpsert(AccountUser, [data], {
      upsertOpts: {
        returning: true,
      },
    });

    expect(upsert.length).toBeGreaterThan(0);

    const newUser = await AccountUser.findOne({
      where: {
        externalId: data.externalId,
      },
    });

    expect(newUser).toBeTruthy();
  });

  test('returns data when created', async () => {
    const { account, organization } = getContext();

    const data = testUtils.fake.accountUser(organization, account);

    const upsert = await sequelizeBulkUpsert(AccountUser, [data], {
      upsertOpts: {
        returning: true,
      },
    });

    expect(upsert.length).toBeGreaterThan(0);

    const created = upsert[0];

    expect(created.externalId).toEqual(data.externalId);
  });

  test('upsert works in bulk', async () => {
    const { account, organization } = getContext();

    const appendStr = '(test)';

    const users = await testUtils.users.accountUsers(organization, account, 5);

    const namesByEntityId = users.reduce<Record<string, string>>((a, u) => {
      a[u.entityId] = u.fullName ?? '';
      return a;
    }, {});

    const upsertData = users.map((u) => ({
      ...u.toJSON(),
      fullName: `${u.fullName} ${appendStr}`,
    }));

    const updated = await sequelizeBulkUpsert(AccountUser, upsertData, {
      upsertOpts: {
        returning: true,
        conflictFields: ['entityId'],
      },
    });

    updated.forEach((updatedUser) => {
      const originalName = namesByEntityId[updatedUser.entityId];

      expect(originalName).toBeTruthy();
      expect(originalName).not.toEqual(updatedUser.fullName);
      expect(updatedUser.fullName!.includes(appendStr)).toBeTruthy();
      expect(updatedUser.fullName!.includes(originalName)).toBeTruthy();
    });
  });

  test('fires error hook and continues', async () => {
    let errors = 0;

    const { account } = getContext();

    const empty: number[] = testUtils.tools.arrayOfRandomLength(4, 6);

    const upsertData = empty.map((_) => ({
      ...account.dataValues,
      attributes: null,
    }));

    await sequelizeBulkUpsert(Account, upsertData, {
      ignoreErrors: true,
      onError: (_, _d) => {
        errors++;
      },
    });

    expect(errors).toEqual(empty.length);
  });
});
