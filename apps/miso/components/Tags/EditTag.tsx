import { useEffect } from 'react';
import { graphql } from 'react-relay';
import pick from 'lodash/pick';
import {
  StepEntityId,
  TaggedElement,
} from 'bento-common/types/globalShoyuState';
import { tooltipTitleForGuide } from 'bento-common/data/helpers';
import {
  WysiwygEditorType,
  WysiwygEditorMode,
  GuidePageTargetingType,
} from 'bento-common/types';
import { loadTagEditor } from 'components/ContextTagEditor/editor';
import { fullGuidePreviewData } from 'components/ContextTagEditor/constants';
import { getAllTaggedElementsForPreview, getTagEditorModes } from './helpers';
import {
  ClientStorage,
  readFromClientStorage,
} from 'bento-common/utils/clientStorage';
import { WYSIWYG_EDITOR_MOCKED_ATTRIBUTES } from 'components/WysiwygEditor/constants';
import {
  applyMockedAttributes,
  MockedAttributes,
} from 'hooks/useMockAttributes';
import { templateToGuideTransformer } from 'components/Library/LibraryTemplates/LibraryTemplatePreview/preview.helpers';
import { isModalGuide, isFlowGuide } from 'bento-common/utils/formFactor';
import {
  StepPrototypeValue,
  TemplateValue,
} from 'bento-common/types/templateData';

graphql`
  fragment EditTag_taggedElementStyle on VisualTagStyleSettings {
    ... on VisualTagHighlightSettings {
      type
      pulse
      color
      thickness
      padding
      radius
      opacity
      text
    }
  }
`;

graphql`
  fragment EditTag_taggedElement on StepPrototypeTaggedElement {
    entityId
    type
    url
    wildcardUrl
    alignment
    xOffset
    yOffset
    relativeToText
    elementSelector
    elementText
    elementHtml
    tooltipAlignment
    style {
      ...EditTag_taggedElementStyle @relay(mask: false)
    }
  }
`;

graphql`
  fragment EditTag_taggedElementBase on GuideBaseStepTaggedElement {
    entityId
    type
    url
    wildcardUrl
    alignment
    xOffset
    yOffset
    relativeToText
    elementSelector
    tooltipAlignment
    style {
      ...EditTag_taggedElementStyle @relay(mask: false)
    }
  }
`;

type EditTagProps = {
  visualBuilderSessionEntityId: string;
  mode: WysiwygEditorMode;
  templateData: TemplateValue;
  stepPrototype: StepPrototypeValue;
  viewOnly?: boolean;
};

export default function EditTag({
  visualBuilderSessionEntityId,
  mode,
  templateData,
  stepPrototype,
  viewOnly,
}: EditTagProps) {
  const isFlow = isFlowGuide(templateData.formFactor);

  const currentMode = viewOnly
    ? WysiwygEditorMode.preview
    : Object.values(WysiwygEditorMode).includes(mode)
    ? mode
    : WysiwygEditorMode.customize;

  const mockedAttributes = readFromClientStorage<MockedAttributes>(
    ClientStorage.sessionStorage,
    WYSIWYG_EDITOR_MOCKED_ATTRIBUTES
  );

  const guide = templateData
    ? templateToGuideTransformer(
        applyMockedAttributes(templateData, mockedAttributes),
        isFlow ? stepPrototype?.entityId : undefined
      )
    : fullGuidePreviewData;

  const taggedElement: TaggedElement = {
    ...(stepPrototype || templateData).taggedElements[0],
    tooltipTitle: tooltipTitleForGuide(stepPrototype, guide),
    guide: guide.entityId,
    step: stepPrototype?.entityId,
  };

  if (isModalGuide(guide.formFactor)) {
    guide.pageTargetingType = GuidePageTargetingType.visualTag;
  } else if (isFlow && stepPrototype?.entityId) {
    guide.firstIncompleteStep = stepPrototype?.entityId as StepEntityId;
  }

  useEffect(() => {
    loadTagEditor({
      visualBuilderSessionEntityId,
      initialState: {
        data: {
          taggedElement,
          guide,
          allTaggedElements: getAllTaggedElementsForPreview(
            templateData,
            taggedElement
          ),
        },
        ...(pick(taggedElement, [
          'url',
          'wildcardUrl',
          'elementSelector',
          'elementText',
          'elementHtml',
        ]) as {
          url: string;
          wildcardUrl: string;
          elementSelector: string;
          elementText?: string;
          elementHtml?: string;
        }),
        mode: currentMode,
        modes: getTagEditorModes(templateData),
        type: WysiwygEditorType.tagEditor,
        viewOnly,
      },
    });
  }, []);

  return null;
}
