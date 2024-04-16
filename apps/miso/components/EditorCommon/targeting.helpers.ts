import { FC, ReactNode, SVGProps } from 'react';
import {
  AttributeType,
  GuideDesignType,
  GuideFormFactor,
  GuideTypeEnum,
  RankableType,
  RuleTypeEnum,
  TargetingType,
  TargetValueType,
} from 'bento-common/types';
import { SelectOption } from 'bento-common/components/RichTextEditor/extensions/Select/withSelect';
import {
  AccountTarget,
  checkIsAnyRuleIncomplete,
  getAutoLaunchMutationArgs,
  prepareInitialAttributeRuleValues,
} from '../GuideAutoLaunchModal/Template/autolaunch.helpers';
import { TargetRuleTypeEnumType } from 'relay-types/SetAutoLaunchRulesAndTargetsForTemplateMutation.graphql';
import {
  CommonTargeting,
  GroupCondition,
  GroupTargeting,
  RawRule,
  SupportedAttributeValueTypes,
  TemplateAttribute,
} from 'bento-common/types/targeting';
import {
  emptyTargeting,
  getTargetValueColumnName,
  iterateRules,
} from 'bento-common/utils/targeting';
import { FormattedRules } from './types';
import BlockedAccountsQuery from 'queries/BlockedAccountsQuery';
import TemplateManuallyLaunchedQuery from 'queries/TemplateManuallyLaunchedQuery';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import { cloneDeep } from 'lodash';
import { isEmptyCheckTargeting } from 'bento-common/data/helpers';

export interface RuleType {
  label: string;
  value: TargetRuleTypeEnumType;
  valueType: TargetValueType;
  default?: true;
}

export interface RuleGroupType {
  label: string;
  value: 'all' | 'any';
}

export interface AutoLaunchableTemplateType {
  readonly entityId: string;
  readonly name: string;
  readonly privateName?: string;
  readonly priorityRanking: number;
  readonly isCyoa: boolean;
  readonly isAutoLaunchEnabled: boolean;
  readonly formFactor: GuideFormFactor;
  readonly designType: GuideDesignType;
  readonly type: GuideTypeEnum;
  readonly splitTargets?: Array<{
    name: string;
    privateName: string;
    entityId: string;
  }>;
}

export interface AutoLaunchableTarget {
  entityId: string;
  name: string;
  type: RankableType;
  launchedAt: string | null;
  priorityRanking: number;
  Icon?: FC<SVGProps<SVGSVGElement>>;
  infoTags?: ReactNode[];
  infoTagsFallbackText?: string;
}

export interface Rule {
  attribute:
    | (SelectOption & {
        name?: string;
        type?: AttributeType;
        valueType?: TargetValueType;
        choices?: (SelectOption & {
          choiceKey: string;
          id: string;
        })[];
      })
    | null;
  attributeType: AttributeType;
  condition: SelectOption | string | null;
  value: string[] | string | boolean | Date | number | null | undefined;
}

export const NEW_ACCOUNT_TARGET: AccountTarget = {
  id: '',
  ruleType: TargetingType.attributeRules,
  rules: [],
};

export const NEW_ACCOUNT_RULE: Rule = {
  attribute: null,
  attributeType: AttributeType.account,
  condition: '',
  value: '',
};

export const NEW_ACCOUNT_USER_RULE: Rule = {
  attribute: null,
  attributeType: AttributeType.accountUser,
  condition: '',
  value: '',
};

export const RULE_GROUP_CONDITIONS: RuleGroupType[] = [
  { label: 'all', value: 'all' },
  { label: 'any', value: 'any' },
];

export const GENERIC_RULE_CONDITIONS: (
  vt: TargetValueType,
  defaultValue?: any
) => RuleType[] = (valueType: TargetValueType) => [
  {
    label: 'Is empty',
    value: RuleTypeEnum.isEmpty,
    valueType,
  },
  {
    label: 'Is not empty',
    value: RuleTypeEnum.isNotEmpty,
    valueType,
  },
];

export const ARRAY_RULE_CONDITIONS: RuleType[] = [
  {
    label: 'Has any of',
    value: RuleTypeEnum.any,
    valueType: TargetValueType.stringArray,
    default: true,
  },
  {
    label: 'Has all of',
    value: RuleTypeEnum.all,
    valueType: TargetValueType.stringArray,
  },
  {
    label: 'Has exactly',
    value: RuleTypeEnum.only,
    valueType: TargetValueType.stringArray,
  },
  {
    label: 'Has none of',
    value: RuleTypeEnum.none,
    valueType: TargetValueType.stringArray,
  },
  ...GENERIC_RULE_CONDITIONS(TargetValueType.stringArray),
];

