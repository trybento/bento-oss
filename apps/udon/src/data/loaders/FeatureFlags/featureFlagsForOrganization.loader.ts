import DataLoader from 'dataloader';
import { groupBy, uniq } from 'lodash';

import { queryRunner } from 'src/data';
import { addAliasedFlags } from 'src/utils/features/utils';

export default function featureFlagsForOrganizationLoader() {
  return new DataLoader<number, string[]>(async (orgIds) => {
    const rows = (await queryRunner({
      sql: `
        select
          ff.name
          , enabled_for_all
          , fe.organization_id
        from
          core.feature_flags ff
        left join
          core.feature_flag_enabled fe on (ff.id = fe.feature_flag_id)
        where
          ff.enabled_for_all = true
        or
          fe.organization_id in (:orgIds)
        ;
        `,
      replacements: { orgIds },
    })) as {
      name: string;
      enabled_for_all: boolean;
      organization_id?: number;
    }[];
    const { true: enabledForAll, false: enabledForOrg } = groupBy(
      rows,
      'enabled_for_all'
    );
    const enabledForOrgByOrg = groupBy(enabledForOrg, 'organization_id');
    const flagsEnabledForAll = enabledForAll?.map((ff) => ff.name) || [];

    return orgIds.map((org) =>
      uniq(
        addAliasedFlags(
          flagsEnabledForAll.concat(
            enabledForOrgByOrg[org]?.map((ff) => ff.name) || []
          )
        )
      )
    );
  });
}
