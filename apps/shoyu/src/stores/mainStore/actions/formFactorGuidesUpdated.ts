import { $enum } from 'ts-enum-util';
import { EmbedFormFactorsForGuideFormFactor } from 'bento-common/data/helpers';
import { EmbedFormFactor, GuideFormFactor } from 'bento-common/types';
import {
  FormFactorStateKey,
  GlobalStateActionPayload,
  Guide,
  GuideEntityId,
} from 'bento-common/types/globalShoyuState';
import { getInlineEmbedIdFromFormFactor } from 'bento-common/utils/formFactor';
import { keyBy } from 'bento-common/utils/lodash';

import {
  formFactorSelector,
  inlineEmbedSelector,
  selectedGuideForFormFactorSelector,
  selectedModuleForFormFactorSelector,
  selectedStepForFormFactorSelector,
} from '../helpers/selectors';
import { WorkingState } from '../types';
import { isEverboardingInline } from '../helpers';
import formFactorCreated from './formFactorCreated';

type GuidesByFormFactorMap = { [key in FormFactorStateKey]: GuideEntityId[] };

export const groupGuidesByFormFactorAllowed = (
  guides: Guide[]
): GuidesByFormFactorMap => {
  const guidesByFormFactor = guides.reduce(
    (map, guide) => {
      EmbedFormFactorsForGuideFormFactor[guide.formFactor]?.forEach(
        (formFactor) => map[formFactor].push(guide.entityId)
      );
      return map;
    },
    Object.fromEntries<GuideEntityId[]>(
      $enum(EmbedFormFactor)
        .getValues()
        .map((formFactor) => [formFactor, []])
    ) as GuidesByFormFactorMap
  );
  return guidesByFormFactor;
};

export default function formFactorGuidesUpdated(
  state: WorkingState,
  {
    formFactor,
    formFactorStateKey,
    keepExistingSelections,
    guides,
  }: GlobalStateActionPayload<'formFactorGuidesUpdated'>
) {
  const guideMap = guides ? keyBy(guides, 'entityId') : state.guides;
  // reconstruct form factor states from the availableGuides
  const guidesGroupedByFormFactor = groupGuidesByFormFactorAllowed(
    Object.values<Guide>(guideMap)
  );
  const formFactorGuides = guidesGroupedByFormFactor[formFactor];
  const inlineEmbedId = getInlineEmbedIdFromFormFactor(formFactorStateKey);

  let formFactorState = formFactorSelector(state, formFactorStateKey);
  if (!formFactorState) {
    formFactorCreated(state, {
      id: formFactorStateKey,
      formFactor,
      guides: [],
      isPreview: false,
      sidebarStateId: inlineEmbedId,
    });
    formFactorState = formFactorSelector(state, formFactorStateKey);
  }

  if (isEverboardingInline(state, formFactorStateKey)) {
    // everboarding inline embeds can only ever show 1 guide so make sure
    // that guide actually exists
    const inlineEmbedGuideEntityId = inlineEmbedSelector(state, inlineEmbedId)!
      .guide!;
    formFactorState!.guides = [inlineEmbedGuideEntityId];
    formFactorState!.selectedGuide = inlineEmbedGuideEntityId;
    formFactorState!.selectedAt = new Date();
  } else {
    if (formFactor === EmbedFormFactor.inline) {
      formFactorState!.guides = formFactorGuides.filter((g) => {
        const guide = guideMap[g];
        return (
          guide.formFactor !== GuideFormFactor.inline || !guide.isSideQuest
        );
      });
    } else {
      formFactorState!.guides = formFactorGuides;
    }

    /**
     * If the current form factor has at least an initial guide selected,
     * set the selected guide/module/step to the initial selection.
     */
    if (
      ![EmbedFormFactor.modal, EmbedFormFactor.banner].includes(formFactor) &&
      !keepExistingSelections &&
      !formFactorState!.initialGuide
    ) {
      formFactorState!.selectedGuide = selectedGuideForFormFactorSelector(
        state,
        formFactor
      )?.entityId;
      formFactorState!.selectedModule = selectedModuleForFormFactorSelector(
        state,
        formFactor
      )?.entityId;
      formFactorState!.selectedStep = selectedStepForFormFactorSelector(
        state,
        formFactor
      )?.entityId;
      formFactorState!.selectedAt = new Date();
    }
  }
}
