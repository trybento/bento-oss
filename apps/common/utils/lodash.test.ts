import {
  cloneDeep,
  debounce,
  difference,
  flow,
  flowRight,
  isEqual,
  keyBy,
  groupBy,
  omit,
  once,
  pick,
  throttle,
  unzip,
} from './lodash';

const baseObj = {
  one: 'one',
  two: 2,
  three: false,
  four: null,
  five: undefined,
  six: { woot: 'blah' },
  seven: [1, 2, 3, { hmm: 'yay' }],
};
const baseArrWithUniqueValues = [
  { one: 'one', two: 'two', three: 'three' },
  { one: 'two', two: 'four', three: 'six' },
  { one: 'three', two: 'six', three: 'nine' },
  { one: 'four', two: 'eight', three: 'twelve' },
  { one: 'five', two: 'ten', three: 'fifteen' },
];
const arrObjKeys: Array<keyof (typeof baseArrWithUniqueValues)[number]> = [
  'one',
  'two',
  'three',
];

const randomFromArr = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

type BaseObjKey = keyof typeof baseObj;

jest.useFakeTimers();

describe('pick', () => {
  test('includes properties which exist', () => {
    expect(pick(baseObj, Object.keys(baseObj) as BaseObjKey[])).toEqual({
      ...baseObj,
    });
  });

  test("excludes properties which don't exist", () => {
    expect(pick(baseObj, ['one', 'two', 'eight'] as BaseObjKey[])).toEqual({
      one: baseObj.one,
      two: baseObj.two,
    });
  });

  test('errors when not passed an object', () => {
    // @ts-ignore
    expect(() => pick('not an object', [])).toThrow();
  });
});

describe('omit', () => {
  test('excludes properties which exist', () => {
    expect(omit(baseObj, Object.keys(baseObj) as BaseObjKey[])).toEqual({});
  });

  test("ignores properties which don't exist", () => {
    const { one: _, two: __, ...rest } = baseObj;
    expect(omit(baseObj, ['one', 'two', 'eight'] as BaseObjKey[])).toEqual(
      rest
    );
  });

  test('errors when not passed an object', () => {
    // @ts-ignore
    expect(() => omit('not an object', [])).toThrow();
  });
});

describe('once', () => {
  test('only calls the fn once and returns original response for all other calls', () => {
    const fn = jest.fn((param: string) => param);
    const wrappedFn = once(fn);
    const return1 = wrappedFn('return');
    expect(fn).toHaveBeenCalledWith('return');
    expect(return1).toBe('return');
    const return2 = wrappedFn('param');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(return2).toBe('return');
  });
});

describe('keyBy', () => {
  test('keys by static string', () => {
    const expected = Object.fromEntries(
      ['two', 'four', 'six', 'eight', 'ten'].map((key, i) => [
        key,
        baseArrWithUniqueValues[i],
      ])
    );
    expect(keyBy(baseArrWithUniqueValues, 'two')).toEqual(expected);
  });

  test('keys by function', () => {
    const getKey = (value: (typeof baseArrWithUniqueValues)[number]) =>
      value.three;
    const expected = Object.fromEntries(
      ['three', 'six', 'nine', 'twelve', 'fifteen'].map((key, i) => [
        key,
        baseArrWithUniqueValues[i],
      ])
    );
    expect(keyBy(baseArrWithUniqueValues, getKey)).toEqual(expected);
  });
});

