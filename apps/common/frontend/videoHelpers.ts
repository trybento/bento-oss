import { getVideoUrls } from '../data/helpers';
import { VideoPlatforms } from '../types';

/** List of strategies to try per platform */
const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = url;

    img.onload = () => resolve(img);
    img.onerror = () => resolve({ ...img, width: 0 });
  });

/** Strategies for testing if a url is valid */
const strategies = {
  [VideoPlatforms.Youtube]: async (videoId: string) => {
    const img = await loadImage(
      (
        await getVideoUrls(videoId, 'youtube')
      ).thumbnail
    );
    return img.width !== 120;
  },
  [VideoPlatforms.Wistia]: async (videoId: string) => {
    const img = await loadImage(
      (
        await getVideoUrls(videoId, 'wistia')
      ).thumbnail
    );
    return img.width > 50;
  },
  [VideoPlatforms.Loom]: async (videoId: string) => {
    const img = await loadImage(
      (
        await getVideoUrls(videoId, 'loom')
      ).thumbnail
    );
    return img.width > 10;
  },
  [VideoPlatforms.Vidyard]: async (videoId: string) => {
    const img = await loadImage(
      (
        await getVideoUrls(videoId, 'vidyard')
      ).thumbnail
    );
    return img.width > 10;
  },
  [VideoPlatforms.Vimeo]: async (videoId: string) => {
    const thumbnailUrl = (await getVideoUrls(videoId, 'vimeo')).thumbnail;
    return !!thumbnailUrl;
  },
};

export const videoUrlExists = async (
  url: string,
  id: string
): Promise<boolean> => {
  try {
    const platforms = Object.values(VideoPlatforms) as VideoPlatforms[];
    for (let i = 0; i < platforms.length; i++) {
      if (url.includes(platforms[i])) return strategies[platforms[i]](id);
    }
    /* Not supported */
    return false;
  } catch {
    return false;
  }
};
