import { FormFactorStyle, GuideFormFactor, Theme } from 'bento-common/types';
import { getPlaceholderGuide } from 'bento-common/sampleGuides';
import { TemplateValue } from 'bento-common/types/templateData';
import { SlateBodyElement } from 'bento-common/types/slate';
import { FullGuide } from 'bento-common/types/globalShoyuState';
import { isVideoGalleryTheme } from 'bento-common/data/helpers';
import { isVideoNode } from 'bento-common/utils/bodySlate';
import {
  ClientStorage,
  readFromClientStorage,
} from 'bento-common/utils/clientStorage';

import { templateToGuideTransformer } from 'components/Library/LibraryTemplates/LibraryTemplatePreview/preview.helpers';
import { NewInlineInjectionQuery } from 'relay-types/NewInlineInjectionQuery.graphql';
import { WYSIWYG_EDITOR_MOCKED_ATTRIBUTES } from 'components/WysiwygEditor/constants';
import {
  applyMockedAttributes,
  MockedAttributes,
} from 'hooks/useMockAttributes';

export function getInlineInjectionPreviewGuide(
  uiSettings: NewInlineInjectionQuery['response']['uiSettings'],
  template?: TemplateValue
): FullGuide {
  let hasContent = false;

  for (const m of template?.modules || []) {
    for (const sp of m?.stepPrototypes || []) {
      if (
        (isVideoGalleryTheme(template.theme as Theme) &&
          isVideoNode(sp.bodySlate[0] as SlateBodyElement)) ||
        sp.bodySlate?.length > 1 ||
        sp.bodySlate?.[0]?.children[0].text !== ''
      ) {
        hasContent = true;
        break;
      }
    }
    if (hasContent) break;
  }
  const mockedAttributes = readFromClientStorage<MockedAttributes>(
    ClientStorage.sessionStorage,
    WYSIWYG_EDITOR_MOCKED_ATTRIBUTES
  );

  const guide = hasContent
    ? templateToGuideTransformer(
        applyMockedAttributes(template, mockedAttributes)
      )
    : getPlaceholderGuide((template?.theme || uiSettings.theme) as Theme);

  return {
    ...guide,
    isSideQuest: true,
    formFactor: GuideFormFactor.inline,
    formFactorStyle: (template?.formFactorStyle ||
      guide.formFactorStyle) as FormFactorStyle,
  };
}
