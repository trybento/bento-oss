import React, { useMemo } from 'react';
import { graphql } from 'react-relay';
import {
  useTable,
  useSortBy,
  CellProps,
  TableOptions,
  TableState,
} from 'react-table';
import Text from 'system/Text';
import { cleanConnection } from 'utils/cleanConnection';
import {
  NpsAnalyticsAccountsTable_query$data,
  NpsAnalyticsAccountsTable_query$key,
} from 'relay-types/NpsAnalyticsAccountsTable_query.graphql';
import TableRenderer, {
  emptyHeader,
  TableRendererObserverProps,
  TableTextCell,
  TABLE_ROWS_PER_PAGE,
} from 'components/TableRenderer';
import { useTableRenderer } from 'components/TableRenderer/TableRendererProvider';
import { usePaginationFragment } from 'react-relay/hooks';
import { GuideBase } from 'components/AccountGuideBases/EditAccountGuideBase/types';
import { NpsAnalyticsAccountsTablePaginationQuery } from 'relay-types/NpsAnalyticsAccountsTablePaginationQuery.graphql';
import {
  getSortFormatted,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import EmptyTable from 'icons/EmptyTable';
import colors from 'helpers/colors';
import { Flex, Grid, GridItem } from '@chakra-ui/react';
import H4 from 'system/H4';
import { EmptyTablePlaceholderProps } from 'components/EmptyTablePlaceholder/EmptyTablePlaceholder';

const PAGINATION_QUERY = graphql`
  fragment NpsAnalyticsAccountsTable_query on RootType
  @refetchable(queryName: "NpsAnalyticsAccountsTablePaginationQuery") {
    npsSurveyAccountsConnection(
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: $orderBy
      orderDirection: $orderDirection
      npsSurveyEntityId: $npsSurveyEntityId
    )
      @connection(
        key: "NpsAnalyticsAccountsTable_npsSurveyAccountsConnection"
      ) {
      edges {
        node {
          accountEntityId
          accountName
          responses
          score
        }
      }
    }
  }
`;

type NpsSurveyAccount =
  NpsAnalyticsAccountsTable_query$data['npsSurveyAccountsConnection']['edges'][number]['node'];

interface NpsAccountTableProps {
  query: NpsAnalyticsAccountsTable_query$key;
}

function NpsAnalyticsAccountsTable(props: NpsAccountTableProps) {
  const { query } = props;
  const { data, loadNext, hasNext } = usePaginationFragment<
    NpsAnalyticsAccountsTablePaginationQuery,
    NpsAnalyticsAccountsTable_query$key
  >(PAGINATION_QUERY, query);

  const { handleSorting } = useTableRenderer();
  const { npsSurveyAccountsConnection } = data;
  const accounts = cleanConnection<GuideBase>(
    npsSurveyAccountsConnection as any
  );
  const tableData = useMemo(() => accounts, [npsSurveyAccountsConnection]);

  const tablePlaceholder: EmptyTablePlaceholderProps = useMemo(
    () => ({
      Graphic: EmptyTable,
      text: (
        <Text color={colors.text.secondary} px="2" fontSize="sm" pb="20">
          NPS scores for your accounts will appear here as soon as users start
          submitting their answers.
        </Text>
      ),
    }),
    []
  );

  const columns = useMemo(
    () => [
      emptyHeader,
      {
        Header: 'Account name',
        id: 'accountName',
        canSort: true,
        Cell: (cellData: CellProps<NpsSurveyAccount>) => {
          const { original } = cellData.row;
          const { accountName } = original;

          return (
            <TableTextCell type="primaryText" text={accountName} isTruncated />
          );
        },
      },
      {
        Header: 'Users responded',
        id: 'responses',
        canSort: true,
        Cell: (cellData: CellProps<NpsSurveyAccount>) => {
          const { original } = cellData.row;
          const { responses } = original;

          return <TableTextCell type="primaryText" text={responses} />;
        },
      },
      {
        Header: 'NPS score',
        id: 'score',
        canSort: true,
        Cell: (cellData: CellProps<NpsSurveyAccount>) => {
          const { original } = cellData.row;
          const { score } = original;

          return (
            <TableTextCell
              type="primaryText"
              text={score === null ? '-' : score}
            />
          );
        },
      },
    ],
    [npsSurveyAccountsConnection]
  );

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      manualSortBy: true,
      initialState: {
        sortBy: getSortFormatted(TableType.npsSurveyAccounts),
      } as Partial<TableState<object>>,
    } as TableOptions<object>,
    useSortBy
  );

  const observerProps: TableRendererObserverProps = {
    hasMore: hasNext,
    callback: () => loadNext(TABLE_ROWS_PER_PAGE),
  };

  return (
    <Grid templateColumns="1fr 1fr" gap={5}>
      <GridItem>
        <Flex flexDir="column" gap={4}>
          <H4>Accounts NPS</H4>
          <TableRenderer
            type={TableType.npsSurveyAccounts}
            tableInstance={tableInstance}
            observerProps={observerProps}
            handleSorting={handleSorting}
            centeredCols={['responses', 'score']}
            gridTemplateColumns={`
        minmax(155px, 1.2fr)
        minmax(125px, 1fr)
        minmax(125px, 1fr)
    `}
            placeholder={tablePlaceholder}
          />
        </Flex>
      </GridItem>
    </Grid>
  );
}

export default NpsAnalyticsAccountsTable;
