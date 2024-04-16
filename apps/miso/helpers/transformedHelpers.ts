import {
  isAnnouncement,
  isEverboarding,
  isOnboarding,
} from 'bento-common/data/helpers';
import { GuideDesignType, GuideFormFactor } from 'bento-common/types';
import {
  isFlowGuide,
  isTooltipGuide,
  isInlineGuide,
  isModalGuide,
  isBannerGuide,
  isSidebarGuide,
  isLegacyGuide,
} from 'bento-common/utils/formFactor';

/**
 * We're using these from EditTemplate but it should be same across all
 *   as they should be sourced from the same enum in udon
 */
import {
  GuideDesignTypeEnumType,
  GuideFormFactorEnumType,
} from 'relay-types/EditTemplateQuery.graphql';

/**
 * Accept a relay type enum and cast so we don't have to manually cast each time
 */
export const isDesignType: Record<
  GuideDesignType,
  (d: GuideDesignTypeEnumType) => boolean
> = {
  announcement: (designType) => isAnnouncement(designType as GuideDesignType),
  everboarding: (designType) => isEverboarding(designType as GuideDesignType),
  onboarding: (designType) => isOnboarding(designType as GuideDesignType),
};

/**
 * Accept a relay type enum and cast so we don't have to manually cast each time
 */
export const isFormFactor: Record<
  GuideFormFactor,
  (ff: GuideFormFactorEnumType) => boolean
> = {
  flow: (ff) => isFlowGuide(ff as GuideFormFactor),
  tooltip: (ff) => isTooltipGuide(ff as GuideFormFactor),
  inline: (ff) => isInlineGuide(ff as GuideFormFactor),
  modal: (ff) => isModalGuide(ff as GuideFormFactor),
  banner: (ff) => isBannerGuide(ff as GuideFormFactor),
  sidebar: (ff) => isSidebarGuide(ff as GuideFormFactor),
  inline_sidebar: (ff) => isLegacyGuide(ff as GuideFormFactor),
};
