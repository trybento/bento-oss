import promises from './promises';

describe('Promise utilities', () => {
  describe('promises.map', () => {
    test('should run a mapping function for each item in an array, and return the results', async () => {
      const items = Array.from({ length: 5 }, (_, i) => i + 1);
      const mapper = async (n: number) => {
        const delay = n * 10;

        await new Promise((resolve) => setTimeout(resolve, delay));

        return delay;
      };

      const results = await promises.map(items, mapper);

      expect(results).toEqual([10, 20, 30, 40, 50]);
    });

    /**
     * Note that it's difficult to actually test the concurrency ordering here,
     * so this test is just to ensure it still results in the expected output.
     */
    test('should work with a concurrency setting', async () => {
      const items = Array.from({ length: 5 }, (_, i) => i + 1);
      const mapper = async (n: number) => {
        const delay = n * 10;

        await new Promise((resolve) => setTimeout(resolve, delay));

        return delay;
      };

      const results = await promises.map(items, mapper, { concurrency: 1 });

      expect(results).toEqual([10, 20, 30, 40, 50]);
    });
  });

  describe('promises.mapSeries', () => {
    test('should run a mapping function for each item in an array, and return the results', async () => {
      const items = Array.from({ length: 5 }, (_, i) => i + 1);
      const mapper = async (n: number) => {
        const delay = n * 10;

        await new Promise((resolve) => setTimeout(resolve, delay));

        return delay;
      };

      const results = await promises.mapSeries(items, mapper);

      expect(results).toHaveLength(5);
      expect(results).toEqual([10, 20, 30, 40, 50]);
    });
  });

  describe('promises.each', () => {
    test('should run a callback function for each item in an array', async () => {
      const items = Array.from({ length: 5 }, (_, i) => i + 1);
      const output: number[] = [];
      const callback = async (n: number) => {
        const delay = n * 10;

        await new Promise((resolve) => setTimeout(resolve, delay));

        output.push(delay);
      };

      await promises.each(items, callback);

      expect(output).toHaveLength(5);
      expect(output).toEqual([10, 20, 30, 40, 50]);
    });

    test('should work with a concurrency setting', async () => {
      const items = Array.from({ length: 5 }, (_, i) => i + 1);
      const output: number[] = [];
      const callback = async (n: number) => {
        const delay = n * 10;

        await new Promise((resolve) => setTimeout(resolve, delay));

        output.push(delay);
      };

      await promises.each(items, callback, { concurrency: 1 });

      expect(output).toEqual([10, 20, 30, 40, 50]);
    });
  });

  describe('promises.filter', () => {
    test('should run a predicate function for each item in an array, and return only items for which the predicate returns true', async () => {
      const items = Array.from({ length: 5 }, (_, i) => i + 1);
      const callback = async (n: number) => {
        const delay = n * 10;

        await new Promise((resolve) => setTimeout(resolve, delay));

        return n % 2 === 0;
      };

      const results = await promises.filter(items, callback);

      expect(results).toHaveLength(2);
      expect(results).toEqual([2, 4]);
    });
  });

  describe('promises.reduce', () => {
    test('should run a reduction function for each item in an array, and return the final output', async () => {
      const items = Array.from({ length: 5 }, (_, i) => i + 1);
      const callback = async (output: number, n: number) => {
        const delay = n * 10;

        await new Promise((resolve) => setTimeout(resolve, delay));

        return output + n;
      };

      const result = await promises.reduce(items, callback, 0);

      expect(result).toEqual(15);
    });
  });
});
