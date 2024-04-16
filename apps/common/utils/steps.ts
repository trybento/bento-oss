import { StepState } from '../types/globalShoyuState';

export const isFinishedStep = (state: StepState | undefined | null) => {
  return [StepState.complete, StepState.skipped].includes(state);
};

export const isCompleteStep = (state: StepState | undefined | null) => {
  return state === StepState.complete;
};

export const isSkippedStep = (state: StepState | undefined | null) => {
  return state === StepState.skipped;
};

export const isIncompleteStep = (state: StepState | undefined | null) => {
  return state === StepState.incomplete;
};