export const TEXT_BOOLEAN_RULE_CONDITIONS: RuleType[] = [
  {
    label: 'Is',
    value: RuleTypeEnum.equals,
    valueType: TargetValueType.text,
    default: true,
  },
  {
    label: 'Is one of',
    value: RuleTypeEnum.any,
    valueType: TargetValueType.stringArray,
  },
  {
    label: 'Is not',
    value: RuleTypeEnum.notEquals,
    valueType: TargetValueType.text,
  },
  {
    label: 'Is none of',
    value: RuleTypeEnum.none,
    valueType: TargetValueType.stringArray,
  },
  {
    label: 'Contains',
    value: RuleTypeEnum.stringContains,
    valueType: TargetValueType.text,
  },
  {
    label: 'Does not contain',
    value: RuleTypeEnum.stringDoesNotContain,
    valueType: TargetValueType.text,
  },
  ...GENERIC_RULE_CONDITIONS(TargetValueType.text),
];

export const AUDIENCE_RULE_CONDITIONS: RuleType[] = [
  {
    label: 'Matches',
    value: RuleTypeEnum.equals,
    valueType: TargetValueType.audience,
    default: true,
  },
  {
    label: 'Does not match',
    value: RuleTypeEnum.notEquals,
    valueType: TargetValueType.audience,
  },
];

export const TEMPLATE_RULE_CONDITIONS: RuleType[] = [
  {
    label: 'Is',
    value: RuleTypeEnum.equals,
    valueType: TargetValueType.template,
    default: true,
  },
  {
    label: 'Is not',
    value: RuleTypeEnum.notEquals,
    valueType: TargetValueType.template,
  },
];

export const DATE_RULE_CONDITIONS: RuleType[] = [
  {
    label: 'Is before',
    value: RuleTypeEnum.lt,
    valueType: TargetValueType.date,
  },
  {
    label: 'Is after',
    value: RuleTypeEnum.gt,
    default: true,
    valueType: TargetValueType.date,
  },
  {
    label: 'Is less than',
    value: RuleTypeEnum.relativeLessThan,
    valueType: TargetValueType.date,
  },
  {
    label: 'Is more than',
    value: RuleTypeEnum.relativeMoreThan,
    valueType: TargetValueType.date,
  },
  ...GENERIC_RULE_CONDITIONS(TargetValueType.date),
];

export const NUMBER_RULE_CONDITIONS: RuleType[] = [
  {
    label: 'Is equal to',
    value: RuleTypeEnum.equals,
    valueType: TargetValueType.number,
    default: true,
  },
  {
    label: 'Is not equal to',
    value: RuleTypeEnum.notEquals,
    valueType: TargetValueType.number,
  },
  {
    label: 'Is less than',
    value: RuleTypeEnum.lt,
    valueType: TargetValueType.number,
  },
  {
    label: 'Is less than or equal to',
    value: RuleTypeEnum.lte,
    valueType: TargetValueType.number,
  },
  {
    label: 'Is greater than',
    value: RuleTypeEnum.gt,
    valueType: TargetValueType.number,
  },
  {
    label: 'Is greater than or equal to',
    value: RuleTypeEnum.gte,
    valueType: TargetValueType.number,
  },
  ...GENERIC_RULE_CONDITIONS(TargetValueType.number),
];

export const BOOLEAN_OPTIONS = [
  { label: 'NULL', value: null },
  { label: 'TRUE', value: true },
  { label: 'FALSE', value: false },
  ...GENERIC_RULE_CONDITIONS(TargetValueType.boolean),
];

export const TEMPLATE_OPTIONS = [
  {
    label: 'Guide received',
    value: TemplateAttribute.TemplateReceived,
    type: AttributeType.accountUser,
    name: TemplateAttribute.TemplateReceived,
    valueType: TargetValueType.template,
  },
  {
    label: 'Guide completed',
    value: TemplateAttribute.TemplateCompleted,
    type: AttributeType.accountUser,
    name: TemplateAttribute.TemplateCompleted,
    valueType: TargetValueType.template,
  },
];

