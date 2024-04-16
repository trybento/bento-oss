import React, {
  forwardRef,
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  HeaderGroup,
  HeaderPropGetter,
  SortingRule,
  TableInstance,
  TableState,
} from 'react-table';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import Box from 'system/Box';
import Text from 'system/Text';
import EmptyTablePlaceholder, {
  EmptyTablePlaceholderProps,
} from 'components/EmptyTablePlaceholder/EmptyTablePlaceholder';
import IntersectionObserver from 'components/IntersectionObserver';
import { BoxProps, Spinner } from '@chakra-ui/react';
import { LoadMoreFn } from 'react-relay/hooks';
import { px } from 'bento-common/utils/dom';
import { hasKey } from 'bento-common/data/helpers';
import BentoSpinner from 'icons/BentoSpinner';
import { Timeout } from 'bento-common/types';
import colors from 'helpers/colors';
import { actionMenuWidthPx } from 'bento-common/utils/constants';

export const ACTION_MENU_COL_ID = 'actionMenu';
export const ACTION_MENU_COL_ID_PADDED = 'actionMenuPadded';
const EMPTY_HEADER_COL_ID = 'noop';

const actionMenuPaddingXPx = 8;
const actionMenuPaddingX = px(actionMenuPaddingXPx);

const columnWidths = {
  actionMenu: px(actionMenuWidthPx + 2 * actionMenuPaddingXPx),
  actionMenuPadded: '55px',
  noop: '30px',
};

export type TableRendererBoxProps = Omit<
  BoxProps,
  'placeholder' | 'gridTemplateColumns'
>;

export type TableRendererOrderDirectionType = 'asc' | 'desc';
export const emptyHeader = {
  Header: ' ',
  id: EMPTY_HEADER_COL_ID,
  Cell: () => <div />,
};

enum TableClasses {
  table = 'table-renderer',
  tableWithMenu = 'table-renderer-with-action-menu',
  tableWithMenuAtEnd = 'table-renderer-with-action-menu-at-end',
  row = 'table-renderer-row',
  cell = 'table-renderer-cell',
  activeCell = 'table-renderer-cell-active',
}

interface TableStateExtended extends TableState<object> {
  sortBy: { id: any; desc: boolean }[];
}
interface TableInstanceExtended extends TableInstance<object> {
  toggleSortBy: any;
  state: TableStateExtended;
  setSortBy: (sortBy: Array<SortingRule<any>>) => void;
}

export interface TableRendererObserverProps {
  hasMore: boolean;
  callback: LoadMoreFn<any>;
}

/** Record<primary, secondary> */
export type MultiSortColumns = Record<
  string,
  {
    id: string;
    /** true=desc, false=asc, undefined=unsorted */
    forcedDesc?: boolean;
  }
>;

/**
 * Used for heavy pages, like Customers.
 */
export const REDUCED_TABLE_ROWS_PER_PAGE = 10;
/**
 * Default value for all tables.
 */
export const TABLE_ROWS_PER_PAGE = 20;

const toggleDesc = (current: boolean | undefined) =>
  current === undefined ? false : current === false ? true : undefined;

export interface TableRendererProps {
  id?: string;
  observerProps?: TableRendererObserverProps;
  tableInstance: TableInstance;
  gridTemplateColumns: string;
  handleSorting?: (
    columnId: string | null | undefined,
    descending: boolean,
    tableType?: string
  ) => void;
  type: string;
  multiSortColumns?: MultiSortColumns;
  cellsFontSize?: BoxProps['fontSize'];
  centeredCols?: string[];
  placeholder?: EmptyTablePlaceholderProps;
  showLoadingOverlay?: boolean;
  cellPaddingX?: BoxProps['px'];
  cellEndPadding?: BoxProps['pr'];
  headerBoxProps?: BoxProps;
}

interface HeaderGroupExtended extends HeaderGroup<object> {
  getSortByToggleProps: () => HeaderPropGetter<object>;
  isSorted: boolean;
  isSortedDesc: boolean;
  canSort?: boolean;
}

