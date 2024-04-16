import { cloneDeep, keyBy, merge } from 'lodash';

import tooltipGuide from 'bento-common/sampleGuides/sampleTooltipGuide';
import { getVisibleElement } from 'bento-common/utils/dom';
import bannerGuide from 'bento-common/sampleGuides/bannerGuide';
import { TooltipShowOn } from 'bento-common/types';

import { airTrafficControl } from '../../BentoAirTrafficElement';
import { fromFullGuideToGuide } from '../../lib/testHelpers';
import { sortByOrderIndexAsc } from '../../stores/mainStore/helpers';
import { fakeJourney, fromInitialAtcInput } from './airTraffic.test.helpers';

jest.mock('../../lib/graphqlClient');

jest.mock('bento-common/utils/dom', () => ({
  getVisibleElement: jest.fn(),
}));

afterEach(() => {
  jest.resetAllMocks();
});

describe('ATC: tag', () => {
  test.each([true, false])('respects stealth mode %s', (stealthMode) => {
    const nonIntrusiveTooltip = merge(cloneDeep(tooltipGuide), {
      isPreview: false,
      taggedElements: [
        {
          wildcardUrl: 'https://trybento.co',
          isPreview: false,
        },
      ],
    });

    const guides = [nonIntrusiveTooltip].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
    }));

    (getVisibleElement as jest.Mock).mockReturnValue('wuujuu');

    const taggedElements = keyBy(
      nonIntrusiveTooltip.taggedElements,
      'entityId'
    );

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
        stealthMode,
        taggedElements,
        guideSelector: <T>() => guides[0] as T,
      })
    );

    expect(next.tags).toEqual(stealthMode ? [] : Object.keys(taggedElements));
  });

  test('hides dismissed tags', () => {
    const tooltipWithDismissedTag = merge(cloneDeep(tooltipGuide), {
      isPreview: false,
      taggedElements: [
        {
          wildcardUrl: 'https://trybento.co',
          dismissedAt: new Date(),
          isPreview: false,
        },
      ],
    });

    const guides = [tooltipGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isPreview: false,
    }));

    (getVisibleElement as jest.Mock).mockReturnValue('wuujuu');

    const taggedElements = keyBy(
      tooltipWithDismissedTag.taggedElements,
      'entityId'
    );

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
        taggedElements: taggedElements,
        guideSelector: <T>() => guides[0] as T,
      })
    );

    expect(next.tags).toEqual([]);
  });

  test.each([TooltipShowOn.hover, TooltipShowOn.load])(
    'respects intrusiveness (%s) for competing guides',
    (tooltipShowOn) => {
      const nonIntrusiveTooltip = merge(cloneDeep(tooltipGuide), {
        isPreview: false,
        formFactorStyle: {
          tooltipShowOn,
        },
        taggedElements: [
          { wildcardUrl: 'https://trybento.co', isPreview: false },
        ],
      });

      const guides = [bannerGuide, nonIntrusiveTooltip].map((g, i) => ({
        ...fromFullGuideToGuide(g),
        orderIndex: i,
        isPreview: false,
      }));

      (getVisibleElement as jest.Mock).mockReturnValue('wuujuu');

      const taggedElements = keyBy(
        nonIntrusiveTooltip.taggedElements,
        'entityId'
      );

      const next = airTrafficControl(
        fromInitialAtcInput({
          contentAvailable: guides.sort(sortByOrderIndexAsc),
          currentPageUrl: 'https://trybento.co',
          taggedElements,
          guideSelector: <T>() => guides[0] as T,
        })
      );

      const isIntrusive = tooltipShowOn === TooltipShowOn.load;

      expect(next.tags).toEqual(isIntrusive ? [] : Object.keys(taggedElements));
    }
  );

  test.each([true, false])('respects element visibility: %s', (isVisible) => {
    const nonIntrusiveTooltip = merge(cloneDeep(tooltipGuide), {
      isPreview: false,
      taggedElements: [
        { wildcardUrl: 'https://trybento.co', isPreview: false },
      ],
    });

    const guides = [nonIntrusiveTooltip].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
    }));

    (getVisibleElement as jest.Mock).mockReturnValue(
      isVisible ? 'wuujuu' : undefined
    );

    const taggedElements = keyBy(
      nonIntrusiveTooltip.taggedElements,
      'entityId'
    );

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
        taggedElements: taggedElements,
        guideSelector: <T>() => guides[0] as T,
      })
    );

    expect(next.tags).toEqual(isVisible ? Object.keys(taggedElements) : []);
  });

  test.each([TooltipShowOn.hover, TooltipShowOn.load])(
    'will show tooltip tag part of active journey (%s)',
    (tooltipShowOn) => {
      const nonIntrusiveTooltip = merge(cloneDeep(tooltipGuide), {
        isPreview: false,
        formFactorStyle: {
          tooltipShowOn,
        },
        taggedElements: [
          { wildcardUrl: 'https://trybento.co', isPreview: false },
        ],
      });

      const guides = [nonIntrusiveTooltip].map((g, i) => ({
        ...fromFullGuideToGuide(g),
        orderIndex: i,
        isPreview: false,
      }));

      (getVisibleElement as jest.Mock).mockReturnValue('wuujuu');

      const taggedElements = keyBy(
        nonIntrusiveTooltip.taggedElements,
        'entityId'
      );

      const next = airTrafficControl(
        fromInitialAtcInput({
          contentAvailable: guides.sort(sortByOrderIndexAsc),
          currentPageUrl: 'https://trybento.co',
          activeJourney: fakeJourney({
            selectedGuide: nonIntrusiveTooltip.entityId,
            selectedModule: nonIntrusiveTooltip.modules[0].entityId,
            selectedStep: nonIntrusiveTooltip.modules[0].steps[0].entityId,
            selectedPageUrl: 'https://trybento.co',
          }),
          taggedElements,
          guideSelector: <T>() => guides[0] as T,
        })
      );

      expect(next.tags).toEqual(Object.keys(taggedElements));
    }
  );
});
