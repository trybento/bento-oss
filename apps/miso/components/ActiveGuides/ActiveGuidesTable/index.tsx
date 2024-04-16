import React, { useMemo } from 'react';
import { graphql, RelayPaginationProp } from 'react-relay';
import {
  useTable,
  useSortBy,
  CellProps,
  TableState,
  TableOptions,
} from 'react-table';
import NextLink from 'next/link';
import { SuspendedQueryRenderer } from 'components/QueryRenderer';
import Box from 'system/Box';
import Link from 'system/Link';
import { cleanConnection } from 'utils/cleanConnection';

import GuideBaseOverflowMenuButton from './GuideBaseOverflowMenuButton';
import {
  ActiveGuidesTable_query$data,
  ActiveGuidesTable_query$key,
} from 'relay-types/ActiveGuidesTable_query.graphql';

import { formatDistanceToNowStrict } from 'date-fns';
import TableRenderer, {
  ACTION_MENU_COL_ID,
  TableRendererObserverProps,
  TableTextCell,
  TABLE_ROWS_PER_PAGE,
} from 'components/TableRenderer';
import { useTableRenderer } from 'components/TableRenderer/TableRendererProvider';
import { usePaginationFragment } from 'react-relay/hooks';
import { ActiveGuidesTablePaginationQuery } from 'relay-types/ActiveGuidesTablePaginationQuery.graphql';
import { GuideBaseState } from 'bento-common/types';
import {
  getGuideNotifications,
  getSortFormatted,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import { OrderByType, OrderDirectionType } from 'components/Customers';
import { NA_LABEL } from 'utils/constants';
import MessagesPopover from 'system/MessagesPopover';
import { GuideResetToastProvider } from 'components/GuideResetToast';

type GuideBase =
  ActiveGuidesTable_query$data['guideBasesConnection']['edges'][number]['node'];

type GuideCompletionPercentage = {};
type GuideLastActiveWithin = {};
interface ActiveGuidesTableQueryRendererProps {
  accountNameSearchQuery?: string;
  assignedToEntityId?: string;
  completionPercentage?: GuideCompletionPercentage;
  lastActiveWithin?: GuideLastActiveWithin;
  templateEntityId: string | null;
  templateType?: string | null;
  hasBeenViewed?: boolean | null;
  isAnnouncement?: boolean;
  isInlineContextual?: boolean;
  onRefetch?: () => void;
}

interface ActiveGuidesTableProps extends ActiveGuidesTableQueryRendererProps {
  query: ActiveGuidesTable_query$key;
  onRefetch: () => void;
  relay: RelayPaginationProp;
  orderBy: OrderByType;
  orderDirection: OrderDirectionType;
}

const ACTIVE_GUIDES_TABLE_QUERY = graphql`
  fragment ActiveGuidesTable_query on RootType
  @refetchable(queryName: "ActiveGuidesTablePaginationQuery") {
    guideBasesConnection(
      completionPercentage: $completionPercentage
      assignedToEntityId: $assignedToEntityId
      lastActiveWithin: $lastActiveWithin
      createdFromTemplateEntityId: $templateEntityId
      accountNameSearchQuery: $accountNameSearchQuery
      hasBeenViewed: $hasBeenViewed
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) @connection(key: "ActiveGuidesTable_guideBasesConnection") {
      edges {
        node {
          averageCompletionPercentage
          entityId
          state
          wasAutoLaunched
          isModifiedFromTemplate
          type
          name
          isTargetedForSplitTesting
          usersClickedCta
          accountGuide {
            entityId
            completedStepsCount
            stepsCount
          }
          account {
            entityId
            name
          }
          stepsCompletedCount
          participantsWhoViewedCount
          usersCompletedAStepCount
          lastActiveAt
          lastCompletedStep {
            name
            completedAt
          }
          ...GuideBaseOverflowMenuButton_guideBase @relay(mask: false)
        }
      }
    }
  }
`;

function ActiveGuidesTable(props: ActiveGuidesTableProps) {
  const { query, onRefetch, templateType, isAnnouncement, isInlineContextual } =
    props;

  const { data, loadNext, hasNext } = usePaginationFragment<
    ActiveGuidesTablePaginationQuery,
    ActiveGuidesTable_query$key
  >(ACTIVE_GUIDES_TABLE_QUERY, query);

  const { handleSorting } = useTableRenderer();

  const { guideBasesConnection } = data;

  const guideBases = cleanConnection<GuideBase>(guideBasesConnection as any);
  const tableData = useMemo(() => guideBases, [guideBasesConnection]);

  const Columns = () => [
    {
      Header: ' ',
      id: ACTION_MENU_COL_ID,
      Cell: (cellData: CellProps<GuideBase>) => {
        const guideBase = cellData.row.original!;

        if (guideBase.state === GuideBaseState.archived) return null;

        return (
          <GuideBaseOverflowMenuButton
            guideBase={guideBase as any /** Not-Todo: Fix */}
            onRefetch={onRefetch}
          />
        );
      },
    },
    {
      Header: 'Account',
      id: 'accountName',
      canSort: true,
      Cell: (cellData: CellProps<GuideBase>) => {
        const accountName = cellData.row.original?.account.name;
        const guideBase = cellData.row.original!;

        const linkUrl = `/guide-bases/${guideBase.entityId}`;

        // Show only 'Customized' message.
        const notifications = getGuideNotifications({
          isModifiedFromTemplate: guideBase.isModifiedFromTemplate,
        });
        return (
          <Box
            display="grid"
            gridAutoFlow="column"
            alignItems="center"
            justifySelf="left"
            gridTemplateColumns="auto minmax(3.2rem, 1fr)"
          >
            <Box
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              display="flex"
              alignItems="center"
            >
              <NextLink href={linkUrl}>
                <Link fontWeight="semibold" title={accountName}>
                  {accountName}
                </Link>
              </NextLink>
              <MessagesPopover notifications={notifications} />
            </Box>
          </Box>
        );
      },
    },
    ...(templateType === 'user'
      ? [
          {
            Header: 'Users viewed',
            id: 'participantsWhoViewedCount',
            canSort: true,
            Cell: (cellData: CellProps<GuideBase>) => {
              const participantsWhoViewedCount =
                cellData.row.original.participantsWhoViewedCount;

              return (
                <TableTextCell
                  display="flex"
                  alignItems="center"
                  style={{ justifyContent: 'center' }}
                  type="number"
                  text={participantsWhoViewedCount}
                />
              );
            },
          },
        ]
      : []),
    ...(templateType === 'user' && !isAnnouncement && !isInlineContextual
      ? [
          {
            Header: 'Users viewed a step',
            id: 'usersViewedAStep',
            canSort: true,
            Cell: (cellData: CellProps<GuideBase>) => {
              const usersViewedAStep =
                cellData.row.original?.participantsWhoViewedCount;

              return (
                <TableTextCell
                  display="flex"
                  alignItems="center"
                  style={{ justifyContent: 'center' }}
                  type="number"
                  text={usersViewedAStep}
                />
              );
            },
          },
        ]
      : []),
    ...(!isAnnouncement && !isInlineContextual
      ? [
          {
            Header: 'Users completed a step',
            id: 'usersCompletedAStep',
            canSort: true,
            Cell: (cellData: CellProps<GuideBase>) => {
              const usersCompletedAStep =
                cellData.row.original?.usersCompletedAStepCount;

              return (
                <TableTextCell
                  display="flex"
                  alignItems="center"
                  style={{ justifyContent: 'center' }}
                  type="number"
                  text={usersCompletedAStep}
                />
              );
            },
          },
        ]
      : []),
    ...(templateType === 'account'
      ? [
          {
            Header: 'Steps completed',
            id: 'stepsCompleted',
            accessor: 'stepsCompletedCount',
            Cell: (cellData: CellProps<GuideBase>) => {
              const stepsCompletedCount =
                cellData.row.original?.stepsCompletedCount;

              return (
                <TableTextCell
                  type="number"
                  display="flex"
                  alignItems="center"
                  style={{ justifyContent: 'center', justifyItems: 'center' }}
                  text={stepsCompletedCount}
                />
              );
            },
          },
        ]
      : []),
    ...(templateType === 'account'
      ? [
          {
            Header: 'Progress',
            id: 'progress',
            accessor: 'averageCompletionPercentage',
            Cell: (cellData: CellProps<GuideBase>) => {
              const averageCompletionPercentage =
                cellData.row.original?.averageCompletionPercentage;

              return (
                <TableTextCell
                  type="percentage"
                  display="flex"
                  alignItems="center"
                  style={{ justifyContent: 'center' }}
                  text={averageCompletionPercentage}
                />
              );
            },
          },
        ]
      : []),
    ...(isAnnouncement || isInlineContextual
      ? [
          {
            Header: '# users clicked',
            id: 'usersClickedCta',
            canSort: true,
            Cell: (cellData: CellProps<GuideBase>) => {
              const usersClickedCta = cellData.row.original.usersClickedCta;

              return (
                <TableTextCell
                  type="number"
                  alignItems="center"
                  style={{ justifyContent: 'center', alignContent: 'center' }}
                  text={usersClickedCta === null ? NA_LABEL : usersClickedCta}
                />
              );
            },
          },
        ]
      : []),
    {
      Header: 'Last guide activity',
      id: 'lastActiveAt',
      canSort: true,
      Cell: (cellData: CellProps<GuideBase>) => {
        let displayedTime = '-';
        const lastActiveAt = cellData.row?.original?.lastActiveAt;

        if (lastActiveAt) {
          displayedTime = formatDistanceToNowStrict(
            new Date(lastActiveAt as string),
            { addSuffix: true }
          );
        }

        return displayedTime;
      },
    },
  ];

  const columns = useMemo(Columns, [templateType]);

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      manualSortBy: true,
      autoResetSortBy: false,
      initialState: {
        sortBy: getSortFormatted(TableType.activeGuides),
      } as Partial<TableState<object>>,
    } as TableOptions<object>,
    useSortBy
  );

  const oberserverProps: TableRendererObserverProps = {
    hasMore: hasNext,
    callback: () => loadNext(TABLE_ROWS_PER_PAGE),
  };

  return (
    <TableRenderer
      type={TableType.activeGuides}
      tableInstance={tableInstance}
      observerProps={oberserverProps}
      handleSorting={handleSorting}
      centeredCols={[
        'participantsWhoViewedCount',
        'progress',
        'usersCompletedAStep',
        'usersViewedAStep',
        'stepsCompleted',
      ]}
      gridTemplateColumns={`
        minmax(210px, 0.7fr)
        minmax(125px, 1fr)
				minmax(125px, 1fr)
        minmax(170px, 1fr)
        minmax(160px, 1fr)
      `}
      placeholder={{ text: 'No data (yet!)' }}
    />
  );
}

