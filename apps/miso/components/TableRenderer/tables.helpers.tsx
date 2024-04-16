import React, { ReactNode } from 'react';
import {
  Column as DefaultColumn,
  CellProps,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  Row,
} from 'react-table';
import { Box, BoxProps, Link } from '@chakra-ui/react';
import { formatDistanceToNowStrict } from 'date-fns';
import pick from 'lodash/pick';
import get from 'lodash/get';
import NextLink from 'next/link';
import { ExtendedCalloutTypes } from 'bento-common/types/slate';
import {
  GuideDesignType,
  GuideFormFactor,
  GuidePageTargetingType,
  GuideTypeEnum,
  InlineEmbedState,
  SplitTestState,
  Theme,
} from 'bento-common/types';
import {
  isCarouselTheme,
  isVideoGalleryTheme,
  npsSurveyStateRankings,
  ORIENTATION_LABELS,
  splitTestStateRankings,
  THEME_LABELS,
} from 'bento-common/data/helpers';
import {
  guidePrivateOrPublicNameOrFallback,
  splitTestNameOrFallback,
} from 'bento-common/utils/naming';
import GuideScope from 'components/common/GuideScope';
import NpsSurveyStatus from '../Library/NpsSurveyStatus';
import { CalloutTypes, CIRCULAR_BADGE_PX_SIZE } from 'system/CircularBadge';
import sortByDate from 'components/utils/react-table/sortByDate';
import {
  guideComponentIcon,
  guideComponentLabel,
} from 'helpers/presentational';
import MessagesPopover, { Notification } from 'system/MessagesPopover';
import Badge from 'system/Badge';
import { TYPE_BG_COLOR } from 'bento-common/components/RichTextEditor/extensions/Callout/CalloutElement';
import sortByString from 'components/utils/react-table/sortByString';
import { GuideShape } from 'bento-common/types/globalShoyuState';
import { NpsSurveyState } from 'bento-common/types/netPromoterScore';
import { NpsSurveyStateEnumType } from 'relay-types/LibraryNpsQuery.graphql';
import SplitTestStatus from 'components/Library/SplitTestStatus';
import { SplitTestStateEnumType } from 'relay-types/LibrarySplitTestsQuery.graphql';

type Column = DefaultColumn & { sortType?: any };

export enum TableType {
  accountAttributes = 'accountAttributes',
  activeGuides = 'activeGuides',
  /** Variant where we care about the views */
  activeGuidesViews = 'activeGuidesViews',
  /** Variant where we care about account level data */
  activeGuidesAccounts = 'activeGuidesAccounts',
  allAttributes = 'allAttributes',
  audiences = 'audiences',
  customers = 'customers',
  guides = 'guides',
  guidesPerformance = 'guidesPerformance',
  singleStepGuidesPerformance = 'singleStepGuidesPerformance',
  launchGuides = 'launchGuides',
  libraryModules = 'libraryModules',
  libraryNps = 'libraryNps',
  libraryTemplates = 'libraryTemplates',
  librarySplitTests = 'librarySplitTests',
  participants = 'participants',
  stepsPerformance = 'stepsPerformance',
  users = 'users',
  userAttributes = 'userAttributes',
  tags = 'tags',
  npsSurveyAccounts = 'npsSurveyAccounts',
  generic = 'generic',
}

export const getCustomizedGuideLabel = (
  templateEntityId: string | undefined
) => (
  <span>
    This guide has been customized and will not be synced when changes to the{' '}
    <a
      {...(templateEntityId && {
        style: { textDecoration: 'underline' },
        href: `${window.location.origin}/library/templates/${templateEntityId}`,
        target: '_blank',
      })}
    >
      template
    </a>{' '}
    are made
  </span>
);

// Backend and frontend sorting.
export const TABLES_SINGLE_SORT = {
  [TableType.activeGuides]: { id: 'usersCompletedAStep', direction: 'desc' },
  [TableType.activeGuidesViews]: {
    id: 'participantsWhoViewedCount',
    direction: 'desc',
  },
  [TableType.activeGuidesAccounts]: { id: 'stepsCompleted', direction: 'desc' },
  [TableType.stepsPerformance]: { id: 'seenStep', direction: 'desc' },
  [TableType.guidesPerformance]: { id: 'usersSeenGuide', direction: 'desc' },
  [TableType.singleStepGuidesPerformance]: {
    id: 'usersSeenGuide',
    direction: 'desc',
  },
  [TableType.accountAttributes]: { id: 'attributes' },
  [TableType.allAttributes]: { id: 'name' },
  [TableType.userAttributes]: { id: 'fullName', direction: 'asc' },
  [TableType.participants]: { id: 'stepLastSeen', direction: 'desc' },
  [TableType.customers]: { id: 'lastActiveAt', direction: 'desc' },
  [TableType.tags]: {},
  [TableType.npsSurveyAccounts]: { id: 'responses', direction: 'desc' },
  [TableType.libraryTemplates]: [{ id: 'state', direction: 'asc' }],
  [TableType.librarySplitTests]: [{ id: 'state', direction: 'asc' }],
};

