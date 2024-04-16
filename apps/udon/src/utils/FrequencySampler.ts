import { linearToLogarithmic } from './helpers';
import { logger } from './logger';

type Opts = {
  /** How long to sample for */
  duration?: number;
  /** Turn off without removing */
  disable?: boolean;
  /** Keep collecting data and processing on an interval */
  recurring?: boolean;
};

const DEFAULT_CUTOFF = 60 * 1000;

type ResultData = {
  /* Raw percentage of this event out of the total */
  share: number;
  /* How rare the event is on a logarithmic scale where weight is higher if event is rare */
  rarityWeight: number;
};

/**
 * Collect events for a while and then analyze the percentage each event occurs
 *
 * Lock samples needs to be called to generate the data; this is to prevent constant
 *   computation
 */
class FrequencySampler {
  private timer;
  private disabled = false;
  /** How long to collect events for */
  private duration: number = DEFAULT_CUTOFF;
  /** Record number of events */
  private eventTrack: Record<string, number> = {};
  /** Track as discrete count so we don't have to reduce later */
  private totalCount = 0;
  private results: Record<string, ResultData> | null = null;

  constructor(opts?: Opts) {
    if (opts?.duration) this.duration = opts.duration;
    if (opts?.disable) this.disabled = true;

    this.scheduleCutoff();
  }

  private scheduleCutoff(recurring = false) {
    this.timer = setTimeout(() => {
      if (this.disabled) return;

      const success = this.processData();

      if (recurring && success) this.scheduleCutoff(recurring);
    }, this.duration).unref();
  }

  public logEvent(event: string) {
    if (this.disabled) return;

    this.totalCount++;
    this.eventTrack[event] = this.eventTrack[event]
      ? this.eventTrack[event] + 1
      : 1;
  }

  /**
   * Stop collecting events and generate a result hash.
   *   Calls to getRates will then start to return and have usable results
   */
  private processData() {
    try {
      /* Max share should be the top of the scale and weighted at 1 */
      const maxShare = Math.max(
        ...Object.values(this.eventTrack).map(
          (rawCount) => rawCount / this.totalCount
        )
      );

      this.results = Object.keys(this.eventTrack).reduce((result, event) => {
        const share = this.eventTrack[event] / this.totalCount;
        result[event] = {
          share,
          rarityWeight: linearToLogarithmic((maxShare - share) / maxShare),
        };
        return result;
      }, {} as Record<string, ResultData>);

      return true;
    } catch (e: any) {
      logger.error(`[FrequencySampler] error parsing data: ${e.message}`, e);
      this.disabled = true;
      return false;
    }
  }

  /** Manually lock, stop collecting, and build results */
  public stopCollecting() {
    if (this.timer) clearTimeout(this.timer);

    this.processData();
  }

  public getRates() {
    return this.results;
  }

  /**
   * Start the sampler again, optionally clearing the results
   *   use on interval to keep tracking results and adjusting
   */
  public restart(wipe = true) {
    this.scheduleCutoff();

    this.disabled && (this.disabled = false);

    if (!wipe) return;

    this.eventTrack = {};
    this.totalCount = 0;
    this.results = null;
  }

  /**
   * Helper to turn the weight into a sample rate
   *   The weight determines where on the scale it'll lie between the min and the max
   * @param min Minimum sample rate e.g. 0.1
   * @param max Max sample rate e.g 1
   * @param weight 0-100, provided by the data result
   * @returns
   */
  static determineSampleRate(min: number, max: number, weight: number) {
    if (max > 1) return 1;

    /* What range we're working with */
    const variance = max - min;

    return Math.min(min + variance * (weight / 100));
  }
}

export default FrequencySampler;
