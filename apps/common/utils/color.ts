import tinycolor from 'tinycolor2';

export const forceHexColor = (color: string) =>
  color.startsWith('#') ? color : `#${color}`;

export const isTransparent = (color: string) =>
  typeof color === 'string' &&
  (color.toLowerCase() === 'transparent' ||
    (color.replace('#', '').length === 8 && color.endsWith('00')));

/** If transparent, fallback color will be used */
export const notTransparentColorOrFallback = (
  color: string | null | undefined,
  fallback: string
) => {
  return color && !isTransparent(color) ? color : fallback;
};

/** Allow transparent */
export const colorOrFallback = (
  color: string | null | undefined,
  fallback: string
) => {
  return color ? color : fallback;
};

export const UI_FONT_SIZE = 'sm';
export const BRIGHT_COLOR_THRESHOLD = 200;

export interface ValidateColorOptions {
  shouldBeDark?: boolean;
  isRequired?: boolean;
}

export function validateColor(
  color: string | null,
  options?: ValidateColorOptions
): string | null {
  if (!color) {
    if (options?.isRequired) return 'This field is required';
    else return null;
  }

  const parsedColor = tinycolor(color);

  if (!parsedColor.isValid()) {
    return 'This is not a real color';
  }

  if (
    options?.shouldBeDark &&
    parsedColor.getBrightness() > BRIGHT_COLOR_THRESHOLD
  ) {
    return 'Please use a darker color';
  }

  return null;
}
