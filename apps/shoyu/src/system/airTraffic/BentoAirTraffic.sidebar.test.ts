import { faker } from '@faker-js/faker';
import modalGuide from 'bento-common/sampleGuides/modalGuide';
import flatGuide from 'bento-common/sampleGuides/flatGuide';
import contextualChecklistGuide from 'bento-common/sampleGuides/contextualChecklistGuide';
import { Guide } from 'bento-common/types/globalShoyuState';
import { GuidePageTargetingType, TagVisibility } from 'bento-common/types';

import { airTrafficControl } from '../../BentoAirTrafficElement';
import { fromFullGuideToGuide } from '../../lib/testHelpers';
import { sortByOrderIndexAsc } from '../../stores/mainStore/helpers';
import { sidebarAirTraffic } from '../../stores/airTrafficStore/helpers/airTraffic/sidebarAirTraffic';
import { shouldSidebarAutoOpen } from './airTraffic.helpers';
import {
  atcResultMatch,
  fromInitialAtcInput,
  fakeJourneyWithGuide,
} from './airTraffic.test.helpers';

jest.mock('../../lib/graphqlClient');

jest.mock(
  '../../stores/airTrafficStore/helpers/airTraffic/sidebarAirTraffic',
  () => {
    const { sidebarAirTraffic } = jest.requireActual(
      '../../stores/airTrafficStore/helpers/airTraffic/sidebarAirTraffic'
    );
    return {
      sidebarAirTraffic: jest.fn(sidebarAirTraffic),
    };
  }
);

afterEach(() => {
  jest.restoreAllMocks();
});

const guide: Guide = {
  ...fromFullGuideToGuide(flatGuide),
  isViewed: false,
};

const defaultContext = {
  isMobile: false,
  inlineEmbedPresent: false,
  settings: {
    preventAutoOpens: false,
    tagVisibility: TagVisibility.always,
  },
  toggledOffAtLeastOnce: false,
};

describe('ATC: sidebar auto open helper', () => {
  test('open on new onboarding', () => {
    const shouldOpen = shouldSidebarAutoOpen({
      guide,
      context: defaultContext,
    });

    expect(shouldOpen).toEqual(true);
  });

  test.each([
    {
      isMobile: false,
      inlineEmbedPresent: false,
      toggledOffAtLeastOnce: false,
      settings: {
        preventAutoOpens: true,
        tagVisibility: TagVisibility.always,
      },
    },
    {
      isMobile: false,
      inlineEmbedPresent: false,
      toggledOffAtLeastOnce: true,
      settings: {
        preventAutoOpens: false,
        tagVisibility: TagVisibility.always,
      },
    },
    {
      isMobile: true,
      inlineEmbedPresent: false,
      toggledOffAtLeastOnce: false,
      settings: {
        preventAutoOpens: false,
        tagVisibility: TagVisibility.always,
      },
    },
    {
      isMobile: false,
      inlineEmbedPresent: true,
      toggledOffAtLeastOnce: false,
      settings: {
        preventAutoOpens: false,
        tagVisibility: TagVisibility.always,
      },
    },
  ])('will not open on correct contexts', (context) => {
    const shouldOpen = shouldSidebarAutoOpen({
      guide,
      context,
    });

    expect(shouldOpen).toEqual(false);
  });
});

describe('ATC: sidebar', () => {
  test('selects sidebar-enabled guide', () => {
    const guides = [flatGuide].map((g) => ({
      ...fromFullGuideToGuide(g),
      isViewed: false,
      isPreview: false,
    }));

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides,
        currentPageUrl: 'https://juhwow.org',
        ...defaultContext,
      })
    );

    expect(sidebarAirTraffic).toHaveBeenCalled();
    expect(next).toEqual(
      atcResultMatch({
        showGuides: guides,
        stateOverrides: {
          sidebarAutoFocused: true,
        },
      })
    );
  });

  test.each([
    [false, GuidePageTargetingType.specificPage, 'http://fake.url/wont-match'],
    [true, GuidePageTargetingType.specificPage, 'https://juhwow.org'],
    [true, GuidePageTargetingType.anyPage, null],
  ])(
    'will show/hide sidebar contextual guide according to page targeting criteria (%s, %s)',
    (expectation, pageTargetingType, pageTargetingUrl) => {
      const guides = [contextualChecklistGuide].map((g, i) => ({
        ...fromFullGuideToGuide(g),
        orderIndex: i,
        isPreview: false,
        pageTargeting: {
          type: pageTargetingType,
          url: pageTargetingUrl,
        },
      }));

      const next = airTrafficControl(
        fromInitialAtcInput({
          contentAvailable: guides,
          currentPageUrl: 'https://juhwow.org',
          ...defaultContext,
        })
      );

      expect(sidebarAirTraffic).toHaveBeenCalled();
      expect(next).toEqual(
        atcResultMatch({
          [expectation ? 'showGuides' : 'hideGuides']: guides,
          stateOverrides: {
            sidebarAutoFocused: false,
          },
        })
      );
    }
  );

  test('auto-open base case sets correctly', () => {
    const guides = [flatGuide].map((g) => ({
      ...fromFullGuideToGuide(g),
      isViewed: false,
      isPreview: false,
    }));

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides,
        currentPageUrl: 'https://juhwow.org',
        ...defaultContext,
      })
    );

    expect(sidebarAirTraffic).toHaveBeenCalled();
    expect(next.sidebarAutoFocused).toEqual(true);
  });

  test('will not auto-open if already open', () => {
    const guides = [flatGuide].map((g) => ({
      ...fromFullGuideToGuide(g),
      isViewed: false,
      isPreview: false,
    }));

    const next = airTrafficControl(
      fromInitialAtcInput({
        sidebarOpen: true,
        contentAvailable: guides,
        currentPageUrl: 'https://juhwow.org',
        ...defaultContext,
      })
    );

    expect(sidebarAirTraffic).toHaveBeenCalled();
    expect(next.sidebarAutoFocused).toEqual(false);
  });

  test('will not auto-open if competing guides present', () => {
    const guides = [modalGuide, flatGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      isViewed: false,
      orderIndex: i,
      isPreview: false,
    }));

    const next = airTrafficControl(
      fromInitialAtcInput({
        initialized: true,
        sidebarOpen: false,
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        taggedElements: {},
        activeJourney: undefined,
        currentPageUrl: 'https://juhwow.org',
        ...defaultContext,
      })
    );

    expect(next.sidebarAutoFocused).toEqual(false);
  });

  test('will not auto-open during a journey', () => {
    const guides = [flatGuide].map((g) => ({
      ...fromFullGuideToGuide(g),
      isViewed: false,
      isPreview: false,
    }));

    const next = airTrafficControl(
      fromInitialAtcInput({
        initialized: true,
        sidebarOpen: false,
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        activeJourney: fakeJourneyWithGuide(faker.string.uuid()),
        currentPageUrl: 'https://trybento.co',
      })
    );

    expect(next).toEqual(
      atcResultMatch({
        hideGuides: guides,
        showGuides: [],
      })
    );
  });

  test('will not auto-open if previously toggled off', () => {
    const guides = [flatGuide].map((g) => ({
      ...fromFullGuideToGuide(g),
      isViewed: false,
      isPreview: false,
    }));

    const next = airTrafficControl(
      fromInitialAtcInput({
        initialized: true,
        sidebarOpen: false,
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
        toggledOffAtLeastOnce: true,
      })
    );

    expect(next.sidebarAutoFocused).toEqual(false);
  });
});
