import React, { useMemo, useState, useCallback } from 'react';
import { graphql } from 'react-relay';
import {
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  Tag,
  TagLabel,
  HStack,
  Flex,
  InputRightElement,
  InputGroup,
  Button,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import {
  useTable,
  useSortBy,
  CellProps,
  TableState,
  TableOptions,
} from 'react-table';
import CheckIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import TargetingIcon from '@mui/icons-material/TrackChanges';

import { AttributeType, TargetValueType, DataSource } from 'bento-common/types';
import Icon from 'system/Icon';
import useToast from 'hooks/useToast';
import TableRenderer, {
  ACTION_MENU_COL_ID,
  BentoLoadingSpinner,
} from 'components/TableRenderer';
import InformationTags from 'components/Library/InformationTags';

import QueryRenderer from 'components/QueryRenderer';
import { AttributesTabQuery } from 'relay-types/AttributesTabQuery.graphql';
import {
  getSortFormatted,
  TableType,
} from 'components/TableRenderer/tables.helpers';
import { tagStyle } from 'components/Library/InformationTags';
import {
  AttributeAutocompleteUsagePopover,
  AttributeAutolaunchUsagePopover,
} from './AttributeUsagePopover';
import { SOURCE_LABELS } from 'bento-common/data/helpers';
import { ICON_STYLE, isDefaultAttribute, UsageLabels } from './data.helpers';
import DeleteButton from 'system/DeleteButton';
import ConfirmDeleteModal from 'components/ConfirmDeleteModal';
import * as DeleteAttributeMutation from 'mutations/DeleteAttribute';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import SearchIcon from '@mui/icons-material/Search';
import TextField from 'components/common/InputFields/TextField';
import { EmptyTablePlaceholderProps } from 'components/EmptyTablePlaceholder/EmptyTablePlaceholder';
import colors from 'helpers/colors';
import CsvImportModal from './CsvImportModal';
import useToggleState from 'hooks/useToggleState';

const USE_POPOVER = true;

interface AttributesTabProps {
  onRefetch: () => void;
  attributes: AttributesTabQuery['response']['attributes'];
}

type Attribute = AttributesTabQuery['response']['attributes'][number];

const prefix = (name = '-', type: Attribute['type']) =>
  `${type === AttributeType.account ? 'Account' : 'User'}: ${name}`;

type AttributeWithUsage = Attribute & { usage: UsageLabels[] };

const VALUE_TYPE_LABELS: Record<TargetValueType, string> = {
  [TargetValueType.boolean]: TargetValueType.boolean,
  [TargetValueType.branchingPath]: TargetValueType.branchingPath,
  [TargetValueType.date]: TargetValueType.date,
  [TargetValueType.number]: TargetValueType.number,
  [TargetValueType.stringArray]: 'text list',
  [TargetValueType.template]: TargetValueType.template,
  [TargetValueType.text]: TargetValueType.text,
};

const AttributesTable: React.FC<{
  attributes: AttributesTabQuery['response']['attributes'];
  searchValue?: string;
  onRefetch?: () => void;
}> = ({ attributes, searchValue, onRefetch }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [attributeToDelete, setAttributeToDelete] =
    useState<AttributeWithUsage>(null);

  const toast = useToast();

  const data = useMemo(
    () =>
      attributes.map(
        ({ mappedToAutocomplete, mappedToAutolaunch, ...rest }) => {
          const usage: UsageLabels[] = [];

          if (mappedToAutocomplete) usage.push(UsageLabels.autocomplete);
          if (mappedToAutolaunch) usage.push(UsageLabels.autolaunch);

          return { usage, ...rest };
        }
      ) || [],
    [attributes]
  ) as AttributeWithUsage[];

  const handleDeleteAttribute = useCallback(async () => {
    if (!attributeToDelete) return;

    try {
      await DeleteAttributeMutation.commit({
        entityId: attributeToDelete.entityId,
      });

      toast({
        title: 'Attribute deleted!',
        isClosable: true,
        status: 'success',
      });

      onRefetch?.();
    } catch (e) {
      const errorMsg = e.message || 'Something went wrong';

      toast({
        title: errorMsg,
        status: 'error',
        isClosable: true,
      });
    }
  }, [attributeToDelete, onRefetch]);

  const handleOpenDeleteModal = useCallback(
    (attribute: AttributeWithUsage) => () => {
      setIsDeleteModalOpen(true);
      setAttributeToDelete(attribute);
    },
    []
  );

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setAttributeToDelete(null);
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: ' ',
        id: ACTION_MENU_COL_ID,
        Cell: (cellData: CellProps<AttributeWithUsage>) => {
          const attribute = cellData.row.original!;

          const disableDelete =
            attribute.source === DataSource.bento ||
            isDefaultAttribute(attribute.type as AttributeType, attribute.name);

          return (
            <DeleteButton
              tooltip={
                disableDelete
                  ? 'Cannot delete core attributes'
                  : 'Delete attribute'
              }
              tooltipPlacement="top"
              height="20px"
              disabled={disableDelete}
              onClick={handleOpenDeleteModal(attribute)}
            />
          );
        },
      },
      {
        Header: 'Attribute name',
        accessor: 'name',
        canSort: true,
        sortType: (a, b) => {
          /* Needs to sort w/ type prefix in mind */
          const compiledA = prefix(a.original.name, a.original.type);
          const compiledB = prefix(b.original.name, b.original.type);
          return compiledA < compiledB ? -1 : 1;
        },
        Cell: (cellData: CellProps<AttributeWithUsage>) => {
          const attribute = cellData.row.original!;
          return prefix(attribute.name, attribute.type);
        },
      },
      {
        Header: 'Source',
        accessor: 'source',
        canSort: true,
        Cell: (cellData: CellProps<AttributeWithUsage>) =>
          SOURCE_LABELS[cellData.row.original!.source] || '-',
      },
      {
        Header: 'Type',
        accessor: 'valueType',
        canSort: true,
        Cell: (cellData: CellProps<AttributeWithUsage>) =>
          VALUE_TYPE_LABELS[cellData.row.original!.valueType] || '-',
      },
      {
        Header: 'Values',
        accessor: 'values',
        sortType: (a, b) => {
          const aLen = a.original.values;
          const bLen = b.original.values;

          return aLen.length < bLen.length ? -1 : 1;
        },
        Cell: (cellData: CellProps<AttributeWithUsage>) => {
          const attribute = cellData.row.original!;

          const { values } = attribute;

          if (values.length === 0)
            return <Text color="bento.errorText">No values passed in</Text>;

          return (
            <InformationTags
              elements={values.map((v) => ({ v }))}
              labelKeys={['v']}
              maxDisplayedElements={2}
              useEllipses
            />
          );
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
        Cell: (cellData: CellProps<AttributeWithUsage>) => {
          const attribute = cellData.row.original!;

          return (
            <>
              {attribute.usage.map((u: UsageLabels) =>
                USE_POPOVER ? (
                  <Popover
                    key={`${attribute.entityId}-${u}`}
                    trigger="hover"
                    isLazy
                  >
                    <PopoverTrigger>
                      <HStack display="flex" flexWrap="wrap">
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
                              color="text.secondary"
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
                        {u === UsageLabels.autocomplete ? (
                          <AttributeAutocompleteUsagePopover
                            attributeName={attribute.name}
                            attributeType={attribute.type as AttributeType}
                          />
                        ) : (
                          <AttributeAutolaunchUsagePopover
                            attributeName={attribute.name}
                            attributeType={attribute.type as AttributeType}
                          />
                        )}
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
                        color="text.secondary"
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
    [attributes?.length]
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
      Graphic: () => <Text />,
      text: (
        <Text color={colors.text.secondary}>
          {searchValue
            ? 'No results based on the search'
            : 'Once Bento is installed and as you add integrations, your available attributes will show here'}
        </Text>
      ),
      Button: searchValue
        ? null
        : () => (
            <NextLink href="/data-and-integrations?tab=integrations" passHref>
              <Button as="a" variant="secondary">
                View installation and integrations
              </Button>
            </NextLink>
          ),
    }),
    [attributes.length, searchValue]
  );

  return (
    <>
      <TableRenderer
        type={TableType.allAttributes}
        tableInstance={tableInstance}
        placeholder={tablePlaceholder}
        bg={attributes.length > 0 ? undefined : 'gray.50'}
        gridTemplateColumns={`
          300px
          140px
          95px
          minmax(200px, 400px)
          230px
        `}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteAttribute}
        entityName={`Attribute: ${attributeToDelete?.name || '-'}`}
        header="Delete attribute"
      >
        <Box mt="4">
          This will delete the attribute from this table and any targeting rule
          dropdowns. However, this attribute will be recreated if a user logs in
          and this attribute is still being passed in via your code.
        </Box>
      </ConfirmDeleteModal>
    </>
  );
};

const AttributesTab: React.FC<AttributesTabProps> = ({
  onRefetch,
  attributes,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const modalStates = useToggleState(['csvImport']);

  const filteredAttributes = useMemo(() => {
    const _attributes = attributes || [];
    const _searchValue = searchValue.toLowerCase();
    return _searchValue
      ? _attributes.filter((a) =>
          (a.name || '').toLowerCase().includes(_searchValue)
        )
      : _attributes;
  }, [attributes, searchValue]);

  if (!attributes) return null;

  return (
    <>
      <Flex flexDir="column" gap="6">
        <Flex gap={2}>
          <InputGroup maxW="sm">
            <TextField
              placeholder="Search by attribute name"
              borderColor="#E3E8F0"
              defaultValue=""
              fontSize="sm"
              onChange={setSearchValue}
            />

            <InputRightElement pointerEvents="none" color="gray.600">
              <SearchIcon width={20} height={20} />
            </InputRightElement>
          </InputGroup>
          <Button ml="auto" onClick={modalStates.csvImport.on}>
            Add attributes (CSV)
          </Button>
        </Flex>
        <AttributesTable
          attributes={filteredAttributes}
          onRefetch={onRefetch}
          searchValue={searchValue}
        />
      </Flex>
      <CsvImportModal
        isOpen={modalStates.csvImport.isOn}
        onClose={modalStates.csvImport.off}
        onComplete={onRefetch}
      />
    </>
  );
};

const ATTRIBUTES_TAB_QUERY = graphql`
  query AttributesTabQuery {
    attributes(fullList: true) {
      name
      entityId
      valueType
      type
      source
      mappedToAutolaunch
      mappedToAutocomplete
      values
    }
  }
`;

export default function AttributesTabQueryRenderer(_cProps) {
  return (
    <QueryRenderer<AttributesTabQuery>
      query={ATTRIBUTES_TAB_QUERY}
      fetchPolicy="store-and-network"
      render={({ props, retry }) => {
        return props ? (
          <AttributesTab {...props} onRefetch={retry} />
        ) : (
          <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} h="70vh" />
        );
      }}
    />
  );
}
