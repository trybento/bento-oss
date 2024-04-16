import {
  Box,
  BoxProps,
  PlacementWithLogical,
  TooltipProps,
} from '@chakra-ui/react';
import Tooltip from 'bento-common/components/Tooltip';
import React, { forwardRef } from 'react';

import colors from '~src/ui/colors';

export enum BadgeStyle {
  active = 'active',
  inactive = 'inactive',
  warning = 'warning',
  error = 'error',
}

export type BadgeStyleConfig = {
  bg: { normal: string; hover: string };
  text: { normal: string; hover: string };
  iconColor?: { normal?: string; hover?: string };
  fontWeight: { normal: string | number; hover: string | number };
};

type BadgeProps = {
  label: React.ReactNode;
  icon?: React.ReactNode;
  tooltip?: string | React.ComponentType;
  style?: BadgeStyleConfig;
  variant?: BadgeStyle;
  disableHoverStyle?: boolean;
  iconRight?: boolean;
} & Omit<BoxProps, 'style'>;

export type WithTooltipProps = {
  tooltip?: string | React.ElementType | React.ComponentType;
  tooltipPlacement?: PlacementWithLogical;
  tooltipMaxWidth?: TooltipProps['maxWidth'];
};

export const BadgeStyles: { [key in BadgeStyle]: BadgeStyleConfig } = {
  [BadgeStyle.active]: {
    bg: { normal: '#F1F7F1', hover: '#276749' },
    text: { normal: '#276749', hover: 'white' },
    fontWeight: { normal: 'semibold', hover: 'semibold' },
  },
  [BadgeStyle.inactive]: {
    bg: { normal: '#F7FAFC', hover: '#3E4246' },
    text: { normal: '#4A5568', hover: 'white' },
    iconColor: { normal: '#7F8891', hover: 'white' },
    fontWeight: { normal: 'semibold', hover: 'semibold' },
  },
  [BadgeStyle.warning]: {
    bg: { normal: colors.warning.bg, hover: colors.warning.bright },
    text: { normal: colors.warning.text, hover: 'white' },
    fontWeight: { normal: 'semibold', hover: 'semibold' },
  },
  [BadgeStyle.error]: {
    bg: { normal: colors.error.bg, hover: colors.error.text },
    text: { normal: colors.error.text, hover: 'white' },
    fontWeight: { normal: 'semibold', hover: 'semibold' },
  },
};

/**
 * HOC used to add tooltips.
 * WrappedComponent must forward its
 * ref.
 */
export const withTooltip = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P & WithTooltipProps> =>
  function WithTooltipHoc({
    tooltip,
    tooltipPlacement = 'bottom-start',
    tooltipMaxWidth,
    ...props
  }) {
    if (typeof tooltip === 'string' || typeof tooltip === 'object') {
      return (
        <Tooltip
          label={tooltip}
          placement={tooltipPlacement}
          {...(tooltipMaxWidth && { maxWidth: tooltipMaxWidth })}>
          <WrappedComponent {...(props as P)} />
        </Tooltip>
      );
    } else if (tooltip) {
      const CustomTooltip = tooltip;
      return (
        // @ts-ignore
        <CustomTooltip>
          <WrappedComponent {...(props as P)} />
        </CustomTooltip>
      );
    }
    return <WrappedComponent {...(props as P)} />;
  };

const Badge = forwardRef<HTMLDivElement, BadgeProps>(function BadgeComponent(
  {
    label,
    icon,
    style,
    variant = BadgeStyle.inactive,
    width,
    iconRight,
    disableHoverStyle,
    ...restProps
  },
  ref,
) {
  const badgeStyle: BadgeStyleConfig = style || BadgeStyles[variant];

  return (
    <Box
      ref={ref}
      display="inline-flex"
      justifyContent="center"
      alignItems="center"
      gap={iconRight ? 2 : 1}
      flexDir={iconRight ? 'row-reverse' : 'row'}
      borderRadius="full"
      px="2"
      width={width}
      py="0.5"
      bgColor={badgeStyle.bg.normal}
      color={badgeStyle.text.normal}
      fontWeight={badgeStyle.fontWeight.normal}
      fontSize="xs"
      userSelect="none"
      _hover={
        disableHoverStyle
          ? undefined
          : { bgColor: badgeStyle.bg.hover, color: badgeStyle.text.hover }
      }
      data-group
      {...restProps}>
      {!!icon && (
        <Box
          color={badgeStyle.iconColor?.normal || badgeStyle.text.normal}
          _groupHover={{
            color: badgeStyle.iconColor?.hover || badgeStyle.text.hover,
          }}
          display="flex"
          alignItems="center"
          gap="1">
          {icon}
        </Box>
      )}
      <Box>{label}</Box>
    </Box>
  );
});

export default withTooltip<BadgeProps>(Badge);
