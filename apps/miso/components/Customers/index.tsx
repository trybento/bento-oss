import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { graphql } from 'react-relay';
import Search from '@mui/icons-material/Search';
import { Flex } from '@chakra-ui/react';

import { noop } from 'bento-common/utils/functions';

import QueryRenderer from 'components/QueryRenderer';
import CustomersTable from './CustomersTable';
import { CustomersQuery } from 'relay-types/CustomersQuery.graphql';
import updateSearchParam from 'utils/updateSearchParam';
import TableRendererProvider from 'components/TableRenderer/TableRendererProvider';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import TextField from 'components/common/InputFields/TextField';
import Page from 'components/layout/Page';

export type OrderByType = 'name';

export type OrderDirectionType = 'asc' | 'desc';

type CustomersQueryResponse = CustomersQuery['response'];

export enum AssignedToUserSpecialOptions {
  All = 'all',
  None = 'none',
}
interface CustomersProps extends CustomersQueryResponse {
  /** @deprecated does not seem to be used */
  onRefetch?: () => void;
}

function Customers(props: CustomersProps) {
  const { organization } = props;

  if (!organization) {
    throw 'Organization not found';
  }

  const router = useRouter();
  const { accountName: queryAccountName } = router.query;

  const defaultSearchQuery = (queryAccountName as string) || '';

  const [searchQuery, setSearchQuery] = useState<string>(defaultSearchQuery);

  const [searchQueryInputValue, setSearchQueryInputValue] =
    useState<string>(defaultSearchQuery);

  const handleUrlKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newValue = (e.target as HTMLInputElement).value;
      setSearchQueryInputValue(newValue);
      setSearchQuery(newValue);
    }
  }, []);

  useEffect(() => {
    updateSearchParam(router, 'accountName', searchQuery);
  }, [searchQuery]);

  return (
    <Page title="Customers">
      <TextField
        width="xs"
        onChange={noop}
        onKeyDown={handleUrlKeyDown}
        fontSize="sm"
        defaultValue={searchQueryInputValue}
        placeholder="Search by account name or ID"
        helperText="Press enter to search"
        helperTextProps={{
          fontSize: 'xs',
        }}
        inputLeftElement={<Search style={{ width: '18px' }} />}
      />
      <Flex mt="10">
        <TableRendererProvider>
          <CustomersTable searchQuery={searchQuery} />
        </TableRendererProvider>
      </Flex>
    </Page>
  );
}

export const CUSTOMERS_QUERY = graphql`
  query CustomersQuery {
    organization {
      slug
    }
  }
`;

export default function CustomersQueryRenderer() {
  return (
    <QueryRenderer<CustomersQuery>
      query={CUSTOMERS_QUERY}
      variables={{}}
      render={({ props }) =>
        props ? (
          <Customers {...props} />
        ) : (
          <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} />
        )
      }
    />
  );
}
