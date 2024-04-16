import React, { useMemo } from 'react';
import { graphql, RelayPaginationProp } from 'react-relay';
import {
  useTable,
  useSortBy,
  CellProps,
  TableState,
  TableOptions,
} from 'react-table';
import { formatDistanceToNowStrict } from 'date-fns';
import { GuideFormFactor, GuideTypeEnum, Theme } from 'bento-common/types';
import { isSingleStepGuide } from 'bento-common/utils/formFactor';
import { SuspendedQueryRenderer } from 'components/QueryRenderer';
import Box from 'system/Box';
import Link from 'system/Link';
import Tooltip from 'system/Tooltip';
import { cleanConnection } from 'utils/cleanConnection';
import {
  AnalyticsActiveGuidesTable_query$data,
  AnalyticsActiveGuidesTable_query$key,
} from 'relay-types/AnalyticsActiveGuidesTable_query.graphql';
import TableRenderer, {
  TableRendererObserverProps,
  TableTextCell,
  TABLE_ROWS_PER_PAGE,
} from 'components/TableRenderer';
import { useTableRenderer } from 'components/TableRenderer/TableRendererProvider';
import { usePaginationFragment } from 'react-relay/hooks';
import { AnalyticsActiveGuidesTablePaginationQuery } from 'relay-types/AnalyticsActiveGuidesTablePaginationQuery.graphql';
import {
  getGuideNotifications,
  getSortFormatted,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import { OrderByType, OrderDirectionType } from 'components/Customers';
import MessagesPopover from 'system/MessagesPopover';

interface ShowColumnConfig {
  stepsCompleted: boolean;
  usersCompletedAStep: boolean;
  participantsWhoViewedCount: boolean;
}

type GuideBase =
  AnalyticsActiveGuidesTable_query$data['guideBasesConnection']['edges'][number]['node'];

interface AnalyticsActiveGuidesTableQueryRendererProps {
  templateEntityId: string | null;
  templateType: string | null;
  formFactor: GuideFormFactor | null;
  theme: Theme | null;
  onRefetch?: () => void;
}

interface AnalyticsActiveGuidesTableProps
  extends AnalyticsActiveGuidesTableQueryRendererProps {
  query: AnalyticsActiveGuidesTable_query$key;
  onRefetch: () => void;
  relay: RelayPaginationProp;
  orderBy: OrderByType;
  orderDirection: OrderDirectionType;
  show: ShowColumnConfig;
  defaultSortType: TableType;
}

const ACTIVE_GUIDES_TABLE_QUERY = graphql`
  fragment AnalyticsActiveGuidesTable_query on RootType
  @refetchable(queryName: "AnalyticsActiveGuidesTablePaginationQuery") {
    guideBasesConnection(
      createdFromTemplateEntityId: $templateEntityId
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) @connection(key: "AnalyticsActiveGuidesTable_guideBasesConnection") {
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
        }
      }
    }
  }
`;

function AnalyticsActiveGuidesTable(props: AnalyticsActiveGuidesTableProps) {
  const { query, show, defaultSortType } = props;
  const { data, loadNext, hasNext } = usePaginationFragment<
    AnalyticsActiveGuidesTablePaginationQuery,
    AnalyticsActiveGuidesTable_query$key
  >(ACTIVE_GUIDES_TABLE_QUERY, query);
  const { handleSorting } = useTableRenderer();
  const { guideBasesConnection } = data;
  const guideBases = cleanConnection<GuideBase>(guideBasesConnection as any);
  const tableData = useMemo(() => guideBases, [guideBasesConnection]);

  const columns = useMemo(() => {
    const defaultColWidth = 'minmax(125px, 1fr)';
    const gridTemplateColumnsArray: string[] = [];
    const result = {
      config: [],
      gridTemplateColumns: '',
    };

    result.config.push({
      Header: ' ',
      canSort: false,
      Cell: () => {
        return <></>;
      },
    });
    gridTemplateColumnsArray.push('8px');

    result.config.push({
      Header: 'Account name',
      id: 'accountName',
      canSort: true,
      Cell: (cellData: CellProps<GuideBase>) => {
        const accountName = cellData.row.original?.account.name;
        const guideBase = cellData.row.original!;

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
          >
            <Box
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              display="flex"
              alignItems="center"
            >
              <MessagesPopover notifications={notifications} />
              <Link
                fontWeight="semibold"
                href={`/guide-bases/${guideBase.entityId}`}
                title={accountName}
                target="_blank"
                ml="2"
              >
                {accountName}
              </Link>
            </Box>
          </Box>
        );
      },
    });
    gridTemplateColumnsArray.push('minmax(155px, 1.2fr)');

    if (show.stepsCompleted) {
      result.config.push({
        Header: () => (
          <Tooltip label="This only counts core guide steps" placement="top">
            Steps completed
          </Tooltip>
        ),
        id: 'stepsCompleted',
        accessor: 'stepsCompletedCount',
        Cell: (cellData: CellProps<GuideBase>) => {
          const stepsCompletedCount =
            cellData.row.original?.stepsCompletedCount;

          return <TableTextCell type="number" text={stepsCompletedCount} />;
        },
      });
      gridTemplateColumnsArray.push(defaultColWidth);
    }
    if (show.participantsWhoViewedCount) {
      result.config.push({
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
      });
      gridTemplateColumnsArray.push(defaultColWidth);
    }
    if (show.usersCompletedAStep) {
      result.config.push({
        Header: 'Users completed a step',
        id: 'usersCompletedAStep',
        canSort: true,
        Cell: (cellData: CellProps<GuideBase>) => {
          const usersCompletedAStep =
            cellData.row.original?.usersCompletedAStepCount;

          return <TableTextCell type="number" text={usersCompletedAStep} />;
        },
      });
      gridTemplateColumnsArray.push(defaultColWidth);
    }
    result.config.push({
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
    });
    gridTemplateColumnsArray.push('minmax(160px, 0.8fr)');

    result.gridTemplateColumns = gridTemplateColumnsArray.join(' ');
    return result;
  }, [query, show]);

  const tableInstance = useTable(
    {
      columns: columns.config,
      data: tableData,
      manualSortBy: true,
      initialState: {
        sortBy: getSortFormatted(defaultSortType),
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
      type={defaultSortType}
      tableInstance={tableInstance}
      observerProps={oberserverProps}
      handleSorting={handleSorting}
      centeredCols={[
        'participantsWhoViewedCount',
        'usersCompletedAStep',
        'stepsCompleted',
        'lastActiveAt',
      ]}
      cellEndPadding="8px"
      gridTemplateColumns={columns.gridTemplateColumns}
      placeholder={{ text: 'No data (yet!)' }}
      headerBoxProps={{
        shadow: '0px 1px 0px rgb(0 0 0 / 6%)',
      }}
    />
  );
}

export default function AnalyticsActiveGuidesTableQueryRenderer(
  cProps: AnalyticsActiveGuidesTableQueryRendererProps
) {
  const { templateEntityId, onRefetch, templateType, formFactor, theme } =
    cProps;

  const isAccountGuide = templateType === GuideTypeEnum.account;
  const isUserGuide = templateType === GuideTypeEnum.user;
  const isSingleStep = isSingleStepGuide(theme, formFactor);

  const show: ShowColumnConfig = {
    stepsCompleted: isAccountGuide,
    usersCompletedAStep: isUserGuide && !isSingleStep,
    participantsWhoViewedCount: isUserGuide,
  };

  const defaultSortType = show.participantsWhoViewedCount
    ? TableType.activeGuidesViews
    : show.stepsCompleted
    ? TableType.activeGuidesAccounts
    : TableType.activeGuides;

  const { selectedSorting } = useTableRenderer();
  const { id: orderBy, direction: orderDirection } =
    selectedSorting[defaultSortType] || {};

  return (
    <SuspendedQueryRenderer
      query={graphql`
        query AnalyticsActiveGuidesTableQuery(
          $first: Int
          $after: String
          $last: Int
          $before: String
          $templateEntityId: EntityId
          $orderBy: GuideBasesOrderBy
          $orderDirection: OrderDirection
        ) {
          ...AnalyticsActiveGuidesTable_query
        }
      `}
      variables={{
        first: TABLE_ROWS_PER_PAGE,
        templateEntityId,
        orderBy,
        orderDirection,
        // TODO: Exclude unused cols based on 'show'
      }}
      fetchPolicy="store-and-network"
      render={({ props, retry }) => {
        if (props) {
          return (
            <AnalyticsActiveGuidesTable
              {...cProps}
              {...props}
              query={props}
              show={show}
              defaultSortType={defaultSortType}
              onRefetch={() => {
                retry();
                onRefetch?.();
              }}
            />
          );
        }
      }}
    />
  );
}
