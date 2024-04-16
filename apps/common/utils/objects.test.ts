import { crawlForKey } from './objects';

describe('crawl for key', () => {
  test('finds in flat obj', () => {
    const result = crawlForKey({ a: 1 }, 'a');

    expect(result).toContain(1);
  });

  test('searches in list', () => {
    const result = crawlForKey([{ a: 1 }, { a: 2 }], 'a');

    expect(result).toContain(1);
    expect(result).toContain(2);
  });

  test('ignores irrelevant keys', () => {
    const result = crawlForKey([{ a: 1 }, { b: 2 }], 'a');

    expect(result).toContain(1);
    expect(result).not.toContain(2);
  });

  test('searches nested objects', () => {
    const result = crawlForKey({ a: 1, o: { a: 2 } }, 'a');

    expect(result).toContain(1);
    expect(result).toContain(2);
  });

  test('ignores matching keys of non primitive values', () => {
    const result = crawlForKey({ a: { a: 1 } }, 'a');

    expect(result.length).toEqual(1);
  });
});
