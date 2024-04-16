import { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Box,
  Flex,
  Checkbox,
  Text,
  Spinner,
  BoxProps,
} from '@chakra-ui/react';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useInView } from 'react-intersection-observer';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  createColumnHelper,
  getSortedRowModel,
} from '@tanstack/react-table';
import BentoSpinner from 'icons/BentoSpinner';

export interface TableSortingState {
  id: string;
  desc: boolean;
}

interface EmptyStateProps {
  text?: string;
  component?: React.ReactNode;
}

const EmptyState: React.FC<{ emptyState?: EmptyStateProps | undefined }> = ({
  emptyState,
}) => {
  return (
    <Flex
      flexDir="column"
      gap={2}
      px={8}
      py={32}
      alignItems="center"
      bg="gray.50"
      as="tbody"
    >
      {emptyState?.component ? (
        emptyState.component
      ) : (
        <Text fontSize="md" as="tr">
          <Text as="td">{emptyState?.text || 'Nothing to see here (yet)'}</Text>
        </Text>
      )}
    </Flex>
  );
};

const LoadingState: React.FC = () => {
  return (
    <Flex flexDir="column" gap={2} px={8} py={32} alignItems="center">
      <BentoSpinner />
    </Flex>
  );
};

interface Props<T extends { entityId: string }> {
  data: T[];
  emptyState?: EmptyStateProps;
  columns: ColumnDef<T, any>[];
  selection?: {
    selected: string[];
    onSelect: (entity: T, selected: boolean) => void;
    onSelectAll: (selected: boolean) => void;
  };
  loading?: boolean;
  sorting?: {
    state: TableSortingState;
    onSortingChanged: (sorting: { id: string; desc: boolean } | null) => void;
  };
  pagination?: {
    fetchNextPage: (count: number) => any;
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    rowsPerPage: number;
  };
  /**
   * If using auto-sort make sure column definitions
   * include a sortingFn specified
   */
  useAutoSort?: boolean;
  defaultSort?: TableSortingState;

  boxProps?: BoxProps;
}

function DataTable<T extends { entityId: string }>({
  data,
  emptyState,
  columns,
  selection,
  loading,
  sorting,
  pagination,
  useAutoSort,
  defaultSort,
  boxProps = {},
}: Props<T>) {
  const { ref: paginationRef, inView } = useInView();
  const columnHelper = createColumnHelper<T>();
  const [selectVisible, setSelectVisible] = useState(false);
  const [sortingState, setSortingState] = useState<SortingState | undefined>(
    sorting ? [sorting.state] : defaultSort ? [defaultSort] : undefined
  );
  const isEmpty = useMemo(() => data.length === 0, [data]);
  const isAllSelected = useMemo(
    () =>
      selection &&
      !data.some(({ entityId }) => !selection.selected.includes(entityId)),
    [data, selection]
  );

  useEffect(() => {
    if (inView && pagination) {
      pagination.fetchNextPage(pagination.rowsPerPage);
    }
  }, [inView]);

  const parsedColumns = useMemo<ColumnDef<T, any>[]>(
    () => [
      ...(selection
        ? [
            columnHelper.display({
              id: 'select',
              header: () => {
                return (
                  <Checkbox
                    isChecked={isAllSelected}
                    onChange={(e) => selection.onSelectAll(e.target.checked)}
                    visibility={
                      selectVisible || selection.selected.length > 0
                        ? 'visible'
                        : 'hidden'
                    }
                  />
                );
              },
              meta: {
                column: {
                  width: '54px',
                },
                header: {
                  onMouseEnter: () => setSelectVisible(true),
                  onMouseLeave: () => setSelectVisible(false),
                },
                cell: {
                  onMouseEnter: () => setSelectVisible(true),
                  onMouseLeave: () => setSelectVisible(false),
                },
              },
              cell: (props) => {
                const entity = props.row.original;
                const { entityId } = entity;

                return (
                  <Checkbox
                    isChecked={selection.selected.includes(entityId)}
                    onChange={(e) =>
                      selection.onSelect(entity, e.target.checked)
                    }
                    visibility={
                      selectVisible || selection.selected.length > 0
                        ? 'visible'
                        : 'hidden'
                    }
                  />
                );
              },
            }),
          ]
        : []),
      ...columns,
    ],
    [columns, selectVisible, selection, isAllSelected]
  );

  useEffect(() => {
    if (sorting) {
      const [firstColumn] = sortingState;

      if (firstColumn) {
        const { id, desc } = firstColumn;

        sorting.onSortingChanged({ id, desc });
      } else {
        sorting.onSortingChanged(null);
      }
    }
  }, [sortingState]);

  const table = useReactTable({
    data,
    columns: parsedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: useAutoSort ? getSortedRowModel() : undefined,
    onSortingChange: setSortingState,
    state: {
      sorting: useAutoSort
        ? sortingState
        : sorting
        ? [sorting.state]
        : undefined,
    },
    manualSorting: !useAutoSort,
    enableSorting: useAutoSort || undefined,
  });

  return (
    <Box
      borderStyle="solid"
      borderWidth="1px"
      borderColor="bento.border"
      borderRadius="lg"
      overflowX="auto"
      {...boxProps}
    >
      <Table layout="fixed">
        {loading && <LoadingState />}
        {!loading && isEmpty && <EmptyState emptyState={emptyState} />}
        {!loading && !isEmpty && (
          <>
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id} h="64px">
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta;

                    return (
                      <Th
                        key={header.id}
                        onMouseEnter={meta?.header?.onMouseEnter}
                        onMouseLeave={meta?.header?.onMouseLeave}
                        onClick={header.column.getToggleSortingHandler()}
                        width={meta?.column?.width}
                        textTransform="none"
                        fontWeight="normal"
                        fontSize="sm"
                        letterSpacing="normal"
                        padding={meta?.header?.padding}
                      >
                        <Flex
                          gap={1}
                          alignItems="center"
                          color="gray.500"
                          cursor={
                            header.column.getCanSort() ? 'pointer' : undefined
                          }
                          whiteSpace={meta?.header?.whiteSpace}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <chakra.span>
                            {header.column.getIsSorted() ? (
                              header.column.getIsSorted() === 'desc' ? (
                                <ArrowDropDownIcon />
                              ) : (
                                <ArrowDropUpIcon />
                              )
                            ) : null}
                          </chakra.span>
                        </Flex>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id} className="data-table-renderer-row">
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;

                    return (
                      <Td
                        key={cell.id}
                        onMouseEnter={meta?.cell?.onMouseEnter}
                        onMouseLeave={meta?.cell?.onMouseLeave}
                        fontSize="xs"
                        verticalAlign={meta?.cell?.verticalAlign}
                        padding={meta?.cell?.padding}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              ))}
              {pagination && pagination.hasNextPage && (
                <Tr>
                  <Td colSpan={parsedColumns.length}>
                    <Flex ref={paginationRef} justifyContent="center">
                      <Spinner />
                    </Flex>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </>
        )}
      </Table>
    </Box>
  );
}

export default DataTable;
