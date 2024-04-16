import { displayUrlToWildcardUrl } from 'bento-common/utils/wildcardUrlHelpers';
import { prefixUrl, sanitizeUrl } from './utils';

describe('sanitizeUrl', () => {
  test('cleans escape character', () => {
    const originalUrl =
      'https://app.stage.lightup.ai/#/ws/faaf8785-c475-4e86-95de-5c248d879069/addDataSource?returnTo=dataSourceList';
    const wildcardUrl = displayUrlToWildcardUrl(originalUrl);
    expect(sanitizeUrl(wildcardUrl)).toEqual(originalUrl);
  });
  test('url is not changed if no escape character is found', () => {
    const originalUrl =
      'https://app.stage.lightup.ai/#/ws/faaf8785-c475-4e86-95de-5c248d879069/addDataSource';
    expect(sanitizeUrl(originalUrl)).toEqual(originalUrl);
  });
});

describe('prefixUrl', () => {
  test('adds http if missing for localhost', () => {
    expect(prefixUrl('localhost:3000')).toEqual('http://localhost:3000');
  });
  test('adds https if missing', () => {
    expect(prefixUrl('everboarding.trybento.co')).toEqual(
      'https://everboarding.trybento.co'
    );
  });
  test('wont add anything if URL already starts with http/s', () => {
    expect(prefixUrl('http://everboarding.trybento.co')).toEqual(
      'http://everboarding.trybento.co'
    );
    expect(prefixUrl('https://everboarding.trybento.co')).toEqual(
      'https://everboarding.trybento.co'
    );
  });
});
