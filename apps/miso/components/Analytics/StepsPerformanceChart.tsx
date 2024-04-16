import React, { ReactNode, useCallback, useMemo } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import Box from 'system/Box';
import ReactDOMServer from 'react-dom/server';
import useToast from 'hooks/useToast';
import Highcharts from 'highcharts';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import HighchartsReact from 'highcharts-react-official';
import EmptyTablePlaceholder, {
  EmptyTablePlaceholderProps,
} from 'components/EmptyTablePlaceholder/EmptyTablePlaceholder';
import EmptyChart from 'icons/EmptyChart';
import colors from 'helpers/colors';
import H4 from 'system/H4';
import { GuideAnalyticsQuery } from 'relay-types/GuideAnalyticsQuery.graphql';
import HowToVoteOutlinedIcon from '@mui/icons-material/HowToVoteOutlined';
import ThunderIcon from 'icons/Thunder';
import CallSplitOutlinedIcon from '@mui/icons-material/CallSplitOutlined';
import CSVRequestButton, { CSVRequestButtonStyle } from './CSVRequestButton';
import { GuideTypeEnum, StepType, Theme } from 'bento-common/types';
import {
  csvSuccessMsg,
  getTickSize,
  requestTemplateProgressCsv,
} from './analytics.helpers';
import useAccessToken from 'hooks/useAccessToken';
import { useOrganization } from 'providers/LoggedInUserProvider';
import { isBranchingStep, isInputStep } from 'bento-common/data/helpers';
import PopoverTip from 'system/PopoverTip';
import MultiCSVRequestButton from './MultiCSVRequestButton';
import { ICON_STYLE as DEFAULT_ICON_STYLE } from 'components/Data/components/data.helpers';

const ICON_STYLE = {
  ...DEFAULT_ICON_STYLE,
  height: '2em',
  width: '2em',
  marginRight: '4px',
};

if (typeof Highcharts === 'object') {
  NoDataToDisplay(Highcharts);
}

interface Props {
  template: GuideAnalyticsQuery['response']['template'];
  theme: Theme;
}

interface CategoriesFormatted {
  [key: string]: { name: ReactNode; completion: number; views?: number };
}

const tablePlaceholder: EmptyTablePlaceholderProps = {
  Graphic: EmptyChart,
  text: (
    <Text color={colors.text.secondary}>
      Guides haven't been launched yet, so there aren't any analytics to show.
    </Text>
  ),
  pt: '0',
};

