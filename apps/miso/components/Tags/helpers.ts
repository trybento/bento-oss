import { TagEditorData, WysiwygEditorMode } from 'bento-common/types';
import {
  ContextTagAlignment,
  ContextTagTooltipAlignment,
  ContextTagType,
  TaggedElement,
} from 'bento-common/types/globalShoyuState';
import { isFlowGuide, isTooltipGuide } from 'bento-common/utils/formFactor';
import { TemplateValue } from 'bento-common/types/templateData';
import { getFakeUuidTagEntityId } from 'bento-common/data/fullGuide';

export const getNewTag = (
  overrides: Partial<TagEditorData['taggedElement']> = {}
) =>
  ({
    alignment: ContextTagAlignment.topRight,
    relativeToText: false,
    tooltipAlignment: ContextTagTooltipAlignment.right,
    type: ContextTagType.dot,
    xOffset: 0,
    yOffset: 0,
    style: null,
    ...overrides,
  } as TagEditorData['taggedElement']);

export const getTagEditorModes = (template: TemplateValue) => [
  WysiwygEditorMode.navigate,
  WysiwygEditorMode.selectElement,
  WysiwygEditorMode.confirmElement,
  WysiwygEditorMode.customize,
  ...(isTooltipGuide(template.formFactor) || isFlowGuide(template.formFactor)
    ? [WysiwygEditorMode.customizeContent]
    : []),
  WysiwygEditorMode.preview,
];

/**
 * Returns the URL of the previous tagged element
 * in a Flow guide for the step reference, useful
 * to prefill the entry point of the WYSIWYG editor.
 */
export function getDefaultFlowGuideUrl(
  templateData: TemplateValue,
  stepPrototypeEntityId: string | undefined
): string | undefined {
  const steps = templateData.modules[0]?.stepPrototypes || [];
  const stepIndex = steps.findIndex((s) => {
    return stepPrototypeEntityId === s.entityId;
  });

  return stepIndex < 1
    ? undefined
    : steps[stepIndex - 1]?.taggedElements?.[0]?.url;
}

/**
 * Formats tags to be shown in the WYSIWYG preview.
 */
export function prepareTaggedElementForPreview(
  tag: any,
  index: number,
  stepEntityId?: string,
  guideEntityId?: string
) {
  return {
    ...tag,
    entityId: tag?.entityId || getFakeUuidTagEntityId(),
    step: stepEntityId || tag.step,
    guide: guideEntityId || tag.guide,
  };
}

/**
 * Returns all tagged elements that are supported
 * to preview depending on the guide type.
 * Guides that support all tags:
 * - Flow.
 */
export function getAllTaggedElementsForPreview(
  templateData: TemplateValue,
  selectedTagData: TaggedElement
): TaggedElement[] {
  if (!isFlowGuide(templateData.formFactor)) {
    return [prepareTaggedElementForPreview(selectedTagData, 0)];
  }

  // Add step tags.
  const tags =
    templateData.modules[0]?.stepPrototypes.flatMap((s, i) => {
      const tag =
        selectedTagData.step === s.entityId
          ? selectedTagData
          : s.taggedElements?.[0];

      return tag
        ? [
            prepareTaggedElementForPreview(
              tag,
              i,
              s.entityId,
              templateData.entityId
            ),
          ]
        : [];
    }) || [];

  // Add guide tags.
  if (selectedTagData.guide && !selectedTagData.step) {
    tags.push(selectedTagData);
  }
  return tags;
}
