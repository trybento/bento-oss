import { graphql } from 'react-relay';

import { NpsDetailsQuery } from 'relay-types/NpsDetailsQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query NpsDetailsQuery($npsEntityId: EntityId!) {
    npsSurvey(entityId: $npsEntityId) {
      entityId
      name
      question
      state
      fupType
      deletedAt
      fupSettings
      endingType
      launchedAt
      endAt
      startingType
      startAt
      priorityRanking
      endAfterTotalAnswers
      repeatInterval
      pageTargeting {
        type
        url
      }
      targets
    }
  }
`;

type Args = NpsDetailsQuery['variables'];

export default function commit({
  npsEntityId,
}: Args): Promise<NpsDetailsQuery['response']> {
  const variables: NpsDetailsQuery['variables'] = {
    npsEntityId,
  };

  return fetchQuery({ query, variables, doNotRetain: true });
}
