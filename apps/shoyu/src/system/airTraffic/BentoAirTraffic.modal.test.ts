import { faker } from '@faker-js/faker';
import modalGuide from 'bento-common/sampleGuides/modalGuide';
import {
  GuideCompletionState,
  GuideFormFactor,
  GuidePageTargetingType,
} from 'bento-common/types';
import { EmbedTypenames } from 'bento-common/types/globalShoyuState';

import {
  airTrafficControl,
  initialStateVisibilityIndicators,
} from '../../BentoAirTrafficElement';
import { fromFullGuideToGuide } from '../../lib/testHelpers';
import { modalAirTraffic } from '../../stores/airTrafficStore/helpers/airTraffic/modalAirTraffic';
import { sortByOrderIndexAsc } from '../../stores/mainStore/helpers';
import { hasSeenAnotherModal } from '../../stores/mainStore/helpers/throttling';
import {
  atcResultMatch,
  fakeJourneyWithGuide,
  fromInitialAtcInput,
} from './airTraffic.test.helpers';

jest.mock('../../lib/graphqlClient');

jest.mock('../../stores/mainStore/helpers/throttling', () => ({
  hasSeenAnotherModal: jest.fn(),
}));

jest.mock(
  '../../stores/airTrafficStore/helpers/airTraffic/modalAirTraffic',
  () => {
    const { modalAirTraffic } = jest.requireActual(
      '../../stores/airTrafficStore/helpers/airTraffic/modalAirTraffic'
    );
    return {
      modalAirTraffic: jest.fn(modalAirTraffic),
    };
  }
);

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ATC: announcement: modal', () => {
  test.each([false, true])(
    'will show/hide according to stealth mode (%s)',
    (stealthMode) => {
      const guides = [modalGuide].map((g, i) => ({
        ...fromFullGuideToGuide(g),
        orderIndex: i,
        isPreview: false,
      }));

      (hasSeenAnotherModal as jest.Mock).mockReturnValue(false);

      const next = airTrafficControl(
        fromInitialAtcInput({
          contentAvailable: guides.sort(sortByOrderIndexAsc),
          currentPageUrl: 'https://trybento.co',
          stealthMode,
        })
      );

      expect(next).toEqual({
        [stealthMode ? 'hide' : 'show']: {
          [EmbedTypenames.guide]: {
            [GuideFormFactor.modal]: [modalGuide.entityId],
          },
          [EmbedTypenames.npsSurvey]: {},
        },
        [stealthMode ? 'show' : 'hide']: initialStateVisibilityIndicators,
        tags: [],
        sidebarAutoFocused: false,
        sidebarOpen: false,
      });
    }
  );

  test('wont show modal if another has been seen', () => {
    const guides = [modalGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isPreview: false,
    }));

    (hasSeenAnotherModal as jest.Mock).mockReturnValue(true);

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
      })
    );

    expect(modalAirTraffic).toHaveBeenCalled();

    expect(next).toEqual({
      show: initialStateVisibilityIndicators,
      hide: {
        [EmbedTypenames.guide]: {
          [GuideFormFactor.modal]: [modalGuide.entityId],
        },
        [EmbedTypenames.npsSurvey]: {},
      },
      tags: [],
      sidebarAutoFocused: false,
      sidebarOpen: false,
    });
  });

  test.each([
    [GuidePageTargetingType.anyPage, undefined, true],
    [GuidePageTargetingType.specificPage, 'https://trybento.co', true],
    [GuidePageTargetingType.specificPage, 'https://google.com', false],
  ])(
    'will/wont show incomplete modal part of active journey depending on targeting criteria (%s)',
    (pageTargetingType, url, shouldMatch) => {
      const guides = [modalGuide].map((g, i) => ({
        ...fromFullGuideToGuide(g),
        orderIndex: i,
        isPreview: false,
        pageTargeting: {
          type: pageTargetingType,
          url,
        },
      }));

      (hasSeenAnotherModal as jest.Mock).mockReturnValue(true);

      const next = airTrafficControl(
        fromInitialAtcInput({
          contentAvailable: guides.sort(sortByOrderIndexAsc),
          activeJourney: fakeJourneyWithGuide(guides[0].entityId),
          currentPageUrl: 'https://trybento.co',
        })
      );

      expect(modalAirTraffic).toHaveBeenCalled();

      expect(next).toEqual(
        atcResultMatch({
          [shouldMatch ? 'showGuides' : 'hideGuides']: guides,
        })
      );
    }
  );

  test.each([
    [GuidePageTargetingType.anyPage, 'saved'],
    [GuidePageTargetingType.anyPage, 'finished'],
    [GuidePageTargetingType.specificPage, 'saved'],
    [GuidePageTargetingType.specificPage, 'finished'],
  ])(
    'will show saved/completed modal part of active journey regardless of targeting criteria',
    (pageTargetingType, completionState) => {
      const guides = [modalGuide].map((g, i) => ({
        ...fromFullGuideToGuide(g),
        orderIndex: i,
        isPreview: false,
        ...(completionState === 'saved'
          ? {
              completionState: GuideCompletionState.incomplete,
              savedAt: new Date(),
            }
          : completionState === 'finished'
          ? {
              completionState: GuideCompletionState.complete,
              completedAt: new Date(),
            }
          : {}),
        pageTargeting: {
          type: pageTargetingType,
          url:
            pageTargetingType === GuidePageTargetingType.specificPage
              ? faker.internet.url()
              : undefined,
        },
      }));

      (hasSeenAnotherModal as jest.Mock).mockReturnValue(true);

      const next = airTrafficControl(
        fromInitialAtcInput({
          contentAvailable: guides.sort(sortByOrderIndexAsc),
          activeJourney: fakeJourneyWithGuide(guides[0].entityId),
          currentPageUrl: 'https://trybento.co',
        })
      );

      expect(modalAirTraffic).toHaveBeenCalled();

      expect(next).toEqual(
        atcResultMatch({
          showGuides: guides,
        })
      );
    }
  );

  test('"has seen another" throttling wont affect previews', () => {
    const guides = [modalGuide, modalGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isPreview: i % 2 === 0, // odds will be false, evens true
    }));

    (hasSeenAnotherModal as jest.Mock).mockReturnValue(true);

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
      })
    );

    expect(next).toEqual({
      show: {
        [EmbedTypenames.guide]: {
          [GuideFormFactor.modal]: [guides[0].entityId],
        },
        [EmbedTypenames.npsSurvey]: {},
      },
      hide: {
        [EmbedTypenames.guide]: {
          [GuideFormFactor.modal]: [guides[1].entityId],
        },
        [EmbedTypenames.npsSurvey]: {},
      },
      tags: [],
      sidebarAutoFocused: false,
      sidebarOpen: false,
    });
  });

  test('wont show if sidebar is open', () => {
    const guides = [modalGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isPreview: false,
    }));

    (hasSeenAnotherModal as jest.Mock).mockReturnValue(false);

    const next = airTrafficControl(
      fromInitialAtcInput({
        sidebarOpen: true,
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
      })
    );

    expect(next).toEqual({
      show: initialStateVisibilityIndicators,
      hide: {
        [EmbedTypenames.guide]: {
          [GuideFormFactor.modal]: [guides[0].entityId],
        },
        [EmbedTypenames.npsSurvey]: {},
      },
      tags: [],
      sidebarAutoFocused: false,
      sidebarOpen: true,
    });
  });

  test('wont show if targeting does not match', () => {
    const guides = [modalGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      pageTargeting: {
        type: GuidePageTargetingType.specificPage,
        url: 'https://everboarding.trybento.co',
      },
      orderIndex: i,
      isPreview: false,
    }));

    (hasSeenAnotherModal as jest.Mock).mockReturnValue(false);

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://demo.trybento.co',
      })
    );

    expect(next).toEqual({
      show: initialStateVisibilityIndicators,
      hide: {
        [EmbedTypenames.guide]: {
          [GuideFormFactor.modal]: [guides[0].entityId],
        },
        [EmbedTypenames.npsSurvey]: {},
      },
      tags: [],
      sidebarAutoFocused: false,
      sidebarOpen: false,
    });
  });
});
