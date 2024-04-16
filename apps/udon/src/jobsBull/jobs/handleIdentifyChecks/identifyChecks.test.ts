import { setupAndSeedDatabaseForTests } from 'src/data/datatests';

import {
  GuideTypeEnum,
  RuleTypeEnum,
  TargetingType,
  TargetValueType,
} from 'bento-common/types';
import { logger } from 'src/utils/logger';
import { randomInt } from 'src/utils/helpers';

import * as identifyChecks from 'src/jobsBull/jobs/handleIdentifyChecks/identifyChecks.helpers';
import * as handleIdentifyChecksFile from 'src/jobsBull/jobs/handleIdentifyChecks/handleIdentifyChecks';
import {
  autoLaunchTemplateForAccounts,
  configureAutolaunchForTemplateTest,
} from 'src/interactions/targeting/testHelpers';
import {
  createDummyAccountUsersForAccounts,
  getDummyAccount,
} from 'src/testUtils/dummyDataHelpers';
import findOrCreateAccount from 'src/interactions/findOrCreateAccount';
import {
  doAccountChecks,
  doAccountUserChecks,
  handleIdentifyChecks,
} from 'src/jobsBull/jobs/handleIdentifyChecks/handleIdentifyChecks';
import * as addCreatedAccountUserAsParticipantToExistingAccountGuides from 'src/interactions/launching/addCreatedAccountUserAsParticipantToExistingAccountGuides';
import { isCacheHit } from 'src/interactions/caching/identifyChecksCache';
import * as acChecksFile from 'src/interactions/autoLaunchGuidesForAccountIfAny';
import * as auChecksFile from 'src/interactions/launching/addCreatedAccountUserAsParticipantToExistingAccountGuides';
import { Template } from 'src/data/models/Template.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { Organization } from 'src/data/models/Organization.model';
import { Guide } from 'src/data/models/Guide.model';
import { Account } from 'src/data/models/Account.model';