export default function ActiveGuidesTableQueryRenderer(
  cProps: ActiveGuidesTableQueryRendererProps
) {
  const {
    accountNameSearchQuery,
    assignedToEntityId,
    templateEntityId,
    completionPercentage,
    lastActiveWithin,
    hasBeenViewed,
    onRefetch,
  } = cProps;

  const { selectedSorting } = useTableRenderer();
  const { id: orderBy, direction: orderDirection } =
    selectedSorting[TableType.activeGuides] || {};

  return (
    <SuspendedQueryRenderer
      query={graphql`
        query ActiveGuidesTableQuery(
          $first: Int
          $after: String
          $last: Int
          $before: String
          $completionPercentage: GuideCompletionPercentageFilterEnum
          $assignedToEntityId: String
          $lastActiveWithin: GuideLastActiveWithinFilterEnum
          $templateEntityId: EntityId
          $accountNameSearchQuery: String
          $hasBeenViewed: Boolean
          $orderBy: GuideBasesOrderBy
          $orderDirection: OrderDirection
        ) {
          ...ActiveGuidesTable_query
        }
      `}
      variables={{
        first: TABLE_ROWS_PER_PAGE,
        accountNameSearchQuery,
        assignedToEntityId,
        completionPercentage,
        lastActiveWithin,
        templateEntityId,
        hasBeenViewed,
        orderBy,
        orderDirection,
      }}
      fetchPolicy="store-and-network"
      render={({ props, retry }) => {
        if (props) {
          return (
            <GuideResetToastProvider>
              <ActiveGuidesTable
                {...cProps}
                {...props}
                query={props}
                onRefetch={() => {
                  retry();
                  onRefetch?.();
                }}
              />
            </GuideResetToastProvider>
          );
        }
      }}
    />
  );
}
