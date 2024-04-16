import { px } from './dom';

describe('dom', () => {
  describe('px', () => {
    test('undefined value returns undefined', () => {
      expect(px(undefined)).toBeUndefined();
    });

    test('string in pixels returns itself', () => {
      expect(px('60px')).toEqual('60px');
    });

    test.each([0, 10, '10', 4, -9, '-59'])(
      '%s value returns string in pixels',
      (value) => {
        expect(px(value)).toEqual(`${value}px`);
      }
    );
  });
});
