import { setupAndSeedDatabaseForTests } from 'src/data/datatests';

import { faker } from '@faker-js/faker';

import { Step, StepCompletedByType } from 'src/data/models/Step.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { LongRuleTypeEnum } from 'bento-common/types';
import searchAccounts from './searchAccounts';
import searchAccountUsers from './searchAccountUsers';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';

const getContext = setupAndSeedDatabaseForTests('bento');

const accountQFields: Array<keyof Pick<Account, 'name' | 'externalId'>> = [
  'name',
  'externalId',
];
const accountUserQFields: Array<
  keyof Pick<AccountUser, 'email' | 'fullName' | 'externalId'>
> = ['email', 'fullName', 'externalId'];

const searchModes = ['partial', 'match', 'non-match'];

const adjustQuery = (searchMode, query = '') => {
  if (searchMode === 'partial') {
    return query.slice(3);
  } else if (searchMode === 'non-match') {
    return query + 'woLol';
  }

  return query;
};

describe('account search', () => {
  describe.each([true, false])('with user filter %s', (filter) => {
    describe.each(searchModes)('with %s', (searchMode) => {
      test.each(accountQFields)('searches by %s', async (queryField) => {
        const { organization, account, accountUser } = getContext();

        const query = adjustQuery(searchMode, account[queryField]);

        const accounts = await searchAccounts({
          organizationId: organization.id,
          queryField,
          query,
          filterAccountUserEntityId: filter ? accountUser.entityId : undefined,
        });

        if (searchMode === 'non-match') {
          expect(accounts.length).toEqual(0);
        } else {
          expect(accounts.length).toBeGreaterThan(0);

          const inList = accounts.find((a) => a.entityId === account.entityId);

          expect(inList).toBeTruthy();
        }
      });
    });
  });
});

describe('account user search', () => {
  describe.each([true, false])('with account filter %s', (filter) => {
    describe.each(searchModes)('with %s', (searchMode) => {
      beforeEach(async () => {
        const { accountUser } = getContext();

        /** Seeded users may lack an email. */
        const email = `${accountUser.fullName ?? ''}@fakeMail.wow`;

        await accountUser.update({
          email,
        });
      });

      test.each(accountUserQFields)('searches by %s', async (queryField) => {
        const { organization, account, accountUser } = getContext();

        const query = adjustQuery(searchMode, accountUser[queryField]);

        const accountUsers = await searchAccountUsers({
          organizationId: organization.id,
          queryField,
          query,
          filterAccountEntityId: filter ? account.entityId : undefined,
        });

        if (searchMode === 'non-match') {
          expect(accountUsers.length).toEqual(0);
        } else {
          expect(accountUsers.length).toBeGreaterThan(0);

          const inList = accountUsers.find(
            (a) => a.entityId === accountUser.entityId
          );

          expect(inList).toBeTruthy();
        }
      });
    });
  });
});
