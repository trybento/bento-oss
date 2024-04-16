import promises from 'src/utils/promises';
import {
  EventHookJobPayload,
  runEventHookHandlers,
  EventHookDestination,
} from './integrations.helpers';
import { JobHandler } from 'src/jobsBull/handler';
import { HandleEventHookJob } from 'src/jobsBull/job';
import { Logger } from 'src/jobsBull/logger';

/**
 * @todo Specify from the start which ones to run, so we don't
 *   do unnecessary work
 *
 * We can use retryInfo's type mechanism on queue to narrow it down.
 */
export const handleEventHook = async (
  payload: EventHookJobPayload,
  logger?: Logger
) => {
  if (payload.retryInfo?.type) {
    /* Queued for retry */
    await runEventHookHandlers({
      type: payload.retryInfo.type,
      payload,
      logger,
    });
  } else {
    /* kick off for all types */
    await promises.map(
      [EventHookDestination.webhook],
      (type) => runEventHookHandlers({ type, payload, logger }),
      { concurrency: 2 }
    );
  }
};

const handler: JobHandler<HandleEventHookJob> = async (job, logger) => {
  await handleEventHook(job.data, logger);
};

export default handler;
