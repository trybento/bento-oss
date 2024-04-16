import { graphql } from 'react-relay';

// Note: Using 'findStepPrototype' to allow relay to parse the right queryResult.
const onboardingInlineEmbedsChangedSubscription = graphql`
  subscription OnboardingInlineEmbedsChangedSubscription {
    inlineEmbeds: onboardingInlineEmbedsChanged {
      ...InlineEmbed_inlineEmbedsWithTemplateId @relay(mask: false)
    }
  }
`;
export default onboardingInlineEmbedsChangedSubscription;
