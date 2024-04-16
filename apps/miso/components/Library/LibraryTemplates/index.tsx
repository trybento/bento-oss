import React, { useCallback, useMemo, useState } from 'react';
import { graphql, usePaginationFragment } from 'react-relay';
import { Box, Button, Flex } from '@chakra-ui/react';
import debounce from 'lodash/debounce';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import Search from '@mui/icons-material/Search';
import { formatDistanceToNowStrict } from 'date-fns';
import { useRouter } from 'next/router';

import {
  GuidePageTargetingType,
  GuideFormFactor,
  Theme,
} from 'bento-common/types';
import {
  ExtractedFilterSelections,
  TableFilter,
  TableFilters,
} from 'bento-common/types/filters';
import {
  areStepDetailsHidden,
  isInlineContextualGuide,
} from 'bento-common/utils/formFactor';
import { INTERNAL_TEMPLATE_ORG } from 'bento-common/utils/constants';
import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';
import { TemplateFilter } from 'bento-common/types/filters';
import { noop } from 'bento-common/utils/functions';

import * as EditTemplateLocation from 'mutations/EditTemplateLocation';
import useToast from 'hooks/useToast';
import { SuspendedQueryRenderer } from 'components/QueryRenderer';
import { LibraryTemplatesQuery } from 'relay-types/LibraryTemplatesQuery.graphql';
import {
  BentoLoadingSpinner,
  TABLE_ROWS_PER_PAGE,
} from 'components/TableRenderer';
import {
  getLocationShown,
  getIsOrgOnboardingTargeting,
  isPreviewUrlRequired,
} from 'components/TableRenderer/tables.helpers';
import { useOrganization } from 'providers/LoggedInUserProvider';
import {
  LONG_STEP_COUNT,
  MID_STEP_COUNT,
  TABLE_SPINNER_SIZE,
} from 'helpers/constants';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';
import TemplateDetailsPopover from '../../common/TemplateDetailsPopover';
import useSelectedAudience from 'hooks/useSelectedAudience';
import CircularBadge, { CalloutTypes } from 'system/CircularBadge';
import FloatingControls from 'system/FloatingControls';
import Filters from 'components/TableRenderer/Filters/Filters';
import { getFilterSelectionsRecord } from 'components/TableRenderer/Filters/tableFilters.helpers';
import EditElementLocationModal from 'components/EditElementLocationModal';
import { cleanConnection } from 'utils/cleanConnection';
import { LibraryTemplatesPaginationQuery } from 'relay-types/LibraryTemplatesPaginationQuery.graphql';
import { LibraryTemplates_query$key } from 'relay-types/LibraryTemplates_query.graphql';
import {
  getTemplateTableFilters,
  LibraryTemplate,
} from './libraryTemplates.helpers';
import DataTable, { TableSortingState } from 'components/DataTable';
import LibraryActionsMenu from './LibraryActionsMenu';
import {
  StateColumn,
  NameColumn,
  ScopeColumn,
  GuideComponentColumn,
  DistanceToNowColumn,
} from 'components/DataTable/columns';
import TextField from 'components/common/InputFields/TextField';
import { GuideResetToastProvider } from 'components/GuideResetToast';

const DEFAULT_SORTING_STATE: TableSortingState = { id: 'editedAt', desc: true };

type LibraryTemplatesQueryResponse = LibraryTemplatesQuery['response'];

interface Props extends LibraryTemplatesQueryResponse {
  onRefetch: () => void;
  selected: LibraryTemplate[];
  setSelected: (selected: LibraryTemplate[]) => void;
  sortingState: TableSortingState;
  onSortingChanged: (params: TableSortingState | null) => void;
  audienceEntityId: string | null;
  onAudienceSelected: (entityId: string) => void;
  userEmail: string | null;
  onUserSelected: (email: string) => void;
  onFiltersSelected: (filters: ExtractedFilterSelections) => void;
  query: LibraryTemplates_query$key;
  isFetching?: boolean;
  search: string | null;
  setSearch: (search: string) => void;
}

type HoveredLocation = {
  templateEntityId: string;
  wildcardUrl: string;
  url: string;
  type: GuidePageTargetingType;
  inlineEmbedEntityId: string | undefined;
  isOrgOnboardingTargeting: boolean;
};

