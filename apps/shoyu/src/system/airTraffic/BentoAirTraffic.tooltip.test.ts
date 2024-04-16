import { cloneDeep, keyBy, merge } from 'lodash';
import tooltipGuide from 'bento-common/sampleGuides/sampleTooltipGuide';
import { GuideFormFactor, TooltipShowOn } from 'bento-common/types';
import { EmbedTypenames } from 'bento-common/types/globalShoyuState';
import { getVisibleElement } from 'bento-common/utils/dom';

import {
  airTrafficControl,
  initialStateVisibilityIndicators,
} from '../../BentoAirTrafficElement';
import { fromFullGuideToGuide } from '../../lib/testHelpers';
import { sortByOrderIndexAsc } from '../../stores/mainStore/helpers';
import {
  fakeJourney,
  fakeJourneyWithGuide,
  fromInitialAtcInput,
  atcResultMatch,
} from './airTraffic.test.helpers';
import sampleBannerGuide from 'bento-common/sampleGuides/bannerGuide';

jest.mock('../../lib/graphqlClient');

jest.mock('bento-common/utils/dom', () => ({
  getVisibleElement: jest.fn(),
}));

afterEach(() => {
  jest.resetAllMocks();
});

describe('ATC: tooltip', () => {
  test.each([false, true])(
    'will show/hide according to stealth mode (%s)',
    (stealthMode) => {
      const guides = [tooltipGuide].map((g, i) => ({
        ...fromFullGuideToGuide(g),
        orderIndex: i,
        isPreview: false,
      }));

      (getVisibleElement as jest.Mock).mockReturnValue('ImHere');

      const next = airTrafficControl(
        fromInitialAtcInput({
          contentAvailable: guides.sort(sortByOrderIndexAsc),
          currentPageUrl: 'https://trybento.co',
          stealthMode,
          taggedElements: keyBy(tooltipGuide.taggedElements, 'entityId'),
          guideSelector: <T>() => guides[0] as T,
        })
      );

      expect(next).toEqual({
        [stealthMode ? 'hide' : 'show']: {
          [EmbedTypenames.guide]: {
            [GuideFormFactor.tooltip]: [tooltipGuide.entityId],
          },
          [EmbedTypenames.npsSurvey]: {},
        },
        [stealthMode ? 'show' : 'hide']: initialStateVisibilityIndicators,
        tags: stealthMode ? [] : [tooltipGuide.taggedElements[0].entityId],
        sidebarAutoFocused: false,
        sidebarOpen: false,
      });
    }
  );

  test.each([
    [TooltipShowOn.hover, false],
    [TooltipShowOn.load, true],
  ])('will show/hide according to sidebar (%s,%s)', (showOn, sidebarOpen) => {
    const tooltip = merge(cloneDeep(tooltipGuide), {
      isPreview: false,
      formFactorStyle: {
        tooltipShowOn: showOn,
      },
      taggedElements: [
        { wildcardUrl: 'https://trybento.co', isPreview: false },
      ],
    });

    const guides = [tooltip].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
    }));

    (getVisibleElement as jest.Mock).mockReturnValue('ImHere');

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
        sidebarOpen,
        taggedElements: keyBy(
          tooltip.taggedElements.map((t) => ({
            ...t,
            isPreview: false,
          })),
          'entityId'
        ),
        guideSelector: <T>() => guides[0] as T,
      })
    );

    const shouldFail = showOn === TooltipShowOn.load || sidebarOpen;

    expect(next).toEqual(
      atcResultMatch({
        [shouldFail ? 'hideGuides' : 'showGuides']: guides,
        stateOverrides: {
          tags: shouldFail ? [] : [tooltip.taggedElements[0].entityId],
          sidebarAutoFocused: false,
          sidebarOpen,
        },
      })
    );
  });

  test('wont show if tag is missing', () => {
    const intrusiveTooltip = merge(cloneDeep(tooltipGuide), {
      formFactorStyle: {
        hasBackgroundOverlay: true,
        tooltipShowOn: TooltipShowOn.load,
      },
      taggedElements: [
        { wildcardUrl: 'https://trybento.co', isPreview: false },
      ],
    });

    const guides = [intrusiveTooltip].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isPreview: false,
    }));

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
        taggedElements: {}, // simulate no tags found
        guideSelector: <T>() => guides[0] as T,
      })
    );

    expect(next).toEqual(
      atcResultMatch({
        hideGuides: guides,
      })
    );
  });

  test('wont show un-intrusive tooltip if targeting does not match', () => {
    const nonIntrusiveTooltip = merge(cloneDeep(tooltipGuide), {
      formFactorStyle: {
        hasBackgroundOverlay: false,
        tooltipShowOn: TooltipShowOn.hover,
      },
      taggedElements: [
        { wildcardUrl: 'https://bing.com/wont-match', isPreview: false },
      ],
    });

    const guides = [nonIntrusiveTooltip].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isPreview: false,
    }));

    const taggedElements = keyBy(
      nonIntrusiveTooltip.taggedElements,
      'entityId'
    );

    // given targeting comes first, the below is just a safe guard for the test
    (getVisibleElement as jest.Mock).mockReturnValue('MyNameIsJustin');

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://google.com',
        taggedElements,
        guideSelector: <T>() => guides[0] as T,
      })
    );

    expect(next).toEqual(
      atcResultMatch({
        hideGuides: guides,
      })
    );
  });

  test('will show un-intrusive tooltip but wont block other blocking experiences', () => {
    const nonIntrusiveTooltip = merge(cloneDeep(tooltipGuide), {
      formFactorStyle: {
        hasBackgroundOverlay: false,
        tooltipShowOn: TooltipShowOn.hover,
      },
      taggedElements: [{ wildcardUrl: 'https://google.com', isPreview: false }],
    });

    const guides = [nonIntrusiveTooltip, sampleBannerGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isPreview: false,
    }));

    const taggedElements = keyBy(
      nonIntrusiveTooltip.taggedElements,
      'entityId'
    );

    (getVisibleElement as jest.Mock).mockReturnValue('MyNameIsJustin');

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://google.com',
        taggedElements,
        guideSelector: <T>() => guides[0] as T,
      })
    );

    expect(next).toEqual(
      atcResultMatch({
        showGuides: guides,
        stateOverrides: {
          tags: Object.keys(taggedElements),
        },
      })
    );
  });

  test('wont show if target HTML element is not visible', () => {
    const nonIntrusiveTooltip = merge(cloneDeep(tooltipGuide), {
      formFactorStyle: {
        tooltipShowOn: TooltipShowOn.hover,
      },
      taggedElements: [
        { wildcardUrl: 'https://trybento.co', isPreview: false },
      ],
    });

    const guides = [nonIntrusiveTooltip].map((g) => ({
      ...fromFullGuideToGuide(g),
      isPreview: false,
      formFactorStyle: {
        ...g.formFactorStyle!,
        tooltipShowOn: TooltipShowOn.hover,
      },
    }));

    const taggedElements = keyBy(
      nonIntrusiveTooltip.taggedElements,
      'entityId'
    );

    // mimics element not found
    (getVisibleElement as jest.Mock).mockReturnValue(undefined);

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
        taggedElements,
        guideSelector: <T>() => guides[0] as T,
      })
    );

    expect(next).toEqual(
      atcResultMatch({
        hideGuides: guides,
      })
    );
  });
});

