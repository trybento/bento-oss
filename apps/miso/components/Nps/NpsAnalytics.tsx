import React from 'react';
import { Flex } from '@chakra-ui/react';
import NpsAnalyticsStatistics from './NpsAnalyticsStatistics';
import NpsAnalyticsAccountsTable from './NpsAnalyticsAccountsTable';
import { useTableRenderer } from 'components/TableRenderer/TableRendererProvider';
import { graphql } from 'react-relay';
import { TableType } from 'components/TableRenderer/tables.helpers';
import { useFetchQuery } from 'hooks/useFetchQuery';
import { NpsAnalyticsStatisticsQuery } from 'relay-types/NpsAnalyticsStatisticsQuery.graphql';
import { SuspendedQueryRenderer } from 'components/QueryRenderer';
import {
  BentoLoadingSpinner,
  TABLE_ROWS_PER_PAGE,
} from 'components/TableRenderer';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';

interface Props {
  npsSurveyEntityId: string;
}

const NPS_ANALYTICS_STATISTICS_QUERY = graphql`
  query NpsAnalyticsStatisticsQuery($entityId: EntityId!) {
    npsSurvey(entityId: $entityId) {
      name
      totalViews
      scoreBreakdown {
        responses
        promoters
        passives
        detractors
        score
      }
    }
  }
`;

const NpsAnalytics: React.FC<Props> = ({ npsSurveyEntityId }) => {
  const { data } = useFetchQuery<NpsAnalyticsStatisticsQuery>({
    query: NPS_ANALYTICS_STATISTICS_QUERY,
    variables: { entityId: npsSurveyEntityId },
  });
  const { selectedSorting } = useTableRenderer();
  const { id: orderBy, direction: orderDirection } =
    selectedSorting[TableType.npsSurveyAccounts] || {};

  return (
    <SuspendedQueryRenderer
      query={graphql`
        query NpsAnalyticsAccountsTableQuery(
          $first: Int
          $after: String
          $last: Int
          $before: String
          $orderBy: NpsSurveyAccountsOrderBy
          $orderDirection: OrderDirection
          $npsSurveyEntityId: EntityId!
        ) {
          ...NpsAnalyticsAccountsTable_query
        }
      `}
      variables={{
        first: TABLE_ROWS_PER_PAGE,
        orderBy,
        orderDirection,
        npsSurveyEntityId,
      }}
      fetchPolicy="store-and-network"
      render={({ props }) => {
        if (!data || !data.npsSurvey || !props) {
          return <BentoLoadingSpinner h="60vh" size={TABLE_SPINNER_SIZE} />;
        }

        return (
          <Flex flexDirection="column" gap={10}>
            <NpsAnalyticsStatistics data={data} />
            <NpsAnalyticsAccountsTable query={props} />
          </Flex>
        );
      }}
    />
  );
};

export default NpsAnalytics;
