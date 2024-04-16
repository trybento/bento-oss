import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { getDummyAccount } from 'src/testUtils/dummyDataHelpers';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import { createGuideBase } from 'src/interactions/createGuideBase';
import findOrCreateAccount from 'src/interactions/findOrCreateAccount';
import { JobType } from 'src/jobsBull/job';
import { handleResetGuides } from 'src/jobsBull/jobs/guideReset/resetGuides';
import { makeLogger } from 'src/jobsBull/logger';
import { queueJob } from 'src/jobsBull/queues';
import { ResetLevel } from './helpers';

const getContext = setupAndSeedDatabaseForTests('paydayio');

jest.mock('src/jobsBull/jobs/guideReset/helpers', () => {
  const original = jest.requireActual('src/jobsBull/jobs/guideReset/helpers');

  return {
    ...original,
    RESET_GUIDES_DB_BATCH_SIZE: 3,
    RESET_GUIDES_QUEUE_BATCH_SIZE: 1,
  };
});

jest.mock('src/jobsBull/queues', () => {
  const original = jest.requireActual('src/jobsBull/queues');

  return {
    ...original,
    queueJob: jest.fn(),
  };
});

afterEach(() => {
  (queueJob as jest.Mock).mockReset();
});

describe('resetGuides', () => {
  test('should requeue if guide bases exceed batch size', async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) {
      throw new Error('Expected template');
    }

    const accounts = (
      await Promise.all(
        Array.from({ length: 4 })
          .map(() => getDummyAccount(organization))
          .map((a) => findOrCreateAccount({ organization, accountInput: a }))
      )
    ).map((r) => r.account);

    const guideBases: GuideBase[] = [];

    for (const account of accounts) {
      const guideBase = await createGuideBase({
        account,
        templateEntityId: template!.entityId,
      });

      guideBases.push(guideBase);
    }

    await handleResetGuides(
      {
        jobType: JobType.ResetGuides,
        organizationId: organization.id,
        resetLevel: ResetLevel.Template,
        resetObjectId: template.id,
      },
      makeLogger('mock')
    );

    expect(queueJob).toHaveBeenCalledTimes(4);

    for (let i = 1; i <= 3; i++) {
      expect(queueJob).toHaveBeenNthCalledWith(i, {
        jobType: JobType.ResetGuidesForGuideBases,
        organizationId: organization.id,
        guideBases: [{ guideBaseId: guideBases[i - 1].id, branched: false }],
        isLastJob: false,
        resetLevel: ResetLevel.Template,
        resetObjectId: template.id,
      });
    }

    expect(queueJob).toHaveBeenNthCalledWith(4, {
      jobType: JobType.ResetGuides,
      organizationId: organization.id,
      resetLevel: ResetLevel.Template,
      resetObjectId: template.id,
      _internal: {
        maximumGuideBaseId: guideBases[3].id,
        lastGuideBaseId: guideBases[2].id,
      },
    });
  });

  test('should queue a guide base reset job with isLastJob=true if final batch', async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) {
      throw new Error('Expected template');
    }

    const accounts = (
      await Promise.all(
        Array.from({ length: 2 })
          .map(() => getDummyAccount(organization))
          .map((a) => findOrCreateAccount({ organization, accountInput: a }))
      )
    ).map((r) => r.account);

    const guideBases: GuideBase[] = [];

    for (const account of accounts) {
      const guideBase = await createGuideBase({
        account,
        templateEntityId: template!.entityId,
      });

      guideBases.push(guideBase);
    }

    await handleResetGuides(
      {
        jobType: JobType.ResetGuides,
        organizationId: organization.id,
        resetLevel: ResetLevel.Template,
        resetObjectId: template.id,
      },
      makeLogger('mock')
    );

    expect(queueJob).toHaveBeenCalledTimes(2);

    expect(queueJob).toHaveBeenNthCalledWith(1, {
      jobType: JobType.ResetGuidesForGuideBases,
      organizationId: organization.id,
      guideBases: [{ guideBaseId: guideBases[0].id, branched: false }],
      isLastJob: false,
      resetLevel: ResetLevel.Template,
      resetObjectId: template.id,
    });

    expect(queueJob).toHaveBeenNthCalledWith(2, {
      jobType: JobType.ResetGuidesForGuideBases,
      organizationId: organization.id,
      guideBases: [{ guideBaseId: guideBases[1].id, branched: false }],
      isLastJob: true,
      resetLevel: ResetLevel.Template,
      resetObjectId: template.id,
    });
  });

  test("should clear template's isResetting if no guide bases are found", async () => {
    const { organization } = getContext();
    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) {
      throw new Error('Expected template');
    }

    await template.update({ isResetting: true });

    await handleResetGuides(
      {
        jobType: JobType.ResetGuides,
        organizationId: organization.id,
        resetLevel: ResetLevel.Template,
        resetObjectId: template.id,
      },
      makeLogger('mock')
    );

    expect(queueJob).toHaveBeenCalledTimes(0);

    await template.reload();

    expect(template).toHaveProperty('isResetting', false);
  });
});