describe('ATC: tooltip: active journey', () => {
  test('wont show intrusive tooltip if not part of active journey', () => {
    const intrusiveTooltip = merge(cloneDeep(tooltipGuide), {
      isPreview: false,
      formFactorStyle: {
        tooltipShowOn: TooltipShowOn.load,
      },
      taggedElements: [
        { wildcardUrl: 'https://trybento.co', isPreview: false },
      ],
    });

    const guides = [intrusiveTooltip].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
    }));

    const taggedElements = keyBy(intrusiveTooltip.taggedElements, 'entityId');

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        activeJourney: fakeJourney(),
        currentPageUrl: 'https://trybento.co',
        taggedElements,
        guideSelector: <T>() => guides[0] as T,
      })
    );

    expect(next).toEqual(
      atcResultMatch({
        hideGuides: guides,
      })
    );
  });

  test('will show un-intrusive tooltip if not part of active journey', () => {
    const nonIntrusiveTooltip = merge(cloneDeep(tooltipGuide), {
      isPreview: false,
      formFactorStyle: {
        hasBackgroundOverlay: false,
        tooltipShowOn: TooltipShowOn.hover,
      },
      taggedElements: [
        { wildcardUrl: 'https://trybento.co', isPreview: false },
      ],
    });

    const guides = [nonIntrusiveTooltip].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
    }));

    const taggedElements = keyBy(
      nonIntrusiveTooltip.taggedElements,
      'entityId'
    );

    (getVisibleElement as jest.Mock).mockReturnValue('ImHere');

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        activeJourney: fakeJourney(),
        currentPageUrl: 'https://trybento.co',
        taggedElements,
        guideSelector: <T>() => guides[0] as T,
      })
    );

    expect(next).toEqual(
      atcResultMatch({
        showGuides: guides,
        stateOverrides: {
          tags: Object.keys(taggedElements),
        },
      })
    );
  });

  test('wont show intrusive if targeting does not match, despite of journey', () => {
    const intrusiveTooltip = merge(cloneDeep(tooltipGuide), {
      isPreview: false,
      formFactorStyle: {
        tooltipShowOn: TooltipShowOn.load,
      },
      taggedElements: [
        { wildcardUrl: 'https://trybento.co/wont-match', isPreview: false },
      ],
    });

    const guides = [intrusiveTooltip].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
    }));

    const taggedElements = keyBy(intrusiveTooltip.taggedElements, 'entityId');

    // the below is to prevent false negatives in case we checked for element visibility
    (getVisibleElement as jest.Mock).mockReturnValue('ImHere');

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        activeJourney: fakeJourneyWithGuide(intrusiveTooltip.entityId),
        currentPageUrl: 'https://google.com',
        taggedElements,
        guideSelector: <T>() => guides[0] as T,
      })
    );

    expect(next).toEqual(
      atcResultMatch({
        hideGuides: guides,
      })
    );
  });

  test('wont show intrusive if element is missing, despite of journey', () => {
    const intrusiveTooltip = merge(cloneDeep(tooltipGuide), {
      isPreview: false,
      formFactorStyle: {
        tooltipShowOn: TooltipShowOn.load,
      },
      taggedElements: [
        { wildcardUrl: 'https://trybento.co', isPreview: false },
      ],
    });

    const guides = [intrusiveTooltip].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
    }));

    const taggedElements = keyBy(intrusiveTooltip.taggedElements, 'entityId');

    // mimics element not found
    (getVisibleElement as jest.Mock).mockReturnValue(undefined);

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        activeJourney: fakeJourneyWithGuide(intrusiveTooltip.entityId),
        currentPageUrl: 'https://trybento.co',
        taggedElements,
        guideSelector: <T>() => guides[0] as T,
      })
    );

    expect(next).toEqual(
      atcResultMatch({
        hideGuides: guides,
      })
    );
  });
});
