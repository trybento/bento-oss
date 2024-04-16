import { videoTypeToSource } from 'bento-common/data/helpers';
import useVideoUrls from 'bento-common/hooks/useVideoUrls';
import React from 'react';
import { thumbnailImgString, videoIframeStrings } from '../helpers';
import Video, { VideoWrapperProps } from './shared/Video';

type VideoRendererProps = VideoWrapperProps;

export default function VideoRenderer(props: VideoRendererProps) {
  const { node } = props;
  const { videoId, type } = node;
  const urls = useVideoUrls(videoId, videoTypeToSource(type));

  const fullUrl = node.thumbnailOnly ? urls.thumbnail : urls.video;
  const [iFrameSrc, iFrameSrcLightbox] = node.thumbnailOnly
    ? [thumbnailImgString(fullUrl), '']
    : videoIframeStrings(fullUrl);

  if (!fullUrl && !node.thumbnailOnly) return null;

  return (
    <Video
      {...props}
      iFrameSrc={iFrameSrc}
      iFrameSrcLightbox={iFrameSrcLightbox}
      videoUrl={fullUrl}
      videoId={videoId}
    />
  );
}
