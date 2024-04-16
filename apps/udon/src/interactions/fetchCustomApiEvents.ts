import { BentoEvents, DataSource } from 'bento-common/types';
import { Op } from 'sequelize';
import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import {
  CustomApiEvent,
  CustomApiEventType,
} from 'src/data/models/CustomApiEvent.model';
import { Organization } from 'src/data/models/Organization.model';

type FetchCustomApiEventsArgs = {
  organization: Organization;
  name: string;
  loaders: Loaders;
  type: CustomApiEventType;
  excludeBentoEvents?: boolean;
  /** Exclude Bento-generated rows that are results of actions for visibility */
  excludePseudoEvents?: boolean;
};

type QueryRows = {
  id: number;
  type: CustomApiEventType;
}[];

interface InputType {
  object: object;
  string: string;
}

const getExcludeBentoEventsCondition = <K extends keyof InputType>(
  type: K
): InputType[K] => {
  const bentoEventsArray = Object.values(BentoEvents);

  return {
    object: {
      name: {
        [Op.not]: bentoEventsArray as any,
      },
    },
    string: `AND custom_api_events.name NOT IN (${bentoEventsArray.join(',')})`,
  }[type];
};

export default async function fetchCustomApiEvents({
  loaders,
  name,
  organization,
  type,
  excludeBentoEvents = false,
  excludePseudoEvents = false,
}: FetchCustomApiEventsArgs) {
  if (!name && !type) {
    return CustomApiEvent.findAll({
      where: {
        organizationId: organization.id,
        ...(excludeBentoEvents ? getExcludeBentoEventsCondition('object') : {}),
        ...(excludePseudoEvents
          ? {
              source: {
                [Op.not]: DataSource.bento,
              },
            }
          : {}),
      },
    });
  }

  let matchingEventIds: QueryRows;

  if (name) {
    matchingEventIds = (await queryRunner({
      sql: `
				SELECT custom_api_events.id, custom_api_events.type
				FROM core.custom_api_events
				WHERE custom_api_events.organization_id = :organizationId
        ${excludeBentoEvents ? getExcludeBentoEventsCondition('string') : ''}
				AND LOWER(custom_api_events.name) ILIKE :eventNameQuery;
			`,
      replacements: {
        eventNameQuery: `%${name.toLowerCase()}%`,
        organizationId: organization.id,
      },
    })) as QueryRows;

    if (type)
      matchingEventIds = matchingEventIds.filter((row) => row.type === type);
  } else {
    return CustomApiEvent.findAll({
      where: {
        organizationId: organization.id,
        type: type,
        ...(excludeBentoEvents ? getExcludeBentoEventsCondition('object') : {}),
      },
    });
  }

  return loaders.customApiEventLoader.loadMany(
    matchingEventIds.map((row) => row.id)
  );
}
