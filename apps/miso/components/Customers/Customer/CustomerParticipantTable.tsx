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
import { formatDistanceToNowStrict } from 'date-fns';
import { Flex } from '@chakra-ui/react';
import { usePaginationFragment } from 'react-relay/hooks';

import { pluralize } from 'bento-common/utils/pluralize';
import { DOCS_INSTALLATION_URL } from 'bento-common/utils/docs';

import { SuspendedQueryRenderer } from 'components/QueryRenderer';
import Link from 'system/Link';
import Text from 'system/Text';
import { cleanConnection } from 'utils/cleanConnection';
import {
  CustomerParticipantTable_query$data,
  CustomerParticipantTable_query$key,
} from 'relay-types/CustomerParticipantTable_query.graphql';

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
import { GuideBase } from 'components/AccountGuideBases/EditAccountGuideBase/types';
import { CustomerParticipantsTablePaginationQuery } from 'relay-types/CustomerParticipantsTablePaginationQuery.graphql';
import {
  getSortFormatted,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import EmptyTable from 'icons/EmptyTable';
import { EmptyTablePlaceholderProps } from '../../EmptyTablePlaceholder/EmptyTablePlaceholder';
import colors from 'helpers/colors';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import H4 from 'system/H4';
import { accountUserNameIdentityLong } from 'utils/helpers';

type Account =
  CustomerParticipantTable_query$data['accountUserAnalytics']['edges'][number]['node'];

interface CustomerParticipantsTableQueryRendererProps {
  accountUserSearchQuery: string;
  accountEntityId: string;
}

interface CustomerParticipantsTableProps
  extends CustomerParticipantsTableQueryRendererProps,
    CustomerParticipantTable_query$data {
  query: CustomerParticipantTable_query$key;
  relay: RelayPaginationProp;
  orderBy: OrderByType;
  orderDirection: OrderDirectionType;
}

const CUSTOMERS_QUERY = graphql`
  fragment CustomerParticipantTable_query on RootType
  @refetchable(queryName: "CustomerParticipantsTablePaginationQuery") {
    accountUserAnalytics(
      accountEntityId: $accountEntityId
      includeInternal: $includeInternal
      searchQuery: $searchQuery
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: $auOrderBy
      orderDirection: $auOrderDirection
    ) @connection(key: "CustomerParticipants_accountUserAnalytics") {
      edges {
        node {
          accountUser {
            id
            fullName
            createdInOrganizationAt
            email
            entityId
          }
          currentStep {
            name
            guide {
              name
            }
          }
          stepLastSeen
          stepsViewed
          lastActiveInApp
          stepsCompleted
        }
      }
    }
  }
`;

function CustomerParticipantsTable(props: CustomerParticipantsTableProps) {
  const { query, accountUserSearchQuery, accountEntityId } = props;

  const { data, loadNext, hasNext } = usePaginationFragment<
    CustomerParticipantsTablePaginationQuery,
    CustomerParticipantTable_query$key
  >(CUSTOMERS_QUERY, query);

  const { handleSorting } = useTableRenderer();

  const { accountUserAnalytics } = data;
  const accountUsers = cleanConnection<GuideBase>(accountUserAnalytics as any);

  const tableData = useMemo(() => accountUsers, [accountUserAnalytics]);

  const tablePlaceholder: EmptyTablePlaceholderProps = useMemo(
    () => ({
      Graphic: accountUserSearchQuery ? () => <></> : EmptyTable,
      text: (
        <Text color={colors.text.secondary} px="2" fontSize="sm" pb="20">
          {accountUserSearchQuery ? (
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
        </Text>
      ),
    }),
    [accountUserSearchQuery]
  );

  const columns = useMemo(
    () => [
      emptyHeader,
      {
        Header: 'User',
        id: 'fullName',
        canSort: true,
        Cell: (cellData: CellProps<Account>) => {
          const { original } = cellData.row;
          const accountUser = original?.accountUser;
          const accountUserEntityId = original?.accountUser?.entityId;
          const linkUrl = `/customers/${accountEntityId}/${accountUserEntityId}`;
          const accountUserText = accountUserNameIdentityLong(accountUser);

          return (
            <NextLink href={linkUrl} passHref>
              <Link fontWeight="semibold" fontSize="sm" title={accountUserText}>
                <TableTextCell
                  type="primaryText"
                  text={accountUserText}
                  isTruncated
                />
              </Link>
            </NextLink>
          );
        },
      },
      {
        Header: 'Most recently viewed guide',
        id: 'guideName',
        canSort: true,
        Cell: (cellData: CellProps<Account>) => {
          const { currentStep, stepLastSeen } = cellData.row.original;
          const lastSeenAsString = stepLastSeen as string;
          const guideName =
            currentStep?.guide?.name ||
            (lastSeenAsString && lastSeenAsString.length
              ? 'Deleted guide'
              : '-');

          return guideName;
        },
      },
      {
        Header: 'Most recently viewed step',
        id: 'stepName',
        canSort: true,
        Cell: (cellData: CellProps<Account>) => {
          const { currentStep, stepLastSeen } = cellData.row.original;
          const lastSeenAsString = stepLastSeen as string;
          const stepName =
            currentStep?.name ||
            (lastSeenAsString && lastSeenAsString.length
              ? 'Deleted Step'
              : '-');

          return stepName;
        },
      },
      {
        Header: 'Last viewed at',
        id: 'stepLastSeen',
        canSort: true,
        Cell: (cellData: CellProps<Account>) => {
          const stepLastSeen = cellData.row.original.stepLastSeen;
          const timeAgoText = stepLastSeen
            ? formatDistanceToNowStrict(new Date(stepLastSeen as string), {
                addSuffix: true,
              })
            : '-';

          return timeAgoText;
        },
      },
    ],
    [accountUserAnalytics]
  );

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      /* accounts.connection query handles the sorting */
      manualSortBy: true,
      initialState: {
        sortBy: getSortFormatted(TableType.participants),
      } as Partial<TableState<object>>,
    } as TableOptions<object>,
    useSortBy
  );

  const observerProps: TableRendererObserverProps = {
    // Do not load more.
    hasMore: accountUserSearchQuery && hasNext,
    callback: () => loadNext(TABLE_ROWS_PER_PAGE),
  };

  return (
    <Flex flexDir="column" gap="6" maxH="full">
      <H4>
        {accountUserSearchQuery
          ? 'Search results'
          : `${accountUsers.length ? 'Last ' : ''}${
              accountUsers.length
            } active${' '}
        ${pluralize(accountUsers.length, 'user')}`}
      </H4>
      <TableRenderer
        type={TableType.participants}
        tableInstance={tableInstance}
        observerProps={observerProps}
        handleSorting={handleSorting}
        gridTemplateColumns={`
					minmax(210px, 1.2fr)
					minmax(125px, 1fr)
					minmax(125px, 1fr)
					minmax(100px, 0.7fr)
				`}
        placeholder={tablePlaceholder}
      />
    </Flex>
  );
}

export default function CustomerParticipantsTableQueryRenderer(
  cProps: CustomerParticipantsTableQueryRendererProps
) {
  const { accountUserSearchQuery, accountEntityId } = cProps;

  const { selectedSorting } = useTableRenderer();
  const { id: auOrderBy, direction: auOrderDirection } =
    selectedSorting[TableType.participants] || {};

  return (
    <SuspendedQueryRenderer
      query={graphql`
        query CustomerParticipantTableQuery(
          $accountEntityId: EntityId!
          $includeInternal: Boolean
          $first: Int
          $after: String
          $searchQuery: String
          $last: Int
          $before: String
          $auOrderBy: String
          $auOrderDirection: OrderDirection
        ) {
          ...CustomerParticipantTable_query
        }
      `}
      variables={{
        first: accountUserSearchQuery
          ? TABLE_ROWS_PER_PAGE
          : REDUCED_TABLE_ROWS_PER_PAGE,
        searchQuery: accountUserSearchQuery,
        accountEntityId,
        includeInternal: true,
        auOrderBy,
        auOrderDirection,
      }}
      fetchPolicy="store-and-network"
      render={({ props }) => {
        if (props) {
          return (
            <CustomerParticipantsTable {...cProps} {...props} query={props} />
          );
        } else {
          return <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} />;
        }
      }}
    />
  );
}
