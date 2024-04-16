import { RuleTypeEnum, TargetValueType } from 'bento-common/types';
import { applyFinalCleanupHook } from 'src/data/datatests';
import { doesAccountMatchAutoLaunchRules } from './checkAndAutoLaunchGuideBaseFromTemplates';
import { formatTargeting } from './targeting.helpers';

applyFinalCleanupHook();

const account = {
  name: 'ACME',
  fullName: 'John Doe',
  email: 'john@trybento.co',
  createdInOrganizationAt: '2020-01-01T00:00:00.000Z',
  attributes: {
    id: 'ee2dcfbf-028b-4cb8-ba9c-4cca2f422874',
    count: 10,
    isAdmin: false,
    trialStartedAt: new Date(),
  },
} as any;

describe('doesAccountMatchAutoLaunchRules', () => {
  describe('"ALL" aggregation', () => {
    test('returns true if matching for "all"', () => {
      const rules = [
        {
          ruleType: 'all',
          rules: [],
        },
      ] as any[];

      const formatted = formatTargeting({
        autoLaunchRules: rules,
        templateTargets: [],
      });

      const result = doesAccountMatchAutoLaunchRules({
        account,
        rules: formatted.account,
      });
      expect(result).toEqual([true, [{ ruleType: 'all' }]]);
    });

    test('returns true if all rules match', () => {
      const rules = [
        {
          ruleType: 'attribute_rules',
          rules: [
            {
              valueType: TargetValueType.text,
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              value: 'ACME',
            },
            {
              valueType: TargetValueType.number,
              attribute: 'count',
              ruleType: RuleTypeEnum.gt,
              value: 5,
            },
            {
              valueType: TargetValueType.date,
              attribute: 'trialStartedAt',
              ruleType: RuleTypeEnum.lt,
              value: new Date(9999, 1, 1),
            },
          ],
        },
      ] as any[];

      const formatted = formatTargeting({
        autoLaunchRules: rules,
        templateTargets: [],
      });

      const result = doesAccountMatchAutoLaunchRules({
        account,
        rules: formatted.account,
      });
      expect(result).toEqual([true, rules]);
    });

    test('returns false if some rule do not match', () => {
      const rules = [
        {
          ruleType: 'attribute_rules',
          rules: [
            {
              valueType: TargetValueType.text,
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              value: 'ACME',
            },
            {
              valueType: TargetValueType.boolean,
              attribute: 'isAdmin',
              ruleType: RuleTypeEnum.equals,
              value: true,
            },
          ],
        },
      ] as any[];

      const formatted = formatTargeting({
        autoLaunchRules: rules,
        templateTargets: [],
      });

      const result = doesAccountMatchAutoLaunchRules({
        account,
        rules: formatted.account,
      });
      expect(result).toEqual([false, []]);
    });
  });

  describe('"ANY" aggregation', () => {
    test('returns true if some rule matches', () => {
      const rules = [
        {
          ruleType: 'attribute_rules',
          rules: [
            {
              valueType: TargetValueType.text,
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              value: 'ACME',
            },
          ],
        },
        {
          ruleType: 'attribute_rules',
          rules: [
            {
              valueType: TargetValueType.text,
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              value: 'Another Company Name',
            },
          ],
        },
      ] as any[];

      const formatted = formatTargeting({
        autoLaunchRules: rules,
        templateTargets: [],
      });

      const result = doesAccountMatchAutoLaunchRules({
        account,
        rules: formatted.account,
      });
      expect(result).toEqual([true, [rules[0]]]);
    });

    test('returns false if not a single rule matches', () => {
      const rules = [
        {
          ruleType: 'attribute_rules',
          rules: [
            {
              valueType: TargetValueType.text,
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              value: 'Apple',
            },
          ],
        },
        {
          ruleType: 'attribute_rules',
          rules: [
            {
              valueType: TargetValueType.text,
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              value: 'Microsoft',
            },
          ],
        },
      ] as any[];

      const formatted = formatTargeting({
        autoLaunchRules: rules,
        templateTargets: [],
      });

      const result = doesAccountMatchAutoLaunchRules({
        account,
        rules: formatted.account,
      });
      expect(result).toEqual([false, []]);
    });
  });
});
