import { GuideFormFactor, StepType, Theme } from '../types';
import {
  ModuleEntityId,
  Step,
  StepEntityId,
  StepState,
  TaggedElementEntityId,
} from '../types/globalShoyuState';
import { isFlowGuide } from '../utils/formFactor';
import { getTemplateByFormFactor } from '../utils/templates';
import {
  getDefaultStepCtas,
  isCarouselTheme,
  isVideoGalleryTheme,
} from './helpers';
import { v4 as uuidv4 } from 'uuid';

/**
 * FullGuide helpers for the embed.
 */

export const isFakeId = (id: string | undefined | null) =>
  typeof id === 'string' && id.startsWith('fake');

export const getFakeUuidEntityId = () => `fake-id-${uuidv4()}`;

export const getFakeUuidStepEntityId = () =>
  `fake-step-id-${uuidv4()}` as StepEntityId;

export const getFakeUuidModuleEntityId = () =>
  `fake-module-id-${uuidv4()}` as ModuleEntityId;

export const getFakeUuidTagEntityId = () =>
  `fake-tagged-element-id-${uuidv4()}` as TaggedElementEntityId;

export const getEmptyFullStep = ({
  theme,
  guideFormFactor,
  overrides,
  ...requiredStepData
}: {
  guideFormFactor: GuideFormFactor | undefined;
  theme: Theme | undefined;
  overrides?: Partial<Step>;
} & Pick<Step, 'entityId' | 'module' | 'guide' | 'orderIndex'>): Step => {
  const stepType =
    isCarouselTheme(theme) ||
    isVideoGalleryTheme(theme) ||
    isFlowGuide(guideFormFactor)
      ? StepType.fyi
      : StepType.optional;

  const bodySlate = getTemplateByFormFactor(guideFormFactor, theme);

  return {
    ...requiredStepData,
    hasViewedStep: false,
    isComplete: false,
    wasCompletedAutomatically: false,
    state: StepState.incomplete,
    name: '',
    bodySlate,
    mediaReferences: [],
    manualCompletionDisabled: false,
    stepType,
    ctas: getDefaultStepCtas({
      stepType,
      guideFormFactor,
      branchingMultiple: undefined,
      branchingType: undefined,
      theme: theme || Theme.nested,
    }),
    ...overrides,
  };
};
