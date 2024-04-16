import React, { useCallback, useMemo, useState } from 'react';
import {
  useTable,
  useSortBy,
  CellProps,
  TableState,
  TableOptions,
} from 'react-table';
import { Box, Button, Flex, FormLabel } from '@chakra-ui/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { graphql } from 'react-relay';

import { TabPanelProps } from './types';
import ConfirmDeleteModal from 'components/ConfirmDeleteModal';
import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';
import EmailInput from './EmailInput';
import TableRenderer, {
  BentoLoadingSpinner,
  emptyHeader,
} from 'components/TableRenderer';

import useToast from 'hooks/useToast';
import QueryRenderer from 'components/QueryRenderer';
import { UsersTabPanelQuery } from 'relay-types/UsersTabPanelQuery.graphql';
import * as DeleteUser from 'mutations/DeleteUser';
import * as InviteUsers from 'mutations/InviteUsers';
import { showErrors } from 'utils/helpers';
import {
  getMultiSortFormatted,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import DefaultDeleteConfirmationContent from 'components/ConfirmDeleteModal/DefaultDeleteConfirmationContent';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import { useForceGoogleSSO } from 'hooks/useFeatureFlag';
import Span from 'system/Span';

interface UsersTabPanelProps extends TabPanelProps {
  onRefetch: () => void;
  organization: UsersTabPanelQuery['response']['organization'];
}

type User = UsersTabPanelQuery['response']['organization']['users'][number];

const UsersTabPanel: React.FC<UsersTabPanelProps> = ({
  onRefetch,
  organization,
}) => {
  const [inviteUsers, setInviteUsers] = useState<string>('');
  const [inviteSubmissionCount, setInviteSubmissionCount] = useState<number>(0);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const isDeletingUser = !!userToDelete;
  const toast = useToast();
  const { users, domain, googleSSOEnabled } = organization || {};

  const disabledDomains = useMemo(
    () => (googleSSOEnabled ? [domain] : []),
    [domain, googleSSOEnabled]
  );

  const selectUserToDelete = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { value } = (e.target as HTMLElement).dataset;
      setUserToDelete(users[value]);
    },
    [users?.length]
  );

  const handleInviteUsers = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const result = await InviteUsers.commit({
          inviteUsers,
        });

        if (result) {
          toast({
            title: 'Users invited!',
            isClosable: true,
            status: 'success',
          });

          setInviteUsers('');
          setInviteSubmissionCount(inviteSubmissionCount + 1);

          onRefetch?.();
        }
      } catch (e) {
        toast({
          title: 'An error occurred. Please try again later.',
          status: 'error',
        });
        console.error(e);
      }
    },
    [inviteUsers]
  );

  const resetUserToDelete = useCallback(() => {
    setUserToDelete(null);
  }, []);

  const handleDeleteUser = useCallback(async () => {
    try {
      const result = await DeleteUser.commit({
        userEntityId: userToDelete.entityId,
      });

      if (result) {
        toast({
          title: 'User deleted!',
          isClosable: true,
          status: 'success',
        });

        onRefetch?.();
      }
    } catch (e) {
      showErrors(e, toast);
    }

    resetUserToDelete();
  }, [userToDelete]);

  const data = useMemo(() => users || [], [users]) as object[];

  const Columns = () => [
    emptyHeader,
    {
      Header: 'Name',
      accessor: 'fullName',
      Cell: (cellData: CellProps<User>) => {
        const user = cellData.row.original!;
        return user.fullName || '-';
      },
    },
    {
      Header: 'Email',
      accessor: 'email',
      canSort: true,
      Cell: (cellData: CellProps<User>) => {
        const user = cellData.row.original!;
        return user.email || '-';
      },
    },
    {
      Header: 'Date added',
      accessor: 'createdAt',
      Cell: (cellData: CellProps<User>) => {
        const createdAt = cellData.row.original?.createdAt as string;
        const timeAgoText = createdAt
          ? formatDistanceToNowStrict(new Date(createdAt), {
              addSuffix: true,
            })
          : '-';

        return timeAgoText;
      },
    },
    {
      Header: 'Action',
      id: 'action',
      Cell: (cellData: CellProps<User>) => {
        return (
          <Box
            data-value={cellData.row.index.toString()}
            userSelect="none"
            cursor="pointer"
            color="gray.400"
            display="flex"
            onClick={selectUserToDelete}
            _hover={{
              color: 'gray.600',
            }}
          >
            <Box my="auto" pointerEvents="none">
              Remove user
            </Box>
          </Box>
        );
      },
    },
  ];

  const columns = React.useMemo(Columns, [users.length]);
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: getMultiSortFormatted(TableType.users),
      } as Partial<TableState>,
    } as TableOptions<object>,
    useSortBy
  );

  const forceGoogleSSO = useForceGoogleSSO();

  if (!organization) return null;

  return (
    <>
      <Flex direction="column" maxW="1000px" gap="6">
        {forceGoogleSSO ? (
          <CalloutText calloutType={CalloutTypes.Info}>
            Users may only log in via Google SSO and must have a{' '}
            <Span fontWeight="semibold">{domain}</Span> email address.
          </CalloutText>
        ) : (
          <>
            {googleSSOEnabled && (
              <CalloutText calloutType={CalloutTypes.Warning}>
                You cannot invite users with a{' '}
                <Span fontWeight="semibold">{domain}</Span> email address. They
                can already log in via Google SSO.
              </CalloutText>
            )}
            <Flex direction="column">
              <FormLabel>Invite a new user</FormLabel>
              <Box>
                <Flex gap="2">
                  <Box flex="1">
                    <EmailInput
                      key={`invite-form-${inviteSubmissionCount}`}
                      disabledDomains={disabledDomains}
                      placeholder="joe@external-acmeco.com"
                      defaultValue={inviteUsers}
                      onChange={setInviteUsers}
                    />
                  </Box>
                  <Button
                    isDisabled={!inviteUsers}
                    type="button"
                    onClick={handleInviteUsers}
                  >
                    Invite
                  </Button>
                </Flex>
                <Box color="gray.600">Hit enter to add multiple.</Box>
              </Box>
            </Flex>
          </>
        )}
        <Flex h="full" direction="column" maxH="700px">
          <TableRenderer
            type={TableType.users}
            tableInstance={tableInstance}
            centeredCols={[
              'users_in_guide',
              'avg_progress',
              'usersViewedAStep',
              'usersCompletedAStep',
            ]}
            gridTemplateColumns={`
            minmax(230px, 1fr)
            minmax(125px, 1fr)
            minmax(125px, 1fr)
            180px
          `}
          />
        </Flex>
      </Flex>
      <ConfirmDeleteModal
        isOpen={isDeletingUser}
        onDelete={handleDeleteUser}
        onClose={resetUserToDelete}
        entityName={`User: ${userToDelete?.email || '-'}`}
        header="Delete user"
      >
        <DefaultDeleteConfirmationContent />
      </ConfirmDeleteModal>
    </>
  );
};

const USERS_TAB_PANEL_QUERY = graphql`
  query UsersTabPanelQuery {
    organization {
      domain
      googleSSOEnabled
      users {
        entityId
        fullName
        email
        createdAt
      }
    }
  }
`;

export default function UsersTabPanelQueryRenderer(cProps: TabPanelProps) {
  return (
    <QueryRenderer<UsersTabPanelQuery>
      query={USERS_TAB_PANEL_QUERY}
      fetchPolicy="store-and-network"
      render={({ props, retry }) => {
        return props ? (
          <UsersTabPanel {...cProps} {...props} onRefetch={retry} />
        ) : (
          <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} h="70vh" />
        );
      }}
    />
  );
}
