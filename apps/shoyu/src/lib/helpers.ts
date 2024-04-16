import {
  FullGuide,
  Guide,
  GuidePageTargeting,
  MediaReference,
  NpsSurvey,
  Step,
  StepCTA,
  TaggedElement,
} from 'bento-common/types/globalShoyuState';
import {
  GuidePageTargetingType,
  BentoSettings,
  WysiwygEditorType,
  StepType,
  AttributeValueType,
  InlineContextualGuideStyles,
  InlineContextualStyle,
} from 'bento-common/types';
import {
  getButtonClickUrlTarget,
  getParsedMediaMeta,
  getParsedMediaSettings,
  MAX_STEP_CTA_TEXT_LENGTH,
} from 'bento-common/data/helpers';
import { isTargetPage } from 'bento-common/utils/urls';
import {
  ButtonElement,
  DynamicAttributeBlockElement,
  ImageElement,
  SlateBodyElement,
  VideoElement,
} from 'bento-common/types/slate';
import { MediaType } from 'bento-common/types/media';
import { videoSourceToNodeType } from 'bento-common/utils/bodySlate';
import { INJECTABLES_CONTAINER_ID } from 'bento-common/utils/constants';
import { NpsPageTargetingType } from 'bento-common/types/netPromoterScore';
import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';

import {
  WYSIWYG_EDITOR_BASE_URL,
  WYSIWYG_TYPES_TO_ROUTE_MAP,
} from './constants';
import { canRedirect } from '../stores/mainStore/actions/destinationGuideLaunched';
import { pxToNumber } from 'bento-common/frontend/htmlElementHelpers';

/** Create wait time when we don't have a clear async resolve */
export const sleep = (time: number) =>
  new Promise<void>((res) => setTimeout(res, time));

