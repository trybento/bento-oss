import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';

import { Organization } from 'src/data/models/Organization.model';

// Setup command line options
const options = commandLineArgs([
  {
    name: 'env',
    alias: 'e',
    defaultValue: 'development',
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

const SCRIPT_NAMESPACE = `[CLEAR ACTIVE GUIDE]`;

async function clearSidebarGuide() {
  console.log(`${SCRIPT_NAMESPACE} Clearing active sidebar guide`);
  const organization = await Organization.findOne();
  if (!organization) throw new Error('Organization not found');

  await organization.update({ TEMPactiveGuideEntityId: null });

  console.log(`${SCRIPT_NAMESPACE} Cleared active sidebar guide!`);
  process.exit();
}

void clearSidebarGuide();
