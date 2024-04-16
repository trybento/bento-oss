import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Flex, HStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import {
  CellProps,
  TableOptions,
  TableState,
  useSortBy,
  useTable,
} from 'react-table';
import { formatDistanceToNowStrict } from 'date-fns';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { GuideFormFactor, GuideBaseState } from 'bento-common/types';
import { guidePrivateOrPublicNameOrFallback } from 'bento-common/utils/naming';
import { isAnnouncementGuide } from 'bento-common/utils/formFactor';

import useToast from 'hooks/useToast';
import H2 from 'system/H2';
import Box from 'system/Box';
import Link from 'system/Link';
import TopBreadcrumbs from '../../common/Breadcrumbs';
import CustomerGuideBasesQuery from 'queries/CustomerGuideBasesQuery';
import { CustomerGuideBasesQuery$data } from 'relay-types/CustomerGuideBasesQuery.graphql';
import GuideBaseOverflowMenuButton from 'components/ActiveGuides/ActiveGuidesTable/GuideBaseOverflowMenuButton';
import {
  getGuideNotifications,
  getMultiSortFormatted,
  GuideComponentColumn,
  ScopeColumn,
  SCOPE_COL_WIDTH,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import TableRenderer, {
  ACTION_MENU_COL_ID,
  TableTextCell,
} from 'components/TableRenderer';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';
import MessagesPopover from 'system/MessagesPopover';
import MultiButton, { MenuOption } from 'system/MultiButton';
import * as ResetGuideBasesForAccount from 'mutations/ResetGuideBasesForAccount';
import DeleteGuideBasesForAccount from 'mutations/DeleteGuideBasesForAccount';
import ConfirmDeleteModal from 'components/ConfirmDeleteModal';
import useToggleState from 'hooks/useToggleState';
import ResetGuideBasesModal from './ResetGuideBasesModal';
import H4 from 'system/H4';
import useSelectedAudience from 'hooks/useSelectedAudience';
import TemplateDetailsPopover from 'components/common/TemplateDetailsPopover';
import { EmojiList, EmojiListItem } from 'bento-common/components/EmojiList';
import { useGuideResetToast } from 'components/GuideResetToast';

type Props = {
  accountEntityId: string;
};

type GuideBases = CustomerGuideBasesQuery$data['account']['guideBases'];
type GuideBase = GuideBases[number];

type CustomerGuidesTableProps = {
  account: CustomerGuideBasesQuery$data['account'];
  guideBases: GuideBases;
  onRefetch?: () => void;
};

function CustomerGuidesTable({
  account,
  guideBases,
  onRefetch,
}: CustomerGuidesTableProps) {
  const enabledPrivateNames = useInternalGuideNames();
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const data = useMemo(() => guideBases || [], [guideBases]) as object[];
  const { audiences, branchingQuestions } = useSelectedAudience();

  const handleDeleteStart = useCallback(() => {
    setIsActionLoading(true);
  }, []);

  const handleDeleted = useCallback(() => {
    setIsActionLoading(false);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: ' ',
        id: ACTION_MENU_COL_ID,
        Cell: (cellData: CellProps<GuideBase>) => {
          const guideBase = cellData.row?.original;

          if (guideBase.state === GuideBaseState.archived) return null;

          return (
            <GuideBaseOverflowMenuButton
              guideBase={guideBase as any /* TODO: fix */}
              onRefetch={onRefetch}
              onDeleteStart={handleDeleteStart}
              onDeleted={handleDeleted}
              showViewTemplate
            />
          );
        },
      },
      {
        Header: 'Guides',
        id: 'guides',
        accessor: 'createdFromTemplate.name',
        Cell: (cellData: CellProps<GuideBase>) => {
          const guideBase = cellData.row.original!;
          const linkUrl = `/guide-bases/${guideBase.entityId}`;
          const notifications = getGuideNotifications(guideBase);

          return (
            <TemplateDetailsPopover
              templateEntityId={guideBase.createdFromTemplate.entityId}
              branchingQuestions={branchingQuestions}
              audiences={audiences}
            >
              <Box display="flex" alignItems="center" whiteSpace="normal">
                <NextLink href={linkUrl} passHref>
                  <Link fontWeight="semibold">
                    {guidePrivateOrPublicNameOrFallback(
                      enabledPrivateNames,
                      guideBase.createdFromTemplate
                    )}
                  </Link>
                </NextLink>
                <MessagesPopover notifications={notifications} ml="1" />
              </Box>
            </TemplateDetailsPopover>
          );
        },
      },
      ScopeColumn<GuideBase>(),
      GuideComponentColumn<GuideBase>(),
      {
        Header: 'Users seen',
        id: 'users_in_guide',
        accessor: 'participantsWhoViewedCount',
        Cell: (cellData: CellProps<GuideBase>) => (
          <TableTextCell
            display="flex"
            alignItems="center"
            style={{ justifyContent: 'center' }}
            type="number"
            text={cellData.row.original.participantsWhoViewedCount}
          />
        ),
      },
      {
        Header: 'Avg progress',
        id: 'avg_progress',
        accessor: 'averageCompletionPercentage',
        Cell: (cellData: CellProps<GuideBase>) => (
          <TableTextCell
            type="percentage"
            textAlign="center"
            text={
              isAnnouncementGuide(
                cellData.row.original.formFactor as GuideFormFactor
              )
                ? '-'
                : cellData.row.original?.averageCompletionPercentage
            }
          />
        ),
      },
      {
        Header: 'Launched',
        id: 'launched',
        accessor: 'activatedAt',
        Cell: (cellData: CellProps<GuideBase>) => {
          const activatedAt = cellData.row.original?.activatedAt as string;
          const timeAgoText = activatedAt
            ? formatDistanceToNowStrict(new Date(activatedAt), {
                addSuffix: true,
              })
            : '-';

          return timeAgoText;
        },
      },
    ],
    [guideBases, enabledPrivateNames]
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      autoResetSortBy: false,
      initialState: {
        sortBy: getMultiSortFormatted(TableType.guides),
      } as Partial<TableState>,
    } as TableOptions<object>,
    useSortBy
  );

  return (
    <TableRenderer
      type={TableType.guides}
      tableInstance={tableInstance}
      showLoadingOverlay={isActionLoading}
      centeredCols={['avg_progress', 'users_in_guide']}
      gridTemplateColumns={`
        minmax(255px, 1.7fr)
				${SCOPE_COL_WIDTH}
				minmax(155px, 0.6fr)
        minmax(105px, 0.9fr)
        minmax(125px, 0.9fr)
        minmax(160px, 0.9fr)
      `}
      h="full"
      placeholder={{
        text: !account ? 'This account is archived.' : 'No data (yet!)',
      }}
    />
  );
}