describe('groupBy', () => {
  test('keys by static string', () => {
    const chosenKey = randomFromArr(arrObjKeys);
    const dupedArr = [...baseArrWithUniqueValues, ...baseArrWithUniqueValues];

    Object.entries(groupBy(dupedArr, chosenKey)).forEach(([keyVal, list]) => {
      expect(list.length).toEqual(2);
      const original = baseArrWithUniqueValues.find(
        (v) => v[chosenKey] === keyVal
      );
      list.forEach((i) => {
        expect(i[chosenKey] === original[chosenKey]);
      });
    });
  });

  test('keys by function', () => {
    const chosenKey = randomFromArr(arrObjKeys);
    const getKey = (value: (typeof baseArrWithUniqueValues)[number]) =>
      value[chosenKey];
    const dupedArr = [...baseArrWithUniqueValues, ...baseArrWithUniqueValues];

    Object.entries(groupBy(dupedArr, getKey)).forEach(([keyVal, list]) => {
      expect(list.length).toEqual(2);
      const original = baseArrWithUniqueValues.find(
        (v) => v[chosenKey] === keyVal
      );
      list.forEach((i) => {
        expect(i[chosenKey] === original[chosenKey]);
      });
    });
  });
});

describe('isEqual', () => {
  test('strict equality', () => {
    expect(isEqual(baseObj, baseObj)).toBeTruthy();
    expect(isEqual('blah', 'blah')).toBeTruthy();
    expect(isEqual(22, 22)).toBeTruthy();
    expect(
      isEqual(baseArrWithUniqueValues, baseArrWithUniqueValues)
    ).toBeTruthy();
  });
  test('values of different types cannot be equal', () => {
    expect(isEqual('blah', baseObj)).toBeFalsy();
    expect(isEqual('blah', 22)).toBeFalsy();
    expect(isEqual(baseObj, 22)).toBeFalsy();
    expect(isEqual('blah', ['blah'])).toBeFalsy();
    expect(isEqual(baseObj, [baseObj])).toBeFalsy();
  });
  test('collections with different numbers of keys cannot be equal', () => {
    expect(isEqual([1, 2, 3], [1, 2])).toBeFalsy();
    expect(isEqual({ one: 'one' }, { one: 'one', two: 'two' })).toBeFalsy();
  });
  test('collections with different values cannot be equal', () => {
    expect(isEqual([1, 2, 3], [1, 3, 2])).toBeFalsy();
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBeFalsy();
    expect(
      isEqual({ one: 'one', two: 'two' }, { one: 'one', two: 'three' })
    ).toBeFalsy();
    expect(
      isEqual({ one: 'one', two: 'two' }, { one: 'one', three: 'three' })
    ).toBeFalsy();
  });
  test('collections with equal values', () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBeTruthy();
    expect(
      isEqual({ one: 'one', two: 'two' }, { one: 'one', two: 'two' })
    ).toBeTruthy();

    expect(isEqual(baseObj, cloneDeep(baseObj))).toBeTruthy();
  });
});

describe('unzip', () => {
  test('splits by array index', () => {
    const input = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    const output = [
      [1, 3, 5],
      [2, 4, 6],
    ];
    expect(unzip(input)).toEqual(output);
  });
  test('empty in = empty out', () => {
    expect(unzip([])).toEqual([]);
  });
});

describe('cloneDeep', () => {
  test('fully clones', () => {
    const result = cloneDeep(baseObj);
    expect(result).toEqual(baseObj);
    expect(result).not.toBe(baseObj);
    expect(result.six).not.toBe(baseObj.six);
    expect(result.seven).not.toBe(baseObj.seven);
    expect(result.seven[3]).not.toBe(baseObj.seven[3]);
  });
});

describe('difference', () => {
  test('includes missing items', () => {
    expect(difference([1, 2, 3], [1, 2, 4])).toEqual([3]);
    expect(difference([1, 2, 3, 4, 5, 6], [1, 2, 4], [1, 2, 5])).toEqual([
      3, 6,
    ]);
  });
});

