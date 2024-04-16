import produce from 'immer';
import { cloneDeep, assign } from 'lodash';
import { faker } from '@faker-js/faker';
import modalGuide from 'bento-common/sampleGuides/modalGuide';
import { EmbedTypenames } from 'bento-common/types/globalShoyuState';
import bannerGuide from 'bento-common/sampleGuides/bannerGuide';
import { GuidePageTargetingType } from 'bento-common/types';
import mainStore, { initialState } from '..';
import {
  startAirTrafficJourney,
  endAirTrafficJourney,
} from '../../airTrafficStore/helpers/airTraffic.helpers';
import destinationGuideLaunched from './destinationGuideLaunched';
import { makeGuideTargeting } from '../../../lib/testHelpers';
import { isTargetPage } from 'bento-common/utils/urls';
import { displayUrlToWildcardUrl } from 'bento-common/utils/wildcardUrlHelpers';

jest.mock('../../../lib/graphqlClient');

jest.mock('../../airTrafficStore/helpers/airTraffic.helpers', () => ({
  startAirTrafficJourney: jest.fn(),
  endAirTrafficJourney: jest.fn(),
}));

const { location } = window;

beforeAll(() => {
  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = { assign: jest.fn() };
});

afterEach(() => {
  jest.resetAllMocks();
  mainStore.setState(initialState);
});

afterAll(() => {
  window.location = location;
});

/**
 * @todo fix selectedFromGuide/selectedFromModule being undefined to startAirTrafficJourney
 */

describe('Action: destinationGuideLaunched', () => {
  test.each([
    [modalGuide, 'https://demo.trybento.co/employees'],
    [modalGuide, 'https://demo.trybento.co/'],
    [bannerGuide, 'https://demo.trybento.co/employees'],
    [bannerGuide, 'https://demo.trybento.co/'],
  ])(
    'announcement targeted to specific page is either selected or we redirect ($formFactor)',
    (g, pageTargetingUrl) => {
      const announcement = assign(cloneDeep(g), {
        ...makeGuideTargeting(
          GuidePageTargetingType.specificPage,
          pageTargetingUrl
        ),
      });

      const startedFromStepEntityId = faker.string.uuid();

      const appLocation = 'https://demo.trybento.co/';

      const nextState = produce(mainStore.getState(), (draftState) => {
        destinationGuideLaunched(draftState, {
          startedFromStepEntityId,
          guide: announcement,
          stepAutoCompleteInteractions: [],
          appLocation,
        });
      });

      const selections = {
        selectedGuide: announcement.entityId,
        selectedModule: announcement.modules[0].entityId,
        selectedStep: announcement.modules[0].steps[0].entityId,
      };

      expect(startAirTrafficJourney).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EmbedTypenames.guide,
          startedFromStep: startedFromStepEntityId,
          startedOnPageUrl: appLocation,
          ...selections,
          selectedPageUrl: pageTargetingUrl,
          endingCriteria: {
            dismissSelection: true,
            closeSidebar: false,
            navigateAway: true,
          },
        })
      );

      if (isTargetPage(pageTargetingUrl, appLocation)) {
        expect(nextState).toMatchObject({
          formFactors: {
            [announcement.formFactor]: selections,
          },
        });
      } else {
        expect(window.location.assign).toHaveBeenCalledWith(pageTargetingUrl);
      }
    }
  );

  test.each([modalGuide, bannerGuide])(
    'journey is ended if cannot make the redirect to page-targeted announcements',
    (g) => {
      const pageTargetingUrl = displayUrlToWildcardUrl(
        'https://demo.trybento.co/employees/*'
      );
      const announcement = assign(cloneDeep(g), {
        ...makeGuideTargeting(
          GuidePageTargetingType.specificPage,
          pageTargetingUrl
        ),
      });

      const startedFromStepEntityId = faker.string.uuid();

      const appLocation = 'https://demo.trybento.co/';

      const nextState = () => {
        produce(mainStore.getState(), (draftState) => {
          destinationGuideLaunched(draftState, {
            startedFromStepEntityId,
            guide: announcement,
            stepAutoCompleteInteractions: [],
            appLocation,
          });
        });
      };

      expect(nextState).toThrow();

      expect(startAirTrafficJourney).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EmbedTypenames.guide,
          startedFromStep: startedFromStepEntityId,
          startedOnPageUrl: appLocation,
          selectedGuide: announcement.entityId,
          selectedModule: announcement.modules[0].entityId,
          selectedStep: announcement.modules[0].steps[0].entityId,
          selectedPageUrl: pageTargetingUrl,
          endingCriteria: {
            dismissSelection: true,
            closeSidebar: false,
            navigateAway: true,
          },
        })
      );

      expect(endAirTrafficJourney).toHaveBeenCalledWith({
        reason: { navigateAway: true },
      });
    }
  );

  test.each([modalGuide, bannerGuide])(
    'announcement targeted to any page is properly selected ($formFactor)',
    (g) => {
      const announcement = assign(cloneDeep(g), {});
      const startedFromStepEntityId = faker.string.uuid();

      const nextState = produce(mainStore.getState(), (draftState) => {
        destinationGuideLaunched(draftState, {
          startedFromStepEntityId,
          guide: announcement,
          stepAutoCompleteInteractions: [],
          appLocation: 'https://trybento.co',
        });
      });

      const selections = {
        selectedGuide: announcement.entityId,
        selectedModule: announcement.modules[0].entityId,
        selectedStep: announcement.modules[0].steps[0].entityId,
      };

      expect(startAirTrafficJourney).toHaveBeenCalledWith(
        expect.objectContaining({
          startedFromStep: startedFromStepEntityId,
          startedOnPageUrl: 'https://trybento.co',
          ...selections,
          selectedPageUrl: undefined,
          endingCriteria: {
            dismissSelection: true,
            closeSidebar: false,
            navigateAway: false,
          },
        })
      );

      expect(nextState).toMatchObject({
        formFactors: {
          [announcement.formFactor]: selections,
        },
      });
    }
  );
});
