import React, { useCallback, useMemo } from 'react';
import { graphql } from 'react-relay';
import NextLink from 'next/link';
import {
  useTable,
  useSortBy,
  CellProps,
  TableState,
  TableOptions,
} from 'react-table';
import useToast from 'hooks/useToast';
import Box from 'system/Box';
import { LibraryNpsQuery } from 'relay-types/LibraryNpsQuery.graphql';
import TableRenderer, {
  ACTION_MENU_COL_ID,
  BentoLoadingSpinner,
} from 'components/TableRenderer';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import {
  getMultiSortFormatted,
  DistanceToNowColumn,
  NAME_COL_WIDTH,
  TableType,
  NpsSurveyStateColumn,
} from 'components/TableRenderer/tables.helpers';
import { useFetchQuery } from 'hooks/useFetchQuery';
import { Link } from '@chakra-ui/react';
import NpsSurveyOverflowMenuButton from './NpsSurveyOverflowMenuButton';
import { NPS_SURVEY_STATUS_COL_WIDTH } from '../NpsSurveyStatus';

type LibraryNpsQueryResponse = LibraryNpsQuery['response'];

interface Props extends LibraryNpsQueryResponse {
  onRefetch: () => Promise<void>;
}

type NpsSurvey = LibraryNpsQuery['response']['npsSurveys'][number];

function LibraryNps({ onRefetch, npsSurveys }: Props) {
  const toast = useToast();

  const onNpsSurveyDeleted = useCallback((npsSurveyName: string) => {
    onRefetch();

    toast({
      title: `NPS survey "${npsSurveyName}" deleted!`,
      isClosable: true,
      status: 'success',
    });
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: ' ',
        id: ACTION_MENU_COL_ID,
        Cell: ({ row }: CellProps<NpsSurvey>) => {
          const { entityId, name } = row.original;

          return (
            <NpsSurveyOverflowMenuButton
              npsSurveyEntityId={entityId}
              npsSurveyName={name}
              onDeleted={onNpsSurveyDeleted}
            />
          );
        },
      },
      NpsSurveyStateColumn<NpsSurvey>(),
      {
        Header: 'Survey name',
        accessor: 'name',
        canSort: true,
        Cell: ({ row }: CellProps<NpsSurvey>) => {
          const { name, entityId } = row.original;

          return (
            <NextLink href={`/library/nps/${entityId}`} passHref>
              <Link fontWeight="semibold">{name}</Link>
            </NextLink>
          );
        },
      },
      {
        Header: 'Responses collected',
        accessor: 'totalAnswers',
        canSort: true,
        Cell: ({ row }: CellProps<NpsSurvey>) => {
          const { totalAnswers } = row.original;
          return totalAnswers;
        },
      },
      DistanceToNowColumn<NpsSurvey>('launchedAt', 'Last launched'),
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data: npsSurveys as any,
      autoResetSortBy: false,
      initialState: {
        sortBy: getMultiSortFormatted(TableType.libraryNps),
      } as Partial<TableState>,
    } as TableOptions<object>,
    useSortBy
  );

  return (
    <TableRenderer
      type={TableType.libraryNps}
      tableInstance={tableInstance}
      gridTemplateColumns={`
        ${NPS_SURVEY_STATUS_COL_WIDTH}
        ${NAME_COL_WIDTH}
        230px
        230px
      `}
    />
  );
}

const QUERY = graphql`
  query LibraryNpsQuery {
    npsSurveys {
      entityId
      name
      state
      launchedAt
      totalAnswers
    }
  }
`;

export default function LibraryNpsQueryRenderer() {
  const queryResponse = useFetchQuery<LibraryNpsQuery>({
    query: QUERY,
  });

  return queryResponse.data ? (
    <LibraryNps {...queryResponse.data} onRefetch={queryResponse.refetch} />
  ) : (
    <Box h="90%">
      <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} />
    </Box>
  );
}
