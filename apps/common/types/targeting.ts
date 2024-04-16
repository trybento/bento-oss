export enum GroupCondition {
  /** Results should match ALL targeting rules */
  all = 'all',
  /** Results should match ANY of targeting rules */
  any = 'any',
}

/** Used for determining account and account user targeting type */
export enum TargetingType {
  /** Matches all (no specific rules is given) */
  all = 'all',
  /** @deprecated not used anymore, should be removed soon */
  role = 'role',
  /** Matches based on targeting attributes */
  attributeRules = 'attribute_rules',
}

/** Used for determining account targeting type */
export enum ModuleTargetingRuleType {
  attributeRules = 'attribute_rules',
}

export type SupportedAttributeValueTypes = string | number | boolean | string[];

/** Properties of an attribute rule for submitted */
export type AttributeRuleArgs = {
  attribute: string;
  ruleType: RuleTypeEnum;
  valueType: TargetValueType;
  numberValue?: number;
  textValue?: string | string[];
  booleanValue?: boolean;
  dateValue?: string;
  templateValue?: string;
  branchingPathValue?: string;
  value?: SupportedAttributeValueTypes;
};

/** General shape of rules as formatted fresh off a query */
export type RawRule = {
  attribute: string;
  ruleType: RuleTypeEnum;
  value: SupportedAttributeValueTypes;
  valueType: TargetValueType;
};

export interface AutolaunchRulesData<T = AttributeRuleArgs> {
  ruleType: TargetingType;
  rules: T[];
}

export interface AutolaunchTargetsData<T = AttributeRuleArgs> {
  targetType: TargetingType;
  rules: T[];
}

export enum StepAutoCompleteBaseOn {
  event = 'event',
  attribute = 'attribute',
  guide = 'guide',
}

export enum TargetValueType {
  number = 'number',
  text = 'text',
  boolean = 'boolean',
  date = 'date',
  template = 'template',
  stringArray = 'stringArray',
  branchingPath = 'branchingPath',
  audience = 'audience',
}

export enum RuleTypeEnum {
  lt = 'lt',
  lte = 'lte',
  equals = 'eq',
  notEquals = 'ne',
  gte = 'gte',
  gt = 'gt',

  // generic
  isEmpty = 'empty',
  isNotEmpty = 'notEmpty',

  // list rules, e.g. has all, etc.
  all = 'all',
  any = 'any',
  only = 'only',
  none = 'none',

  // relative date rules
  relativeExactly = 're',
  relativeMoreThan = 'rmt',
  relativeLessThan = 'rlt',

  // string searching, not allowed for step auto-completion
  stringContains = 'c',
  stringDoesNotContain = 'nc',
}

export enum LongRuleTypeEnum {
  lt = 'less_than',
  lte = 'less_than_or_equal_to',
  equals = 'equals',
  gte = 'greater_than_or_equal_to',
  gt = 'greater_than',
}

export type CommonTargetingSegment<T = AttributeRuleArgs> = {
  type: TargetingType;
  rules: T[];
  grouping: GroupCondition;
};

export type CommonTargeting<T = AttributeRuleArgs> = {
  account: CommonTargetingSegment<T>;
  accountUser: CommonTargetingSegment<T>;
};

export type InlineEmbedTargetingSegment = CommonTargetingSegment;

export type InlineEmbedTargeting = {
  account: InlineEmbedTargetingSegment;
  accountUser: InlineEmbedTargetingSegment;
};

export type IntegrationApiKeyTargetingSegment = CommonTargetingSegment;

export type IntegrationApiKeyTargeting = {
  account: IntegrationApiKeyTargetingSegment;
  accountUser: IntegrationApiKeyTargetingSegment;
};

export type TargetingGroup<T = RawRule> = {
  rules: T[];
};

export type GroupTargetingSegment<T = RawRule> = {
  type: TargetingType;
  groups?: TargetingGroup<T>[];
};

export type GroupTargeting<T = RawRule> = {
  account: GroupTargetingSegment<T>;
  accountUser: GroupTargetingSegment<T>;
  audiences?: GroupTargetingSegment<T>;
};

export enum TemplateAttribute {
  TemplateReceived = 'template',
  TemplateCompleted = 'templateCompleted',
}

export type TargetingRuleRow = {
  groupIndex: number;
} & RawRule;
