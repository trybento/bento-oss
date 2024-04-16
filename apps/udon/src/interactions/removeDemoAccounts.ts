import promises from 'src/utils/promises';

import { logger } from 'src/utils/logger';

import { withTransaction } from 'src/data';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Organization } from 'src/data/models/Organization.model';

const DEMO_ACCOUNT_SLUGS = [
  'carbon14',
  'fastdeployinc',
  'blueweave',
  'carvana',
  'lagoleoltd',
  'littleipsum',
  'ventana',
  'paydayio',
  'sumohunt',
  'airfryerly',
  'tonkean',
  'secondmeasure',
  'fieldwire',
  'rasa',
  'posthog',
  'hackerrank',
];

const SCRIPT_NAMESPACE = '[REMOVE DEMO ACCOUNTS]';

type Args = {
  organization: Organization;
};

const TEST_ACCOUNT_USERS = [
  {
    fullName: 'Rae Niya',
  },
  {
    fullName: 'Andi Chen',
  },
];

export async function removeDemoAccounts({ organization }: Args) {
  logger.info(
    `${SCRIPT_NAMESPACE} Destroying existing demo accounts for ${organization.slug}`
  );
  return withTransaction(async () => {
    await Account.destroy({
      where: {
        externalId: DEMO_ACCOUNT_SLUGS,
        organizationId: organization.id,
      },
    });
    logger.info(
      `${SCRIPT_NAMESPACE} Destroyed demo accounts for ${organization.slug}`
    );

    logger.info(
      `${SCRIPT_NAMESPACE} Seeding test accounts for ${organization.slug}`
    );
    await promises.map([1, 2], async (num, idx) => {
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
    logger.info(
      `${SCRIPT_NAMESPACE} Seeded test accounts for ${organization.slug}`
    );
  });
}
