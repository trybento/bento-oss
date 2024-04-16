export const API_URL_BASE = process.env.VITE_PUBLIC_API_URL_BASE;

/**
 * Allow the completion background to change smoothly
 * before starting other animations that will hide
 * the step.
 */
export const HIDE_STEP_BACKGROUND_DURATION = 300;
/**
 * Used for step animations that are being hidden.
 */
export const HIDE_STEP_FADE_DURATION = 300;

/**
 * Wait for all animations to finish before
 * fully hiding a step since 'display' can't
 * be animated along other properties.
 */
export const HIDE_STEP_DELAY_MS =
  HIDE_STEP_BACKGROUND_DURATION + HIDE_STEP_FADE_DURATION;

/**
 * Window size breakpoints used by Stealth Mode feature to determine whether the
 * screen is too narrow to show non-inline components.
 */
export const STEALTH_MODE_BREAKPOINTS = { width: 600, height: 600 };

export const BENTO_MESSAGE = `<!--
@@B5JJJJJJJJJJJJJJJJJJJJJJ5B@@
#YJP#&&&&&&&&&&&&&&&&&&&&#PJY#
JJP@@@@&#B#&@@@@@@#BB#&@@@@5JJ
JJG@@&YJJJJJY@@@&JJJJJJ5@@@PJJ
JJP@@#?JJJJJJ#@@GJJJJJJJ&@@PJJ
JJP@@@GYJJJJ?#@@P?JJJJYB@@@PJJ
JJP@@@@@@&&&&@@@@&&&&@@@@@@PJJ
JJP@@@@@&####@@@&###&&@@@@@PJJ
JJP@@@PJJJJJ?#@@P?JJJJJG@@@PJJ
JJP@@#?JJJJJ?#@@GJJJJJJJ&@@PJJ
JJG@@@5JJJJJ5@@@&YJJJJJG@@@PJJ
JJP@@@@@&&&&@@@@@@&&&&@@@@@5JY
#YJP#&&&&&&&&&&&&&&&&&&&&#PJY#
@@B5JJJJJJJJJJJJJJJJJJJJJJ5B@@

It looks like you've discovered the Bentosaurs behind your onboarding experience 🦖
Want to find out more? Follow the link below to check it out for yourself!
-->
`;

/**
 * Safeguard timeout used to automatically unlock the Air Traffic state in case
 * it remained locked for a longer period, in ms.
 */
export const ATC_UNLOCK_TIMEOUT = 10000; // 10s

/**
 * How much time to wait before ending a journey if the selected guide is not shown, in ms.
 *
 * NOTE: The actual time awaited might be slightly greater since we re-valuate criteria to
 * automatically end journeys every second.
 */
export const ATC_FAILED_JOURNEY_TIMEOUT = 7000; // 7s
