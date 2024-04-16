import { Organization } from 'src/data/models/Organization.model';
import { Loaders } from 'src/data/loaders';
import { queryRunner } from 'src/data';
import { CustomApiEventProperties } from 'src/data/models/CustomApiEvent.model';

type Args = {
  eventName: string;
  organization: Organization;
  loaders: Loaders;
  internalProperties?: CustomApiEventProperties;
  fetchOne?: boolean;
};

export default async function fetchAutocompleteStepsForEvent({
  eventName,
  organization,
  loaders,
  internalProperties,
  fetchOne,
}: Args) {
  let spIds: number[];

  if (internalProperties?.stepPrototypeId) {
    spIds = [internalProperties.stepPrototypeId];
  } else {
    const rows = (await queryRunner({
      sql: `
			SELECT sp.id AS step_prototype_id FROM core.step_event_mappings sem
			JOIN core.step_prototypes sp ON sem.step_prototype_id = sp.id
			JOIN core.modules_step_prototypes msp on msp.step_prototype_id = sp.id
			JOIN core.modules m ON msp.module_id = m.id
			WHERE sem.organization_id = :organizationId
				AND sem.event_name = :eventName
			${fetchOne ? 'LIMIT 1' : ''}
			`,
      replacements: {
        eventName,
        organizationId: organization.id,
      },
    })) as { step_prototype_id: number }[];

    spIds = rows.map((r) => r.step_prototype_id);
  }

  if (spIds.length === 0) return [];

  return loaders.stepPrototypeLoader.loadMany(spIds);
}
