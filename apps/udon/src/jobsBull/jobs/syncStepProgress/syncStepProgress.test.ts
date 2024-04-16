import { Op } from 'sequelize';
import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import {
  createDummyAccountUsers,
  launchDefaultTemplate,
} from 'src/testUtils/dummyDataHelpers';
import { Account } from 'src/data/models/Account.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { Organization } from 'src/data/models/Organization.model';
import { Step, StepCompletedByType } from 'src/data/models/Step.model';
import { Template } from 'src/data/models/Template.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { setStepCompletion } from 'src/interactions/setStepCompletion';
import { syncStepProgress } from './syncStepProgress';
import { preCompleteSteps } from './preCompleteSteps';
import * as queuer from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

jest.mock('src/utils/features', () => ({
  ...jest.requireActual('src/utils/features'),
  enableStepProgressSyncing: {
    enabled: jest.fn(() => true),
  },
}));

/* Expect bento to have multiple templates, with one re-used module */
const getContext = setupAndSeedDatabaseForTests('bento');

const launchTwoGuides = async (
  organization: Organization,
  account: Account
) => {
  if (account.organizationId !== organization.id)
    throw 'Account should belong to org';

  const templates = await Template.findAll({
    where: {
      name: ['Manager activation', 'Employee activation'],
      organizationId: organization.id,
    },
  });

  expect(templates.length).toBeGreaterThan(1);

  const firstTemplate = templates[0];
  const secondTemplate = templates[1];

  await launchDefaultTemplate({
    organization,
    account,
    templateId: firstTemplate.id,
  });
  await launchDefaultTemplate({
    organization,
    account,
    templateId: secondTemplate.id,
  });

  const guideOne = await Guide.findOne({
    where: { createdFromTemplateId: firstTemplate.id },
    include: [Step],
  });
  const guideTwo = await Guide.findOne({
    where: { createdFromTemplateId: secondTemplate.id },
    include: [Step],
  });

  expect(guideOne).toBeDefined();
  expect(guideTwo).toBeDefined();

  const oneStep = guideOne?.steps[1];

  if (!oneStep || !guideTwo || !guideOne)
    throw new Error('No step to complete in template');

  return { oneStep, guideOne, guideTwo };
};

const launchOneGuide = async (
  organization: Organization,
  account: Account,
  accountUser: AccountUser
) => {
  if (account.organizationId !== organization.id)
    throw 'Account should belong to org';

  const template = await Template.findOne({
    where: {
      name: 'Manager activation',
      organizationId: organization.id,
    },
  });

  if (!template) throw 'No template';

  await launchDefaultTemplate({
    organization,
    account,
    templateId: template.id,
  });

  const guide = await Guide.findOne({
    where: { createdFromTemplateId: template.id },
    include: [Step],
  });

  const oneStep = guide?.steps[1];

  if (!guide || !oneStep) throw 'Cannot find guide step to complete';

  await setStepCompletion({
    step: oneStep,
    isComplete: true,
    accountUser,
    completedByType: StepCompletedByType.AccountUser,
  });

  const completedStep = await Step.findOne({
    where: {
      completedAt: { [Op.not]: null },
      organizationId: organization.id,
    },
  });

  expect(completedStep).toBeDefined();
};

