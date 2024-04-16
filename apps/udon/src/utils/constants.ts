import { BASE_SERVER_URL } from 'shared/constants';

/**
 * Only within this period an Org can remain in trial.
 * If they don't have a valid subscription (state "active") after that,
 * they will be automatically moved to "inactive" state.
 */
export const TRIAL_PERIOD_IN_DAYS = 14;

export const DARK_COLOR_THRESHOLD = 100;
export const BRIGHT_COLOR_THRESHOLD = 200;

export const SUPPORT_ADDRESS = 'support@trybento.co';
/** Address to send notifications from */
export const NOTIFICATIONS_ADDRESS = 'notifications@bentohq.co';

export const videoFormats = {
  loomVideo: 'loom-video',
  youtubeVideo: 'youtube-video',
  wistiaVideo: 'wistia-video',
};

/**
 * Determines if the app is running locally in development mode.
 */
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

/**
 * Determines if the app is running locally in production mode.
 */
export const IS_PROD = process.env.NODE_ENV === 'production';

/**
 * Determines if the app is running in test mode.
 */
export const IS_TEST = process.env.NODE_ENV === 'test';

/** */
export const IS_CLI = !process.env.NODE_ENV;

/**
 * Determines if the app is running in e2e mode,
 * although not directly being tested.
 */
export const IS_E2E = process.env.NODE_ENV === 'e2e';

/**
 * Determines if the app is deployed.
 * This is useful when setting up the follower db, ssl for db connection, etc.
 */
export const IS_DEPLOYED = !(IS_DEVELOPMENT || IS_E2E || IS_TEST || IS_CLI);

/**
 * Determines if the app is running in Staging.
 */
export const IS_STAGING = BASE_SERVER_URL.includes('staging');

/**
 * Check if we're on a worker process
 */
export const IS_WORKER_PROCESS = process.env.WORKER_PROCESS === 'true';

/** Max allowed time for shutdown before just closing process */
export const SHUTDOWN_MAX = 15 * 1000;

/**
 * When deployed and if heroku's connection pool is enabled,
 * this flag will be true, meaning we should prevent Sequelize from
 * trying to create a connection pool management himself.
 */
export const USE_EXTERNAL_CONNECTION_POOL =
  !!process.env.DATABASE_CONNECTION_POOL_URL;

export const DATABASE_URL = USE_EXTERNAL_CONNECTION_POOL
  ? process.env.DATABASE_CONNECTION_POOL_URL!
  : process.env.DATABASE_URL || 'postgres://localhost:5432/bentodb';

/**
 * Determines the Sequelize pool size when not using with
 * an external connection pool.
 *
 * WARNING: Worker processes will use a static value.
 */
export const DATABASE_POOL_SIZE = process.env.DATABASE_POOL_SIZE
  ? Number(process.env.DATABASE_POOL_SIZE)
  : 10;

/** Use a manual setting if available, otherwise use Heroku defaults */
export const IDENTIFY_CHECK_CACHE_TTL = process.env
  .IDENTIFY_CHECK_CACHE_TTL_SECONDS
  ? Number(process.env.IDENTIFY_CHECK_CACHE_TTL_SECONDS)
  : 2 * 60 * 60; // default to 2 hours

export const FEATURE_FLAG_CACHE_TTL = process.env.FEATURE_FLAG_CACHE_TTL
  ? Number(process.env.FEATURE_FLAG_CACHE_TTL)
  : 10 * 60; // 10 min in seconds

export const DIAGNOSTICS_CACHE_TTL = process.env.DIAGNOSTICS_CACHE_TTL
  ? Number(process.env.DIAGNOSTICS_CACHE_TTL)
  : 24 * 60 * 60 * 1000; // 1 day

/** Max event throughput per org before we hard bounce requests */
export const HARD_EVENT_RATE_LIMIT = process.env.HARD_EVENT_RATE_LIMIT
  ? Number(process.env.HARD_EVENT_RATE_LIMIT)
  : 20000;

/**
 * This determines how many jobs the background worker can run concurrently.
 */
export const WORKER_BULLMQ_CONCURRENCY = process.env.WORKER_BULLMQ_CONCURRENCY
  ? Number(process.env.WORKER_BULLMQ_CONCURRENCY)
  : 1;

/**
 * This determines how many jobs the integrations queue can run concurrently.
 */
export const INTEGRATIONS_BULLMQ_CONCURRENCY = process.env
  .INTEGRATIONS_BULLMQ_CONCURRENCY
  ? Number(process.env.INTEGRATIONS_BULLMQ_CONCURRENCY)
  : WORKER_BULLMQ_CONCURRENCY;

/**
 * This determines how many jobs the priority worker can run concurrently.
 */
export const PRIORITY_WORKER_BULLMQ_CONCURRENCY = process.env
  .PRIORITY_WORKER_BULLMQ_CONCURRENCY
  ? Number(process.env.PRIORITY_WORKER_BULLMQ_CONCURRENCY)
  : 1;

/**
 * How many integration ingestion jobs per org we process at once
 * This is predominately to handle spike protection from bursts of events.
 */
export const INTEGRATIONS_BULLMQ_GROUP_CONCURRENCY = process.env
  .INTEGRATIONS_BULLMQ_GROUP_CONCURRENCY
  ? Number(process.env.INTEGRATIONS_BULLMQ_GROUP_CONCURRENCY)
  : 3;

/**
 * How many template propagation jobs we process at once, across everything.
 * @default 2
 */
export const PROPAGATION_QUEUE_CONCURRENCY = process.env
  .PROPAGATION_QUEUE_CONCURRENCY
  ? Number(process.env.PROPAGATION_QUEUE_CONCURRENCY)
  : 2;

/**
 * How many template propagation jobs we process per group (Org) at once,
 * regardless of the type (template, guide base or module).
 * @default 1
 */
export const PROPAGATION_QUEUE_GROUP_CONCURRENCY = process.env
  .PROPAGATION_QUEUE_GROUP_CONCURRENCY
  ? Number(process.env.PROPAGATION_QUEUE_GROUP_CONCURRENCY)
  : 1;

/**
 * Never assess branching rule attributes.
 *
 * This is to DISABLE but not REMOVE. TL;DR: Most of the functionality
 * is fine, and we want to keep since it would be expensive to rebuild...
 * but the fetching here is not performant. This is to be revisited.
 */
export const HARD_EXCLUDE_BRANCHING_TARGETING = true;

/**
 * Determines the timeout in milliseconds for HTTP calls made
 * by integrations.
 */
export const INTEGRATION_FETCH_TIMEOUT = 15 * 1000;

/** Orgs older than this always use cached diagnostics */
export const CLIENT_DIAGNOSTICS_CUTOFF = process.env.CLIENT_DIAGNOSTICS_CUTOFF
  ? Number(process.env.CLIENT_DIAGNOSTICS_CUTOFF)
  : 10;
