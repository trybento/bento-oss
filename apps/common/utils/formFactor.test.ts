import { isCarouselTheme as _isCarouselTheme } from '../data/helpers';
import sampleBannerGuide from '../sampleGuides/bannerGuide';
import cardGuide from '../sampleGuides/cardGuide';
import carouselGuide from '../sampleGuides/carouselGuide';
import flatGuide from '../sampleGuides/flatGuide';
import modalGuide from '../sampleGuides/modalGuide';
import standardGuide from '../sampleGuides/standardGuide';
import timelineGuide from '../sampleGuides/timelineGuide';
import { isAnnouncement, isCarousel } from './formFactor';

describe('formFactor', () => {
  describe('isAnnouncement', () => {
    test.each([sampleBannerGuide, modalGuide])(
      'returns true for announcements (ff: $formFactor, theme: $theme, isSideQuest: $isSideQuest)',
      (guide) => {
        expect(isAnnouncement<any>(guide)).toBe(true);
      }
    );

    test.each([cardGuide, flatGuide, standardGuide, timelineGuide])(
      'returns false for else (ff: $formFactor, theme: $theme, isSideQuest: $isSideQuest)',
      (guide) => {
        expect(isAnnouncement<any>(guide)).toBe(false);
      }
    );
  });

  /**
   * @todo figure out why theme helpers are undefined in tests
   */
  describe.skip('isCarousel', () => {
    test.each([carouselGuide])(
      'returns true for carousels (ff: $formFactor, theme: $theme, isSideQuest: $isSideQuest)',
      (guide) => {
        expect(isCarousel(guide)).toBe(true);
      }
    );

    test.each([modalGuide, cardGuide, timelineGuide])(
      'returns false for else (ff: $formFactor, theme: $theme, isSideQuest: $isSideQuest)',
      (guide) => {
        expect(isCarousel(guide)).toBe(false);
      }
    );
  });
});
