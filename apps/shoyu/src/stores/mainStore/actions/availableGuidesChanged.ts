import { original } from 'immer';
import { $enum } from 'ts-enum-util';
import { normalize, NormalizedSchema } from 'normalizr';
import {
  FormFactorState,
  FormFactorStateKey,
  GlobalStateActionPayloads,
  Guide,
  GuideEntityId,
  TaggedElement,
  TaggedElementEntityId,
} from 'bento-common/types/globalShoyuState';
import { getEmbedFormFactorsForGuide } from 'bento-common/data/helpers';
import { EmbedFormFactor } from 'bento-common/types';
import { difference } from 'bento-common/utils/lodash';
import { isFlowGuide } from 'bento-common/utils/formFactor';

import schema from '../schema';
import { WorkingState } from '../types';
import formFactorGuidesUpdated from './formFactorGuidesUpdated';
import {
  cleanOrphanedItems,
  cleanOrphanedTaggedElements,
  mergeTaggedElements,
} from '../helpers';
import {
  formFactorSelector,
  incompleteOnboardingGuideSelector,
} from '../helpers/selectors';
import guideSelected from './guideSelected';

// TODO: Has to be a better way of specifing these types
type NormalizedData = NormalizedSchema<
  {
    guides: Record<GuideEntityId, Guide>;
    taggedElements: Record<TaggedElementEntityId, TaggedElement>;
  },
  GuideEntityId[]
>;

/**
 * When the available guides change, we need to:
 * 1. reconcile form factors state by rebuilding the list of form factors
 * 1.1. deselect the `selectedGuide/Module/Step` from form factors accordingly
 * 2. merge guides/modules/steps data if it's already in the store
 * 3. drop guides/modules/steps that became unavailable
 */
export default function availableGuidesChanged(
  state: WorkingState,
  {
    availableGuides,
    keepExistingSelections,
  }: GlobalStateActionPayloads['availableGuidesChanged']
) {
  const {
    result: _guideEntityIds,
    entities: { guides = {}, taggedElements = {} },
  } = normalize(availableGuides, [schema.guide]) as NormalizedData;

  const newGuidesEntityIds = Object.keys(guides) as GuideEntityId[];
  const newGuides = Object.values(guides);

  // Determine if this is for a specific preview
  const previewFormFactor = newGuides.some((guide) => guide.isPreview)
    ? (newGuides
        .map(
          (guide) =>
            Object.values<FormFactorState>(state.formFactors).find((ff) =>
              ff.guides.includes(guide.entityId)
            )?.id
        )
        .filter(Boolean)[0] as FormFactorStateKey | undefined)
    : undefined;
  const existingGuidesEntityIds = previewFormFactor
    ? original(state)!.formFactors[previewFormFactor].guides
    : Object.keys(state.guides);
  const initialLoad = existingGuidesEntityIds.length === 0;
  const missingGuideEntityIds = difference(
    existingGuidesEntityIds,
    newGuidesEntityIds
  );

  // get all guides currently being used within previews
  const oldPreviewGuideEntityIds = previewFormFactor
    ? []
    : Object.values<FormFactorState>(state.formFactors)
        .filter((ff) => ff.isPreview)
        .map((ff) => ff.guides)
        .flat();

  // remove guides which are no longer available
  for (const guideEntityId of missingGuideEntityIds) {
    // and not currently being used within preview ffs
    if (!oldPreviewGuideEntityIds.includes(guideEntityId as GuideEntityId)) {
      delete state.guides[guideEntityId];
    }
  }

  // add new or merge existing guide items
  for (const guideEntityId of newGuidesEntityIds) {
    const existingGuide: Guide | undefined = state.guides[guideEntityId];
    state.guides[guideEntityId] = {
      ...(existingGuide || {}),
      ...guides[guideEntityId],
    };
  }

  const formFactorsToUpdate = [
    ...new Set(
      previewFormFactor
        ? [previewFormFactor]
        : Object.values<FormFactorState>(state.formFactors)
            .filter((ff) => !ff.isPreview)
            .map((ff) => ff.id)
            // make sure we have all the default form factors even if they aren't
            // already initialized
            .concat($enum(EmbedFormFactor).getValues())
    ),
  ];
  for (const formFactor of formFactorsToUpdate) {
    formFactorGuidesUpdated(state, {
      formFactorStateKey: formFactor,
      formFactor:
        formFactorSelector(state, formFactor)?.formFactor ||
        (formFactor as EmbedFormFactor),
      keepExistingSelections,
      guides: newGuides,
    });
  }

  cleanOrphanedItems(state, newGuidesEntityIds);

  cleanOrphanedTaggedElements(
    state,
    newGuidesEntityIds,
    Object.keys(taggedElements) as TaggedElementEntityId[]
  );

  mergeTaggedElements(state, taggedElements);

  // Select the first available main guide for the inline and the current page
  // targeted context guide for the sidebar if this is the initial load or
  // some guides were removed
  if (initialLoad || missingGuideEntityIds.length > 0) {
    const guide = incompleteOnboardingGuideSelector(state, previewFormFactor);

    if (guide) {
      guideSelected(state, {
        guide: guide.entityId,
        keepExistingSelections,
        formFactor: getEmbedFormFactorsForGuide(guide, previewFormFactor)[0],
      });
    }
  }

  /**
   * Hydrate all CYOA guides to determine: progress, isSerialCyoa.
   * NOTE: Before, we were hydrating just the last CYOA guide. This
   * caused serial CYOA guides in progress to be lost if any if its branches
   * led to a new guide branch.
   *
   * @todo probably best to extract from the action in a subscriber
   */
  Object.values<Guide>(state.guides).forEach((g) => {
    if (g.isCyoa) state.hydrateGuide(g.entityId);
    if (isFlowGuide(g.formFactor)) state.hydrateGuide(g.entityId);
  });
}
