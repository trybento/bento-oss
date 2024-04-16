import { Box, BoxProps, Link } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { TemplateState, GuideTypeEnum } from 'bento-common/types';
import { GuideShape } from 'bento-common/types/globalShoyuState';
import { guidePrivateOrPublicNameOrFallback } from 'bento-common/utils/naming';
import GuideScope from 'components/common/GuideScope';
import GuideStatus, { GUIDE_STATUS_COL_WIDTH } from '../Library/TemplateStatus';
import {
  getGuideNotifications,
  NAME_COL_WIDTH,
  SCOPE_COL_WIDTH,
} from 'components/TableRenderer/tables.helpers';
import {
  guideComponentIcon,
  guideComponentLabel,
} from 'helpers/presentational';
import { pick } from 'lodash';
import NextLink from 'next/link';
import { CIRCULAR_BADGE_PX_SIZE } from 'system/CircularBadge';
import MessagesPopover from 'system/MessagesPopover';
import { TYPE_BG_COLOR } from 'bento-common/components/RichTextEditor/extensions/Callout/CalloutElement';
import Badge from 'system/Badge';
import { formatDistanceToNowStrict } from 'date-fns';

export function StateColumn<
  T extends {
    state: TemplateState;
    isTemplate?: boolean;
  }
>(): ColumnDef<T, any> {
  return {
    header: 'Status',
    id: 'state',
    accessorKey: 'state',
    enableSorting: true,
    meta: {
      column: { width: GUIDE_STATUS_COL_WIDTH },
    },
    cell: (props) => {
      const { state, isTemplate } = props.row.original;

      return (
        <Box display="flex" minH="22px">
          <GuideStatus state={state} isTemplate={isTemplate} />
        </Box>
      );
    },
  };
}

interface NameColumnProps<T> extends BoxProps {
  enabledInternalNames: boolean;
  useLink?: boolean;
  isSplitTest?: boolean;
  openInNew?: boolean;
  NameWrapper?: React.FC<React.PropsWithChildren<T>>;
}

export function NameColumn<
  T extends {
    name: string;
    privateName?: string;
    modules?: readonly any[];
    entityId: string;
    warnUnpublishedTag?: boolean;
    inlineEmbed?: any;
    // graphQL not generating types for DateTime
    archivedAt?: Date | unknown;
  }
>({
  useLink = false,
  enabledInternalNames,
  openInNew = false,
  isSplitTest = false,
  NameWrapper = ({ children }) => <>{children}</>,
  ...boxProps
}: NameColumnProps<T>): ColumnDef<T, any> {
  return {
    header: 'Name',
    id: 'name',
    accessorKey: 'name',
    enableSorting: true,
    meta: {
      column: { width: NAME_COL_WIDTH },
    },
    cell: (props) => {
      const template = props.row.original;
      const templateName = guidePrivateOrPublicNameOrFallback(
        enabledInternalNames,
        template
      );

      const notifications = getGuideNotifications(template);

      if (useLink) {
        return (
          <Box display="flex" alignItems="center" whiteSpace="normal">
            <NextLink
              href={`/library/${isSplitTest ? 'split-tests' : 'templates'}/${
                template.entityId
              }`}
              passHref
              target={openInNew ? '_blank' : undefined}
            >
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

export function ScopeColumn<
  T extends { type: string | GuideTypeEnum }
>(): ColumnDef<T, any> {
  return {
    header: 'Scope',
    id: 'scope',
    accessorKey: 'scope',
    enableSorting: true,
    meta: {
      column: { width: SCOPE_COL_WIDTH },
    },
    cell: (props) => (
      <GuideScope
        type={props.row.original?.type as GuideTypeEnum}
        borderRadius="full"
        backgroundColor={TYPE_BG_COLOR['themeless']}
        w={CIRCULAR_BADGE_PX_SIZE}
        h={CIRCULAR_BADGE_PX_SIZE}
      />
    ),
  };
}

export function GuideComponentColumn<T extends object>(): ColumnDef<T, any> {
  return {
    header: 'Component',
    id: 'component',
    accessorKey: 'designType',
    enableSorting: false,
    meta: {
      column: { width: '160px' },
    },
    cell: (props) => {
      const discoveryArgs = pick(props.row.original as GuideShape, [
        'designType',
        'formFactor',
        'theme',
        'isCyoa',
        'type',
      ]);

      const SvgIconElement = guideComponentIcon(discoveryArgs);
      const label = guideComponentLabel(discoveryArgs);

      return (
        <Badge
          label={label}
          icon={<SvgIconElement style={{ fontSize: '14px' }} />}
        />
      );
    },
  };
}

export function DistanceToNowColumn<T extends object>(
  accessor: Extract<keyof T, string>,
  header: string
): ColumnDef<T, any> {
  return {
    header,
    id: accessor,
    accessorKey: accessor,
    enableSorting: true,
    meta: {
      column: { width: '160px' },
    },
    cell: (props) => {
      const atValue = props.row.original[accessor];
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
