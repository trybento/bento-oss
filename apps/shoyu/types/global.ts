import React from 'react';
import { AtLeast } from 'bento-common/types';
import { Step } from 'bento-common/types/globalShoyuState';

export type FormFactorFlags = {
  isInline: boolean;
  isSidebar: boolean;
  isModal: boolean;
  isBanner: boolean;
  isTooltip: boolean;
  isFlow: boolean;
};

export interface BranchingChoice {
  label: string;
  choiceKey: string;
  selected?: boolean;
}

export enum StepAction {
  Completion = 'completion',
  Skipped = 'skipped',
}

export type FeatureFlags = {
  isCustomCSSFlagEnabled: boolean;
  isTooltipInsideWindowEnabled: boolean;
  isDisableWindowScrollHookEnabled: boolean;
  isNpsSurveysEnabled: boolean;
  isSidebarDisabled: boolean;
  isForcedAvailableGuidesHydrationEnabled: boolean;
  observeStylingAttributes: boolean;
};

export type BranchingModuleProps = {
  selectedGuideModule?: null;
  selectedStep?: null;
  autoOpenGuideModuleEntityId?: string;
};

export enum StepTransition {
  accordion = 'accordion',
  slide = 'slide',
  none = 'none',
}

export enum StepCTAPosition {
  bottom = 'bottom',
  bottomFixedSpaced = 'bottom_fixed_spaced',
  bottomRight = 'bottom_right',
}

export type GuideCardDetails = {
  firstIncompleteStep: AtLeast<Step, 'name'> | undefined;
  firstStepName: string | undefined;
  lastStepName: string | undefined;
  description: string | undefined;
  stepCount: number;
};

export type WithSidebarContentWrapperRef = {
  /**
   * Ref to the module list wrapper div element.
   * This is currently being used to place the "active step" button using
   * React portals within the StepSeparator component.
   */
  sidebarContentWrapperRef?: React.RefObject<HTMLDivElement>;
};
