import { assign, cloneDeep } from 'lodash';
import { faker } from '@faker-js/faker';

import { EmbedTypenames, Guide } from 'bento-common/types/globalShoyuState';
import { initialStateVisibilityIndicators } from '../../BentoAirTrafficElement';
import {
  AirTrafficControlInput,
  DesiredState,
  Journey,
} from '../../stores/airTrafficStore/types';
import { RecursivePartial, TagVisibility } from 'bento-common/types';
import { EmbedFormFactorsForGuideFormFactor } from 'bento-common/data/helpers';

type Args = {
  showGuides?: Guide[];
  hideGuides?: Guide[];
  stateOverrides?: Partial<DesiredState>;
};

/**
 * Construct a mock ATC return object depending on what guides we
 *   expect to show/hide
 */
export const atcResultMatch = ({
  stateOverrides,
  showGuides = [],
  hideGuides = [],
}: Args): DesiredState => {
  const result: DesiredState = assign(
    {
      sidebarAutoFocused: false,
      sidebarOpen: false,
      show: cloneDeep(initialStateVisibilityIndicators),
      hide: cloneDeep(initialStateVisibilityIndicators),
      tags: [],
    },
    stateOverrides
  );

  const addGuideToResult = (bucket: 'hide' | 'show', g: Guide) => {
    const embedFf = EmbedFormFactorsForGuideFormFactor[g.formFactor];

    embedFf.forEach((ff) => {
      result[bucket][EmbedTypenames.guide][ff]
        ? result[bucket][EmbedTypenames.guide][ff]!.push(g.entityId)
        : (result[bucket][EmbedTypenames.guide][ff] = [g.entityId]);
    });
  };

  showGuides?.forEach((g) => addGuideToResult('show', g));

  hideGuides?.forEach((g) => addGuideToResult('hide', g));

  return result;
};

/**
 * Fakes an air traffic control journey, while accepting overrides.
 *
 * NOTE: Most of its contents are randomly-generated in order to provide a valid (but fake)
 * journey for focused testing purposes.
 */
export const fakeJourney = (overrides?: RecursivePartial<Journey>): Journey => {
  const type = overrides?.type || EmbedTypenames.guide;

  switch (type) {
    case EmbedTypenames.guide:
      return assign(
        {
          type,
          entityId: faker.string.uuid(),
          startedAt: new Date(),
          startedOnPageUrl: faker.internet.url(),
          startedFromGuide: faker.string.uuid(),
          startedFromModule: faker.string.uuid(),
          startedFromStep: faker.string.uuid(),
          selectedGuide: faker.string.uuid(),
          selectedPageUrl: faker.internet.url(),
          endingCriteria: {
            timeElapsed: true,
            closeSidebar: false,
            dismissSelection: false,
            navigateAway: false,
          },
        },
        overrides
      );

    case EmbedTypenames.npsSurvey:
      return assign(
        {
          type,
          entityId: faker.string.uuid(),
          startedAt: new Date(),
          startedOnPageUrl: faker.internet.url(),
          selectedSurvey: faker.string.uuid(),
          selectedPageUrl: faker.internet.url(),
          endingCriteria: {
            timeElapsed: false,
            closeSidebar: false,
            dismissSelection: false,
            navigateAway: false,
          },
        },
        overrides
      );

    default:
      throw new Error(`Refused to fake a journey for unknown type: ${type}`);
  }
};

/**
 * Returns a clean slate air traffic control input, while accepting overrides.
 *
 * WARNING: If no overrides are given, this will return the expected *initial* state for ATC,
 * meaning no assumptions are being made here and nothing is being randomly generated.
 */
export const fromInitialAtcInput = (
  overrides?: Partial<AirTrafficControlInput>
): AirTrafficControlInput => {
  return assign(
    {
      initialized: true,
      contentAvailable: [],
      taggedElements: {},
      activeJourney: undefined,
      currentPageUrl: undefined,
      stealthMode: false,
      sidebarOpen: false,
      sidebarSelectedStep: undefined,
      isMobile: false,
      inlineEmbedPresent: false,
      settings: {
        preventAutoOpens: false,
        tagVisibility: TagVisibility.always,
      },
      toggledOffAtLeastOnce: false,
      guideSelector: () => {},
      stepSelector: () => {},
      taggedElementOfStepSelector: () => {},
    },
    overrides
  );
};

export const fakeJourneyWithGuide = (guideEntityId?: string) =>
  fakeJourney({
    selectedGuide: guideEntityId,
  });
