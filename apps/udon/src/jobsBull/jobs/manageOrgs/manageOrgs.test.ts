import { addDays } from 'date-fns';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import {
  manageExpiredOrgs,
  TESTMODE_ALLOTTED_GUIDES,
} from './manageOrgs.helpers';
import { OrgState } from 'bento-common/types';

import * as queuer from 'src/jobsBull/queues';
import * as sendEmail from '../../../utils/notifications/sendEmail';
import { getDummyOrganization } from 'src/testUtils/dummyDataHelpers';
import { Organization } from 'src/data/models/Organization.model';
import { randomInt } from 'src/utils/helpers';
import { JobType } from 'src/jobsBull/job';

setupAndSeedDatabaseForTests('bento');

/**
 * Gets dummy orgs with a very specific property to partition from picking up
 *   orgs used in other tests
 */
const getDummyOrgs = (count: number, additional?: Partial<Organization>) => {
  const orgData: Partial<Organization>[] = [];
  for (let i = 0; i < count; i++) {
    orgData.push({
      ...getDummyOrganization(),
      options: {
        allottedGuides: TESTMODE_ALLOTTED_GUIDES,
      },
      ...(additional || {}),
    });
  }

  return orgData;
};
const spiedQueue = jest.spyOn(queuer, 'queueJob');
const spiedAlert = jest.spyOn(sendEmail, 'sendEmail');

describe('manage orgs', () => {
  beforeEach(async () => {
    spiedQueue.mockClear();
    spiedAlert.mockClear();

    /* Keep control of the environment */
    await Organization.destroy({
      where: {
        'options.allottedGuides': TESTMODE_ALLOTTED_GUIDES,
      },
    });
  });

  test('does nothing if no orgs eligible', async () => {
    await manageExpiredOrgs(undefined, true);

    expect(spiedQueue).not.toBeCalledWith(
      expect.objectContaining({
        jobType: JobType.DeleteOrganization,
      })
    );
    expect(spiedAlert).toHaveBeenCalledTimes(0);
  });

  test('alerts on pending orgs', async () => {
    const twoDaysFromNow = addDays(new Date(), 2);
    const fortyDaysFromNow = addDays(new Date(), 40);

    /* Create bunch of other junk we shouldn't pick up */
    const numPendingOrgs = randomInt(1, 5);
    const numRegOrgs = randomInt(1, 5);
    const numFutureDeleteOrgs = randomInt(1, 5);

    const orgsToCreate = [
      ...getDummyOrgs(numRegOrgs),
      ...getDummyOrgs(numPendingOrgs, {
        deleteAt: twoDaysFromNow,
        state: OrgState.Inactive,
      }),
      ...getDummyOrgs(numFutureDeleteOrgs, {
        deleteAt: fortyDaysFromNow,
        state: OrgState.Inactive,
      }),
    ];

    await Organization.bulkCreate(orgsToCreate);

    await manageExpiredOrgs(undefined, true);

    expect(spiedQueue).toHaveBeenCalledTimes(0);
    expect(spiedAlert).toHaveBeenCalledTimes(1);
  });

  test('queues doomed orgs to purge', async () => {
    const twoDaysAgo = addDays(new Date(), -2);
    const fortyDaysFromNow = addDays(new Date(), 40);

    const numDeletableOrgs = randomInt(1, 5);
    const numRegOrgs = randomInt(1, 5);
    const numFutureDeleteOrgs = randomInt(1, 3);

    const orgsToCreate = [
      ...getDummyOrgs(numRegOrgs),
      ...getDummyOrgs(numDeletableOrgs, {
        deleteAt: twoDaysAgo,
        state: OrgState.Inactive,
      }),
      ...getDummyOrgs(numFutureDeleteOrgs, {
        deleteAt: fortyDaysFromNow,
        state: OrgState.Inactive,
      }),
    ];

    await Organization.bulkCreate(orgsToCreate);

    await manageExpiredOrgs(undefined, true);

    expect(spiedQueue).toHaveBeenCalledTimes(numDeletableOrgs);
    expect(spiedAlert).toHaveBeenCalledTimes(0);
  });
});
