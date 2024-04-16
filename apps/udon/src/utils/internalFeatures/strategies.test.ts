import { percentage, rateDict } from './strategies';

describe('internalFeatures strategies', () => {
  describe('percentage', () => {
    test('0% always returns false', () => {
      const result = percentage({ percentage: 0 });
      expect(result).toEqual(false);
    });

    test('20% returns true roughly 2/10 of times', () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.12);
      const result = percentage({ percentage: 20 });
      expect(result).toEqual(true);
      jest.spyOn(global.Math, 'random').mockRestore();
    });

    test('100% always returns false', () => {
      const result = percentage({ percentage: 100 });
      expect(result).toEqual(true);
    });
  });

  describe('rateDict', () => {
    test('empty entry always returns false', () => {
      const result = rateDict('key', {});
      expect(result).toEqual(false);
    });

    test('0% always returns false', () => {
      const result = rateDict('key', { key: 0 });
      expect(result).toEqual(false);
    });

    test('100% always returns true', () => {
      for (let i = 0; i < 30; i++) {
        const result = rateDict('key', { key: 100 });
        expect(result).toEqual(true);
      }
    });

    test('matches partial definitions', () => {
      for (let i = 0; i < 30; i++) {
        const result = rateDict('query keyQuery', { key: 100 });
        expect(result).toEqual(true);
      }
    });
  });
});
