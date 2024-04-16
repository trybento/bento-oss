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

import { transformCourierUuids } from 'src/interactions/courier';

const SCRIPT_NAMESPACE = `[TRANSFORM COURIER UUIDS]`;

async function invokeTransformCourierUuids() {
  console.log(`${SCRIPT_NAMESPACE} STARTING`);

  await transformCourierUuids(options.company);

  console.log(`${SCRIPT_NAMESPACE} DONE`);

  process.exit();
}

void invokeTransformCourierUuids();