interface ColumnOptions {
  path?: string;
  accessor?: string;
  Header?: string;
  canSort?: boolean;
}

// Frontend sorting.
const TABLES_MULTI_SORT = {
  [TableType.launchGuides]: [
    { id: 'inUse' },
    { id: 'alsoUsedFor', direction: 'desc' },
  ],
  [TableType.guides]: [
    { id: 'users_in_guide', direction: 'desc' },
    { id: 'launched', direction: 'desc' },
  ],
  [TableType.libraryModules]: [
    { id: 'guides', direction: 'desc' },
    { id: 'lastUsed', direction: 'desc' },
  ],
  [TableType.users]: [
    { id: 'createdAt', direction: 'desc' },
    { id: 'fullName' },
  ],
};

export const getGuideNotifications = (
  // TODO: Find a way to better type common helpers.
  guide: Partial<{
    modules?: readonly any[];
    guideModuleBases?: readonly any[];
    warnUnpublishedTag?: boolean;
    inlineEmbed?: any;
    isModifiedFromTemplate?: boolean;
    createdFromTemplate?: { name?: string; entityId?: string };
    pageTargetingType?: GuidePageTargetingType;
    pageTargetingUrl?: string;
  }>
): Notification[] => {
  if (!guide) return [];

  const notifications: Notification[] = [];
  const modules = guide?.modules || guide?.guideModuleBases;
  const noLocationMsg =
    'This guide will not show up because there is no location set';

  if (
    // No published tag.
    guide.warnUnpublishedTag ||
    // No URL for specific guide targeting.
    (guide.pageTargetingType === GuidePageTargetingType.specificPage &&
      !guide.pageTargetingUrl) ||
    // No URL for inline embed targeting.
    (guide.pageTargetingType === GuidePageTargetingType.inline &&
      !guide?.inlineEmbed?.wildcardUrl)
  )
    notifications.push({
      type: CalloutTypes.Warning,
      text: noLocationMsg,
    });

  if (modules && !modules.length)
    notifications.push({
      type: CalloutTypes.Warning,
      text: 'Guide is empty',
    });

  if (guide.isModifiedFromTemplate)
    notifications.push({
      type: ExtendedCalloutTypes.Customized,
      text: getCustomizedGuideLabel(guide.createdFromTemplate?.entityId),
    });

  if (modules?.some((m) => m.hasBranchingStep))
    notifications.push({
      type: ExtendedCalloutTypes.Branching,
      text: 'This guide contains branching logic',
    });

  if (modules?.some((m) => m.hasInputStep))
    notifications.push({
      type: ExtendedCalloutTypes.Inputs,
      text: 'This guide contains input step(s)',
    });

  return notifications;
};

// Format default sort state for react-table.
export const getSortFormatted = (tableType: TableType) => {
  const sort = TABLES_SINGLE_SORT[tableType];

  return [
    sort && Object.keys(sort).length
      ? { id: sort.id, desc: sort.direction === 'desc' ? true : null }
      : {},
  ];
};

// Format default sort state for react-table.
export const getMultiSortFormatted = (tableType: TableType) => {
  const sort = TABLES_MULTI_SORT[tableType];

  return sort?.length
    ? sort.map((s) => ({
        id: s.id,
        desc:
          s.direction === 'desc'
            ? true
            : s.direction === 'asc'
            ? false
            : undefined,
      }))
    : [];
};

type SortableColumn = Partial<UseSortByColumnOptions<any>> &
  Partial<UseSortByColumnProps<any>> &
  Column;

export function ScopeColumn<T extends { type: string | GuideTypeEnum }>({
  accessor,
}: { accessor?: string } = {}): Column {
  return {
    Header: 'Scope',
    accessor: accessor ?? 'type',
    Cell: (cellData: CellProps<T>) => (
      <GuideScope
        type={cellData.row.original?.type as GuideTypeEnum}
        borderRadius="full"
        backgroundColor={TYPE_BG_COLOR['themeless']}
        w={CIRCULAR_BADGE_PX_SIZE}
        h={CIRCULAR_BADGE_PX_SIZE}
      />
    ),
  };
}

