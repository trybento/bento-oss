import { graphql } from 'react-relay';

import { TemplateStyleTabQuery } from 'relay-types/TemplateStyleTabQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query TemplateStyleTabQuery(
    $templateEntityId: EntityId!
    $templateEntityIds: [EntityId!]
    $moduleEntityIds: [EntityId!]
  ) {
    uiSettings {
      primaryColorHex
      secondaryColorHex
      fontColorHex
      theme
      cyoaOptionBackgroundColor
      embedCustomCss
      isCyoaOptionBackgroundColorDark
      inlineContextualStyle {
        borderRadius
        borderColor
        padding
      }
      modalsStyle {
        paddingX
        paddingY
        shadow
        borderRadius
        backgroundOverlayColor
        backgroundOverlayOpacity
      }
      tooltipsStyle {
        paddingX
        paddingY
        shadow
        borderRadius
      }
      ctasStyle {
        paddingX
        paddingY
        fontSize
        lineHeight
        borderRadius
      }
      bannersStyle {
        padding
        shadow
        borderRadius
      }
      responsiveVisibility {
        all
      }
      cyoaTextColor
      borderColor
    }
    previewTemplate: findTemplate(entityId: $templateEntityId) {
      taggedElements {
        entityId
        type
        style {
          ...EditTag_taggedElementStyle @relay(mask: false)
        }
      }
      inlineEmbed {
        alignment
        maxWidth
      }
    }
    ...Root_branchingTargets @relay(mask: false)
  }
`;

type Args = TemplateStyleTabQuery['variables'];

export default function commit(
  variables: Args
): Promise<TemplateStyleTabQuery['response']> {
  if (!variables.templateEntityId) return null;

  return fetchQuery({
    query,
    variables,
    doNotRetain: true,
  });
}
