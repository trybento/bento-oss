/**
 * @file Initialize a connection to a follower DB if possible
 * Sequelize has a replicas option that allows the usage of read replicas, however..
 *   it defaults all reads to the database, unless you manually go through and
 *   specify useMaster. That is not the desired behavior at the time
 */

import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { IS_DEPLOYED, IS_WORKER_PROCESS } from 'src/utils/constants';
import { logger } from 'src/utils/logger';
import models from './models';
import { sequelizeLog } from './data.helpers';

/* Workers should be the primary consumer of the follower for analytic jobs */
const FOLLOWER_POOL_SIZE = process.env.DB_FOLLOWER_POOL_SIZE
  ? Number(process.env.DB_FOLLOWER_POOL_SIZE)
  : 5;

/* We want a smaller pool on web to keep connections manageable, as it should be rarely used */
const WEB_FOLLOWER_POOL_SIZE = process.env.DB_FOLLOWER_POOL_SIZE
  ? Number(process.env.DB_FOLLOWER_POOL_SIZE)
  : 2;

const FOLLOWER_HOST = process.env.DB_FOLLOWER_HOST;
const DATABASE_URL = process.env.DB_FOLLOWER_URL;

export let followerSequelize: Sequelize | undefined = undefined;

if (FOLLOWER_HOST && DATABASE_URL) {
  let additionalOptions: Partial<SequelizeOptions> = {};

  if (IS_DEPLOYED) {
    additionalOptions = {
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          // Required for Heroku SSL
          // https://stackoverflow.com/questions/58965011/sequelizeconnectionerror-self-signed-certificate
          rejectUnauthorized: false,
        },
      },
    };
  }

  logger.info(
    `[follower] Initializing connection to follower ${FOLLOWER_HOST}`
  );

  /* Followers using the same DB/USER/PASS */
  followerSequelize = new Sequelize(DATABASE_URL, {
    host: FOLLOWER_HOST,
    dialect: 'postgres',
    models: Object.values(models),
    logging: sequelizeLog('follower'),
    pool: {
      max: IS_WORKER_PROCESS ? FOLLOWER_POOL_SIZE : WEB_FOLLOWER_POOL_SIZE,
    },
    ...additionalOptions,
  });
} else {
  logger.debug('[follower] No follower configured; will default to primary.');
}

export const closeFollowerSequelize = async () => {
  await followerSequelize?.close();
};