export const isLocalhost = (() =>
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1')();

export function addAlpha(originalColor, alpha) {
  const alphaFixed = Math.round(alpha * 255);
  let alphaHex = alphaFixed.toString(16);
  if (alphaHex.length === 1) {
    alphaHex = '0' + alphaHex;
  }
  return originalColor + alphaHex;
}

export function px(value: number): string {
  return `${value}px`;
}

export function branchingAlignment(bodySlate: any[] = []) {
  return bodySlate?.length ? bodySlate[bodySlate.length - 1]?.alignment : {};
}

export const isBranching = (stepType?: null | StepType | Step) =>
  stepType === StepType.branching || stepType === StepType.branchingOptional;

export const isRequired = (stepType?: StepType | null) =>
  stepType === StepType.required || stepType === StepType.branching;

export const extractTargetingDetails = (
  guide: Guide | FullGuide
): GuidePageTargeting => {
  return (
    guide.pageTargeting || {
      type: guide.pageTargetingType,
      url: guide.pageTargetingUrl,
    }
  );
};

/**
 * Checks whether a given guide matches targeting criteria based on the current page.
 *
 * Returns true if guide targets any page or if current page satisfies its targeting, regardless
 * of it being targeted by page or visual tag.
 *
 * WARNING: If guide is targeted by visual tag, the associated tagged element is required
 * in order to determine whether the criteria is satisfied. Not providing it will throw an error.
 */
export function guideTargetingMatches(
  guide: Guide | FullGuide | undefined,
  pageUrl: string | null | undefined,
  tag?: TaggedElement
) {
  if (!guide) {
    return false;
  }

  // normalized targeting in favor of the new type
  const targeting = extractTargetingDetails(guide);

  switch (targeting.type) {
    case GuidePageTargetingType.anyPage:
      return true;

    case GuidePageTargetingType.specificPage:
      return isTargetPage(pageUrl, targeting.url || '');

    case GuidePageTargetingType.visualTag:
      if (!tag) return false;
      return (
        tag.guide === guide.entityId && isTargetPage(pageUrl, tag.wildcardUrl)
      );

    default:
      throw new Error(`Guide targeting type not supported: ${targeting.type}`);
  }
}

export function surveyTargetingMatches(
  survey: NpsSurvey,
  pageUrl: string | undefined
) {
  switch (survey.pageTargeting.type) {
    case NpsPageTargetingType.anyPage:
      return true;

    case NpsPageTargetingType.specificPage:
      return isTargetPage(pageUrl, survey.pageTargeting.url || '');

    default:
      throw new Error(
        `Survey targeting type not supported: ${survey.pageTargeting.type}`
      );
  }
}

export const injectableQuerySelector = (elSelector: string) => {
  return `#${INJECTABLES_CONTAINER_ID} > ${elSelector}`;
};

export const objToQueryString = (params: { [key: string]: string }) =>
  Object.keys(params).length === 0
    ? ''
    : '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

/** ms to wait before client tries reconnecting; staggered */
export const RECONNECT_DELAY = isLocalhost
  ? 0
  : (Math.random() * (120 - 5) + 5) * 1000;

/**
 * Returns all data within `window.bentoSettings`, including
 * the initialization data (provided by the Customer) and every
 * other data that might have been created by us afterwards.
 */
export const getBentoSettings = (): BentoSettings | undefined => {
  return window.bentoSettings;
};

export const getCtaFullWidth = (
  ctas: (ButtonElement | StepCTA)[] | undefined
): boolean =>
  (ctas || []).reduce(
    (charCount, cta) =>
      charCount +
      ((cta.type === 'button' ? cta.buttonText : cta.text) || '').length,
    0
  ) >
  (MAX_STEP_CTA_TEXT_LENGTH - 5) * 2;

export const getWysiwygEditorUrl = (type: WysiwygEditorType) =>
  `${WYSIWYG_EDITOR_BASE_URL}${WYSIWYG_TYPES_TO_ROUTE_MAP[type]}`;

/**
 * Redirects the page to the given URL
 */
export const navigateToUrl = (
  url: string | null | undefined,
  newWindow = false
) => {
  if (url) {
    /**
     * Although we don't allow redirecting on wildcard URLs, we still escape things
     * like `?`'s for query strings. Therefore, we need to remove these AFTER we've
     * validated there's no actual wildcards.
     */
    const cleanedUrl = wildcardUrlToDisplayUrl(url);

    if (newWindow) {
      window.open(cleanedUrl, '_blank');
    } else {
      window.location.assign(cleanedUrl);
    }
  }
};

/**
 * Opens the URL on a new tab or perform a page redirect.
 *
 * NOTE: Returning `-1` means it failed and measures can be taken by the caller to
 * gracefully handle the failure.
 *
 * The redirect may fail for various reasons, but more likely due to URL containing wildcards,
 * regexps or missing dynamic attributes.
 */
export function handleButtonClickUrl(
  /** Destination url */
  redirectUrl: string | undefined,
  /** Current application URL. Used to determine whether we need to redirect */
  appUrl?: string,
  /** Whether to open in a new tab */
  opensInNewTab?: boolean
): void | 0 | -1 {
  if (!redirectUrl) return 0;

  // if the current page matches the destination, do nothing...
  if (!opensInNewTab && isTargetPage(appUrl, redirectUrl)) return 0;

  if (!canRedirect(redirectUrl)) {
    // eslint-disable-next-line no-console
    console.error('[BENTO] Unable to redirect to invalid URL:', redirectUrl);
    return -1;
  }

  try {
    const target = getButtonClickUrlTarget(redirectUrl, window.location.host);
    if (opensInNewTab || (opensInNewTab === undefined && target === '_blank')) {
      return navigateToUrl(redirectUrl, true);
    }

    return navigateToUrl(redirectUrl);
  } catch (innerError) {
    // URL may have parsed dynamic attributes that
    // are not valid characters.
    // eslint-disable-next-line no-console
    console.error('[BENTO] Error when redirecting to URL:', redirectUrl);
    // eslint-disable-next-line no-console
    console.error(innerError);
    return -1;
  }
}

export const previewFilterFactory = (isPreview: boolean) => {
  return (g: Guide) =>
    g.isPreview === isPreview || (!isPreview && g.isPreview === undefined);
};

export const mediaReferencesToNodes = (
  mediaReferences: MediaReference[] | undefined | null
) => {
  if (!mediaReferences?.length) return [];

  return mediaReferences.reduce((acc, mr) => {
    const commonFields = {
      children: [{ text: '', type: 'text' }] as SlateBodyElement[],
      id: mr.entityId,
    };
    const { imageSettings, videoSettings, numberAttributeSettings } =
      getParsedMediaSettings(mr.settings);
    const { imageMeta, videoMeta } = getParsedMediaMeta(mr.media?.meta);

    switch (mr.media.type) {
      case MediaType.numberAttribute: {
        if (mr.media.url) {
          const metricNode: DynamicAttributeBlockElement = {
            ...commonFields,
            type: 'dynamic-attribute-block',
            valueType: AttributeValueType.number,
            color: numberAttributeSettings?.color,
            size: numberAttributeSettings?.size,
            text: mr.media.url,
          };

          acc.push(metricNode);
        }

        break;
      }

      case MediaType.video: {
        if (videoMeta?.videoId) {
          const videoNode: VideoElement = {
            ...commonFields,
            videoId: videoMeta.videoId,
            type: videoSourceToNodeType(
              videoMeta.videoType
            ) as VideoElement['type'],
            playsInline: videoSettings?.playsInline,
            alignment: videoSettings?.alignment,
          };

          acc.push(videoNode);
        }

        break;
      }

      case MediaType.image: {
        if (mr.media.url) {
          const imageNode: ImageElement = {
            ...commonFields,
            url: mr.media.url,
            type: mr.media.type,
            lightboxDisabled: imageSettings?.lightboxDisabled,
            hyperlink: imageSettings?.hyperlink || '',
            alignment: imageSettings?.alignment,
            fill: imageSettings?.fill,
            naturalHeight: imageMeta?.naturalHeight,
            naturalWidth: imageMeta?.naturalWidth,
          };

          acc.push(imageNode);
        }

        break;
      }

      default: {
        // eslint-disable-next-line
        console.warn(
          `[BENTO] Media type '${mr.media.type}' not implemented, skipping node.`
        );
        break;
      }
    }

    return acc;
  }, [] as (VideoElement | ImageElement | DynamicAttributeBlockElement)[]);
};

/**
 * Checks referrer to determine whether we're coming from Bento.
 *
 * NOTE: This is based on whether the referral URL starts with the `VITE_PUBLIC_CLIENT_URL_BASE` env value.
 */
export const isComingFromBento = () => {
  return document.referrer.startsWith(process.env.VITE_PUBLIC_CLIENT_URL_BASE!);
};

/**
 * Fetch basic position and dimension info for related elements
 */
export const getBoundingRects = (
  tooltipEl: HTMLElement,
  tagEl: HTMLElement
) => {
  const tagRect = tagEl.getBoundingClientRect();
  const tooltipRect = tooltipEl.getBoundingClientRect();
  const containerRect = tooltipEl.parentElement?.getBoundingClientRect();

  return {
    tagRect,
    tooltipRect,
    containerRect,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
  };
};

export const getInlineContextPadding = (
  formFactorStyle: InlineContextualGuideStyles,
  inlineContextualStyle: InlineContextualStyle
) => {
  let paddings: number[] = [];
  if (
    formFactorStyle?.advancedPadding &&
    formFactorStyle.advancedPadding.trim() !== ''
  ) {
    const parts = formFactorStyle.advancedPadding
      .trim()
      .split(' ')
      .map(pxToNumber);
    if (parts.length === 1) {
      paddings = Array(4).fill(parts[0]);
    } else if (parts.length === 2) {
      paddings = [parts[0], parts[1], parts[0], parts[1]];
    } else if (parts.length === 3) {
      paddings = [parts[0], parts[1], parts[2], parts[1]];
    } else {
      paddings = parts;
    }
  } else if (formFactorStyle?.padding) {
    paddings = Array(4).fill(formFactorStyle.padding);
  } else if (inlineContextualStyle) {
    paddings = Array(4).fill(inlineContextualStyle.padding);
  }
  if (paddings.length === 4) {
    return { t: paddings[0], r: paddings[1], b: paddings[2], l: paddings[3] };
  }
  return null;
};
