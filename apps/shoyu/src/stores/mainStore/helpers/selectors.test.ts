import produce from 'immer';
import { sub } from 'date-fns';
import {
  EmbedFormFactor,
  GuideCompletionState,
  GuidePageTargetingType,
  TooltipShowOn,
  TooltipSize,
} from 'bento-common/types';
import bannerGuide from 'bento-common/sampleGuides/bannerGuide';
import modalGuide from 'bento-common/sampleGuides/modalGuide';
import standardGuide from 'bento-common/sampleGuides/standardGuide';
import flatGuide from 'bento-common/sampleGuides/flatGuide';
import compactGuide from 'bento-common/sampleGuides/compactGuide';
import cardGuide from 'bento-common/sampleGuides/cardGuide';
import carouselGuide from 'bento-common/sampleGuides/carouselGuide';
import flowGuide from 'bento-common/sampleGuides/flowGuide';
import tooltipGuide from 'bento-common/sampleGuides/sampleTooltipGuide';
import { SidebarVisibility } from 'bento-common/types/shoyuUIState';
import { transformedFullGuideAssociations } from 'bento-common/utils/previews';
import { addStepsToSampleGuide } from 'bento-common/utils/templates';

import mainStore, { initialState } from '..';
import {
  allTaggedElementsSelector,
  availableGuidesSelector,
  lastFinishedGuideSelector,
  leadingAnnouncementsSelector,
  nextUrlOfFlowSelector,
  previousGuidesSelector,
} from './selectors';
import {
  fromFullGuideToGuide,
  setAvailableGuides,
} from '../../../lib/testHelpers';
import previewGuideSet from '../actions/previewGuideSet';
import availableGuidesChanged from '../actions/availableGuidesChanged';
import guideChanged from '../actions/guideChanged';

jest.mock('../../../lib/graphqlClient');
jest.mock('../../mainStore/loaders/guideLoader');

jest.mock('.', () => ({
  __esModule: true,
  ...jest.requireActual('.'),
}));

jest.mock('./throttling', () => ({
  hasSeenAnotherModal: jest.fn(),
}));

afterEach(() => {
  jest.resetAllMocks();
  mainStore.setState(initialState);
});

describe('previousGuides', () => {
  test('wont return guides if there is no finished/dismissed guides', () => {
    const guides = [standardGuide, modalGuide, bannerGuide].map((g) => ({
      ...fromFullGuideToGuide(g),
      isComplete: false,
      isDone: false,
      isPreview: false,
    }));

    const nextState = produce(mainStore.getState(), (draftState) => {
      availableGuidesChanged(draftState, {
        availableGuides: guides,
      });
    });

    expect.assertions(2);
    [EmbedFormFactor.sidebar, EmbedFormFactor.inline].forEach((ff) => {
      const result = previousGuidesSelector(
        nextState,
        SidebarVisibility.show,
        undefined,
        ff
      );
      expect(result.total).toEqual(0);
    });
  });

  test('return finished/dismissed guides', () => {
    const guides = [
      {
        ...standardGuide,
        completionState: GuideCompletionState.complete,
        isPreview: false,
      },
      {
        ...modalGuide,
        completionState: GuideCompletionState.done,
        isPreview: false,
      },
    ].map((g) => fromFullGuideToGuide(g));

    const nextState = produce(mainStore.getState(), (draftState) => {
      availableGuidesChanged(draftState, {
        availableGuides: guides,
      });
    });

    expect.assertions(2);
    [EmbedFormFactor.sidebar, EmbedFormFactor.inline].forEach((ff) => {
      const result = previousGuidesSelector(
        nextState,
        SidebarVisibility.show,
        undefined,
        ff
      );
      expect(result.total).toEqual(2);
    });
  });

  test('wont return preview data for non-preview ff', () => {
    const guides = [
      {
        ...standardGuide,
        completionState: GuideCompletionState.complete,
        isPreview: false,
      },
      {
        ...modalGuide,
        completionState: GuideCompletionState.done,
        isPreview: false,
      },
      {
        ...bannerGuide,
        completionState: GuideCompletionState.complete,
        isPreview: false,
      },
    ].map((g) => fromFullGuideToGuide(g));

    const nextState = produce(mainStore.getState(), (draftState) => {
      availableGuidesChanged(draftState, {
        availableGuides: guides,
      });
      // preview guide will have its ids refreshed
      previewGuideSet(draftState, {
        guide: {
          ...transformedFullGuideAssociations(modalGuide, true),
          completionState: GuideCompletionState.complete,
          isPreview: true,
        },
        previewId: 'fake-preview-id',
        formFactor: EmbedFormFactor.modal,
      });
    });

    expect.assertions(2);

    [EmbedFormFactor.sidebar, EmbedFormFactor.inline].forEach((ff) => {
      const result = previousGuidesSelector(
        nextState,
        SidebarVisibility.show,
        undefined,
        ff
      );
      expect([
        ...result.onboarding,
        ...result.announcements,
      ]).not.toContainEqual(expect.objectContaining({ isPreview: true }));
    });
  });

  test('wont return real data for preview ff', () => {
    const guides = [
      {
        ...standardGuide,
        completionState: GuideCompletionState.complete,
        isPreview: false,
      },
      {
        ...modalGuide,
        completionState: GuideCompletionState.done,
        isPreview: false,
      },
      {
        ...bannerGuide,
        completionState: GuideCompletionState.complete,
        isPreview: false,
      },
    ].map((g) => fromFullGuideToGuide(g));

    const nextState = produce(mainStore.getState(), (draftState) => {
      availableGuidesChanged(draftState, {
        availableGuides: guides,
      });

      // preview guide will have its ids refreshed
      previewGuideSet(draftState, {
        guide: {
          ...transformedFullGuideAssociations(modalGuide, true),
          completionState: GuideCompletionState.complete,
          isPreview: true,
        },
        previewId: 'fake-preview-id',
        formFactor: EmbedFormFactor.modal,
      });
    });

    const result = previousGuidesSelector(
      nextState,
      SidebarVisibility.show,
      undefined,
      'fake-preview-id'
    );
    expect([...result.onboarding, ...result.announcements]).not.toContainEqual(
      expect.objectContaining({ isPreview: false })
    );
  });
});

