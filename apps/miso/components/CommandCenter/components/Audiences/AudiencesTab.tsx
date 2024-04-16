import React, { useCallback, useMemo } from 'react';
import { graphql } from 'react-relay';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useRouter } from 'next/router';

import { AudienceState, RulesDisplayType } from 'bento-common/types';
import { GroupTargeting } from 'bento-common/types/targeting';

import AudienceRulesDisplay from 'components/Templates/AudienceGroupRulesDisplay';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import QueryRenderer from 'components/QueryRenderer';
import { AudiencesTabQuery } from 'relay-types/AudiencesTabQuery.graphql';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import DataTable from 'components/DataTable';
import Link from 'system/Link';
import TabInfoHeader from '../../../layout/TabInfoHeader';
import InlineLink from 'components/common/InlineLink';
import TargetingAudienceProvider from 'components/EditorCommon/Audiences/TargetingAudiencesProvider';
import { formatDistanceToNowStrict } from 'date-fns';
import UsageBadge from 'system/UsageBadge';
import EditAudienceOverflowMenuButton from './EditAudienceOverflowMenuButton';

type Audience = AudiencesTabQuery['response']['audiences'][number];

const AudiencesTab: React.FC<{
  audiences: readonly Audience[];
  onRefetch?: () => void;
}> = ({ audiences, onRefetch }) => {
  const router = useRouter();

  const handleViewAudience = useCallback(
    (audienceEntityId: string) => () => {
      router.push(`/command-center/audiences/${audienceEntityId}`);
    },
    []
  );

  const handleCreateNew = useCallback(
    () => router.push('/command-center/audiences/create'),
    []
  );

  const data = useMemo(() => audiences, [audiences]);

  const columnHelper = createColumnHelper<Audience>();
  const columns = useMemo<ColumnDef<Audience>[]>(
    () => [
      columnHelper.display({
        id: 'menu',
        meta: {
          column: {
            width: '10px',
          },
          cell: {
            verticalAlign: 'top',
            padding: '0.85rem 0 0 1rem',
          },
        },
        cell: (props) => {
          const audience = props.row.original!;
          return (
            <EditAudienceOverflowMenuButton
              audienceName={audience.name}
              audienceEntityId={audience.entityId}
              refetch={onRefetch}
            />
          );
        },
      }),
      columnHelper.accessor('state', {
        header: 'Guide usage',
        enableSorting: true,
        sortingFn: 'text',
        meta: {
          column: {
            width: '130px',
          },
          header: {
            whiteSpace: 'nowrap',
            padding: '1rem 1rem 1rem 0',
          },
          cell: {
            verticalAlign: 'top',
            padding: '1rem 1rem 1rem 0',
          },
        },
        cell: (props) => {
          const audience = props.row.original!;

          return <UsageBadge inUse={audience.state === AudienceState.active} />;
        },
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        enableSorting: true,
        sortingFn: 'text',
        meta: {
          column: {
            width: '250px',
          },
          cell: {
            verticalAlign: 'text-top',
          },
        },
        cell: (props) => {
          const audience = props.row.original!;

          return (
            <Link
              verticalAlign="text-top"
              onClick={handleViewAudience(audience.entityId)}
              fontWeight="bold"
            >
              {audience.name}
            </Link>
          );
        },
      }),
      columnHelper.display({
        header: 'Rules',
        meta: {
          column: {
            width: '550px',
          },
        },
        cell: (props) => {
          const audience = props.row.original!;

          return (
            <AudienceRulesDisplay
              targets={audience.targets as GroupTargeting}
              type={RulesDisplayType.plain}
              hideBlockedAccounts
              fullWidth
              compact
            />
          );
        },
      }),
      columnHelper.accessor('editedBy', {
        header: 'Edited by',
        id: 'editedBy',
        enableSorting: true,
        sortingFn: 'datetime',
        meta: {
          column: { width: '160px' },
          cell: {
            verticalAlign: 'text-top',
          },
        },
        cell: (props) => {
          const { editedBy } = props.row.original;

          return editedBy ? editedBy.fullName || editedBy.email : '-';
        },
      }),
      columnHelper.accessor('editedAt', {
        header: 'Edited at',
        id: 'editedAt',
        enableSorting: true,
        meta: {
          column: { width: '160px' },
          cell: {
            verticalAlign: 'text-top',
          },
        },
        cell: (props) => {
          const { editedAt } = props.row.original;

          return editedAt
            ? formatDistanceToNowStrict(new Date(editedAt), {
                addSuffix: true,
              })
            : '-';
        },
      }),
    ],
    [audiences]
  );

  return (
    <TargetingAudienceProvider>
      <Flex flexDirection="column" gap="4" w="full">
        <Flex w="full" justifyContent="space-between">
          <TabInfoHeader title="Saved template targeting rules will show here">
            Saved audiences can be reused inside of a guide’s launching rules.{' '}
            <InlineLink
              ml="1"
              href="/data-and-integrations?tab=attributes"
              label="See available attributes."
            />
          </TabInfoHeader>
          <Button onClick={handleCreateNew}>Create new...</Button>
        </Flex>

        <DataTable
          columns={columns}
          data={data as Audience[]}
          emptyState={{
            component: TableEmptyState,
          }}
          defaultSort={{
            id: 'editedAt',
            desc: true,
          }}
          useAutoSort
          boxProps={{
            className: 'table-renderer-with-action-menu',
          }}
        />
      </Flex>
    </TargetingAudienceProvider>
  );
};

const TAB_QUERY = graphql`
  query AudiencesTabQuery {
    audiences {
      entityId
      name
      editedAt
      state
      editedBy {
        fullName
        email
      }
      ...AudienceRule_targets @relay(mask: false)
    }
  }
`;

export default function AudiencesTabQueryRenderer(_cProps) {
  return (
    <QueryRenderer<AudiencesTabQuery>
      query={TAB_QUERY}
      fetchPolicy="store-and-network"
      render={({ props, retry }) => {
        return props ? (
          <AudiencesTab {...props} onRefetch={retry} />
        ) : (
          <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} />
        );
      }}
    />
  );
}

const TableEmptyState = (
  <Box textAlign="center">
    <Text>You don’t have any saved audiences yet.</Text>
    <Text>Click “Create new” at the top right to get started.</Text>
  </Box>
);
