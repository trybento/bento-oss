import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { getCacheKey, isCacheHit } from './identifyChecksCache';
import { setupAndSeedDatabaseForTests } from 'src/data/datatests';

const getContext = setupAndSeedDatabaseForTests('paydayio');

jest.mock('src/utils/internalFeatures/internalFeatures', () => ({
  ...jest.requireActual('src/utils/internalFeatures/internalFeatures'),
  enableLaunchingCacheChecks: {
    enabled: jest.fn(() => false),
  },
}));

describe('identifyChecksCache', () => {
  describe('getCacheKey', () => {
    test('return account cache key correctly', () => {
      const account = new Account({ id: 1 });
      expect(getCacheKey(account)).toEqual('identifyCheck:a:1');
    });

    test('return account user cache key correctly', () => {
      const accountUser = new AccountUser({ id: 2 });
      expect(getCacheKey(accountUser)).toEqual('identifyCheck:au:2');
    });
  });

  describe('isCacheHit', () => {
    test('return false when ff is disabled', async () => {
      const { organization } = getContext();
      const accountUser = new AccountUser({ id: 1 });
      const result = await isCacheHit(organization, accountUser, false);
      expect(result).toEqual(false);
    });
  });
});