const processComponentRow = <T extends object>(
  row: Row<T>,
  options?: ColumnOptions
) => {
  const target = options?.path
    ? get(row.original, options.path)
    : (row.original as GuideShape);

  const discoveryArgs = pick(target, [
    'designType',
    'formFactor',
    'theme',
    'isCyoa',
    'type',
  ]);
  const SvgIconElement = guideComponentIcon(discoveryArgs);
  const label = guideComponentLabel(discoveryArgs);

  return { label, SvgIconElement };
};

export function GuideComponentColumn<T extends object>(
  options?: ColumnOptions
): SortableColumn {
  return {
    Header: options?.Header || 'Component',
    accessor:
      options?.canSort === false
        ? undefined
        : options?.accessor || 'formFactor',
    canSort: options?.canSort === false ? false : true,
    sortType: (rowA, rowB) => {
      const { label: labelA } = processComponentRow<T>(rowA, options);
      const { label: labelB } = processComponentRow<T>(rowB, options);

      return labelA < labelB ? -1 : 1;
    },
    Cell: (cellData: CellProps<T>) => {
      const { label, SvgIconElement } = processComponentRow(
        cellData.row,
        options
      );

      return (
        <Badge
          label={label}
          icon={<SvgIconElement style={{ fontSize: '14px' }} />}
        />
      );
    },
  };
}

export const sortByNpsSurveyState = (a, b, _colId, _desc) => {
  const aRank = npsSurveyStateRankings[a.original.state];
  const bRank = npsSurveyStateRankings[b.original.state];

  if (aRank > bRank) {
    return -1;
  }

  if (aRank < bRank) {
    return 1;
  }

  return 0;
};

export function NpsSurveyStateColumn<
  T extends {
    state: NpsSurveyStateEnumType;
  }
>(): SortableColumn {
  return {
    Header: 'Status',
    id: 'state',
    accessor: 'state',
    sortType: sortByNpsSurveyState,
    Cell: (cellData: CellProps<T>) => {
      const { state } = cellData.row.original;

      return (
        <Box display="flex" minH="22px">
          <NpsSurveyStatus state={state as NpsSurveyState} />
        </Box>
      );
    },
  };
}

export const sortBySplitTestState = (a, b, _colId, _desc = null) => {
  const aRank = splitTestStateRankings[a.original.splitTestState];
  const bRank = splitTestStateRankings[b.original.splitTestState];

  if (aRank > bRank) {
    return -1;
  }

  if (aRank < bRank) {
    return 1;
  }

  return 0;
};

/**
 * Simply throw all archived guides at the end
 *  Not used since they are sorted as a normal state, and
 *  this wouldn't support sub-sorting
 */
export function sortByWithArchive<T>(sortKey: keyof T) {
  return (a, b, _colId, desc: boolean) => {
    const aArchived = !a.original.archivedAt;
    const bArchived = !b.original.archivedAt;

    if (aArchived && bArchived) return 0;
    if (aArchived) return desc ? 1 : -1;
    if (bArchived) return desc ? -1 : 1;

    const aRank = a.original[sortKey];
    const bRank = b.original[sortKey];
    if (aRank < bRank) return -1;
    if (aRank > bRank) return 1;
    return 0;
  };
}

export function SplitTestNameColumn<
  T extends {
    name: string;
    entityId: string;
  }
>({
  useLink = false,
  NameWrapper = ({ children }) => <>{children}</>,
  ...boxProps
}: {
  useLink?: boolean;
  NameWrapper?: React.FC<React.PropsWithChildren<T>>;
} & BoxProps = {}): Column {
  return {
    Header: 'Name',
    accessor: 'name',
    Cell: (cellData: CellProps<T>) => {
      const splitTest = cellData.row.original;
      const name = splitTestNameOrFallback(splitTest.name);

      if (useLink) {
        return (
          <Box display="flex" alignItems="center">
            <NextLink
              href={`/library/split-tests/${splitTest.entityId}`}
              passHref
            >
              {/* @ts-ignore */}
              <Link fontWeight="semibold" {...boxProps}>
                <NameWrapper {...splitTest}>{name}</NameWrapper>
              </Link>
            </NextLink>
          </Box>
        );
      }

      return (
        <Box display="flex" alignItems="center" {...boxProps}>
          {name}
        </Box>
      );
    },
  };
}

