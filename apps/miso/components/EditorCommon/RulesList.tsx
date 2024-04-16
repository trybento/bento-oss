import React from 'react';
import { Box, TextProps } from '@chakra-ui/react';
import { getRuleConditions } from 'components/StepAutoCompletion/helpers';
import { formatAttribute } from 'components/Customers/Customer/CustomerDetails/CustomerDetails';
import { AudienceRulesDisplayQuery } from 'relay-types/AudienceRulesDisplayQuery.graphql';
import {
  AttributeRuleArgs,
  RuleTypeEnum,
  TargetValueType,
} from 'bento-common/types';
import { Highlight } from 'components/common/Highlight';
import { getRuleValue } from 'bento-common/utils/targeting';
import { isRelativeDateTargeting } from 'bento-common/data/helpers';

type Variant = 'default' | 'plain';

const getRuleTypeString = (
  ruleType: RuleTypeEnum,
  valueType: TargetValueType,
  uppercase?: boolean
) => {
  const opts = getRuleConditions(valueType, []);
  const result = opts.find((opt) => opt.value === ruleType)?.label || '';
  return uppercase ? result.toUpperCase() : result.toLowerCase();
};

const getDate = (input: string | Date) => {
  const str = typeof input === 'string' ? input : input?.toISOString();
  return str?.split('T')?.[0];
};

type Props = {
  rules: AttributeRuleArgs[];
  allBranchingQuestions?: AudienceRulesDisplayQuery['response']['organization']['branchingQuestions'];
  userAttributes?: Record<string, boolean>;
  templates?: AudienceRulesDisplayQuery['response']['templates'];
  variant?: Variant;
  /** Used for if component displays alternate data, like attributes */
  fallbackConditionLabel?: string;
} & Omit<TextProps, 'variant'>;

export const RulesList: React.FC<Props> = ({
  rules,
  allBranchingQuestions,
  userAttributes,
  templates,
  variant = 'default',
  fallbackConditionLabel,
  ...textProps
}) => {
  const mappedTemplates: Record<string, string> = React.useMemo(() => {
    if (!templates) return {};
    return templates.reduce((a, v) => {
      a[v.entityId] = v.name;
      return a;
    }, {});
  }, [templates]);

  return (
    <>
      {rules.map((rule = {} as any, i) => {
        let valueText = '';
        const value = getRuleValue(rule);

        let branchingQuestion: string | null = null;
        if (rule.valueType === TargetValueType.date) {
          valueText = isRelativeDateTargeting(rule.ruleType)
            ? `${value} days ago`
            : getDate(value as string);
        } else if (rule.attribute === TargetValueType.template && !!templates) {
          valueText = mappedTemplates[String(rule.value)] || 'Unknown template';
        } else if (rule.attribute === TargetValueType.branchingPath) {
          const question = allBranchingQuestions?.find((q) =>
            q.choices.some((c) => c.id === rule.value)
          );
          if (question) {
            branchingQuestion = `Branching: ${question.question}`;
            const choice = question.choices.find((c) => c.id === rule.value);
            valueText = choice?.label || '<Unknown branch>';
          } else {
            valueText = '<Unknown branching question>';
          }
        } else {
          valueText = formatAttribute(value, rule.valueType);
        }

        const labelText =
          branchingQuestion ||
          `${userAttributes?.[rule.attribute] ? 'user:' : ''}${rule.attribute}`;
        const conditionText = getRuleTypeString(
          rule.ruleType,
          rule.valueType,
          variant === 'plain'
        );

        // Returns plain string.
        if (variant === 'plain') {
          return `${labelText} ${conditionText} ${valueText}`;
        }

        // Returns component.
        return (
          <Box
            key={`${rule.value}-${i}`}
            color="gray.600"
            lineHeight="25px"
            mb="2"
            {...textProps}
          >
            <Highlight>{labelText}</Highlight>{' '}
            {conditionText || fallbackConditionLabel}{' '}
            <Highlight>{valueText}</Highlight>
          </Box>
        );
      })}
    </>
  );
};
