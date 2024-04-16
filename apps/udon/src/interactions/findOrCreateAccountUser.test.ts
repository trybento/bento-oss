import { applyFinalCleanupHook } from 'src/data/datatests';
import { accountUserAttrsChanged } from './findOrCreateAccountUser';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { subMinutes } from 'date-fns';

applyFinalCleanupHook();

describe('findOrCreateAccountUser', () => {
  const now = new Date();

  describe('accountAttrsChanged', () => {
    [
      // Nothing changed
      {
        updates: {
          externalId: 'test',
          fullName: 'John Smith',
          email: 'foo@acme.org',
          createdInOrganizationAt: now.toISOString(),
        },
        expectedResult: false,
      },

      // Created in organization changed
      {
        updates: {
          externalId: 'test',
          fullName: 'John Smith',
          email: 'foo@acme.org',
          createdInOrganizationAt: subMinutes(now, 5).toISOString(),
        },
        expectedResult: true,
      },

      // Name changed
      {
        updates: {
          externalId: 'test',
          fullName: 'Jack Smith',
          email: 'foo@acme.org',
          createdInOrganizationAt: now.toISOString(),
        },
        expectedResult: true,
      },

      // Email changed
      {
        updates: {
          externalId: 'test',
          fullName: 'John Smith',
          email: 'john@acme.org',
          createdInOrganizationAt: now.toISOString(),
        },
        expectedResult: true,
      },

      // Undefined vs. null
      {
        updates: {
          externalId: 'test',
          fullName: 'John Smith',
          email: 'foo@acme.org',
          createdInOrganizationAt: undefined,
        },
        accountUserOverride: {
          createdInOrganizationAt: null,
        },
        expectedResult: false,
      },
    ].forEach((t, i) =>
      test(`It should return '${
        t.expectedResult ? 'true' : 'false'
      }' for test case ${i + 1}`, async () => {
        const au = new AccountUser({
          externalId: 'test',
          fullName: 'John Smith',
          email: 'foo@acme.org',
          createdInOrganizationAt: now,
          ...t.accountUserOverride,
        });

        expect(accountUserAttrsChanged(au, t.updates)).toEqual(
          t.expectedResult
        );
      })
    );
  });
});
