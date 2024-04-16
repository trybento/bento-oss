import React from 'react';
import { BoxProps } from '@chakra-ui/react';
import { ContextTagType } from 'bento-common/types/globalShoyuState';
import {
  VisualTagHighlightType,
  VisualTagStyleSettings,
} from 'bento-common/types';

import PreviewTag from './PreviewTag';
import Box from 'system/Box';
import { px } from 'bento-common/utils/dom';

const PLACEHOLDER_COLOR = '#F7F7F7';

const LinePlaceholder: React.FC<BoxProps> = (props) => (
  <Box w="100px" h="10px" borderRadius="md" bg={PLACEHOLDER_COLOR} {...props} />
);

export const ContentPlaceholder: React.FC<{
  /** @todo add better type */
  uiSettings: any;
  tagType?: ContextTagType;
  tagStyle?: VisualTagStyleSettings;
}> = ({ uiSettings, tagType, tagStyle }) => {
  return (
    <Box
      display="flex"
      flexDir="column"
      w="90%"
      overflow="hidden"
      pl="4"
      pt="4"
    >
      <Box display="flex">
        <Box
          w="200px"
          h="10px"
          borderRadius="md"
          ml="2"
          my="3"
          bg={PLACEHOLDER_COLOR}
        />
        {tagType && tagStyle?.type !== VisualTagHighlightType.overlay && (
          <Box position="relative">
            <Box
              position="absolute"
              width="max-content"
              left={tagType === ContextTagType.highlight ? px(-2) : undefined}
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
                mini
              />
            </Box>
          </Box>
        )}
      </Box>

      <Box display="flex" flexDir="row" flexWrap="wrap">
        {[...Array(8)].map((_, i) => (
          <Box mr="7" mb="3" key={`tag-placeholder-${i}`}>
            <Box
              w="full"
              h="170px"
              borderRadius="md"
              ml="2"
              my="1.5"
              bg={PLACEHOLDER_COLOR}
            />
            <Box display="flex" flexDir="row">
              <LinePlaceholder ml="2" my="1.5" />
              <LinePlaceholder ml="2" my="1.5" />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const NAV_HEADER_HEIGHT = '30px';
/** Placeholder to contain the preview inline component */
export const NavPlaceholder: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <Box
      display="flex"
      flexDir="column"
      h={`calc(100% - ${NAV_HEADER_HEIGHT})`}
      flexFlow="wrap"
    >
      <Box
        display="flex"
        flexDir="row"
        h={NAV_HEADER_HEIGHT}
        w="full"
        borderBottom="1px solid #F7F7F7"
      >
        <Box w="120px" display="flex" borderRight="1px solid #F7F7F7">
          <Box
            w="15px"
            h="15px"
            borderRadius="md"
            my="auto"
            ml="2"
            bg={PLACEHOLDER_COLOR}
          />
        </Box>
        <Box flex="1" display="flex">
          <LinePlaceholder mr="4" ml="auto" my="auto" />
        </Box>
      </Box>
      <Box display="flex" flexDir="row" h="full" w="full">
        <Box
          w="120px"
          borderRight="1px solid #F7F7F7"
          display="flex"
          flexDir="column"
        >
          <LinePlaceholder mt="7" mb="1.5" ml="2" />
          <LinePlaceholder ml="2" my="1.5" />
          <LinePlaceholder ml="2" my="1.5" />
          <LinePlaceholder ml="2" mt="auto" mb="4" />
        </Box>
        <Box flex="1" position="relative">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