const PAGINATION_QUERY = graphql`
  fragment LibraryTemplates_query on RootType
  @refetchable(queryName: "LibraryTemplatesPaginationQuery") {
    templatesConnection(
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: $orderBy
      orderDirection: $orderDirection
      audienceEntityId: $audienceEntityId
      userEmail: $userEmail
      filters: $filters
      search: $search
    ) @connection(key: "LibraryTemplates_templatesConnection") {
      edges {
        node {
          entityId
          name
          privateName
          type
          isCyoa
          state
          theme
          isAutoLaunchEnabled
          archivedAt
          stepsCount
          pageTargetingType
          pageTargetingUrl
          formFactor
          designType
          priorityRanking
          modules {
            entityId
            name
            description
            displayTitle
            hasBranchingStep
            hasInputStep
          }
          isTemplate
          lastUsedAt
          warnUnpublishedTag
          inlineEmbed {
            ...InlineEmbed_inlineEmbedWithTemplateId @relay(mask: false)
          }
          taggedElements(checkFirstStepSupport: true) {
            entityId
            url
            wildcardUrl
          }
          disableAutoLaunchAt
          enableAutoLaunchAt
          editedAt
          editedBy {
            fullName
            email
          }
        }
      }
    }
  }
`;

const LIBRARY_TEMPLATES_ROOT_QUERY = graphql`
  query LibraryTemplatesQuery(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $orderBy: TemplatesOrderBy
    $orderDirection: OrderDirection
    $audienceEntityId: String
    $userEmail: String
    $filters: JSON
    $search: String
  ) {
    ...LibraryTemplates_query
    orgInlineEmbeds: inlineEmbeds {
      entityId
      url
      wildcardUrl
      state
      elementSelector
    }
  }
`;

