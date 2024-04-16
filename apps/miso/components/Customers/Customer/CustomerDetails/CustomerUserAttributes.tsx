import React, { useMemo } from 'react';
import { graphql, usePaginationFragment } from 'react-relay';
import {
  useTable,
  useSortBy,
  CellProps,
  TableOptions,
  TableState,
} from 'react-table';
import { Flex } from '@chakra-ui/react';

import { AttributeType } from 'bento-common/types';

import Box from 'system/Box';
import { CustomerDetailsQuery } from 'relay-types/CustomerDetailsQuery.graphql';
import { CustomerUserAttributesPaginationQuery } from 'relay-types/CustomerUserAttributesPaginationQuery.graphql';
import {
  CustomerUserAttributes_participants$data,
  CustomerUserAttributes_participants$key,
} from 'relay-types/CustomerUserAttributes_participants.graphql';
import TableRenderer, {
  BentoLoadingSpinner,
  emptyHeader,
  TableRendererObserverProps,
  TABLE_ROWS_PER_PAGE,
} from 'components/TableRenderer';
import { SuspendedQueryRenderer } from 'components/QueryRenderer';
import { CustomerDetailsCProps, formatAttribute } from './CustomerDetails';
import { useTableRenderer } from 'components/TableRenderer/TableRendererProvider';
import { cleanConnection } from 'utils/cleanConnection';
import {
  getSortFormatted,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';

interface CustomerUserAttributesCProps extends CustomerDetailsCProps {
  attributes: CustomerDetailsQuery['response']['attributes'];
}

type Participant =
  CustomerUserAttributes_participants$data['accountUserAnalytics']['edges'][number]['node'];

interface CustomerUserAttributesProps
  extends CustomerUserAttributes_participants$key {
  onRefetch: () => void;
  attributes: CustomerDetailsQuery['response']['attributes'];
}

const CUSTOMER_USER_ATTRIBUTES_ROOT_QUERY = graphql`
  query CustomerUserAttributesQuery(
    $accountEntityId: EntityId!
    $first: Int
    $after: String
    $last: Int
    $before: String
    $auOrderBy: String
    $auOrderDirection: OrderDirection
  ) {
    ...CustomerUserAttributes_participants
  }
`;

const CUSTOMER_USER_ATTRIBUTES_QUERY = graphql`
  fragment CustomerUserAttributes_participants on RootType
  @refetchable(queryName: "CustomerUserAttributesPaginationQuery") {
    accountUserAnalytics(
      accountEntityId: $accountEntityId
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: $auOrderBy
      orderDirection: $auOrderDirection
      includeInternal: true
    ) @connection(key: "CustomerUserAttributes_accountUserAnalytics") {
      edges {
        node {
          accountUser {
            fullName
            attributes
          }
        }
      }
    }
  }
`;

function CustomerUserAttributes(props: CustomerUserAttributesProps) {
  const { data, loadNext, hasNext } = usePaginationFragment<
    CustomerUserAttributesPaginationQuery,
    CustomerUserAttributes_participants$key
  >(CUSTOMER_USER_ATTRIBUTES_QUERY, props);

  const { attributes: allAttributes } = props;
  const { accountUserAnalytics } = data || {};
  const { handleSorting } = useTableRenderer();

  const participants = cleanConnection<Participant>(
    accountUserAnalytics as any
  );

  const tableData = useMemo(() => participants, [participants]);

  const typesByUserAttribute = useMemo(() => {
    return allAttributes
      .filter(
        ({ type, name }) =>
          type === AttributeType.accountUser && name !== 'fullName'
      )
      .reduce((x, row) => ({ ...x, ...{ [row.name]: row.valueType } }), {});
  }, [allAttributes]);

  const columns = useMemo(
    () => [
      emptyHeader,
      {
        Header: 'User',
        id: 'fullName',
        Cell: (cellData: CellProps<Participant>) => {
          const participant = cellData.row.original!;

          return participant.accountUser.fullName;
        },
      },
      ...Object.entries(typesByUserAttribute).map(([attrKey, attrType]) => ({
        Header: attrKey,
        id: attrKey,
        Cell: (cellData: CellProps<Participant>) => {
          const participant = cellData.row.original!;
          return formatAttribute(
            participant.accountUser.attributes?.[attrKey],
            attrType as any
          );
        },
      })),
    ],
    [typesByUserAttribute]
  );

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      manualSortBy: true,
      initialState: {
        sortBy: getSortFormatted(TableType.userAttributes),
      } as Partial<TableState<object>>,
    } as TableOptions<object>,
    useSortBy
  );

  const oberserverProps: TableRendererObserverProps = {
    hasMore: hasNext,
    callback: () => loadNext(TABLE_ROWS_PER_PAGE),
  };

  if (!data) return null;

  return (
    <Box display="flex" flexDir="column" mt="6" maxH="500px">
      <Box fontSize="lg" fontWeight="semibold">
        User attributes
      </Box>
      <TableRenderer
        type={TableType.userAttributes}
        tableInstance={tableInstance}
        observerProps={oberserverProps}
        handleSorting={handleSorting}
        gridTemplateColumns={`
        minmax(200px, 1fr)
        repeat(${columns.length - 2},minmax(140px, 1fr))
      `}
      />
    </Box>
  );
}

export default function CustomerUserAttributesQueryRenderer(
  cProps: CustomerUserAttributesCProps
) {
  const { accountEntityId, attributes } = cProps;

  const { selectedSorting } = useTableRenderer();
  const { id: auOrderBy, direction: auOrderDirection } =
    selectedSorting[TableType.userAttributes] || {};

  return (
    <SuspendedQueryRenderer
      query={CUSTOMER_USER_ATTRIBUTES_ROOT_QUERY}
      variables={{
        accountEntityId,
        first: TABLE_ROWS_PER_PAGE,
        auOrderBy,
        auOrderDirection,
      }}
      fetchPolicy="store-and-network"
      render={({ props, retry }) => {
        return props && attributes ? (
          <CustomerUserAttributes
            {...props}
            onRefetch={retry}
            attributes={attributes}
          />
        ) : (
          <Flex alignItems="center" justifyContent="center" flex="1">
            <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} />
          </Flex>
        );
      }}
    />
  );
}
