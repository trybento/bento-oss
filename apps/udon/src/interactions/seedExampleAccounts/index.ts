import fs from 'fs';
import promises from 'src/utils/promises';
import YAML from 'yaml';

import { logger } from 'src/utils/logger';

import { withTransaction } from 'src/data';
import { Template } from 'src/data/models/Template.model';
import { Module } from 'src/data/models/Module.model';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';

type AccountFromYAML = {
  name: string;
  externalId: string;
  accountUsers: {
    fullName: string;
    externalId: string;
    email: string;
  }[];
  guide:
    | {
        completionPercentage: number;
      }
    | undefined;
};

const SCRIPT_NAMESPACE = `[SEED EXAMPLE ACCOUNTS]`;
const EXAMPLE_ACCOUNTS_PATH =
  'src/interactions/seedExampleAccounts/exampleAccounts.yml';

const TEST_ACCOUNT_USERS = [
  {
    fullName: 'Rae Niya',
  },
  {
    fullName: 'Andi Chen',
  },
];

export default async function seedExampleAccounts({ organization }) {
  logger.info(
    `${SCRIPT_NAMESPACE} Seeding demo accounts from CSV: ${EXAMPLE_ACCOUNTS_PATH}`
  );

  const accountsFromYAML = YAML.parse(
    fs.readFileSync(EXAMPLE_ACCOUNTS_PATH, 'utf8')
  );
  const now = new Date();

  const template = await Template.findOne({
    where: {
      organizationId: organization.id,
    },
    include: [Module],
  });

  if (!template) {
    throw new Error(`${SCRIPT_NAMESPACE} [ERROR] No template found.`);
  }

  const accounts = await withTransaction(async () => {
    const demoAccounts = await promises.mapSeries(
      accountsFromYAML.accounts,
      async (account) => {
        const {
          name,
          externalId,
          accountUsers: accountUsersFromYAML = [],
        } = account as AccountFromYAML;

        const createdAccount = await Account.create({
          name,
          organizationId: organization.id,
          createdAt: now,
          externalId,
        });

        await promises.mapSeries(accountUsersFromYAML, (accountUser) =>
          AccountUser.create({
            fullName: accountUser.fullName,
            email: accountUser.email,
            externalId: accountUser.externalId,
            accountId: createdAccount.id,
            organizationId: organization.id,
          })
        );

        return createdAccount;
      }
    );

    const testAccounts = await promises.map([1, 2], async (num, idx) => {
      const [testAccount] = await Account.findOrCreate({
        where: {
          organizationId: organization.id,
          externalId: `${organization.slug}_test_acct_${num}`,
        },
        defaults: {
          organizationId: organization.id,
          externalId: `${organization.slug}_test_acct_${num}`,
          name: `Test Account ${num}`,
          createdInOrganizationAt: new Date(),
        },
      });

      const testAccountInfo = TEST_ACCOUNT_USERS[idx];
      await AccountUser.findOrCreate({
        where: {
          externalId: `${organization.slug}_test_acct_usr_${num}`,
          organizationId: organization.id,
          accountId: testAccount.id,
        },
        defaults: {
          fullName: testAccountInfo.fullName,
          organizationId: organization.id,
          externalId: `${organization.slug}_test_acct_usr_${num}`,
          accountId: testAccount.id,
        },
      });
    });

    return [...demoAccounts, ...testAccounts];
  });

  return accounts;
}
