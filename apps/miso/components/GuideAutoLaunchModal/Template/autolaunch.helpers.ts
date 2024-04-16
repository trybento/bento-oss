import {
  attributesFilter,
  getRuleConditions,
  NEW_ACCOUNT_RULE,
  NEW_ACCOUNT_USER_RULE,
  prepareRuleData,
  Rule,
  TEMPLATE_OPTIONS,
} from '../../EditorCommon/targeting.helpers';
import { AttributeType } from 'bento-common/types';
import { getRuleValue, isRuleIncomplete } from 'bento-common/utils/targeting';
import * as TestAutolaunchRulesMutation from 'mutations/TestAutolaunchRules';
import * as SetAutoLaunchRulesAndTargetsForTemplateMutation from 'mutations/SetAutoLaunchRulesAndTargetsForTemplate';
import * as SetPriorityRankingsMutation from 'mutations/SetPriorityRankings';
import { AttributesQuery_attributes } from 'providers/AttributesProvider';
import { BranchingQuestions } from 'queries/BranchingQuestionsQuery';
import { GroupCondition, TargetingType } from 'bento-common/types';
import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import {
  GenericPriorityFormValues,
  sanitizePriorityRankingsInput,
} from 'components/Templates/Tabs/PriorityRankingForm/helpers';
import { TargetTypeEnumType } from 'relay-types/SetAutoLaunchRulesAndTargetsForTemplateMutation.graphql';
import { GroupTargeting, RawRule } from 'bento-common/types/targeting';
import { TestAutolaunchRulesMutation$variables } from 'relay-types/TestAutolaunchRulesMutation.graphql';

export interface AccountTarget {
  id: string;
  ruleType: string;
  rules: any[];
}

export interface AccountUserTarget {
  id: string;
  targetType: string;
  rules: any[];
}
interface AutolaunchRulesValidationData {
  accountTargetType: TargetTypeEnumType;
  accountUserTargetType: TargetTypeEnumType;
  accountRules: any[];
  accountUserRules: any[];
}

export const autoLaunchValidationKeys: (keyof AutolaunchRulesValidationData)[] =
  [
    'accountRules',
    'accountTargetType',
    'accountUserRules',
    'accountUserTargetType',
  ];

export interface AutolaunchContext extends AutolaunchRulesValidationData {
  accountGroupCondition: GroupCondition;
  accountUserGroupCondition: GroupCondition;
  templateEntityId?: string | null;
}

/**
 * Helper intended for data shapes like TemplateAutoLaunchRules/Targets
 * Transforms the DB patterns into something forms can read.
 */
export const prepareInitialAttributeRuleValues = (
  _targets: any = [],
  attributeType: AttributeType,
  options
): Rule[] | null => {
  if (_targets.length === 0) return null;
  if (!_targets[0].rules) return null;
  if (_targets[0].rules.length === 0) return null;

  const rules = _targets.flatMap((target) => target.rules);
  const _options = options;

  return rules.map((rule) => {
    let attribute;
    if (rule.valueType === 'branchingPath') {
      attribute = _options.find((option) =>
        option.choices?.some((c) => c.id === rule?.value)
      ) || {
        label: '<Unknown branching question>',
        // It doesn't matter what type this default has because it's invalid anyway.
        valueType: 'text',
      };
    } else {
      attribute = _options.find((option) => option.name === rule?.attribute);
    }
    const condition = getRuleConditions(rule?.valueType).find(
      (condition) => condition.value === rule?.ruleType
    );

    const value = getRuleValue(rule);

    return {
      attribute,
      attributeType,
      condition,
      value,
    };
  });
};

