import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { createEventMetadataForEntity } from './recordCustomApiEvents';
import { CustomApiEventEntityType } from 'bento-common/types';
import { AccountCustomApiEvent } from 'src/data/models/AccountCustomApiEvent.model';
import { AccountUserCustomApiEvent } from 'src/data/models/AccountUserCustomApiEvent.model';

const getContext = setupAndSeedDatabaseForTests('bento');

describe('recordCustomApiEvents', () => {
  describe('createEventMetadataForEntity', () => {
    test('should create a new account event', async () => {
      const { account } = getContext();

      await createEventMetadataForEntity({
        entityId: account.entityId,
        entityType: CustomApiEventEntityType.account,
        eventName: 'guide-received',
      });

      const events = await AccountCustomApiEvent.findAll({
        where: {
          accountEntityId: account.entityId,
        },
      });

      expect(events).toHaveLength(1);

      const [event] = events;

      expect(event).toHaveProperty('accountEntityId', account.entityId);
      expect(event).toHaveProperty('eventName', 'guide-received');
    });

    test('should NOT update an existing account event', async () => {
      const { account } = getContext();

      await createEventMetadataForEntity({
        entityId: account.entityId,
        entityType: CustomApiEventEntityType.account,
        eventName: 'guide-received',
      });

      // Artificially delay next event by 50ms
      await new Promise((resolve) => setTimeout(resolve, 50));

      await createEventMetadataForEntity({
        entityId: account.entityId,
        entityType: CustomApiEventEntityType.account,
        eventName: 'guide-received',
      });

      const events = await AccountCustomApiEvent.findAll({
        where: {
          accountEntityId: account.entityId,
        },
      });

      expect(events).toHaveLength(1);

      const [event] = events;

      expect(event).toHaveProperty('accountEntityId', account.entityId);
      expect(event).toHaveProperty('eventName', 'guide-received');

      // If updated and created are identical, we can assume the row did not update
      expect(event.updatedAt.toISOString()).toBe(event.createdAt.toISOString());
    });

    test('should create a new account user event', async () => {
      const { accountUser } = getContext();

      await createEventMetadataForEntity({
        entityId: accountUser.entityId,
        entityType: CustomApiEventEntityType.user,
        eventName: 'guide-received',
      });

      const events = await AccountUserCustomApiEvent.findAll({
        where: {
          accountUserEntityId: accountUser.entityId,
        },
      });

      expect(events).toHaveLength(1);

      const [event] = events;

      expect(event).toHaveProperty('accountUserEntityId', accountUser.entityId);
      expect(event).toHaveProperty('eventName', 'guide-received');
    });

    test('should NOT update an existing account user event', async () => {
      const { accountUser } = getContext();

      await createEventMetadataForEntity({
        entityId: accountUser.entityId,
        entityType: CustomApiEventEntityType.user,
        eventName: 'guide-received',
      });

      // Artificially delay next event by 50ms
      await new Promise((resolve) => setTimeout(resolve, 50));

      await createEventMetadataForEntity({
        entityId: accountUser.entityId,
        entityType: CustomApiEventEntityType.user,
        eventName: 'guide-received',
      });

      const events = await AccountUserCustomApiEvent.findAll({
        where: {
          accountUserEntityId: accountUser.entityId,
        },
      });

      expect(events).toHaveLength(1);

      const [event] = events;

      expect(event).toHaveProperty('accountUserEntityId', accountUser.entityId);
      expect(event).toHaveProperty('eventName', 'guide-received');

      // If updated and created are identical, we can assume the row did not update
      expect(event.updatedAt.toISOString()).toBe(event.createdAt.toISOString());
    });
  });
});
