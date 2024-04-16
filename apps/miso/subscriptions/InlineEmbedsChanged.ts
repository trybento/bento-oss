import { graphql } from 'react-relay';

// Note: Using 'findStepPrototype' to allow relay to parse the right queryResult.
const inlineEmbedsChangedSubscription = graphql`
  subscription InlineEmbedsChangedSubscription {
    inlineEmbeds: inlineEmbedsChanged {
      ...InlineEmbed_inlineEmbedsWithTemplateId @relay(mask: false)
    }
  }
`;
export default inlineEmbedsChangedSubscription;
