import {
  GroupTargetingSegment,
  RawRule,
  RuleTypeEnum,
  TargetingRuleRow,
  TargetingType,
  TargetValueType,
} from '../types/targeting';
import {
  targetingRuleRowsToTargetingSegment,
  targetingSegmentToTargetingRuleRows,
} from './targeting';

const fakeTargetingRule = (value: string): RawRule => ({
  attribute: 'name',
  ruleType: RuleTypeEnum.notEquals,
  valueType: TargetValueType.text,
  value,
});

describe('targetingRuleRowsToTargetingSegment', () => {
  test('handles empty', () => {
    const result = targetingRuleRowsToTargetingSegment([]);

    expect(result.type).toEqual(TargetingType.all);
    expect(!result.groups || result.groups.length === 0).toBeTruthy();
  });

  test('transforms into group targeting', () => {
    const attrVal = 'joWow';
    const result = targetingRuleRowsToTargetingSegment([
      { ...fakeTargetingRule(attrVal), groupIndex: 0 },
    ]);

    expect(result.groups?.length).toEqual(1);
    expect(result.groups[0].rules.length).toEqual(1);
    expect(result.groups[0].rules[0].value).toEqual(attrVal);
  });

  test('transforms into group targeting with random groupIndex', () => {
    const attrVal = 'joWow';
    const result = targetingRuleRowsToTargetingSegment([
      { ...fakeTargetingRule(attrVal), groupIndex: 10 },
    ]);

    expect(result.groups?.length).toEqual(1);
    expect(result.groups[0].rules.length).toEqual(1);
    expect(result.groups[0].rules[0].value).toEqual(attrVal);
  });

  test('creates different groups', () => {
    const list: TargetingRuleRow[] = [
      { ...fakeTargetingRule('allStar'), groupIndex: 0 },
      { ...fakeTargetingRule('jenkins'), groupIndex: 0 },
      { ...fakeTargetingRule('ozzy'), groupIndex: 1 },
    ];

    const result = targetingRuleRowsToTargetingSegment(list);

    expect(result.groups?.length).toEqual(2);
    result.groups.forEach((group, i) => {
      const filteredByGroupIndex = list.filter((r) => r.groupIndex === i);
      expect(group.rules.length).toEqual(filteredByGroupIndex.length);
    });
  });
});

describe('targetingSegmentToTargetingRuleRows', () => {
  test('handles no groups', () => {
    const result = targetingSegmentToTargetingRuleRows({
      type: TargetingType.all,
    });

    expect(result.length).toEqual(0);
  });

  test('tags rules with group number', () => {
    const segment: GroupTargetingSegment = {
      type: TargetingType.attributeRules,
      groups: [
        { rules: [{ ...fakeTargetingRule('one') }] },
        { rules: [{ ...fakeTargetingRule('two') }] },
      ],
    };

    const result = targetingSegmentToTargetingRuleRows(segment);

    expect(result.length).toEqual(2);
    segment.groups.forEach((group, i) => {
      const rule = group.rules[0];

      const transformedRule = result.find((r) => r.groupIndex === i);
      expect(rule.value).toEqual(transformedRule.value);
    });
  });
});

describe('segment and rule row transforms', () => {
  test('goes segment to rows and back', () => {
    const segment: GroupTargetingSegment = {
      type: TargetingType.attributeRules,
      groups: [
        { rules: [{ ...fakeTargetingRule('one') }] },
        { rules: [{ ...fakeTargetingRule('two') }] },
      ],
    };

    const rows = targetingSegmentToTargetingRuleRows(segment);
    const reverted = targetingRuleRowsToTargetingSegment(rows);
    expect(reverted).toEqual(segment);
  });

  test('goes rows to segment and back', () => {
    const list: TargetingRuleRow[] = [
      { ...fakeTargetingRule('allStar'), groupIndex: 0 },
      { ...fakeTargetingRule('jenkins'), groupIndex: 0 },
      { ...fakeTargetingRule('ozzy'), groupIndex: 1 },
    ];

    const segment = targetingRuleRowsToTargetingSegment(list);
    const reverted = targetingSegmentToTargetingRuleRows(segment);

    expect(reverted).toEqual(list);
  });
});