const LibraryTemplatesWrapper: React.FC<Props> = (props) => {
  const router = useRouter();
  const [selected, setSelected] = useState<LibraryTemplate[]>([]);
  const {
    audienceEntityId,
    onAudienceSelected,
    userEmail,
    onUserSelected,
    onFiltersSelected,
    query,
    onRefetch,
    orgInlineEmbeds: [orgInlineEmbed],
    sortingState,
    onSortingChanged,
    isFetching,
    search,
    setSearch,
  } = props;

  const selectedEntityIds = useMemo(
    () => selected.map(({ entityId }) => entityId),
    [selected]
  );

  const { audiences, branchingQuestions } = useSelectedAudience();
  const toast = useToast();
  const [hoveredLocation, setHoveredLocation] =
    useState<HoveredLocation | null>(null);
  const enabledInternalNames = useInternalGuideNames();
  const {
    data: { templatesConnection },
    loadNext,
    hasNext,
    isLoadingNext,
  } = usePaginationFragment<
    LibraryTemplatesPaginationQuery,
    LibraryTemplates_query$key
  >(PAGINATION_QUERY, query);

  const templates = cleanConnection<LibraryTemplate>(
    templatesConnection as any
  );

  const { organization } = useOrganization();
  const isBentoTemplateOrg = organization.slug === INTERNAL_TEMPLATE_ORG;

  const handleLocationEditClose = useCallback(() => {
    setHoveredLocation(null);
  }, []);

  const handleLocationEditConfirm = useCallback(
    async (newWildcardUrl: string, newUrl: string) => {
      await EditTemplateLocation.commit({
        entityId: hoveredLocation.templateEntityId,
        inlineEmbedEntityId: hoveredLocation.inlineEmbedEntityId,
        wildcardUrl: newWildcardUrl,
        url: newUrl,
      });

      handleLocationEditClose();

      toast({
        title: 'Location updated!',
        isClosable: true,
        status: 'success',
      });

      onRefetch();
    },
    [hoveredLocation]
  );

  const priorityRankingsByTemplateEntityId = useMemo(() => {
    /**
     * Fix ranking gaps since inline contextual guides
     * have their ranking hidden.
     */

    return templates
      .filter(
        (t) =>
          t.isAutoLaunchEnabled && !isInlineContextualGuide(t.theme as Theme)
      )
      .sort((t, t2) => t.priorityRanking - t2.priorityRanking)
      .reduce((acc, t, i) => {
        acc[t.entityId] = i + 1;
        return acc;
      }, {});
  }, [templates]) as Record<string, number>;

  const handleEditLocation = useCallback(
    ({
      template,
      locationShown,
      previewUrl,
    }: {
      template: LibraryTemplate;
      locationShown: string;
      previewUrl: string;
    }) => {
      const isOrgOnboardingTargeting = getIsOrgOnboardingTargeting({
        guideDesignType: template.designType as any,
        pageTargetingType: template.pageTargetingType as GuidePageTargetingType,
        orgInlineEmbedWildcardUrl: orgInlineEmbed?.wildcardUrl,
        orgInlineEmbedState: orgInlineEmbed?.state as any,
      });

      setHoveredLocation({
        templateEntityId: template.entityId,
        wildcardUrl: locationShown,
        url: previewUrl,
        type: template.pageTargetingType as GuidePageTargetingType,
        inlineEmbedEntityId: isOrgOnboardingTargeting
          ? orgInlineEmbed.entityId
          : template.inlineEmbed?.entityId,
        isOrgOnboardingTargeting,
      });
    },
    []
  );

  const handleSelect = (template: LibraryTemplate, checked: boolean) => {
    const existingIndex = selected.findIndex(
      ({ entityId }) => entityId === template.entityId
    );

    if (!checked) {
      if (existingIndex !== -1) {
        selected.splice(existingIndex, 1);
      }
    } else if (existingIndex === -1) {
      selected.push(template);
    }

    setSelected([...selected]);
  };

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelected([...templates]);
      } else {
        setSelected([]);
      }
    },
    [templates]
  );

  const [filterSelections, setFilterSelections] = useState<TableFilters>(
    getTemplateTableFilters()
  );

  const handleFiltersChange = useCallback(
    debounce((updatedFilters: TableFilters) => {
      Object.entries(updatedFilters).forEach(([label, filter]) => {
        const selections = filter.isSelected
          ? filter.options.filter((o) => o.isSelected)
          : [];

        switch (label) {
          case TemplateFilter.audience: {
            const newAudienceEntityId = selections[0]?.value || null;
            if (newAudienceEntityId !== audienceEntityId) {
              onAudienceSelected(newAudienceEntityId);
            }
            break;
          }

          case TemplateFilter.user: {
            const newUserEmail = selections[0]?.value || null;
            if (newUserEmail !== userEmail) {
              onUserSelected(newUserEmail);
            }
            break;
          }

          default:
            break;
        }
      });

      setFilterSelections(updatedFilters);
    }, 600),
    [audienceEntityId, userEmail]
  );

  const hasFilterSelections = useMemo(() => {
    const hasFilterSelections = Object.values(filterSelections).some(
      (f: TableFilter) => f.isSelected
    );

    if (hasFilterSelections) {
      onFiltersSelected(getFilterSelectionsRecord(filterSelections));
    } else {
      onFiltersSelected(null);
    }

    return hasFilterSelections;
  }, [filterSelections]);

  const handleViewStepGroups = useCallback(
    () => router.push('/library/step-groups'),
    []
  );

  const columnHelper = createColumnHelper<LibraryTemplate>();
  const columns = useMemo<ColumnDef<LibraryTemplate>[]>(
    () => [
      // @ts-expect-error
      StateColumn<LibraryTemplate>(),
      NameColumn<LibraryTemplate>({
        enabledInternalNames,
        useLink: true,
        NameWrapper: ({ children, entityId }) => (
          <TemplateDetailsPopover
            templateEntityId={entityId}
            branchingQuestions={branchingQuestions}
            audiences={audiences}
          >
            <Box>{children}</Box>
          </TemplateDetailsPopover>
        ),
        fontWeight: 'bold',
      }),
      columnHelper.accessor('priorityRanking', {
        header: 'Priority',
        id: 'priorityRanking',
        enableSorting: true,
        meta: {
          column: { width: '120px' },
        },
        cell: (props) => {
          const template = props.row.original;

          return priorityRankingsByTemplateEntityId[template.entityId] || '-';
        },
      }),
      columnHelper.display({
        header: 'Steps',
        id: 'stepsCount',
        enableSorting: false,
        meta: {
          column: { width: '100px' },
        },
        cell: (props) => {
          const template = props.row.original;

          if (
            areStepDetailsHidden(
              template.formFactor as GuideFormFactor,
              template.theme as Theme
            )
          ) {
            return '-';
          }

          let badgeProps: { tooltip: string; calloutType: CalloutTypes };

          if (template.stepsCount <= MID_STEP_COUNT) {
            badgeProps = {
              tooltip: '',
              calloutType: CalloutTypes.Success,
            };
          } else if (template.stepsCount <= LONG_STEP_COUNT) {
            badgeProps = {
              tooltip:
                'Guides with this many steps have a ~20% lower completion rate',
              calloutType: CalloutTypes.Warning,
            };
          } else {
            badgeProps = {
              tooltip:
                'Guides this many steps have a ~70% lower completion rate',
              calloutType: CalloutTypes.Error,
            };
          }

          return (
            <CircularBadge
              {...badgeProps}
              fontSize="sm"
              tooltipPlacement="top"
              width="32px"
              height="32px"
              iconHidden
            >
              <Box m="auto">{template.stepsCount}</Box>
            </CircularBadge>
          );
        },
      }),
      ScopeColumn<LibraryTemplate>(),
      GuideComponentColumn<LibraryTemplate>(),
      columnHelper.display({
        header: 'Location',
        id: 'location',
        enableSorting: false,
        meta: {
          column: { width: '280px' },
        },
        cell: (props) => {
          const template = props.row.original;
          const {
            taggedElements,
            pageTargetingType,
            pageTargetingUrl,
            inlineEmbed,
          } = template;

          const tag = taggedElements?.[0];

          const commonLocationArgs = {
            guideDesignType: template.designType as any,
            pageTargetingType: pageTargetingType as GuidePageTargetingType,
            pageTargetingUrl,
            orgInlineEmbedState: orgInlineEmbed?.state as any,
          };

          const locationShown = getLocationShown({
            ...commonLocationArgs,
            tagWildcardUrl: tag?.wildcardUrl,
            inlineEmbedWildcardUrl: inlineEmbed?.wildcardUrl,
            orgInlineEmbedWildcardUrl: orgInlineEmbed?.wildcardUrl,
          });

          /**
           * Conditions that don't need a preview URL:
           * - "Specific page" targeting.
           */
          const previewUrl = isPreviewUrlRequired(
            pageTargetingType as GuidePageTargetingType
          )
            ? getLocationShown({
                ...commonLocationArgs,
                tagWildcardUrl: tag?.url,
                inlineEmbedWildcardUrl: inlineEmbed?.url,
                orgInlineEmbedWildcardUrl: orgInlineEmbed?.url,
              })
            : undefined;

          return (
            <Box whiteSpace="normal" wordBreak="break-all" position="relative">
              {locationShown ? (
                <>
                  {wildcardUrlToDisplayUrl(locationShown)}
                  <Box
                    position="absolute"
                    w="32px"
                    h="32px"
                    top="50%"
                    right="0"
                    transform="translateY(-50%)"
                    display="none"
                    className="template-location-edit-btn"
                  >
                    <FloatingControls
                      onEdit={() =>
                        handleEditLocation({
                          template,
                          locationShown,
                          previewUrl,
                        })
                      }
                      editTooltipLabel="Edit location"
                      w="inherit"
                      h="inherit"
                      px="0"
                      py="0"
                      position="relative"
                      iconProps={{ transform: 'scale(0.8)' }}
                    />
                  </Box>
                </>
              ) : pageTargetingType === GuidePageTargetingType.anyPage ? (
                <i>Any page</i>
              ) : (
                <i>Not set</i>
              )}
            </Box>
          );
        },
      }),
      columnHelper.accessor('editedBy', {
        header: 'Edited by',
        id: 'editedBy',
        enableSorting: true,
        meta: {
          column: { width: '160px' },
        },
        cell: (props) => {
          const { editedBy } = props.row.original;

          return editedBy ? editedBy.fullName || editedBy.email : '-';
        },
      }),
      columnHelper.accessor('editedAt', {
        header: 'Edited at',
        id: 'editedAt',
        enableSorting: true,
        meta: {
          column: { width: '160px' },
        },
        cell: (props) => {
          const { editedAt } = props.row.original;

          return editedAt
            ? formatDistanceToNowStrict(new Date(editedAt), {
                addSuffix: true,
              })
            : '-';
        },
      }),
      DistanceToNowColumn<LibraryTemplate>('lastUsedAt', 'Last launched'),
    ],
    [templates, orgInlineEmbed, audiences]
  );

  const handleSearch = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();

        setSearch((e.target as HTMLInputElement).value);
      }
    },
    []
  );

  return (
    <Flex direction="column" h="100%">
      <Flex
        position="sticky"
        top="0"
        backgroundColor="white"
        zIndex="1"
        pt="8"
        pb="6"
        gap="6"
        alignItems="baseline"
      >
        <TextField
          width="xs"
          onChange={noop}
          onKeyDown={handleSearch}
          fontSize="sm"
          defaultValue={search}
          placeholder="Search by guide name"
          helperText="Press enter to search"
          helperTextProps={{
            fontSize: 'xs',
          }}
          inputLeftElement={<Search style={{ width: '24px' }} />}
        />
        <Box flexGrow={1}>
          <Filters
            filters={getTemplateTableFilters()}
            onChange={handleFiltersChange}
          />
        </Box>
        <Button variant="link" onClick={handleViewStepGroups} size="sm">
          View step groups
        </Button>
        <LibraryActionsMenu
          selectedTemplates={selected}
          refetch={() => {
            setSelected([]);
            onRefetch();
          }}
        />
      </Flex>
      <DataTable
        data={templates}
        columns={columns}
        loading={isFetching}
        emptyState={{
          text: isBentoTemplateOrg
            ? 'Clone or create templates to create source guides'
            : hasFilterSelections
            ? 'No results based on these filters'
            : undefined,
        }}
        selection={{
          selected: selectedEntityIds,
          onSelect: handleSelect,
          onSelectAll: handleSelectAll,
        }}
        sorting={{
          state: sortingState,
          onSortingChanged,
        }}
        pagination={{
          fetchNextPage: loadNext,
          hasNextPage: hasNext,
          isFetchingNextPage: isLoadingNext,
          rowsPerPage: TABLE_ROWS_PER_PAGE,
        }}
      />
      {hoveredLocation && (
        <EditElementLocationModal
          title="Edit location targeting"
          data={{
            wildcardUrl: hoveredLocation.wildcardUrl,
            url: hoveredLocation.url,
          }}
          onClose={handleLocationEditClose}
          onSubmit={handleLocationEditConfirm}
          submitLabel="Save"
          warningMessage={
            hoveredLocation.isOrgOnboardingTargeting ? (
              <>
                ⚠️ You are editing the embed location for <b>all</b> onboarding
                guides.
              </>
            ) : undefined
          }
          isOpen
          withSelector={false}
        />
      )}
    </Flex>
  );
};