export default function StepsPerformanceChart({ template, theme }: Props) {
  const isVideoGallery = theme === Theme.videoGallery;
  const isCarousel = theme === Theme.carousel;
  const isAccountGuide =
    template.type === GuideTypeEnum.account ||
    template.type === GuideTypeEnum.splitTest;

  const useViews = isVideoGallery || isCarousel;

  const { categories, data } = useMemo(() => {
    const stepPrototypes = (template.modules || []).flatMap(
      (m) => m.stepPrototypes || []
    );

    const result = stepPrototypes.reduce((acc, sp, i) => {
      // Due to how highcharts renders custom HTML, each icon needs
      // special styling for positioning.
      const icon: ReactNode | null = isInputStep(sp.stepType as StepType) ? (
        <HowToVoteOutlinedIcon
          style={{ ...ICON_STYLE, transform: 'scale(0.7)' }}
        />
      ) : sp.isAutoCompletable ? (
        <ThunderIcon
          style={{
            ...ICON_STYLE,
            margin: 'auto 0',
            marginRight: '3px',
            marginTop: '2px',
            transform: 'scale(0.7)',
          }}
        />
      ) : isBranchingStep(sp.stepType as StepType) ? (
        <CallSplitOutlinedIcon
          style={{ ...ICON_STYLE, transform: 'scale(0.7)' }}
        />
      ) : null;

      acc[`${sp.name}-${i}`] = {
        name: (
          <Flex>
            {icon}
            <Box
              style={{ alignSelf: 'center' }}
              my="auto"
              maxW="170px"
              isTruncated
              title={sp.name}
            >
              {sp.name}
            </Box>
          </Flex>
        ),
        views: sp.stepCompletionStats?.viewedSteps ?? 0,
        completion: sp.stepCompletionStats
          ? (sp.stepCompletionStats.stepsCompleted /
              sp.stepCompletionStats.totalSteps) *
            100
          : 0,
      };
      return acc;
    }, {} as CategoriesFormatted);

    return {
      categories: result,
      data: Object.values(result).map((category) =>
        useViews ? category.views : category.completion
      ),
    };
  }, [template, useViews]);

  const tableConfig = useMemo(() => {
    const maxData = useViews ? Math.max(...data) : 100;
    const tickSize = useViews ? getTickSize(maxData) : 25;
    const yLabel = useViews ? 'Users viewed' : 'Completion rate';

    return {
      maxData:
        maxData % tickSize === 0 ? maxData + (useViews ? 1 : 0) : maxData,
      tickSize,
      yLabel,
    };
  }, [data, useViews]);

  const options = useMemo(() => {
    return {
      chart: { spacingTop: 40 },
      lang: {
        noData: 'No data (yet!)',
      },
      noData: {
        style: {
          fontWeight: '600',
          fontSize: '15px',
          fontFamily: 'var(--chakra-fonts-body)',
          color: '#303030',
        },
      },
      credits: {
        enabled: false,
      },
      title: {
        text: null,
      },
      yAxis: {
        allowDecimals: false,
        title: {
          text: ReactDOMServer.renderToString(
            <Box mt="4" fontWeight="bold" color={colors.text.secondary}>
              {tableConfig.yLabel}
            </Box>
          ),
          useHTML: true,
        },
        tickInterval: tableConfig.tickSize,
        labels: {
          formatter: function (col) {
            return useViews ? col.pos : `${col.pos}%`;
          },
        },
        max: tableConfig.maxData,
        gridLineWidth: 0,
        lineWidth: 1,
      },
      xAxis: {
        title: {
          text: `<b>${isVideoGallery ? 'Video' : 'Step'} name</b>`,
          align: 'high',
          rotation: 0,
          offset: 10,
          y: -10,
        },
        labels: {
          useHTML: true,
          align: 'right',
        },
        lineWidth: 1,
        categories: Object.values(categories).map((category) =>
          ReactDOMServer.renderToString(category.name as React.ReactElement)
        ),
      },
      tooltip: {
        enabled: false,
      },
      series: [
        {
          name: 'Completion rate',
          showInLegend: false,
          data,
          type: 'bar',
          color: 'var(--chakra-colors-bento-logo)',
        },
      ],
      plotOptions: {
        series: {
          /**
           * Keep width consistent. If there are too many,
           * let the chart to pick the width.
           */
          pointWidth: Object.values(categories).length > 7 ? undefined : 30,
          dataLabels: {
            inside: false,
            enabled: true,
            color: colors.text.secondary,
            formatter: function () {
              const value = (this.y as number) || 0;
              return useViews ? value : `${value ? value.toFixed(1) : value}%`;
            },
          },
        },
      },
    };
  }, [categories, data]);

  const { organization } = useOrganization();
  const toast = useToast();
  const { accessToken } = useAccessToken();

  const onRequestCsv = useCallback(
    (getSeens: boolean) => async () => {
      try {
        await requestTemplateProgressCsv({
          organizationEntityId: organization.entityId,
          accessToken,
          templateEntityId: template.entityId,
          templateName: template.name,
          getSeens,
        });

        toast({
          title: csvSuccessMsg,
          isClosable: true,
          status: 'success',
        });
      } catch (e: any) {
        toast({
          title: e.message || 'Something went wrong',
          isClosable: true,
          status: 'error',
        });
      }
    },
    [template?.entityId, accessToken, template?.name]
  );

  return (
    <Flex flexDir="column" gap="2" w="full">
      <Flex>
        <Box my="auto">
          <H4 color={colors.text.secondary} display="flex" whiteSpace="nowrap">
            Step performance{' '}
            {!isCarousel && (
              <PopoverTip placement="top" withPortal>
                {isVideoGallery
                  ? 'Only counts users who saw the video thumbnail in the Bento gallery'
                  : isAccountGuide
                  ? 'Accounts completed the step / accounts viewed the guide'
                  : 'Users completed step / users viewed the guide'}
              </PopoverTip>
            )}
          </H4>
        </Box>

        {isVideoGallery ? (
          <CSVRequestButton
            tooltipLabel="Download video views"
            ml="auto"
            as={CSVRequestButtonStyle.icon}
            onRequest={onRequestCsv(true)}
          />
        ) : (
          <MultiCSVRequestButton
            tooltipLabel="Download step progress"
            height="auto"
            ml="auto"
            as={CSVRequestButtonStyle.icon}
            options={[
              {
                label: 'Only users who completed steps',
                onRequest: onRequestCsv(false),
              },
              {
                label: 'All users who have viewed',
                onRequest: onRequestCsv(true),
              },
            ]}
          />
        )}
      </Flex>

      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        overflow="auto"
      >
        {data.length ? (
          <HighchartsReact highcharts={Highcharts} options={options} />
        ) : (
          <Box h="400px" display="flex">
            <Box m="auto">
              <EmptyTablePlaceholder {...tablePlaceholder} />
            </Box>
          </Box>
        )}
      </Box>
    </Flex>
  );
}
