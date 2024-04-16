import { JobPro } from '@taskforcesh/bullmq-pro';
import { IS_DEVELOPMENT, SUPPORT_ADDRESS } from 'src/utils/constants';
import {
  getOffHourStartTime,
  isOffHours,
  getEmailsArray,
} from 'src/utils/helpers';
import { logger } from 'src/utils/logger';
import { Job } from './job';
import { queueJob } from './queues';

import { QueryDatabase, queryRunner } from 'src/data';
import { User } from 'src/data/models/User.model';
import { Organization } from 'src/data/models/Organization.model';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import { keyBy } from 'lodash';

type WithOffHoursRequeueArgs<T> = {
  job: JobPro<T>;
  /** Option to just run the job at any time */
  override?: boolean;
};

/**
 * Requeue a job for the off-hours if it needs to run in low traffic
 */
export const withOffHoursRequeue = async <T extends Job>(
  { job, override }: WithOffHoursRequeueArgs<T>,
  taskFn: () => Promise<void>
) => {
  const identifier = job.data.jobType;

  if (!isOffHours() && !IS_DEVELOPMENT && !override) {
    const runAt = getOffHourStartTime();

    logger.debug(
      `[withOffHoursRequeue] Scheduled ${identifier} in business hours, rescheduling to ${runAt.toUTCString()}`
    );

    /**
     * We are currently only respecting delay in opts
     *   Should that change this may require updating.
     */
    await queueJob(job.data, {
      runAt,
    });
    return;
  }

  await taskFn();
};

export type DiagnosePayloadOption = {
  diagnose?: number;
};

/** Transform follower db data into rows in the primary */
const followerToPrimary = async ({
  rows,
  sql,
}: {
  rows: any[];
  sql: string;
}) => {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      await queryRunner({
        sql,
        replacements: row,
        queryDatabase: QueryDatabase.primary,
      });
    } catch (e: any) {
      if (e?.message && e.message.includes?.('foreign')) {
        /* fKey violation can happen if guide deleted before rollup runs, nbd */
        logger.warn(`[rollup] insertion error: ${e.message}`);
      } else {
        throw e;
      }
    }
  }
};

/**
 * Read from follower, write to main
 * Important to make sure the read's columns maps to the write's columns
 */
export const runFollowerQueryPair = async ({
  readSql,
  writeSql,
  payload,
}: {
  readSql: string;
  writeSql: string;
  payload: { [key: string]: any };
}) => {
  const rows = await queryRunner({
    sql: readSql,
    replacements: { ...payload },
    queryDatabase: QueryDatabase.follower,
  });

  await followerToPrimary({ rows, sql: writeSql });
};

type RecipientLookupArgs = {
  contact: User | Recipient | null;
  organization: Organization;
  organizationSettings: OrganizationSettings;
};

interface Recipient {
  email: string;
  entityId: string;
}

/** Build object used to organize and send emails */
export const getRecipients = async ({
  contact,
  organization,
  organizationSettings,
}: RecipientLookupArgs) => {
  let recipients: Recipient[] = [];

  if (contact?.email) {
    const { email, entityId } = contact;

    const emailArray = getEmailsArray(email);

    recipients = emailArray.map((e) => ({ email: e, entityId }));
  } else if (organization && organizationSettings?.fallbackCommentsEmail) {
    const emailArray = getEmailsArray(
      organizationSettings.fallbackCommentsEmail
    );

    const fallbackUsers = await User.findAll({
      where: {
        email: emailArray,
        organizationId: organization.id,
      },
    });

    const fallbackUsersByEmail = keyBy(fallbackUsers, 'email');

    recipients = emailArray.map((email) => ({
      email,
      entityId:
        fallbackUsersByEmail?.[email]?.entityId || organization.entityId,
    }));
  }

  if (organization && !recipients.length) {
    /* Go to support if no contact or fallback configured */
    recipients = [
      {
        email: SUPPORT_ADDRESS,
        entityId: organization.entityId,
      },
    ];
  }

  return recipients;
};
