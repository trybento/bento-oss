import React, { useCallback, useMemo } from 'react';
import { graphql } from 'react-relay';
import {
  useTable,
  useSortBy,
  CellProps,
  TableState,
  Row,
  TableOptions,
} from 'react-table';
import NextLink from 'next/link';

import { capitalizeFirstLetter } from 'bento-common/utils/strings';
import { EMPTY_GUIDE_NAME } from 'bento-common/utils/naming';
import { moduleNameOrFallback } from 'bento-common/utils/naming';

import useToast from 'hooks/useToast';
import Link from 'system/Link';
import Box from 'system/Box';
import ModuleOverflowMenuButton from './ModuleOverflowMenuButton';
import QueryRenderer from 'components/QueryRenderer';
import { LibraryModulesQuery } from 'relay-types/LibraryModulesQuery.graphql';
import InformationTags from '../InformationTags';
import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';
import * as DuplicateModuleMutation from 'mutations/DuplicateModule';
import TableRenderer, {
  ACTION_MENU_COL_ID,
  BentoLoadingSpinner,
} from 'components/TableRenderer';
import { MODULE_ALIAS_SINGULAR, TABLE_SPINNER_SIZE } from 'helpers/constants';
import BranchingIcon from 'components/common/BranchingIcon';
import {
  DescriptionColumn,
  getMultiSortFormatted,
  LastEditedAtColumn,
  LastEditedByColumn,
  DistanceToNowColumn,
  NAME_COL_WIDTH,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import DynamicIcon from 'system/DynamicIcon';

type LibraryModulesQueryResponse = LibraryModulesQuery['response'];

const MODULES_HELP_URL =
  'https://help.trybento.co/en/articles/6123117-step-groups-previously-known-as-modules';

interface Props extends LibraryModulesQueryResponse {
  onRefetch: () => void;
}

type Module = LibraryModulesQuery['response']['modules'][number];

function LibraryModules({ onRefetch, modules }: Props) {
  const toast = useToast();

  const onDuplicate = useCallback(async (module: Module) => {
    try {
      const result = await DuplicateModuleMutation.commit({
        entityId: module.entityId,
      });

      if (!result) {
        throw new Error('Something went wrong');
      }

      onRefetch && onRefetch();

      const moduleName = moduleNameOrFallback(module);

      toast({
        title: `${capitalizeFirstLetter(
          MODULE_ALIAS_SINGULAR
        )} "${moduleName}" duplicated!`,
        isClosable: true,
        status: 'success',
      });
    } catch (err) {
      toast({
        title: err.message || 'Something went wrong',
        isClosable: true,
        status: 'error',
      });
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: ' ',
        id: ACTION_MENU_COL_ID,
        Cell: (cellData: CellProps<Module>) => {
          const module = cellData.row.original;
          return (
            <ModuleOverflowMenuButton
              onRefetch={onRefetch}
              module={module}
              onDuplicate={() => onDuplicate(module)}
            />
          );
        },
      },
      {
        Header: 'Name',
        accessor: (row: Module) => moduleNameOrFallback(row),
        Cell: ({ value, row }: CellProps<Module>) => {
          const entityId = row.original.entityId;

          return (
            <NextLink href={`/library/step-groups/${entityId}`} passHref>
              <Link fontWeight="semibold" display="flex">
                {value}
                {row.original.hasBranchingStep && <BranchingIcon />}
              </Link>
            </NextLink>
          );
        },
      },
      DescriptionColumn<Module>(),
      {
        Header: 'Guides',
        id: 'guides',
        sortType: (rowA: Row<Module>, rowB: Row<Module>) => {
          const [lengthA, lengthB] = [rowA, rowB].map((row) => {
            const module = row.original;
            return module.templates.length + module.dynamicTemplates.length;
          });

          return lengthA < lengthB ? -1 : 1;
        },
        Cell: (cellData: CellProps<Module>) => {
          const module = cellData.row.original;
          const templates = module.templates;
          const dynamicTemplates = module.dynamicTemplates as any[];

          return (
            <>
              <InformationTags
                elements={templates as any[]}
                labelKeys={['displayTitle', 'name']}
                fallbackText={EMPTY_GUIDE_NAME}
              />
              <InformationTags
                elements={dynamicTemplates as any[]}
                labelKeys={['displayTitle', 'name']}
                fallbackText={EMPTY_GUIDE_NAME}
                decorator={(_) => (
                  <DynamicIcon
                    style={{ marginRight: '2px', marginBottom: '-4px' }}
                  />
                )}
              />
            </>
          );
        },
      },
      LastEditedByColumn<Module>(),
      LastEditedAtColumn<Module>(),
      DistanceToNowColumn<Module>('lastUsedAt', 'Last launched'),
    ],
    [onRefetch, onDuplicate]
  );

  const tableInstance = useTable(
    {
      columns,
      data: modules as any,
      autoResetSortBy: false,
      initialState: {
        sortBy: getMultiSortFormatted(TableType.libraryModules),
      } as Partial<TableState>,
    } as TableOptions<object>,
    useSortBy
  );

  return (
    <>
      <Box display="flex" pb="6">
        <CalloutText calloutType={CalloutTypes.Warning}>
          Step groups allow you to reuse the same steps across multiple guides.
          Deleting or modifying them will impact all guides that use the same
          group. Learn more{' '}
          <Link href={MODULES_HELP_URL} color="blue.500">
            here
          </Link>
          .
        </CalloutText>
      </Box>
      <TableRenderer
        id="library-modules-table"
        type={TableType.libraryModules}
        tableInstance={tableInstance}
        gridTemplateColumns={`
          ${NAME_COL_WIDTH}
          260px
					400px
          160px
          160px
          200px
				`}
      />
    </>
  );
}

export const LIBRARY_MODULES_QUERY = graphql`
  query LibraryModulesQuery {
    modules {
      entityId
      name
      displayTitle
      description
      lastEdited {
        timestamp
        user {
          fullName
          email
        }
      }
      lastUsedAt
      hasBranchingStep
      hasInputStep
      templates {
        entityId
        displayTitle
        name
      }
      dynamicTemplates {
        entityId
        displayTitle
        name
      }
    }
  }
`;

export default function LibraryModulesQueryRenderer() {
  return (
    <QueryRenderer<LibraryModulesQuery>
      query={LIBRARY_MODULES_QUERY}
      render={({ props, retry }) =>
        props ? (
          <LibraryModules {...props} onRefetch={retry} />
        ) : (
          <Box h="90%">
            <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} />
          </Box>
        )
      }
    />
  );
}
