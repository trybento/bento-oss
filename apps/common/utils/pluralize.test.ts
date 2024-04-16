import { pluralize } from './pluralize';

describe('pluralize', () => {
  test('returns singular word for 1', () => {
    expect(pluralize(1, 'cat', 'cats')).toBe('cat');
  });
  test('returns plural word for 2', () => {
    expect(pluralize(2, 'cat', 'cats')).toBe('cats');
  });
  test('constructs a default plural by appending "s"', () => {
    expect(pluralize(0, 'cat')).toBe('cats');
  });
  test('accepts an irregular plural', () => {
    expect(pluralize(2, 'person', 'people')).toBe('people');
  });
});
