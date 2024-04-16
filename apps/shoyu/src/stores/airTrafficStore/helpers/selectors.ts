import { EmbedFormFactor } from 'bento-common/types';
import {
  EmbedTypenames,
  EmbedTypenamesToType,
  FormFactorStateKey,
  GuideEntityId,
  TaggedElementEntityId,
} from 'bento-common/types/globalShoyuState';
import { NpsFormFactor } from 'bento-common/types/netPromoterScore';
import { get, isNil } from 'bento-common/utils/lodash';

import { WorkingAirTrafficStore } from '../types';

export const isGuideShownSelector = (
  state: WorkingAirTrafficStore,
  guide: GuideEntityId
) => {
  return state.guidesShown.includes(guide);
};

export const guidesShownSelector = (state: WorkingAirTrafficStore) =>
  state.guidesShown;

export const lastDesiredStateSelector = (state: WorkingAirTrafficStore) =>
  state.desiredStateHistory.slice(-1)?.[0];

export const activeJourneySelector = (state: WorkingAirTrafficStore) =>
  state.activeJourney;

const contentToShowOrHideSelector = <T extends EmbedTypenames>(
  state: WorkingAirTrafficStore,
  /** Which visibility state we're targeting */
  visibility: 'show' | 'hide',
  /** Which content type we're targeting */
  type: T,
  /** Which form factor we're targeting (not preview ids) */
  formFactor?: Exclude<FormFactorStateKey, 'string'>
): EmbedTypenamesToType[T]['entityId'][] => {
  const path: string[] = [visibility, type];
  if (!isNil(formFactor)) {
    // get all guides of the given form factor
    return get(lastDesiredStateSelector(state), path.concat(formFactor!), []);
  }

  // get all guides, regardless of the form factor (flattened)
  return Object.values<EmbedTypenamesToType[T]['entityId']>(
    get(lastDesiredStateSelector(state), path, {})
  ).flat();
};

export const guidesToShowSelector = (
  state: WorkingAirTrafficStore,
  formFactor?: EmbedFormFactor
) =>
  contentToShowOrHideSelector(state, 'show', EmbedTypenames.guide, formFactor);

export const surveysToShowSelector = (
  state: WorkingAirTrafficStore,
  formFactor?: NpsFormFactor
) =>
  contentToShowOrHideSelector(
    state,
    'show',
    EmbedTypenames.npsSurvey,
    formFactor
  );

export const isSelectedGuideOfActiveJourneySelector = (
  state: WorkingAirTrafficStore,
  guide: GuideEntityId
) =>
  state.activeJourney?.type === EmbedTypenames.guide &&
  state.activeJourney?.selectedGuide === guide;

export const tagsAllowedToShowSelector = (
  state: WorkingAirTrafficStore
): TaggedElementEntityId[] => lastDesiredStateSelector(state)?.tags || [];
