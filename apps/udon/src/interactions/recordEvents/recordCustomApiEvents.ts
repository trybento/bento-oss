import { DataSource, CustomApiEventEntityType } from 'bento-common/types';
import { AccountUser } from 'src/data/models/AccountUser.model';
import {
  CustomApiEvent,
  CustomApiEventProperties,
  CustomApiEventType,
  EventDebugInformation,
} from 'src/data/models/CustomApiEvent.model';
import { disableTransaction } from 'src/data';
import { Account } from 'src/data/models/Account.model';
import { consumeApiEventDebugger } from 'src/interactions/recordEvents/recordEventRateLimiter';
import { enableCreateEventMetadata } from 'src/utils/internalFeatures/internalFeatures';
import { AccountCustomApiEvent } from 'src/data/models/AccountCustomApiEvent.model';
import { AccountUserCustomApiEvent } from 'src/data/models/AccountUserCustomApiEvent.model';

type EventProperties = {
  [attributeName: string]: object | string | number | boolean;
};

type Args = {
  eventName: string;
  organizationId: number;
  eventProperties: EventProperties;
  source?: DataSource;
  internalProperties?: CustomApiEventProperties;
  debugInformation?: EventDebugInformation;
  accountUserId?: number;
};

export const createEventMetadataForEntity = async ({
  entityId,
  entityType,
  eventName,
}: {
  entityId: string;
  entityType: CustomApiEventEntityType;
  eventName: string;
}) => {
  if (entityType === CustomApiEventEntityType.account) {
    const where = {
      accountEntityId: entityId,
      eventName,
    };

    const exists = await AccountCustomApiEvent.findOne({
      where,
      attributes: ['id'],
    });

    if (!exists) {
      await AccountCustomApiEvent.upsert(where, {
        conflictFields: ['account_entity_id', 'event_name'] as any,
      });
    }
  } else {
    const where = {
      accountUserEntityId: entityId,
      eventName,
    };

    const exists = await AccountUserCustomApiEvent.findOne({
      where,
      attributes: ['id'],
    });

    if (!exists) {
      await AccountUserCustomApiEvent.upsert(where, {
        conflictFields: ['account_user_entity_id', 'event_name'] as any,
      });
    }
  }
};

/**
 * Record a custom event to be used later.
 *
 * Custom events can be from APIs, Segment or Bento itself.
 *
 * Useful to look up and show customers what events/properties they
 * are passing into Bento and can be used within features like targeting
 * and auto-complete.
 */
export async function recordCustomApiEvent({
  eventName,
  organizationId,
  eventProperties = {},
  source = DataSource.api,
  internalProperties = {},
  debugInformation,
  accountUserId,
}: Args) {
  if (!eventName || !organizationId) return;

  const shouldDebug = await consumeApiEventDebugger(
    organizationId,
    `eventName:${eventName}`
  );

  await disableTransaction(async () => {
    if (shouldDebug) {
      const eventData: Partial<CustomApiEvent> = {
        type: CustomApiEventType.Event,
        name: eventName,
        source,
        organizationId,
        properties: internalProperties,
        lastSeen: new Date(),
        debugInformation,
      };

      await CustomApiEvent.upsert(eventData, {
        returning: false,
        conflictFields: ['organization_id', 'name'],
      });

      const eventPropertiesToUpsert = Object.keys(eventProperties).map(
        (key) => ({
          type: CustomApiEventType.EventProperty,
          organizationId,
          name: key,
          lastSeen: new Date(),
          source,
        })
      );

      // Optimistically and separately record each event property
      if (eventPropertiesToUpsert.length > 0) {
        try {
          await CustomApiEvent.bulkCreate(eventPropertiesToUpsert, {
            ignoreDuplicates: true,
          });
        } catch (innerError) {
          const outerError = new Error(
            'Failed to record custom API event properties'
          );
          console.error(outerError, innerError);
        }
      }
    }

    // If we have an account user, then log the event for the account and account user as well
    if (accountUserId && (await enableCreateEventMetadata.enabled())) {
      const accountUser = await AccountUser.findOne({
        where: { id: accountUserId },
        attributes: ['entityId'],
        include: [
          {
            model: Account.scope('notArchived'),
            required: true,
            attributes: ['entityId'],
          },
        ],
      });

      if (accountUser) {
        // Insert event metadata for both the account and account user level
        await Promise.all([
          createEventMetadataForEntity({
            entityId: accountUser.entityId,
            entityType: CustomApiEventEntityType.user,
            eventName,
          }),
          createEventMetadataForEntity({
            entityId: accountUser.account.entityId,
            entityType: CustomApiEventEntityType.account,
            eventName,
          }),
        ]);
      }
    }
  });
}

/**
 * @deprecated use `recordCustomApiEvent` instead for perf reasons
 */
export async function recordEventSeen(customApiEvent: CustomApiEvent) {
  return customApiEvent.update({ lastSeen: new Date() });
}