describe('available guides', () => {
  test('returns available standard guide', () => {
    const state = mainStore.getState();
    const guides = [
      standardGuide,
      modalGuide,
      bannerGuide,
      carouselGuide,
      tooltipGuide,
    ].map((g) => ({
      ...fromFullGuideToGuide(g),
      isDone: false,
      isPreview: false,
    }));
    setAvailableGuides(state, guides);
    expect.assertions(2);
    [EmbedFormFactor.sidebar, EmbedFormFactor.inline].forEach((ff) => {
      const result = availableGuidesSelector(state, '', ff);
      expect(result).toHaveLength(1);
    });
  });

  test('returns available guides, discarding dismissed/saved announcements', () => {
    const state = mainStore.getState();
    const guides = [
      standardGuide,
      { ...modalGuide, isDone: true },
      { ...bannerGuide, isDone: true },
      carouselGuide,
      tooltipGuide,
    ].map((g) => ({
      ...fromFullGuideToGuide(g),
      isComplete: false,
      isPreview: false,
    }));
    setAvailableGuides(state, guides);
    expect.assertions(2);
    [EmbedFormFactor.sidebar, EmbedFormFactor.inline].forEach((ff) => {
      const result = availableGuidesSelector(state, '', ff);
      expect(result).toHaveLength(1);
    });
  });

  test('returns empty for incomplete inline contextual guides', () => {
    const state = mainStore.getState();
    const guides = [carouselGuide, cardGuide].map((g) => ({
      ...fromFullGuideToGuide(g),
      isComplete: false,
      isDone: false,
      isPreview: false,
    }));
    setAvailableGuides(state, guides);
    expect.assertions(2);
    [EmbedFormFactor.sidebar, EmbedFormFactor.inline].forEach((ff) => {
      const result = availableGuidesSelector(state, '', ff);
      expect(result).toHaveLength(0);
    });
  });

  test('returns empty for complete inline contextual guides', () => {
    const state = mainStore.getState();
    const guides = [carouselGuide, cardGuide].map((g) => ({
      ...fromFullGuideToGuide(g),
      completionState: GuideCompletionState.complete,
      isPreview: false,
    }));
    setAvailableGuides(state, guides);
    expect.assertions(2);
    [EmbedFormFactor.sidebar, EmbedFormFactor.inline].forEach((ff) => {
      const result = availableGuidesSelector(state, '', ff);
      expect(result).toHaveLength(0);
    });
  });
});

