import { faker } from '@faker-js/faker';
import bannerGuide from 'bento-common/sampleGuides/bannerGuide';
import modalGuide from 'bento-common/sampleGuides/modalGuide';
import { GuideFormFactor } from 'bento-common/types';
import { EmbedTypenames, NpsSurvey } from 'bento-common/types/globalShoyuState';
import {
  NpsFollowUpQuestionType,
  NpsFormFactor,
  NpsPageTargetingType,
} from 'bento-common/types/netPromoterScore';
import { merge } from 'lodash';

import {
  airTrafficControl,
  initialStateVisibilityIndicators,
} from '../../BentoAirTrafficElement';
import { fromFullGuideToGuide } from '../../lib/testHelpers';
import { surveyAirTraffic } from '../../stores/airTrafficStore/helpers/airTraffic/surveyAirTraffic';
import { sortByOrderIndexAsc } from '../../stores/mainStore/helpers';
import { hasSeenAnotherModal } from '../../stores/mainStore/helpers/throttling';
import { fakeJourney, fromInitialAtcInput } from './airTraffic.test.helpers';

jest.mock('../../lib/graphqlClient');

jest.mock('../../stores/mainStore/helpers/throttling', () => ({
  hasSeenAnotherModal: jest.fn(),
}));

jest.mock(
  '../../stores/airTrafficStore/helpers/airTraffic/surveyAirTraffic',
  () => {
    const { surveyAirTraffic } = jest.requireActual(
      '../../stores/airTrafficStore/helpers/airTraffic/surveyAirTraffic'
    );
    return {
      surveyAirTraffic: jest.fn(surveyAirTraffic),
    };
  }
);

afterEach(() => {
  jest.restoreAllMocks();
});

const fakeSurvey = (overrides?: Partial<NpsSurvey>): NpsSurvey => {
  return merge(
    {
      __typename: EmbedTypenames.npsSurvey,
      entityId: faker.string.uuid(),
      name: faker.lorem.words(3),
      formFactor: faker.helpers.arrayElement(Object.values(NpsFormFactor)),
      formFactorStyles: {},
      question: faker.lorem.sentence(),
      fupType: faker.helpers.arrayElement(
        Object.values(NpsFollowUpQuestionType)
      ),
      fupSettings: {},
      orderIndex: 0,
      pageTargeting: {
        type: NpsPageTargetingType.anyPage,
      },
    },
    overrides
  );
};

