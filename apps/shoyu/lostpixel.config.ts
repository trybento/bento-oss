import { CustomProjectConfig } from 'lost-pixel';

const os = process.platform;

export const config: CustomProjectConfig = {
  storybookShots: {
    storybookUrl: 'http://localhost:6007/',
  },
  generateOnly: true,
  browser: 'chromium',
  failOnDifference: true,
  /**
   * Generate platform specific shots
   * to avoid false positives.
   */
  imagePathBaseline: `.lostpixel/baseline/${os}`,
  imagePathCurrent: `.lostpixel/current/${os}`,
  imagePathDifference: `.lostpixel/difference/${os}`,
};