describe('leadingAnnouncementsSelector', () => {
  test('return empty if there are no announcements available at all', () => {
    const guides = [standardGuide, flatGuide, compactGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isComplete: false,
      isDone: false,
      isPreview: false,
      isViewed: false,
    }));

    const nextState = produce(mainStore.getState(), (draftState) => {
      availableGuidesChanged(draftState, {
        availableGuides: guides,
      });
    });

    expect(leadingAnnouncementsSelector(nextState, 0, null)).toEqual([]);
  });

  test('return empty if there are no leading announcements', () => {
    const guides = [standardGuide, modalGuide, bannerGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isComplete: false,
      isDone: false,
      isPreview: false,
      isViewed: false,
    }));

    const nextState = produce(mainStore.getState(), (draftState) => {
      availableGuidesChanged(draftState, {
        availableGuides: guides,
      });
    });

    expect(leadingAnnouncementsSelector(nextState, 0, null)).toEqual([]);
  });

  test('return empty if there leading announcement targets another page', () => {
    const guides = [modalGuide, standardGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isComplete: false,
      isDone: false,
      isPreview: false,
      isViewed: false,
    }));
    guides[0].pageTargetingType = GuidePageTargetingType.specificPage;
    guides[0].pageTargetingUrl = 'https://trybento.co';

    const nextState = produce(mainStore.getState(), (draftState) => {
      availableGuidesChanged(draftState, {
        availableGuides: guides,
      });
    });
    expect(
      leadingAnnouncementsSelector(nextState, 1, 'https://google.com')
    ).toEqual([]);
  });

  test('return the only leading announcement', () => {
    const guides = [modalGuide, compactGuide, bannerGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isComplete: false,
      isDone: false,
      isPreview: false,
      isViewed: false,
    }));

    const nextState = produce(mainStore.getState(), (draftState) => {
      availableGuidesChanged(draftState, {
        availableGuides: guides,
      });
    });

    const result = leadingAnnouncementsSelector(nextState, 1, null);
    expect(result).toHaveLength(1);
    expect(result).toEqual[
      expect.objectContaining({
        entityId: modalGuide.entityId,
      })
    ];
  });

  test('return all leading announcements', () => {
    const guides = [modalGuide, bannerGuide, flatGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isComplete: false,
      isDone: false,
      isPreview: false,
      isViewed: false,
    }));

    const nextState = produce(mainStore.getState(), (draftState) => {
      availableGuidesChanged(draftState, {
        availableGuides: guides,
      });
    });

    const result = leadingAnnouncementsSelector(nextState, 2, null);
    expect(result).toHaveLength(2);
    expect(result).toEqual[
      (expect.objectContaining({
        entityId: modalGuide.entityId,
      }),
      expect.objectContaining({
        entityId: bannerGuide.entityId,
      }))
    ];
  });
});

describe('allTaggedElementsSelector', () => {
  test('tags are returned in the correct order', () => {
    const originalGuides = [tooltipGuide, flowGuide].map((g, i) => ({
      ...g,
      orderIndex: i,
      isDestination: false,
      formFactorStyle: {
        hasArrow: true,
        hasBackgroundOverlay: true,
        tooltipShowOn: TooltipShowOn.load,
        tooltipSize: TooltipSize.medium,
      },
      taggedElements: g.taggedElements.map((t, k) => ({
        ...t,
        url: `https://everboarding.trybento.co/${i + k}`,
        wildcardUrl: `https://everboarding.trybento.co/${i + k}`,
        isPreview: false, // mimic a real tag
      })),
      isPreview: false,
    }));

    const taggedElements = originalGuides.map((g) => g.taggedElements);

    const guides = originalGuides.map((g) => fromFullGuideToGuide(g));

    const state = mainStore.getState();

    const nextState = produce(state, (draftState) => {
      availableGuidesChanged(draftState, {
        availableGuides: guides,
      });
      guides.forEach((_g, i) => {
        guideChanged(draftState, {
          guide: {
            ...addStepsToSampleGuide(originalGuides[i]),
            taggedElements: originalGuides[i].taggedElements,
          },
        });
      });
    });

    const result = allTaggedElementsSelector(nextState);
    expect(result).toHaveLength(3);
    expect(result).toEqual(taggedElements.flat());
  });
});