export const RULE_CONDITIONS_BY_TYPE: Record<TargetValueType, RuleType[]> = {
  [TargetValueType.boolean]: TEXT_BOOLEAN_RULE_CONDITIONS,
  [TargetValueType.text]: TEXT_BOOLEAN_RULE_CONDITIONS,
  [TargetValueType.template]: TEMPLATE_RULE_CONDITIONS,
  [TargetValueType.branchingPath]: TEXT_BOOLEAN_RULE_CONDITIONS,
  [TargetValueType.date]: DATE_RULE_CONDITIONS,
  [TargetValueType.number]: NUMBER_RULE_CONDITIONS,
  [TargetValueType.stringArray]: ARRAY_RULE_CONDITIONS,
  [TargetValueType.audience]: AUDIENCE_RULE_CONDITIONS,
};

export function attributesFilter(attributes, typeFilter) {
  return attributes
    .filter((attribute) => attribute.type === typeFilter)
    .map((attribute) => {
      const { type, name } = attribute;
      const displayType = type === AttributeType.accountUser ? 'user' : type;

      return {
        ...attribute,
        value: name,
        label: `${displayType}:${name}`,
      };
    });
}

/** Get allowed conditions for the value data type */
export function getRuleConditions(valueType: TargetValueType) {
  return RULE_CONDITIONS_BY_TYPE[valueType] || [];
}

export function getDefaultRuleCondition(ruleType: TargetValueType) {
  return getRuleConditions(ruleType).find((c) => c.default);
}

export function prepareRuleData(rule, unifiedValue = false) {
  const valueType = rule.attribute.valueType ?? rule.valueType;
  let { value } = rule;

  /** Relative dates store number e.g. #days ago */
  const valueProp = getTargetValueColumnName(
    valueType === 'date' && typeof value === 'number' ? 'number' : valueType
  );

  if (valueType === 'number') {
    value = Number(value);
  }

  // Turn date objects into string.
  if (valueType === 'date' && typeof value === 'object') {
    value = (value as Date).toISOString();
  }

  return {
    attribute: rule.attribute.name || rule.attribute,
    ruleType: rule.condition?.value || rule.ruleType,
    valueType,
    [unifiedValue ? 'value' : valueProp]: value,
  };
}

/** For use with Formik RulesContainer */
export const accountFieldKeys = {
  array: 'targeting.account.rules',
  targetRule: 'targeting.account.type',
};

/** For use with Formik RulesContainer */
export const accountUserFieldKeys = {
  array: 'targeting.accountUser.rules',
  targetRule: 'targeting.accountUser.type',
};

export const validateTargeting = (
  targeting: CommonTargeting<FormattedRules>
) => {
  const { type: accountTargetType, rules: accountRules } = targeting.account;
  const { type: accountUserTargetType, rules: accountUserRules } =
    targeting.accountUser;

  if (
    (accountTargetType === TargetingType.attributeRules &&
      (!accountRules || accountRules.length === 0)) ||
    (accountUserTargetType === TargetingType.attributeRules &&
      (!accountUserRules || accountUserRules.length === 0))
  )
    return false;

  return !checkIsAnyRuleIncomplete({
    accountRules,
    accountTargetType,
    accountUserRules,
    accountUserTargetType,
  });
};

type MutationTransformOpts = {
  /** Transforms [type]Value keys to just value. Usually for JSONB-stored targeting */
  forceUnifiedValue?: boolean;
};

/**
 * Takes the server side common targeting and appends data to
 *   create formatted rules common targeting
 */
export const prepareTargetingData = (targeting, attributes) => ({
  account: {
    ...targeting.account,
    rules: prepareRulesIfNeeded({
      rules: targeting.account.rules,
      type: AttributeType.account,
      attrs: attributesFilter(attributes, AttributeType.account),
    }),
  },
  accountUser: {
    ...targeting.accountUser,
    rules: prepareRulesIfNeeded({
      rules: targeting.accountUser.rules,
      type: AttributeType.accountUser,
      attrs: attributesFilter(attributes, AttributeType.accountUser),
    }),
  },
});

const objConditionToStr = (grouping: GroupCondition | SelectOption) =>
  (typeof grouping === 'string'
    ? grouping
    : grouping?.value ?? GroupCondition.all) as GroupCondition;

