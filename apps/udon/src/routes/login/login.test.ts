import { OrgState } from 'bento-common/types';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { getDummyOrganization } from 'src/testUtils/dummyDataHelpers';
import { Organization } from 'src/data/models/Organization.model';
import { UserOrganization } from 'src/data/models/UserOrganization.model';
import { randomFromArray } from 'src/utils/helpers';
import {
  confirmUserPartOfOrg,
  getEligibleOrganizations,
} from './login.helpers';

const getContext = setupAndSeedDatabaseForTests('bento');

const createDummyOrg = async () => {
  const dummyOrg = getDummyOrganization();
  return await Organization.create({
    name: dummyOrg.name,
    slug: dummyOrg.slug,
    domain: `${dummyOrg.slug}.co.biz.uk`,
    state: OrgState.Active,
  });
};

describe('multi org logins', () => {
  let newOrg: Organization;
  beforeEach(async () => {
    newOrg = await createDummyOrg();
  });

  test('only returns one joined org', async () => {
    const { user, organization } = getContext();
    const eligibleOrgs = await getEligibleOrganizations(user);

    expect(eligibleOrgs.length).toEqual(1);
    const [retOrg] = eligibleOrgs;

    expect(retOrg.entityId).toEqual(organization.entityId);
  });

  test('adds to another org', async () => {
    const { user, organization } = getContext();

    expect(newOrg).toBeTruthy();

    await UserOrganization.create({
      userId: user.id,
      organizationId: newOrg.id,
      isDefault: false,
    });

    const eligibleOrgs = await getEligibleOrganizations(user);
    expect(eligibleOrgs.length).toEqual(2);

    expect(eligibleOrgs.map((o) => o.entityId)).toContain(
      organization.entityId
    );
    expect(eligibleOrgs.map((o) => o.entityId)).toContain(newOrg.entityId);
  });

  test('checks user is part of org', async () => {
    const { user, organization } = getContext();

    const [eligible, userFound] = await confirmUserPartOfOrg(
      user.entityId,
      organization.entityId
    );

    expect(eligible).toBeTruthy();
    expect(userFound?.isSuperadmin).toBeFalsy();
  });

  test('checks user not in org', async () => {
    const { user, organization } = getContext();

    const [eligible, eligibleUserFound] = await confirmUserPartOfOrg(
      user.entityId,
      organization.entityId
    );
    const [eligibleInNewOrg, eligibleInNewOrgUserFound] =
      await confirmUserPartOfOrg(user.entityId, newOrg.entityId);

    expect(eligible).toBeTruthy();
    expect(eligibleUserFound?.isSuperadmin).toBeFalsy();
    expect(eligibleInNewOrg).toBeFalsy();
    expect(eligibleInNewOrgUserFound?.isSuperadmin).toBeFalsy();
  });

  test('returns all orgs for superuser', async () => {
    const { user } = getContext();
    await user.update({ isSuperadmin: true });

    const eligibleOrgs = await getEligibleOrganizations(user);

    for (let i = 0; i < 4; i++) {
      await createDummyOrg();
    }

    const explicitLinks = await UserOrganization.count({
      where: { userId: user.id },
    });

    expect(eligibleOrgs.length).toBeGreaterThan(explicitLinks);
  });

  test('superuser eligible for all orgs without explicit add', async () => {
    const { user } = getContext();
    await user.update({ isSuperadmin: true });

    const orgList: Organization[] = [];
    for (const _ of [0, 1, 3, 4]) {
      const org = await createDummyOrg();
      orgList.push(org);
    }

    for (let i = 0; i < 4; i++) {
      const randomOrg = randomFromArray(orgList);
      const [eligible, userFound] = await confirmUserPartOfOrg(
        user.entityId,
        randomOrg.entityId
      );
      expect(eligible).toBeTruthy();
      expect(userFound?.isSuperadmin).toBeTruthy();
    }
  });
});
