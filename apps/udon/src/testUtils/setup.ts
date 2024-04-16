/*
 * Hard manual overrides
 */

process.env.HARD_EVENT_RATE_LIMIT = String(500);

/** Temporary workaround for flaky tests */
jest.retryTimes(3);
