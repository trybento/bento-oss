import { omit } from 'lodash';
import { AtLeast } from 'bento-common/types';
import {
  NpsPageTargetingType,
  NpsSurveyInput,
} from 'bento-common/types/netPromoterScore';

import { withTransaction } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';
import { extractId } from 'src/utils/helpers';
import NpsSurvey, {
  immutableFields,
  NpsSurveyCreationAttributes,
} from 'src/data/models/NetPromoterScore/NpsSurvey.model';

type Args = {
  /** Org to which the NPS Survey should belong to */
  organization: number | AtLeast<Organization, 'id'>;
  /** Details of the NPS Survey to either create or update */
  input: NpsSurveyInput;
  /** Entity Id of the target NPS survey to update */
  entityId?: string;
};

/**
 * Upserts a NPS survey.
 *
 * @returns Promise the created or updated NpsSurvey instance
 */
export default async function upsertNpsSurvey({
  organization,
  entityId,
  input,
}: Args): Promise<
  [
    /** The NPS survey instance affected */
    npsSurvey: NpsSurvey,
    /** Whether the instance was just created */
    created: boolean
  ]
> {
  if (input.pageTargeting?.type === NpsPageTargetingType.anyPage) {
    input.pageTargeting.url = null;
  }

  const formattedInput: NpsSurveyCreationAttributes = {
    ...omit(input, immutableFields.concat('pageTargeting')),
    entityId,
    organizationId: extractId(organization),
    pageTargetingType: input.pageTargeting?.type,
    pageTargetingUrl: input.pageTargeting?.url,
  };

  return await withTransaction(async () => {
    const [npsSurvey, created] = (await NpsSurvey.scope({
      method: ['fromOrganization', extractId(organization)],
    }).upsert(formattedInput, {
      returning: true,
      conflictFields: ['entity_id' as 'entityId'],
    })) as [NpsSurvey, boolean];

    /** @todo handle the side effects of priority ranking getting updated */

    return [npsSurvey, created];
  });
}
