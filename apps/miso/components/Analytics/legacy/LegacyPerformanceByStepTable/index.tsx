import Link from 'next/link';
import React, { useMemo } from 'react';
import {
  useTable,
  useSortBy,
  CellProps,
  TableOptions,
  TableState,
} from 'react-table';
import { Text } from '@chakra-ui/react';
import { stepNameOrFallback } from 'bento-common/utils/naming';
import {
  LegacyPerformanceByStepTable_steps$data,
  LegacyPerformanceByStepTable_steps$key,
} from 'relay-types/LegacyPerformanceByStepTable_steps.graphql';
import { LegacyPerformanceByStepTablePaginationQuery } from 'relay-types/LegacyPerformanceByStepTablePaginationQuery.graphql';

import Box from 'system/Box';

import ThunderIcon from 'icons/Thunder';
import Tooltip from 'system/Tooltip';
import { useTableRenderer } from 'components/TableRenderer/TableRendererProvider';
import { graphql } from 'react-relay';
import TableRenderer, {
  emptyHeader,
  TableRendererObserverProps,
  TABLE_ROWS_PER_PAGE,
} from 'components/TableRenderer';
import { usePaginationFragment } from 'react-relay/hooks';
import { cleanConnection } from 'utils/cleanConnection';
import {
  getSortFormatted,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import { EmptyTablePlaceholderProps } from 'components/EmptyTablePlaceholder/EmptyTablePlaceholder';
import colors from 'helpers/colors';
import CircularBadge from 'system/CircularBadge';
import { ExtendedCalloutTypes } from 'bento-common/types/slate';

type StepAnalytic =
  LegacyPerformanceByStepTable_steps$data['analytics']['steps']['edges'][number]['node'];

interface PerformanceByStepTableProps {
  query: LegacyPerformanceByStepTable_steps$key;
  hasGuideData?: boolean;
}

const STEPS_PERFORMANCE_QUERY = graphql`
  fragment LegacyPerformanceByStepTable_steps on RootType
  @refetchable(queryName: "LegacyPerformanceByStepTablePaginationQuery") {
    analytics(startDate: $startDate, endDate: $endDate) {
      steps(
        first: $first
        after: $after
        last: $last
        before: $before
        orderBy: $spOrderBy
        orderDirection: $spOrderDirection
      ) @connection(key: "LegacyPerformanceByStepTable_steps") {
        edges {
          node {
            step {
              name
              isAutoCompletable
              module {
                entityId
              }
            }
            percentCompleted
            daysToComplete
            seenStep
          }
        }
      }
    }
  }
`;

export default function PerformanceByStepTable(
  props: PerformanceByStepTableProps
) {
  const { query, hasGuideData } = props;

  const { handleSorting } = useTableRenderer();

  const { data, loadNext, hasNext } = usePaginationFragment<
    LegacyPerformanceByStepTablePaginationQuery,
    LegacyPerformanceByStepTable_steps$key
  >(STEPS_PERFORMANCE_QUERY, query);

  const { analytics } = data || {};

  const steps = cleanConnection<StepAnalytic>(analytics?.steps as any);

  const tableData = useMemo(() => steps, [steps]);

  const Columns = () => [
    emptyHeader,
    {
      Header: 'Name',
      id: 'stepName',
      canSort: true,
      Cell: (cellData: CellProps<StepAnalytic>) => {
        const analytic = cellData.row.original!;
        const { isAutoCompletable, module } = analytic.step;
        const moduleEntityId = module?.entityId;
        const _stepName = stepNameOrFallback(analytic.step);

        const StepName = () => {
          const a = (
            <a
              title={_stepName}
              style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              target="_blank"
            >
              {_stepName}
            </a>
          );

          return moduleEntityId ? (
            <Link href={`/library/step-groups/${module.entityId}`}>{a}</Link>
          ) : (
            a
          );
        };

        return (
          <Box display="flex">
            <StepName />
            {isAutoCompletable && (
              <Box my="auto" ml="10px" title="Step is set to autocomplete">
                <ThunderIcon />
              </Box>
            )}
          </Box>
        );
      },
    },
    {
      Header: 'Users seen step',
      id: 'seenStep',
      canSort: true,
      Cell: (cellData: CellProps<StepAnalytic>) => {
        const analytic = cellData.row.original!;

        return analytic.seenStep || 0;
      },
    },
    {
      Header: '% completed',
      id: 'percentCompleted',
      canSort: true,
      Cell: (cellData: CellProps<StepAnalytic>) => {
        const analytic = cellData.row.original!;

        return analytic.percentCompleted || '-';
      },
    },
    {
      Header: () => (
        <Tooltip
          label="Number of days between step seen and step completed"
          placement="top"
        >
          Days to complete
        </Tooltip>
      ),
      id: 'daysToComplete',
      canSort: true,
      Cell: (cellData: CellProps<StepAnalytic>) => {
        const analytic = cellData.row.original!;

        const { daysToComplete } = analytic;
        const label =
          daysToComplete && daysToComplete > 0 ? daysToComplete : '<1';

        return label;
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
        sortBy: getSortFormatted(TableType.stepsPerformance),
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
    Graphic: () =>
      hasGuideData ? null : (
        <CircularBadge
          calloutType={ExtendedCalloutTypes.Analytics}
          mt="4"
          mb="4"
          width="50px"
          height="50px"
        />
      ),
    text: hasGuideData ? (
      <Text color={colors.text.secondary}>
        Step analytics cannot be loaded for you at this moment.
      </Text>
    ) : (
      <Text color={colors.text.secondary}>
        This table will help you understand <br />
        which steps are being completed, and how long it takes to complete.
      </Text>
    ),
    pt: '0',
  };

  return (
    <TableRenderer
      type={TableType.stepsPerformance}
      tableInstance={tableInstance}
      observerProps={oberserverProps}
      handleSorting={handleSorting}
      centeredCols={['daysToComplete', 'seenStep', 'percentCompleted']}
      gridTemplateColumns={`
        minmax(140px, 1fr)
        repeat(3,minmax(100px, 0.6fr))
      `}
      placeholder={tablePlaceholder}
    />
  );
}