jest.mock('src/interactions/caching/identifyChecksCache', () => ({
  ...jest.requireActual('src/interactions/caching/identifyChecksCache'),
  isCacheHit: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const getContext = setupAndSeedDatabaseForTests('paydayio');

/** Create a user guide and add auto launch to it */
const prepareTemplate = async (
  organization: Organization,
  userGuide = true
) => {
  const template = (await Template.findOne({
    where: { organizationId: organization.id },
  }))!;

  if (userGuide) await template.update({ type: GuideTypeEnum.user });

  await configureAutolaunchForTemplateTest({ template });
  return template;
};

/**
 * Checks main methods of handleIdentifyChecks
 * For more granular targeting/launch specific tests see targeting.test.ts
 */
describe('identify checks', () => {
  test.skip('called when user identify called', async () => {
    const { account, organization } = getContext();

    const template = await prepareTemplate(organization);
    await autoLaunchTemplateForAccounts(template, [account]);

    const spied = jest.spyOn(identifyChecks, 'queueIdentifyChecks');

    // await testIdentifyUser({ account, organization });

    expect(spied).toBeCalled();
  });

  test('calls appropriate checks when specified', async () => {
    const { account, accountUser } = getContext();
    const mockPayload: identifyChecks.HandleIdentifyChecksPayload = {
      behavior: {
        checkAccountUsers: true,
        checkAccounts: true,
      },
      accountUserEntityId: accountUser.entityId,
      accountEntityId: account.entityId,
    };

    const spiedAuChecks = jest.spyOn(
      handleIdentifyChecksFile,
      'doAccountUserChecks'
    );
    const spiedAChecks = jest.spyOn(
      handleIdentifyChecksFile,
      'doAccountChecks'
    );

    await handleIdentifyChecks(mockPayload, logger);

    expect(spiedAChecks).toBeCalled();
    expect(spiedAuChecks).toBeCalled();
  });

  test('skips guide launching when cache is hit', async () => {
    (isCacheHit as jest.Mock).mockReturnValue(true);

    const { account, accountUser } = getContext();
    const mockPayload: identifyChecks.HandleIdentifyChecksPayload = {
      behavior: {
        checkAccountUsers: true,
        checkAccounts: true,
      },
      accountUserEntityId: accountUser.entityId,
      accountEntityId: account.entityId,
    };

    const spiedAccountChecks = jest.spyOn(
      acChecksFile,
      'autoLaunchGuidesForAccountIfAny'
    );
    const spiedAccountUserChecks = jest.spyOn(auChecksFile, 'default');
    await handleIdentifyChecks(mockPayload, logger);
    expect(isCacheHit).toHaveBeenCalledTimes(2);
    expect(spiedAccountChecks).not.toHaveBeenCalled();
    expect(spiedAccountUserChecks).not.toHaveBeenCalled();
  });
});

/**
 * Create and run checks for some amount of users
 */
const identifyAccountUsersAndReturnGuides = async ({
  account,
  organization,
  guideBase,
  userCount = 3,
}: {
  guideBase: GuideBase;
  account: Account;
  organization: Organization;
  userCount?: number;
}) => {
  const users = await createDummyAccountUsersForAccounts(
    organization,
    [account],
    userCount
  );

  for (const user of users) {
    (isCacheHit as jest.Mock).mockReturnValueOnce(false);

    await doAccountUserChecks({
      organization,
      accountUser: user,
      attributes: {},
      logger,
    });
  }

  const guides = await Guide.findAll({
    where: { createdFromGuideBaseId: guideBase.id },
    include: [{ model: GuideParticipant }],
  });

  return guides;
};

const addTargetingToTemplate = async (
  template: Template,
  launchGuideBaseTo?: Account
) => {
  await configureAutolaunchForTemplateTest({
    template,
    accountUserTargeting: {
      type: TargetingType.attributeRules,
      groups: [
        {
          rules: [
            {
              value: 'Andy NotexistCheng',
              ruleType: RuleTypeEnum.notEquals,
              attribute: 'fullName',
              valueType: TargetValueType.text,
            },
          ],
        },
      ],
    },
  });

  if (launchGuideBaseTo)
    await doAccountChecks({
      organization: (await launchGuideBaseTo.$get('organization'))!,
      account: launchGuideBaseTo,
      attributes: {},
      logger,
    });
};

/**
 * Checks that guides and guide participants can actually be created as expected
 * Does not check targeting specifically
 */
describe('launching from identify checks', () => {
  beforeEach(() => {
    /* Always force checks unless otherwise specified */
    (isCacheHit as jest.Mock).mockReturnValueOnce(false);
  });

  describe('basics', () => {
    test('account checkers should add new account to autolaunched', async () => {
      const { organization } = getContext();

      const template = await prepareTemplate(organization);
      await configureAutolaunchForTemplateTest({ template });

      const { account } = await findOrCreateAccount({
        organization,
        accountInput: getDummyAccount(organization),
      });

      await doAccountChecks({
        organization,
        account,
        attributes: {},
        logger,
      });

      const gbs = await GuideBase.count({
        where: { accountId: account.id },
      });
      expect(gbs).toBeGreaterThan(0);
    });

    test('account user checks should add guide participant', async () => {
      const { account, organization, accountUser } = getContext();

      const template = await prepareTemplate(organization);
      await autoLaunchTemplateForAccounts(template, [account]);

      await doAccountUserChecks({
        organization,
        accountUser,
        attributes: {},
        logger,
      });

      const gps = await GuideParticipant.count({
        where: { accountUserId: accountUser.id },
      });

      expect(gps).toBeGreaterThan(0);
    });

    test('can add multiple users to account guide', async () => {
      const { account, organization } = getContext();

      const template = await prepareTemplate(organization, false);
      const [guideBase] = await autoLaunchTemplateForAccounts(template, [
        account,
      ]);

      expect(guideBase).toBeTruthy();

      const guides = await identifyAccountUsersAndReturnGuides({
        guideBase,
        account,
        organization,
      });

      expect(guides.length).toEqual(1);

      const [guide] = guides;

      expect(guide.guideParticipants?.length).toBeGreaterThan(1);
    });

    /* With targeting uses a different method than all/user */
    test('can add users to account guide with targeting', async () => {
      const { account, organization } = getContext();

      const template = await prepareTemplate(organization, false);
      await addTargetingToTemplate(template);

      await doAccountChecks({
        organization,
        account,
        attributes: {},
        logger,
      });

      const guideBase = await GuideBase.findOne({
        where: {
          accountId: account.id,
        },
      });

      if (!guideBase) throw new Error('Could not make guide base');

      const guides = await identifyAccountUsersAndReturnGuides({
        guideBase,
        account,
        organization,
      });

      expect(guides.length).toEqual(1);

      const [guide] = guides;

      expect(guide.guideParticipants?.length).toBeGreaterThan(1);
    });

    test('can add users to user guide with targeting', async () => {
      const { account, organization, accountUser } = getContext();

      const template = await prepareTemplate(organization);
      await addTargetingToTemplate(template, account);

      await doAccountUserChecks({
        organization,
        accountUser,
        attributes: {},
        logger,
      });

      const gps = await GuideParticipant.count({
        where: { accountUserId: accountUser.id },
      });

      expect(gps).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    test('dedupes guide/participants for same user', async () => {
      const { account, organization, accountUser } = getContext();

      const template = await prepareTemplate(organization);
      await autoLaunchTemplateForAccounts(template, [account]);

      const times = randomInt(2, 5);

      for (let i = 0; i < times; i++) {
        (isCacheHit as jest.Mock).mockReturnValueOnce(false);

        await doAccountUserChecks({
          organization,
          accountUser,
          attributes: {},
          logger,
          /* To force no skipping */
          withLaunchReport: true,
        });
      }

      const gps = await GuideParticipant.findAll({
        where: {
          accountUserId: accountUser.id,
        },
        attributes: ['id'],
        include: [
          {
            model: Guide,
            where: { createdFromTemplateId: template.id },
          },
        ],
      });

      expect(gps.length).toEqual(1);
    });

    test('dedupes guidebase for same account', async () => {
      const { organization } = getContext();

      const template = await prepareTemplate(organization);
      await configureAutolaunchForTemplateTest({ template });

      const { account } = await findOrCreateAccount({
        organization,
        accountInput: getDummyAccount(organization),
      });

      const times = randomInt(2, 5);

      for (let i = 0; i < times; i++) {
        await doAccountChecks({
          organization,
          account,
          attributes: {},
          logger,
        });
      }

      const gbs = await GuideBase.count({
        where: { accountId: account.id },
      });

      expect(gbs).toBeGreaterThan(0);
      expect(gbs).toBeLessThan(2);
    });

    test('can force launch tests', async () => {
      const { account, organization, accountUser } = getContext();

      const template = await prepareTemplate(organization);
      await autoLaunchTemplateForAccounts(template, [account]);

      const spied = jest.spyOn(
        addCreatedAccountUserAsParticipantToExistingAccountGuides,
        'default'
      );

      (isCacheHit as jest.Mock).mockReturnValueOnce(true);

      await doAccountUserChecks({
        organization,
        accountUser,
        attributes: {},
        logger,
      });

      expect(spied.mock.calls.length).toBeGreaterThan(0);
    });
  });

  describe('excludeFromUserTargeting flag', () => {
    test('should not launch to eligible user of GB has excludeFromUserTargeting = TRUE', async () => {
      const { account, organization } = getContext();

      const template = await prepareTemplate(organization);
      await autoLaunchTemplateForAccounts(template, [account]);

      const guideBase = await GuideBase.findOne({
        where: { createdFromTemplateId: template.id },
      });

      if (!guideBase) {
        throw new Error('Expected guide base');
      }

      await guideBase.update({ excludeFromUserTargeting: true });

      await doAccountChecks({
        organization,
        account,
        attributes: {},
        logger,
      });

      const guides = await identifyAccountUsersAndReturnGuides({
        guideBase,
        account,
        organization,
      });

      expect(guides.length).toEqual(0);
    });
  });
});
