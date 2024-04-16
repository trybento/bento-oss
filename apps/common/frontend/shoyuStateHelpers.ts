import { $enum } from 'ts-enum-util';
import { View } from '../types/shoyuUIState';
import { capitalizeFirstLetter } from '../utils/strings';

export const activeGuidesViews = [
  View.activeGuides,
  View.allOnboardingGuides,
  View.previousOnboardingGuides,
  View.previousAnnouncements,
];

export function isActiveGuidesView(view: View) {
  return activeGuidesViews.some((v) => view === v);
}

export function isTicketView(view: View) {
  return view === View.ticketForm;
}

export function isKbArticleView(view: View) {
  return view === View.kbArticle;
}

export function isActiveGuidesSubView(view: View) {
  return isActiveGuidesView(view) && view !== View.activeGuides;
}

export function isGuideView(view: View) {
  return view === View.guide;
}

export function isStepView(view: View) {
  return view === View.step;
}

type ViewFlags = {
  isStepView: boolean;
  isGuideView: boolean;
  isActiveGuidesView: boolean;
  isAllOnboardingGuidesView: boolean;
  isPreviousOnboardingGuidesView: boolean;
  isPreviousAnnouncementsView: boolean;
};

export function getViewFlags(view: View): ViewFlags {
  return Object.fromEntries(
    $enum(View)
      .getEntries()
      .map(([key, value]) => [
        `is${capitalizeFirstLetter(key)}View`,
        value === view,
      ])
  ) as ViewFlags;
}
