import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import sortBy from 'lodash/sortBy';
import { format } from 'date-fns';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import useToast from 'hooks/useToast';

import { EmojiList, EmojiListItem } from 'bento-common/components/EmojiList';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import Text from 'system/Text';
import AddBlockedAccountButton from './components/AddBlockedAccountButton';
import * as ManageBlockedAccountMutation from 'mutations/ManageBlockedAccount';
import BlockedAccountsQuery from 'queries/BlockedAccountsQuery';
import { BlockedAccountsQuery as BlockedAccountQueriesType } from 'relay-types/BlockedAccountsQuery.graphql';
import Link from 'system/Link';
import DataTable from 'components/DataTable';
import useToggleState from 'hooks/useToggleState';
import ConfirmDeleteModal from 'components/ConfirmDeleteModal';
import Tooltip from 'system/Tooltip';
import TabInfoHeader from '../layout/TabInfoHeader';
import InlineLink from 'components/common/InlineLink';

type Props = {
  useCCHeader?: boolean;
};

type BlockedAccount = BlockedAccountQueriesType['response']['accounts'][number];
type FlatBlockedAccount = Pick<
  BlockedAccount,
  'blockedAt' | 'entityId' | 'name'
> & { blockedBy: string };

export default function BlockedAccountsPanel({ useCCHeader }: Props) {
  const [blockedAccounts, setBlockedAccounts] =
    useState<Array<BlockedAccount>>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const modalStates = useToggleState(['delete']);
  const toast = useToast();

  const getBlockedAccounts = useCallback(async () => {
    const res = await BlockedAccountsQuery();

    const sorted = sortBy(res.accounts, 'blockedAt').reverse();
    if (res.accounts) setBlockedAccounts(sorted);
  }, []);

  const handleSelectAccount = useCallback((accountName: string) => {
    setSelectedAccount(accountName);
    modalStates.delete.on();
  }, []);

  const handleCancelSelection = useCallback(() => {
    modalStates.delete.off();
    setSelectedAccount(null);
  }, []);

  const handleAddAccount = useCallback(async () => {
    try {
      const accountName = selectedAccount;
      await ManageBlockedAccountMutation.commit({
        accountName,
        action: 'add',
      });

      toast.closeAll();
      toast({
        title: 'Account added to block list',
        status: 'success',
      });

      getBlockedAccounts();
    } catch (e: any) {
      toast({
        title: e.message || 'Something went wrong',
        status: 'error',
      });
    }
  }, [selectedAccount]);

  const handleDeleteAccount = useCallback(async (accountName: string) => {
    try {
      await ManageBlockedAccountMutation.commit({
        accountName,
        action: 'remove',
      });

      toast.closeAll();
      toast({
        title: 'Account removed from block list',
        status: 'success',
      });

      getBlockedAccounts();
    } catch (e: any) {
      toast({
        title: e.message || 'Something went wrong',
        status: 'error',
      });
    }
  }, []);

  useEffect(() => {
    void getBlockedAccounts();
  }, []);

  /** Flattened data for simple table */
  const blockedAccountData: FlatBlockedAccount[] = useMemo(
    () =>
      blockedAccounts?.map((ba) => ({
        entityId: ba.entityId,
        name: ba.name,
        blockedBy: ba.blockedBy?.fullName ?? ba.blockedBy?.email,
        blockedAt: ba.blockedAt
          ? format(new Date(ba.blockedAt), 'yyy-MM-dd')
          : '-',
      })) ?? [],
    [blockedAccounts]
  );

  const columnHelper = createColumnHelper<FlatBlockedAccount>();
  const columns = useMemo<ColumnDef<FlatBlockedAccount>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'Account name',
        enableSorting: true,
        sortingFn: 'text',
        meta: {
          column: {
            width: '300px',
          },
        },
        cell: (props) => (
          <Link
            href={`/customers/${props.row.original.entityId}`}
            fontWeight="semibold"
            target="_blank"
          >
            {props.row.original.name}
          </Link>
        ),
      }),
      columnHelper.accessor('blockedBy', {
        header: 'Blocked by',
        enableSorting: true,
        sortingFn: 'text',
        cell: (props) =>
          props.row.original.blockedBy ?? (
            <Tooltip label="Account was blocked before data was recorded or user was deleted">
              -
            </Tooltip>
          ),
      }),
      columnHelper.accessor('blockedAt', {
        header: 'Date blocked',
        enableSorting: true,
        sortingFn: 'text',
        cell: (props) => props.row.original.blockedAt,
      }),
      columnHelper.display({
        header: 'Actions',
        cell: (props) => {
          return (
            <Link
              fontWeight="semibold"
              color="error.text"
              onClick={() => handleDeleteAccount(props.row.original.name)}
              _hover={{
                opacity: 0.8,
              }}
            >
              Remove
            </Link>
          );
        },
      }),
    ],
    [blockedAccounts]
  );

  if (!blockedAccounts)
    return <BentoLoadingSpinner h="70vh" size={TABLE_SPINNER_SIZE} />;

  return (
    <Flex flexDirection="column" gap="4">
      {useCCHeader ? (
        <TabInfoHeader title="Select accounts that receive NO guides" mb="0">
          When you block an account, any previous guides will be automatically
          removed, and no new guides can be launched to them.{' '}
          <InlineLink
            ml="1"
            href="https://help.trybento.co/en/articles/8011209-account-level-blocking"
            label="Learn more."
          />
        </TabInfoHeader>
      ) : (
        <Text>
          Blocked accounts will always be excluded from getting guides.
        </Text>
      )}
      <AddBlockedAccountButton
        mt="2"
        handleAddBlockedAccount={handleSelectAccount}
      />
      <Box w="3xl">
        <DataTable<FlatBlockedAccount>
          columns={columns}
          data={blockedAccountData}
          emptyState={{ text: 'You have no blocked accounts' }}
          useAutoSort
        />
      </Box>
      <ConfirmDeleteModal
        isOpen={modalStates.delete.isOn}
        onClose={handleCancelSelection}
        onDelete={handleAddAccount}
        entityName={null}
        header="Block account"
        confirmButtomLabel="Block"
      >
        <Flex flexDirection="column">
          <Text>You're about to block {selectedAccount}</Text>
          <EmojiList>
            <EmojiListItem emoji="🗑️">
              If the account has any guides, they will be removed
            </EmojiListItem>
            <EmojiListItem emoji="🚫">
              They will not get any new guides
            </EmojiListItem>
            <EmojiListItem emoji="⏳">
              It may take a few minutes for removed guides to stop showing to
              existing users.
            </EmojiListItem>
            <EmojiListItem emoji="📊">
              This will also remove any related guide analytics.
            </EmojiListItem>
          </EmojiList>
        </Flex>
      </ConfirmDeleteModal>
    </Flex>
  );
}
