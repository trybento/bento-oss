import { queryRunner, sequelize, withTransaction } from 'src/data';
import { clsNamespace } from 'src/utils/cls';
import { setupAndSeedDatabaseForTests } from './datatests';
import { Organization } from './models/Organization.model';

const getContext = setupAndSeedDatabaseForTests('bento', () => ({
  randomExtraContext: { blah: 'woot' },
}));

test('database authenticates', async () => {
  expect(async () => {
    await sequelize.authenticate();
  }).not.toThrow();
});

test('database works', async () => {
  const result = await queryRunner({ sql: 'select 1 as one' });
  expect(result).toStrictEqual([{ one: 1 }]);
});

test('has a seeded Bento organization', async () => {
  const org = await Organization.findOne({
    where: {
      name: 'Bento',
    },
    attributes: ['name'],
  });
  expect(org?.name).toBe('Bento');
});

/* A meaningless test to make sure we can write and rollback */
test('can insert a new organization', async () => {
  const orgName = 'BrokedayIO';
  await Organization.create({
    name: orgName,
    slug: 'brokeday',
    embedCustomCss: '', // TODO: Remove after organization settings cleanup.
  });

  const org = await Organization.findOne({
    where: {
      name: orgName,
    },
  });

  expect(org?.name).toBe(orgName);
});

test('has the random extra context', async () => {
  const { randomExtraContext } = getContext();
  expect(randomExtraContext).toEqual({ blah: 'woot' });
});

test('withTransaction', async () => {
  const outerTrx = clsNamespace.get('transaction');
  expect(outerTrx).toBeUndefined();
  await withTransaction(async (trx) => {
    let innerTrx = clsNamespace.get('transaction');
    expect(trx).not.toBeUndefined();
    expect(trx).toBe(innerTrx);
    try {
      await withTransaction(async (trx2) => {
        const innerTrx2 = clsNamespace.get('transaction');
        expect(trx2).not.toBeUndefined();
        expect(trx2).toBe(trx);
        expect(trx2).toBe(innerTrx2);
        throw new Error('dummy');
      });
    } catch (e) {
      innerTrx = clsNamespace.get('transaction');
      expect(innerTrx).toBe(trx);
    }
  });
});
