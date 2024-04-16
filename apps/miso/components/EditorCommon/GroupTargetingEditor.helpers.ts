import {
  GroupTargeting,
  RawRule,
  RuleTypeEnum,
  TargetValueType,
} from 'bento-common/types/targeting';
import {
  audienceToAudienceRule,
  emptyTargeting,
} from 'bento-common/utils/targeting';

export interface TargetingForm {
  targeting: GroupTargeting;
}

/**
 * Cast values according to value types
 */
const sanitizeRule = (rule: RawRule): RawRule => {
  const { valueType } = rule;
  let value = rule.value;

  // Turn strings into numbers
  if (valueType === 'number') {
    value = Number(value);
  }

  // Turn date objects into string
  if (valueType === 'date' && value instanceof Date) {
    value = value.toISOString();
  }

  return {
    ...rule,
    value,
  };
};

/**
 * Ensures targeting rules are parsed to their correct types before
 * saving to the backend (e.g., parsing strings to numbers).
 */
export const castTargetingRules = ({
  account,
  accountUser,
  audiences,
}: GroupTargeting): GroupTargeting => ({
  account: {
    ...account,
    groups: account.groups?.map((g) => ({
      rules: g.rules.map((r) => sanitizeRule(r)),
    })),
  },
  accountUser: {
    ...accountUser,
    groups: accountUser.groups?.map((g) => ({
      rules: g.rules.map((r) => sanitizeRule(r)),
    })),
  },
  ...(audiences
    ? {
        audiences: {
          ...audiences,
          groups: audiences.groups?.map((g) => ({
            rules: g.rules.map((r) => sanitizeRule(r)),
          })),
        },
      }
    : {}),
});

/**
 * Audiences v2.0 helper where we only set "audiences matches" for one audience
 */
export const setFormToAudience = (
  setFieldValue: (field: string, val: any) => void,
  audienceEntityId: string
) => {
  /* Reset ad-hoc rules to reduce user confusion */
  const empty = emptyTargeting;
  setFieldValue('targeting', empty);

  setFieldValue(
    'targeting.audiences',
    audienceToAudienceRule(audienceEntityId)
  );
};

export const NEW_RULE: RawRule = {
  attribute: '',
  ruleType: RuleTypeEnum.equals,
  valueType: TargetValueType.text,
  value: '',
};
