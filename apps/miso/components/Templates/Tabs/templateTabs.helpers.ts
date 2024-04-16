import { useEffect, useMemo, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { differenceInMinutes } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { AuditEvent } from 'bento-common/types';

import { HistoryTabQuery } from 'relay-types/HistoryTabQuery.graphql';
import { BOOTSTRAP_CACHE_KEY, getLocalTz } from 'utils/constants';
import { AutolaunchContext } from 'components/GuideAutoLaunchModal/Template/autolaunch.helpers';
import { getUrlQuery } from 'utils/helpers';
import { addADay, roundToPSTDayStart } from 'bento-common/utils/dates';
import { GroupTargeting, TargetingType } from 'bento-common/types/targeting';

/** When we started collecting audit datas as it is now */
export const DATA_START_DATE = new Date('2022-04-28');

// A formatter to display dates like '5/16/2022, 11:59 PM PDT' -- showing the date, time, and time zone but
// without too much precision.
export const timestampFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short',
});

export const dateWithTimeFormatter = new Intl.DateTimeFormat('en', {
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  timeZoneName: 'short',
});

export const dateFormatter = new Intl.DateTimeFormat('en', {
  month: 'long',
  day: 'numeric',
});

type ParsedAccountData = {
  accountName?: string;
  moduleName?: string;
  targets?: any;
  autoLaunchRules?: any;
  account?: any;
  accountUser?: any;
};

export type ProcessedResults = {
  timestamp: Date;
  eventName: AuditEvent | string;
  user?: HistoryTabQuery['response']['templateAuditTrail'][number]['user'];
  data?: ParsedAccountData[];
};

/** Squash same events if within n num of minutes */
const GROUP_INTERVAL = 5;

/** Assumes all events are already sorted newest to oldest. */
export const groupAuditEvents = (
  auditEvents: HistoryTabQuery['response']['templateAuditTrail']
) => {
  const results: ProcessedResults[][] = [];
  let currDate = '';

  auditEvents?.forEach(({ timestamp, eventName, user, data: rawData }) => {
    const d = new Date(timestamp as string);
    const convertedDate = utcToZonedTime(d, getLocalTz());
    const thisDate = format(convertedDate, 'MMMM d');

    /* New date group */
    if (thisDate !== currDate) {
      currDate = thisDate;
      results.push([]);
    }

    const data = JSON.parse(rawData);

    const latestIndex = results.length - 1;
    const lastEntry = results[latestIndex]?.[results[latestIndex].length - 1];

    /* Group same-minute account launches together as one event */
    const appendManualLaunch =
      lastEntry?.eventName === AuditEvent.manualLaunch &&
      eventName === AuditEvent.manualLaunch &&
      differenceInMinutes(lastEntry?.timestamp, convertedDate) <
        GROUP_INTERVAL &&
      lastEntry.data?.length &&
      lastEntry.data[0].accountName;

    /* Same time/event/user should be grouped */
    const groupSimilarWithLast =
      lastEntry?.eventName === eventName &&
      differenceInMinutes(lastEntry?.timestamp, convertedDate) <
        GROUP_INTERVAL &&
      lastEntry?.user?.fullName === user?.fullName &&
      isEqual(data, lastEntry?.data);

    if (appendManualLaunch && data.accountName) {
      lastEntry.data.push({
        accountName: data.accountName,
      } as ParsedAccountData);
    } else if (groupSimilarWithLast) {
      // Do nothing, use the "newer" entry's time
    } else {
      results[latestIndex].push({
        timestamp: convertedDate,
        eventName,
        user,
        data: [data],
      });
    }
  });

  return results;
};

/**
 * Traverse an object and change Date objects to ISO strings
 * It's 2 cause there was a failed attempt
 */
export const dateToStr2 = (input: any) => {
  if (!input) {
    return input;
  } else if (Array.isArray(input)) {
    return input.map((e) => dateToStr2(e));
  } else if (input instanceof Date) {
    return input.toISOString();
  } else if (typeof input === 'object') {
    return Object.keys(input).reduce((a, v) => {
      a[v] = dateToStr2(input[v]);
      return a;
    }, {});
  } else {
    return input;
  }
};

export const isDefaultAutolaunch = (ctx: AutolaunchContext) =>
  ctx.accountTargetType === 'all' && ctx.accountUserTargetType === 'all';

/**
 * Setup hooks useful for entering and exiting a "bootstrapping" state
 *   in which users are coming into a freshly cloned Inspirations template
 */
export function useBootstrapHooks(onBootstrap: () => void) {
  /*
   * Whether or not we expect changes coming from a blocking modal experience
   * This will control if additional behaviors should be run
   */
  const bootstrappingState = useState(false);
  const [_, setBootstrapping] = bootstrappingState;

  useEffect(() => {
    const showRename = getUrlQuery(BOOTSTRAP_CACHE_KEY);

    if (showRename) {
      onBootstrap();
      setBootstrapping(true);
    }
  }, []);

  return bootstrappingState;
}

export const useDateConstraints = (enableDate?: string | Date) => {
  const minStartDate = useMemo(
    () => roundToPSTDayStart(addADay(new Date())),
    []
  );
  const minEndDate = useMemo(
    () =>
      roundToPSTDayStart(
        addADay(
          enableDate
            ? typeof enableDate === 'string'
              ? new Date(enableDate)
              : enableDate
            : new Date()
        )
      ),
    [enableDate]
  );

  return {
    minStartDate,
    minEndDate,
  };
};

export const isAllTargeting = (targets?: GroupTargeting) =>
  targets?.account.type === TargetingType.all &&
  targets?.accountUser.type === TargetingType.all;
