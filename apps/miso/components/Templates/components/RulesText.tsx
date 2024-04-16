import React, { useMemo } from 'react';
import { Box, BoxProps, Text } from '@chakra-ui/react';
import {
  AtLeast,
  GroupCondition,
  GuideTypeEnum,
  RulesDisplayType,
} from 'bento-common/types';
import { capitalizeFirstLetter } from 'bento-common/utils/strings';
import { pluralize } from 'bento-common/utils/pluralize';

import {
  AccountTarget,
  AccountUserTarget,
} from 'components/GuideAutoLaunchModal/Template/autolaunch.helpers';
import { AudienceRulesDisplayQuery } from 'relay-types/AudienceRulesDisplayQuery.graphql';
import colors from 'helpers/colors';
import { RulesList } from 'components/EditorCommon/RulesList';

interface Props {
  typeLabel: GuideTypeEnum;
  targets: (AccountTarget | AccountUserTarget)[] | undefined;
  templates?: AtLeast<
    { entityId: string; name: string },
    'entityId' | 'name'
  >[];
  branchingQuestion?: AudienceRulesDisplayQuery['response']['organization']['branchingQuestions'];
  type?: RulesDisplayType;
}

const groupStylesPropsByType: Record<RulesDisplayType, BoxProps> = {
  [RulesDisplayType.gray]: {},
  [RulesDisplayType.plain]: {},
  [RulesDisplayType.warning]: { color: colors.warning.text },
};

const RulesText: React.FC<Props & BoxProps> = ({
  typeLabel,
  targets,
  branchingQuestion = [],
  templates = [],
  type,
  fontSize = 'xs',
  ...boxProps
}) => {
  const { targetAll, groupCondition } = useMemo(
    () => ({
      targetAll:
        !targets?.length ||
        targets?.some(
          (t) =>
            (t as AccountTarget).ruleType === GroupCondition.all ||
            (t as AccountUserTarget).targetType === GroupCondition.all
        ),
      groupCondition:
        targets?.length === 1 ? GroupCondition.all : GroupCondition.any,
    }),
    [targets]
  );

  const pluralLabels = useMemo(
    () => ({
      capitalized: capitalizeFirstLetter(pluralize(2, typeLabel)),
      lowercase: pluralize(2, typeLabel),
    }),
    [typeLabel]
  );

  if (!targets) return <></>;

  return (
    <Box fontSize={fontSize} {...boxProps}>
      {targetAll ? (
        <Text fontWeight="bold">All {pluralLabels.lowercase}</Text>
      ) : (
        <>
          <Box>
            {pluralLabels.capitalized} who match{' '}
            <Text
              fontWeight="bold"
              display="inline"
              {...groupStylesPropsByType[type]}
            >
              {groupCondition}
            </Text>{' '}
            of these rules:
          </Box>
          <Box ml="2" mt="2">
            <RulesList
              rules={targets.flatMap((t) => t.rules)}
              templates={templates}
              allBranchingQuestions={branchingQuestion}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default RulesText;
