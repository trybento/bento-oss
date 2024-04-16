import { graphql } from 'react-relay';

import { CustomerGuideBasesQuery } from 'relay-types/CustomerGuideBasesQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query CustomerGuideBasesQuery($entityId: EntityId!) {
    account: findAccount(entityId: $entityId) {
      name
      entityId
      archived
      guideBases {
        accountGuide {
          entityId
        }
        isCyoa
        activatedAt
        entityId
        isTargetedForSplitTesting
        isModifiedFromTemplate
        averageCompletionPercentage
        type
        createdFromTemplate {
          name
          privateName
          entityId
        }
        state
        wasAutoLaunched
        guideModuleBases {
          hasBranchingStep
          hasInputStep
        }
        type
        formFactor
        isSideQuest
        theme
        designType
        averageCompletionPercentage
        averageStepsViewed
        averageStepsCompleted
        participantsWhoViewedCount
        ...GuideBaseOverflowMenuButton_guideBase @relay(mask: false)
      }
    }
  }
`;

type Args = CustomerGuideBasesQuery['variables'];

export default function commit({
  entityId,
}: Args): Promise<CustomerGuideBasesQuery['response']> {
  const variables: CustomerGuideBasesQuery['variables'] = {
    entityId,
  };

  return fetchQuery({
    query,
    variables,
    doNotRetain: true,
    options: { fetchPolicy: 'network-only' },
  });
}
