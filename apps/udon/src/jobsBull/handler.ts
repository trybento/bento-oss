import { JobPro as Job } from '@taskforcesh/bullmq-pro';

import { Logger } from 'src/jobsBull/logger';

export type JobHandler<D> = (job: Job<D>, logger: Logger) => Promise<void>;
