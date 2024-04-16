import { GuideDesignType, GuideFormFactor } from 'bento-common/types';
import {
  ContextTagAlignment,
  ContextTagTooltipAlignment,
  ContextTagType,
  TaggedElement,
  TaggedElementEntityId,
} from 'bento-common/types/globalShoyuState';

const sampleTooltipTaggedElement: Omit<TaggedElement, 'guide'> = {
  entityId: 'a15d7526-2622-4f4e-816e-c823c26eb191' as TaggedElementEntityId,
  wildcardUrl: 'https://trybento.co',
  elementSelector: '#brand',
  type: ContextTagType.dot,
  alignment: ContextTagAlignment.bottomRight,
  xOffset: 0,
  yOffset: 0,
  tooltipAlignment: ContextTagTooltipAlignment.bottom,
  tooltipTitle: 'Sample tooltip',
  isSideQuest: true,
  designType: GuideDesignType.everboarding,
  formFactor: GuideFormFactor.tooltip,
  relativeToText: true,
  isPreview: true,
  dismissedAt: undefined,
};

export default sampleTooltipTaggedElement;