describe('flow/flowRight', () => {
  let addOne: (n: number) => number;
  let double: (n: number) => number;
  let square: (n: number) => number;
  beforeEach(() => {
    addOne = jest.fn((v: number) => v + 1);
    double = jest.fn((v: number) => v * 2);
    square = jest.fn((v: number) => v * v);
  });
  test('flow calls the functions in order with the result of the previous', () => {
    const fn = flow([addOne, double, square]);
    expect(fn(2)).toBe(36); // ((x + 1) * 2) * x, x= 2
    expect(addOne).toHaveBeenCalledWith(2);
    expect(double).toHaveBeenCalledWith(3);
    expect(square).toHaveBeenCalledWith(6);
  });
  test('flowRight calls the functions in reverse order with the result of the previous', () => {
    const fn = flowRight([addOne, double, square]);
    expect(fn(2)).toBe(9); // ((x * x) * 2) + 1, x=2
    expect(square).toHaveBeenCalledWith(2);
    expect(double).toHaveBeenCalledWith(4);
    expect(addOne).toHaveBeenCalledWith(8);
  });
});

describe('debounce', () => {
  let fn: () => void;
  let debouncedFn: () => void;
  beforeEach(() => {
    fn = jest.fn();
  });
  describe('default options', () => {
    beforeEach(() => {
      debouncedFn = debounce(fn, 10);
    });
    test('single call', () => {
      debouncedFn();
      expect(fn).not.toHaveBeenCalled();
      jest.advanceTimersByTime(10);
      expect(fn).toHaveBeenCalledTimes(1);
    });
    test('multiple calls', () => {
      debouncedFn();
      debouncedFn();
      debouncedFn();
      expect(fn).not.toHaveBeenCalled();
      jest.advanceTimersByTime(10);
      expect(fn).toHaveBeenCalledTimes(1);
      debouncedFn();
      debouncedFn();
      jest.advanceTimersByTime(10);
      expect(fn).toHaveBeenCalledTimes(2);
      jest.advanceTimersByTime(10);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
  describe('leading', () => {
    beforeEach(() => {
      debouncedFn = debounce(fn, 10, { leading: true });
    });
    test('single call', () => {
      debouncedFn();
      expect(fn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(10);
      expect(fn).toHaveBeenCalledTimes(1);
    });
    test('multiple calls', () => {
      debouncedFn();
      debouncedFn();
      debouncedFn();
      expect(fn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(9);
      expect(fn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(2);
      debouncedFn();
      debouncedFn();
      expect(fn).toHaveBeenCalledTimes(3);
      jest.advanceTimersByTime(10);
      expect(fn).toHaveBeenCalledTimes(4);
      jest;
    });
  });
});

describe('throttle', () => {
  let fn: () => void;
  let throttledFn: () => void;
  beforeEach(() => {
    fn = jest.fn();
  });
  describe('default options', () => {
    beforeEach(() => {
      throttledFn = throttle(fn, 10);
    });
    test('single call', () => {
      throttledFn();
      expect(fn).not.toHaveBeenCalled();
      jest.advanceTimersByTime(10);
      expect(fn).toHaveBeenCalledTimes(1);
      throttledFn();
      jest.advanceTimersByTime(10);
      expect(fn).toHaveBeenCalledTimes(2);
    });
    test('multiple calls', () => {
      throttledFn();
      throttledFn();
      throttledFn();
      expect(fn).not.toHaveBeenCalled();
      jest.advanceTimersByTime(10);
      expect(fn).toHaveBeenCalledTimes(1);
      throttledFn();
      throttledFn();
      jest.advanceTimersByTime(10);
      expect(fn).toHaveBeenCalledTimes(2);
      jest.advanceTimersByTime(10);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
  describe('leading', () => {
    beforeEach(() => {
      throttledFn = debounce(fn, 10, { leading: true });
    });
    test('single call', () => {
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(10);
      expect(fn).toHaveBeenCalledTimes(1);
    });
    test('multiple calls', () => {
      throttledFn();
      throttledFn();
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(9);
      expect(fn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(2);
      jest.advanceTimersByTime(5);
      throttledFn();
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(3);
      jest.advanceTimersByTime(10);
      expect(fn).toHaveBeenCalledTimes(4);
    });
  });
});
