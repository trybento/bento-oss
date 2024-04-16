import { InstanceError } from 'sequelize';
import { getRequestContext } from 'src/utils/asyncHooks';
import { IS_DEPLOYED } from 'src/utils/constants';
import { logger } from 'src/utils/logger';
import { sequelize } from '.';
import { closeFollowerSequelize } from './follower';

/** Close conns if exist */
export const closeSequelize = async () =>
  await Promise.all([sequelize.close(), closeFollowerSequelize()]);

/** Threshold for warning about slow queries */
const QUERY_TIME_THRESHOLD = 200;
const TASK_QUERY_TIME_THRESHOLD = 1000;
const HIDE_LOGS = process.env.HIDE_DB_LOGS === 'true';

export const sequelizeLog =
  (instanceName: string) => (msg: string, timeTaken?: number) => {
    const reqContext = getRequestContext();
    const threshold =
      reqContext && reqContext.identifier
        ? TASK_QUERY_TIME_THRESHOLD
        : QUERY_TIME_THRESHOLD;
    const longQuery = Number(timeTaken) > threshold;
    if (!longQuery && IS_DEPLOYED) return;

    msg = (msg as string).replace(/\s+/g, ' ');
    if (!HIDE_LOGS) {
      logger.debug(`${timeTaken}ms ${msg}`);
    }
  };

/**
 * Test if error because of a soft deletion
 */
export const isReloadError = (e: any) =>
  e instanceof InstanceError && e.message.includes('does not exist anymore');
