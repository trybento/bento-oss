import React, { useMemo } from 'react';
import { useTable, useSortBy, CellProps, TableState } from 'react-table';
import sortBy from 'lodash/sortBy';
import { graphql } from 'react-relay';
import { formatRelative } from 'date-fns';
import { Flex } from '@chakra-ui/react';

import { AttributeType, TargetValueType } from 'bento-common/types';

import Box from 'system/Box';
import { CustomerDetailsQuery } from 'relay-types/CustomerDetailsQuery.graphql';
import TableRenderer, { emptyHeader } from 'components/TableRenderer';
import { SuspendedQueryRenderer } from 'components/QueryRenderer';
import TableRendererProvider from 'components/TableRenderer/TableRendererProvider';
import CustomerUserAttributes from './CustomerUserAttributes';
import {
  getSortFormatted,
  TableType,
} from 'components/TableRenderer/tables.helpers';

export function formatAttribute(val: any, type: TargetValueType | undefined) {
  if (
    val === undefined ||
    val === null ||
    (typeof val === 'string' && val.trim() === '')
  ) {
    return null;
  }

  switch (type) {
    case undefined:
      return String(val);
    case 'date':
      return val ? formatRelative(new Date(val), new Date()) : '';
    default:
      return Array.isArray(val)
        ? val
            .flatMap((v) => (Array.isArray(v) ? v : [v]))
            .map(String)
            .join(', ')
        : String(val);
  }
}

export interface CustomerDetailsCProps {
  accountEntityId: string;
}

interface CustomerDetailsProps extends CustomerDetailsCProps {
  onRefetch: () => void;
  account: CustomerDetailsQuery['response']['account'];
  attributes: CustomerDetailsQuery['response']['attributes'];
}

type CustomerAttribute = [string, string];

function CustomerDetails(props: CustomerDetailsProps) {
  const { account } = props;
  const { attributes } = account || {};

  const data = useMemo(
    () =>
      sortBy(Object.entries(attributes || {}), (row) => row[0].toLowerCase()),
    [attributes]
  );
  const types = useMemo(() => {
    return (props?.attributes || [])
      .filter(({ type }) => type === AttributeType.account)
      .reduce((x, row) => ({ ...x, ...{ [row.name]: row.valueType } }), {});
  }, [props?.attributes]);

  const Columns = () => [
    emptyHeader,
    {
      Header: 'Attribute',
      id: 'attribute',
      accessor: 'attributeKey',
      Cell: (cellData: CellProps<CustomerAttribute>) => {
        const attributePair = cellData.row.original!;

        return (
          <Box
            display="grid"
            gridAutoFlow="column"
            alignItems="center"
            justifySelf="left"
            gridTemplateColumns="auto minmax(3.2rem, 1fr)"
          >
            {attributePair[0]}
          </Box>
        );
      },
    },
    {
      Header: 'Value',
      id: 'value',
      accessor: 'attributeValue',
      Cell: (cellData: CellProps<CustomerAttribute>) => {
        const attributePair = cellData.row.original;
        return formatAttribute(attributePair[1], types[attributePair[0]]);
      },
    },
  ];

  const columns = React.useMemo(Columns, []);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: getSortFormatted(TableType.accountAttributes),
      } as Partial<TableState>,
    },
    useSortBy
  );

  if (!account) return null;

  return (
    <Box display="flex" flexDir="column" maxH="500px" maxW="700px">
      <Box fontSize="lg" fontWeight="semibold">
        Account attributes
      </Box>
      <TableRenderer
        type={TableType.accountAttributes}
        tableInstance={tableInstance}
        gridTemplateColumns={`
        minmax(150px, 1fr)
        minmax(120px, 1fr)
      `}
      />
    </Box>
  );
}

const CUSTOMER_DETAILS_QUERY = graphql`
  query CustomerDetailsQuery($accountEntityId: EntityId!) {
    account: findAccount(entityId: $accountEntityId) {
      attributes
    }
    attributes {
      name
      valueType
      type
    }
  }
`;

export default function CustomerDetailsQueryRenderer(
  cProps: CustomerDetailsCProps
) {
  const { accountEntityId } = cProps;

  return (
    <SuspendedQueryRenderer
      query={CUSTOMER_DETAILS_QUERY}
      variables={{
        accountEntityId,
      }}
      fetchPolicy="store-and-network"
      render={({ props, retry }) => {
        return (
          <TableRendererProvider>
            <Flex direction="column" pb="8">
              {props ? <CustomerDetails {...props} onRefetch={retry} /> : null}
              <CustomerUserAttributes {...cProps} {...props} />
            </Flex>
          </TableRendererProvider>
        );
      }}
    />
  );
}
