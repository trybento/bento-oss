import { faker } from '@faker-js/faker';
import { merge } from 'lodash';
import { deProxify } from 'bento-common/data/helpers';
import { EmbedFormFactor, GuideCompletionState } from 'bento-common/types';
import {
  ModuleEntityId,
  Step,
  StepState,
  TaggedElement,
  TaggedElementEntityId,
} from 'bento-common/types/globalShoyuState';
import { addStepsToSampleGuide } from 'bento-common/utils/templates';
import bannerGuide from 'bento-common/sampleGuides/bannerGuide';
import modalGuide from 'bento-common/sampleGuides/modalGuide';
import standardGuide from 'bento-common/sampleGuides/standardGuide';
import tooltipGuide from 'bento-common/sampleGuides/sampleTooltipGuide';

import {
  cleanOrphanedItems,
  computeStepsCompletionState,
  getGuideCompletionUpdateData,
  mergeTaggedElements,
} from '.';
import mainStore from '..';
import { fromFullGuideToGuide, fakeSteps } from '../../../lib/testHelpers';
import produce from 'immer';
import sampleTooltipTaggedElement from 'bento-common/sampleGuides/sampleTooltipTaggedElement';

jest.mock('../../../lib/graphqlClient');

describe('cleanOrphanedItems', () => {
  beforeEach(() => {
    const state = mainStore.getState();
    state.dispatch({
      type: 'guideChanged',
      guide: { ...addStepsToSampleGuide(standardGuide), isPreview: false },
    });
  });

  afterEach(() => {
    mainStore.destroy();
  });

  test('cleans guides not in any form factor', () => {
    const state = deProxify(mainStore.getState());
    cleanOrphanedItems(state);
    expect(state.guides[standardGuide.entityId]).toBeUndefined();
    for (const { entityId } of standardGuide.modules) {
      expect(state.modules[entityId]).toBeUndefined();
    }
    for (const { entityId } of standardGuide.modules.flatMap((m) => m.steps)) {
      expect(state.steps[entityId]).toBeUndefined();
    }
  });

  test('keeps guides in a form factor', () => {
    let state = mainStore.getState();
    state.dispatch({
      type: 'formFactorGuidesUpdated',
      formFactor: EmbedFormFactor.inline,
      formFactorStateKey: EmbedFormFactor.inline,
      guides: [fromFullGuideToGuide(standardGuide)],
    });
    state = deProxify(mainStore.getState());
    cleanOrphanedItems(state);
    expect(state.guides[standardGuide.entityId]).toBeDefined();
    for (const { entityId } of standardGuide.modules) {
      expect(state.modules[entityId]).toBeDefined();
    }
    for (const { entityId } of standardGuide.modules.flatMap((m) => m.steps)) {
      expect(state.steps[entityId]).toBeDefined();
    }
  });

  test('keeps guides but removes modules no longer in the guide', () => {
    let state = mainStore.getState();
    state.dispatch({
      type: 'formFactorGuidesUpdated',
      formFactor: EmbedFormFactor.inline,
      formFactorStateKey: EmbedFormFactor.inline,
      guides: [fromFullGuideToGuide(standardGuide)],
    });
    state = deProxify(mainStore.getState());
    state.guides[standardGuide.entityId].modules = [];
    cleanOrphanedItems(state);
    expect(state.guides[standardGuide.entityId]).toBeDefined();
    for (const { entityId } of standardGuide.modules) {
      expect(state.modules[entityId]).toBeUndefined();
    }
    for (const { entityId } of standardGuide.modules.flatMap((m) => m.steps)) {
      expect(state.steps[entityId]).toBeUndefined();
    }
  });

  test('keeps guides and remaining modules but removes modules no longer in the guide', () => {
    let state = mainStore.getState();
    state.dispatch({
      type: 'formFactorGuidesUpdated',
      formFactor: EmbedFormFactor.inline,
      formFactorStateKey: EmbedFormFactor.inline,
      guides: [fromFullGuideToGuide(standardGuide)],
    });
    state = deProxify(mainStore.getState());
    state.guides[standardGuide.entityId].modules = [
      standardGuide.modules[1].entityId,
    ];
    cleanOrphanedItems(state);
    expect(state.guides[standardGuide.entityId]).toBeDefined();
    expect(state.modules[standardGuide.modules[0].entityId]).toBeUndefined();
    expect(state.modules[standardGuide.modules[1].entityId]).toBeDefined();
    for (const { entityId } of standardGuide.modules[0].steps) {
      expect(state.steps[entityId]).toBeUndefined();
    }
    for (const { entityId } of standardGuide.modules[1].steps) {
      expect(state.steps[entityId]).toBeDefined();
    }
  });

  test('keeps guides modules and remaining steps but removes steps no longer in the guide', () => {
    let state = mainStore.getState();
    state.dispatch({
      type: 'formFactorGuidesUpdated',
      formFactor: EmbedFormFactor.inline,
      formFactorStateKey: EmbedFormFactor.inline,
      guides: [fromFullGuideToGuide(standardGuide)],
    });
    state = deProxify(mainStore.getState());
    state.modules[standardGuide.modules[0].entityId].steps =
      standardGuide.modules[0].steps.slice(0, 2).map((s) => s.entityId);
    cleanOrphanedItems(state);
    expect(state.guides[standardGuide.entityId]).toBeDefined();
    for (const { entityId } of standardGuide.modules) {
      expect(state.modules[entityId]).toBeDefined();
    }
    for (const { entityId } of standardGuide.modules[0].steps.slice(0, 2)) {
      expect(state.steps[entityId]).toBeDefined();
    }
    for (const { entityId } of standardGuide.modules[0].steps.slice(2)) {
      expect(state.steps[entityId]).toBeUndefined();
    }
    for (const { entityId } of standardGuide.modules[1].steps) {
      expect(state.steps[entityId]).toBeDefined();
    }
  });

  test('keeps guides and remaining modules but removes modules without a guide', () => {
    let state = mainStore.getState();
    state.dispatch({
      type: 'formFactorGuidesUpdated',
      formFactor: EmbedFormFactor.inline,
      formFactorStateKey: EmbedFormFactor.inline,
      guides: [fromFullGuideToGuide(standardGuide)],
    });
    state = deProxify(mainStore.getState());
    state.modules[standardGuide.modules[0].entityId].guide = undefined;
    cleanOrphanedItems(state);
    expect(state.guides[standardGuide.entityId]).toBeDefined();
    expect(state.modules[standardGuide.modules[0].entityId]).toBeUndefined();
    expect(state.modules[standardGuide.modules[1].entityId]).toBeDefined();
    for (const { entityId } of standardGuide.modules[0].steps) {
      expect(state.steps[entityId]).toBeUndefined();
    }
    for (const { entityId } of standardGuide.modules[1].steps) {
      expect(state.steps[entityId]).toBeDefined();
    }
  });
});

