import React, { useMemo } from 'react';
import {
  CellProps,
  TableOptions,
  TableState,
  useSortBy,
  useTable,
} from 'react-table';
import NextLink from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';

import Box from 'system/Box';
import Link from 'system/Link';
import { AccountUserQuery$data } from 'relay-types/AccountUserQuery.graphql';
import {
  getMultiSortFormatted,
  GuideComponentColumn,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import TableRenderer, { emptyHeader } from 'components/TableRenderer';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';
import { guidePrivateOrPublicNameOrFallback } from 'bento-common/utils/naming';
import TemplateDetailsPopover from 'components/common/TemplateDetailsPopover';
import useSelectedAudience from 'hooks/useSelectedAudience';

type Props = {
  accountUserEntityId: string;
  guides: AccountUserQuery$data['guides'];
};

type Guide = Props['guides'][number] & { isAutoLaunchEnabled?: boolean };

export default function CustomerUserGuides({ guides }: Props) {
  const enabledPrivateNames = useInternalGuideNames();
  const { audiences, branchingQuestions } = useSelectedAudience();

  const data = useMemo(
    () =>
      guides?.map((g) => ({
        ...g,
        isAutoLaunchEnabled: g.createdFromGuideBase.wasAutoLaunched,
      })) || [],
    [guides]
  ) as object[];

  const columns = useMemo(
    () => [
      emptyHeader,
      {
        Header: 'Name',
        id: 'guides',
        accessor: 'createdFromTemplate.name',
        Cell: (cellData: CellProps<Guide>) => {
          const guide = cellData.row.original!;
          const guideBase = guide.createdFromGuideBase;
          const linkUrl = `/guide-bases/${guideBase.entityId}`;

          return (
            <TemplateDetailsPopover
              templateEntityId={guide.createdFromTemplate.entityId}
              audiences={audiences}
              branchingQuestions={branchingQuestions}
            >
              <Box display="flex" alignItems="center" whiteSpace="normal">
                <NextLink href={linkUrl} passHref>
                  <Link fontWeight="semibold">
                    {guidePrivateOrPublicNameOrFallback(
                      enabledPrivateNames,
                      guide.createdFromTemplate
                    )}
                  </Link>
                </NextLink>
              </Box>
            </TemplateDetailsPopover>
          );
        },
      },
      GuideComponentColumn<Guide>(),
      {
        Header: 'Viewed at',
        id: 'viewedAt',
        accessor: 'lastActiveAt',
        Cell: (cellData: CellProps<Guide>) => {
          const lastActiveAt = cellData.row.original?.lastActiveAt as string;
          const timeAgoText = lastActiveAt ? (
            formatDistanceToNowStrict(new Date(lastActiveAt), {
              addSuffix: true,
            })
          ) : (
            <i>Not viewed yet</i>
          );

          return timeAgoText;
        },
      },
      {
        Header: 'Progress',
        id: 'completionPercentage',
        accessor: 'completionPercentage',
        Cell: (cellData: CellProps<Guide>) => {
          const guide = cellData.row.original!;

          return `${guide.completionPercentage}%`;
        },
      },
      {
        Header: 'Completed or dismissed at',
        id: 'completedAt',
        accessor: 'completedAt',
        Cell: (cellData: CellProps<Guide>) => {
          const completedAt = cellData.row.original?.completedAt as string;
          const timeAgoText = completedAt ? (
            formatDistanceToNowStrict(new Date(completedAt), {
              addSuffix: true,
            })
          ) : (
            <i>N/A</i>
          );

          return timeAgoText;
        },
      },
    ],
    [guides]
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
      gridTemplateColumns={`
        minmax(255px, 1.4fr)
        180px
        minmax(120px, 0.7fr)
        minmax(120px, 0.7fr)
				minmax(220px, 1fr)
      `}
      placeholder={{
        text: 'No data (yet!)',
      }}
    />
  );
}
