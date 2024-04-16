import { GuideState } from 'src/../../common/types';
import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import {
  getDummyAccount,
  getDummyAccountUser,
} from 'src/testUtils/dummyDataHelpers';
import { Guide } from 'src/data/models/Guide.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import { createGuideBase } from 'src/interactions/createGuideBase';
import createGuideFromGuideBase from 'src/interactions/createGuideFromGuideBase';
import findOrCreateAccount from 'src/interactions/findOrCreateAccount';
import findOrCreateAccountUser from 'src/interactions/findOrCreateAccountUser';
import { JobType } from 'src/jobsBull/job';
import { handleResetForGuideBases } from 'src/jobsBull/jobs/guideReset/resetGuidesForGuideBases';
import { makeLogger } from 'src/jobsBull/logger';
import { queueJob } from 'src/jobsBull/queues';
import { ResetLevel } from './helpers';

const getContext = setupAndSeedDatabaseForTests('paydayio');

jest.mock('src/jobsBull/jobs/guideReset/helpers', () => {
  const original = jest.requireActual('src/jobsBull/jobs/guideReset/helpers');

  return {
    ...original,
    RESET_GUIDES_FOR_GUIDE_BASE_BATCH_SIZE: 3,
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
  test('should requeue if guides exceed batch size', async () => {
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

    const accountUsers = (
      await Promise.all(
        Array.from({ length: 4 })
          .map((_, i) => getDummyAccountUser(organization, accounts[i]))
          .map((au, i) =>
            findOrCreateAccountUser({
              organization,
              account: accounts[i],
              accountUserInput: au,
            })
          )
      )
    ).map((r) => r.accountUser);

    const guideBases: GuideBase[] = [];

    for (const account of accounts) {
      const guideBase = await createGuideBase({
        account,
        templateEntityId: template!.entityId,
      });

      guideBases.push(guideBase);
    }

    const guides: Guide[] = [];

    for (let i = 0; i < guideBases.length; i++) {
      const guideBase = guideBases[i];

      const guide = await createGuideFromGuideBase({
        guideBase,
        accountUser: accountUsers[i],
        state: GuideState.active,
      });

      guides.push(guide);
    }

    await handleResetForGuideBases(
      {
        jobType: JobType.ResetGuidesForGuideBases,
        organizationId: organization.id,
        guideBases: guideBases.map((gb) => ({
          guideBaseId: gb.id,
          branched: false,
        })),
        isLastJob: false,
        resetLevel: ResetLevel.Template,
        resetObjectId: template.id,
      },
      makeLogger('mock')
    );

    expect(queueJob).toHaveBeenCalled();
    expect(queueJob).toHaveBeenCalledWith({
      jobType: JobType.ResetGuidesForGuideBases,
      organizationId: organization.id,
      guideBases: guideBases.map((gb) => ({
        guideBaseId: gb.id,
        branched: false,
      })),
      isLastJob: false,
      resetLevel: ResetLevel.Template,
      resetObjectId: template.id,
      _internal: {
        maximumGuideId: guides[3].id,
        lastGuideId: guides[2].id,
      },
    });

    const guidesAfterReset = await Guide.findAll({
      where: { id: guides.map((g) => g.id) },
    });

    expect(guidesAfterReset).toHaveLength(1);
    expect(guidesAfterReset[0].id).toBe(guides[3].id);
  });

  test('should clear template isResetting if last job', async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) {
      throw new Error('Expected template');
    }

    await template.update({ isResetting: true });

    const accounts = (
      await Promise.all(
        Array.from({ length: 2 })
          .map(() => getDummyAccount(organization))
          .map((a) => findOrCreateAccount({ organization, accountInput: a }))
      )
    ).map((r) => r.account);

    const accountUsers = (
      await Promise.all(
        Array.from({ length: 2 })
          .map((_, i) => getDummyAccountUser(organization, accounts[i]))
          .map((au, i) =>
            findOrCreateAccountUser({
              organization,
              account: accounts[i],
              accountUserInput: au,
            })
          )
      )
    ).map((r) => r.accountUser);

    const guideBases: GuideBase[] = [];

    for (const account of accounts) {
      const guideBase = await createGuideBase({
        account,
        templateEntityId: template!.entityId,
      });

      guideBases.push(guideBase);
    }

    const guides: Guide[] = [];

    for (let i = 0; i < guideBases.length; i++) {
      const guideBase = guideBases[i];

      const guide = await createGuideFromGuideBase({
        guideBase,
        accountUser: accountUsers[i],
        state: GuideState.active,
      });

      guides.push(guide);
    }

    await handleResetForGuideBases(
      {
        jobType: JobType.ResetGuidesForGuideBases,
        organizationId: organization.id,
        guideBases: guideBases.map((gb) => ({
          guideBaseId: gb.id,
          branched: false,
        })),
        isLastJob: true,
        resetLevel: ResetLevel.Template,
        resetObjectId: template.id,
      },
      makeLogger('mock')
    );

    for (let i = 1; i <= 2; i++) {
      expect(queueJob).toHaveBeenCalledWith(
        expect.objectContaining({ jobType: JobType.UpdateStepData })
      );
    }

    expect(queueJob).toHaveBeenCalledWith(
      expect.objectContaining({ jobType: JobType.UpdateGuideData })
    );

    const guidesAfterReset = await Guide.findAll({
      where: { id: guides.map((g) => g.id) },
      paranoid: false,
    });

    expect(guidesAfterReset).toHaveLength(0);

    await template.reload();

    expect(template).toHaveProperty('isResetting', false);
  });

  test('should clear template isResetting if last job and no guides returned', async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) {
      throw new Error('Expected template');
    }

    await template.update({ isResetting: true });

    const accounts = (
      await Promise.all(
        Array.from({ length: 1 })
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

    await handleResetForGuideBases(
      {
        jobType: JobType.ResetGuidesForGuideBases,
        organizationId: organization.id,
        guideBases: guideBases.map((gb) => ({
          guideBaseId: gb.id,
          branched: false,
        })),
        isLastJob: true,
        resetLevel: ResetLevel.Template,
        resetObjectId: template.id,
      },
      makeLogger('mock')
    );

    expect(queueJob).not.toHaveBeenCalledWith(
      expect.objectContaining({ jobType: JobType.ResetGuidesForGuideBases })
    );

    await template.reload();

    expect(template).toHaveProperty('isResetting', false);
  });
});
