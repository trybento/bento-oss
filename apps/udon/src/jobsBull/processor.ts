import '../preStart';

process.env['WORKER_PROCESS'] = 'true';

import {
  createRequestContext,
  getContextStack,
  getLastSql,
  getRequestContext,
} from 'src/utils/asyncHooks';
import { isCustomError, isUserError } from 'src/errors/errors.helpers';
import { clsNamespace } from 'src/utils/cls';
import { JobHandler } from 'src/jobsBull/handler';
import { Job } from 'src/jobsBull/job';
import { makeLogger } from './logger';
import { jobConfigMap } from 'src/jobsBull/jobConfigMap';
import { jobHandlerMap } from 'src/jobsBull/jobHandlerMap';
import {
  ProcessorPro as Processor,
  JobPro as BullMQJob,
} from '@taskforcesh/bullmq-pro';
import { QueueName } from './queueConfigMap';
import { DEFAULT_SOFT_TIMEOUT, TASK_METRIC_NAME } from './constants/constants';

const logger = makeLogger('jobsBull.processor');

const useSoftTimeout = (job: BullMQJob, softTimeout?: number) => {
  if (!softTimeout) {
    return (t: number) => {};
  }

  let triggered = false;
  const timer = setTimeout(() => {
    logger.warn(`Soft timeout on task (${job.name}) after ${softTimeout}ms`, {
      ...getRequestContext(),
      lastSql: getLastSql(),
    });

    triggered = true;
  }, softTimeout);

  const cancelTimeout = (t: number) => {
    if (timer) {
      clearTimeout(timer);
    }

    if (triggered)
      logger.warn(
        `Timed out task (${job.name}) finally completed after ${t}ms`
      );
  };

  return cancelTimeout;
};

const processor: Processor<Job> = async (job) => {
  const jobConfig = jobConfigMap[job.data.jobType];

  if (!jobConfig) {
    throw new Error(
      `No job configuration set for job type '${job.data.jobType}'`
    );
  }

  const queueName = jobConfig.queueName || QueueName.GeneralBackground;

  const jobHandler = jobHandlerMap[job.data.jobType] as
    | JobHandler<Job>
    | undefined;

  if (!jobHandler) {
    throw new Error(`No job handler set for job type '${job.data.jobType}'`);
  }

  const runTask: JobHandler<Job> = jobConfig.disableTrx
    ? (job, logger) =>
        clsNamespace.runAndReturn(() => {
          clsNamespace.set('transaction', false);
          return jobHandler(job, logger);
        })
    : jobHandler;

  createRequestContext({
    jobId: job.id,
    identifier: job.name,
    payload: job.data,
  });

  try {
    logger.info(`Started task ${job.id} (${job.name})`);

    const startTime = Date.now();

    const cancelSoftTimeout = useSoftTimeout(
      job,
      jobConfig.softTimeoutMs || DEFAULT_SOFT_TIMEOUT
    );

    let error: Error | undefined = undefined;

    try {
      await runTask(job, makeLogger(job.data.jobType));
    } catch (e: any) {
      error = e;
      /* Throw to winston logger to capture traces */
      if (!isUserError(e))
        logger.error(`Error processing (${job.name}): ${e.message}`, {
          contextStack: getContextStack(),
          stack: e.stack,
          message: e.message,
          sql: e.sql || undefined,
          lastSql: getLastSql(),
          ...getRequestContext(),
        });
    } finally {
      const timeTaken = Date.now() - startTime;
      cancelSoftTimeout(timeTaken);
    }

    if (error) {
      throw error;
    }
  } catch (err) {
    const knownError = isCustomError(err);

    /* Just stop retrying if it is a known error that retries will not solve */
    if (!knownError) {
      throw err;
    }
  }
};

export default processor;
