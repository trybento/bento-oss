import { keyBy } from 'lodash';

import flowGuide from 'bento-common/sampleGuides/flowGuide';
import { GuideHydrationState } from 'bento-common/types/globalShoyuState';
import { getVisibleElement } from 'bento-common/utils/dom';

import { airTrafficControl } from '../../BentoAirTrafficElement';
import { fromFullGuideToGuide } from '../../lib/testHelpers';
import { sortByOrderIndexAsc } from '../../stores/mainStore/helpers';
import { atcResultMatch, fromInitialAtcInput } from './airTraffic.test.helpers';
import bannerGuide from 'bento-common/sampleGuides/bannerGuide';

jest.mock('../../lib/graphqlClient');

jest.mock('bento-common/utils/dom', () => ({
  getVisibleElement: jest.fn(),
}));

afterEach(() => {
  jest.resetAllMocks();
});

describe('ATC: flow', () => {
  test.each([undefined, GuideHydrationState.hydrating])(
    'hydrating (%s) flows will block',
    (hydrationState) => {
      const guides = [flowGuide, bannerGuide].map((g, i) => ({
        ...fromFullGuideToGuide(g),
        orderIndex: i,
        isPreview: false,
        hydrationState,
      }));

      (getVisibleElement as jest.Mock).mockReturnValue('ImHere');

      const stepsByEntityId = keyBy(
        flowGuide.modules.flatMap((m) => m.steps),
        'entityId'
      );

      const next = airTrafficControl(
        fromInitialAtcInput({
          contentAvailable: guides.sort(sortByOrderIndexAsc),
          currentPageUrl: 'https://trybento.co',
          taggedElements: keyBy(flowGuide.taggedElements, 'entityId'),
          taggedElementOfStepSelector: (_s) => flowGuide.taggedElements[0],
          stepSelector: (sId) => stepsByEntityId[sId!],
        })
      );

      expect(next).toEqual(
        atcResultMatch({ showGuides: [guides[0]], hideGuides: [guides[1]] })
      );
    }
  );

  test.each([GuideHydrationState.failed, GuideHydrationState.hydrated])(
    'hydrated (%s) flows do not block if no element',
    (hydrationState) => {
      const guides = [flowGuide, bannerGuide].map((g, i) => ({
        ...fromFullGuideToGuide(g),
        orderIndex: i,
        isPreview: false,
        hydrationState,
      }));

      const stepsByEntityId = keyBy(
        flowGuide.modules.flatMap((m) => m.steps),
        'entityId'
      );

      (getVisibleElement as jest.Mock).mockReturnValue(undefined);

      const next = airTrafficControl(
        fromInitialAtcInput({
          contentAvailable: guides.sort(sortByOrderIndexAsc),
          currentPageUrl: 'https://trybento.co',
          taggedElements: keyBy(flowGuide.taggedElements, 'entityId'),
          taggedElementOfStepSelector: (_s) => flowGuide.taggedElements[0],
          stepSelector: (sId) => stepsByEntityId[sId!],
        })
      );

      expect(next).toEqual(
        atcResultMatch({ showGuides: [guides[1]], hideGuides: [guides[0]] })
      );
    }
  );

  test.each([
    [bannerGuide, flowGuide],
    [flowGuide, bannerGuide],
  ])('competes with other guides', (firstGuide, secondGuide) => {
    const guides = [firstGuide, secondGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isPreview: false,
      hydrationState: GuideHydrationState.hydrated,
    }));

    const stepsByEntityId = keyBy(
      flowGuide.modules.flatMap((m) => m.steps),
      'entityId'
    );

    (getVisibleElement as jest.Mock).mockReturnValue('yas');

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
        taggedElements: keyBy(flowGuide.taggedElements, 'entityId'),
        taggedElementOfStepSelector: (_s) => flowGuide.taggedElements[0],
        stepSelector: (sId) => stepsByEntityId[sId!],
      })
    );

    expect(next).toEqual(
      atcResultMatch({ showGuides: [guides[0]], hideGuides: [guides[1]] })
    );
  });

  test('blocked by sidebar', () => {
    const guides = [flowGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isPreview: false,
      hydrationState: GuideHydrationState.hydrated,
    }));

    (getVisibleElement as jest.Mock).mockReturnValue('theWowed');

    const next = airTrafficControl(
      fromInitialAtcInput({
        sidebarOpen: true,
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
      })
    );

    expect(next).toEqual(
      atcResultMatch({
        hideGuides: [guides[0]],
        stateOverrides: { sidebarOpen: true },
      })
    );
  });

  test.each([true, false])(
    'respects if element is visible: %s',
    (elementVisible) => {
      const guides = [flowGuide].map((g, i) => ({
        ...fromFullGuideToGuide(g),
        orderIndex: i,
        isPreview: false,
        hydrationState: GuideHydrationState.hydrated,
      }));

      const stepsByEntityId = keyBy(
        flowGuide.modules.flatMap((m) => m.steps),
        'entityId'
      );

      (getVisibleElement as jest.Mock).mockReturnValue(
        elementVisible ? 'mockery' : undefined
      );

      const next = airTrafficControl(
        fromInitialAtcInput({
          contentAvailable: guides.sort(sortByOrderIndexAsc),
          currentPageUrl: 'https://trybento.co',
          taggedElements: keyBy(flowGuide.taggedElements, 'entityId'),
          taggedElementOfStepSelector: (_s) => flowGuide.taggedElements[0],
          stepSelector: (sId) => stepsByEntityId[sId!],
        })
      );

      expect(next).toEqual(
        atcResultMatch({
          showGuides: elementVisible ? guides : [],
          hideGuides: elementVisible ? [] : guides,
        })
      );
    }
  );
});