export const prepareSupportingAutolaunchContextData = ({
  attributes,
  branchingQuestions,
}: {
  branchingQuestions: BranchingQuestions;
  attributes: AttributesQuery_attributes;
}) => {
  const branchingQuestionsOptions = branchingQuestions.map(
    ({ branchingKey, question, choices }) => ({
      label: `Branching: ${question}`,
      valueType: 'branchingPath',
      name: 'branchingPath',
      // We have to add a "value" property for the Select component.
      choices: choices.map((c) => ({
        ...c,
        value: c.id,
      })),
      value: branchingKey,
      type: AttributeType.account,
    })
  );

  const accountOptions = [
    ...attributesFilter(attributes, AttributeType.account),
    ...branchingQuestionsOptions,
  ];
  const accountUserOptions = [
    ...attributesFilter(attributes, AttributeType.accountUser),
    ...TEMPLATE_OPTIONS,
  ];

  return {
    accountOptions,
    accountUserOptions,
  };
};

/**
 * Transform database formatted targeting rules to Formik autoLaunchContext
 */
export const prepareTargetingData = ({
  attributes = [],
  accountTargets,
  accountUserTargets,
  branchingQuestions = [],
  preparedOptions,
}: {
  attributes?: AttributesQuery_attributes;
  accountTargets: AccountTarget[];
  accountUserTargets: AccountUserTarget[];
  branchingQuestions?: BranchingQuestions;
  /** Prevent needing to loop attributes by preparing this beforehand */
  preparedOptions?: { accountOptions: any[]; accountUserOptions: any[] };
}) => {
  const { accountOptions, accountUserOptions } =
    preparedOptions ||
    prepareSupportingAutolaunchContextData({ attributes, branchingQuestions });

  const accountRules = prepareInitialAttributeRuleValues(
    accountTargets,
    AttributeType.account,
    accountOptions
  ) || [NEW_ACCOUNT_RULE];

  const accountGroupCondition =
    accountTargets?.length && accountTargets.length > 1
      ? GroupCondition.any
      : GroupCondition.all;

  const accountTargetType =
    (accountTargets?.[0]?.ruleType as TargetingType) || TargetingType.all;

  const accountUserRules = prepareInitialAttributeRuleValues(
    accountUserTargets,
    AttributeType.accountUser,
    accountUserOptions
  ) || [NEW_ACCOUNT_USER_RULE];

  const accountUserGroupCondition =
    accountUserTargets?.length && accountUserTargets.length > 1
      ? GroupCondition.any
      : GroupCondition.all;

  const accountUserTargetType =
    (accountUserTargets?.[0]?.targetType as TargetingType) || TargetingType.all;

  return {
    accountRules,
    accountOptions,
    accountGroupCondition,
    accountTargetType,
    accountUserRules,
    accountUserOptions,
    accountUserGroupCondition,
    accountUserTargetType,
  };
};

/** Get number of account users matched */
export const testAutolaunchRules = async (
  autolaunchContext: AutolaunchContext
) => {
  const targets: GroupTargeting = {
    account: {
      type: autolaunchContext.accountTargetType as TargetingType,
      groups:
        autolaunchContext.accountTargetType === TargetingType.attributeRules
          ? autolaunchContext.accountGroupCondition === GroupCondition.all
            ? [
                {
                  rules: autolaunchContext.accountRules.map(
                    (rule) => prepareRuleData(rule, true) as RawRule
                  ),
                },
              ]
            : autolaunchContext.accountRules.map((rule) => ({
                rules: [prepareRuleData(rule, true) as RawRule],
              }))
          : null,
    },
    accountUser: {
      type: autolaunchContext.accountUserTargetType as TargetingType,
      groups:
        autolaunchContext.accountUserTargetType === TargetingType.attributeRules
          ? autolaunchContext.accountUserGroupCondition === GroupCondition.all
            ? [
                {
                  rules: autolaunchContext.accountUserRules.map(
                    (rule) => prepareRuleData(rule, true) as RawRule
                  ),
                },
              ]
            : autolaunchContext.accountUserRules.map((rule) => ({
                rules: [prepareRuleData(rule, true) as RawRule],
              }))
          : null,
    },
  };

  const args = {
    targets,
    templateEntityId: autolaunchContext.templateEntityId,
  };

  const response = await TestAutolaunchRulesMutation.commit(
    args as TestAutolaunchRulesMutation$variables['input']
  );

  return response?.testAutolaunchRules;
};

