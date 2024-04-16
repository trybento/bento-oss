import { GuideFormFactor, Theme } from 'bento-common/types';

import { applyFinalCleanupHook } from 'src/data/datatests';
import { Template } from 'src/data/models/Template.model';
import {
  canDuplicateStepGroups,
  shouldDuplicateStepGroups,
} from 'src/interactions/library/duplicateTemplate';

jest.mock('src/interactions/library/duplicateTemplate', () => {
  const original = jest.requireActual(
    'src/interactions/library/duplicateTemplate'
  );
  return {
    ...original,
    shouldDuplicateStepGroups: jest.fn((...args) =>
      original.shouldDuplicateStepGroups(...args)
    ),
    __esModule: true,
  };
});

applyFinalCleanupHook();

afterEach(() => {
  jest.restoreAllMocks();
});

describe('canDuplicateStepGroups', () => {
  test('always returns true when we should necessarily duplicate', () => {
    (shouldDuplicateStepGroups as jest.Mock).mockReturnValueOnce(true);
    expect(canDuplicateStepGroups(new Template())).toBeTruthy();
  });

  test.each([
    GuideFormFactor.inline,
    GuideFormFactor.sidebar,
    GuideFormFactor.legacy,
    GuideFormFactor.flow,
  ])('returns true for %s onboarding guides', (formFactor) => {
    [Theme.nested, Theme.compact].forEach((theme) => {
      const template = new Template({
        formFactor,
        theme,
        isSideQuest: false,
      } as any);
      expect(canDuplicateStepGroups(template)).toBeTruthy();
    });
  });

  test('returns true for sidebar contextual guides', () => {
    const template = new Template({
      theme: Theme.nested,
      formFactor: GuideFormFactor.sidebar,
      isSideQuest: true,
    } as any);
    expect(canDuplicateStepGroups(template)).toBeTruthy();
  });

  test('returns true for carousel guides', () => {
    const template = new Template({
      theme: Theme.carousel,
      formFactor: GuideFormFactor.inline,
      isSideQuest: true,
    } as any);
    expect(canDuplicateStepGroups(template)).toBeTruthy();
  });
});

describe('shouldDuplicateStepGroups', () => {
  test.each([
    GuideFormFactor.modal,
    GuideFormFactor.banner,
    GuideFormFactor.tooltip,
  ])('returns true for %s', (formFactor) => {
    const template = new Template({
      formFactor,
      isSideQuest: true,
      theme: Theme.nested,
    } as any);
    expect(shouldDuplicateStepGroups(template)).toBeTruthy();
  });

  test('returns true for cards', () => {
    const template = new Template({
      formFactor: GuideFormFactor.inline,
      isSideQuest: true,
      theme: Theme.card,
    } as any);
    expect(shouldDuplicateStepGroups(template)).toBeTruthy();
  });

  test.each([Theme.nested, Theme.flat, Theme.compact, Theme.timeline])(
    'returns false for %s onboarding guides',
    (theme) => {
      const template = new Template({
        formFactor: GuideFormFactor.legacy,
        isSideQuest: false,
        theme,
      } as any);
      expect(shouldDuplicateStepGroups(template)).toBeFalsy();
    }
  );
});
