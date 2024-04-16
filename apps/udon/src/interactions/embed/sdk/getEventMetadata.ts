import { AccountCustomApiEvent } from 'src/data/models/AccountCustomApiEvent.model';
import { AccountUserCustomApiEvent } from 'src/data/models/AccountUserCustomApiEvent.model';
import {
  CustomApiEventEntityType,
  GetEventMetadataResult,
} from 'bento-common/types';

export const getEventMetadata = async ({
  entityId,
  entityType,
  eventName,
}: {
  entityId: string;
  entityType: CustomApiEventEntityType;
  eventName: string;
}): Promise<GetEventMetadataResult> => {
  const event = await (entityType === CustomApiEventEntityType.account
    ? AccountCustomApiEvent.findOne({
        where: { accountEntityId: entityId, eventName },
        attributes: ['id'],
      })
    : AccountUserCustomApiEvent.findOne({
        where: { accountUserEntityId: entityId, eventName },
        attributes: ['id'],
      }));

  return {
    receivedCount: !!event ? 1 : 0,
    received: !!event,
  };
};
