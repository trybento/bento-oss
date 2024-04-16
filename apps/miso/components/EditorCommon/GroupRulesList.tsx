import React, { useMemo } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { getRuleConditions } from 'components/StepAutoCompletion/helpers';
import { formatAttribute } from 'components/Customers/Customer/CustomerDetails/CustomerDetails';
import { AudienceRulesDisplayQuery } from 'relay-types/AudienceRulesDisplayQuery.graphql';
import { TargetValueType } from 'bento-common/types';
import { Highlight } from 'components/common/Highlight';
import { getRuleValue } from 'bento-common/utils/targeting';
import {
  isEmptyCheckTargeting,
  isRelativeDateTargeting,
} from 'bento-common/data/helpers';
import { RuleTypeEnum, TargetingGroup } from 'bento-common/types/targeting';
import Text from 'system/Text';
import { AttributesQuery_attributes } from 'providers/AttributesProvider';
import { TEMPLATE_OPTIONS } from './targeting.helpers';

export enum RulesDisplayCompactMode {
  /** Standard compact mode, only display 1 rule */
  normal = 'normal',
  /** Will not shorten attribute/values displays, but only display 1 rule (may deprecate?) */
  full = 'full',
}

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

interface Props {
  rules: TargetingGroup['rules'];
  allBranchingQuestions?: AudienceRulesDisplayQuery['response']['organization']['branchingQuestions'];
  userAttributes?: Record<string, boolean>;
  templates?: AudienceRulesDisplayQuery['response']['templates'];
  attributes: AttributesQuery_attributes;
  /** Replace showing multiple rules/values with this element, for compact view */
  compactOverflow?: React.ReactNode;
  /** If we're in compact mode */
  compact?: RulesDisplayCompactMode;
  /** Hide additional text like WHERE/AND */
  listForm?: boolean;
  /** Always show all rules */
  preventAbridge?: boolean;
}

const COMPACT_THRESHOLD = 1;
const COMPACT_VALUES_THRESHOLD = 1;

export const GroupRulesList: React.FC<Props> = ({
  rules: fullRules,
  allBranchingQuestions,
  userAttributes,
  templates,
  attributes,
  compactOverflow,
  compact,
  listForm,
  preventAbridge,
}) => {
  const mappedTemplates: Record<string, string> = React.useMemo(() => {
    if (!templates) {
      return {};
    }

    return templates.reduce((a, v) => {
      a[v.entityId] = v.name;

      return a;
    }, {});
  }, [templates]);

  const rules = useMemo(
    () =>
      compactOverflow && !preventAbridge
        ? fullRules.slice(0, COMPACT_THRESHOLD)
        : fullRules,
    [fullRules, compactOverflow, preventAbridge]
  );

  const formattedRules = useMemo(
    () =>
      rules.map((rule, i) => {
        const attribute = attributes.find((a) => a.name === rule.attribute);

        let valueText: string | string[] = '';
        const value = getRuleValue(rule);
        let branchingQuestion: string | null = null;

        if (rule.valueType === TargetValueType.date) {
          valueText = isRelativeDateTargeting(rule.ruleType)
            ? `${value} days ago`
            : getDate(value as string);
        } else if (
          attribute?.valueType === TargetValueType.template &&
          !!templates
        ) {
          valueText = mappedTemplates[String(rule.value)] || 'Unknown template';
        } else if (rule.valueType === TargetValueType.branchingPath) {
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
        } else if (rule.valueType === TargetValueType.stringArray) {
          valueText = rule.value as string[];
        } else {
          valueText = formatAttribute(value, rule.valueType);
        }

        let labelText: string;

        if (attribute?.valueType === TargetValueType.template) {
          labelText =
            TEMPLATE_OPTIONS.find(({ name }) => name === attribute.name)
              ?.label || 'Unknown';
        } else {
          labelText =
            branchingQuestion ||
            `${userAttributes?.[rule.attribute] ? 'user:' : ''}${
              rule.attribute
            }`;
        }

        const conditionText = getRuleTypeString(
          rule.ruleType,
          (attribute?.valueType as TargetValueType) ?? rule.valueType
        );

        return (
          <Box key={`${rule.value}-${i}`} display="flex">
            {!listForm && (
              <Text
                display="inline-block"
                pr="3"
                minW="4.5em"
                textAlign="center"
              >
                {i !== 0 ? 'AND' : 'WHERE'}
              </Text>
            )}
            <Box mr="1">
              <Box display="inline-flex" mr="1">
                <TruncatedHighlight compact={compact}>
                  {labelText}
                  {!attribute && (
                    <Text ml="1" fontStyle="italic" display="inline">
                      (deleted)
                    </Text>
                  )}
                </TruncatedHighlight>
              </Box>
              {conditionText}{' '}
              {Array.isArray(valueText) ? (
                getValueTextDisplay({ valueText, compact })
              ) : isEmptyCheckTargeting(rule.ruleType) ? null : rule.value ===
                  null || rule.value === undefined ? (
                <Text fontStyle="italic" display="inline">
                  Empty
                </Text>
              ) : (
                <Box display="inline-flex">
                  <TruncatedHighlight compact={compact}>
                    {valueText}
                  </TruncatedHighlight>
                </Box>
              )}
              {compactOverflow}
            </Box>
          </Box>
        );
      }),
    [
      rules,
      mappedTemplates,
      allBranchingQuestions,
      userAttributes,
      templates,
      compactOverflow,
    ]
  );

  return <Flex flexDirection="column">{formattedRules}</Flex>;
};

const getValueTextDisplay = ({
  valueText: fullValueText,
  compact,
}: {
  valueText: string[];
  compact?: RulesDisplayCompactMode;
}): React.JSX.Element[] => {
  const valueText = compact
    ? fullValueText.slice(0, COMPACT_VALUES_THRESHOLD)
    : fullValueText;

  const valuesOverflow =
    valueText.length < fullValueText.length
      ? [
          <Text display="inline-block" mx="1" color="text.secondary">
            ...<b>+{fullValueText.length - valueText.length}</b>
          </Text>,
        ]
      : [];

  return [
    ...valueText.map((v, j) => (
      <Box key={`val-${v}`} display="inline-flex">
        <TruncatedHighlight
          compact={compact}
          key={`group-rules-list-value-${j}`}
        >
          {v}
        </TruncatedHighlight>
        {valueText.length > 1 && j !== valueText.length - 1 && (
          <Text display="inline-block" lineHeight="2em" px="1">
            ,
          </Text>
        )}
      </Box>
    )),
    ...valuesOverflow,
  ];
};

type TruncatedHighlightProps = {
  compact?: RulesDisplayCompactMode;
};

const TruncatedHighlight: React.FC<
  React.PropsWithChildren<TruncatedHighlightProps>
> = ({ compact, children }) => (
  <Highlight
    maxWidth={compact === RulesDisplayCompactMode.normal ? '200px' : undefined}
    overflow="hidden"
    whiteSpace="nowrap"
    lineHeight="1.5em"
    textOverflow="ellipsis"
  >
    {children}
  </Highlight>
);
