import './preStart'; // Must be the first import -- bootstrap the application

process.env['WORKER_PROCESS'] = 'true';

import { logger } from 'src/utils/logger';
import { startBullMQWorker } from 'src/jobsBull/workers';

logger.info(`[worker] Starting background workers`);

startBullMQWorker(false);