// TODO: Move to targeting helpers, organize.
export const checkIsAnyRuleIncomplete = ({
  accountUserRules,
  accountUserTargetType,
  accountRules,
  accountTargetType,
}: AutolaunchRulesValidationData) =>
  (accountTargetType === 'attribute_rules' &&
    !!accountRules.find((rule) => isRuleIncomplete(rule))) ||
  (accountUserTargetType === 'attribute_rules' &&
    !!accountUserRules.find((rule) => isRuleIncomplete(rule)));

type GetMutationArgsOpts = {
  forceUnifiedValue?: boolean;
};

/** Transform Formik context autolaunch data to something the server can ingest */
export const getAutoLaunchMutationArgs = (
  {
    accountGroupCondition,
    accountUserGroupCondition,
    accountRules,
    accountTargetType,
    accountUserRules,
    accountUserTargetType,
    templateEntityId,
  }: AutolaunchContext,
  opts: GetMutationArgsOpts = {}
) => {
  // Account attribute data.
  let accountAttributeRulesTargets = [];
  if (accountTargetType === 'attribute_rules') {
    if (accountGroupCondition === 'all') {
      accountAttributeRulesTargets = [
        {
          ruleType: 'attribute_rules',
          rules: uniqWith(
            accountRules.map((rule) => {
              return prepareRuleData(rule, opts.forceUnifiedValue);
            }),
            isEqual
          ),
        },
      ];
    } else {
      accountAttributeRulesTargets = uniqWith(
        accountRules.map((rule) => {
          return {
            ruleType: 'attribute_rules',
            rules: [prepareRuleData(rule, opts.forceUnifiedValue)],
          };
        }),
        isEqual
      );
    }
  }

  let accountAllTargets = [];
  if (accountTargetType === 'all') {
    accountAllTargets = [
      {
        ruleType: 'all',
      },
    ];
  }

  const autoLaunchRules = [
    ...accountAllTargets,
    ...accountAttributeRulesTargets,
  ];

  // AccountUser attribute data.
  let accountUserAttributeRulesTargets = [];
  if (accountUserTargetType === 'attribute_rules') {
    if (accountUserGroupCondition === 'all') {
      accountUserAttributeRulesTargets = [
        {
          targetType: 'attribute_rules',
          rules: uniqWith(
            accountUserRules.map((rule) => {
              return prepareRuleData(rule, opts.forceUnifiedValue);
            }),
            isEqual
          ),
        },
      ];
    } else {
      accountUserAttributeRulesTargets = uniqWith(
        accountUserRules.map((rule) => {
          return {
            targetType: 'attribute_rules',
            rules: [prepareRuleData(rule, opts.forceUnifiedValue)],
          };
        }),
        isEqual
      );
    }
  }

  let accountUserAllTargets = [];
  if (accountUserTargetType === 'all') {
    accountUserAllTargets = [
      {
        targetType: 'all',
      },
    ];
  }

  const targets = [
    ...accountUserAllTargets,
    ...accountUserAttributeRulesTargets,
  ];

  return {
    templateEntityId,
    isAutoLaunchEnabled: true,
    autoLaunchRules,
    targets,
  };
};

type Args = {
  isAnyRuleIncomplete: boolean;
  isAutoLaunchEnabled: boolean;
  autoLaunchContext: AutolaunchContext;
  forceSubmitRules?: boolean;
};

export const submitPriorityMutation = async (
  values: GenericPriorityFormValues
) => {
  const targets = sanitizePriorityRankingsInput(values);

  const priorityRankingResponse = await SetPriorityRankingsMutation.commit({
    targets,
  });

  if (!priorityRankingResponse) {
    throw new Error('Something went wrong setting the priority rankings');
  }
};

/** Only toggle. Back-end should punt if no rules received */
export const setAutoLaunchState = async (
  templateEntityId: string,
  isAutoLaunchEnabled: boolean
) => {
  const mutationArgs = {
    templateEntityId,
    isAutoLaunchEnabled,
    onlySetAutolaunchState: true,
  };

  const response = await SetAutoLaunchRulesAndTargetsForTemplateMutation.commit(
    mutationArgs
  );

  if (!response) {
    throw new Error('Something went wrong');
  }
};
