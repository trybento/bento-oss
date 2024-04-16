import TimeoutManager from './TimeoutManager';

type AsyncTask<T> = (payload: T) => Promise<any>;

type Opts<T> = {
  /** The task to run */
  asyncTask: AsyncTask<T>;
  /** How many we will process at once */
  concurrency?: number;
  /**
   * If we track metrics for queue length, this is the name
   * @deprecated implementation was removed, should be fully removed soon
   */
  metric?: string;
  /** Hook to run on end of emptying queue */
  onQueueEmptied?: () => void;
  /** If we want to flush every now and then so nothing gets stuck */
  flushInterval?: number;
};

/**
 * Run async tasks with a controlled throughput
 */
export class AsyncThrottler<T> {
  queued: T[];
  /** Prevent multiple loops going */
  locked = false;
  asyncTask: AsyncTask<T>;
  metric: string | undefined;
  concurrency: number;
  onQueueEmptied?: () => void;
  flushInterval?: number;

  constructor({
    asyncTask,
    metric,
    concurrency = 2,
    onQueueEmptied,
    flushInterval,
  }: Opts<T>) {
    this.asyncTask = asyncTask;
    this.queued = [];
    this.metric = metric;
    this.concurrency = concurrency;
    this.onQueueEmptied = onQueueEmptied;
    if (flushInterval) {
      this.flushInterval = flushInterval;
      TimeoutManager.addInterval(this.flushQueue.bind(this), flushInterval);
    }
  }

  public async insertPayload(params: T) {
    this.queued.push(params);

    void this.flushQueue();
  }

  private async processQueue() {
    const nextToProcess: T[] = [];

    for (let i = 0; i < this.concurrency; i++) {
      const next = this.queued.shift();
      if (next) nextToProcess.push(next);
      if (this.queued.length === 0) break;
    }

    if (!nextToProcess.length) {
      this.locked = false;
      this.onQueueEmptied?.();
      return;
    }

    this.locked = true;

    await Promise.all(nextToProcess.map((params) => this.asyncTask(params)));

    return this.processQueue();
  }

  /** Start processing queue if not locked */
  private async flushQueue() {
    if (!this.locked) void this.processQueue();
  }
}