describe('syncStepProgress', () => {
  let oneStep: Step, guideOne: Guide, guideTwo: Guide, otherUser: AccountUser;
  beforeEach(async () => {
    const { organization, account, accountUser } = getContext();
    ({ oneStep, guideOne, guideTwo } = await launchTwoGuides(
      organization,
      account
    ));

    await GuideParticipant.bulkCreate([
      {
        guideId: guideOne.id,
        accountUserId: accountUser.id,
        organizationId: organization.id,
      },
      {
        guideId: guideTwo.id,
        accountUserId: accountUser.id,
        organizationId: organization.id,
      },
    ]);

    [otherUser] = await createDummyAccountUsers(organization, account, 1);
  });

  test('attempts to sync', async () => {
    const { accountUser } = getContext();
    const spied = jest.spyOn(queuer, 'queueJob');

    await setStepCompletion({
      step: oneStep,
      isComplete: true,
      completedByType: StepCompletedByType.AccountUser,
      accountUser,
    });

    /* It will call for other jobs */
    const calls = spied.mock.calls;
    const calledWithSyncJob = calls.find(
      (call) => call[0].jobType === JobType.SyncStepProgress
    );
    expect(calledWithSyncJob).toBeDefined();
  });

  test('sync completions will not call more syncs', async () => {
    const { accountUser } = getContext();
    const spied = jest.spyOn(queuer, 'queueJob');

    spied.mockClear();

    await setStepCompletion({
      step: oneStep,
      isComplete: true,
      completedByType: StepCompletedByType.AccountUser,
      accountUser,
      isSyncAction: true,
    });

    expect(spied).not.toBeCalledWith(
      expect.objectContaining({
        jobType: JobType.SyncStepProgress,
      })
    );
  });

  test('brings step progress to existing guides', async () => {
    const { accountUser } = getContext();

    await setStepCompletion({
      step: oneStep,
      isComplete: true,
      completedByType: StepCompletedByType.AccountUser,
      accountUser,
    });

    await syncStepProgress({
      jobType: JobType.SyncStepProgress,
      accountUserId: accountUser.id,
      stepId: oneStep.id,
    });

    const stepsBetweenBothGuides = await Step.findAll({
      where: {
        guideId: [guideOne.id, guideTwo.id],
        completedAt: { [Op.not]: null },
      },
    });

    expect(stepsBetweenBothGuides.length).toBeGreaterThan(1);
  });

  test("will not sync to someone else's guide", async () => {
    const { accountUser } = getContext();

    await setStepCompletion({
      step: oneStep,
      isComplete: true,
      completedByType: StepCompletedByType.AccountUser,
      accountUser,
    });

    await syncStepProgress({
      jobType: JobType.SyncStepProgress,
      accountUserId: accountUser.id,
      stepId: oneStep.id,
    });

    const stepsCompletedByMainUser = await Step.findOne({
      where: { completedByAccountUserId: accountUser.id },
    });
    const stepsCompletedByOtherUser = await Step.findOne({
      where: { completedByAccountUserId: otherUser.id },
    });

    expect(stepsCompletedByMainUser).toBeDefined();
    expect(stepsCompletedByOtherUser).toBeNull();
  });
});

describe('precompleteSteps', () => {
  beforeEach(async () => {
    const { organization, account, accountUser } = getContext();

    await launchOneGuide(organization, account, accountUser);
  });

  test('should bring step progress to new guide', async () => {
    const { organization, account, accountUser } = getContext();

    const newTemplate = await Template.findOne({
      where: {
        name: 'Employee activation',
        organizationId: organization.id,
      },
    });

    if (!newTemplate) throw 'No template';

    await launchDefaultTemplate({
      organization,
      account,
      templateId: newTemplate.id,
    });

    const newGuide = await Guide.findOne({
      where: { createdFromTemplateId: newTemplate.id },
    });

    if (!newGuide) throw 'Failed launching second guide';

    await preCompleteSteps({
      jobType: JobType.PreCompleteSteps,
      accountUserId: accountUser.id,
      guideId: newGuide.id,
    });

    const preCompletedStep = await Step.findOne({
      where: {
        completedAt: { [Op.not]: null },
        guideId: newGuide.id,
      },
    });

    expect(preCompletedStep).toBeDefined();
  });

  test('prepopulates nothing if no related steps', async () => {
    const { organization, account, accountUser } = getContext();

    const newTemplate = await Template.findOne({
      where: {
        name: 'Organization setup',
        organizationId: organization.id,
      },
    });

    if (!newTemplate) throw 'No template';

    await launchDefaultTemplate({
      organization,
      account,
      templateId: newTemplate.id,
    });

    const newGuide = await Guide.findOne({
      where: { createdFromTemplateId: newTemplate.id },
    });

    if (!newGuide) throw 'Failed launching second guide';

    await preCompleteSteps({
      jobType: JobType.PreCompleteSteps,
      accountUserId: accountUser.id,
      guideId: newGuide.id,
    });

    const preCompletedStep = await Step.findOne({
      where: {
        completedAt: { [Op.not]: null },
        guideId: newGuide.id,
      },
    });

    expect(preCompletedStep).toBeFalsy();
  });
});
