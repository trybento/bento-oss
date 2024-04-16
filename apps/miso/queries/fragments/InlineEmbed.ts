import { graphql } from 'react-relay';

graphql`
  fragment InlineEmbed_inlineEmbedTargetingRule on InlineEmbedTargetingRule {
    attribute
    ruleType
    valueType
    value
  }

  fragment InlineEmbed_inlineEmbedTargetingRules on InlineEmbedTargetingRule
  @relay(plural: true) {
    ...InlineEmbed_inlineEmbedTargetingRule @relay(mask: false)
  }

  fragment InlineEmbed_inlineEmbed on OrganizationInlineEmbed {
    entityId
    url
    wildcardUrl
    elementSelector
    position
    topMargin
    rightMargin
    bottomMargin
    padding
    borderRadius
    leftMargin
    alignment
    maxWidth
    targeting {
      account {
        type
        rules {
          ...InlineEmbed_inlineEmbedTargetingRules @relay(mask: false)
        }
        grouping
      }
      accountUser {
        type
        rules {
          ...InlineEmbed_inlineEmbedTargetingRules @relay(mask: false)
        }
        grouping
      }
    }
    state
  }

  fragment InlineEmbed_inlineEmbedWithTemplate on OrganizationInlineEmbed {
    ...InlineEmbed_inlineEmbed @relay(mask: false)
    template {
      ...Template_template @relay(mask: false)
    }
  }

  fragment InlineEmbed_inlineEmbedWithTemplateId on OrganizationInlineEmbed {
    ...InlineEmbed_inlineEmbed @relay(mask: false)
    template {
      entityId
    }
  }

  fragment InlineEmbed_inlineEmbeds on OrganizationInlineEmbed
  @relay(plural: true) {
    ...InlineEmbed_inlineEmbed @relay(mask: false)
  }

  fragment InlineEmbed_inlineEmbedsWithTemplate on OrganizationInlineEmbed
  @relay(plural: true) {
    ...InlineEmbed_inlineEmbedWithTemplateId @relay(mask: false)
  }

  fragment InlineEmbed_inlineEmbedsWithTemplateId on OrganizationInlineEmbed
  @relay(plural: true) {
    ...InlineEmbed_inlineEmbedWithTemplateId @relay(mask: false)
  }
`;
