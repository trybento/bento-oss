import sampleTooltipGuide from 'bento-common/sampleGuides/sampleTooltipGuide';
import {
  airTrafficControl,
  initialState,
  shouldEndJourney,
} from '../../BentoAirTrafficElement';
import { fromFullGuideToGuide } from '../../lib/testHelpers';
import { fakeJourney, fromInitialAtcInput } from './airTraffic.test.helpers';

jest.mock('../../lib/graphqlClient');

afterEach(() => {
  jest.restoreAllMocks();
});

describe('common', () => {
  test('initial state is returned if not initialized', () => {
    const next = airTrafficControl(
      fromInitialAtcInput({
        initialized: false,
      })
    );
    expect(next).toEqual(initialState);
  });

  test('initial state is returned if input is empty', () => {
    const next = airTrafficControl(fromInitialAtcInput());
    expect(next).toEqual(initialState);
  });
});

describe('automatically end journeys', () => {
  test('should not end if no active journey', () => {
    const [shouldEnd, reason] = shouldEndJourney({
      initializedAt: Date.now(),
      activeJourney: undefined,
      activeJourneySelectedGuide: undefined,
      currentPageUrl: undefined,
      guidesShown: [],
      sidebarOpen: false,
    });

    expect(shouldEnd).toEqual(false);
    expect(reason).toBeUndefined();
  });

  test('should end if sidebar is closed', () => {
    const [shouldEnd, reason] = shouldEndJourney({
      initializedAt: Date.now(),
      activeJourney: fakeJourney({
        endingCriteria: {
          closeSidebar: true,
          dismissSelection: false,
          navigateAway: false,
        },
      }),
      activeJourneySelectedGuide: undefined,
      currentPageUrl: undefined,
      guidesShown: [],
      prevSidebarOpen: true,
      sidebarOpen: false,
    });

    expect(shouldEnd).toEqual(true);
    expect(reason).toEqual({ closeSidebar: true });
  });

  test('should end if selected guide is missing', () => {
    const [shouldEnd, reason] = shouldEndJourney({
      initializedAt: Date.now(),
      activeJourney: fakeJourney({
        endingCriteria: {
          closeSidebar: false,
          dismissSelection: true,
          navigateAway: false,
        },
      }),
      activeJourneySelectedGuide: undefined,
      currentPageUrl: undefined,
      guidesShown: [],
      sidebarOpen: false,
    });

    expect(shouldEnd).toEqual(true);
    expect(reason).toEqual({ dismissSelection: true });
  });

  test.each([
    'http://google.com/starting-path',
    'https://google.com/selected-path',
  ])(
    'should not end if were on starting/destination urls',
    (currentPageUrl) => {
      const fakeGuide = {
        ...fromFullGuideToGuide(sampleTooltipGuide),
        isPreview: false,
      };

      const [shouldEnd, reason] = shouldEndJourney({
        initializedAt: Date.now(),
        activeJourney: fakeJourney({
          startedOnPageUrl: 'http://google.com/starting-path',
          selectedPageUrl: 'https://google.com/selected-path',
          endingCriteria: {
            closeSidebar: false,
            dismissSelection: false,
            navigateAway: true,
          },
        }),
        activeJourneySelectedGuide: fakeGuide,
        currentPageUrl,
        guidesShown: [fakeGuide],
        sidebarOpen: false,
      });

      expect(shouldEnd).toEqual(false);
      expect(reason).toBeUndefined();
    }
  );

  test('should end if we navigate to completely different url', () => {
    const fakeGuide = {
      ...fromFullGuideToGuide(sampleTooltipGuide),
      isPreview: false,
    };

    const [shouldEnd, reason] = shouldEndJourney({
      initializedAt: Date.now(),
      activeJourney: fakeJourney({
        startedOnPageUrl: 'http://google.com/starting-path',
        selectedPageUrl: 'https://google.com/different-path',
        endingCriteria: {
          closeSidebar: false,
          dismissSelection: false,
          navigateAway: true,
          timeElapsed: false,
        },
      }),
      activeJourneySelectedGuide: fakeGuide,
      currentPageUrl: 'https://www.google.com/search?q=dogs',
      guidesShown: [fakeGuide],
      sidebarOpen: false,
    });

    expect(shouldEnd).toEqual(true);
    expect(reason).toEqual({ navigateAway: true });
  });
});
