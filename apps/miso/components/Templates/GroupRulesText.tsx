import React, { useMemo } from 'react';
import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import { AtLeast, GuideTypeEnum, RulesDisplayType } from 'bento-common/types';
import { pluralize } from 'bento-common/utils/pluralize';
import {
  GroupTargetingSegment,
  TargetingType,
} from 'bento-common/types/targeting';
import { AudienceRulesDisplayQuery } from 'relay-types/AudienceRulesDisplayQuery.graphql';
import {
  GroupRulesList,
  RulesDisplayCompactMode,
} from 'components/EditorCommon/GroupRulesList';
import { capitalizeFirstLetter } from 'bento-common/utils/strings';
import { AttributesQuery_attributes } from 'providers/AttributesProvider';
import DetailBox from 'components/common/DetailBox';
import { countRulesInSegment } from 'bento-common/utils/targeting';
import H6 from 'system/H6';

interface Props {
  typeLabel: GuideTypeEnum;
  targeting: GroupTargetingSegment;
  templates?: AtLeast<
    { entityId: string; name: string },
    'entityId' | 'name'
  >[];
  branchingQuestion?: AudienceRulesDisplayQuery['response']['organization']['branchingQuestions'];
  /** Hides the copy "___ that match..." */
  hideCopy?: boolean;
  attributes: AttributesQuery_attributes;
  fullWidth?: boolean;
  /** Show abridged version of the rules if too long */
  compact?: RulesDisplayCompactMode;
  /** Hide additional text like WHERE/AND */
  listForm?: boolean;
  /** Always show all rules */
  preventAbridge?: boolean;
}

const RulesContainer: React.FC<{
  children: React.ReactNode;
  fullWidth?: boolean;
}> = ({ children, fullWidth }) => (
  <DetailBox width={fullWidth ? undefined : 'fit-content'}>
    <Box paddingY={2} paddingX={4}>
      {children}
    </Box>
  </DetailBox>
);

const COMPACT_THRESHOLD = 1;

const GroupRulesText: React.FC<Props> = ({
  typeLabel,
  targeting,
  branchingQuestion = [],
  templates = [],
  hideCopy,
  attributes,
  fullWidth = true,
  compact,
  listForm,
  preventAbridge,
}) => {
  const groups = !targeting.groups
    ? []
    : compact && !preventAbridge
    ? targeting.groups.slice(0, COMPACT_THRESHOLD)
    : targeting.groups;

  const countOfRules = useMemo(
    () => countRulesInSegment(targeting),
    [targeting.groups]
  );

  const groupsOverflow =
    compact && !preventAbridge && countOfRules > 1 ? (
      <Text as="span" fontStyle="italic" ml="1">
        ...and {countOfRules - 1} other {pluralize(countOfRules - 1, 'rule')}
      </Text>
    ) : null;

  return (
    <Flex flexDirection="column" gap={2}>
      {!hideCopy && (
        <H6 mb="0" fontWeight="semibold" fontSize={compact ? 'xs' : 'sm'}>
          {capitalizeFirstLetter(typeLabel)} rules:
        </H6>
      )}
      {targeting.type === TargetingType.all && (
        <RulesContainer fullWidth={fullWidth}>
          <Text fontStyle="italic">All {pluralize(2, typeLabel)}</Text>
        </RulesContainer>
      )}
      {targeting.type === TargetingType.attributeRules &&
        groups.map((group, idx) => (
          <Box key={`rules-list-${idx}`}>
            <RulesContainer fullWidth={fullWidth}>
              <GroupRulesList
                rules={group.rules}
                templates={templates}
                allBranchingQuestions={branchingQuestion}
                attributes={attributes}
                compactOverflow={groupsOverflow}
                compact={compact}
                listForm={listForm}
                preventAbridge={preventAbridge}
              />
            </RulesContainer>
            {targeting.groups.length > 1 &&
              idx !== targeting.groups.length - 1 &&
              !compact && (
                <Box pt="2">
                  <Text fontSize="xs">OR</Text>
                </Box>
              )}
          </Box>
        ))}
    </Flex>
  );
};

export default GroupRulesText;
