import { SelectedModelAttrs } from 'bento-common/types';

import { Organization } from 'src/data/models/Organization.model';
import { Loaders } from 'src/data/loaders';
import { QueryDatabase, queryRunner } from 'src/data';

type Args = {
  attributeName: string;
  organization: SelectedModelAttrs<Organization, 'id'>;
  loaders?: Loaders;
  fetchOne?: boolean;
};

export default async function fetchAutocompletedStepsForAttribute({
  attributeName,
  organization,
  loaders,
  fetchOne,
}: Args) {
  const rows = (await queryRunner({
    sql: `--sql
		SELECT sp.id AS step_prototype_id
    FROM core.step_event_mapping_rules semr
		JOIN core.step_event_mappings sem ON semr.step_event_mapping_id = sem.id
		JOIN core.step_prototypes sp ON sem.step_prototype_id = sp.id
		JOIN core.modules_step_prototypes msp on msp.step_prototype_id = sp.id
		JOIN core.modules m ON msp.module_id = m.id
		WHERE semr.organization_id = :organizationId
			AND semr.property_name = :attributeName
		${fetchOne ? 'LIMIT 1' : ''}
		`,
    replacements: {
      attributeName,
      organizationId: organization.id,
    },
    queryDatabase: QueryDatabase.follower,
  })) as { step_prototype_id: number }[];

  if (rows.length === 0) return [];

  const spIds = rows.map((r) => r.step_prototype_id);

  if (!loaders) return spIds;

  return loaders.stepPrototypeLoader.loadMany(spIds);
}
