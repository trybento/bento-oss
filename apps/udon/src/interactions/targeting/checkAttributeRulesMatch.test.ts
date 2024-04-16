import { RuleTypeEnum, TargetValueType } from 'bento-common/types';
import { applyFinalCleanupHook } from 'src/data/datatests';
import { checkAttributeRulesMatch } from './checkAttributeRulesMatch';
import { AttributeRule } from './types';

applyFinalCleanupHook();

const input = {
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

describe('checkAttributeRulesMatch', () => {
  test('returns true when everything matches', () => {
    const result = checkAttributeRulesMatch({
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
        } as AttributeRule,
      ],
      input,
      extraAttributes: {
        templates: [],
      },
    });
    expect(result).toBe(true);
  });

  test('returns false when some rule does not match', () => {
    const result = checkAttributeRulesMatch({
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
      input,
      extraAttributes: {
        templates: [],
      },
    });
    expect(result).toBe(false);
  });
});
