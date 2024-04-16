import { setupAndSeedDatabaseForTests } from 'src/data/datatests';

import { queryRunner } from 'src/data';
import { launchToAccountUser } from 'src/interactions/targeting/testHelpers';
import { NUDGE_QUERY } from './sendEndUserNudgeBatch';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import { Organization } from 'src/data/models/Organization.model';

const getContext = setupAndSeedDatabaseForTests('bento');

async function getNudges(org: Organization) {
  const rows = (await queryRunner({ sql: NUDGE_QUERY })) as {
    organizationId: number;
    email: string;
    guideId: number;
  }[];
  return rows.filter((row) => row.organizationId === org.id);
}

describe('nudges', () => {
  beforeEach(async () => {
    const { organization, accountUser } = getContext();
    await accountUser.update({
      email: `${accountUser.fullName}@joaoexpressmail.mailsite`,
    });
    await OrganizationSettings.update(
      {
        sendAccountUserNudges: true,
      },
      { where: { organizationId: organization.id } }
    );
  });

  test('returns nothing if no values', async () => {
    const { account, accountUser, organization } = getContext();

    await launchToAccountUser({ account, accountUser, organization });

    const nudges = await getNudges(organization);
    expect(nudges.length).toEqual(0);
  });

  test('generates a nudge request if a user fits criteria', async () => {
    const { account, accountUser, organization } = getContext();

    const { guideParticipant } = await launchToAccountUser({
      account,
      accountUser,
      organization,
    });

    const almostSevenDaysAgo: Date = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000 + 60000
    );

    await guideParticipant.update({ firstViewedAt: almostSevenDaysAgo });

    const nudges = await getNudges(organization);
    expect(nudges.length).toEqual(1);
    expect(nudges[0].email).toEqual(accountUser.email);
  });

  test('will not nudge if not time yet', async () => {
    const { account, accountUser, organization } = getContext();

    const { guideParticipant } = await launchToAccountUser({
      account,
      accountUser,
      organization,
    });

    const fiveDaysAgo: Date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

    await guideParticipant.update({ firstViewedAt: fiveDaysAgo });

    const nudges = await getNudges(organization);
    expect(nudges.length).toEqual(0);
  });

  test('will not nudge if completed', async () => {
    const { account, accountUser, organization } = getContext();

    const { guideParticipant, guide } = await launchToAccountUser({
      account,
      accountUser,
      organization,
    });

    const almostSevenDaysAgo: Date = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000 + 60000
    );

    await guide.update({ completedAt: almostSevenDaysAgo });
    await guideParticipant.update({ firstViewedAt: almostSevenDaysAgo });

    const nudges = await getNudges(organization);
    expect(nudges.length).toEqual(0);
  });

  test('will not nudge if internal user', async () => {
    const { account, accountUser, organization } = getContext();

    const { guideParticipant } = await launchToAccountUser({
      account,
      accountUser,
      organization,
    });

    const almostSevenDaysAgo: Date = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000 + 60000
    );

    await accountUser.update({ internal: true });
    await guideParticipant.update({ firstViewedAt: almostSevenDaysAgo });

    const nudges = await getNudges(organization);
    expect(nudges.length).toEqual(0);
  });
});
