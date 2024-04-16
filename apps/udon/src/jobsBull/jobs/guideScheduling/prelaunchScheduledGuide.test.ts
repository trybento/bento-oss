import {
  RuleTypeEnum,
  TargetingType,
  TargetValueType,
} from 'bento-common/types';
import { roundToPSTHour } from 'bento-common/utils/dates';
import { RawRule } from 'bento-common/types/targeting';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import {
  createTemplateForTest,
  launchTemplateForTest,
} from 'src/graphql/Template/testHelpers';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import { Template } from 'src/data/models/Template.model';
import { applyFinalCleanupHook } from 'src/data/datatests';
import { queueJob } from 'src/jobsBull/queues';
import type { Organization } from 'src/data/models/Organization.model';
import { prelaunchScheduledGuide } from './prelaunchScheduledGuide';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Account } from 'src/data/models/Account.model';
import { getDummyAccount } from 'src/testUtils/dummyDataHelpers';
import { TemplatesAndOrgsList } from './helpers';
import { JobType } from 'src/jobsBull/job';
import { mockLogger, MockLogger } from 'src/testUtils/mockLogger';

let logger: MockLogger;
let organization: Organization;
let template: Template;
let templatesAndOrgs: TemplatesAndOrgsList;
let accounts: Account[];

const nonMatchingAutoLaunchRules: RawRule[] = [
  {
    attribute: 'doesnotexist',
    ruleType: RuleTypeEnum.equals,
    valueType: TargetValueType.text,
    value: 'something',
  },
];

const matchingAutoLaunchRules: RawRule[] = [
  {
    attribute: 'role',
    ruleType: RuleTypeEnum.equals,
    valueType: TargetValueType.text,
    value: 'valid',
  },
];
const matchingAccountAttributes = { role: 'valid' };

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
  } = await createTemplateForTest(
    executeAdminQuery,
    getEmbedContext(),
    {},
    false
  );
  return (await Template.findOne({
    where: { entityId },
  })) as Template;
}

async function hasLaunchedGuideBasesFromTemplate(
  templateToCheck: Template,
  batchSize: number,
  expectedAccounts: Account[] = accounts,
  additionalChecks = true
) {
  const guideBases = await GuideBase.findAll({
    where: {
      createdFromTemplateId: templateToCheck.id,
      accountId: expectedAccounts.map((a) => a.id),
    },
  });
  expect(guideBases).toHaveLength(Math.min(batchSize, expectedAccounts.length));
  if (additionalChecks) {
    const expectedActivatedAt = roundToPSTHour(3);
    for (const guideBase of guideBases) {
      expect(guideBase.activatedAt).toEqual(expectedActivatedAt);
      expect(guideBase.wasAutoLaunched).toBeTruthy();
    }
  }
}

function hasDebugLog(batchSize: number, numAccounts: number = accounts.length) {
  expect(logger.logEntries).toContainEqual({
    level: 'debug',
    text: `[prelaunchScheduledGuide] template id: ${
      template.id
    }, eligible accounts: ${Math.min(batchSize, numAccounts)}`,
  });
}

function hasQueuedAnotherJob(
  batchSize: number,
  numAccounts: number = accounts.length,
  lastAccountId?: number,
  previousTemplatesAndOrgs: TemplatesAndOrgsList = templatesAndOrgs
) {
  const fullBatch = batchSize === Math.min(batchSize, numAccounts);
  expect(queueJob).toHaveBeenCalledTimes(1);
  expect(queueJob).toHaveBeenCalledWith({
    jobType: JobType.PrelaunchScheduledGuide,
    templatesAndOrgs: fullBatch
      ? previousTemplatesAndOrgs
      : previousTemplatesAndOrgs.slice(1),
    batchSize,
    lastAccountId:
      fullBatch && lastAccountId !== -1
        ? lastAccountId || accounts[batchSize - 1].id
        : undefined,
  });
}

