import workerpool from 'workerpool';
import { logger } from './logger';

const PROCESSING_POOLS = Number(process.env.PROCESSING_POOL) || 1;

const pool = workerpool.pool({
  workerType: 'thread',
  maxWorkers: PROCESSING_POOLS,
});

/** Handle executing large sync functions in a processing worker thread */
const ProcessingPool = {
  /**
   * Execute a method in a processing worker thread.
   * IMPORTANT: Note that the passed function will not share memory/imports, so needed resources should be passed in
   */
  exec: async <T, R>(fnc: (args: T) => R, args: T[]): Promise<R> => {
    let res;
    try {
      res = await pool.exec(fnc, args);
      pool.terminate();
    } catch (e) {
      logger.error('[ProcessingPool] error', e);
    }

    return res;
  },
  stats: pool?.stats as () => {
    totalWorkers: number;
    busyWorkers: number;
    idleWorkers: number;
    pendingTasks: number;
    activeTasks: number;
  },
  terminate: async (force: boolean): Promise<void> =>
    pool?.stats()?.totalWorkers && (await pool.terminate(force)),
};

export default ProcessingPool;
