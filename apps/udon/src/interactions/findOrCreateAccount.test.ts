import { applyFinalCleanupHook } from 'src/data/datatests';
import { accountAttrsChanged } from './findOrCreateAccount';
import { Account } from 'src/data/models/Account.model';
import { addMinutes } from 'date-fns';

applyFinalCleanupHook();

describe('findOrCreateAccount', () => {
  const now = new Date();

  describe('accountAttrsChanged', () => {
    [
      // Nothing changed
      {
        updates: {
          externalId: 'test',
          name: 'AcmeCo',
          createdInOrganizationAt: now.toISOString(),
        },
        expectedResult: false,
      },

      // Created in organization changed
      {
        updates: {
          externalId: 'test',
          name: 'AcmeCo',
          createdInOrganizationAt: addMinutes(now, 5).toISOString(),
        },
        expectedResult: true,
      },

      // // Name changed
      {
        updates: {
          externalId: 'test',
          name: 'Acme Widgets',
          createdInOrganizationAt: now.toISOString(),
        },
        expectedResult: true,
      },

      // Undefined vs. null
      {
        updates: {
          externalId: 'test',
          name: 'AcmeCo',
          createdInOrganizationAt: undefined,
        },
        accountOverride: {
          createdInOrganizationAt: null,
        },
        expectedResult: false,
      },
    ].forEach((t, i) =>
      test(`It should return '${
        t.expectedResult ? 'true' : 'false'
      }' for test case ${i + 1}`, async () => {
        const a = new Account({
          externalId: 'test',
          name: 'AcmeCo',
          createdInOrganizationAt: now,
          ...t.accountOverride,
        });

        expect(accountAttrsChanged(a, t.updates)).toEqual(t.expectedResult);
      })
    );
  });
});
