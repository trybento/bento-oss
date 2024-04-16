import { CustomApiEventEntityType } from 'bento-common/types';
import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { recordCustomApiEvent } from 'src/interactions/recordEvents/recordCustomApiEvents';
import { getEventMetadata } from './getEventMetadata';

const getContext = setupAndSeedDatabaseForTests('bento');

describe('getEventMetadata', () => {
  describe('account level', () => {
    test('returns `null` if event has not yet been received', async () => {
      const { account } = getContext();

      const result = await getEventMetadata({
        entityId: account.entityId,
        entityType: CustomApiEventEntityType.account,
        eventName: 'guideViewed',
      });

      expect(result).toHaveProperty('received', false);
    });

    test('returns metadata for events received', async () => {
      const { account, accountUser, organization } = getContext();

      await Promise.all([
        recordCustomApiEvent({
          eventName: 'guideViewed',
          organizationId: organization.id,
          eventProperties: {},
          accountUserId: accountUser.id,
        }),
      ]);

      const result = await getEventMetadata({
        entityId: account.entityId,
        entityType: CustomApiEventEntityType.account,
        eventName: 'guideViewed',
      });

      expect(result).toHaveProperty('received', true);
    });
  });

  describe('account user level', () => {
    test('returns `null` if event has not yet been received', async () => {
      const { accountUser } = getContext();

      const result = await getEventMetadata({
        entityId: accountUser.entityId,
        entityType: CustomApiEventEntityType.user,
        eventName: 'guideViewed',
      });

      expect(result).toHaveProperty('received', false);
    });

    test('returns metadata for events received', async () => {
      const { accountUser, organization } = getContext();

      await Promise.all([
        recordCustomApiEvent({
          eventName: 'guideViewed',
          organizationId: organization.id,
          eventProperties: {},
          accountUserId: accountUser.id,
        }),
      ]);

      const result = await getEventMetadata({
        entityId: accountUser.entityId,
        entityType: CustomApiEventEntityType.user,
        eventName: 'guideViewed',
      });

      expect(result).toHaveProperty('received', true);
    });
  });
});
