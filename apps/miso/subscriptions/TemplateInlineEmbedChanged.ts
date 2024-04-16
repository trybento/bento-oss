import { graphql } from 'react-relay';

const templateInlineEmbedChangedSubscription = graphql`
  subscription TemplateInlineEmbedChangedSubscription(
    $templateEntityId: EntityId!
  ) {
    inlineEmbed: templateInlineEmbedChanged(
      templateEntityId: $templateEntityId
    ) {
      ...InlineEmbed_inlineEmbedWithTemplateId @relay(mask: false)
    }
  }
`;

export default templateInlineEmbedChangedSubscription;
