import { $enum } from 'ts-enum-util';
import {
  GuidePageTargetingType,
  StepType,
  WithOptionalPicks,
} from 'bento-common/types';
import {
  FullGuide,
  Guide,
  ModuleEntityId,
  Step,
  StepEntityId,
  StepState,
  TaggedElementEntityId,
} from 'bento-common/types/globalShoyuState';

import mainStore from '../stores/mainStore';
import availableGuidesChanged from '../stores/mainStore/actions/availableGuidesChanged';
import { WorkingState } from '../stores/mainStore/types';

// This should be moved to a mock file, but couldn't
// figure out why it wasn't working there.
// @see https://github.com/pmndrs/zustand/blob/main/docs/guides/testing.mdx
import { act } from 'react-dom/test-utils';
import { addStepsToSampleGuide } from 'bento-common/utils/templates';
import { faker } from '@faker-js/faker';

const storeResetFns = new Set<() => void>();
[mainStore].forEach((store) => {
  const initialState = store.getState();
  storeResetFns.add(() => store.setState(initialState, true));
});
beforeEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => resetFn());
    mainStore.setState({
      initialized: new Date(),
    });
  });
});
// END

/** @todo change this to dispatch an action instead */
export const setAvailableGuides = (state: WorkingState, guides: Guide[]) => {
  availableGuidesChanged(state, {
    availableGuides: guides,
  });
};

export const fromFullGuideToGuide = (
  guide: WithOptionalPicks<FullGuide, 'steps'>
): Guide => {
  const moduleEntityIds: ModuleEntityId[] = guide.modules.map(
    (m) => m.entityId
  );
  const stepEntityIds: StepEntityId[] = guide.steps
    ? guide.steps.map((s) => s.entityId)
    : guide.modules.flatMap((m) => m.steps.map((s) => s.entityId));
  const taggedElementEntityIds: TaggedElementEntityId[] =
    guide.taggedElements.map((t) => t.entityId);

  return {
    ...addStepsToSampleGuide(guide),
    modules: moduleEntityIds,
    steps: stepEntityIds,
    taggedElements: taggedElementEntityIds,
  };
};

/**
 * @todo add remaining fields
 */
export const fakeSteps = (count = 0, overrides: Partial<Step> = {}) => {
  const steps: Partial<Step>[] = [];

  for (let index = 0; index < count; index++) {
    const state = faker.helpers.arrayElement($enum(StepState).getValues());
    const isComplete = state === StepState.complete;

    steps.push({
      entityId: faker.string.uuid() as StepEntityId,
      name: faker.lorem.words(),
      stepType: faker.helpers.arrayElement([StepType.fyi, StepType.optional]),
      state,
      module: faker.string.uuid() as ModuleEntityId,
      orderIndex: index,
      isComplete,
      completedAt: isComplete ? new Date() : undefined,
      ...overrides,
    });
  }
  return steps;
};

export const makeGuideTargeting = (
  type: GuidePageTargetingType,
  url: string | undefined = undefined
): Partial<Guide> => {
  return {
    pageTargeting: {
      type,
      url,
    },
    // below is for backwards compatibility
    pageTargetingType: type,
    pageTargetingUrl: url,
  };
};
