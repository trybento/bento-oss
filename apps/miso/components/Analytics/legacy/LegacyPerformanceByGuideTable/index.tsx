import TableRenderer, {
  emptyHeader,
  TableRendererObserverProps,
  TABLE_ROWS_PER_PAGE,
} from 'components/TableRenderer';
import Link from 'next/link';
import React, { useEffect, useMemo } from 'react';
import { graphql } from 'react-relay';
import {
  useTable,
  useSortBy,
  CellProps,
  TableOptions,
  TableState,
} from 'react-table';
import { Text } from '@chakra-ui/react';

import {
  LegacyPerformanceByGuideTable_guides$data,
  LegacyPerformanceByGuideTable_guides$key,
} from 'relay-types/LegacyPerformanceByGuideTable_guides.graphql';
import { LegacyPerformanceByGuideTablePaginationQuery } from 'relay-types/LegacyPerformanceByGuideTablePaginationQuery.graphql';
import { cleanConnection } from 'utils/cleanConnection';
import { useTableRenderer } from 'components/TableRenderer/TableRendererProvider';
import { usePaginationFragment } from 'react-relay/hooks';
import {
  getSortFormatted,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import { NA_LABEL } from 'utils/constants';
import { EmptyTablePlaceholderProps } from 'components/EmptyTablePlaceholder/EmptyTablePlaceholder';
import colors from 'helpers/colors';
import CircularBadge from 'system/CircularBadge';
import { ExtendedCalloutTypes } from 'bento-common/types/slate';

type GuideAnalytic =
  LegacyPerformanceByGuideTable_guides$data['analytics']['guides']['edges'][number]['node'];

interface PerformanceByGuideTableProps {
  query: LegacyPerformanceByGuideTable_guides$key;
  hasGuideData?: boolean;
  setHasGuideData?: (v: boolean) => void;
}

const GUIDES_PERFORMANCE_QUERY = graphql`
  fragment LegacyPerformanceByGuideTable_guides on RootType
  @refetchable(queryName: "LegacyPerformanceByGuideTablePaginationQuery") {
    analytics(startDate: $startDate, endDate: $endDate) {
      guides(
        first: $first
        after: $after
        last: $last
        before: $before
        orderBy: $gpOrderBy
        orderDirection: $gpOrderDirection
      ) @connection(key: "LegacyPerformanceByGuideTable_guides") {
        edges {
          node {
            template {
              entityId
              name
            }
            usersSeenGuide
            completedAStep
            totalStepsCompleted
          }
        }
      }
    }
  }
`;

export default function PerformanceByGuideTable(
  props: PerformanceByGuideTableProps
) {
  const { query, hasGuideData, setHasGuideData } = props;

  const { handleSorting } = useTableRenderer();

  const { data, loadNext, hasNext } = usePaginationFragment<
    LegacyPerformanceByGuideTablePaginationQuery,
    LegacyPerformanceByGuideTable_guides$key
  >(GUIDES_PERFORMANCE_QUERY, query);

  const { analytics } = data || {};

  const guides = cleanConnection<GuideAnalytic>(analytics?.guides as any);

  const tableData = useMemo(() => guides, [guides]);

  useEffect(() => {
    if (!hasGuideData && guides.length > 0) setHasGuideData(true);
  }, [guides, hasGuideData, setHasGuideData]);

  const Columns = () => [
    emptyHeader,
    {
      Header: 'Name',
      id: 'templateName',
      canSort: true,
      Cell: (cellData: CellProps<GuideAnalytic>) => {
        const analytic = cellData.row.original!;

        return (
          <Link
            href={`/library/templates/${analytic.template.entityId}?tab=analytics`}
            title={analytic.template.name}
          >
            {analytic.template.name}
          </Link>
        );
      },
    },
    {
      Header: 'Users seen guide',
      id: 'usersSeenGuide',
      canSort: true,
      Cell: (cellData: CellProps<GuideAnalytic>) => {
        const analytic = cellData.row.original!;

        return analytic.usersSeenGuide || 0;
      },
    },
    {
      Header: 'Users completed steps',
      id: 'completedAStep',
      canSort: true,
      Cell: (cellData: CellProps<GuideAnalytic>) => {
        const analytic = cellData.row.original!;

        return analytic.completedAStep || 0;
      },
    },
    {
      Header: 'Steps completed',
      id: 'totalStepsCompleted',
      canSort: true,
      Cell: (cellData: CellProps<GuideAnalytic>) => {
        const analytic = cellData.row.original!;

        return analytic.totalStepsCompleted === null
          ? NA_LABEL
          : analytic.totalStepsCompleted || 0;
      },
    },
  ];

  const columns = useMemo(Columns, []);

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      manualSortBy: true,
      initialState: {
        sortBy: getSortFormatted(TableType.guidesPerformance),
      } as Partial<TableState<object>>,
    } as TableOptions<object>,
    useSortBy
  );

  const oberserverProps: TableRendererObserverProps = {
    hasMore: hasNext,
    callback: () => loadNext(TABLE_ROWS_PER_PAGE),
  };

  if (!data) return null;

  const tablePlaceholder: EmptyTablePlaceholderProps = {
    Graphic: () => (
      <CircularBadge
        calloutType={ExtendedCalloutTypes.Analytics}
        mt="4"
        mb="4"
        width="50px"
        height="50px"
      />
    ),
    text: (
      <Text color={colors.text.secondary}>
        This table will help you understand <br />
        which guides have the most engagement from users.
      </Text>
    ),
    pt: '0',
  };

  return (
    <TableRenderer
      type={TableType.guidesPerformance}
      tableInstance={tableInstance}
      observerProps={oberserverProps}
      handleSorting={handleSorting}
      centeredCols={['usersSeenGuide', 'completedAStep', 'totalStepsCompleted']}
      gridTemplateColumns={`
        minmax(140px, 1fr)
        repeat(2,minmax(100px, 0.6fr))
        minmax(120px, 0.6fr)
      `}
      placeholder={tablePlaceholder}
    />
  );
}
