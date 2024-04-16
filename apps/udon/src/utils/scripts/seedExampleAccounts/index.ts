import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';

import seedExampleAccounts from 'src/interactions/seedExampleAccounts';
import { Organization } from 'src/data/models/Organization.model';
import { Account } from 'src/data/models/Account.model';

// Setup command line options
const options = commandLineArgs([
  {
    name: 'env',
    alias: 'e',
    defaultValue:
      process.env.NODE_ENV === 'production' ? 'production' : 'development',
    type: String,
  },
  {
    name: 'company',
    alias: 'c',
    defaultValue: 'bento',
    type: String,
  },
]);

// Set the env file
const result2 = dotenv.config({
  path: `./env/${options.env as string}.env`,
});

if (result2.error) {
  throw result2.error;
}

const SCRIPT_NAMESPACE = `[SEED EXAMPLE ACCOUNTS]`;

async function invokeSeedAccounts() {
  console.log(`${SCRIPT_NAMESPACE} SEEDING DEMO DATA FOR COMPANY`);

  console.log(
    `${SCRIPT_NAMESPACE} Beginning seed of demo accounts for the demo org`
  );
  const demoOrg = await Organization.findOne({
    where: {
      slug: options.company,
    },
  });

  if (!demoOrg) {
    throw new Error('Demo org not found');
  }

  console.log(`${SCRIPT_NAMESPACE} Destroying existing demo accounts`);
  await Account.destroy({
    where: {
      organizationId: demoOrg.id,
    },
  });

  await seedExampleAccounts({ organization: demoOrg });
  console.log(`${SCRIPT_NAMESPACE} Completed seeding demo accounts!`);
  process.exit();
}

void invokeSeedAccounts();