describe.each([NpsFormFactor.banner])('surveys: %s', (surveyFormFactor) => {
  test('wont show if sidebar is open', () => {
    const survey = fakeSurvey({ formFactor: surveyFormFactor });

    const next = airTrafficControl(
      fromInitialAtcInput({
        sidebarOpen: true,
        contentAvailable: [survey].sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
      })
    );

    expect(surveyAirTraffic).toHaveBeenCalled();

    expect(next).toEqual({
      show: initialStateVisibilityIndicators,
      hide: {
        [EmbedTypenames.guide]: {},
        [EmbedTypenames.npsSurvey]: {
          [NpsFormFactor.banner]: [survey.entityId],
        },
      },
      tags: [],
      sidebarAutoFocused: false,
      sidebarOpen: true,
    });
  });

  test('wont show if there is an active journey', () => {
    const survey = fakeSurvey({ formFactor: surveyFormFactor });

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: [survey].sort(sortByOrderIndexAsc),
        activeJourney: fakeJourney(),
        currentPageUrl: 'https://trybento.co',
      })
    );

    expect(surveyAirTraffic).toHaveBeenCalled();

    expect(next).toEqual({
      show: initialStateVisibilityIndicators,
      hide: {
        [EmbedTypenames.guide]: {},
        [EmbedTypenames.npsSurvey]: {
          [NpsFormFactor.banner]: [survey.entityId],
        },
      },
      tags: [],
      sidebarAutoFocused: false,
      sidebarOpen: false,
    });
  });

  test.each(['answeredAt', 'dismissedAt'])(
    'wont show if not incomplete (%s)',
    (key) => {
      const survey = fakeSurvey({
        formFactor: surveyFormFactor,
        [key]: new Date(),
      });

      const next = airTrafficControl(
        fromInitialAtcInput({
          contentAvailable: [survey].sort(sortByOrderIndexAsc),
          currentPageUrl: 'https://trybento.co',
        })
      );

      expect(surveyAirTraffic).toHaveBeenCalled();

      expect(next).toEqual({
        show: initialStateVisibilityIndicators,
        hide: {
          [EmbedTypenames.guide]: {},
          [EmbedTypenames.npsSurvey]: {
            [NpsFormFactor.banner]: [survey.entityId],
          },
        },
        tags: [],
        sidebarAutoFocused: false,
        sidebarOpen: false,
      });
    }
  );

  test('wont show if targeting does not match', () => {
    const survey = fakeSurvey({
      formFactor: surveyFormFactor,
      pageTargeting: {
        type: NpsPageTargetingType.specificPage,
        url: 'https://everboarding.trybento.co',
      },
    });

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: [survey].sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
      })
    );

    expect(surveyAirTraffic).toHaveBeenCalled();

    expect(next).toEqual({
      show: initialStateVisibilityIndicators,
      hide: {
        [EmbedTypenames.guide]: {},
        [EmbedTypenames.npsSurvey]: {
          [NpsFormFactor.banner]: [survey.entityId],
        },
      },
      tags: [],
      sidebarAutoFocused: false,
      sidebarOpen: false,
    });
  });

  test('will show if targeting matches', () => {
    const survey = fakeSurvey({
      formFactor: surveyFormFactor,
      pageTargeting: {
        type: NpsPageTargetingType.specificPage,
        url: 'https://everboarding.trybento.co',
      },
    });

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: [survey].sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://everboarding.trybento.co',
      })
    );

    expect(surveyAirTraffic).toHaveBeenCalled();

    expect(next).toEqual({
      show: {
        [EmbedTypenames.guide]: {},
        [EmbedTypenames.npsSurvey]: {
          [NpsFormFactor.banner]: [survey.entityId],
        },
      },
      hide: initialStateVisibilityIndicators,
      tags: [],
      sidebarAutoFocused: false,
      sidebarOpen: false,
    });
  });

  test('wont show if there is a leading announcement', () => {
    const guides = [modalGuide, bannerGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isPreview: false,
    }));

    const survey = fakeSurvey({ formFactor: surveyFormFactor, orderIndex: 3 });

    (hasSeenAnotherModal as jest.Mock).mockReturnValue(false);

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: [...guides, survey].sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
      })
    );

    expect(surveyAirTraffic).toHaveBeenCalled();

    expect(next).toEqual({
      show: {
        [EmbedTypenames.guide]: {
          [GuideFormFactor.modal]: [modalGuide.entityId],
        },
        [EmbedTypenames.npsSurvey]: {},
      },
      hide: {
        [EmbedTypenames.guide]: {
          [GuideFormFactor.banner]: [bannerGuide.entityId],
        },
        [EmbedTypenames.npsSurvey]: {
          [NpsFormFactor.banner]: [survey.entityId],
        },
      },
      tags: [],
      sidebarAutoFocused: false,
      sidebarOpen: false,
    });
  });

  test('will show if is leading', () => {
    const survey = fakeSurvey({ formFactor: surveyFormFactor, orderIndex: 0 });

    const guides = [modalGuide, bannerGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i + 1,
      isPreview: false,
    }));

    (hasSeenAnotherModal as jest.Mock).mockReturnValue(false);

    const next = airTrafficControl(
      fromInitialAtcInput({
        contentAvailable: [...guides, survey].sort(sortByOrderIndexAsc),
        currentPageUrl: 'https://trybento.co',
      })
    );

    expect(surveyAirTraffic).toHaveBeenCalled();

    expect(next).toEqual({
      show: {
        [EmbedTypenames.guide]: {},
        [EmbedTypenames.npsSurvey]: {
          [NpsFormFactor.banner]: [survey.entityId],
        },
      },
      hide: {
        [EmbedTypenames.guide]: {
          [GuideFormFactor.modal]: [modalGuide.entityId],
          [GuideFormFactor.banner]: [bannerGuide.entityId],
        },
        [EmbedTypenames.npsSurvey]: {},
      },
      tags: [],
      sidebarAutoFocused: false,
      sidebarOpen: false,
    });
  });
});