describe('computeStepsCompletionState', () => {
  test('all steps incomplete', () => {
    const moduleEntityId = faker.string.uuid() as ModuleEntityId;
    const steps = fakeSteps(5, {
      module: moduleEntityId,
      state: StepState.incomplete,
      isComplete: false,
    }) as Step[];
    expect(
      computeStepsCompletionState(fromFullGuideToGuide(standardGuide), steps)
    ).toEqual({
      completion: StepState.incomplete,
      guideCompletedStepsCount: 0,
      moduleCompletedStepsCounts: {
        [moduleEntityId]: 0,
      },
    });
  });

  test('all steps complete', () => {
    const moduleEntityId = faker.string.uuid() as ModuleEntityId;
    const steps = fakeSteps(5, {
      module: moduleEntityId,
      state: StepState.complete,
      completedAt: new Date(),
      isComplete: true,
    }) as Step[];
    expect(
      computeStepsCompletionState(fromFullGuideToGuide(standardGuide), steps)
    ).toEqual({
      completion: StepState.complete,
      guideCompletedStepsCount: 5,
      moduleCompletedStepsCounts: {
        [moduleEntityId]: 5,
      },
    });
  });

  test('all steps skipped', () => {
    const moduleEntityId = faker.string.uuid() as ModuleEntityId;
    const steps = fakeSteps(3, {
      module: moduleEntityId,
      state: StepState.skipped,
      isComplete: false,
    }) as Step[];
    expect(
      computeStepsCompletionState(fromFullGuideToGuide(standardGuide), steps)
    ).toEqual({
      completion: StepState.skipped,
      guideCompletedStepsCount: 0,
      moduleCompletedStepsCounts: {
        [moduleEntityId]: 0,
      },
    });
  });

  test('many steps completed, one incomplete and one skipped', () => {
    const moduleEntityId = faker.string.uuid() as ModuleEntityId;
    const steps = fakeSteps(5, {
      module: moduleEntityId,
      state: StepState.complete,
      completedAt: new Date(),
      isComplete: true,
    }) as Step[];

    steps[0] = {
      ...steps[0],
      state: StepState.incomplete,
      completedAt: undefined,
      isComplete: false,
    };
    steps[4] = {
      ...steps[0],
      state: StepState.skipped,
      isComplete: false,
    };

    expect(
      computeStepsCompletionState(fromFullGuideToGuide(standardGuide), steps)
    ).toEqual({
      completion: StepState.incomplete,
      guideCompletedStepsCount: 3,
      moduleCompletedStepsCounts: {
        [moduleEntityId]: 3,
      },
    });
  });

  test('completed steps counts', () => {
    const moduleEntityIds = [
      faker.string.uuid(),
      faker.string.uuid(),
      faker.string.uuid(),
    ] as ModuleEntityId[];

    const steps = Array.from(Array(3).keys())
      .map((_, i) =>
        fakeSteps(4 - i, {
          module: moduleEntityIds[i],
          state: StepState.complete,
          completedAt: new Date(),
          isComplete: true,
        })
      )
      .flat() as Step[];

    expect(
      computeStepsCompletionState(fromFullGuideToGuide(standardGuide), steps)
    ).toMatchObject({
      guideCompletedStepsCount: 9,
      moduleCompletedStepsCounts: {
        [moduleEntityIds[0]]: 4,
        [moduleEntityIds[1]]: 3,
        [moduleEntityIds[2]]: 2,
      },
    });
  });
});

