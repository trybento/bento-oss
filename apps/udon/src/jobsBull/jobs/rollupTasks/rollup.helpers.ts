import { sub, differenceInMinutes } from 'date-fns';

import { AtLeast } from 'bento-common/types';
import { RollupTypeEnum, ROLLUP_TIMES_DICT } from './rollup.constants';
import { logger } from 'src/utils/logger';
import { RollupState } from 'src/data/models/Analytics/RollupState.model';

export interface RollupQueryPayload {
  date: 'yesterday' | 'today' | 'last run' | string;
  lookback?: string;
  templateIds?: number[];
}

/**
 * Make sense of the payload date in-place because crontab doesn't support dynamic
 * @returns Nothing but append to either lookback or date keys to inform the method.
 */
export const parsePayloadDate = async (
  payload: AtLeast<RollupQueryPayload, 'date'>,
  type: RollupTypeEnum
) => {
  // crontab doesn't let us put variable expressions in
  let d: Date;

  if (payload.date === 'today') {
    /* Look for events today */
    d = new Date();
  } else if (payload.date === 'yesterday') {
    /* Look for events yesterday */
    d = new Date();
    d.setUTCDate(d.getUTCDate() - 1);
  } else if (payload.date === 'last run') {
    /* Look back since last time we logged running this rollup */
    const lookBackUntilDate = await getLastRunTime(type);
    d = new Date();

    const diff = Math.abs(differenceInMinutes(d, lookBackUntilDate)) + 5;

    logger.debug(
      `[parsePayloadDate] Using "last run" method for lookback: ${diff} mins`
    );

    payload.lookback = `${diff} minutes`;
    return;
  } else if (payload.date.match(/last ([0-9]+) minutes/g)) {
    /* Lookback "last n minutes" */

    const match = payload.date.match(/([0-9]+) minutes/g)?.[0];
    payload.lookback = match?.replace(/[0-9]/g, (p1) =>
      String(Math.ceil(+p1 * 1.6))
    );
    return;
  } else {
    /* Custom date passed in */
    const validDate = Date.parse(payload.date);
    d = !validDate ? new Date() : new Date(payload.date);

    if (
      [
        RollupTypeEnum.StepDataRollups,
        RollupTypeEnum.GuideDataRollups,
      ].includes(type)
    ) {
      const diff = Math.abs(differenceInMinutes(new Date(), d)) + 5;

      payload.lookback = `${diff} minutes`;
    }
  }

  payload.date = d.toISOString().substring(0, 10);
};

export const getLastRunTime = async (type: RollupTypeEnum) => {
  const ruState = await RollupState.findOne({ where: { rollupName: type } });

  if (ruState) return ruState.lastRun;

  return sub(new Date(), { minutes: ROLLUP_TIMES_DICT[type] });
};

/**
 * Last run time should be when we determined what to update
 *   not when it actually finished updating
 *   so that next time we don't miss any steps that were updated
 *   between when we picked the data and when we actually finish
 */
export const setLastRunTime = async (
  rollupName: RollupTypeEnum,
  time: Date = new Date()
) => {
  await RollupState.upsert(
    { rollupName, lastRun: time },
    { conflictFields: ['rollup_name'] }
  );
};

export const isRollupDisabled = async (rollupName: RollupTypeEnum) => {
  const rollupState = await RollupState.findOne({
    where: {
      rollupName,
    },
    attributes: ['enabled'],
  });

  const disabled = !!rollupState && !rollupState.enabled;

  if (disabled) logger.debug(`[isRollupDisabled] is disabled: ${rollupName}`);

  return disabled;
};

/** Lookup by event time */
export const getTimeClause = (payload: RollupQueryPayload) => `
	e.created_at ${
    payload.lookback
      ? '>= NOW() - INTERVAL :lookback'
      : 'between :date ::date and :date ::date + 1'
  }
`;

export { RollupTypeEnum } from './rollup.constants';
