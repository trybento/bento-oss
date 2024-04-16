import React, { useState } from 'react';
import { isFlatTheme } from 'bento-common/data/helpers';
import {
  SidebarStyle,
  Theme,
  VisualTagHighlightType,
  VisualTagStyleSettings,
} from 'bento-common/types';
import { px } from 'bento-common/utils/dom';
import { ContextTagType } from 'bento-common/types/globalShoyuState';

import Box from 'system/Box';
import { BentoComponentsEnum, ComposedComponentsEnum } from 'types';
import { NavPlaceholder, ContentPlaceholder } from './Placeholders';
import PreviewTag from './PreviewTag';
import { BoxProps } from '@chakra-ui/react';

type Props = {
  background: string;
  alignLeft: boolean;
  currentComponent: BentoComponentsEnum | ComposedComponentsEnum;
  children: React.ReactNode;
  uiSettings: any;
  uiPreviewId?: string;
  tagType?: ContextTagType;
  tagStyle?: VisualTagStyleSettings;
  allowScroll?: boolean;
  narrowGuide?: boolean;
  previewBoxProps?: Omit<BoxProps, 'background'>;
};

export const PREVIEW_APP_BAR_HEIGHT_PX = 38;
export const PREVIEW_APP_PADDING_PX = 10;
const SCALE_MULTIPLIER = 0.8;

export const SIDEBAR_VARIATION_PREVIEW_HEIGHT = {
  side_by_side: `calc(80vh + ${PREVIEW_APP_BAR_HEIGHT_PX}px + ${PREVIEW_APP_PADDING_PX}px)`,
  slide_out: `calc(80vh + ${PREVIEW_APP_BAR_HEIGHT_PX}px + ${PREVIEW_APP_PADDING_PX}px)`,
  floating: '730px',
};

export const getPreviewContainerId = (uiPreviewId: string) =>
  `container-${uiPreviewId}`;

export const getSidebarPreviewHeight = (
  theme: Theme,
  sidebarStyle: string,
  contextual = false
) =>
  isFlatTheme(theme) && sidebarStyle !== SidebarStyle.floating && !contextual
    ? SIDEBAR_VARIATION_PREVIEW_HEIGHT[SidebarStyle.floating]
    : SIDEBAR_VARIATION_PREVIEW_HEIGHT[sidebarStyle];

/**
 * PreviewWindow
 * @param uiSettings Branding settings of the organization
 * @param withOverlay Add backdrop background to the preview
 * @param tagType Determine the bento-context tag to be shown
 * @param toggleStyle Determine the sidebar toggle to be shown (pass currentComponent == null).
 */
const PreviewWindow = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      currentComponent,
      children,
      uiSettings,
      tagType,
      tagStyle,
      uiPreviewId,
      allowScroll,
      narrowGuide,
      previewBoxProps,
    },
    ref
  ) => {
    const guideWidth = narrowGuide ? 50 : 100;
    const embed = (
      <Box
        transform={`scale(${SCALE_MULTIPLIER})`}
        h={`${100 / SCALE_MULTIPLIER}%`}
        w={`${guideWidth / SCALE_MULTIPLIER}%`}
        transformOrigin="top left"
        zIndex="11"
        position="absolute"
        left="0"
        top="0"
        pointerEvents="none"
      >
        {children}
      </Box>
    );

    const [overlayContainer, setOverlayContainer] = useState<HTMLDivElement>();

    return (
      <Box
        ref={ref}
        h="full"
        w="full"
        display="flex"
        py={px(PREVIEW_APP_PADDING_PX)}
        {...previewBoxProps}
      >
        <Box h="full" w="full">
          <Box
            display="flex"
            flexDirection="column"
            borderRadius="md"
            boxShadow="0px 4px 20px rgba(0, 0, 0, 0.25)"
            overflow="hidden"
            w="full"
            h="full"
            maxH="800px"
          >
            <Box display="flex" bg="gray.500" h={px(PREVIEW_APP_BAR_HEIGHT_PX)}>
              <Box
                rounded="full"
                bg="gray.100"
                w="15px"
                h="15px"
                mr="15px"
                ml="auto"
                my="auto"
              ></Box>
            </Box>
            <Box
              w="full"
              h="full"
              flex="1"
              overflowX="hidden"
              overflowY={allowScroll ? 'auto' : 'hidden'}
              position="relative"
            >
              {(
                [
                  BentoComponentsEnum.inline,
                  BentoComponentsEnum.inlineContext,
                ] as (BentoComponentsEnum | ComposedComponentsEnum)[]
              ).includes(currentComponent) ? (
                <NavPlaceholder>{embed}</NavPlaceholder>
              ) : (
                <>
                  <Box
                    overflow="hidden"
                    h="full"
                    id={getPreviewContainerId(uiPreviewId)}
                  >
                    {([
                      BentoComponentsEnum.sidebar,
                      BentoComponentsEnum.modal,
                      BentoComponentsEnum.banner,
                      BentoComponentsEnum.context,
                      BentoComponentsEnum.tooltip,
                      ComposedComponentsEnum.flow,
                    ].includes(currentComponent) ||
                      !currentComponent) && (
                      <>
                        <NavPlaceholder>
                          <ContentPlaceholder
                            uiSettings={uiSettings}
                            tagType={tagType}
                            tagStyle={tagStyle}
                          />
                        </NavPlaceholder>
                      </>
                    )}
                  </Box>
                  {embed}
                  {tagStyle?.type === VisualTagHighlightType.overlay && (
                    <Box
                      position="absolute"
                      left="0"
                      top="0"
                      w="full"
                      h="full"
                      ref={setOverlayContainer}
                      zIndex={10}
                    >
                      <PreviewTag
                        type={tagType}
                        style={tagStyle}
                        primaryColor={uiSettings.tagPrimaryColor || 'silver'}
                        textColor={uiSettings.tagTextColor || 'black'}
                        dotSize={uiSettings.tagDotSize}
                        tagPulseLevel={uiSettings.tagPulseLevel}
                        borderRadius={uiSettings.tagBadgeIconBorderRadius}
                        padding={uiSettings.tagBadgeIconPadding}
                        customIconUrl={uiSettings.tagCustomIconUrl}
                        container={overlayContainer}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
);

export default PreviewWindow;