export default function TableRenderer({
  id,
  observerProps,
  tableInstance,
  multiSortColumns = {},
  showLoadingOverlay,
  cellPaddingX = '8px',
  gridTemplateColumns,
  cellsFontSize = 'xs',
  handleSorting,
  type,
  cellEndPadding,
  centeredCols = [],
  placeholder,
  headerBoxProps,
  ...boxProps
}: React.PropsWithChildren<TableRendererProps & TableRendererBoxProps>) {
  const {
    getTableProps,
    headerGroups,
    rows,
    setSortBy,
    prepareRow,
    state: { sortBy },
    toggleSortBy,
  } = tableInstance as TableInstanceExtended;

  const tableBodyRef = useRef(null);
  const [showObserver, setShowObserver] = useState<boolean>(false);

  const firstColumn = headerGroups?.[0]?.headers?.[0];
  const lastColumnIdx = (headerGroups?.[0]?.headers?.length || 1) - 1;

  const hasActionMenu =
    firstColumn?.id === ACTION_MENU_COL_ID ||
    firstColumn.id === ACTION_MENU_COL_ID_PADDED;
  const hasActionMenuAtEnd =
    headerGroups?.[0]?.headers?.[lastColumnIdx].id === ACTION_MENU_COL_ID;

  const tableClassName = hasActionMenu
    ? TableClasses.tableWithMenu
    : hasActionMenuAtEnd
    ? TableClasses.tableWithMenuAtEnd
    : TableClasses.table;

  const _gridTemplateColumns = `
    ${columnWidths[firstColumn?.id || ''] || ''}
    ${gridTemplateColumns}
  `;
  const observerTimeoutRef = useRef<Timeout>();

  useEffect(() => {
    if (showObserver) setShowObserver(false);
    // Wait until we have data to check pagination.
    if (rows?.length) {
      clearTimeout(observerTimeoutRef.current);
      observerTimeoutRef.current = setTimeout(() => {
        setShowObserver(true);
      }, 500);
    }
  }, [rows?.length]);

  const scrollBarWidth = tableBodyRef.current
    ? tableBodyRef.current.offsetWidth - tableBodyRef.current.scrollWidth
    : 0;

  useEffect(() => {
    if (handleSorting) {
      const [column] = sortBy || [];
      handleSorting(column?.id, !!column?.desc, type);
    }
  }, [sortBy]);

  const gridStyles: { [key: string]: React.CSSProperties } = useMemo(
    () => ({
      container: {
        display: 'grid',
        gridTemplateColumns: _gridTemplateColumns,
      },
      cell: {
        position: 'relative',
        minHeight: '50px',
        height: 'auto',
        display: 'grid',
        borderTop: 'none',
      },
      cellContent: {
        margin: 'auto 0',
        overflowWrap: 'anywhere',
      },
    }),
    [_gridTemplateColumns]
  );

  const textAlignment = useCallback(
    (columnId) => (centeredCols.includes(columnId) ? 'center' : 'left'),
    [centeredCols]
  );

  const handleTableClicked = useCallback((e) => {
    const { target } = e;

    const activeCells = document.getElementsByClassName(
      TableClasses.activeCell
    );
    for (const activeCell of activeCells) {
      activeCell.classList.add(TableClasses.cell);
      activeCell.classList.remove(TableClasses.activeCell);
    }

    if (target.id.includes('menu-button')) {
      const cell = target.closest(`.${TableClasses.cell}`);
      cell?.classList?.add(TableClasses.activeCell);
      cell?.classList?.remove(TableClasses.cell);
    }
  }, []);

  const handleHeaderClick = useCallback(
    (column: HeaderGroupExtended) => (e: MouseEvent<HTMLDivElement>) => {
      e.persist();
      const secondarySort = multiSortColumns[column.id];
      const newDesc = toggleDesc(column.isSortedDesc);
      if (secondarySort) {
        sortBy.some((sort) => {
          const shouldReset =
            sort.id !== column.id && sort.id !== secondarySort.id;
          if (shouldReset) {
            setSortBy([]);
          }
          return shouldReset;
        });
      }
      if (newDesc === undefined) {
        setSortBy([]);
      } else {
        toggleSortBy(column.id, newDesc, !!secondarySort);
        if (secondarySort) {
          toggleSortBy(
            secondarySort.id,
            hasKey(secondarySort, 'forcedDesc')
              ? secondarySort.forcedDesc
              : newDesc,
            true
          );
        }
      }
    },
    [sortBy, setSortBy]
  );

  return (
    <Box
      id={id}
      position="relative"
      display="grid"
      gridTemplateRows="60px auto"
      minH="300px"
      border="1px solid #E2E8F0"
      borderRadius="lg"
      className={tableClassName}
      onClick={handleTableClicked}
      overflowX="auto"
      {...boxProps}
    >
      <Box
        style={gridStyles.container}
        {...getTableProps()}
        pr={`${scrollBarWidth}px`}
        shadow="0px 2px 4px rgb(0 0 0 / 6%)"
        position="sticky"
        top="0px"
        bg="white"
        zIndex="2"
        {...headerBoxProps}
      >
        {headerGroups.map((headerGroup) => {
          return headerGroup.headers.map(
            (column: HeaderGroupExtended, columnIdx: number) => (
              <Box
                {...column.getHeaderProps(column.getSortByToggleProps())}
                onClick={handleHeaderClick(column)}
                key={`header${columnIdx}`}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  userSelect="none"
                  pl={
                    columnIdx === 0 && hasActionMenu
                      ? actionMenuPaddingX
                      : columnIdx === 1 && hasActionMenu
                      ? 0
                      : cellPaddingX
                  }
                  pr={
                    columnIdx === lastColumnIdx
                      ? cellEndPadding ?? ['35px', '35px', '48px', '48px']
                      : cellPaddingX
                  }
                  py="5px"
                  minH="60px"
                  h="auto"
                  style={{
                    justifyContent: textAlignment(column.id),
                    textAlign: textAlignment(column.id),
                  }}
                >
                  <Box mb="0.4em">
                    <Text size="sm" fontWeight="normal" color="gray.500">
                      {column.render('Header') as React.ReactNode}
                    </Text>
                  </Box>
                  <Box>
                    {column.isSorted && column.canSort !== false && (
                      <ArrowDropDown
                        style={{
                          width: '24px',
                          color: colors.gray[500],
                          transform: `rotate(${
                            column.isSortedDesc ? '0' : '180'
                          }deg)`,
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            )
          );
        })}
      </Box>
      {/* Chakra tooltips interfere with overflow-y */}
      {/* There is a bug where tooltips get hung. */}
      <Box display="grid" gridAutoRows="max-content" ref={tableBodyRef}>
        <Box display="grid" h="full">
          {rows.length ? (
            rows.map((row, rowIdx) => {
              prepareRow(row);
              return (
                <Box
                  className={TableClasses.row}
                  display="grid"
                  borderTop={rowIdx ? '1px solid #EDF2F7' : 'none'}
                  style={{
                    gridTemplateColumns:
                      gridStyles.container.gridTemplateColumns,
                  }}
                  key={`row${rowIdx}`}
                >
                  {row.cells.map((cell, columnIdx) => {
                    return (
                      <Box
                        {...cell.getCellProps()}
                        style={gridStyles.cell}
                        className={TableClasses.cell}
                      >
                        <Box
                          style={gridStyles.cellContent}
                          textAlign={textAlignment(cell.column.id)}
                          fontSize={cellsFontSize}
                          pl={
                            hasActionMenu && columnIdx === 0
                              ? actionMenuPaddingX
                              : columnIdx === 1 && hasActionMenu
                              ? 0
                              : cellPaddingX
                          }
                          pr={
                            hasActionMenu && columnIdx === 0
                              ? actionMenuPaddingX
                              : columnIdx === lastColumnIdx
                              ? cellEndPadding ?? [
                                  '35px',
                                  '35px',
                                  '40px',
                                  '40px',
                                ]
                              : cellPaddingX
                          }
                          py={['2px', '2px', '10px', '10px']}
                          isTruncated
                        >
                          {cell.render('Cell') as React.ReactNode}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              );
            })
          ) : (
            <EmptyTablePlaceholder {...placeholder} />
          )}
        </Box>
        {observerProps?.hasMore && showObserver && (
          <>
            <IntersectionObserver
              onInView={observerProps.callback as unknown as () => void}
            />
            <Box
              mt={2}
              width="100%"
              height="40px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Spinner />
            </Box>
          </>
        )}
      </Box>
      <Box
        position="absolute"
        h="full"
        w="full"
        bg="#FFFFFF88"
        opacity={showLoadingOverlay ? '1' : '0'}
        zIndex={showLoadingOverlay ? 0 : -1}
        transition="opacity .218s"
        style={{
          transitionDelay: '0, .3s',
          transitionProperty: 'opacity, z-index',
        }}
      >
        <BentoLoadingSpinner />
      </Box>
    </Box>
  );
}

export function TableLoadingSpinner() {
  return (
    <Box w="full" h="100%" display="flex">
      <Box margin="auto">
        <Spinner pos="relative" top="35%" color="gray.500" size="lg" />
      </Box>
    </Box>
  );
}

type BentoLoadingSpinnerProps = {
  alternate?: boolean;
  size?: number;
} & BoxProps;

export function BentoLoadingSpinner({
  alternate,
  size,
  ...boxProps
}: BentoLoadingSpinnerProps) {
  return (
    <Box w="full" h="100%" display="flex" {...boxProps}>
      <Box margin="auto">
        <BentoSpinner alternate={alternate} size={size} />
      </Box>
    </Box>
  );
}

export const TableTextCell = memo(
  forwardRef(
    (
      props: BoxProps & {
        text: string | number | null;
        type: 'number' | 'percentage' | 'primaryText';
      },
      ref
    ) => {
      const { type, text, ...restProps } = props;
      const typeStyles: BoxProps = {
        fontWeight: type === 'primaryText' ? 'semibold' : 'normal',
      };

      const _text =
        type === 'percentage' && !Number.isNaN(Number(text))
          ? `${Math.trunc(Number(text))}%`
          : text;

      return (
        <Box
          {...restProps}
          {...typeStyles}
          ref={ref as React.LegacyRef<HTMLDivElement>}
        >
          {_text}
        </Box>
      );
    }
  )
);
