import { addMinutes, format } from 'date-fns';

import { Events } from 'bento-common/types';

import { analytics } from './analytics';
import detachPromise from 'src/utils/detachPromise';
import { AccountUserData } from 'src/data/models/Analytics/AccountUserData.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Op } from 'sequelize';
import { AccountUserDailyLog } from 'src/data/models/Analytics/AccountUserDailyLog.model';
import SimpleRateLimiter from 'src/utils/SimpleRateLimiter';

/**
 * Use events table to track the account user activity,
 *   or just directly update their data.
 * Directly updating will mean we don't have a log of logins,
 *   but won't need to run rollups and cleanups on the event table.
 */
export const USE_AU_EVENTS_TABLE = false;

let rateLimiter: SimpleRateLimiter;

if (USE_AU_EVENTS_TABLE) {
  rateLimiter = new SimpleRateLimiter({
    keyPrefix: 'account-user-activity',
    points: 1,
    duration: 10 * 60,
  });
}

type Args = {
  accountUser: AccountUser;
  organizationEntityId: string;
};

/**
 * Tracks when an account user was last seen connecting to Bento
 */
export function trackAccountUserAppActivity({
  accountUser,
  organizationEntityId,
}: Args) {
  detachPromise(async () => {
    const now = new Date();

    if (USE_AU_EVENTS_TABLE) {
      const consume = await rateLimiter.check(accountUser.entityId);

      if (!consume) return;

      await analytics.accountUser.newEvent(Events.accountUserAppActivity, {
        accountUserEntityId: accountUser.entityId,
        organizationEntityId,
      });
    } else {
      await AccountUserData.update(
        {
          lastActiveInApp: now,
        },
        {
          where: {
            organizationId: accountUser.organizationId,
            accountUserId: accountUser.id,
            lastActiveInApp: {
              [Op.lt]: addMinutes(now, -10),
            },
          },
          limit: 1,
        }
      );
    }

    const dateString = format(now, 'yyyy-MM-dd');
    const where = {
      accountUserId: accountUser.id,
      organizationId: accountUser.organizationId,
      date: dateString,
    };

    const existingDailyLog = await AccountUserDailyLog.findOne({
      where,
      attributes: ['id'],
    });

    if (!existingDailyLog) {
      /**
       * Note we should still UPSERT to avoid race conditions.
       */
      await AccountUserDailyLog.upsert(where, {
        returning: false,
        conflictFields: ['organization_id', 'account_user_id', 'date'],
      });
    }
  }, 'trackAccountUserAppActivity');
}
