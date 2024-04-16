import { useEffect, useState } from 'react';
import { getVideoUrls, VideoUrls } from '../data/helpers';
import { VideoSourceType } from '../types/slate';

export default function useVideoUrls(videoId: string, source: VideoSourceType) {
  const [urls, setUrls] = useState<VideoUrls>({
    video: '',
    thumbnail: '',
  });

  useEffect(() => {
    (async () => {
      const urls = await getVideoUrls(videoId, source);
      setUrls(urls);
    })();
  }, [videoId, source]);

  return urls;
}