export function NameColumn<
  T extends {
    name: string;
    modules: readonly any[];
    entityId: string;
    warnUnpublishedTag?: boolean;
    inlineEmbed?: any;
    // graphQL not generating types for DateTime
    archivedAt?: Date | unknown;
  }
>({
  useLink = false,
  enabledInternalNames,
  NameWrapper = ({ children }) => <>{children}</>,
  ...boxProps
}: {
  enabledInternalNames: boolean;
  useLink?: boolean;
  NameWrapper?: React.FC<React.PropsWithChildren<T>>;
} & BoxProps): Column {
  return {
    Header: 'Name',
    accessor: 'name',
    sortType: (rowA, rowB, _, desc) => {
      return sortByString(rowA.original, rowB.original, 'name', desc);
    },
    Cell: (cellData: CellProps<T>) => {
      const template = cellData.row.original;
      const templateName = guidePrivateOrPublicNameOrFallback(
        enabledInternalNames,
        template
      );

      const notifications = getGuideNotifications(template);

      if (useLink) {
        return (
          <Box display="flex" alignItems="center" whiteSpace="normal">
            <NextLink href={`/library/templates/${template.entityId}`} passHref>
              {/* @ts-ignore */}
              <Link fontWeight="semibold" {...boxProps}>
                <NameWrapper {...template}>{templateName}</NameWrapper>
              </Link>
            </NextLink>
            <MessagesPopover notifications={notifications} ml="1" />
          </Box>
        );
      }

      return (
        <Box
          display="flex"
          alignItems="center"
          whiteSpace="normal"
          {...boxProps}
        >
          {templateName}
          <MessagesPopover notifications={notifications} ml="1" />
        </Box>
      );
    },
  };
}

export function DescriptionColumn<
  T extends { description?: string }
>(): Column {
  return {
    Header: 'Description',
    Cell: (cellData: CellProps<T>) => {
      const description = cellData.row.original?.description || '';

      return description;
    },
    width: 150,
  };
}

export function LastEditedByColumn<
  T extends { lastEdited: null | { user: { fullName: string; email: string } } }
>(): SortableColumn {
  return {
    Header: 'Edited by',
    id: 'editedBy',
    sortType: (rowA, rowB, _, desc) => {
      const emptyVal = desc ? '' : 'zzzzzzzzzzzzz';
      const authorA = (
        (rowA.original.lastEdited?.user
          ? rowA.original.lastEdited.user.fullName ||
            rowA.original.lastEdited.user.email ||
            emptyVal
          : emptyVal) as string
      ).toLowerCase();
      const authorB = (
        (rowB.original.lastEdited?.user
          ? rowB.original.lastEdited.user.fullName ||
            rowB.original.lastEdited.user.email ||
            emptyVal
          : emptyVal) as string
      ).toLowerCase();

      return authorA === authorB ? 0 : authorA < authorB ? -1 : 1;
    },
    canSort: true,
    Cell: (cellData: CellProps<T>) => {
      const { lastEdited } = cellData.row.original;
      return lastEdited?.user
        ? lastEdited.user.fullName || lastEdited.user.email
        : '-';
    },
  };
}

export function LastEditedAtColumn<
  T extends { lastEdited: null | { timestamp: Date } }
>(): SortableColumn {
  return {
    Header: 'Edited at',
    id: 'editedAt',
    sortType: (rowA, rowB, _, desc) => {
      const dateA =
        rowA.original.lastEdited?.timestamp || rowA.original.updatedAt;
      const dateB =
        rowB.original.lastEdited?.timestamp || rowB.original.updatedAt;
      return sortByDate(dateA, dateB, undefined, desc);
    },
    canSort: true,
    Cell: (cellData: CellProps<T>) => {
      const { lastEdited } = cellData.row.original;

      return lastEdited.timestamp
        ? formatDistanceToNowStrict(new Date(lastEdited.timestamp), {
            addSuffix: true,
          })
        : '-';
    },
  };
}

export function DistanceToNowColumn<T extends object>(
  accessor: Extract<keyof T, string>,
  Header: ReactNode
): SortableColumn {
  return {
    Header,
    accessor,
    id: accessor,
    sortType: (rowA, rowB, _, desc) => {
      return sortByDate(rowA.original, rowB.original, accessor, desc);
    },
    canSort: true,
    Cell: (cellData: CellProps<T>) => {
      const atValue = cellData.row.original[accessor];
      let displayedTime = '-';
      if (atValue) {
        displayedTime = formatDistanceToNowStrict(new Date(atValue as string), {
          addSuffix: true,
        });
      }
      return displayedTime;
    },
  };
}

