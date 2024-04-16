import { queryRunner } from 'src/data';
import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { FeatureFlag } from 'src/data/models/FeatureFlag.model';
import { FeatureFlagEnabled } from 'src/data/models/FeatureFlagEnabled.model';
import { queries } from './db';

const getContext = setupAndSeedDatabaseForTests('bento');

async function addDefaultOrg(orgSlug: string) {
  await queryRunner({
    sql: `
				INSERT INTO core.feature_flag_default_orgs (organization_id)
				SELECT o.id FROM core.organizations o WHERE o.slug = :orgSlug
			`,
    replacements: {
      orgSlug: orgSlug,
    },
  });
}

describe('feature flags', () => {
  afterEach(async () => {
    // cleanup
    await queryRunner({
      sql: `DELETE FROM core.feature_flag_default_orgs`,
    });
    await queryRunner({
      sql: `DELETE FROM core.feature_flag_enabled`,
    });
  });

  test('query for default orgs returns results', async () => {
    const { organization } = getContext();

    const before = await queryRunner({ sql: queries.GET_DEFAULT_ORGS_QUERY });

    await addDefaultOrg(organization.slug);

    const after = await queryRunner({ sql: queries.GET_DEFAULT_ORGS_QUERY });
    expect(after.length).toBeGreaterThan(before.length);
  });

  test('can add feature flags to default orgs', async () => {
    const { organization } = getContext();

    await addDefaultOrg(organization.slug);

    const orgs = (await queryRunner({
      sql: queries.GET_DEFAULT_ORGS_QUERY,
    })) as { name: string }[];
    expect(orgs.length).toBeGreaterThan(0);

    const orgNames = orgs.map((r) => r.name);

    const ff = await FeatureFlag.findOne();

    if (!ff) throw 'No feature flag to test';

    const before = await FeatureFlagEnabled.count();

    await queryRunner({
      sql: queries.SET_FOR_DEFAULT_ORGS_QUERY,
      replacements: {
        orgNames,
        featureFlagId: ff.id,
      },
    });

    const after = await FeatureFlagEnabled.count();

    expect(after).toBeGreaterThan(before);
  });
});
