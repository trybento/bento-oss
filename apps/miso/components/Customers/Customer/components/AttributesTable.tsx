import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, CellProps } from 'react-table';
import { VStack, Flex } from '@chakra-ui/layout';
import Search from '@mui/icons-material/Search';

import { AttributeType } from 'bento-common/types';
import { SupportedAttributeValueTypes } from 'bento-common/types/targeting';

import TableRenderer, {
  emptyHeader,
  TableTextCell,
} from 'components/TableRenderer';
import { TableType } from 'components/TableRenderer/tables.helpers';

import Tooltip from 'system/Tooltip';
import useToast from 'hooks/useToast';
import TextField from 'components/common/InputFields/TextField';
import { copyToClipboard } from 'utils/helpers';
import H4 from 'system/H4';

type Props = {
  type: AttributeType;
  attributes: object;
};

type Attribute = { name: string; value: SupportedAttributeValueTypes };

export default function CustomerAttributesTable({ attributes, type }: Props) {
  const [filter, setFilter] = useState<string>(null);
  const toast = useToast();

  const data = useMemo(
    () =>
      Object.keys(attributes).reduce((a, k) => {
        if (filter && !k.toLowerCase().includes(filter.toLowerCase())) return a;
        a.push({ name: k, value: attributes[k] });
        return a;
      }, [] as Attribute[]) || [],
    [attributes, filter]
  );

  const copyAttributeToClipboard = React.useCallback((value: string) => {
    if (!value) return;

    copyToClipboard(value);
    toast({
      title: 'Attribute value copied!',
      isClosable: true,
      status: 'success',
    });
  }, []);

  const columns = useMemo(
    () => [
      emptyHeader,
      {
        Header: 'Attribute',
        id: 'name',
        canSort: true,
        Cell: (cellData: CellProps<Attribute>) => {
          const attr = cellData.row.original!.name;

          return attr;
        },
      },
      {
        Header: 'Value',
        id: 'value',
        canSort: true,
        Cell: (cellData: CellProps<Attribute>) => {
          const attr = String(cellData.row.original!.value ?? '-');

          return (
            <Tooltip label={attr + ' (Click to copy)'} placement="top">
              <TableTextCell
                type="primaryText"
                text={attr}
                cursor="pointer"
                overflow="hidden"
                textOverflow="ellipsis"
                onClick={() => copyAttributeToClipboard(attr)}
              />
            </Tooltip>
          );
        },
      },
    ],
    [data]
  );

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  return (
    <VStack w="full" minW="lg" h="70vh" alignItems="flex-start">
      <Flex w="full" alignItems="baseline" justifyContent="space-between">
        <H4>
          {type === AttributeType.account
            ? 'Account attributes'
            : 'User attributes'}
        </H4>
        {/* TODO: Don't use a Formik enabled component. Generates warnings */}
        <TextField
          w="xs"
          onChange={setFilter}
          label=""
          fontSize="sm"
          defaultValue={filter}
          placeholder={`Search ${
            type === AttributeType.account ? 'account' : 'user'
          } attributes...`}
          helperTextProps={{
            fontSize: 'xs',
          }}
          inputLeftElement={<Search style={{ width: '18px' }} />}
        />
      </Flex>
      <TableRenderer
        type={TableType.allAttributes}
        tableInstance={tableInstance}
        mt="2"
        gridTemplateColumns={`
					1fr
					1fr
				`}
        placeholder={{
          text: 'No data (yet!)',
        }}
        w="full"
      />
    </VStack>
  );
}
