import React, { useMemo } from 'react';
import { graphql } from 'react-relay';
import { Box, Flex } from '@chakra-ui/react';
import * as ArrayToCsvReportMutation from 'mutations/ArrayToCsvReport';
import { SuspendedQueryRenderer } from 'components/QueryRenderer';
import GuidesLaunchedChart from './GuidesLaunchedChart';
import PerformanceByGuideTable, {
  PerformanceByGuideTableShow,
} from './PerformanceByGuideTable';
import H4 from 'system/H4';
import { AnalyticsDataQuery } from 'relay-types/AnalyticsDataQuery.graphql';
import { useTableRenderer } from 'components/TableRenderer/TableRendererProvider';
import useToast from 'hooks/useToast';
import {
  BentoLoadingSpinner,
  TABLE_ROWS_PER_PAGE,
} from 'components/TableRenderer';
import {
  getLocationShown,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import { isSingleStepGuide } from 'bento-common/utils/formFactor';
import {
  GuideFormFactor,
  GuidePageTargetingType,
  Theme,
} from 'bento-common/types';
import PopoverTip from 'system/PopoverTip';
import CSVRequestButton, { CSVRequestButtonStyle } from './CSVRequestButton';
import { guideComponentLabel } from '../../helpers/presentational';
import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';
import { getPercentage } from 'bento-common/data/helpers';
import sortByString from 'components/utils/react-table/sortByString';
import { format } from 'date-fns';
import { csvSuccessMsg } from './analytics.helpers';
import { GuideShape } from 'bento-common/types/globalShoyuState';
import { useHideChartOfNewGuidesLaunched } from 'hooks/useFeatureFlag';

interface AnalyticsDataQueryRendererProps {
  startDate: Date;
  endDate: Date;
  onFetching?: (value: boolean) => void;
}

type AnalyticsDataQueryResponse = AnalyticsDataQuery['response'];

type Template = AnalyticsDataQueryResponse['templates'][number];

interface AnalyticsDataProps
  extends AnalyticsDataQueryRendererProps,
    AnalyticsDataQueryResponse {
  onRefetch: () => void;
}

function TableContainer({ children }) {
  return (
    <Flex h="620px" direction="column" flex="1">
      {children}
    </Flex>
  );
}

const checklistGuidesShow: PerformanceByGuideTableShow = {
  accountsSeen: false,
  scope: true,
  completedAStep: true,
  averageStepsCompleted: true,
};

const singleStepGuidesShow: PerformanceByGuideTableShow = {
  percentageDismissed: true,
};

function AnalyticsData(props: AnalyticsDataProps) {
  const {
    analytics,
    startDate,
    endDate,
    templates,
    orgInlineEmbeds: [orgInlineEmbed],
  } = props;
  const toast = useToast();

  const { checklistGuides, singleStepGuides } = useMemo(
    () =>
      templates.reduce(
        (acc, t) => {
          if (t.isTemplate) return acc;

          if (
            isSingleStepGuide(t.theme as Theme, t.formFactor as GuideFormFactor)
          ) {
            acc.singleStepGuides.push(t);
          } else {
            acc.checklistGuides.push(t);
          }
          return acc;
        },
        {
          checklistGuides: [] as Template[],
          singleStepGuides: [] as Template[],
        }
      ),
    [templates]
  );

  const handleDownloadCsv = useMemo(() => {
    const handler =
      (templatesForCsv: Template[], show: PerformanceByGuideTableShow) =>
      async () => {
        const data = [...templatesForCsv]
          .sort((a: Template, b: Template) => {
            return sortByString(a.name, b.name, undefined, false);
          })
          .map((t) => {
            const templateData: Record<string, string | number> = {};
            templateData['Name'] = t.name;

            if (show.accountsSeen) {
              templateData['Accounts viewed'] =
                t.stats.accountsSeen ?? t.stats.guidesViewed;
            }

            templateData['Users viewed'] = t.stats.usersSeenGuide;

            if (show.completedAStep) {
              templateData['Number engaged'] = t.stats.completedAStep;
            }

            if (show.averageStepsCompleted) {
              templateData['Avg steps completed'] =
                t.stats.averageStepsCompletedForEngaged;
            }

            if (show.percentageDismissed) {
              templateData['% dismissed'] = getPercentage(
                t.stats.usersDismissed,
                t.stats.usersSeenGuide
              );
            }

            if (show.scope) {
              templateData['Scope'] = t.type;
            }
            templateData['Component'] = guideComponentLabel(
              t as unknown as GuideShape
            );

            const locationShown = getLocationShown({
              guideDesignType: t.designType as any,
              pageTargetingType: t.pageTargetingType as GuidePageTargetingType,
              pageTargetingUrl: t.pageTargetingUrl,
              tagWildcardUrl: t.taggedElements?.[0]?.wildcardUrl,
              inlineEmbedWildcardUrl: t.inlineEmbed?.wildcardUrl,
              orgInlineEmbedWildcardUrl: orgInlineEmbed?.wildcardUrl,
              orgInlineEmbedState: orgInlineEmbed?.state as any,
            });

            templateData['Location'] = locationShown
              ? wildcardUrlToDisplayUrl(locationShown)
              : t.pageTargetingType === GuidePageTargetingType.anyPage
              ? 'Any page'
              : 'Not set';

            return templateData;
          });

        await ArrayToCsvReportMutation.commit({
          data,
          filename: `Bento_guide_analytics_${format(new Date(), 'yyy-MM-dd')}`,
          subject: 'Bento - Guide analytics',
        });

        toast({
          title: csvSuccessMsg,
          isClosable: true,
          status: 'success',
        });
      };

    return {
      checklistGuides: handler(checklistGuides, checklistGuidesShow),
      singleStepGuides: handler(singleStepGuides, singleStepGuidesShow),
    };
  }, [checklistGuides, singleStepGuides]);

  return (
    <>
      <Flex direction="column" gap="10" mb="10">
        {/* NOTE: This is now temporarily and conditionally hidden due to performance concerns (see query) */}
        {analytics?.launches && (
          <>
            <H4 display="flex">
              New guides launched{' '}
              <PopoverTip placement="top">
                Showing data from last 30 days
              </PopoverTip>
            </H4>
            <GuidesLaunchedChart
              launches={analytics.launches}
              startDate={startDate}
              endDate={endDate}
            />
          </>
        )}
        <TableContainer>
          <Flex flexDirection="column" gap={4}>
            <H4 display="flex">
              Checklists <PopoverTip placement="top">All time data</PopoverTip>
              {checklistGuides.length > 0 && (
                <CSVRequestButton
                  as={CSVRequestButtonStyle.icon}
                  ml="auto"
                  onRequest={handleDownloadCsv.checklistGuides}
                />
              )}
            </H4>
            <PerformanceByGuideTable
              templates={checklistGuides}
              show={checklistGuidesShow}
              orgInlineEmbed={orgInlineEmbed}
              bg={checklistGuides.length > 0 ? undefined : 'gray.50'}
              h="400px"
            />
          </Flex>
        </TableContainer>
        <TableContainer>
          <Flex flexDirection="column" gap={4}>
            <H4 display="flex">
              Announcements, tooltips, and embedded components{' '}
              <PopoverTip placement="top">All time data</PopoverTip>
              {singleStepGuides.length > 0 && (
                <CSVRequestButton
                  as={CSVRequestButtonStyle.icon}
                  ml="auto"
                  onRequest={handleDownloadCsv.singleStepGuides}
                />
              )}
            </H4>
            <PerformanceByGuideTable
              templates={singleStepGuides}
              show={singleStepGuidesShow}
              orgInlineEmbed={orgInlineEmbed}
              tableIdentifier={TableType.singleStepGuidesPerformance}
              bg={singleStepGuides.length > 0 ? undefined : 'gray.50'}
              h="400px"
            />
          </Flex>
        </TableContainer>
      </Flex>
    </>
  );
}

const ANALYTICS_QUERY = graphql`
  query AnalyticsDataQuery(
    $startDate: String!
    $endDate: String!
    $withLaunches: Boolean!
  ) {
    analytics(startDate: $startDate, endDate: $endDate)
      @include(if: $withLaunches) {
      launches {
        seenDate
        count
        template {
          name
          privateName
        }
      }
    }
    templates: templates(includeArchived: false, activeOnly: true) {
      entityId
      name
      privateName
      designType
      formFactor
      isCyoa
      theme
      type
      isSideQuest
      inputsCount
      pageTargetingType
      pageTargetingUrl
      isTemplate
      inlineEmbed {
        ...InlineEmbed_inlineEmbedWithTemplateId @relay(mask: false)
      }
      stats(useLocked: false) {
        usersSeenGuide
        completedAStep
        percentCompleted
        usersDismissed
        usersClickedCta
        usersSavedForLater
        guidesViewed
        guidesWithCompletedStep
        percentGuidesCompleted
        averageStepsCompleted
        averageStepsCompletedForEngaged
        inputStepAnswersCount
        usersAnswered
        accountsSeen
      }
      taggedElements {
        entityId
        url
        wildcardUrl
      }
    }
    orgInlineEmbeds: inlineEmbeds {
      entityId
      url
      wildcardUrl
      state
    }
  }
`;

export default function AnalyticsQueryRenderer(
  cProps: AnalyticsDataQueryRendererProps
) {
  const { startDate, endDate, onFetching } = cProps;

  const { selectedSorting } = useTableRenderer();

  const { id: spOrderBy, direction: spOrderDirection } =
    selectedSorting[TableType.stepsPerformance] || {};

  const { id: gpOrderBy, direction: gpOrderDirection } =
    selectedSorting[TableType.guidesPerformance] || {};

  const shouldHideChartOfNewGuidesLaunched = useHideChartOfNewGuidesLaunched();

  return (
    <SuspendedQueryRenderer
      query={ANALYTICS_QUERY}
      variables={{
        first: TABLE_ROWS_PER_PAGE,
        startDate,
        endDate,
        withLaunches: !shouldHideChartOfNewGuidesLaunched,
        spOrderBy,
        spOrderDirection,
        gpOrderBy,
        gpOrderDirection,
      }}
      render={({ props, retry, isFetching }) => {
        onFetching?.(isFetching);
        return props ? (
          <AnalyticsData {...cProps} {...props} onRefetch={retry} />
        ) : (
          <Box h="full">
            <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} />
          </Box>
        );
      }}
    />
  );
}