describe('lastFinishedGuideSelector', () => {
  test('return last completed guide, regardless of launch order', () => {
    const guides = [standardGuide, flatGuide, compactGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isComplete: false,
      isDone: false,
      isPreview: false,
      isViewed: false,
    }));

    Object.assign(guides[0], {
      completionState: GuideCompletionState.done,
      doneAt: sub(new Date(), { hours: 2 }).toISOString(),
      isDone: true,
    });

    Object.assign(guides[1], {
      completionState: GuideCompletionState.complete,
      completedAt: new Date().toISOString(),
      isComplete: true,
    });

    const nextState = produce(mainStore.getState(), (draftState) => {
      availableGuidesChanged(draftState, {
        availableGuides: guides,
      });
    });

    const result = lastFinishedGuideSelector(nextState, EmbedFormFactor.inline);
    expect(result).toMatchObject({
      entityId: flatGuide.entityId,
    });
  });

  test('return last done guide, regardless of launch order', () => {
    const guides = [standardGuide, flatGuide, compactGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isComplete: false,
      isDone: false,
      isPreview: false,
      isViewed: false,
    }));

    Object.assign(guides[0], {
      completionState: GuideCompletionState.complete,
      completedAt: sub(new Date(), { hours: 2 }).toISOString(),
      isComplete: true,
    });

    Object.assign(guides[1], {
      completionState: GuideCompletionState.complete,
      completedAt: sub(new Date(), { hours: 1 }).toISOString(),
      isComplete: true,
    });

    Object.assign(guides[2], {
      completionState: GuideCompletionState.done,
      doneAt: new Date().toISOString(),
      isDone: true,
    });

    const nextState = produce(mainStore.getState(), (draftState) => {
      availableGuidesChanged(draftState, {
        availableGuides: guides,
      });
    });

    const result = lastFinishedGuideSelector(nextState, EmbedFormFactor.inline);
    expect(result).toMatchObject({
      entityId: compactGuide.entityId,
    });
  });

  test('wont return a guide if all guides are incomplete', () => {
    const guides = [standardGuide, flatGuide, compactGuide].map((g, i) => ({
      ...fromFullGuideToGuide(g),
      orderIndex: i,
      isComplete: false,
      isDone: false,
      isPreview: false,
      isViewed: false,
    }));

    const nextState = produce(mainStore.getState(), (draftState) => {
      availableGuidesChanged(draftState, {
        availableGuides: guides,
      });
    });

    const result = lastFinishedGuideSelector(nextState, EmbedFormFactor.inline);
    expect(result).toBeUndefined();
  });
});

describe('nextUrlOfFlowSelector', () => {
  test.each(['currentStep', 'nextStep'])(
    'wont return placeholder URL for non-preview tags (%s)',
    (arg) => {
      const guides = [flowGuide].map((g, i) => ({
        ...fromFullGuideToGuide(g),
        orderIndex: i,
      }));

      const nextState = produce(mainStore.getState(), (draftState) => {
        availableGuidesChanged(draftState, {
          availableGuides: guides,
        });
        guideChanged(draftState, {
          guide: {
            ...addStepsToSampleGuide(flowGuide),
            taggedElements: flowGuide.taggedElements.map((t, i) => ({
              ...t,
              url: `https://invalid.fake.url/${i}`,
              wildcardUrl: `https://everboarding.trybento.co/${i}`,
              isPreview: false, // mimic a real tag
            })),
          },
        });
      });

      const stepMapper = {
        currentStep: flowGuide.modules[0]?.steps[0],
        nextStep: flowGuide.modules[0]?.steps[1],
      };

      const result = nextUrlOfFlowSelector(
        nextState,
        // @ts-expect-error
        {
          [arg]: stepMapper[arg],
        }
      );

      expect(result).toEqual('https://everboarding.trybento.co/1');
    }
  );

  test.each(['currentStep', 'nextStep'])(
    'will return placeholder URL for preview tags (%s)',
    (arg) => {
      const guides = [flowGuide].map((g, i) => ({
        ...fromFullGuideToGuide(g),
        orderIndex: i,
      }));

      const nextState = produce(mainStore.getState(), (draftState) => {
        availableGuidesChanged(draftState, {
          availableGuides: guides,
        });
        guideChanged(draftState, {
          guide: {
            ...addStepsToSampleGuide(flowGuide),
            taggedElements: flowGuide.taggedElements.map((t, i) => ({
              ...t,
              url: `https://invalid.fake.url/${i}`,
              isPreview: true, // mimic a real tag
            })),
          },
        });
      });

      const stepMapper = {
        currentStep: flowGuide.modules[0]?.steps[0],
        nextStep: flowGuide.modules[0]?.steps[1],
      };

      // @ts-ignore-error
      const result = nextUrlOfFlowSelector(nextState, {
        [arg]: stepMapper[arg],
      });

      expect(result).toEqual('https://invalid.fake.url/1');
    }
  );
});
