import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { createGuideBase } from '../createGuideBase';
import {
  createDummyAccounts,
  createDummyAccountUsers,
  createDummyAccountUsersForAccounts,
  launchDefaultTemplate,
} from 'src/testUtils/dummyDataHelpers';
import {
  autoLaunchTemplateForAccounts,
  configureAutolaunchForTemplateTest,
} from '../targeting/testHelpers';
import { Template } from 'src/data/models/Template.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Guide } from 'src/data/models/Guide.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { AutoLaunchLog } from 'src/data/models/AutoLaunchLog.model';

const getContext = setupAndSeedDatabaseForTests('paydayio');

describe('guide launching', () => {
  test('creates guide base from template', async () => {
    const { organization, account } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    expect(template).toBeTruthy();

    const guideBase = await createGuideBase({
      account,
      templateEntityId: template!.entityId,
    });

    expect(guideBase).toBeTruthy();

    const guideBaseCount = await GuideBase.count({
      where: { organizationId: organization.id },
    });

    expect(guideBaseCount).toBeGreaterThan(0);
    await guideBase.destroy({ force: true });
  });

  test('creates guides from guide base for one account when launched', async () => {
    const { organization, account } = getContext();

    await createDummyAccounts(organization, 3);

    const guideBase = await launchDefaultTemplate({ organization, account });

    const gb = await GuideBase.findOne({ where: { id: guideBase.id } });

    expect(gb?.state).toEqual('active');

    const guidesCount = await Guide.count({
      where: { organizationId: organization.id },
    });

    expect(guidesCount).toEqual(1);
  });

  test('guide does not automatically launch to any account users if all targeting set', async () => {
    const { organization, account } = getContext();
    const COUNT = 4;
    await createDummyAccountUsers(organization, account, COUNT);
    await launchDefaultTemplate({
      account,
      organization,
      userTemplate: true,
    });
    const accountUserCount = await AccountUser.count({
      where: { organizationId: organization.id },
    });
    // One user is created on initial setup.
    expect(accountUserCount).toEqual(COUNT + 1);

    const guidesCount = await Guide.count({
      where: { organizationId: organization.id },
    });
    expect(guidesCount).toEqual(0);
  });
});

describe('guide autolaunching', () => {
  /**
	 * TODO: Create guide rule testing with sample data
	 * Sample data for targets
		targets: [{targetType: "attribute_rules",…}]
		0: {targetType: "attribute_rules",…}
		id: "VGVtcGxhdGVUYXJnZXQ6MzRkNGNjY2ItNTZkNy00OWRjLTgwN2QtZTdhYjY3NTA1MDUy"
		rules: [{value: "user", ruleType: "eq", attribute: "role", valueType: "text"}]
		targetType: "attribute_rules"

		autoLaunchRules: [{ruleType: "attribute_rules",…}]
		0: {ruleType: "attribute_rules",…}
		id: "VGVtcGxhdGVUYXJnZXQ6MDljNzRiNGYtNTY3Mi00YTUwLTg1MDAtOTc5NWQzNTJhYWRj"
		ruleType: "attribute_rules"
		rules: [{value: "Terrell Razorworks", ruleType: "eq", attribute: "name", valueType: "text"}]
	*/

  test('autolaunches to all', async () => {
    const { organization } = getContext();

    const accounts = await createDummyAccounts(organization, 3);
    await createDummyAccountUsersForAccounts(organization, accounts);

    const template = (await Template.findOne({
      where: { organizationId: organization.id },
    }))!;

    await configureAutolaunchForTemplateTest({ template });
    await autoLaunchTemplateForAccounts(template, accounts);

    const guidesCount = await Guide.count({
      where: { organizationId: organization.id },
    });
    const accountUsersCount = await AccountUser.count({
      where: {
        accountId: accounts.map((a) => a.id),
      },
    });

    const logs = await AutoLaunchLog.findOne({
      where: { templateId: template.id },
    });

    expect(logs).toBeTruthy();

    expect(guidesCount).toEqual(accountUsersCount);
  });
});
