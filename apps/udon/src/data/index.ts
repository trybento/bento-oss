/**
 * NOTE: This should come before Sequelize is imported and instantiated.
 * This tells Sequelize to cast BIGINT to number, otherwise it would return strings.
 */
require('pg').defaults.parseInt8 = true;

import {
  Dialect,
  QueryOptionsWithType,
  QueryTypes,
  Transaction,
  QueryOptions,
} from 'sequelize';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

import models from './models';

import { logger } from 'src/utils/logger';
import {
  USE_EXTERNAL_CONNECTION_POOL,
  DATABASE_URL,
  IS_DEPLOYED,
  IS_WORKER_PROCESS,
  DATABASE_POOL_SIZE,
} from 'src/utils/constants';
import { followerSequelize } from './follower';
import { clsNamespace } from 'src/utils/cls';
import { emptyEventsBatch, flushOrQueueEvents } from './events';
import { sequelizeLog } from './data.helpers';
import { enableReadFromReplica } from 'src/utils/internalFeatures/internalFeatures';

let additionalOptions: Partial<SequelizeOptions> = {};

if (IS_DEPLOYED) {
  additionalOptions = {
    ...additionalOptions,
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

if (!USE_EXTERNAL_CONNECTION_POOL) {
  additionalOptions = {
    ...additionalOptions,
    /**
     *
     * @link https://sequelize.org/docs/v6/other-topics/connection-pool/
     */
    pool: {
      max: IS_WORKER_PROCESS ? 5 : DATABASE_POOL_SIZE,
    },
  };
}

/** Specify which db direct the query towards */
export enum QueryDatabase {
  /** Prefer if making edits or there's zero latency tolerance */
  primary = 'primary',
  /** Prefer if running long running reads, analytics, or anything that can tolerate lag time */
  follower = 'follower',
}

Sequelize.useCLS(clsNamespace);

export const sequelize = new Sequelize(DATABASE_URL, {
  database: 'bentodb',
  dialect: 'postgres' as Dialect,
  models: Object.values(models),
  logging: sequelizeLog('primary'),
  hooks: {
    afterInit: (instance: Sequelize) => {
      if (USE_EXTERNAL_CONNECTION_POOL) {
        logger.info(
          `[data] Overriding Sequelize pool in favor of an external connection pool`
        );

        // Immediately disable the pool
        // @ts-ignore
        instance.connectionManager.pool?.destroyAllNow();
        // @ts-ignore
        instance.connectionManager.pool = undefined;

        /**
         * Overrides get connection to bypass `pool.acquire()` and immediately
         * connect using the config settings.
         */
        instance.connectionManager.getConnection = function getConnection() {
          // @ts-ignore
          return this._connect(this.config.replication?.write || this.config);
        };

        /**
         * Overrides release connection to directly call a disconect instead
         * of `pool.release()`.
         */
        instance.connectionManager.releaseConnection =
          function releaseConnection(connection) {
            // @ts-ignore
            return this._disconnect(connection);
          };
      }
    },
  },
  // required for the timeTaken parameter for logging to be provided
  benchmark: true,
  // required to avoid column names being truncated on multiple JOINs
  minifyAliases: true,
  ...additionalOptions,
});

export interface QueryArgs {
  sql: string;
  replacements?:
    | { [key: string]: string | number | readonly (string | number)[] }
    | string[];
  /**
   * Whether to explicit use the follower db. Always use primary if performing edits
   * @default true (if feature flag is enabled for the org)
   */
  queryDatabase?: QueryDatabase;
  logging?: QueryOptionsWithType<QueryTypes.SELECT>['logging'];
  /**
   * Determines the type of query you wanna run.
   * @default `QueryTypes.SELECT`
   */
  type?: QueryTypes;
}

export const queryRunner = async <T = [unknown[], unknown]>({
  sql,
  replacements,
  queryDatabase,
  logging,
  type = QueryTypes.SELECT,
}: QueryArgs) => {
  if (queryDatabase == null) {
    queryDatabase = (await enableReadFromReplica.enabled())
      ? QueryDatabase.follower
      : QueryDatabase.primary;
  }

  const queryArgs: QueryOptions = {
    replacements,
    type,
    logging,
  };

  if (queryDatabase === QueryDatabase.follower && followerSequelize) {
    try {
      return (await followerSequelize.query.bind(followerSequelize)(sql, {
        ...queryArgs,
        transaction: null,
      })) as unknown as T;
    } catch (e: any) {
      // swallow this error and retry the query on the primary to handle cases
      // where a mutation query was run against the follower
      // @todo - remove this once we're confident we aren't running any mutation
      // queries against the follower
    }
  }

  return (await sequelize.query(sql, queryArgs)) as unknown as T;
};

type TransactionCallback<T> = (transaction: Transaction) => Promise<T>;
const transactionRunner = async <T>(cb: TransactionCallback<T>): Promise<T> => {
  const events = emptyEventsBatch();
  const ret = await sequelize.transaction<T>(async (t) => {
    clsNamespace.set('events', events);
    return await cb(t);
  });
  flushOrQueueEvents(events);
  return ret;
};

export async function withTransaction<T>(
  cb: TransactionCallback<T>
): Promise<T> {
  if (!cb || typeof cb !== 'function') {
    throw new Error('Must pass a callback to withTransaction');
  }
  const transaction = clsNamespace.get('transaction') as Transaction;
  return await (transaction || transaction === false
    ? cb(transaction)
    : transactionRunner(cb));
}

/**
 * Explicitly run a block of code blocking transactions within it
 *
 * This is for when we want something failing to not affect its parent trx block,
 *   or if we simply don't want trxs
 *
 * WARNING: Avoid using this where the data in the nested block relies on changes
 *   made upstream
 */
export async function disableTransaction<T>(cb: () => Promise<T>): Promise<T> {
  return clsNamespace.runAndReturn(() => {
    clsNamespace.set('transaction', false);
    return cb();
  });
}

// Used in sequelize "where" for non-archived rows.
// This might be removed once we migrate to sequelize v6 or newer.
// @see https://sequelize.org/v7/manual/paranoid.html
/**
 * @deprecated use Account `notArchived` scope instead
 * @docs https://sequelize.org/docs/v6/other-topics/scopes/
 */
export const notArchivedCondition = {
  deletedAt: null,
};
