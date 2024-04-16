import { isTransparent } from './color';

describe('isTransparent', () => {
  const testValues = [
    { color: '', result: false },
    { color: 'transparent', result: true },
    { color: 'TransParent', result: true },
    { color: 'TRANSPARENT', result: true },
    { color: '#000000', result: false },
    { color: '#00000000', result: true },
    { color: '#FFffFF00', result: true },
    { color: '#FFffFF000', result: false },
    { color: 'black', result: false },
    { color: 'red', result: false },
  ];

  testValues.forEach((testValue) => {
    test(`Expects color ${testValue.color} to be ${testValue.result}}`, () => {
      expect(isTransparent(testValue.color)).toBe(testValue.result);
    });
  });
});
