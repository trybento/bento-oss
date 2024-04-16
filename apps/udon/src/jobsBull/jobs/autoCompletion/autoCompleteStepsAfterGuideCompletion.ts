import { JobHandler } from 'src/jobsBull/handler';
import { AutoCompleteStepOnGuideCompletionJob } from 'src/jobsBull/job';
import { autoCompleteStepsOnGuideCompletion } from 'src/interactions/autoComplete/autoCompleteStepsOnGuideCompletion';

const handler: JobHandler<AutoCompleteStepOnGuideCompletionJob> = async (
  job,
  logger
) => {
  await autoCompleteStepsOnGuideCompletion(job.data, logger);
};

export default handler;
