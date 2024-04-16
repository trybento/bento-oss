import { FillEnum } from '../types';

/**
 * Fetches an image to discover its natural size (width and height),
 * as well as its aspect ratio, returning a promise.
 */
export const fetchImageNaturalSize = (
  url: string
): Promise<{
  naturalWidth: number;
  naturalHeight: number;
  aspectRatio: number;
}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function (this, _e) {
      const { naturalWidth, naturalHeight } = img;
      resolve({
        naturalWidth,
        naturalHeight,
        aspectRatio: aspectRatio(naturalWidth, naturalHeight),
      });
    };
    img.onerror = function onerror(innerError) {
      const outerError = new Error('Failed to get image natural dimensions');
      // @ts-ignore
      outerError.cause = innerError;
      reject(outerError);
    };
    img.src = url;
  });
};

/**
 * Computes the aspect ratio of an image.
 */
export function aspectRatio(
  width: number,
  height: number,
  output?: 'ratio'
): number;
export function aspectRatio(
  width: number,
  height: number,
  output?: 'css'
): string;
export function aspectRatio(
  width: number,
  height: number,
  output: 'ratio' | 'css' = 'ratio'
): number | string {
  return output === 'ratio' ? width / height : `${width} / ${height}`;
}

export const isEdgeToEdge = (fill: FillEnum | undefined) => {
  return fill === FillEnum.marginless;
};
