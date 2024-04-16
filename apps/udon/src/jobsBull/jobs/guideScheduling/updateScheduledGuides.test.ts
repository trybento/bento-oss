import { createTemplateForTest } from 'src/graphql/Template/testHelpers';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import { updateScheduledGuides } from 'src/jobsBull/jobs/guideScheduling/updateScheduledGuides';
import { mockLogger, MockLogger } from 'src/testUtils/mockLogger';
import { Template } from 'src/data/models/Template.model';
import { applyFinalCleanupHook } from 'src/data/datatests';
import { queueJob } from 'src/jobsBull/queues';
import type { Organization } from 'src/data/models/Organization.model';
import { JobType } from 'src/jobsBull/job';

let logger: MockLogger;
let throttlingEnabled = false;
let organization: Organization;

jest.mock('src/utils/features', () => ({
  ...jest.requireActual('src/utils/features'),
  enableGuideSchedulingThrottling: {
    enabled: jest.fn(() => throttlingEnabled),
  },
}));
jest.mock('src/jobsBull/queues', () => ({
  ...jest.requireActual('src/jobsBull/queues'),
  queueJob: jest.fn(),
}));

const { executeAdminQuery, getAdminContext, getEmbedContext } =
  setupGraphQLTestServer('bento');

applyFinalCleanupHook();

const createTemplate = async (launch = false): Promise<Template> => {
  const {
    template: { entityId },
  } = await createTemplateForTest(
    executeAdminQuery,
    getEmbedContext(),
    {},
    // @ts-ignore
    launch
  );

  let template: Template;
  if (launch) {
    [, [template]] = await Template.update(
      { isAutoLaunchEnabled: true },
      { where: { entityId }, returning: true }
    );
  } else {
    template = (await Template.findOne({ where: { entityId } })) as Template;
  }

  return template;
};

describe.each([true, false])('throttling enabled: %s', (throttled) => {
  beforeEach(() => {
    logger = mockLogger();
    throttlingEnabled = throttled;
    ({ organization } = getAdminContext());
    jest.clearAllMocks();
  });

  test('enables auto-launch for a scheduled guide in the launch window', async () => {
    const template = await createTemplate();
    await template.update({ enableAutoLaunchAt: new Date(Date.now() - 1) });

    await updateScheduledGuides(logger);

    await template.reload();
    expect(template.isAutoLaunchEnabled).toBe(true);

    expect(logger.logEntries).toContainEqual({
      level: 'debug',
      text: 'Found templates to update auto-launch status: 1 to enable, 0 to disable',
    });

    if (throttled) {
      expect(queueJob).toHaveBeenCalledTimes(1);
      expect(queueJob).toHaveBeenCalledWith({
        jobType: JobType.PrelaunchScheduledGuide,
        templatesAndOrgs: [
          { organizationId: organization.id, templateId: template.id },
        ],
      });
    } else {
      expect(queueJob).not.toHaveBeenCalledWith();
    }
  });

  test('disables auto-launch for a template and pauses its guide bases', async () => {
    const template = await createTemplate(true);
    await template.update({ disableAutoLaunchAt: new Date(Date.now() - 1) });

    await updateScheduledGuides(logger);

    await template.reload();
    expect(template.isAutoLaunchEnabled).toBe(false);

    expect(logger.logEntries).toContainEqual({
      level: 'debug',
      text: 'Found templates to update auto-launch status: 0 to enable, 1 to disable',
    });

    expect(queueJob).toHaveBeenCalledTimes(1);
    expect(queueJob).toHaveBeenCalledWith({
      jobType: JobType.CleanupScheduledGuide,
      templateIds: [template.id],
    });
  });

  test('handles multiple templates needing different changes', async () => {
    const templateToEnable = await createTemplate();
    await templateToEnable.update({
      enableAutoLaunchAt: new Date(Date.now() - 100),
    });

    const templateToDisable = await createTemplate(true);
    await templateToDisable.update({
      disableAutoLaunchAt: new Date(Date.now() - 100),
    });

    await updateScheduledGuides(logger);

    await templateToEnable.reload();
    expect(templateToEnable.isAutoLaunchEnabled).toBe(true);

    await templateToDisable.reload();
    expect(templateToDisable.isAutoLaunchEnabled).toBe(false);

    expect(logger.logEntries).toContainEqual({
      level: 'debug',
      text: 'Found templates to update auto-launch status: 1 to enable, 1 to disable',
    });

    if (throttled) {
      expect(queueJob).toHaveBeenCalledTimes(2);
      expect(queueJob).toHaveBeenCalledWith({
        jobType: JobType.PrelaunchScheduledGuide,
        templatesAndOrgs: [
          {
            organizationId: organization.id,
            templateId: templateToEnable.id,
          },
        ],
      });
    } else {
      expect(queueJob).toHaveBeenCalledTimes(1);
      expect(queueJob).not.toHaveBeenCalledWith({
        jobType: JobType.PrelaunchScheduledGuide,
        templatesAndOrgs: [
          {
            organizationId: organization.id,
            templateId: templateToEnable.id,
          },
        ],
      });
    }
    expect(queueJob).toHaveBeenCalledWith({
      jobType: JobType.CleanupScheduledGuide,
      templateIds: [templateToDisable.id],
    });
  });

  test('does not launch or pause templates too early', async () => {
    const template = await createTemplate();
    await template.update({
      enableAutoLaunchAt: new Date(Date.now() + 5_000),
    });

    await updateScheduledGuides(logger);

    await template.reload();
    expect(template.isAutoLaunchEnabled).toBe(false);

    expect(logger.logEntries).toContainEqual({
      level: 'debug',
      text: 'No scheduled templates found to update',
    });

    expect(queueJob).not.toHaveBeenCalled();
  });

  test('does not enable auto-launch for templates that should have already been paused', async () => {
    const template = await createTemplate();
    await template.update({
      // Here we're testing a scenario when the scheduled launch window has
      // already passed but for some reason we hadn't processed the template yet.
      enableAutoLaunchAt: new Date(Date.now() - 300),
      disableAutoLaunchAt: new Date(Date.now() - 100),
    });

    await updateScheduledGuides(logger);

    await template.reload();
    expect(template.isAutoLaunchEnabled).toBe(false);

    expect(logger.logEntries).toContainEqual({
      level: 'debug',
      text: 'No scheduled templates found to update',
    });
    expect(queueJob).not.toHaveBeenCalled();
  });
});
