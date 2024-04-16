import { BaseAnnouncementStyle } from 'bento-common/types';
import {
  GlobalStateActionPayloads,
  StepState,
  TaggedElement,
} from 'bento-common/types/globalShoyuState';
import {
  guideSelector,
  stepSelector,
  taggedElementOfGuideSelector,
  taggedElementOfStepSelector,
} from '../helpers/selectors';
import { getFormFactorFlags } from '../../../lib/formFactors';

import { WorkingState } from '../types';
import tagDismissed from './tagDismissed';
import stepChanged from './stepChanged';

/**
 * This is supposed to be called by ATC whenever a journey is automatically ended for a guide.
 *
 * Currently this should only affect Flows, Tooltips, Modals and Banners, given the other form
 * factors should automatically record dismissal in some other way.
 */
export default function guideJourneyEnded(
  state: WorkingState,
  payload: GlobalStateActionPayloads['guideJourneyEnded']
) {
  // If we ended the journey for a reason other than navigating away, do nothing.
  if (!payload.navigatedAway) return;

  const guide = guideSelector(payload.guide, state);
  const step = stepSelector(payload.step, state);

  // If the guide is not available or is preview, do nothing.
  if (!guide || guide?.isPreview) return;

  // If dismissing the guide isn't allowed, do nothing.
  if ((guide?.formFactorStyle as BaseAnnouncementStyle)?.canDismiss === false) {
    return;
  }

  const guideIs = getFormFactorFlags(guide.formFactor);

  let tag: TaggedElement | undefined = undefined;
  if (guideIs.isFlow) {
    tag = taggedElementOfStepSelector(state, guide.entityId, step?.entityId);
  } else if (guideIs.isTooltip) {
    tag = taggedElementOfGuideSelector(state, guide.entityId);
  }

  if (
    guideIs.isFlow ||
    guideIs.isTooltip ||
    guideIs.isModal ||
    guideIs.isBanner
  ) {
    // records tag dismissal
    if (tag) {
      tagDismissed(state, { tag: tag.entityId });
    }

    // records step as skipped
    if (step) {
      stepChanged(state, {
        step: {
          entityId: step!.entityId,
          state: StepState.skipped,
        },
      });
    }
  }
}
