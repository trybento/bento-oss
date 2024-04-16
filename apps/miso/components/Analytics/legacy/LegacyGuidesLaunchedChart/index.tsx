import React, { useMemo } from 'react';
import { Text } from '@chakra-ui/react';
import Box from 'system/Box';
import groupBy from 'lodash/groupBy';
import { format, eachDayOfInterval } from 'date-fns';
import Highcharts from 'highcharts';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import HighchartsReact from 'highcharts-react-official';
import { AnalyticsDataQuery } from 'relay-types/AnalyticsDataQuery.graphql';
import EmptyTablePlaceholder from 'components/EmptyTablePlaceholder/EmptyTablePlaceholder';
import { EmptyTablePlaceholderProps } from '../../../EmptyTablePlaceholder/EmptyTablePlaceholder';
import EmptyChart from 'icons/EmptyChart';
import colors from 'helpers/colors';

if (typeof Highcharts === 'object') {
  NoDataToDisplay(Highcharts);
}

interface GuidesLaunchedChartProps {
  startDate: Date;
  endDate: Date;
  launches: AnalyticsDataQuery['response']['analytics']['launches'];
}

interface CategoriesFormatted {
  [key: string]: {
    total: number;
    guides: { count: number; name: string }[];
  };
}

export default function GuidesLaunchedChart({
  startDate,
  endDate,
  launches,
}: GuidesLaunchedChartProps) {
  const categories: CategoriesFormatted = useMemo(() => {
    const result = {};

    if (!launches.length) return result;

    // Show empty range between dates that had a value.
    const dates = eachDayOfInterval(
      {
        start: startDate,
        end: endDate,
      },
      { step: 1 }
    );

    const launchesByDate = groupBy(launches, 'seenDate');

    (dates || []).map((date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      const launches = launchesByDate[dateString];

      (launches || [dateString]).map((launch) => {
        const _seenDate = format(date, 'MMM dd');

        if (!result?.[_seenDate]) {
          result[_seenDate] = {
            total: 0,
            guides: [],
          };
        }

        const launchCount = launch?.count || 0;

        result[_seenDate].total += launchCount;
        result[_seenDate].guides.push({
          count: launchCount,
          name: launch?.template?.name || '',
        });
      });
    });

    return result;
  }, [launches]);

  const data = Object.values(categories).map((category) => category.total);
  const options = {
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
        text: '',
      },
    },
    xAxis: {
      title: {
        text: '',
      },
      categories: Object.keys(categories),
    },
    tooltip: {
      formatter: function () {
        // Find a way to improve this. Margin, display, width and height not working.
        return this.y === 0
          ? false
          : `${categories[this.x].guides.reduce(
              (acc, guide) =>
                acc +
                `${acc ? '<br/><br/>' : ''}<div>${
                  guide.count
                }</div><div style="color:transparent;">---</div><div>${
                  guide.name
                }</div>`,
              ''
            )}`;
      },
      style: {
        color: 'white',
        fontFamily: 'var(--chakra-fonts-body)',
        fontWeight: '600',
      },
      backgroundColor: 'var(--chakra-colors-bento-dark)',
      borderRadius: 8,
      borderWidth: 0,
      shadow: 'none',
      padding: 10,
    },
    series: [
      {
        name: 'Guides launched',
        showInLegend: false,
        data: Object.values(categories).map((category) => category.total),
        type: 'area',
        marker: {
          fillColor: '#3CB8D7', //Bento tertiary bright from https://www.figma.com/file/tmBITIKQjDZuroCmE9lR3N/Bento-Styles?node-id=546%3A1493
        },
        lineColor: '#086F83', //Bento tertiary text
        fillColor: '#EEF9FB', //Bento tertiary bg
      },
    ],
  };

  const tablePlaceholder: EmptyTablePlaceholderProps = {
    Graphic: EmptyChart,
    text: (
      <Text color={colors.text.secondary}>
        Guides haven't been launched yet, so there aren't any analytics to show.
      </Text>
    ),
    pt: '0',
  };

  return (
    <Box>
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
  );
}
