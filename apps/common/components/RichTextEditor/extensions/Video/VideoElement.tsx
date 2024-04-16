import React from 'react';
import { useFocused, useSelected } from 'slate-react';
import { VideoIframe } from '../../../SlateContentRenderer/videoHelpers';
import useVideoUrls from 'bento-common/hooks/useVideoUrls';
import { videoTypeToSource } from 'bento-common/data/helpers';
import { VideoElement as VideoElementType } from 'bento-common/types/slate';
import { Box } from '@chakra-ui/react';

export const defaultVideoElementSize = {
  width: 350,
  height: 197,
};

export default function VideoElement({
  attributes,
  children,
  element,
  style,
}: {
  element: VideoElementType;
  style?: React.CSSProperties;
  attributes?: any;
  children?: any;
}) {
  const selected = useSelected();
  const focused = useFocused();
  const boxShadow = selected && focused ? `0 0 0 1px #cbd5e0` : 'none';
  const { videoId } = element;
  const urls = useVideoUrls(videoId, videoTypeToSource(element.type));

  return (
    <Box {...attributes} style={style}>
      <Box
        textAlign="center"
        width={'100%'}
        maxWidth={`${defaultVideoElementSize.width}px`}
        height={'100%'}
        maxHeight={`${defaultVideoElementSize.height}px`}
        mx="auto"
        contentEditable={false}
        boxShadow={boxShadow}
        style={style}
      >
        <VideoIframe url={urls.video} />
      </Box>
      {children}
    </Box>
  );
}
