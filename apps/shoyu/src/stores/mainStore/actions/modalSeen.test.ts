import modalGuide from 'bento-common/sampleGuides/modalGuide';
import { Guide } from 'bento-common/types/globalShoyuState';
import bannerGuide from 'bento-common/sampleGuides/bannerGuide';
import tooltipGuide from 'bento-common/sampleGuides/sampleTooltipGuide';
import standardGuide from 'bento-common/sampleGuides/standardGuide';
import flatGuide from 'bento-common/sampleGuides/flatGuide';
import compactGuide from 'bento-common/sampleGuides/compactGuide';
import cardGuide from 'bento-common/sampleGuides/cardGuide';
import carouselGuide from 'bento-common/sampleGuides/carouselGuide';

import mainStore from '..';
import { recordModalSeen } from '../helpers/throttling';
import { fromFullGuideToGuide } from '../../../lib/testHelpers';
import { WorkingState } from '../types';
import { GuidePageTargetingType } from 'bento-common/types';

jest.mock('../../../lib/graphqlClient');
jest.mock('../helpers/throttling', () => ({
  recordModalSeen: jest.fn(),
}));

const setAvailableGuides = (guides: Guide[], state?: WorkingState) => {
  (state || mainStore.getState()).dispatch({
    type: 'availableGuidesChanged',
    availableGuides: guides,
  });
};

afterEach(() => {
  (recordModalSeen as jest.Mock).mockReset();
  setAvailableGuides([]);
});

afterAll(() => {
  mainStore.destroy();
});

describe('Action: modalSeen', () => {
  test('saved guide wont record', () => {
    const state = mainStore.getState();
    const guides = [modalGuide].map((g) => ({
      ...fromFullGuideToGuide(g),
      savedAt: new Date(),
    }));
    setAvailableGuides(guides);
    state.dispatch({
      type: 'modalSeen',
      guide: modalGuide.entityId,
    });
    expect(recordModalSeen).not.toHaveBeenCalled();
  });

  test('destination guide wont record', () => {
    const state = mainStore.getState();
    const guides = [modalGuide].map((g) => ({
      ...fromFullGuideToGuide(g),
      isDestination: true,
    }));
    setAvailableGuides(guides);
    state.dispatch({
      type: 'modalSeen',
      guide: modalGuide.entityId,
    });
    expect(recordModalSeen).not.toHaveBeenCalled();
  });

  test('destination guide wont record', () => {
    const state = mainStore.getState();
    const guides = [modalGuide].map((g) => ({
      ...fromFullGuideToGuide(g),
      isDestination: true,
    }));
    setAvailableGuides(guides);
    state.dispatch({
      type: 'modalSeen',
      guide: modalGuide.entityId,
    });
    expect(recordModalSeen).not.toHaveBeenCalled();
  });

  test.each([
    bannerGuide,
    tooltipGuide,
    standardGuide,
    flatGuide,
    compactGuide,
    cardGuide,
    carouselGuide,
  ])('($designType, $formFactor, $theme) wont record', (guide) => {
    const state = mainStore.getState();
    const guides = [guide].map((g) => fromFullGuideToGuide(g));
    setAvailableGuides(guides);
    state.dispatch({
      type: 'modalSeen',
      guide: modalGuide.entityId,
    });
    expect(recordModalSeen).not.toHaveBeenCalled();
  });

  test.each([
    [GuidePageTargetingType.anyPage, null],
    [GuidePageTargetingType.specificPage, 'https://trybento.co'],
  ])(
    '(%s, %s) eligible modal will record',
    (pageTargetingType, pageTargetingUrl) => {
      const state = mainStore.getState();
      const guides = [modalGuide].map((g) => ({
        ...fromFullGuideToGuide(g),
        pageTargeting: {
          type: pageTargetingType,
          url: pageTargetingUrl,
        },
        pageTargetingType,
        pageTargetingUrl,
        isPreview: false,
      }));
      setAvailableGuides(guides);
      state.dispatch({
        type: 'modalSeen',
        guide: modalGuide.entityId,
      });
      expect(recordModalSeen).toHaveBeenCalled();
    }
  );
});
