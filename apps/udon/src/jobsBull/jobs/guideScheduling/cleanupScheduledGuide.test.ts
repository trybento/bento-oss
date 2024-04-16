import { GuideParticipant } from '../../../data/models/GuideParticipant.model';
import { getDummyAccountUser } from '../../../testUtils/dummyDataHelpers';
import { getDummyAccount } from 'src/testUtils/dummyDataHelpers';
import { GuideBaseState } from 'bento-common/types';

import {
  createTemplateForTest,
  launchTemplateForTest,
} from 'src/graphql/Template/testHelpers';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import { mockLogger, MockLogger } from 'src/testUtils/mockLogger';
import { Template } from 'src/data/models/Template.model';
import { applyFinalCleanupHook } from 'src/data/datatests';
import { queueJob } from 'src/jobsBull/queues';
import type { Organization } from 'src/data/models/Organization.model';
import { cleanupScheduledGuide } from './cleanupScheduledGuide';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { JobType } from 'src/jobsBull/job';

let logger: MockLogger;
let organization: Organization;
let account: Account;
let accounts: Account[];
let template: Template;
let templateIds: number[];
let guideBases: GuideBase[];

jest.mock('src/jobsBull/queues', () => ({
  ...jest.requireActual('src/jobsBull/queues'),
  queueJob: jest.fn(),
}));

const { executeAdminQuery, getAdminContext, getEmbedContext } =
  setupGraphQLTestServer('bento');

applyFinalCleanupHook();

async function createTemplate() {
  const {
    template: { entityId },
    guideBase,
  } = await createTemplateForTest(
    executeAdminQuery,
    getEmbedContext(),
    {},
    true
  );
  return {
    template: (await Template.findOne({
      where: { entityId },
    })) as Template,
    guideBase,
  };
}

async function hasDeletedGuideBases(guideBasesToCheck: GuideBase[]) {
  const guideBases = await GuideBase.count({
    where: { id: guideBasesToCheck.map((gb) => gb.id) },
  });
  expect(guideBases).toBe(0);
}

async function hasPausedGuideBases(guideBasesToCheck: GuideBase[]) {
  for (const gb of guideBasesToCheck) {
    await gb.reload();
    expect(gb.state).toBe(GuideBaseState.paused);
  }
}

async function hasNotPausedGuideBases(guideBasesToCheck: GuideBase[]) {
  for (const gb of guideBasesToCheck) {
    await gb.reload();
    expect(gb.state).toBe(GuideBaseState.active);
  }
}

async function hasCorrectGuideBases(batchSize: number, numDeleted = 0) {
  const [deletedGuideBases, pausedGuideBases, activeGuideBases] =
    guideBases.reduce(
      ([deleted, paused, active], gb, i) => {
        if (i < batchSize && gb.createdFromTemplateId === template.id) {
          if (i < numDeleted) {
            deleted.push(gb);
          } else {
            paused.push(gb);
          }
        } else {
          active.push(gb);
        }
        return [deleted, paused, active];
      },
      [[], [], []] as GuideBase[][]
    );

  await hasDeletedGuideBases(deletedGuideBases);
  await hasPausedGuideBases(pausedGuideBases);
  await hasNotPausedGuideBases(activeGuideBases);
}

function hasDebugLog(
  batchSize: number,
  numGuideBases: number = guideBases.filter(
    (gb) => gb.createdFromTemplateId === template.id
  ).length
) {
  expect(logger.logEntries).toContainEqual({
    level: 'debug',
    text: `[cleanupScheduledGuide] template id: ${
      template.id
    }, guide bases: ${Math.min(batchSize, numGuideBases)}`,
  });
}

function hasQueuedAnotherJob(
  batchSize: number,
  numGuideBases: number = guideBases.filter(
    (gb) => gb.createdFromTemplateId === template.id
  ).length,
  lastGuideBaseId?: number,
  previousTemplateIds = templateIds
) {
  const fullBatch = batchSize === Math.min(batchSize, numGuideBases);

  expect(queueJob).toHaveBeenLastCalledWith({
    jobType: JobType.CleanupScheduledGuide,
    templateIds: fullBatch ? previousTemplateIds : previousTemplateIds.slice(1),
    batchSize,
    lastGuideBaseId:
      fullBatch && lastGuideBaseId !== -1
        ? lastGuideBaseId || guideBases[batchSize - 1].id
        : undefined,
  });
}

describe.each([1, 2])('batch size: %s', (batchSize) => {
  beforeEach(async () => {
    jest.clearAllMocks();
    ({ organization } = getAdminContext());
    ({ account } = getEmbedContext());
    accounts = [account];
    logger = mockLogger();
    const { template: newTemplate, guideBase } = await createTemplate();
    template = newTemplate;
    templateIds = [template.id];
    guideBases = [guideBase];
  });

  describe.each([1, 2])('guide bases: %s', (numGuideBases) => {
    beforeEach(async () => {
      for (let i = 1; i < numGuideBases; i += 1) {
        const newAccount = await Account.create(getDummyAccount(organization));
        accounts.push(newAccount);
        const newAccountUser = await AccountUser.create(
          getDummyAccountUser(organization, account)
        );
        const { guideBase: gb } = await launchTemplateForTest(
          template.entityId,
          organization,
          newAccount,
          newAccountUser
        );
        guideBases.push(gb);
      }
    });

    test('one template, all guide bases with participants', async () => {
      await cleanupScheduledGuide(
        { jobType: JobType.CleanupScheduledGuide, templateIds, batchSize },
        logger
      );

      await hasCorrectGuideBases(batchSize);
      hasDebugLog(batchSize);
      hasQueuedAnotherJob(batchSize);
    });

    test('two templates, all guide bases with participants', async () => {
      const { template: template2, guideBase: template2Gb } =
        await createTemplate();
      templateIds = [template.id, template2.id];
      guideBases.push(template2Gb);
      await cleanupScheduledGuide(
        { jobType: JobType.CleanupScheduledGuide, templateIds, batchSize },
        logger
      );

      await hasCorrectGuideBases(batchSize);
      hasDebugLog(batchSize);
      hasQueuedAnotherJob(batchSize);
    });

    test('one template, no guide bases with participants', async () => {
      await GuideParticipant.destroy({
        where: { organizationId: organization.id },
      });
      await cleanupScheduledGuide(
        { jobType: JobType.CleanupScheduledGuide, templateIds, batchSize },
        logger
      );

      await hasCorrectGuideBases(batchSize, batchSize);
      hasDebugLog(batchSize);
      hasQueuedAnotherJob(batchSize);
    });

    test('one template, no guide bases with guides', async () => {
      await Guide.destroy({
        where: { createdFromGuideBaseId: guideBases.map((gb) => gb.id) },
        force: true,
      });
      await cleanupScheduledGuide(
        { jobType: JobType.CleanupScheduledGuide, templateIds, batchSize },
        logger
      );

      await hasCorrectGuideBases(batchSize, batchSize);
      hasDebugLog(batchSize);
      hasQueuedAnotherJob(batchSize);
    });

    test('one template, one guide base with no guides', async () => {
      await Guide.destroy({
        where: { createdFromGuideBaseId: guideBases[0].id },
        force: true,
      });
      await cleanupScheduledGuide(
        { jobType: JobType.CleanupScheduledGuide, templateIds, batchSize },
        logger
      );

      await hasCorrectGuideBases(batchSize, 1);
      hasDebugLog(batchSize);
      hasQueuedAnotherJob(batchSize);
    });
  });
});
