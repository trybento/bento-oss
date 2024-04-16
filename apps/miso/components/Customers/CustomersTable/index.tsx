import React, { useMemo } from 'react';
import { graphql, RelayPaginationProp } from 'react-relay';
import {
  useTable,
  useSortBy,
  CellProps,
  TableOptions,
  TableState,
} from 'react-table';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { pluralize } from 'bento-common/utils/pluralize';
import { DOCS_INSTALLATION_URL } from 'bento-common/utils/docs';

import { SuspendedQueryRenderer } from 'components/QueryRenderer';
import Link from 'system/Link';
import Box from 'system/Box';
import { formatDistanceToNowStrict } from 'date-fns';
import { cleanConnection } from 'utils/cleanConnection';
import {
  CustomersTable_query$data,
  CustomersTable_query$key,
} from 'relay-types/CustomersTable_query.graphql';
import { OrderByType, OrderDirectionType } from '..';
import TableRenderer, {
  BentoLoadingSpinner,
  emptyHeader,
  REDUCED_TABLE_ROWS_PER_PAGE,
  TableRendererObserverProps,
  TableTextCell,
  TABLE_ROWS_PER_PAGE,
} from 'components/TableRenderer';
import { useTableRenderer } from 'components/TableRenderer/TableRendererProvider';
import { usePaginationFragment } from 'react-relay/hooks';
import { GuideBase } from 'components/AccountGuideBases/EditAccountGuideBase/types';
import { CustomersTablePaginationQuery } from 'relay-types/CustomersTablePaginationQuery.graphql';
import {
  getSortFormatted,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import EmptyTable from 'icons/EmptyTable';
import { EmptyTablePlaceholderProps } from '../../EmptyTablePlaceholder/EmptyTablePlaceholder';
import colors from 'helpers/colors';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import { Flex } from '@chakra-ui/react';
import H4 from 'system/H4';
import PopoverTip from 'system/PopoverTip';

type Account =
  CustomersTable_query$data['accountsConnection']['edges'][number]['node'];

interface CustomersTableQueryRendererProps {
  searchQuery: string;
}

interface CustomersTableProps
  extends CustomersTableQueryRendererProps,
    CustomersTable_query$data {
  query: CustomersTable_query$key;
  relay: RelayPaginationProp;
  orderBy: OrderByType;
  orderDirection: OrderDirectionType;
}

const CUSTOMERS_QUERY = graphql`
  fragment CustomersTable_query on RootType
  @refetchable(queryName: "CustomersTablePaginationQuery") {
    accountsConnection(
      searchQuery: $searchQuery
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) @connection(key: "CustomersTable_accountsConnection") {
      edges {
        node {
          id
          name
          entityId
          lastActiveAt
          createdInOrganizationAt
          guideBasesCount
        }
      }
    }
  }
`;

function CustomersTable(props: CustomersTableProps) {
  const { query, searchQuery } = props;

  const { data, loadNext, hasNext } = usePaginationFragment<
    CustomersTablePaginationQuery,
    CustomersTable_query$key
  >(CUSTOMERS_QUERY, query);

  const { handleSorting } = useTableRenderer();

  const router = useRouter();
  const { accountsConnection } = data;
  const accounts = cleanConnection<GuideBase>(accountsConnection as any);

  const tableData = useMemo(() => accounts, [accountsConnection]);

  const tablePlaceholder: EmptyTablePlaceholderProps = useMemo(
    () => ({
      Graphic: searchQuery ? () => <></> : EmptyTable,
      text: (
        <Box color={colors.text.secondary} px="2" fontSize="sm" pb="20">
          {searchQuery ? (
            'No results based on the search'
          ) : (
            <>
              Customers will appear here once people start seeing your guides.
              <br />
              For this to happen, your{' '}
              <Link href={DOCS_INSTALLATION_URL} color="blue.500" isExternal>
                Bento code-snippet
              </Link>{' '}
              needs to be installed correctly.
            </>
          )}
        </Box>
      ),
    }),
    [searchQuery]
  );

  const columns = useMemo(
    () => [
      emptyHeader,
      {
        Header: 'Customers',
        id: 'name',
        canSort: true,
        Cell: (cellData: CellProps<Account>) => {
          const { original } = cellData.row;
          const accountName = original?.name;
          const accountEntityId = original?.entityId;
          const linkUrl = `/customers/${accountEntityId}`;

          return (
            <NextLink href={linkUrl} passHref>
              <Link fontWeight="semibold" fontSize="sm" title={accountName}>
                <TableTextCell
                  type="primaryText"
                  text={accountName}
                  isTruncated
                />
              </Link>
            </NextLink>
          );
        },
      },
      {
        Header: 'Guides',
        id: 'guidesCount',
        canSort: true,
        Cell: (cellData: CellProps<Account>) => {
          const guideCount = cellData.row.original?.guideBasesCount;
          return (
            <TableTextCell
              type="number"
              style={{ textAlign: 'center' }}
              text={guideCount}
            />
          );
        },
      },
      {
        Header: (
          <Flex>
            Last active{' '}
            <PopoverTip placement="top" withPortal>
              Activity is recorded once per 30-minute interval
            </PopoverTip>
          </Flex>
        ),
        id: 'lastActiveAt',
        canSort: true,
        Cell: (cellData: CellProps<Account>) => {
          const lastActiveAt = cellData.row.original.lastActiveAt;
          const timeAgoText = lastActiveAt
            ? formatDistanceToNowStrict(new Date(lastActiveAt as string), {
                addSuffix: true,
              })
            : '-';

          return timeAgoText;
        },
      },
      {
        Header: 'Created at',
        id: 'createdInOrganizationAt',
        canSort: true,
        Cell: (cellData: CellProps<Account>) => {
          const createdInOrganizationAt =
            cellData.row.original.createdInOrganizationAt;
          const timeAgoText = createdInOrganizationAt
            ? formatDistanceToNowStrict(
                new Date(createdInOrganizationAt as string),
                {
                  addSuffix: true,
                }
              )
            : '-';

          return timeAgoText;
        },
      },
    ],
    [accountsConnection]
  );

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      /* accounts.connection query handles the sorting */
      manualSortBy: true,
      initialState: {
        sortBy: getSortFormatted(TableType.customers),
      } as Partial<TableState<object>>,
    } as TableOptions<object>,
    useSortBy
  );

  const observerProps: TableRendererObserverProps = {
    // Do not load more.
    hasMore: searchQuery && hasNext,
    callback: () => loadNext(TABLE_ROWS_PER_PAGE),
  };

  /**
   * Redirect without showing
   * the table.
   */
  if (accounts.length === 1) {
    router.push(`/customers/${accounts[0].entityId}`);
    return <></>;
  }

  return (
    <Flex flexDir="column" gap="6">
      <H4>
        {searchQuery
          ? 'Search results'
          : `${accounts.length ? 'Last ' : ''}${accounts.length} active${' '}
        ${pluralize(accounts.length, 'customer')}`}
      </H4>
      <TableRenderer
        type={TableType.customers}
        tableInstance={tableInstance}
        observerProps={observerProps}
        handleSorting={handleSorting}
        centeredCols={['totalUsersWithGuidesCount', 'guidesCount']}
        gridTemplateColumns={`
        350px
        150px
				150px
        150px
    `}
        placeholder={tablePlaceholder}
      />
    </Flex>
  );
}

export default function CustomersTableQueryRenderer(
  cProps: CustomersTableQueryRendererProps
) {
  const { searchQuery } = cProps;

  const { selectedSorting } = useTableRenderer();
  const { id: orderBy, direction: orderDirection } =
    selectedSorting[TableType.customers] || {};

  return (
    <SuspendedQueryRenderer
      query={graphql`
        query CustomersTableQuery(
          $first: Int
          $after: String
          $last: Int
          $before: String
          $searchQuery: String
          $orderBy: AccountsOrderBy
          $orderDirection: OrderDirection
        ) {
          ...CustomersTable_query
        }
      `}
      variables={{
        first: searchQuery ? TABLE_ROWS_PER_PAGE : REDUCED_TABLE_ROWS_PER_PAGE,
        searchQuery,
        orderBy,
        orderDirection,
      }}
      fetchPolicy="store-and-network"
      render={({ props }) => {
        if (props) {
          return <CustomersTable {...cProps} {...props} query={props} />;
        } else {
          return <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} />;
        }
      }}
    />
  );
}
