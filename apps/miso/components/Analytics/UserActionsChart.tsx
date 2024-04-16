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
import CSVRequestButton, { CSVRequestButtonStyle } from './CSVRequestButton';
import { csvSuccessMsg, requestCtaCsv } from './analytics.helpers';
import useAccessToken from 'hooks/useAccessToken';
import { format, eachDayOfInterval, addDays } from 'date-fns';
import keyBy from 'lodash/keyBy';
import { useOrganization } from 'providers/LoggedInUserProvider';
import { GuideAnalyticsShow } from './GuideAnalytics';

if (typeof Highcharts === 'object') {
  NoDataToDisplay(Highcharts);
}

interface Props {
  template: GuideAnalyticsQuery['response']['template'];
  show: GuideAnalyticsShow;
}

/** TODO: Update with correct types. */
interface CategoriesFormatted {
  [key: string]: { name: ReactNode; completion: number };
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

type DataResults = {
  label: string;
  dismissed: number;
  savedForLater: number;
  viewed: number;
  /** Total count of all ctas on that day */
  clickedACta: number;
};

/**
 * If data in UTC is collecting to "tomorrow" e.g. May 2 but
 * local time is still "today" e.g. May 1, we need to
 * display "tomorrow" as the latest row
 */
const isUtcInTomorrow = () => {
  const nowLocal = new Date();
  return nowLocal.getDate() !== nowLocal.getUTCDate();
};

export default function UserActionsChart({ template, show }: Props) {
  const { categories, ctaName } = useMemo(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const endDate = isUtcInTomorrow() ? addDays(today, 1) : today;

    // Show empty range between dates that had a value.
    const dates = eachDayOfInterval(
      {
        start: lastMonth,
        end: endDate,
      },
      { step: 1 }
    );

    const dataByDate = keyBy(template.announcementActivity || [], 'date');
    const ctaNames = new Set();

    const result: DataResults[] = dates.map((date) => {
      const longDate = format(date, 'yyyy-MM-dd');
      const data = dataByDate[longDate];

      return {
        label: format(date, 'MMM dd'),
        dismissed: data?.dismissed ?? 0,
        viewed: data?.viewed ?? 0,
        savedForLater: data?.savedForLater ?? 0,
        clickedACta:
          data?.ctaActivity?.reduce((a, v) => {
            if (!ctaNames.has(v.text) && v.text) ctaNames.add(v.text);
            return a + v.count;
          }, 0) ?? 0,
      };
    });

    return {
      categories: result,
      ctaName: ctaNames.size === 1 ? [...ctaNames][0] : 'a CTA',
    };
  }, [template]);

  const options = useMemo(() => {
    const series = [];

    series.push({
      name: 'Viewed',
      color: '#FFC107',
      marker: {
        symbol: 'circle',
      },
      data: categories.map((c) => c.viewed),
      dataLabels: {
        color: '#FF0000',
      },
    });
    if (show.actionCtas)
      series.push({
        name: `Clicked ${ctaName}`,
        color: '#007561',
        marker: {
          symbol: 'square',
        },
        data: categories.map((c) => c.clickedACta),
      });
    if (show.usersSavedForLater)
      series.push({
        name: 'Saved for later',
        color: '#1E88E5',
        marker: {
          symbol: 'diamond',
        },
        data: categories.map((c) => c.savedForLater),
      });
    if (show.usersDismissed)
      series.push({
        name: 'Dismissed',
        color: '#D81B60',
        marker: {
          symbol: 'triangle',
        },
        data: categories.map((c) => c.dismissed),
      });

    return {
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
      chart: { spacingTop: 60, spacingLeft: 25, type: 'spline' },
      title: {
        text: null,
      },
      xAxis: {
        categories: categories.map((c) => c.label),
        accessibility: {
          description: 'Months of the year',
        },
      },
      yAxis: {
        title: {
          text: '<b>Users</b>',
          align: 'high',
          rotation: 0,
          offset: 12,
          y: -30,
        },
        labels: {
          formatter: function () {
            return this.value;
          },
        },
        gridLineWidth: 0,
        lineWidth: 1,
      },
      tooltip: {
        formatter: function () {
          return this.y === 0
            ? false
            : ReactDOMServer.renderToString(
                <Flex gap="1" flexDir="column">
                  <Box>{this.x}</Box>
                  <Box fontWeight="normal">
                    <b>{this.series.name}: </b>
                    {this.y}
                  </Box>
                </Flex>
              );
        },
        useHTML: true,
        style: {
          color: 'black',
          fontFamily: 'var(--chakra-fonts-body)',
          fontWeight: '600',
        },
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 0,
        shadow: true,
        padding: 10,
      },
      plotOptions: {
        spline: {
          states: {
            hover: {
              halo: {
                opacity: 0,
              },
            },
          },
          marker: {
            radius: 5,
            lineColor: '#00000000',
            lineWidth: 0,
          },
        },
      },
      legend: {
        itemStyle: {
          color: colors.text.secondary,
        },
      },
      series,
    };
  }, [categories, ctaName, show]);

  const toast = useToast();
  const { accessToken } = useAccessToken();
  const { organization } = useOrganization();

  const onRequestCsv = useCallback(async () => {
    try {
      await requestCtaCsv({
        organizationEntityId: organization.entityId,
        accessToken,
        templateEntityId: template.entityId,
        templateName: template.name,
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
  }, [template?.entityId, accessToken, template?.name]);

  return (
    <Flex flexDir="column" gap="2" w="full">
      <Flex>
        <Box my="auto">
          <H4 color={colors.text.secondary} display="flex" whiteSpace="nowrap">
            User actions over time
          </H4>
        </Box>
        <CSVRequestButton
          onRequest={onRequestCsv}
          tooltipLabel="Download user actions"
          ml="auto"
          as={CSVRequestButtonStyle.icon}
        />
      </Flex>

      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        overflow="auto"
      >
        {categories.length ? (
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