describe('getGuideCompletetionUpdateData', () => {
  const nowMock = new Date();
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(nowMock);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test.each([modalGuide, bannerGuide, tooltipGuide])(
    '[$formFactor] that is incomplete',
    (g) => {
      const guide = fromFullGuideToGuide(g);
      const steps = modalGuide.modules[0].steps;

      expect(getGuideCompletionUpdateData(guide, steps)).toEqual({
        entityId: expect.anything(),
        completedAt: undefined,
        completedStepsCount: 0,
        completionState: GuideCompletionState.incomplete,
        doneAt: undefined,
        firstIncompleteModule: modalGuide.modules[0].entityId,
        firstIncompleteStep: modalGuide.modules[0].steps[0].entityId,
        isComplete: false,
        isDone: false,
        moduleCompletedStepsCounts: {
          [modalGuide.modules[0].entityId]: 0,
        },
      });
    }
  );

  test.each([modalGuide, bannerGuide, tooltipGuide])(
    '[$formFactor] that got skipped',
    (g) => {
      const guide = fromFullGuideToGuide(g);
      const steps = [
        {
          ...modalGuide.modules[0].steps[0],
          state: StepState.skipped,
        },
      ];

      expect(getGuideCompletionUpdateData(guide, steps)).toEqual({
        entityId: expect.anything(),
        completedAt: undefined,
        completedStepsCount: 0,
        completionState: GuideCompletionState.done,
        doneAt: nowMock,
        firstIncompleteModule: undefined,
        firstIncompleteStep: undefined,
        isComplete: false,
        isDone: true,
        moduleCompletedStepsCounts: {
          [modalGuide.modules[0].entityId]: 0,
        },
      });
    }
  );

  test.each([modalGuide, bannerGuide, tooltipGuide])(
    '[$formFactor] that got complete',
    (g) => {
      const guide = fromFullGuideToGuide(g);
      const steps = [
        {
          ...modalGuide.modules[0].steps[0],
          state: StepState.complete,
          isComplete: true,
          completedAt: new Date(),
        },
      ];

      expect(getGuideCompletionUpdateData(guide, steps)).toEqual({
        entityId: expect.anything(),
        completedAt: nowMock,
        completedStepsCount: 1,
        completionState: GuideCompletionState.complete,
        doneAt: nowMock,
        firstIncompleteModule: undefined,
        firstIncompleteStep: undefined,
        isComplete: true,
        isDone: true,
        moduleCompletedStepsCounts: {
          [modalGuide.modules[0].entityId]: 1,
        },
      });
    }
  );
});

describe('mergeTaggedElements', () => {
  test('client-side flags are not removed when merging', () => {
    const baseTag = {
      ...sampleTooltipTaggedElement,
      entityId: 'fake-tag-1',
      guide: 'fake-guide-1',
    };

    const previousTaggedElements: Record<TaggedElementEntityId, TaggedElement> =
      {
        [baseTag.entityId]: {
          ...baseTag,
          // flags below shouldn't be removed
          scrollIntoView: true,
          forcefullyOpen: true,
        },
      };

    const changedTaggedElements = {
      [baseTag.entityId]: {
        ...baseTag,
        elementSelector: 'new-selector',
      },
      'fake-tag-2': {
        ...sampleTooltipTaggedElement,
        entityId: 'fake-tag-2',
        guide: 'fake-guide-2',
      },
    };

    const nextState = produce(mainStore.getState(), (draftState) => {
      draftState.taggedElements = previousTaggedElements;
      mergeTaggedElements(draftState, changedTaggedElements);
    });

    expect(nextState.taggedElements).toEqual(
      merge(previousTaggedElements, changedTaggedElements)
    );
  });
});
