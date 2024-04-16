import React, { ReactNode, useState } from 'react';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { pluralize } from 'bento-common/utils/pluralize';
import colors from 'helpers/colors';
import { Text } from '@chakra-ui/react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { NpsAnalyticsStatisticsQuery$data } from 'relay-types/NpsAnalyticsStatisticsQuery.graphql';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InteractiveTooltip from 'system/InteractiveTooltip';

const NPS_HELP_CENTER_ARTICLE_LINK =
  'https://help.trybento.co/en/articles/8266158-nps-surveys-with-bento';

const npsScoreColor = (score: number | null) => {
  if (score === null) {
    return undefined;
  }

  if (score < 0) {
    return '#E90000';
  }

  if (score <= 20) {
    return '#FF8A00';
  }

  if (score <= 50) {
    return '#F8C100';
  }

  if (score <= 80) {
    return colors.bento.bright;
  }

  return colors.success.bright;
};

const StatCard: React.FC<{
  title: ReactNode;
  value: ReactNode;
  valueFontColor?: string;
  maxWidth?: string;
  children?: React.ReactNode;
}> = ({ title, value, valueFontColor, maxWidth, children }) => (
  <Flex
    border={colors.gray[200]}
    borderWidth={1}
    borderStyle="solid"
    borderRadius={6}
    gap="6"
    px="4"
    py="5"
    flexGrow={1}
    flexShrink="280px"
    alignItems="center"
    minWidth="280px"
    maxWidth={maxWidth || 'calc(33% - 10px)'}
  >
    <Box
      fontWeight="bold"
      fontSize="32"
      color={valueFontColor || colors.bento.bright}
    >
      {value}
    </Box>
    <Box fontSize="md" fontWeight="bold" whiteSpace="nowrap">
      {title}
    </Box>
    {children}
  </Flex>
);

interface Props {
  data: NpsAnalyticsStatisticsQuery$data;
}

const NpsAnalyticsStatistics: React.FC<Props> = ({ data }) => {
  const [distributionExpanded, setDistributionExpanded] = useState(false);
  const { totalViews, scoreBreakdown } = data.npsSurvey;
  const { score, responses, promoters, passives, detractors } = scoreBreakdown;

  return (
    <Flex gap={5} wrap="wrap">
      <StatCard
        title={
          <Flex gap={1} alignItems="center">
            <Box>NPS score</Box>
            <InteractiveTooltip
              placement="top"
              label={
                <span>
                  Learn more about how NPS works{' '}
                  <a
                    href={NPS_HELP_CENTER_ARTICLE_LINK}
                    target="_blank"
                    style={{ textDecoration: 'underline' }}
                  >
                    here
                  </a>
                  .
                </span>
              }
            >
              <Box fontSize="14px">
                <InfoOutlinedIcon fontSize="inherit" />
              </Box>
            </InteractiveTooltip>
          </Flex>
        }
        value={score === null ? <>&mdash;</> : score}
        valueFontColor={npsScoreColor(score)}
        maxWidth={distributionExpanded ? '50%' : undefined}
      >
        {!distributionExpanded && score !== null && (
          <Button
            variant="link"
            size="sm"
            rightIcon={<ChevronRightIcon />}
            onClick={() => setDistributionExpanded(true)}
            marginLeft="auto"
          >
            View distribution
          </Button>
        )}
        {distributionExpanded && (
          <Flex gap={4} alignItems="center" marginLeft="auto">
            <Text size="sm" fontWeight="bold">
              <span style={{ color: colors.success.bright }}>
                {promoters.toLocaleString()}
              </span>{' '}
              {pluralize(promoters, 'Promoter')}
            </Text>
            <Text size="sm" fontWeight="bold">
              <span style={{ color: colors.text.secondary }}>
                {passives.toLocaleString()}
              </span>{' '}
              {pluralize(passives, 'Passive')}
            </Text>
            <Text size="sm" fontWeight="bold">
              <span style={{ color: colors.error.bright }}>
                {detractors.toLocaleString()}
              </span>{' '}
              {pluralize(detractors, 'Detractor')}
            </Text>
            <Button
              variant="link"
              size="sm"
              rightIcon={<ChevronLeftIcon />}
              onClick={() => setDistributionExpanded(false)}
            />
          </Flex>
        )}
      </StatCard>
      <StatCard
        title={`${pluralize(totalViews, 'user')} viewed`}
        value={totalViews.toLocaleString()}
      />
      <StatCard
        title={`${pluralize(responses, 'user')} responded`}
        value={responses.toLocaleString()}
      />
    </Flex>
  );
};

export default NpsAnalyticsStatistics;