export default function CustomerGuides({ accountEntityId }: Props) {
  const toast = useToast();
  const router = useRouter();
  const { trigger } = useGuideResetToast();

  const [guideBases, setGuideBases] = useState<GuideBases>([]);
  const [account, setAccount] =
    useState<CustomerGuideBasesQuery$data['account']>();

  const modalStates = useToggleState(['reset', 'delete']);

  const deleteAllGuideBases = useCallback(async () => {
    try {
      await DeleteGuideBasesForAccount({ accountEntityId });
      window.location.reload();
    } catch (e) {
      toast({
        title: e.message || 'Something went wrong',
        isClosable: true,
        status: 'error',
      });
    }
  }, [accountEntityId]);

  const handleResetGuideBases = React.useCallback(async () => {
    modalStates.reset.off();

    try {
      await ResetGuideBasesForAccount.commit({
        accountEntityId,
      });

      trigger('account', [accountEntityId]);
    } catch (error) {
      const message =
        (Array.isArray(error) ? error[0].message : undefined) ||
        'Something went wrong';

      toast({
        title: message,
        isClosable: true,
        status: 'error',
      });
    }
  }, [accountEntityId]);

  const getGuideBases = useCallback(async () => {
    if (!accountEntityId) return;

    const res = await CustomerGuideBasesQuery({ entityId: accountEntityId });

    if (res.account.guideBases)
      setGuideBases(
        res.account.guideBases.filter(
          (gb) => gb.state !== GuideBaseState.archived
        )
      );
    if (res.account) setAccount(res.account);
  }, [accountEntityId]);

  useEffect(() => {
    void getGuideBases();
  }, [accountEntityId]);

  const handleAddGuide = useCallback(
    () => router.push(`/accounts/create/${accountEntityId}`),
    [accountEntityId]
  );

  const guideActions = useMemo(() => {
    const menu: MenuOption[] = [
      { label: 'Add guide', onClick: handleAddGuide },
    ];

    if (!account?.archived)
      menu.push({ label: 'Reset all', onClick: modalStates.reset.on });

    if (!account?.archived)
      menu.push({
        label: 'Remove all',
        onClick: modalStates.delete.on,
        style: { color: 'bento.errorText', borderTop: '1px solid #d9d9d9' },
      });

    return menu;
  }, [handleAddGuide]);

  const handleTroubleshoot = useCallback(
    () => router.push('/command-center?tab=troubleshoot&ref=account'),
    []
  );

  if (!account) return null;

  return (
    <Flex flexDirection="column" flex="1">
      <Head>
        <title>{account?.name || 'Customers'} | Bento</title>
      </Head>
      <TopBreadcrumbs
        trail={[
          {
            label: 'Customers',
            path: '/customers',
          },
          {
            label: account?.name || '',
            path: `/customers/${accountEntityId}`,
          },
          {
            label: 'Guides',
          },
        ]}
      />
      <Flex flexDirection="column">
        <H2 mt="1">{account?.name}</H2>
      </Flex>
      <Flex mt="6" alignItems="center" justifyContent="space-between">
        <H4>Guides</H4>
        <HStack gap="4">
          <Button variant="secondary" onClick={handleTroubleshoot}>
            Troubleshoot
          </Button>
          <MultiButton
            zIndex="5"
            options={guideActions}
            isDisabled={account?.archived}
          />
        </HStack>
      </Flex>
      <Box pt={4}>
        <CustomerGuidesTable
          guideBases={guideBases}
          account={account}
          onRefetch={getGuideBases}
        />
      </Box>
      <ResetGuideBasesModal
        accountEntityId={accountEntityId}
        onConfirm={handleResetGuideBases}
        onClose={modalStates.reset.off}
        isOpen={modalStates.reset.isOn}
      />

      <ConfirmDeleteModal
        isOpen={modalStates.delete.isOn}
        onClose={modalStates.delete.off}
        onDelete={deleteAllGuideBases}
        entityName={`All guide bases for ${account?.name}`}
        header="Delete all guide bases"
      >
        <EmojiList>
          <EmojiListItem emoji="⏳">
            It may take a few minutes for deleted guides to stop showing to
            existing users.
          </EmojiListItem>
          <EmojiListItem emoji="📊">
            This will also remove any related guide analytics.
          </EmojiListItem>
          <EmojiListItem emoji="✈️">
            All auto-launched guides will be relaunched when the account signs
            in again.
          </EmojiListItem>
        </EmojiList>
      </ConfirmDeleteModal>
    </Flex>
  );
}
