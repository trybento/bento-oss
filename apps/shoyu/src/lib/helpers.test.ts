import { navigateToUrl } from './helpers';

describe('helpers.ts', () => {
  beforeAll(() => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    delete window.open;
    // @ts-ignore
    window.location = { assign: jest.fn() };
    window.open = jest.fn();
  });

  afterAll(() => {
    window.location = location;
  });

  test.each([[false], [true]])(
    'strips out query string escape backslash before navigating',
    (newWindow) => {
      const url = 'https://demo.trybento.co/employees\\?tab=storage';
      const cleanedUrl = 'https://demo.trybento.co/employees?tab=storage';

      navigateToUrl(url, newWindow);

      if (newWindow) {
        expect(window.open).toHaveBeenCalledWith(cleanedUrl, '_blank');
      } else {
        expect(window.location.assign).toHaveBeenCalledWith(cleanedUrl);
      }
    }
  );
});