describe.each([1, 2])('batch size: %s', (batchSize) => {
  beforeEach(async () => {
    jest.clearAllMocks();
    logger = mockLogger();
    ({ organization } = getAdminContext());
    const { account } = getEmbedContext();
    accounts = [account];
    template = await createTemplate();
    templatesAndOrgs = templatesAndOrgs = [
      { templateId: template.id, organizationId: organization.id },
    ];
  });

  describe.each([1, 2])('accounts: %s', (numAccounts) => {
    beforeEach(async () => {
      if (numAccounts > 1) {
        accounts.push(
          ...(await Account.bulkCreate(
            Array(numAccounts - 1)
              .fill(null)
              .map(() => getDummyAccount(organization))
          ))
        );
      }
    });

    test('one template in the queue (targeted to all)', async () => {
      await prelaunchScheduledGuide(
        {
          jobType: JobType.PrelaunchScheduledGuide,
          templatesAndOrgs,
          batchSize,
        },
        logger
      );

      await hasLaunchedGuideBasesFromTemplate(template, batchSize);
      hasDebugLog(batchSize);
      hasQueuedAnotherJob(batchSize);
    });

    test('two templates in the queue  (targeted to all)', async () => {
      const template2 = await createTemplate();
      templatesAndOrgs = [
        { templateId: template.id, organizationId: organization.id },
        { templateId: template2.id, organizationId: organization.id },
      ];
      await prelaunchScheduledGuide(
        {
          jobType: JobType.PrelaunchScheduledGuide,
          templatesAndOrgs,
          batchSize,
        },
        logger
      );

      await hasLaunchedGuideBasesFromTemplate(template, batchSize);
      await hasLaunchedGuideBasesFromTemplate(template2, 0);
      hasDebugLog(batchSize);
      hasQueuedAnotherJob(batchSize);
    });

    test('one template in the queue (not targeted to any existing account)', async () => {
      await TemplateAutoLaunchRule.update(
        {
          ruleType: TargetingType.attributeRules,
          rules: nonMatchingAutoLaunchRules,
        },
        { where: { templateId: template.id } }
      );
      await prelaunchScheduledGuide(
        {
          jobType: JobType.PrelaunchScheduledGuide,
          templatesAndOrgs,
          batchSize,
        },
        logger
      );

      await hasLaunchedGuideBasesFromTemplate(template, 0);
      hasDebugLog(batchSize);
      hasQueuedAnotherJob(batchSize);
    });

    test('one template in the queue (targeted to certain attrbutes)', async () => {
      await TemplateAutoLaunchRule.update(
        {
          ruleType: TargetingType.attributeRules,
          rules: matchingAutoLaunchRules,
        },
        { where: { templateId: template.id } }
      );
      await accounts[0].update({ attributes: matchingAccountAttributes });
      await prelaunchScheduledGuide(
        {
          jobType: JobType.PrelaunchScheduledGuide,
          templatesAndOrgs,
          batchSize,
        },
        logger
      );

      await hasLaunchedGuideBasesFromTemplate(template, 1);
      hasDebugLog(batchSize);
      hasQueuedAnotherJob(batchSize);
    });

    test('one template in the queue with a last account id (targeted to all)', async () => {
      await prelaunchScheduledGuide(
        {
          jobType: JobType.PrelaunchScheduledGuide,
          templatesAndOrgs,
          batchSize,
          lastAccountId: accounts[0].id,
        },
        logger
      );

      await hasLaunchedGuideBasesFromTemplate(
        template,
        batchSize,
        accounts.slice(1)
      );
      hasDebugLog(batchSize, numAccounts - 1);
      hasQueuedAnotherJob(
        batchSize,
        numAccounts - 1,
        numAccounts === 2 && batchSize === 1 ? accounts[1].id : -1
      );
    });

    test('one template in the queue, already launched to account (probably manually)', async () => {
      await launchTemplateForTest(
        template.entityId,
        organization,
        accounts[0],
        getEmbedContext().accountUser
      );
      await hasLaunchedGuideBasesFromTemplate(
        template,
        batchSize,
        accounts.slice(0, 1),
        false
      );

      await prelaunchScheduledGuide(
        {
          jobType: JobType.PrelaunchScheduledGuide,
          templatesAndOrgs,
          batchSize,
        },
        logger
      );

      await hasLaunchedGuideBasesFromTemplate(
        template,
        batchSize,
        accounts.slice(1)
      );
      hasDebugLog(batchSize, numAccounts - 1);
      hasQueuedAnotherJob(
        batchSize,
        numAccounts - 1,
        numAccounts === 2 && batchSize === 1 ? accounts[1].id : -1
      );
    });
  });
});
