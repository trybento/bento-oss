import { logger } from './logger';

type TimedCallback = () => void | Promise<void>;

/**
 * Manage timeouts and intervals so we can properly clean them up on exit
 */
class TimeoutManager {
  timeoutIds: Set<NodeJS.Timeout>;
  intervalIds: Set<NodeJS.Timer>;

  constructor() {
    this.timeoutIds = new Set<NodeJS.Timeout>();
    this.intervalIds = new Set<NodeJS.Timer>();
  }

  public addTimeout(callback: TimedCallback, delay: number) {
    const timeout = setTimeout(() => {
      void callback();

      /* Timeouts expire so remove them */
      if (this.timeoutIds.has(timeout)) this.timeoutIds.delete(timeout);
    }, delay);

    this.timeoutIds.add(timeout);

    return timeout;
  }

  public addInterval(callback: TimedCallback, delay: number) {
    const interval = setInterval(callback, delay);

    this.intervalIds.add(interval);

    return interval;
  }

  /**
   * Cancel all timeouts and intervals
   */
  public clearAll() {
    logger.debug(
      `[TimeoutManager] Clearing ${
        this.intervalIds.size + this.timeoutIds.size
      } timers`
    );
    this.intervalIds.forEach((interval) => clearInterval(interval));
    this.timeoutIds.forEach((timeout) => clearTimeout(timeout));
  }
}

export default new TimeoutManager();
