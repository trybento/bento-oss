import { Box } from '@chakra-ui/react';
import ElementHighlight, {
  OverlayHighlight,
} from 'bento-common/components/ElementHighlight';
import Dot from 'bento-common/components/VisualTag/Dot';
import VisualTagIcon from 'bento-common/components/VisualTagIcon';
import { ContextTagDimensionsByType } from 'bento-common/data/helpers';
import { TAG_PRIMARY_COLOR_BRIGHTNESS } from 'bento-common/frontend/constants';
import {
  VisualTagHighlightType,
  VisualTagPulseLevel,
  VisualTagStyleSettings,
} from 'bento-common/types';
import { ContextTagType } from 'bento-common/types/globalShoyuState';
import { isTransparent } from 'bento-common/utils/color';
import { DEFAULT_TAG_TEXT } from 'bento-common/utils/constants';
import { px } from 'bento-common/utils/dom';
import pick from 'lodash/pick';
import React, { useMemo, useState } from 'react';
import tinycolor from 'tinycolor2';

interface PreviewTagProps {
  type: ContextTagType;
  primaryColor?: string;
  textColor?: string;
  dotSize?: number;
  tagPulseLevel?: VisualTagPulseLevel;
  padding?: number;
  borderRadius?: number;
  customIconUrl: string | null;
  style?: VisualTagStyleSettings;
  animate?: boolean;
  mini?: boolean;
  container?: HTMLElement;
}

function IconUI({
  primaryColor,
  borderRadius,
  padding,
  customIconUrl,
}: {
  primaryColor: string;
  borderRadius: number;
  padding: number;
  customIconUrl: string | null;
}) {
  const lightPrimaryColor = useMemo(
    () =>
      tinycolor(primaryColor).lighten(TAG_PRIMARY_COLOR_BRIGHTNESS).toString(),
    [primaryColor],
  );
  const { width, height } = ContextTagDimensionsByType[ContextTagType.icon];

  return (
    <VisualTagIcon
      primaryColor={primaryColor}
      bgColor={lightPrimaryColor}
      borderRadius={borderRadius}
      padding={padding}
      iconUrl={customIconUrl}
      width={width}
      height={height}
    />
  );
}

function Badge({
  type,
  padding = 0,
  primaryColor,
  textColor,
  tagPulseLevel,
  borderRadius,
  animate = true,
  customIconUrl,
  text,
}: {
  type: ContextTagType;
  padding: number;
  primaryColor: string;
  tagPulseLevel: VisualTagPulseLevel;
  textColor: string;
  borderRadius: number;
  customIconUrl: string | null;
  animate?: boolean;
  text: string | undefined;
}) {
  const lightPrimaryColor = useMemo(
    () =>
      tinycolor(primaryColor).lighten(TAG_PRIMARY_COLOR_BRIGHTNESS).toString(),
    [primaryColor],
  );
  const { height, padding: defaultPadding } = ContextTagDimensionsByType[type];

  // Prevent CLS while the text is loading.
  if (!text) return null;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      rounded={px(borderRadius)}
      h={px(height + padding * 2)}
      p={`${px(padding)} ${px(padding + defaultPadding)}`}
      fontWeight="semibold"
      fontSize="xs"
      {...(type === ContextTagType.badge
        ? {
            /** Badge glow: Disabled until it has its own setting. */
            // className: animate && 'bento-context-animated shimmer',
            style: {
              '--shimmer-border-radius': px(borderRadius),
              '--shimmer-shadow-color': primaryColor,
              '--shimmer-shadow-color-step-1': tinycolor(primaryColor)
                .setAlpha(0.6)
                .toString(),
              '--shimmer-shadow-color-step-2': tinycolor(primaryColor)
                .setAlpha(0.04)
                .toString(),
              '--shimmer-shadow-color-step-3': tinycolor(primaryColor)
                .setAlpha(0.08)
                .toString(),
            } as React.CSSProperties,
            bg: primaryColor,
            color: textColor,
          }
        : {
            bg: lightPrimaryColor,
            color: primaryColor,
          })}>
      {type === ContextTagType.badgeDot ? (
        <Box my="auto" mr="1">
          <Dot
            primaryColor={primaryColor}
            size={6}
            tagPulseLevel={tagPulseLevel}
          />
        </Box>
      ) : type === ContextTagType.badgeIcon ? (
        <VisualTagIcon
          primaryColor={primaryColor}
          bgColor={lightPrimaryColor}
          borderRadius={borderRadius}
          padding={padding}
          iconUrl={customIconUrl}
        />
      ) : null}
      {text}
    </Box>
  );
}

