import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';

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
    name: 'from',
    type: String,
  },
  {
    name: 'to',
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

import { copyTemplatesBetweenOrgs } from 'src/interactions/scripts/copyTemplatesBetweenOrgs';

const SCRIPT_NAMESPACE = `[TEMPLATES COPY]`;

async function invokeTransformCourierUuids() {
  console.log(`${SCRIPT_NAMESPACE} STARTING`);

  const fromOrgSlug = options.from;
  const toOrgSlug = options.to;

  await copyTemplatesBetweenOrgs(fromOrgSlug, toOrgSlug);

  console.log(`${SCRIPT_NAMESPACE} DONE`);

  process.exit();
}

void invokeTransformCourierUuids();
