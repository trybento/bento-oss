import { randomInt } from 'crypto';

import { applyFinalCleanupHook } from 'src/data/datatests';
import {
  arrayOfRandomLength,
  getDummyString,
} from 'src/testUtils/dummyDataHelpers';
import ProcessingPool from 'src/utils/processingPool';
import Encryption from './cryptr';
import FrequencySampler from './FrequencySampler';
import {
  chunkArray,
  linearToLogarithmic,
  randomFromArray,
  sleep,
} from './helpers';
import withPerfTimer from './perfTimer';

applyFinalCleanupHook();

/** Super useless and dangerous. A bad fnc */
const block = (ms: number) => {
  const s = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if (new Date().getTime() - s > ms) {
      return true;
    }
  }
  return false;
};

describe('helpers', () => {
  test('chunk arrays chunks arrays', () => {
    const randomArray = arrayOfRandomLength(50, 100);

    const chunkLength = 10;

    const chunked = chunkArray(randomArray, chunkLength);

    chunked.forEach((chunk) =>
      expect(chunk.length).toBeLessThanOrEqual(chunkLength)
    );

    const deChunked = chunked.flat();

    expect(deChunked.length).toEqual(randomArray.length);

    for (let i = 0; i < 10; i++) {
      const randomElement = randomFromArray(randomArray);
      expect(deChunked.includes(randomElement)).toBeTruthy();
    }
  });

  test('linearToLog should produce log style ramping results', () => {
    const res = [0, 0.5, 1].map((n) => linearToLogarithmic(n));

    expect(res[0]).toEqual(1);
    expect(res[2]).toEqual(100);
    expect(res[1]).not.toEqual(50);
  });
});

describe('processing pool', () => {
  const add = ({ a, b }: { a: number; b: number }) => a + b;
  const BLOCK_TIME = randomInt(200) + 10;

  test('can run a method', async () => {
    const a = 1;
    const b = 1;

    const result = await ProcessingPool.exec(add, [{ a, b }]);

    expect(result).toBe(add({ a, b }));
  });

  test('blocks without using execpool', () => {
    const d = new Date().getTime();
    let timeAfterCalling = 0;
    const ran = block(BLOCK_TIME);
    timeAfterCalling = new Date().getTime();
    expect(timeAfterCalling - d).toBeGreaterThanOrEqual(BLOCK_TIME);
    expect(ran).toBeTruthy();
  });

  test('can run a method non-blocking', (done) => {
    const d = new Date().getTime();
    let timeAfterCalling = 0;

    void ProcessingPool.exec(block, [BLOCK_TIME]).then((ran) => {
      expect(timeAfterCalling - d).toBeLessThan(BLOCK_TIME);
      expect(ran).toBeTruthy();
      done();
    });
    timeAfterCalling = new Date().getTime();
  });
});

describe('perf hook', () => {
  test('returns a time', async () => {
    const sleepTime = randomInt(200);
    let time = 0;
    await withPerfTimer(
      'timer',
      async () => {
        await sleep(sleepTime + 2);
      },
      (final) => {
        time = final;
      }
    );

    expect(time).toBeGreaterThanOrEqual(sleepTime);
  });

  test('preserves original fnc return value', async () => {
    const expectedValue = getDummyString();
    const result = await withPerfTimer('preserve', async () => {
      await sleep(2);
      return expectedValue;
    });

    expect(result).toBe(expectedValue);
  });
});

describe('encryption', () => {
  test('encrypts', () => {
    const testStr = getDummyString();

    const encrypted = Encryption.encrypt(testStr);
    expect(encrypted).not.toEqual(testStr);

    const decrypted = Encryption.decrypt(encrypted);
    expect(decrypted).toEqual(testStr);
  });
});

describe('frequency sampler', () => {
  test('can build rate percentage results', () => {
    const sampler = new FrequencySampler();

    const eventCount = randomInt(600, 3600);
    const eventsWillBeA = Math.random();
    const eventName = 'carlosPowerWentOut';

    for (let i = 0; i < eventCount; i++) {
      Math.random() < eventsWillBeA
        ? sampler.logEvent(eventName)
        : sampler.logEvent('B');
    }

    sampler.stopCollecting();
    const rates = sampler.getRates();

    if (!rates) throw 'No rates';

    const errorThreshold = 0.05;
    const withinFivePercent =
      rates[eventName].share > eventsWillBeA - errorThreshold &&
      rates[eventName].share < eventsWillBeA + errorThreshold;
    expect(withinFivePercent).toBeTruthy();
  });

  test('will weigh rare events heavily', () => {
    const sampler = new FrequencySampler();

    for (let i = 0; i < 10; i++) {
      sampler.logEvent('A');
    }
    for (let i = 0; i < 100; i++) {
      sampler.logEvent('B');
    }

    sampler.stopCollecting();
    const rates = sampler.getRates();

    if (!rates) throw 'No rates';

    expect(rates['A'].rarityWeight).toBeGreaterThan(rates['B'].rarityWeight);
    expect(rates['A'].rarityWeight).toBeLessThan(100);

    /* Most common event should be weighted at 1 */
    expect(rates['B'].rarityWeight).toEqual(1);
  });

  test('can be used to determine a sample rate', () => {
    const sampler = new FrequencySampler();

    for (let i = 0; i < 10; i++) {
      sampler.logEvent('A');
    }
    for (let i = 0; i < 100; i++) {
      sampler.logEvent('B');
    }

    sampler.stopCollecting();
    const rates = sampler.getRates();

    if (!rates) throw 'No rates';

    const minSampleRate = 0.1;
    const maxSampleRate = 0.7;

    const rateA = FrequencySampler.determineSampleRate(
      minSampleRate,
      maxSampleRate,
      rates['A'].rarityWeight
    );
    const rateB = FrequencySampler.determineSampleRate(
      minSampleRate,
      maxSampleRate,
      rates['B'].rarityWeight
    );

    expect(rateA).toBeGreaterThan(rateB);

    [rateA, rateB].forEach((rate) => {
      expect(rate).toBeGreaterThanOrEqual(minSampleRate);
      expect(rate).toBeLessThanOrEqual(maxSampleRate);
    });
  });
});