export default function LibraryTemplatesQueryRenderer() {
  const [audienceEntityId, setAudienceEntityId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);

  const [filters, setFilters] = useState<ExtractedFilterSelections | null>(
    getFilterSelectionsRecord(getTemplateTableFilters())
  );

  const [sortingState, setSortingState] = useState<TableSortingState>(
    DEFAULT_SORTING_STATE
  );

  const onSortingChanged = useCallback((sortingState: TableSortingState) => {
    setSortingState(
      sortingState === null ? DEFAULT_SORTING_STATE : sortingState
    );
  }, []);

  return (
    <>
      <SuspendedQueryRenderer
        query={LIBRARY_TEMPLATES_ROOT_QUERY}
        variables={{
          first: TABLE_ROWS_PER_PAGE,
          audienceEntityId,
          userEmail,
          filters,
          orderBy: sortingState.id,
          orderDirection: sortingState.desc ? 'desc' : 'asc',
          search,
        }}
        fetchPolicy="network-only"
        render={({ props, retry, isFetching }) =>
          !props ? (
            <BentoLoadingSpinner h="70vh" size={TABLE_SPINNER_SIZE} />
          ) : (
            <GuideResetToastProvider>
              <LibraryTemplatesWrapper
                {...props}
                query={props}
                onRefetch={retry}
                audienceEntityId={audienceEntityId}
                onAudienceSelected={setAudienceEntityId}
                userEmail={userEmail}
                onUserSelected={setUserEmail}
                onFiltersSelected={setFilters}
                sortingState={sortingState}
                onSortingChanged={onSortingChanged}
                isFetching={isFetching}
                search={search}
                setSearch={setSearch}
              />
            </GuideResetToastProvider>
          )
        }
      />
    </>
  );
}
