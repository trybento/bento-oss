export const defaultCyoaOptionBorderColor = '00000000';

export enum DefaultCyoaOptionShadow {
  default = '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  hover = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
}

export const ENG_CALENDLY_URL = 'https://calendly.com/bento-engineers';
export const BENTO_DOCS_LINK =
  'https://docs.trybento.co/docs/getting-started/installation';

export const TAG_PRIMARY_COLOR_BRIGHTNESS = 45;

/**
 * Determines the time taken to fully execute the modal animations when
 * showing or hiding away.
 *
 * @docs https://tailwindcss.com/docs/transition-duration
 */
export const ANNOUNCEMENT_ANIMATION_TIME_TAKEN:
  | 0
  | 75
  | 100
  | 150
  | 200
  | 300
  | 500
  | 700
  | 1000 = 500;
