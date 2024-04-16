import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { Events } from 'bento-common/types';
import { analytics } from './analytics';
import { Event } from 'src/data/models/Analytics/Event.model';
import { Template } from 'src/data/models/Template.model';
import { launchTemplateForTest } from 'src/graphql/Template/testHelpers';
import { GuideData } from 'src/data/models/Analytics/GuideData.model';
import captureGuideAnalytics from './captureGuideAnalytics';
import fetchTemplateStats from './fetchTemplateStats';
import { randomInt } from 'src/utils/helpers';
import { CapturedGuideAnalytics } from 'src/data/models/Analytics/CapturedGuideAnalytics.model';

const getContext = setupAndSeedDatabaseForTests('bento');

describe('analytics endpoints', () => {
  let createdEvent: Event | null;

  afterEach(async () => {
    if (createdEvent) await createdEvent.destroy();
  });

  test('should be able to generate through the analytics handler', async () => {
    const { organization, user } = getContext();
    await analytics.newEvent(Events.adminFocused, {
      organizationEntityId: organization.entityId,
      userEntityId: user.entityId,
    });

    createdEvent = await Event.findOne({
      where: { organizationEntityId: organization.entityId },
    });

    expect(createdEvent?.eventName).toBe(Events.adminFocused);
  });

  test('should run the additional hook with newEvent', async () => {
    const { organization, user } = getContext();

    const mockFunction = jest.fn((eventName) => eventName);

    (global as any).testMethod = mockFunction;

    await analytics.test.newEvent(Events.adminFocused, {
      organizationEntityId: organization.entityId,
      userEntityId: user.entityId,
    });

    createdEvent = await Event.findOne({
      where: { organizationEntityId: organization.entityId },
    });

    expect(createdEvent?.eventName).toBe(Events.adminFocused);
    expect(mockFunction.mock.calls.length).toBeGreaterThanOrEqual(1);
  });
});

describe('stat capturing', () => {
  test('generates capture rows', async () => {
    const { organization, account, accountUser } = getContext();

    const template = await Template.findOne({
      where: {
        organizationId: organization.id,
      },
    });

    if (!template) throw new Error('No template to test');

    const { guideBase } = await launchTemplateForTest(
      template.entityId,
      organization,
      account,
      accountUser
    );

    const guideData = await GuideData.findOne({
      where: {
        guideBaseId: guideBase.id,
      },
    });

    if (!guideData) throw new Error('No guide data found');

    const startingCount = randomInt(3, 8);

    await guideData.update({ usersCompletedAStep: startingCount });

    await captureGuideAnalytics({ templates: [template] });

    const captured = await CapturedGuideAnalytics.findOne({
      where: {
        templateId: template.id,
      },
    });

    expect(captured).toBeTruthy();
    expect(captured?.stats.completedAStep).toEqual(startingCount);
  });

  test('can capture stats and retrieve them', async () => {
    const { organization, account, accountUser } = getContext();

    const template = await Template.findOne({
      where: {
        organizationId: organization.id,
      },
    });

    if (!template) throw new Error('No template to test');

    const { guideBase } = await launchTemplateForTest(
      template.entityId,
      organization,
      account,
      accountUser
    );

    const guideData = await GuideData.findOne({
      where: {
        guideBaseId: guideBase.id,
      },
    });

    if (!guideData) throw new Error('No guide data found');

    const startingCount = randomInt(3, 8);

    await guideData.update({ usersCompletedAStep: startingCount });

    /* Simple pull should match the current data */
    const statsRaw = await fetchTemplateStats({ template });

    expect(statsRaw.completedAStep).toEqual(startingCount);

    await captureGuideAnalytics({ templates: [template] });

    await guideData.update({
      usersCompletedAStep: startingCount + randomInt(3, 7),
    });
    await guideData.reload();

    /* After locking it should not have the new data */
    const statsAfter = await fetchTemplateStats({ template, useLocked: true });

    expect(statsAfter.completedAStep).toEqual(startingCount);
    expect(guideData.usersCompletedAStep).not.toEqual(startingCount);

    /* Not using the lock should have the new data */
    const statsLive = await fetchTemplateStats({ template, useLocked: false });

    expect(statsLive.completedAStep).not.toEqual(startingCount);
  });

  test('fills in missing keys to prevent null errors', async () => {
    const { organization, account, accountUser } = getContext();

    const template = await Template.findOne({
      where: {
        organizationId: organization.id,
      },
    });

    if (!template) throw new Error('No template to test');

    await launchTemplateForTest(
      template.entityId,
      organization,
      account,
      accountUser
    );

    await captureGuideAnalytics({ templates: [template] });

    /* simulate if we captured stats before we added more */
    await CapturedGuideAnalytics.update(
      {
        stats: {
          usersDismissed: 10,
        },
      },
      {
        where: {
          templateId: template.id,
        },
      }
    );

    const statsRaw = await fetchTemplateStats({ template, useLocked: true });

    expect(statsRaw.percentCompleted).not.toEqual(null);
  });
});
