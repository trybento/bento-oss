import TableRenderer, {
  TableRendererBoxProps,
  TableTextCell,
} from 'components/TableRenderer';
import NextLink from 'next/link';
import React, { useMemo } from 'react';
import {
  useTable,
  useSortBy,
  CellProps,
  TableOptions,
  TableState,
} from 'react-table';
import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';
import { useTableRenderer } from 'components/TableRenderer/TableRendererProvider';
import {
  getLocationShown,
  getSortFormatted,
  GuideComponentColumn,
  NAME_COL_WIDTH,
  ScopeColumn,
  SCOPE_COL_WIDTH,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import { EmptyTablePlaceholderProps } from 'components/EmptyTablePlaceholder/EmptyTablePlaceholder';
import colors from 'helpers/colors';
import { AnalyticsDataQuery } from 'relay-types/AnalyticsDataQuery.graphql';
import { guidePrivateOrPublicNameOrFallback } from 'bento-common/utils/naming';
import { GuideDesignType, GuidePageTargetingType } from 'bento-common/types';
import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';
import { getPercentage } from 'bento-common/data/helpers';
import PopoverTip from 'system/PopoverTip';
import sortByString from 'components/utils/react-table/sortByString';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';

export interface PerformanceByGuideTableShow {
  scope?: boolean;
  accountsSeen?: boolean;
  completedAStep?: boolean;
  percentageDismissed?: boolean;
  averageStepsCompleted?: boolean;
}

type Template = AnalyticsDataQuery['response']['templates'][number];

interface PerformanceByGuideTableProps extends TableRendererBoxProps {
  templates: Template[];
  orgInlineEmbed: AnalyticsDataQuery['response']['orgInlineEmbeds'][number];
  show: PerformanceByGuideTableShow;
  tableIdentifier?: TableType;
}

export default function PerformanceByGuideTable(
  props: PerformanceByGuideTableProps
) {
  const {
    templates,
    show,
    orgInlineEmbed,
    tableIdentifier = TableType.guidesPerformance,
    ...boxProps
  } = props;
  const { handleSorting } = useTableRenderer();
  const data = useMemo(() => templates, [templates]);
  const enabledInternalNames = useInternalGuideNames();

  const columns = useMemo(() => {
    const defaultColWidth = 'minmax(150px, 220px)';
    const gridTemplateColumnsArray: string[] = [];
    const result = {
      config: [],
      gridTemplateColumns: '',
    };

    result.config.push({
      Header: ' ',
      canSort: false,
      Cell: () => {
        return <></>;
      },
    });
    gridTemplateColumnsArray.push('8px');

    result.config.push({
      Header: 'Name',
      accessor: 'name',
      sortType: (rowA, rowB, _, desc) => {
        return sortByString(rowA.original, rowB.original, 'name', desc);
      },
      Cell: (cellData: CellProps<Template>) => {
        const template = cellData.row.original!;
        const name = guidePrivateOrPublicNameOrFallback(
          enabledInternalNames,
          template
        );
        return (
          <Link
            fontWeight="semibold"
            href={`/library/templates/${template.entityId}?tab=analytics`}
            title={name}
            target="_blank"
          >
            {name}
          </Link>
        );
      },
    });
    gridTemplateColumnsArray.push(NAME_COL_WIDTH);

    if (show.accountsSeen) {
      result.config.push({
        Header: 'Accounts viewed',
        id: 'accountsSeen',
        accessor: 'stats.accountsSeen',
        sortType: (rowA, rowB, _, desc) => {
          const valA =
            rowA.original.stats.accountsSeen ??
            rowA.original.stats.guidesViewed;
          const valB =
            rowB.original.stats.accountsSeen ??
            rowB.original.stats.guidesViewed;
          return valA === valB ? 0 : valA < valB ? -1 : 1;
        },
        Cell: (cellData: CellProps<Template>) => {
          const template = cellData.row.original;
          return (
            <TableTextCell
              type="number"
              text={template.stats.accountsSeen ?? template.stats.guidesViewed}
            />
          );
        },
      });
      gridTemplateColumnsArray.push(defaultColWidth);
    }

    result.config.push({
      Header: 'Users viewed',
      id: 'usersSeenGuide',
      accessor: 'stats.usersSeenGuide',
      Cell: (cellData: CellProps<Template>) => {
        const template = cellData.row.original;
        return (
          <TableTextCell type="number" text={template.stats.usersSeenGuide} />
        );
      },
    });
    gridTemplateColumnsArray.push(defaultColWidth);

    if (show.completedAStep) {
      result.config.push({
        Header: (
          <Flex>
            Number engaged{' '}
            <PopoverTip placement="top" withPortal>
              Number of users or accounts who’ve completed at least 1 step
            </PopoverTip>
          </Flex>
        ),
        id: 'completedAStep',
        accessor: 'stats.completedAStep',
        Cell: (cellData: CellProps<Template>) => {
          const template = cellData.row.original;
          return (
            <TableTextCell type="number" text={template.stats.completedAStep} />
          );
        },
      });
      gridTemplateColumnsArray.push('minmax(180px, 1fr)');
    }

    if (show.averageStepsCompleted) {
      result.config.push({
        Header: (
          <Flex>
            Avg steps completed{' '}
            <PopoverTip placement="top" withPortal>
              For users or accounts, who completed at least 1 step, how many
              steps did they complete?
            </PopoverTip>
          </Flex>
        ),
        id: 'averageStepsCompleted',
        accessor: 'stats.averageStepsCompleted',
        Cell: (cellData: CellProps<Template>) => {
          const template = cellData.row.original;
          return (
            <TableTextCell
              type="number"
              text={template.stats.averageStepsCompletedForEngaged}
            />
          );
        },
      });
      gridTemplateColumnsArray.push('minmax(240px, 1fr)');
    }

    if (show.percentageDismissed) {
      result.config.push({
        Header: (
          <Flex>
            % dismissed{' '}
            <PopoverTip placement="top" withPortal>
              # of users who clicked the X or background to dismiss / # users
              viewed
            </PopoverTip>
          </Flex>
        ),
        id: 'usersDismissed',
        accessor: 'stats.usersDismissed',
        sortType: (rowA, rowB, _, desc) => {
          const emptyVal = desc
            ? Number.MIN_SAFE_INTEGER
            : Number.MAX_SAFE_INTEGER;

          const subValA =
            rowA.original.stats.usersDismissed /
            rowA.original.stats.usersSeenGuide;
          const subValB =
            rowB.original.stats.usersDismissed /
            rowB.original.stats.usersSeenGuide;

          const valA = Number.isFinite(subValA) ? subValA : emptyVal;
          const valB = Number.isFinite(subValB) ? subValB : emptyVal;

          return valA === valB ? 0 : valA < valB ? -1 : 1;
        },
        Cell: (cellData: CellProps<Template>) => {
          const template = cellData.row.original;
          return (
            <TableTextCell
              type="number"
              text={getPercentage(
                template.stats.usersDismissed,
                template.stats.usersSeenGuide
              )}
            />
          );
        },
      });
      gridTemplateColumnsArray.push(defaultColWidth);
    }

    if (show.scope) {
      result.config.push(ScopeColumn<any>());
      gridTemplateColumnsArray.push(SCOPE_COL_WIDTH);
    }

    result.config.push(GuideComponentColumn<any>());
    gridTemplateColumnsArray.push('200px');

    result.config.push({
      Header: 'Location',
      id: 'location',
      // TODO: Add sorting.
      canSort: false,
      Cell: (cellData: CellProps<Template>) => {
        const template = cellData.row.original;
        const {
          taggedElements,
          pageTargetingType,
          pageTargetingUrl,
          inlineEmbed,
        } = template;

        const locationShown = getLocationShown({
          guideDesignType: template.designType as GuideDesignType,
          pageTargetingType: pageTargetingType as GuidePageTargetingType,
          pageTargetingUrl,
          tagWildcardUrl: taggedElements?.[0]?.wildcardUrl,
          inlineEmbedWildcardUrl: inlineEmbed?.wildcardUrl,
          orgInlineEmbedWildcardUrl: orgInlineEmbed?.wildcardUrl,
          orgInlineEmbedState: orgInlineEmbed?.state as any,
        });

        return (
          <Box whiteSpace="normal" wordBreak="break-all" position="relative">
            {locationShown ? (
              <>{wildcardUrlToDisplayUrl(locationShown)}</>
            ) : pageTargetingType === GuidePageTargetingType.anyPage ? (
              <i>Any page</i>
            ) : (
              <i>Not set</i>
            )}
          </Box>
        );
      },
    });
    gridTemplateColumnsArray.push('minmax(280px, 1fr)');

    result.gridTemplateColumns = gridTemplateColumnsArray.join(' ');
    return result;
  }, [templates, orgInlineEmbed, show, enabledInternalNames]);

  const tableInstance = useTable(
    {
      columns: columns.config,
      data: data as object[],
      initialState: {
        sortBy: getSortFormatted(tableIdentifier),
      } as Partial<TableState>,
    } as TableOptions<object>,
    useSortBy
  );

  if (!data) return null;

  const tablePlaceholder: EmptyTablePlaceholderProps = {
    Graphic: () => <Text />,
    text: (
      <Text color={colors.text.secondary}>
        Once your guides are launched, stats will populate here.
      </Text>
    ),
    Button: () => (
      <NextLink href="/library" passHref>
        <Button as="a" variant="secondary">
          Build and launch guides
        </Button>
      </NextLink>
    ),
    /**
     * TODO: Improve layout of placeholder since
     * centering needs hacks.
     */
    pt: '20',
  };

  return (
    <TableRenderer
      type={tableIdentifier}
      tableInstance={tableInstance}
      handleSorting={handleSorting}
      centeredCols={[
        'accountsSeen',
        'usersSeenGuide',
        'completedAStep',
        'averageStepsCompleted',
        'usersDismissed',
      ]}
      gridTemplateColumns={columns.gridTemplateColumns}
      placeholder={tablePlaceholder}
      {...boxProps}
    />
  );
}
