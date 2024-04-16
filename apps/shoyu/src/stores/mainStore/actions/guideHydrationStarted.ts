import { original } from 'immer';
import {
  GlobalStateActionPayload,
  GlobalStateActionPayloads,
  GuideHydrationState,
} from 'bento-common/types/globalShoyuState';
import { debugMessage } from 'bento-common/utils/debugging';

import { WorkingState } from '../types';
import { guideSelector, stepsSelectorOfGuide } from '../helpers/selectors';
import guideLoader from '../loaders/guideLoader';
import { isGuideHydrated, isGuideHydrating } from '../helpers';

export default function guideHydrationStarted(
  state: WorkingState,
  { guide: guideEntityId }: GlobalStateActionPayloads['guideHydrationStarted']
) {
  const existingGuide = guideSelector(guideEntityId, state);

  // skip hydration if preview or already hydrating/ed
  if (
    existingGuide?.isPreview ||
    isGuideHydrating(existingGuide) ||
    // theoretically, it should be impossible to have a hydrated guide without modules/steps
    // but since we manually mark that state in a few cases, it felt reasonable to cross-check
    // here and hydrate if steps are missing
    (isGuideHydrated(existingGuide) &&
      stepsSelectorOfGuide(guideEntityId, state)?.length > 0)
  ) {
    debugMessage('[BENTO] Skipping guide hydration', { guideEntityId });
    return;
  }

  // mark guide as being hydrated
  if (existingGuide) {
    existingGuide.hydrationState = GuideHydrationState.hydrating;
  }

  debugMessage('[BENTO] Hydrating guide', { guideEntityId });

  const originalDispatch = original(state)?.dispatch;

  // loads the guide (detached)
  guideLoader<GlobalStateActionPayload<'guideChanged'>>({
    guideEntityId,
  })
    ?.then((payload) => {
      if (payload?.guide) {
        originalDispatch?.({
          type: 'guideChanged',
          guide: payload?.guide,
        });
      } else {
        originalDispatch?.({
          type: 'guideHydrationFailed',
          guide: guideEntityId,
        });
      }
    })
    ?.catch((_err) => {
      originalDispatch?.({
        type: 'guideHydrationFailed',
        guide: guideEntityId,
      });
    });
}
