import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { BatchedNotification } from 'src/data/models/BatchedNotifications.model';
import { Organization } from 'src/data/models/Organization.model';
import { Step, StepCompletedByType } from 'src/data/models/Step.model';
import { launchToAccountUser } from 'src/interactions/targeting/testHelpers';
import { handleStepCompletedNotifications } from './handleStepCompletedNotifications';

const getContext = setupAndSeedDatabaseForTests('bento');

import * as notifyWithCourier from '../../../utils/notifications/notifyWithCourier';
import * as queuer from 'src/jobsBull/queues';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import { sendBatchedStepNotifications } from './sendBatchedStepNotifications';
import { JobType } from 'src/jobsBull/job';

const spied = jest.spyOn(notifyWithCourier, 'notifyEmailViaCourier');
const jobSpied = jest.spyOn(queuer, 'queueJob');

beforeEach(() => {
  jest.clearAllMocks();
});

const enableNotifications = async (organization: Organization) => {
  await OrganizationSettings.update(
    { sendEmailNotifications: true },
    { where: { organizationId: organization.id } }
  );
};

describe('step and guide completion', () => {
  test('queues nothing if disabled', async () => {
    const { account, accountUser, organization } = getContext();

    const { guide } = await launchToAccountUser({
      organization,
      account,
      accountUser,
    });

    const oneStep = await Step.findOne({ where: { guideId: guide.id } });

    if (!oneStep) throw 'No step to test';

    jobSpied.mockClear();

    await handleStepCompletedNotifications({
      stepEntityId: oneStep.entityId,
      completedByType: StepCompletedByType.Auto,
      completedByAccountUserId: accountUser.id,
    });

    expect(jobSpied).toBeCalledTimes(0);
  });

  test('can queue a job', async () => {
    const { account, accountUser, organization } = getContext();

    await enableNotifications(organization);

    const { guide } = await launchToAccountUser({
      organization,
      account,
      accountUser,
    });

    const oneStep = await Step.findOne({ where: { guideId: guide.id } });

    if (!oneStep) throw 'No step to test';

    jobSpied.mockClear();

    await handleStepCompletedNotifications({
      stepEntityId: oneStep.entityId,
      completedByType: StepCompletedByType.Auto,
      completedByAccountUserId: accountUser.id,
    });

    expect(jobSpied).toBeCalledWith(
      expect.objectContaining({
        jobType: JobType.SendBatchedStepNotification,
      }),
      expect.anything()
    );
  });

  test('batches same step-user combo together', async () => {
    const { account, accountUser, organization } = getContext();

    await enableNotifications(organization);

    const { guide } = await launchToAccountUser({
      organization,
      account,
      accountUser,
    });

    const step = await Step.findOne({ where: { guideId: guide.id } });

    if (!step) throw 'No step to test';

    jobSpied.mockClear();

    await handleStepCompletedNotifications({
      stepEntityId: step.entityId,
      completedByType: StepCompletedByType.Auto,
      completedByAccountUserId: accountUser.id,
    });

    await handleStepCompletedNotifications({
      stepEntityId: step.entityId,
      completedByType: StepCompletedByType.Auto,
      completedByAccountUserId: accountUser.id,
    });

    expect(jobSpied).toBeCalledWith(
      expect.objectContaining({
        jobType: JobType.SendBatchedStepNotification,
      }),
      expect.anything()
    );

    const queuedAlerts = await BatchedNotification.findAll({
      where: { organizationId: organization.id, notificationType: 'steps' },
    });

    expect(queuedAlerts.length).toEqual(1);
  });

  /**
   * @todo properly setup the branching template so that we can confirm branchingQuestion as part of the payload
   */
  test('batches same step-user together', async () => {
    const { account, accountUser, organization } = getContext();

    await enableNotifications(organization);

    const { guide } = await launchToAccountUser({
      organization,
      account,
      accountUser,
    });

    const steps = await Step.findAll({ where: { guideId: guide.id } });

    if (!steps || steps.length < 1) throw 'No step to test';

    const [stepOne, stepTwo] = steps;

    await handleStepCompletedNotifications({
      stepEntityId: stepOne.entityId,
      completedByType: StepCompletedByType.Auto,
      completedByAccountUserId: accountUser.id,
    });

    await handleStepCompletedNotifications({
      stepEntityId: stepTwo.entityId,
      completedByType: StepCompletedByType.Auto,
      completedByAccountUserId: accountUser.id,
    });

    expect(jobSpied).toBeCalledWith(
      expect.objectContaining({
        jobType: JobType.SendBatchedStepNotification,
      }),
      expect.anything()
    );

    const queuedAlerts = await BatchedNotification.findAll({
      where: { organizationId: organization.id, notificationType: 'steps' },
    });

    expect(queuedAlerts.length).toBeGreaterThan(1);

    const firstAlert = queuedAlerts[0];

    spied.mockClear();

    await sendBatchedStepNotifications({
      jobType: JobType.SendBatchedStepNotification,
      recipientEmail: firstAlert.recipientEmail!,
      recipientEntityId: firstAlert.recipientEntityId!,
    });

    expect(spied).toBeCalled();

    const callParams = spied.mock.calls[0][0] as any;
    const callData = callParams.data;

    expect(callData.accountGuides?.[0].steps).toBeTruthy();
    expect(callData.accountGuides?.[0].steps.length).toBeGreaterThan(1);
  });
});