export const commonTargetingToMutationArgs = <T>(
  targeting: CommonTargeting<T>,
  opts: MutationTransformOpts = {}
) => {
  const { autoLaunchRules, targets } = getAutoLaunchMutationArgs(
    {
      accountGroupCondition: objConditionToStr(targeting.account.grouping),
      accountRules: targeting.account.rules,
      accountTargetType: targeting.account.type,
      accountUserGroupCondition: objConditionToStr(
        targeting.accountUser.grouping
      ),
      accountUserRules: targeting.accountUser.rules,
      accountUserTargetType: targeting.accountUser.type,
      templateEntityId: null,
    },
    opts
  );

  return {
    account: {
      ...targeting.account,
      grouping: objConditionToStr(targeting.account.grouping),
      rules: autoLaunchRules.flatMap((rule) => rule.rules || []),
    },
    accountUser: {
      ...targeting.accountUser,
      grouping: objConditionToStr(targeting.accountUser.grouping),
      rules: targets.flatMap((target) => target.rules || []),
    },
  };
};

type PrepareRulesArgs = {
  rules: Array<RawRule | FormattedRules>;
  type: AttributeType;
  attrs: Array<FormattedRules['attribute']>;
};

/**
 * For the UI to display the attribute rules from the server in dropdowns correctly
 *   We need to map it to the corresponding attribute data
 * This is equivalent to what we do with prepareTargetingData but for CommonTargeting format
 *   instead of AutolaunchContext format
 *
 * Does not currently support dynamic internal attribute like branching or templateLaunched
 */
export const prepareRulesIfNeeded = ({
  rules = [],
  attrs = [],
  type,
}: PrepareRulesArgs) => {
  if (rules.length === 0) return [];

  if ((rules[0] as FormattedRules).condition) return rules;

  return prepareInitialAttributeRuleValues([{ rules }], type, attrs);
};

// Didn't type since it may be irrelevant soon after AND/OR rebuild
export const commonTargetingToAutolaunchContext = (targeting) => ({
  accountGroupCondition: targeting?.account.grouping as GroupCondition,
  accountRules: targeting?.account.rules as any[],
  accountTargetType: targeting?.account.type,
  accountUserGroupCondition: targeting?.accountUser.grouping as GroupCondition,
  accountUserRules: targeting?.accountUser.rules as any[],
  accountUserTargetType: targeting?.accountUser.type,
  templateEntityId: null,
});

const getFillerValue = (vt: TargetValueType) => {
  switch (vt) {
    case TargetValueType.boolean:
      return true;
    case TargetValueType.number:
      return 1;
    case TargetValueType.date:
      return new Date();
    case TargetValueType.stringArray:
      return ['.'];
    default:
      return '.';
  }
};

/**
 * Make sure data is formed as expected
 * Also drop the targeting types we don't intend to use
 */
export const sanitizeTargeting = (
  inputTargeting: GroupTargeting,
  usingAudiences?: boolean
) => {
  const targeting = cloneDeep(inputTargeting);

  if (usingAudiences) {
    /** Reset ad hoc if audiences are used */
    const empty = emptyTargeting;
    targeting.account = empty.account;
    targeting.accountUser = empty.accountUser;

    return targeting;
  } else if (!usingAudiences && targeting.audiences) {
    /** Otherwise, drop audiences */
    delete targeting.audiences;
  }

  if (targeting.account.type === TargetingType.all)
    targeting.account.groups = [];
  if (targeting.accountUser.type === TargetingType.all)
    targeting.accountUser.groups = [];

  iterateRules(targeting, (rule) => {
    if (isEmptyCheckTargeting(rule.ruleType)) {
      const fillerValue = getFillerValue(
        rule.valueType
      ) as SupportedAttributeValueTypes;
      rule.value = fillerValue;
    }
  });

  return targeting;
};

/**
 * Collects the information needed to render group targeting editor supporting components
 * Loading them at once allows us to display a loading state and not have the
 *   sub-pieces cause layout shift.
 */
export const useTargetingInformation = (templateEntityId?: string) => {
  const blockedAccounts = useQueryAsHook(
    BlockedAccountsQuery,
    {},
    {
      dependencies: [templateEntityId],
    }
  );
  const manualLaunches = useQueryAsHook(
    TemplateManuallyLaunchedQuery,
    {
      templateEntityId,
    },
    {
      disable: !templateEntityId,
    }
  );

  return {
    loading: blockedAccounts.loading || manualLaunches.loading,
    data: {
      blockedAccounts: blockedAccounts.data?.accounts ?? [],
      manualLaunches:
        manualLaunches.data?.template?.manuallyLaunchedAccounts ?? [],
    },
  };
};
