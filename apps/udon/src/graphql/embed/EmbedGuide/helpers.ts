import { Guide } from 'src/data/models/Guide.model';

export function getGuideIndex(guides: Guide[], guide: Guide) {
  return guides.findIndex((g) => g.id === guide.id);
}

export function getRelativeGuide(
  guides: Guide[],
  guide: Guide,
  offset: number
): Guide | undefined {
  const guideIndex = getGuideIndex(guides, guide);
  const relativeGuideIndex = guideIndex + offset;
  if (
    guideIndex === -1 ||
    relativeGuideIndex >= guides.length ||
    relativeGuideIndex < 0
  ) {
    return undefined;
  }
  return guides[guideIndex + offset];
}

export function getPreviousGuide(guides: Guide[], guide: Guide) {
  return getRelativeGuide(guides, guide, -1);
}
export function getNextGuide(guides: Guide[], guide: Guide) {
  return getRelativeGuide(guides, guide, 1);
}
