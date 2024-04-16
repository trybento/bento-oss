import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Search from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Flex,
  HStack,
  MenuItem,
  MenuList,
  Icon,
  Box,
} from '@chakra-ui/react';

import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';
import { noop } from 'bento-common/utils/functions';
import CustomerParticipantsTable from './CustomerParticipantTable';
import updateSearchParam from 'utils/updateSearchParam';
import TableRendererProvider from 'components/TableRenderer/TableRendererProvider';
import TextField from 'components/common/InputFields/TextField';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import AccountQuery from 'queries/AccountQuery';
import { useUsers } from 'providers/UsersProvider';
import OrgUsersDropdown from 'components/OrgUsersDropdown';
import useToast from 'hooks/useToast';
import * as AssignPrimaryContactToAccount from 'mutations/AssignPrimaryContactToAccount';
import * as UnassignPrimaryContactFromAccount from 'mutations/UnassignPrimaryContactFromAccount';
import MoreVertMenu from 'bento-common/components/MoreVertMenu';
import Page from 'components/layout/Page';
import Tooltip from 'system/Tooltip';
import InlineLink from 'components/common/InlineLink';
import H4 from 'system/H4';

export type OrderByType = 'name';

export type OrderDirectionType = 'asc' | 'desc';

export enum AssignedToUserSpecialOptions {
  All = 'all',
  None = 'none',
}
interface CustomerProps {
  accountEntityId: string;
}

const assignPrimaryContactAdditionalOptions = [
  {
    label: 'None',
    value: 'none',
  },
];

export default function Customers({ accountEntityId }: CustomerProps) {
  const router = useRouter();
  const toast = useToast();
  const { users } = useUsers();
  const [ranKey, setRanKey] = useState(0);

  const { data: accountQueryResponse } = useQueryAsHook(
    AccountQuery,
    {
      entityId: accountEntityId,
    },
    {
      dependencies: [ranKey],
    }
  );
  const { account } = accountQueryResponse || {};

  const { accountUserName: queryAccountUserName } = router.query;

  const defaultAccountUserNameSearch = (queryAccountUserName as string) || '';
  const currentPrimaryContactEntityId = account?.primaryContact?.entityId;

  const [accountUserSearchQuery, setAccountUserSearchQuery] = useState<string>(
    defaultAccountUserNameSearch
  );

  const [
    accountUserSearchQueryInputValue,
    setAccountUserSearchQueryInputValue,
  ] = useState<string>(defaultAccountUserNameSearch);

  const handleUnassignPrimaryContact = async () => {
    if (!currentPrimaryContactEntityId || !account) return;

    await UnassignPrimaryContactFromAccount.commit({
      accountEntityId,
    });

    setRanKey(Math.random());

    toast({
      title: 'The CSM for this account has been unassigned.',
      isClosable: true,
      status: 'success',
    });
  };

  const handleAssignPrimaryContact = async (userEntityId: string) => {
    if (userEntityId === currentPrimaryContactEntityId || !account) return;

    await AssignPrimaryContactToAccount.commit({
      userEntityId,
      accountEntityId,
    });

    setRanKey(Math.random());

    toast({
      title: 'This CSM has been assigned to this account.',
      isClosable: true,
      status: 'success',
    });
  };

  const handlePrimaryContactChange = (userEntityId: string) => {
    if (userEntityId === 'none') {
      handleUnassignPrimaryContact();
    } else {
      handleAssignPrimaryContact(userEntityId);
    }
  };

  const handleUpdateQueries = useCallback((q: string) => {
    setAccountUserSearchQueryInputValue(q);
    setAccountUserSearchQuery(q);
  }, []);

  const handleUrlKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newValue = (e.target as HTMLInputElement).value;
      handleUpdateQueries(newValue);
    }
  }, []);

  const handleManageGuides = useCallback(
    () => router.push(`/customers/${accountEntityId}/guides`),
    [accountEntityId]
  );
  const handleViewAttributes = useCallback(
    () => router.push(`/customers/${accountEntityId}/attributes`),
    [accountEntityId]
  );

  useEffect(() => {
    if (accountUserSearchQuery)
      updateSearchParam(router, 'userName', accountUserSearchQuery);
  }, [accountUserSearchQuery]);

  const clearSearch = useCallback(() => {
    handleUpdateQueries('');
  }, []);

  return (
    <Page
      title={account?.name || 'Customers'}
      breadcrumbs={[
        {
          label: 'Customers',
          path: '/customers',
        },
        {
          label: account?.name || '',
        },
      ]}
    >
      {!!account?.blockedAt && (
        <CalloutText calloutType={CalloutTypes.Warning} mb="4">
          This account is blocked and no guides can be launched to them. Manage
          blocked accounts in the{' '}
          <InlineLink
            label="Command center"
            href="/command-center?tab=blocked%20accounts"
          />
          .
        </CalloutText>
      )}
      <H4 mb="4">Find users</H4>
      <HStack justifyContent="space-between" alignItems="flex-start">
        <TextField
          width="xs"
          key={accountUserSearchQueryInputValue}
          onChange={noop}
          onKeyDown={handleUrlKeyDown}
          label=""
          fontSize="sm"
          defaultValue={accountUserSearchQueryInputValue}
          placeholder="Search user by name, email or ID"
          helperText="Press enter to search"
          helperTextProps={{
            fontSize: 'xs',
          }}
          inputLeftElement={<Search style={{ width: '18px' }} />}
          inputRightElement={
            !accountUserSearchQuery?.length ? undefined : (
              <Box
                position="absolute"
                top="50%"
                transform="translateY(-50%)"
                display="flex"
                right="2"
                pointerEvents="all"
                cursor="pointer"
                onClick={clearSearch}
              >
                <Icon transform="scale(0.7)" as={CloseIcon} />
              </Box>
            )
          }
        />
        <Flex alignItems="center" gap={3}>
          {users.length > 0 && (
            <OrgUsersDropdown
              users={users as any}
              onChange={handlePrimaryContactChange}
              selectedValue={account?.primaryContact?.entityId || 'none'}
              additionalOptions={assignPrimaryContactAdditionalOptions}
            />
          )}
          <Tooltip
            placement="top"
            label={
              account?.blockedAt
                ? 'This account is blocked and no guides can be launched to them'
                : null
            }
          >
            <Button
              isDisabled={!!account?.blockedAt}
              onClick={handleManageGuides}
            >
              Manage guides
            </Button>
          </Tooltip>
          <MoreVertMenu offset={[0, 0]} customHeight="40px">
            <MenuList fontSize="sm" p="0" w="fit-content">
              <MenuItem onClick={handleViewAttributes}>
                View account attributes
              </MenuItem>
            </MenuList>
          </MoreVertMenu>
        </Flex>
      </HStack>
      <Flex flexDirection="column" mt="10" overflow="hidden">
        <TableRendererProvider>
          <CustomerParticipantsTable
            accountUserSearchQuery={accountUserSearchQuery}
            accountEntityId={accountEntityId}
          />
        </TableRendererProvider>
      </Flex>
    </Page>
  );
}