type ComposedVisualTagStyleSettings = VisualTagStyleSettings & {
  color: string;
  opacity: number;
};

const highlightStyleOverrides = {
  [VisualTagHighlightType.solid]: {
    radius: 5,
    thickness: 4,
    padding: 0,
  },
  [VisualTagHighlightType.halo]: {
    radius: 3,
    thickness: 4,
    padding: 0,
  },
  [VisualTagHighlightType.none]: {},
};

export default function PreviewTag({
  type,
  dotSize,
  tagPulseLevel,
  primaryColor,
  textColor,
  padding,
  borderRadius,
  customIconUrl,
  style: defaultStyle,
  animate,
  mini,
  container,
}: PreviewTagProps) {
  const [highlightContainer, setHighlightContainer] =
    useState<HTMLDivElement>();

  const containerDimensions = useMemo(
    () =>
      highlightContainer || container
        ? pick((highlightContainer || container).getBoundingClientRect(), [
            'width',
            'height',
          ])
        : { width: 0, height: 0 },
    [highlightContainer, container],
  );

  const style = useMemo<ComposedVisualTagStyleSettings>(() => {
    const result: ComposedVisualTagStyleSettings =
      mini && defaultStyle
        ? { ...defaultStyle, ...highlightStyleOverrides[defaultStyle.type] }
        : { ...defaultStyle };

    if (isTransparent(result.color)) {
      result.color = '#FAFAFA77';
    }

    return result;
  }, [defaultStyle]);

  switch (type) {
    case ContextTagType.badge:
    case ContextTagType.badgeDot:
    case ContextTagType.badgeIcon:
      return (
        <Box>
          <Badge
            type={type}
            padding={padding}
            primaryColor={primaryColor}
            textColor={textColor}
            borderRadius={borderRadius}
            customIconUrl={customIconUrl}
            animate={animate}
            tagPulseLevel={tagPulseLevel}
            text={style?.text || DEFAULT_TAG_TEXT}
          />
        </Box>
      );

    case ContextTagType.icon:
      return (
        <Box>
          <IconUI
            primaryColor={primaryColor}
            padding={padding}
            borderRadius={borderRadius}
            customIconUrl={customIconUrl}
          />
        </Box>
      );

    case ContextTagType.highlight:
      return style.type === VisualTagHighlightType.overlay && container ? (
        <OverlayHighlight
          left={346}
          top={54}
          width={16}
          height={16}
          radius={5}
          containerDimensions={containerDimensions}
          pulse={animate && style.pulse}
          zIndex={undefined}
          {...pick(style, ['color', 'opacity'])}
        />
      ) : (
        <Box
          {...(style.type === VisualTagHighlightType.halo
            ? { w: 4, h: 4, m: 1 }
            : style.type === VisualTagHighlightType.overlay
            ? { h: 8, w: 8, marginX: -1 }
            : { w: 6, h: 6 })}
          position="relative"
          ref={setHighlightContainer}>
          {style.type === VisualTagHighlightType.overlay ? (
            <OverlayHighlight
              width="50%"
              height="50%"
              left="25%"
              top="25%"
              radius="12%"
              containerDimensions={containerDimensions}
              pulse={animate && style.pulse}
              zIndex={undefined}
              {...pick(style, ['color', 'opacity'])}
            />
          ) : (
            <ElementHighlight {...style} pulse={animate && style.pulse} />
          )}
        </Box>
      );

    case ContextTagType.dot:
    default:
      return (
        <Box>
          <Dot
            size={dotSize}
            primaryColor={primaryColor}
            tagPulseLevel={tagPulseLevel}
          />
        </Box>
      );
  }
}
