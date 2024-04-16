import React, { ReactNode } from 'react';
import { SvgIconProps } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import CYOALayoutIcon from 'icons/CYOALayout';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GestureIcon from '@mui/icons-material/Gesture';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import { GuideDesignType, GuideFormFactor, Theme } from 'bento-common/types';
import {
  getGuideThemeFlags,
  isSplitTestGuide,
  THEME_LABELS,
} from 'bento-common/data/helpers';
import { isBannerGuide, isModalGuide } from 'bento-common/utils/formFactor';
import { GuideShape } from 'bento-common/types/globalShoyuState';

type ExtendedGuideDesignType = GuideDesignType | 'cyoa' | 'splitTest';

const guideComponentIconMap: Record<
  ExtendedGuideDesignType,
  | typeof SvgIcon
  | ((ff: GuideFormFactor, theme: Theme) => typeof SvgIcon)
  | (() => React.FC<SvgIconProps>)
  | ReactNode
  | undefined
> = {
  cyoa: () => CYOALayoutIcon,
  splitTest: () => StackedLineChartIcon,
  [GuideDesignType.onboarding]: FactCheckOutlinedIcon,
  [GuideDesignType.everboarding]: (ff, theme) => {
    switch (ff) {
      case GuideFormFactor.tooltip:
        return AnnouncementOutlinedIcon;

      case GuideFormFactor.sidebar:
        return PushPinOutlinedIcon;

      case GuideFormFactor.flow:
        return GestureIcon;

      case GuideFormFactor.inline:
        switch (theme) {
          case Theme.card:
          case Theme.carousel:
          case Theme.videoGallery:
            return DashboardOutlinedIcon;
        }
        return FactCheckOutlinedIcon;

      default:
        return null;
    }
  },
  [GuideDesignType.announcement]: (ff) => {
    switch (ff) {
      case GuideFormFactor.modal:
      case GuideFormFactor.banner:
        return CampaignOutlinedIcon;

      default:
        return null;
    }
  },
};

const guideComponentLabelMap: Record<
  ExtendedGuideDesignType,
  string | ((ff: GuideFormFactor, theme: Theme) => string) | undefined
> = {
  cyoa: 'CYOA',
  splitTest: 'Split test',
  [GuideDesignType.onboarding]: 'Onboarding',
  [GuideDesignType.everboarding]: (ff, theme) => {
    if (ff === GuideFormFactor.tooltip) return 'Tooltip';
    if (ff === GuideFormFactor.flow) return 'Flow';
    const { isCard, isCarousel, isVideoGallery } = getGuideThemeFlags(theme);
    if (isCard || isCarousel || isVideoGallery) return THEME_LABELS[theme];

    return 'Contextual';
  },
  [GuideDesignType.announcement]: (ff) => {
    if (isModalGuide(ff)) return 'Modal';
    if (isBannerGuide(ff)) return 'Banner';
    return undefined;
  },
};

/**
 * @todo Refactor to use general component type helper getComponentType
 */
function guideComponentIndicatorFactory<R>(
  indicator: typeof guideComponentIconMap | typeof guideComponentLabelMap
) {
  return ({ designType, formFactor, theme, isCyoa, type }: GuideShape): R => {
    const _designType = isCyoa
      ? 'cyoa'
      : isSplitTestGuide(type)
      ? 'splitTest'
      : designType;
    const value = indicator[_designType] as unknown as R;
    if (typeof value === 'function') return value(formFactor, theme, isCyoa);
    if (typeof value === 'undefined')
      throw new Error(
        `Value not found for: ${designType}, ${formFactor}, ${theme}, ${isCyoa}, ${type}`
      );

    return value;
  };
}

export const guideComponentIcon = guideComponentIndicatorFactory<
  typeof SvgIcon
>(guideComponentIconMap);

export const guideComponentLabel = guideComponentIndicatorFactory<string>(
  guideComponentLabelMap
);
