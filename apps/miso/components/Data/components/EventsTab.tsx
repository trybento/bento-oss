import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  Tag,
  TagLabel,
  HStack,
  InputGroup,
  Flex,
  Text,
  InputRightElement,
  Button,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import CheckIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import TargetingIcon from '@mui/icons-material/TrackChanges';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  useTable,
  useSortBy,
  CellProps,
  TableState,
  TableOptions,
} from 'react-table';

import { SOURCE_LABELS } from 'bento-common/data/helpers';
import Icon from 'system/Icon';
import Link from 'system/Link';
import Tooltip from 'system/Tooltip';
import TableRenderer, {
  BentoLoadingSpinner,
  emptyHeader,
} from 'components/TableRenderer';

import QueryRenderer from 'components/QueryRenderer';
import { EventsTabQuery } from 'relay-types/EventsTabQuery.graphql';
import { graphql } from 'react-relay';
import {
  getSortFormatted,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import { tagStyle } from 'components/Library/InformationTags';
import { EventAutocompleteUsagePopover } from './EventUsagePopover';
import { ICON_STYLE, UsageLabels } from './data.helpers';
import EventDetailsModal from './EventDetailModal';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import SearchIcon from '@mui/icons-material/Search';
import TextField from 'components/common/InputFields/TextField';
import { EmptyTablePlaceholderProps } from 'components/EmptyTablePlaceholder/EmptyTablePlaceholder';
import colors from 'helpers/colors';

const USE_POPOVER = true;

interface EventsTabProps {
  onRefetch: () => void;
  customApiEvents: EventsTabQuery['response']['customApiEvents'];
}

type CustomApiEvent = EventsTabQuery['response']['customApiEvents'][number];
type EventWithUsage = CustomApiEvent & { usage: UsageLabels[] };

const EventsTable: React.FC<{
  customApiEvents: EventsTabQuery['response']['customApiEvents'];
  viewEventDetail?: (entityId: string) => void;
}> = ({ customApiEvents, viewEventDetail }) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const filteredCustomApiEvents = useMemo(() => {
    const _customApiEvents = customApiEvents || [];
    const _searchValue = searchValue.toLowerCase();
    return _searchValue
      ? _customApiEvents.filter((e) =>
          (e.name || '').toLowerCase().includes(_searchValue)
        )
      : _customApiEvents;
  }, [customApiEvents, searchValue]);

  const data = useMemo(
    () =>
      filteredCustomApiEvents.map(({ mappedToAutocomplete, ...rest }) => {
        const usage: UsageLabels[] = [];

        if (mappedToAutocomplete) usage.push(UsageLabels.autocomplete);

        return { usage, ...rest };
      }) || [],
    [filteredCustomApiEvents]
  ) as object[];

  const columns = React.useMemo(
    () => [
      emptyHeader,
      {
        Header: 'Event name',
        accessor: 'name',
        canSort: true,
        sortType: (a, b) => {
          /* Needs to sort w/ type prefix in mind */
          const compiledA = a.original.name.toLowerCase();
          const compiledB = b.original.name.toLowerCase();
          return compiledA < compiledB ? -1 : 1;
        },
        Cell: (cellData: CellProps<EventWithUsage>) => {
          const ev = cellData.row.original!;

          if (!ev.lastSeen) return ev.name;

          return (
            <Tooltip label="See last event" placement="top">
              <Link onClick={() => viewEventDetail(ev.entityId)}>
                {ev.name}
              </Link>
            </Tooltip>
          );
        },
      },
      {
        Header: 'Source',
        accessor: 'source',
        canSort: true,
        Cell: (cellData: CellProps<EventWithUsage>) => {
          const event = cellData.row.original!;
          return SOURCE_LABELS[event.source] || '-';
        },
      },
      {
        Header: 'Last received',
        accessor: 'lastSeen',
        canSort: true,
        Cell: (cellData: CellProps<EventWithUsage>) => {
          const lastUsedAt = cellData.row.original!.lastSeen;

          let displayedTime = '-';
          if (lastUsedAt) {
            displayedTime = formatDistanceToNowStrict(
              new Date(lastUsedAt as string),
              { addSuffix: true }
            );
          }

          return displayedTime;
        },
      },
      {
        Header: 'Usage',
        accessor: 'usage',
        sortType: (a, b) => {
          const aLen = a.original.usage as UsageLabels[];
          const bLen = b.original.usage as UsageLabels[];

          return aLen.join().length > bLen.join().length ? -1 : 1;
        },
        Cell: (cellData: CellProps<EventWithUsage>) => {
          const customApiEvent = cellData.row.original!;

          return (
            <>
              {customApiEvent.usage.map((u: UsageLabels) =>
                USE_POPOVER ? (
                  <Popover
                    key={`${customApiEvent.entityId}-${u}`}
                    trigger="hover"
                    isLazy
                  >
                    <PopoverTrigger>
                      <HStack display="flex" flexWrap="wrap" w="fit-content">
                        <Tag
                          key={`usage-tag-${u}`}
                          colorScheme="gray"
                          borderRadius="full"
                          size="sm"
                          style={tagStyle}
                        >
                          <TagLabel display="flex" alignItems="center">
                            <Icon
                              style={ICON_STYLE}
                              color="#4A5568"
                              mr="1"
                              as={
                                u === UsageLabels.autocomplete
                                  ? CheckIcon
                                  : TargetingIcon
                              }
                            />
                            {u}
                          </TagLabel>
                        </Tag>
                      </HStack>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverBody>
                        <EventAutocompleteUsagePopover
                          eventEntityId={customApiEvent.entityId}
                        />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Tag
                    key={`usage-tag-${u}`}
                    colorScheme="gray"
                    borderRadius="full"
                    size="sm"
                    style={tagStyle}
                  >
                    <TagLabel display="flex" alignItems="center">
                      <Icon
                        style={ICON_STYLE}
                        color="#4A5568"
                        mr="1"
                        as={
                          u === UsageLabels.autocomplete
                            ? CheckIcon
                            : TargetingIcon
                        }
                      />
                      {u}
                    </TagLabel>
                  </Tag>
                )
              )}
            </>
          );
        },
      },
    ],
    [customApiEvents?.length]
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: getSortFormatted(TableType.allAttributes),
      } as Partial<TableState>,
    } as TableOptions<object>,
    useSortBy
  );

  const tablePlaceholder: EmptyTablePlaceholderProps = useMemo(
    () => ({
      text: (
        <Text color={colors.text.secondary}>
          {searchValue
            ? 'No results based on the search'
            : 'As you add integrations or add autocomplete on button click for steps, your tracked events will show here'}
        </Text>
      ),
      Button: searchValue
        ? null
        : () => (
            <NextLink href="/data-and-integrations?tab=integrations" passHref>
              <Button as="a" variant="secondary">
                View integrations
              </Button>
            </NextLink>
          ),
    }),
    [filteredCustomApiEvents.length, searchValue]
  );

  return (
    <Flex flexDir="column" gap="6">
      <InputGroup maxW="sm">
        <TextField
          placeholder="Search by event name"
          borderColor="#E3E8F0"
          defaultValue=""
          fontSize="sm"
          onChange={setSearchValue}
        />
        <InputRightElement pointerEvents="none" color="gray.600">
          <SearchIcon width={20} height={20} />
        </InputRightElement>
      </InputGroup>
      <TableRenderer
        type={TableType.allAttributes}
        tableInstance={tableInstance}
        placeholder={tablePlaceholder}
        bg={filteredCustomApiEvents.length > 0 ? undefined : 'gray.50'}
        gridTemplateColumns={`
            300px
						140px
						150px
            1fr
          `}
      />
    </Flex>
  );
};

const EventsTab: React.FC<EventsTabProps> = ({ customApiEvents }) => {
  const [eventDetailEntityId, setEventDetailEntityId] = useState<string>(null);

  const handleCloseEventDetailModal = useCallback(() => {
    setEventDetailEntityId(null);
  }, []);

  if (!customApiEvents) return null;

  return (
    <>
      <EventsTable
        customApiEvents={customApiEvents}
        viewEventDetail={setEventDetailEntityId}
      />
      <EventDetailsModal
        eventEntityId={eventDetailEntityId}
        onClose={handleCloseEventDetailModal}
      />
    </>
  );
};

const EVENTS_TAB_QUERY = graphql`
  query EventsTabQuery {
    customApiEvents(type: event, excludeBentoEvents: true) {
      entityId
      name
      type
      source
      mappedToAutocomplete
      lastSeen
    }
  }
`;

export default function EventsTabQueryRenderer(_cProps) {
  return (
    <QueryRenderer<EventsTabQuery>
      query={EVENTS_TAB_QUERY}
      fetchPolicy="store-and-network"
      render={({ props, retry }) => {
        return props ? (
          <EventsTab {...props} onRefetch={retry} />
        ) : (
          <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} h="70vh" />
        );
      }}
    />
  );
}
