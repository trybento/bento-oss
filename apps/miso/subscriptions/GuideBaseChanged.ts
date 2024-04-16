import { requestSubscription, graphql } from 'react-relay';

import { relayEnvironment } from 'utils/relay';

const subscription = graphql`
  subscription GuideBaseChangedSubscription($guideBaseEntityId: EntityId!) {
    guideBase: guideBaseChanged(guideBaseEntityId: $guideBaseEntityId) {
      guideModuleBases {
        guideStepBases {
          bodySlate
        }
      }
      ...EditUserGuideBase_guideBase
    }
  }
`;

export function subscribe({ guideBaseEntityId }) {
  return requestSubscription(
    relayEnvironment, // see Environment docs
    {
      subscription,
      variables: { guideBaseEntityId },
      // optional but recommended:
      onCompleted: () => {
        /* server closed the subscription */
      },
      updater: () => {},
      onError: (error) => console.error(error),
    }
  );
}
