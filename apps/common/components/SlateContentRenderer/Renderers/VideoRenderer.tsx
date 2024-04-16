import React from 'react';
import { Box } from '@chakra-ui/react';
import { videoTypeToSource } from 'bento-common/data/helpers';
import useVideoUrls from 'bento-common/hooks/useVideoUrls';
import { VideoElement } from 'bento-common/types/slate';
import {
  DEFAULT_VIDEO_HEIGHT_PX,
  DEFAULT_VIDEO_WIDTH_PX,
  VideoIframe,
} from '../videoHelpers';

interface VideoRendererProps {
  node: VideoElement;
}

export default function VideoRenderer({ node }: VideoRendererProps) {
  const { videoId, type } = node;
  const width = (node as any).width || DEFAULT_VIDEO_WIDTH_PX;
  const height = (node as any).height || DEFAULT_VIDEO_HEIGHT_PX;
  const urls = useVideoUrls(videoId, videoTypeToSource(type));

  return (
    <Box
      textAlign="center"
      width={'100%'}
      maxWidth={`${width}px`}
      height={'100%'}
      maxHeight={`${height}px`}
      mx="auto"
    >
      <VideoIframe url={urls.video} />
    </Box>
  );
}
