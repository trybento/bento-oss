import { Theme } from '../types';
import { FullGuide } from '../types/globalShoyuState';
import placeholderCompactGuide from './placeholderCompactGuide';
import placeholderFlatGuide from './placeholderFlatGuide';
import placeholderCardGuide from './placeholderCardGuide';
import placeholderNestedGuide from './placeholderNestedGuide';
import placeholderTimelineGuide from './placeholderTimelineGuide';
import placeholderCarouselGuide from './placeholderCarouselGuide';
import placeholderVideoGalleryGuide from './placeholderVideoGalleryGuide';
import { addStepsToSampleGuide } from '../utils/templates';

const placeholderGuide: { [k in Theme]: FullGuide } = {
  [Theme.nested]: placeholderNestedGuide as FullGuide,
  [Theme.flat]: placeholderFlatGuide as FullGuide,
  [Theme.compact]: placeholderCompactGuide as FullGuide,
  [Theme.timeline]: placeholderTimelineGuide as FullGuide,
  [Theme.card]: placeholderCardGuide as FullGuide,
  [Theme.carousel]: placeholderCarouselGuide as FullGuide,
  [Theme.videoGallery]: placeholderVideoGalleryGuide as FullGuide,
};

export const getPlaceholderGuide = (t: Theme) =>
  addStepsToSampleGuide(placeholderGuide[t]);

export const isPlaceholderGuide = (
  guideEntityId: string | null | undefined
): boolean =>
  !!guideEntityId &&
  Object.values(placeholderGuide).some((g) => g.entityId === guideEntityId);
