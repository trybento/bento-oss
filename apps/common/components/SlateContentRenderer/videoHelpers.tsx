import { VideoSourceType } from 'bento-common/types/slate';
import React from 'react';

export const DEFAULT_VIDEO_WIDTH_PX = 350;
export const DEFAULT_VIDEO_HEIGHT_PX = 197;

type Props = {
  url: string;
};

export const VideoIframe: React.FC<Props> = ({ url }) =>
  url ? (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
      <iframe
        src={url}
        frameBorder="0"
        // @ts-ignore
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      ></iframe>
    </div>
  ) : null;

export const extractVideoId = (
  inputText: string
): [videoId: string | undefined, source: VideoSourceType | undefined] => {
  let source: VideoSourceType | undefined;
  let videoId: RegExpMatchArray | string | null | undefined;

  if (inputText.startsWith('http')) {
    if (
      inputText.includes('youtube.com/watch') ||
      inputText.includes('youtu.be')
    ) {
      source = 'youtube';
      videoId = inputText.match(
        /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
      );
      videoId = videoId?.[1];
    } else if (inputText.includes('loom.com')) {
      source = 'loom';
      const splitInputText = inputText.split('/');
      videoId = splitInputText[splitInputText.length - 1];
    } else if (
      inputText.includes('wistia.com') ||
      inputText.includes('fast.wistia.net')
    ) {
      source = 'wistia';
      const splitInputText = inputText.split('/');
      videoId = splitInputText[splitInputText.length - 1];
    } else if (inputText.includes('vidyard.com')) {
      source = 'vidyard';
      const splitInputText = inputText.split('/');
      videoId = splitInputText[splitInputText.length - 1];
    } else if (inputText.includes('vimeo.com')) {
      source = 'vimeo';
      const splitInputText = inputText.split('/');
      /** Private videos have a longer path, we need to append to id */
      const hasAccessCode = splitInputText.length === 5;
      videoId = hasAccessCode
        ? `${splitInputText[splitInputText.length - 2]}?h=${
            splitInputText[splitInputText.length - 1]
          }`
        : splitInputText[splitInputText.length - 1];
    }
  }

  return [videoId as string, source];
};
