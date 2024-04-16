import React, { ReactNode, useMemo } from 'react';
import { BoxProps, PlacementWithLogical } from '@chakra-ui/react';
import tinycolor from 'tinycolor2';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { GuideFormFactor, TemplateState, Theme } from 'bento-common/types';
import GestureIcon from '@mui/icons-material/Gesture';
import { ExtendedCalloutTypes } from 'bento-common/types/slate';
import { THEME_LABELS } from 'bento-common/data/helpers';
import {
  isInlineContextualGuide,
  isFlowGuide,
} from 'bento-common/utils/formFactor';
import CYOALayoutIcon from 'icons/CYOALayout';
import colors from 'helpers/colors';
import Badge, { BadgeStyle, BadgeStyleConfig } from 'system/Badge';
import {
  TYPE_BG_COLOR,
  TYPE_COLOR,
} from 'bento-common/components/RichTextEditor/extensions/Callout/CalloutElement';
import InteractiveTooltip from 'system/InteractiveTooltip';

export const GUIDE_STATUS_COL_WIDTH = '100px';

type TemplateStatusProps = {
  state: TemplateState;
  isTemplate: boolean;
};

const STATE_BADGE_VARIANT: {
  [key in TemplateState]: BadgeStyle;
} = {
  [TemplateState.live]: BadgeStyle.active,
  [TemplateState.draft]: BadgeStyle.inactive,
  [TemplateState.stopped]: BadgeStyle.warning,
  [TemplateState.removed]: BadgeStyle.error,
};

const TEMPLATE_STYLE: BadgeStyleConfig = {
  bg: { normal: colors.bento.pale, hover: colors.bento.logo },
  text: { normal: colors.bento.dark, hover: 'white' },
  fontWeight: { normal: 'normal', hover: 'normal' },
};

const BADGE_LABEL: { [key in TemplateState]: string } = {
  [TemplateState.live]: 'LIVE',
  [TemplateState.draft]: 'DRAFT',
  [TemplateState.stopped]: 'STOPPED',
  [TemplateState.removed]: 'REMOVED',
};

const TOOLTIP_LABEL: { [key in TemplateState]: string } = {
  [TemplateState.live]:
    'This guide is actively being launched to accounts or users',
  [TemplateState.draft]:
    'This guide is not yet launched to any accounts or users',
  [TemplateState.stopped]:
    'New users will not get this guide, but existing users will continue to see it.',
  [TemplateState.removed]: 'This guide has been removed from all users.',
};

export const getIconParams = (element: {
  isAutoLaunchEnabled: boolean;
  disableAutoLaunchAt?: string;
}) =>
  element.isAutoLaunchEnabled && element.disableAutoLaunchAt
    ? [new Date(element.disableAutoLaunchAt)]
    : undefined;

const TemplateStatus: React.FC<TemplateStatusProps> = ({
  state,
  isTemplate,
}) => {
  if (!state) {
    return null;
  }

  const label = !isTemplate ? BADGE_LABEL[state] : 'TEMPLATE';
  const tooltip = !isTemplate ? TOOLTIP_LABEL[state] : undefined;
  const variant = !isTemplate
    ? STATE_BADGE_VARIANT[state]
    : BadgeStyle.inactive;

  return (
    <Badge
      minWidth="75px"
      label={label}
      style={isTemplate ? TEMPLATE_STYLE : undefined}
      variant={variant}
      tooltip={tooltip}
      iconRight
    />
  );
};

export const LayoutBadge: React.FC<
  {
    theme: Theme;
    isCyoa: boolean | undefined;
    formFactor: GuideFormFactor | undefined;
  } & Omit<BoxProps, 'style'>
> = ({ theme, isCyoa, formFactor, ...boxProps }) => {
  if (!theme) return null;

  const isFlow = isFlowGuide(formFactor);

  const iconStyle: React.CSSProperties = {
    display: 'inline',
    fontSize: 'inherit',
  };

  return (
    <Badge
      label={isCyoa ? 'CYOA' : isFlow ? 'Flow' : THEME_LABELS[theme]}
      variant={BadgeStyle.inactive}
      icon={
        isCyoa ? (
          <CYOALayoutIcon style={iconStyle} />
        ) : isFlow ? (
          <GestureIcon style={iconStyle} />
        ) : isInlineContextualGuide(theme) ? (
          <DashboardOutlinedIcon style={iconStyle} />
        ) : (
          <FactCheckOutlinedIcon style={iconStyle} />
        )
      }
      {...boxProps}
    />
  );
};

type FCWithChildren = React.FC<React.PropsWithChildren>;

export const CustomizedBadge: React.FC<
  {
    tooltipLabel?: ReactNode;
    tooltipPlacement?: PlacementWithLogical;
  } & Omit<BoxProps, 'style'>
> = ({ tooltipLabel, tooltipPlacement, ...boxProps }) => {
  const bg = useMemo(
    () => ({
      normal: TYPE_BG_COLOR[ExtendedCalloutTypes.Customized],
      hover: `#${tinycolor(TYPE_BG_COLOR[ExtendedCalloutTypes.Customized])
        .darken(50)
        .toHex()}`,
    }),
    []
  );

  const components = useMemo(
    () => ({
      icon: (
        <HistoryEduIcon
          style={{ width: '16px', height: 'auto', margin: 'auto' }}
        />
      ),
      label: 'Customized',
    }),
    []
  );

  const tooltip: FCWithChildren = useMemo(
    () =>
      ({ children }) =>
        (
          <InteractiveTooltip label={tooltipLabel} maxWidth="230px">
            {children}
          </InteractiveTooltip>
        ),
    [tooltipLabel]
  );

  return (
    <Badge
      {...components}
      {...boxProps}
      tooltipPlacement={tooltipPlacement}
      tooltipMaxWidth="250px"
      style={{
        bg,
        text: {
          normal: '#086F83',
          hover: 'white',
        },
        iconColor: {
          normal: TYPE_COLOR[ExtendedCalloutTypes.Customized],
          hover: 'white',
        },
        fontWeight: { normal: 'bold', hover: 'bold' },
      }}
      tooltip={tooltip}
    />
  );
};

export default TemplateStatus;
