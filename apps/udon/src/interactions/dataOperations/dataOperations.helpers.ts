import { sleep } from 'src/utils/helpers';
import withPerfTimer from 'src/utils/perfTimer';

/** Make sure a request takes at minimum delay amount of time to prevent notif spams */
export const withArtificialDelay = async <T>(
  cb: () => Promise<T>,
  delay = 1000
) => {
  let ret: T;
  let waitTime = delay;
  await withPerfTimer(
    'withArtificialDelay',
    async () => {
      ret = await cb();
    },
    (time) => {
      waitTime -= time;
    }
  );

  if (waitTime > 0) await sleep(waitTime);
};
