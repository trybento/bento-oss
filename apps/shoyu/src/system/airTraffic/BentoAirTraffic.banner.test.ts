import { faker } from '@faker-js/faker';
import bannerGuide from 'bento-common/sampleGuides/bannerGuide';
import modalGuide from 'bento-common/sampleGuides/modalGuide';
import { GuideFormFactor, GuidePageTargetingType } from 'bento-common/types';
import { EmbedTypenames } from 'bento-common/types/globalShoyuState';

import {
  airTrafficControl,
  initialStateVisibilityIndicators,
} from '../../BentoAirTrafficElement';
import { fromFullGuideToGuide } from '../../lib/testHelpers';
import { sortByOrderIndexAsc } from '../../stores/mainStore/helpers';
import { bannerAirTraffic } from '../../stores/airTrafficStore/helpers/airTraffic/bannerAirTraffic';
import {
  atcResultMatch,
  fakeJourneyWithGuide,
  fromInitialAtcInput,
} from './airTraffic.test.helpers';

jest.mock('../../lib/graphqlClient');

jest.mock(
  '../../stores/airTrafficStore/helpers/airTraffic/bannerAirTraffic',
  () => {
    const { bannerAirTraffic } = jest.requireActual(
      '../../stores/airTrafficStore/helpers/airTraffic/bannerAirTraffic'
    );
    return {
      bannerAirTraffic: jest.fn(bannerAirTraffic),
    };
  }
);

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ATC: announcement: banners', () => {
  test.each([false, true])(
    'will show/hide according to stealth mode (%s)',
    (stealthMode) => {
      const guides = [bannerGuide].map((g, i) => ({
        ...fromFullGuideToGuide(g),
        orderIndex: i,
        isPreview: false,
      }));

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
            [GuideFormFactor.banner]: [bannerGuide.entityId],
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

  test('shows on match', () => {
    const targetingUrl = faker.internet.url();
    const guides = [bannerGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      pageTargeting: {
        type: GuidePageTargetingType.specificPage,
        url: targetingUrl,
      },
      orderIndex: i,
      isPreview: false,
    }));

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: targetingUrl,
      })
    );

    expect(bannerAirTraffic).toHaveBeenCalled();

    expect(next).toEqual(atcResultMatch({ showGuides: guides }));
  });

  test('wont show if targeting does not match', () => {
    const guides = [bannerGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      pageTargeting: {
        type: GuidePageTargetingType.specificPage,
        url: 'https://everboarding.trybento.co',
      },
      orderIndex: i,
      isPreview: false,
    }));

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://demo.trybento.co',
      })
    );

    expect(next).toEqual(atcResultMatch({ hideGuides: guides }));
  });

  test('wont show if modal precedes it', () => {
    const guides = [modalGuide, bannerGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isPreview: false,
    }));

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://demo.trybento.co',
      })
    );

    expect(next).toEqual(
      atcResultMatch({
        showGuides: [guides[0]],
        hideGuides: [guides[1]],
      })
    );
  });

  test('wont show if sidebar is open', () => {
    const guides = [bannerGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isPreview: false,
    }));

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
        stateOverrides: {
          sidebarOpen: true,
        },
      })
    );
  });

  test('displays if other announcements not eligible', () => {
    const guides = [
      {
        ...modalGuide,
        pageTargeting: {
          type: GuidePageTargetingType.specificPage,
          url: 'https://everboarding.trybento.co',
        },
      },
      bannerGuide,
    ].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isPreview: false,
    }));

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://demo.trybento.co',
      })
    );

    expect(next).toEqual(
      atcResultMatch({
        hideGuides: [guides[0]],
        showGuides: [guides[1]],
      })
    );
  });

  test('will show if part of an active journey', () => {
    const guides = [modalGuide, modalGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      entityId: faker.string.uuid(),
      orderIndex: i,
      isPreview: false,
      completedAt: i % 2 === 0 ? new Date() : undefined, // odds will be undefined
    }));

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        activeJourney: fakeJourneyWithGuide(guides[1].entityId),
        currentPageUrl: 'https://trybento.co',
      })
    );

    expect(next).toEqual(
      atcResultMatch({
        hideGuides: [guides[0]],
        showGuides: [guides[1]],
      })
    );
  });

  test('will not show if not part of an active journey', () => {
    const guides = [modalGuide, modalGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      entityId: faker.string.uuid(),
      orderIndex: i,
      isPreview: false,
      completedAt: i % 2 === 0 ? new Date() : undefined, // odds will be undefined
    }));

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: guides.sort(sortByOrderIndexAsc),
        activeJourney: fakeJourneyWithGuide(faker.string.uuid()),
        currentPageUrl: 'https://trybento.co',
      })
    );

    expect(next).toEqual(
      atcResultMatch({
        hideGuides: [guides[0], guides[1]],
        showGuides: [],
      })
    );
  });
});
