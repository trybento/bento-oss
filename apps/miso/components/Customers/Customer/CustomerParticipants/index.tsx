import React, { useMemo } from 'react';
import { graphql } from 'react-relay';
import { usePaginationFragment } from 'react-relay/hooks';
import {
  useTable,
  useSortBy,
  CellProps,
  TableState,
  TableOptions,
} from 'react-table';
import { formatDistanceToNowStrict } from 'date-fns';

import Text from 'system/Text';
import Box from 'system/Box';
import useToast from 'hooks/useToast';
import Tooltip from 'system/Tooltip';

import {
  CustomerParticipants_query$data,
  CustomerParticipants_query$key,
} from 'relay-types/CustomerParticipants_query.graphql';
import { CustomerParticipantsPaginationQuery } from 'relay-types/CustomerParticipantsPaginationQuery.graphql';
import TableRenderer, {
  BentoLoadingSpinner,
  emptyHeader,
  TableRendererObserverProps,
  TableTextCell,
  TABLE_ROWS_PER_PAGE,
} from 'components/TableRenderer';
import { useTableRenderer } from 'components/TableRenderer/TableRendererProvider';
import { cleanConnection } from 'utils/cleanConnection';
import { accountUserNameIdentityLong, copyToClipboard } from 'utils/helpers';
import { SuspendedQueryRenderer } from 'components/QueryRenderer';
import { useOrganization } from 'providers/LoggedInUserProvider';
import {
  getSortFormatted,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';

type Participant =
  CustomerParticipants_query$data['accountUserAnalytics']['edges'][number]['node'];

interface CustomerParticipantsProps {
  query: CustomerParticipants_query$key;
}

const CUSTOMER_PARTICIPANTS_ROOT_QUERY = graphql`
  query CustomerParticipantsQuery(
    $accountEntityId: EntityId!
    $includeInternal: Boolean
    $first: Int
    $after: String
    $last: Int
    $before: String
    $auOrderBy: String
    $auOrderDirection: OrderDirection
  ) {
    ...CustomerParticipants_query
  }
`;

const CUSTOMER_PARTICIPANTS_QUERY = graphql`
  fragment CustomerParticipants_query on RootType
  @refetchable(queryName: "CustomerParticipantsPaginationQuery") {
    accountUserAnalytics(
      accountEntityId: $accountEntityId
      includeInternal: $includeInternal
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
          }
          currentStep {
            name
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

function CustomerParticipants({ query }: CustomerParticipantsProps) {
  const { data, loadNext, hasNext } = usePaginationFragment<
    CustomerParticipantsPaginationQuery,
    CustomerParticipants_query$key
  >(CUSTOMER_PARTICIPANTS_QUERY, query);

  const toast = useToast();
  const { accountUserAnalytics } = data || {};
  const { handleSorting } = useTableRenderer();

  const { organization } = useOrganization();

  const participants = cleanConnection<Participant>(
    accountUserAnalytics as any
  );

  const tableData = useMemo(() => participants, [participants]);

  const copyEmailToClipboard = React.useCallback((email: string) => {
    if (!email) return;

    copyToClipboard(email);
    toast({
      title: 'Email copied!',
      isClosable: true,
      status: 'success',
    });
  }, []);

  const Columns = () => [
    emptyHeader,
    {
      Header: 'Participant',
      id: 'fullName',
      canSort: true,
      Cell: (cellData: CellProps<Participant>) => {
        const { accountUser } = cellData.row.original;

        return (
          <Box>
            <Tooltip label="Click to copy email" placement="top">
              <TableTextCell
                w="fit-content"
                type="primaryText"
                text={accountUserNameIdentityLong(accountUser)}
                cursor="pointer"
                onClick={() => copyEmailToClipboard(accountUser.email)}
              />
            </Tooltip>
          </Box>
        );
      },
    },
    {
      Header: 'Steps viewed',
      id: 'stepsViewed',
      canSort: true,
      Cell: (cellData: CellProps<Participant>) => {
        const { stepsViewed } = cellData.row.original;
        return <TableTextCell type="number" text={stepsViewed || '-'} />;
      },
    },
    {
      Header: 'Steps completed',
      id: 'stepsCompleted',
      canSort: true,
      Cell: (cellData: CellProps<Participant>) => {
        const { stepsCompleted } = cellData.row.original;
        return <TableTextCell type="number" text={stepsCompleted || '-'} />;
      },
    },
    {
      Header: 'Most recently viewed step',
      id: 'stepName',
      canSort: true,
      Cell: (cellData: CellProps<Participant>) => {
        const { currentStep, stepLastSeen } = cellData.row.original;
        const lastSeenAsString = stepLastSeen as string;
        const stepName =
          currentStep?.name ||
          (lastSeenAsString && lastSeenAsString.length ? 'Deleted Step' : '-');

        return stepName;
      },
    },
    {
      Header: 'Last viewed at',
      id: 'stepLastSeen',
      canSort: true,
      Cell: (cellData: CellProps<Participant>) => {
        const { stepLastSeen } = cellData.row.original;
        const timeAgoText = stepLastSeen
          ? formatDistanceToNowStrict(new Date(stepLastSeen as string), {
              addSuffix: true,
            })
          : '-';

        return timeAgoText;
      },
    },
    {
      Header: `Last active in ${organization.name}`,
      id: 'lastActiveInApp',
      canSort: true,
      Cell: (cellData: CellProps<Participant>) => {
        const { lastActiveInApp } = cellData.row.original;
        const timeAgoText = lastActiveInApp
          ? formatDistanceToNowStrict(new Date(lastActiveInApp as string), {
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
      Cell: (cellData: CellProps<Participant>) => {
        const { accountUser } = cellData.row.original;
        const { createdInOrganizationAt } = accountUser;

        const timeAgoText = accountUser.createdInOrganizationAt
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
  ];

  const columns = React.useMemo(Columns, []);

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      manualSortBy: true,
      initialState: {
        sortBy: getSortFormatted(TableType.participants),
      } as Partial<TableState<object>>,
    } as TableOptions<object>,
    useSortBy
  );

  const oberserverProps: TableRendererObserverProps = {
    hasMore: hasNext,
    callback: () => loadNext(TABLE_ROWS_PER_PAGE),
  };

  const reminderText = useMemo(
    () =>
      organization.domain
        ? `Friendly reminder that users with email addresses ending with ${organization.domain} or trybento.co are hidden from this list. Toggle the view to include them.`
        : 'Friendly reminder that your users and Bento employee-users are hidden from this list. Toggle the view to include them.',
    [organization.domain]
  );

  if (!data) return null;

  return (
    <>
      <TableRenderer
        type={TableType.participants}
        tableInstance={tableInstance}
        observerProps={oberserverProps}
        handleSorting={handleSorting}
        centeredCols={['stepsViewed', 'stepsCompleted']}
        gridTemplateColumns={`
          minmax(230px, 1fr)
          minmax(125px, 0.9fr)
          minmax(145px, 0.9fr)
          minmax(230px, 0.9fr)
          minmax(160px, 0.9fr)
				  minmax(160px, 0.9fr)
          minmax(160px, 0.9fr)
				`}
        placeholder={{ text: `No data (yet!). ${reminderText}` }}
      />
      {participants.length > 0 && (
        <Text fontSize="xs" color="gray.500" mt={2}>
          {reminderText}
        </Text>
      )}
    </>
  );
}

export default function CustomerParticipantsQueryRenderer(cProps) {
  const { accountEntityId, includeInternal = false } = cProps;

  const { selectedSorting } = useTableRenderer();
  const { id: auOrderBy, direction: auOrderDirection } =
    selectedSorting[TableType.participants] || {};

  return (
    <SuspendedQueryRenderer
      query={CUSTOMER_PARTICIPANTS_ROOT_QUERY}
      variables={{
        includeInternal,
        accountEntityId,
        first: TABLE_ROWS_PER_PAGE,
        auOrderBy,
        auOrderDirection,
      }}
      fetchPolicy="store-and-network"
      render={({ props }) => {
        return props ? (
          <CustomerParticipants query={props} />
        ) : (
          <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} />
        );
      }}
    />
  );
}
