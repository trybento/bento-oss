import React, { useCallback, useMemo } from 'react';
import { graphql } from 'react-relay';
import { Box, Popover, PopoverBody, PopoverTrigger } from '@chakra-ui/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { guidePrivateOrPublicNameOrFallback } from 'bento-common/utils/naming';
import {
  GroupTargeting,
  GroupTargetingSegment,
} from 'bento-common/types/targeting';
import {
  GuideCategory,
  RulesDisplayType,
  SplitTestState,
  TemplateState,
} from 'bento-common/types';
import { audienceRuleToAudience } from 'bento-common/utils/targeting';

import PopoverContent from 'system/PopoverContent';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { sortBySplitTestState } from 'components/TableRenderer/tables.helpers';
import InformationTags from '../InformationTags';
import QueryRenderer from 'components/QueryRenderer';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import { LibrarySplitTestsQuery } from 'relay-types/LibrarySplitTestsQuery.graphql';
import TemplateOverflowMenuButton from '../../Templates/EditTemplate/TemplateOverflowMenuButton';
import useToggleState from 'hooks/useToggleState';
import AudienceRulesDisplay from 'components/Templates/AudienceGroupRulesDisplay';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';
import SplitTestStatus from '../SplitTestStatus';
import { GuideResetToastProvider } from 'components/GuideResetToast';
import TargetingAudienceProvider, {
  useTargetingAudiencesContext,
} from 'components/EditorCommon/Audiences/TargetingAudiencesProvider';
import { NameColumn, DistanceToNowColumn } from 'components/DataTable/columns';
import DataTable from 'components/DataTable';
import { GUIDE_STATUS_COL_WIDTH } from '../TemplateStatus';

type LibrarySplitTestsResponse = LibrarySplitTestsQuery['response'];
type SplitTest = Omit<
  LibrarySplitTestsResponse['templates'][number],
  'state'
> & { state: TemplateState };

interface Props extends LibrarySplitTestsResponse {
  onRefetch: () => void;
}

function LibrarySplitTests({ onRefetch, templates: splitTests }: Props) {
  const loadingState = useToggleState(['action']);
  const enabledInternalNames = useInternalGuideNames();
  const { audiences } = useTargetingAudiencesContext();

  const handleDeleted = useCallback(() => {
    onRefetch();
    loadingState.action.off();
  }, [loadingState]);

  const columnHelper = createColumnHelper<SplitTest>();
  const columns = useMemo<ColumnDef<SplitTest>[]>(
    () => [
      columnHelper.display({
        id: 'menu',
        meta: {
          column: {
            width: '10px',
          },
          cell: {
            verticalAlign: 'top',
            padding: '0.85rem 0 0 1rem',
          },
        },
        enableSorting: false,
        cell: (props) => (
          <TemplateOverflowMenuButton
            template={props.row.original as any}
            onDeleteStart={loadingState.action.on}
            onDeleted={handleDeleted}
            onRefetch={onRefetch}
          />
        ),
      }),
      columnHelper.accessor('splitTestState', {
        header: 'Status',
        id: 'splitTestState',
        sortingFn: sortBySplitTestState,
        enableSorting: true,
        meta: {
          column: { width: GUIDE_STATUS_COL_WIDTH },
        },
        cell: (props) => {
          const { splitTestState } = props.row.original;

          return (
            <Box display="flex" minH="22px">
              <SplitTestStatus state={splitTestState as SplitTestState} />
            </Box>
          );
        },
      }),
      NameColumn<SplitTest>({
        enabledInternalNames,
        useLink: true,
        isSplitTest: true,
        NameWrapper: ({ children, targets }) => {
          const usedAudienceEntityId = audienceRuleToAudience(
            targets.audiences as GroupTargetingSegment
          );

          const usedAudience = usedAudienceEntityId
            ? audiences.find((a) => a.entityId === usedAudienceEntityId)
            : null;

          return (
            <Popover
              trigger="hover"
              placement="bottom-start"
              lazyBehavior="unmount"
              openDelay={500}
              isLazy
            >
              <PopoverTrigger>
                <Box>{children}</Box>
              </PopoverTrigger>
              <PopoverContent w="370px" disableClickPropagation>
                <PopoverBody p="4">
                  <Box fontSize="sm" fontWeight="bold" mb="2">
                    Targeting rules:
                  </Box>
                  <AudienceRulesDisplay
                    targets={
                      (usedAudience?.targets ?? targets) as GroupTargeting
                    }
                    gap="4"
                    type={RulesDisplayType.plain}
                    hideBlockedAccounts
                    compact
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          );
        },
      }),
      columnHelper.display({
        header: 'Guides in test',
        id: 'guides',
        meta: {
          column: {
            width: '440px',
          },
        },
        enableSorting: false,
        cell: (props) => {
          const splitTest = props.row.original;
          const targetsByName = splitTest.splitTargets.map((t) => ({
            privateOrPublicName: guidePrivateOrPublicNameOrFallback(
              enabledInternalNames,
              t
            ),
          }));

          return (
            <>
              <InformationTags
                elements={targetsByName}
                labelKeys={['privateOrPublicName']}
                fallbackText="No guide"
              />
            </>
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
      DistanceToNowColumn<SplitTest>('lastUsedAt', 'Last launched'),
    ],
    [
      splitTests,
      enabledInternalNames,
      audiences,
      handleDeleted,
      onRefetch,
      loadingState,
    ]
  );

  return (
    <DataTable<SplitTest>
      data={splitTests as SplitTest[]}
      columns={columns}
      boxProps={{
        className: 'table-renderer-with-action-menu',
      }}
      useAutoSort
    />
  );
}

/**
 * This will fetch templates of type 'split-test'.
 */
export const LIBRARY_SPLIT_TESTS_QUERY = graphql`
  query LibrarySplitTestsQuery($category: GuideCategoryEnumType!) {
    templates(category: $category) {
      type
      state
      splitTestState
      name
      isAutoLaunchEnabled
      entityId
      lastUsedAt
      splitTargets {
        entityId
        designType
        name
        privateName
        theme
        formFactor
        description
      }
      editedAt
      editedBy {
        fullName
        email
      }
      ...TemplateOverflowMenuButton_template
      ...Template_targets @relay(mask: false)
    }
  }
`;

export default function LibrarySplitTestsQueryRenderer() {
  return (
    <>
      <QueryRenderer<LibrarySplitTestsQuery>
        query={LIBRARY_SPLIT_TESTS_QUERY}
        variables={{
          category: GuideCategory.splitTest,
        }}
        render={({ props, retry }) => {
          return props ? (
            <GuideResetToastProvider>
              <TargetingAudienceProvider>
                <LibrarySplitTests onRefetch={retry} {...props} />
              </TargetingAudienceProvider>
            </GuideResetToastProvider>
          ) : (
            <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} />
          );
        }}
      />
    </>
  );
}
