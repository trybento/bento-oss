import { QueryDatabase, queryRunner } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';
import { addAliasedFlags } from 'src/utils/features/utils';

/**
 * NOTE: Currently should only be used to fetch the *client* enabled
 * feature flags for an organization.
 */
export default async function fetchFeatureFlags(
  organization: Organization
): Promise<string[]> {
  const rows = (await queryRunner({
    sql: `--sql
      select
        ff.name
      from
        core.feature_flags ff
      left join
        core.feature_flag_enabled fe on (ff.id = fe.feature_flag_id)
      where
        ff.send_to_embeddable = true
        and (
          ff.enabled_for_all = true
          or fe.organization_id = :organizationId
        )
      group by ff.id
    ;`,
    replacements: {
      organizationId: organization.id,
    },
    queryDatabase: QueryDatabase.primary,
  })) as {
    name: string;
  }[];

  return addAliasedFlags(rows.map((ff) => ff.name));
}
