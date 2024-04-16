import { VideoPlatforms } from 'bento-common/types';
import { getVideoUrls } from 'bento-common/data/helpers';
import { sleep, urlIsValid } from './helpers';
import { logger } from './logger';
import fetch from 'node-fetch';

/** Strategies for testing if a url is valid */
const strategies = {
  [VideoPlatforms.Youtube]: async (videoId: string) => {
    const imgExists = await urlIsValid(
      (
        await getVideoUrls(videoId, 'youtube', fetch as any)
      ).thumbnail
    );
    return imgExists;
  },
  [VideoPlatforms.Wistia]: async (videoId: string) => {
    const imgExists = await urlIsValid(
      (
        await getVideoUrls(videoId, 'wistia', fetch as any)
      ).thumbnail
    );
    return imgExists;
  },
  [VideoPlatforms.Loom]: async (videoId: string) => {
    const videoUrlExists = await urlIsValid(
      (
        await getVideoUrls(videoId, 'loom', fetch as any)
      ).video
    );
    return videoUrlExists;
  },
  [VideoPlatforms.Vidyard]: (videoId: string): Promise<boolean> =>
    new Promise(async (resolve, reject) =>
      urlIsValid(
        (await getVideoUrls(videoId, 'vidyard', fetch as any)).thumbnail,
        false,
        (res) => {
          const retUrl: string = res?.url || '';
          resolve(!retUrl.includes('spacer'));
        }
      ).catch(reject)
    ),
  [VideoPlatforms.Vimeo]: async (videoId: string): Promise<boolean> => {
    const videoUrlExists = await urlIsValid(`https://vimeo.com/${videoId}`);
    return videoUrlExists;
  },
};

/** Search a video link to see which platform it might be */
export const determinePlatform = (url: string) => {
  const platforms = Object.values(VideoPlatforms) as VideoPlatforms[];
  for (let i = 0; i < platforms.length; i++) {
    if (url.includes(platforms[i])) return platforms[i];
  }

  if (url.includes('youtu.be')) return VideoPlatforms.Youtube;

  return null;
};

/** Check if a video link is valid using per-platform strategies */
export const videoUrlExists = async (
  url: string,
  videoId: string
): Promise<boolean> => {
  try {
    logger.debug(`[videoUrlExists] Checking id ${videoId} from url ${url}`);

    const platform = determinePlatform(url);

    if (platform) return strategies[platform](videoId);

    /* Not supported */
    return false;
  } catch {
    return false;
  }
};

/** Check video url valid several times to prevent one-off errors */
export const videoValidWithVerify = async (
  url: string,
  videoId: string,
  times: number
) => {
  let failed = 0;

  for (let i = 0; i < times; i++) {
    const valid = await videoUrlExists(url, videoId);
    if (!valid) failed++;

    await sleep(1000);
  }

  /* Consider valid if we didn't fail n/n times */
  return failed < times;
};