export const NAME_COL_WIDTH = '260px';
export const SCOPE_COL_WIDTH = '80px';

function getLayoutLabel<
  T extends {
    isSideQuest: any;
    formFactor: any;
    isCyoa: any;
    theme: any;
    formFactorStyle: any;
  }
>(TemplateOrGuide: T, forSorting = false) {
  return TemplateOrGuide.isSideQuest &&
    TemplateOrGuide.formFactor !== GuideFormFactor.inline
    ? forSorting
      ? /* Force side quests to be sorted as zzzz layout */
        /* Ideally we can always put them last but the helper doesn't give us sort direction. */
        'zzzz'
      : ''
    : TemplateOrGuide.isCyoa
    ? 'CYOA'
    : TemplateOrGuide.isSideQuest &&
      !isCarouselTheme(TemplateOrGuide.theme as Theme) &&
      !isVideoGalleryTheme(TemplateOrGuide.theme as Theme)
    ? `${
        ORIENTATION_LABELS[TemplateOrGuide.formFactorStyle.stepBodyOrientation]
      } ${THEME_LABELS[TemplateOrGuide.theme]}`.trim()
    : THEME_LABELS[TemplateOrGuide.theme];
}

export function LayoutColumn<
  T extends {
    isSideQuest: any;
    formFactor: any;
    isCyoa: any;
    theme: any;
    formFactorStyle: any;
  }
>(options?: ColumnOptions): SortableColumn {
  return {
    Header: 'Layout',
    id: 'theme',
    accessor: 'theme',
    canSort: true,
    ...options,
    sortType: (a, b) => {
      const layoutA = getLayoutLabel<T>(a.original, true);
      const layoutB = getLayoutLabel<T>(b.original, true);

      return layoutA === layoutB ? 0 : layoutA < layoutB ? -1 : 1;
    },
    Cell: (cellData: CellProps<T>) => {
      const label = getLayoutLabel(cellData.row.original);
      return label;
    },
  };
}

export const getIsOrgOnboardingTargeting = ({
  pageTargetingType,
  guideDesignType,
  orgInlineEmbedWildcardUrl,
  orgInlineEmbedState,
}: {
  guideDesignType: GuideDesignType;
  pageTargetingType: GuidePageTargetingType | undefined;
  orgInlineEmbedWildcardUrl: string | undefined;
  orgInlineEmbedState: InlineEmbedState | undefined;
}): boolean =>
  !!(
    guideDesignType === GuideDesignType.onboarding &&
    pageTargetingType === GuidePageTargetingType.anyPage &&
    orgInlineEmbedState === InlineEmbedState.active &&
    orgInlineEmbedWildcardUrl
  );

/** See: template.locationShown resolver */
export const getLocationShown = ({
  pageTargetingType,
  guideDesignType,
  tagWildcardUrl,
  inlineEmbedWildcardUrl,
  orgInlineEmbedWildcardUrl,
  orgInlineEmbedState,
  pageTargetingUrl,
}: {
  guideDesignType: GuideDesignType;
  pageTargetingType: GuidePageTargetingType | undefined;
  tagWildcardUrl: string | undefined;
  inlineEmbedWildcardUrl: string | undefined;
  orgInlineEmbedWildcardUrl: string | undefined;
  orgInlineEmbedState: InlineEmbedState | undefined;
  pageTargetingUrl: string | undefined;
}): string | undefined =>
  pageTargetingType === GuidePageTargetingType.visualTag
    ? tagWildcardUrl
    : pageTargetingType === GuidePageTargetingType.inline
    ? inlineEmbedWildcardUrl
    : pageTargetingType === GuidePageTargetingType.specificPage
    ? pageTargetingUrl
    : getIsOrgOnboardingTargeting({
        pageTargetingType,
        guideDesignType,
        orgInlineEmbedWildcardUrl,
        orgInlineEmbedState,
      })
    ? orgInlineEmbedWildcardUrl
    : '';

export const isPreviewUrlRequired = (
  pageTargeting: GuidePageTargetingType | undefined
): boolean =>
  pageTargeting && pageTargeting !== GuidePageTargetingType.specificPage;
