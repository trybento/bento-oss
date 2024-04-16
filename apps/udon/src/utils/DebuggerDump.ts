import { disableTransaction } from 'src/data';
import { ReportDump } from 'src/data/models/Audit/ReportDump.model';
import { clsNamespace } from './cls';
import { logger } from './logger';

/** Do not poll at a higher rate than this, to prevent bad input causing load */
const MIN_INTERVAL = 1000;

/** Prevent holding too much data */
const MAX_MESSAGES = 30;

/** If no activity in this time, close timers */
const AUTO_DISPOSE = 5 * 60 * 1000;

/**
 * Diagnostic debug dump that will write tracked status to DB on a set interval
 *
 * Hopefully allows us to instrument and see where tasks are getting stuck.
 * Call dispose when done, otherwise, auto-dispose will kick in to free up allotted timers.
 */
class DebuggerDump {
  private dumpId: number | null = null;
  private updated = false;
  private locked = false;
  name: string;
  private timer: ReturnType<typeof setInterval>;
  private messages: string[] = [];
  private autoDispose: ReturnType<typeof setTimeout> | null = null;

  constructor(name: string, interval: number) {
    logger.debug(`[DebuggerDump] created: ${name} with interval ${interval}`);
    this.timer = setInterval(
      () => this.write(),
      Math.max(MIN_INTERVAL, interval)
    );
    this.name = name;
  }

  public log(message: string) {
    if (this.locked) return;

    if (this.autoDispose) clearTimeout(this.autoDispose);

    this.messages.push(`[${Date.now()}] ${message}`);
    this.updated = false;

    if (this.messages.length > MAX_MESSAGES) this.dispose();

    this.autoDispose = setTimeout(this.dispose.bind(this), AUTO_DISPOSE);
  }

  async write() {
    await disableTransaction(async () => {
      if (this.updated || !this.messages.length) return;

      const json = { messages: this.messages };

      if (this.dumpId) {
        await ReportDump.update({ json }, { where: { id: this.dumpId } });
      } else {
        const dump = await ReportDump.create({
          title: this.name,
          content: 'See JSON',
          json,
        });

        this.dumpId = dump.id;
      }

      this.updated = true;
    });
  }

  public dispose() {
    this.locked = true;
    if (this.timer) clearInterval(this.timer);
    if (this.autoDispose) clearTimeout(this.autoDispose);

    if (this.updated === false) void this.write();
    logger.debug(`[DebuggerDump] disposed: ${this.name}`);
  }
}

export default DebuggerDump;

export const withDebuggerDump = async <T>(
  fn: (dd?: DebuggerDump) => T,
  ctxName: string,
  timer = 0
) => {
  const use = typeof timer === 'number' && timer > 0;

  const dumper: DebuggerDump | undefined = use
    ? new DebuggerDump(ctxName, timer)
    : undefined;
  if (use) clsNamespace.set('debuggerDump', dumper);
  const res = await fn(dumper);

  dumper?.dispose();

  return res;
};

export const debuggerDumpLog = (message: string) => {
  const dumper = clsNamespace.get('debuggerDump') as DebuggerDump;
  if (dumper) dumper.log(message);
};
