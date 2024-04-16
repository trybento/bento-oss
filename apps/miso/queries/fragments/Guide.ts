import { graphql } from 'react-relay';

export const GUIDE_FORM_FACTOR_STYLE_FRAGMENT = graphql`
  fragment Guide_formFactorStyle on FormFactorStyle {
    ... on BannerStyle {
      bannerType
      bannerPosition
      backgroundColor
      textColor
      canDismiss
      ctasOrientation
    }
    ... on ModalStyle {
      modalSize
      position
      hasBackgroundOverlay
      canDismiss
      backgroundColor
      textColor
      stepBodyOrientation
      mediaOrientation
      verticalMediaOrientation
      verticalMediaAlignment
      horizontalMediaAlignment
      ctasOrientation
      imageWidth
      mediaFontSize
      mediaTextColor
    }
    ... on TooltipStyle {
      backgroundColor
      backgroundOverlayColor
      backgroundOverlayOpacity
      hasArrow
      hasBackgroundOverlay
      textColor
      tooltipShowOn
      tooltipSize
      canDismiss
      stepBodyOrientation
      mediaOrientation
      verticalMediaOrientation
      verticalMediaAlignment
      horizontalMediaAlignment
      ctasOrientation
      imageWidth
      mediaFontSize
      mediaTextColor
    }
    ... on CardStyle {
      backgroundColor
      textColor
      canDismiss
      stepBodyOrientation
      mediaOrientation
      verticalMediaOrientation
      verticalMediaAlignment
      horizontalMediaAlignment
      height
      imageWidth
      borderColor
      borderRadius
      padding
      advancedPadding
      ctasOrientation
      mediaFontSize
      mediaTextColor
    }
    ... on CarouselStyle {
      backgroundColor
      textColor
      canDismiss
      stepBodyOrientation
      mediaOrientation
      dotsColor
      height
      imageWidth
      borderColor
      borderRadius
      padding
      advancedPadding
      ctasOrientation
    }
    ... on VideoGalleryStyle {
      backgroundColor
      textColor
      canDismiss
      borderColor
      borderRadius
      padding
      advancedPadding
      selectedBackgroundColor
      statusLabelColor
    }
    ... on ChecklistStyle {
      stepBodyOrientation
      mediaOrientation
      height
      hideStepGroupTitle
      hideCompletedSteps
      imageWidth
      ctasOrientation
    }
  }
`;

export const GUIDE_NOTIFICATION_SETTINGS_FRAGMENT = graphql`
  fragment Guide_notificationSettings on TemplateNotificationSettings {
    disable
    branching
    input
    action
    info
  }
`;
