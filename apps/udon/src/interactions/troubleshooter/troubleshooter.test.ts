import testUtils from 'src/testUtils/test.util';

import {
  TargetingType,
  TargetValueType,
  RuleTypeEnum,
} from 'bento-common/types/targeting';
import { RuleResult } from 'bento-common/types/diagnostics';

import {
  runDiagnosticsForTemplateAndUser,
  runLaunchingDiagnostics,
} from './troubleshooting';

const getContext = testUtils.setup.setupAndSeed('bento');

describe('troubleshooter.runLaunchingDiagnostics', () => {
  test('detects all launch', async () => {
    const { organization, accountUser } = getContext();

    const template = await testUtils.getters.getTemplate(organization);

    if (!template) throw new Error('No test template');

    await testUtils.guides.launchTemplate({ template });

    const result = await runLaunchingDiagnostics({
      accountUserEntityId: accountUser.entityId,
      searchableOrgIds: [organization.id],
    });

    expect(result).toBeTruthy();

    const testKey = `template_${template.id}`;

    const checkResult = result.auLaunchReport?.checks[testKey];

    expect(checkResult).toBeTruthy();
    expect(typeof checkResult?.result).toEqual('string');
    expect((checkResult?.result as string).includes('all')).toBeTruthy();
  });
});

describe('troubleshooter.runDiagnosticsForTemplateAndUser', () => {
  test('detects all launch', async () => {
    const { organization, account, accountUser } = getContext();

    const template = await testUtils.getters.getTemplate(organization);

    if (!template) throw new Error('No template to test');

    await testUtils.guides.launchTemplate({ template });

    const { reports } = await runDiagnosticsForTemplateAndUser({
      organization,
      templateEntityId: template.entityId,
      accountEntityId: account.entityId,
      accountUserEntityId: accountUser.entityId,
    });

    expect(reports).toBeTruthy();

    const checkResult = reports.account?.result;
    expect(
      typeof checkResult === 'string' && checkResult.includes('all')
    ).toBeTruthy();
  });

  test('returns correct context for miso', async () => {
    const { organization, account, accountUser } = getContext();

    const template = (await testUtils.getters.getTemplate(organization))!;

    const { accountName, accountUserName } =
      await runDiagnosticsForTemplateAndUser({
        accountEntityId: account.entityId,
        accountUserEntityId: accountUser.entityId,
        templateEntityId: template.entityId,
        organization,
      });

    expect(account.name).toEqual(accountName);
    expect(accountUser.fullName).toEqual(accountUserName);
  });

  describe.each(['account', 'accountUser'])(
    'targeting by entity type',
    (entityType) => {
      test.each([true, false])(
        `gets ${entityType} targeting reasons for match %s`,
        async (shouldMatch) => {
          const { organization, account, accountUser } = getContext();

          const template = await testUtils.getters.getTemplate(organization);

          if (!template) throw new Error('No template to test');

          const accountTest = entityType === 'account';

          await testUtils.guides.launchTemplate({
            template,
            [accountTest ? 'accountTargeting' : 'accountUserTargeting']: {
              type: TargetingType.attributeRules,
              groups: [
                {
                  rules: [
                    {
                      attribute: accountTest ? 'name' : 'fullName',
                      ruleType: shouldMatch
                        ? RuleTypeEnum.equals
                        : RuleTypeEnum.notEquals,
                      value: (accountTest
                        ? account.name
                        : accountUser.fullName)!,
                      valueType: TargetValueType.text,
                    },
                  ],
                },
              ],
            },
          });

          const { reports } = await runDiagnosticsForTemplateAndUser({
            organization,
            templateEntityId: template.entityId,
            accountEntityId: account.entityId,
            accountUserEntityId: accountUser.entityId,
          });

          expect(reports).toBeTruthy();
          const { result } = reports[entityType] as { result: RuleResult };
          expect(typeof result).toEqual('object');
          if (typeof result === 'string') throw new Error('Wrong result');

          expect(result.failedRules?.length).toEqual(shouldMatch ? 0 : 1);
          expect(result.matchedRules.length).toEqual(shouldMatch ? 1 : 0);
        }
      );
    }
  );

  test('pulls appropriate rule as targeting mismatch reason', async () => {
    const { organization, account, accountUser } = getContext();

    const template = await testUtils.getters.getTemplate(organization);

    if (!template) throw new Error('No template to test');

    const accountNameThatWontMatch = 'ThisAccountNotWow Corp LTD';
    const attrName = 'name';

    await testUtils.guides.launchTemplate({
      template,
      accountTargeting: {
        type: TargetingType.attributeRules,
        groups: [
          {
            rules: [
              {
                attribute: attrName,
                ruleType: RuleTypeEnum.equals,
                value: accountNameThatWontMatch,
                valueType: TargetValueType.text,
              },
            ],
          },
        ],
      },
    });

    const { reports } = await runDiagnosticsForTemplateAndUser({
      organization,
      templateEntityId: template.entityId,
      accountEntityId: account.entityId,
      accountUserEntityId: accountUser.entityId,
    });

    expect(reports).toBeTruthy();
    const { result } = reports.account!;
    if (typeof result === 'string') throw new Error('Wrong result');

    const ruleThrown = result.failedRules?.[0];

    expect(ruleThrown?.ruleValue).toEqual(accountNameThatWontMatch);
    expect(ruleThrown?.attrValue).toEqual(account.name);
    expect(ruleThrown?.attribute).toEqual(attrName);
  });

  test('flags multiple mismatches', async () => {
    const { organization, account, accountUser } = getContext();

    const template = await testUtils.getters.getTemplate(organization);

    if (!template) throw new Error('No template to test');

    const accountNameThatWontMatch = 'ThisAccountNotWow Corp LTD';
    const attrName = 'name';

    await testUtils.guides.launchTemplate({
      template,
      accountTargeting: {
        type: TargetingType.attributeRules,
        groups: [
          {
            rules: [
              {
                attribute: attrName,
                ruleType: RuleTypeEnum.equals,
                value: accountNameThatWontMatch,
                valueType: TargetValueType.text,
              },
              {
                attribute: attrName,
                ruleType: RuleTypeEnum.notEquals,
                value: account.name!,
                valueType: TargetValueType.text,
              },
            ],
          },
        ],
      },
    });

    const { reports } = await runDiagnosticsForTemplateAndUser({
      organization,
      templateEntityId: template.entityId,
      accountEntityId: account.entityId,
      accountUserEntityId: accountUser.entityId,
    });

    expect(reports).toBeTruthy();
    const { result } = reports.account!;
    if (typeof result === 'string') throw new Error('Wrong result');

    expect(result.failedRules?.length).toEqual(2);
  });
});
