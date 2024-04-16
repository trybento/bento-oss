import { SelectedModelAttrs } from 'bento-common/types';

import { queryRunner } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';
import { addAliasedFlags } from 'src/utils/features/utils';
import { extractId } from 'src/utils/helpers';

export default async function fetchSpecificFeatureFlags(
  organization: SelectedModelAttrs<Organization, 'id'> | number,
  flags: string[]
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
        ff.name IN (:flags)
        and (
          ff.enabled_for_all = true
          or fe.organization_id = :organizationId
        )
      group by ff.id
    ;`,
    replacements: {
      organizationId: extractId(organization),
      flags,
    },
  })) as {
    name: string;
  }[];

  return addAliasedFlags(rows.map((ff) => ff.name));
}
