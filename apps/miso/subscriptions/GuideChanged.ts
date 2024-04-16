import { requestSubscription, graphql } from 'react-relay';

import { relayEnvironment } from 'utils/relay';

export const GUIDE_CHANGED_ON_GUIDE_FRAGMENT = graphql`
  fragment GuideChanged_guide on Guide {
    entityId
    name
    state
    type
    createdFromTemplate {
      entityId
      name
    }
    account {
      entityId
      name
      attributes
      primaryContact {
        entityId
      }
    }
    guideModules {
      name
      entityId
      orderIndex
      createdFromModule {
        entityId
      }
      steps {
        name
        entityId
        body
        orderIndex
        completedAt
        completedByType
        stepType
        usersViewed {
          fullName
          email
        }
        completedByUser {
          fullName
          email
        }
        completedByAccountUser {
          fullName
          email
        }
        bodySlate
        isAutoCompletable
        createdFromStepPrototype {
          entityId
        }
      }
    }
  }
`;

const subscription = graphql`
  subscription GuideChangedSubscription($guideEntityId: EntityId!) {
    guide: guideChanged(guideEntityId: $guideEntityId) {
      ...GuideChanged_guide
    }
  }
`;

export function subscribe({ guideEntityId }) {
  return requestSubscription(
    relayEnvironment, // see Environment docs
    {
      subscription,
      variables: { guideEntityId },
      // optional but recommended:
      onCompleted: () => {
        /* server closed the subscription */
      },
      updater: () => {},
      onError: (error) => console.error(error),
    }
  );
}
