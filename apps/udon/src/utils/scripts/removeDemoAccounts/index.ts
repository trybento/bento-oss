import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';

import { removeDemoAccounts } from 'src/interactions/removeDemoAccounts';
import { Organization } from 'src/data/models/Organization.model';

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

const SCRIPT_NAMESPACE = `[REMOVE DEMO ACCOUNTS]`;

async function invokeRemoveDemoAccounts() {
  console.log(`${SCRIPT_NAMESPACE} REMOVING DEMO ACCOUNTS FOR COMPANY`);

  const organization = await Organization.findOne({
    where: {
      slug: options.company,
    },
  });

  if (!organization) {
    throw new Error('Organization not found');
  }

  await removeDemoAccounts({ organization });

  process.exit();
}

void invokeRemoveDemoAccounts();
