import { formatInputsWithAnswersForEmail } from './helpers';

describe('input fields helpers', () => {
  describe('formatInputsWithAnswersForEmail', () => {
    test('returns undefined if empty', async () => {
      const result = formatInputsWithAnswersForEmail([]);
      expect(result).toBeUndefined();
    });

    test('correctly returns 1 item', async () => {
      const result = formatInputsWithAnswersForEmail([
        { label: 'Full name', value: 'John Doe' },
      ]);

      expect(result).toEqual("Full name: 'John Doe'");
    });

    test('correctly returns 2 items', async () => {
      const result = formatInputsWithAnswersForEmail([
        { label: 'Full name', value: 'John Doe' },
        { label: 'Email', value: 'john@acme.com' },
      ]);

      expect(result).toEqual(
        "Full name: 'John Doe' and Email: 'john@acme.com'"
      );
    });

    test('correctly returns 3 or more items', async () => {
      const result = formatInputsWithAnswersForEmail([
        { label: 'Full name', value: 'John Doe' },
        { label: 'Email', value: 'john@acme.com' },
        { label: 'Team', value: 'engineering' },
      ]);

      expect(result).toEqual(
        "Full name: 'John Doe', Email: 'john@acme.com' and Team: 'engineering'"
      );
    });
  });
});
