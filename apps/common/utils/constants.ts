import {
  GuideDesignType,
  GuideHeaderCloseIcon,
  GuideHeaderProgressBar,
  Theme,
  VisualTagHighlightType,
} from './../types/index';
import { CompletionStyle, GuideHeaderType } from '../types';
import { $enum } from 'ts-enum-util';

export const BENTO_COMPONENTS = [
  'bento-embed',
  'bento-sidebar',
  'bento-context',
  'bento-visual-tag',
  'bento-modal',
  'bento-banner',
];

export const INJECTABLES_CONTAINER_ID = 'bentoInjectablesContainer';

export const FAKE_ELEMENT_HTML = '<div id="noop"></div>';

export const isGuideEligibleForTagTargeting = (
  designType: GuideDesignType | undefined | null
) => designType === GuideDesignType.everboarding;

export const DEFAULT_CYOA_TITLE = 'Choose Your Own Adventure';
export const DEFAULT_CYOA_QUESTION =
  'Which of these best matches your use case?';

export const COMPLETION_STYLE_CLASSES = {
  [CompletionStyle.lineThrough]: 'line-through',
  [CompletionStyle.grayedOut]: 'text-gray-400',
};

export const GUIDE_HEADER_TYPES: GuideHeaderType[] = [
  GuideHeaderType.bright,
  GuideHeaderType.classic,
  GuideHeaderType.striped,
  GuideHeaderType.simple,
];

export const GUIDE_HEADER_CLOSE_ICONS: GuideHeaderCloseIcon[] =
  $enum(GuideHeaderCloseIcon).getValues();

export const GUIDE_HEADER_CLOSE_ICON_LABELS: Record<
  GuideHeaderCloseIcon,
  string
> = {
  [GuideHeaderCloseIcon.downArrow]: 'Chevron',
  [GuideHeaderCloseIcon.x]: 'X',
  [GuideHeaderCloseIcon.minimize]: 'Minimize',
};

export const PROGRESS_BAR_STYLES: GuideHeaderProgressBar[] = $enum(
  GuideHeaderProgressBar
).getValues();

export const ELEMENT_HIGHLIGHT_TYPES: VisualTagHighlightType[] = $enum(
  VisualTagHighlightType
).getValues();

export const DEFAULT_TAG_TEXT = 'New';

/** Test accounts generated from Chrome Extension/other tools */
export const EXT_TEST_ACCOUNTS = [
  'Bento Test (E)',
  'Bento Test (M)',
  'Bento Test (D)',
  'Bento Test (C)',
  'Bento Test (J)',
  /** Used by Artillery */
  'Bento Load Test',
];

/** Attr value on account to make server recognize an extension login */
export const EXT_ATTRIBUTE_VALUE = 'iamanonigiri';

export const INLINE_CONTEXT_FORM_FACTOR_PREFIX = 'inline-';

/**
 * "unset" priority ranking that we will re-assign,
 * and also serves as a fallback for when we're not able to compute
 * a guide's priority ranking (aka orderIdex).
 */
export const DEFAULT_PRIORITY_RANKING = 999;

/** Show available guides back button if length is greater than this */
export const AVAILABLE_GUIDES_CUTOFF = 1;

export const CTA_DEFAULT_EVENT_NAME = 'action_name';

export const CYOA_THEME = Theme.nested;

export const DEFAULT_ALLOTTED_GUIDES = 3;

/** Allowed event throughput per org */
export const DEFAULT_EVENT_RATE_LIMIT = 10000;
/**
 * If this template will propagate to over this amount of guides,
 *   we should block the editor
 */
export const PROPAGATION_COUNT_THRESHOLD = 500;

/** Allowed usage of GPT for step content per org */
export const STEP_GPT_USAGE_LIMIT = 100;

/** Org slug that manages the templates */
export const INTERNAL_TEMPLATE_ORG = 'bentotemplates';

export const MULTI_ANSWER_INPUT_SEPARATOR = '|||';

/**
 * How much to weigh the priority ranking vs. guide launch
 * NOTE: guide launch diff is in ms so the smaller this is, the closer the guide launches
 * have to be for pRanking to take effect.
 */
export const PRIORITY_RANK_MODIFIER = 10000;

export const actionMenuWidthPx = 28;
