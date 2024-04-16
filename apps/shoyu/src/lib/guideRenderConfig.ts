import React from 'react';
import {
  isCarouselTheme,
  isInputStep,
  isNestedTheme,
} from 'bento-common/data/helpers';
import {
  BodyPadding,
  CardStyle,
  CtasOrientation,
  EmbedFormFactor,
  FormFactorStyle,
  StepBodyOrientation,
  StepSeparationStyle,
  StepType,
  Theme,
} from 'bento-common/types';
import {
  Guide,
  Module,
  Step,
  StepCTA,
  StepState,
} from 'bento-common/types/globalShoyuState';
import { View } from 'bento-common/types/shoyuUIState';
import { isActiveGuidesView } from 'bento-common/frontend/shoyuStateHelpers';
import { ButtonElement, ExtractedNodes } from 'bento-common/types/slate';

import { isBranching } from './helpers';
import FlatStepWrapper from '../components/layouts/flat/StepWrapper';
import NestedModuleCard from '../components/layouts/nested/ModuleCard';
import FlatModuleCard from '../components/layouts/flat/ModuleCard';
import CompactModuleCard from '../components/layouts/compact/ModuleCard';
import TimelineModuleCard from '../components/layouts/timeline/ModuleCard';
import TimelineStepWrapper from '../components/layouts/timeline/StepWrapper';
import CarouselModuleCard from '../components/layouts/carousel/ModuleCard';
import CarouselStepWrapper from '../components/layouts/carousel/StepWrapper';
import CarouselStepControls from '../components/layouts/carousel/StepControls';
import { getAreInputsAnswered } from './inputHelpers';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import {
  StepCTAPosition,
  StepTransition,
  WithSidebarContentWrapperRef,
} from '../../types/global';
import CardStepWrapper from '../components/layouts/card/StepWrapper';
import CardModuleCard from '../components/layouts/card/ModuleCard';
import CardStepControls from '../components/layouts/card/StepControls';
import VideoGalleryModuleCard from '../components/layouts/videoGallery/ModuleCard';
import VideoGalleryStepWrapper from '../components/layouts/videoGallery/StepWrapper';

export type StepWrapperProps = {
  step: Step;
  handleSelectedStep: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleStepCompletion: (e: React.MouseEvent<HTMLDivElement>) => void;
  embedFormFactor: EmbedFormFactor;
  renderedFormFactor: EmbedFormFactor;
  isSelected: boolean;
  selectable: boolean;
  extractedNodes: ExtractedNodes | undefined;
  fixedStepHeight: number | undefined;
  imageWidth: string | undefined;
  setAdditionalHeight: (h: number) => void;
  transition: StepTransition;
  expanded: boolean;
  multiModule: boolean;
  singleStep: boolean;
  style: FormFactorStyle | undefined;
  combineModules?: boolean;
  extractedNodesContainerStyle: React.CSSProperties;
  allowMarginlessImages: boolean;
  children?: React.ReactNode;
};

export type ModuleCardProps = WithSidebarContentWrapperRef & {
  guide?: Guide;
  module?: Module;
  combineModules?: boolean;
  theme: Theme | undefined;
  multiModule: boolean;
  showSeparator: boolean;
  transition: StepTransition;
  isSelected: boolean;
  singleStep: boolean;
};

export type StepControlsProps = {
  ctas: (StepCTA | ButtonElement)[];
  formatting: StepCTAPosition;
  fullWidth?: boolean;
  strong?: boolean;
  orientation: CtasOrientation | undefined;
  theme: Theme | undefined;
  step: Step | undefined;
};

export enum SeparationBetween {
  none,
  steps,
  modules,
}

export type GuideRenderConfig = {
  stepTransition: StepTransition;
  stepControlsTransition: StepTransition;
  moduleTransition: StepTransition;
  moduleNameInStepView: boolean;
  defaultStepBodyOrientation: StepBodyOrientation;
  verticalCtaPosition: StepCTAPosition;
  horizontalCtaPosition?: StepCTAPosition;
  horizontalCtasBelowContent: boolean;
  StepWrapper?: React.ComponentType<StepWrapperProps>;
  ModuleCard: React.ComponentType<ModuleCardProps>;
  StepControls?: React.ComponentType<StepControlsProps>;
  bodyPadding?: BodyPadding;
  extractedContentPadding?: {
    x?: number;
    y?: number;
  };
  minStepHeight: number | undefined;
  maxStepHeight: number | undefined;
  stepScrolls?: boolean;
  stepContentGap: number;
  guideStyleBackgroundField?: keyof Pick<CardStyle, 'backgroundColor'>;
  borderSeparationBackgroundField?: keyof Pick<
    CustomUIProviderValue,
    'backgroundColor'
  >;
  boxCompleteBackgroundField?: keyof Pick<
    StepSeparationStyle,
    'boxCompleteBackgroundColor'
  >;
  showMoreBackgroundField?:
    | keyof Pick<
        CustomUIProviderValue,
        'cardBackgroundColor' | 'backgroundColor'
      >;
  separation: SeparationBetween;
  skipModuleViewIfOnlyOne?: boolean;
  combineModules?: boolean;
  showSuccessOnStepComplete: boolean;
  // override settings if the render and embed form factors are different
  renderedFormFactorOverrides?: Partial<GuideRenderConfig>;
};

const stepRenderConfigByTheme: {
  [key in Theme]: {
    [key in
      | EmbedFormFactor.sidebar
      | EmbedFormFactor.inline]: GuideRenderConfig;
  };
} = {
  [Theme.flat]: {
    [EmbedFormFactor.inline]: {
      stepTransition: StepTransition.none,
      stepControlsTransition: StepTransition.none,
      moduleTransition: StepTransition.none,
      moduleNameInStepView: false,
      defaultStepBodyOrientation: StepBodyOrientation.horizontal,
      verticalCtaPosition: StepCTAPosition.bottom,
      horizontalCtasBelowContent: false,
      StepWrapper: FlatStepWrapper,
      ModuleCard: FlatModuleCard,
      minStepHeight: undefined,
      boxCompleteBackgroundField: 'boxCompleteBackgroundColor',
      maxStepHeight: 150,
      extractedContentPadding: { x: 16, y: 16 },
      stepContentGap: 8,
      showMoreBackgroundField: 'cardBackgroundColor',
      separation: SeparationBetween.steps,
      showSuccessOnStepComplete: false,
    },
    [EmbedFormFactor.sidebar]: {
      stepTransition: StepTransition.accordion,
      stepControlsTransition: StepTransition.accordion,
      moduleTransition: StepTransition.accordion,
      moduleNameInStepView: false,
      defaultStepBodyOrientation: StepBodyOrientation.vertical,
      verticalCtaPosition: StepCTAPosition.bottom,
      horizontalCtasBelowContent: false,
      StepWrapper: FlatStepWrapper,
      ModuleCard: FlatModuleCard,
      minStepHeight: undefined,
      maxStepHeight: undefined,
      boxCompleteBackgroundField: 'boxCompleteBackgroundColor',
      stepContentGap: 8,
      separation: SeparationBetween.steps,
      showSuccessOnStepComplete: false,
      renderedFormFactorOverrides: {
        stepTransition: StepTransition.none,
        maxStepHeight: 150,
        showMoreBackgroundField: 'cardBackgroundColor',
        extractedContentPadding: { x: 16, y: 16 },
      },
    },
  },
  [Theme.nested]: {
    [EmbedFormFactor.inline]: {
      stepTransition: StepTransition.none,
      stepControlsTransition: StepTransition.none,
      moduleTransition: StepTransition.accordion,
      moduleNameInStepView: false,
      defaultStepBodyOrientation: StepBodyOrientation.vertical,
      verticalCtaPosition: StepCTAPosition.bottom,
      horizontalCtasBelowContent: true,
      bodyPadding: { x: 24, t: 16 },
      minStepHeight: 400,
      maxStepHeight: 600,
      showMoreBackgroundField: 'cardBackgroundColor',
      ModuleCard: NestedModuleCard,
      stepContentGap: 24,
      separation: SeparationBetween.modules,
      showSuccessOnStepComplete: true,
    },
    [EmbedFormFactor.sidebar]: {
      stepTransition: StepTransition.slide,
      stepControlsTransition: StepTransition.slide,
      moduleTransition: StepTransition.accordion,
      moduleNameInStepView: false,
      defaultStepBodyOrientation: StepBodyOrientation.vertical,
      verticalCtaPosition: StepCTAPosition.bottom,
      horizontalCtasBelowContent: true,
      minStepHeight: undefined,
      maxStepHeight: undefined,
      stepScrolls: true,
      bodyPadding: { x: 16, t: 12 },
      ModuleCard: NestedModuleCard,
      stepContentGap: 24,
      separation: SeparationBetween.modules,
      showSuccessOnStepComplete: true,
      renderedFormFactorOverrides: {
        minStepHeight: 400,
        maxStepHeight: 600,
        showMoreBackgroundField: 'backgroundColor',
      },
    },
  },
  [Theme.compact]: {
    [EmbedFormFactor.inline]: {
      stepTransition: StepTransition.accordion,
      stepControlsTransition: StepTransition.accordion,
      moduleTransition: StepTransition.accordion,
      moduleNameInStepView: true,
      defaultStepBodyOrientation: StepBodyOrientation.vertical,
      verticalCtaPosition: StepCTAPosition.bottom,
      horizontalCtasBelowContent: true,
      minStepHeight: undefined,
      maxStepHeight: 300,
      borderSeparationBackgroundField: 'backgroundColor',
      ModuleCard: CompactModuleCard,
      stepContentGap: 24,
      showMoreBackgroundField: 'cardBackgroundColor',
      // the compact step wrapper handle wrapping each step individually so
      // this is effectively setting the separation between the steps
      separation: SeparationBetween.modules,
      showSuccessOnStepComplete: false,
    },
    [EmbedFormFactor.sidebar]: {
      stepTransition: StepTransition.accordion,
      stepControlsTransition: StepTransition.accordion,
      moduleTransition: StepTransition.accordion,
      borderSeparationBackgroundField: 'backgroundColor',
      moduleNameInStepView: true,
      defaultStepBodyOrientation: StepBodyOrientation.vertical,
      verticalCtaPosition: StepCTAPosition.bottom,
      horizontalCtasBelowContent: true,
      minStepHeight: undefined,
      maxStepHeight: undefined,
      bodyPadding: { x: 16 },
      ModuleCard: CompactModuleCard,
      stepContentGap: 24,
      // the compact step wrapper handle wrapping each step individually so
      // this is effectively setting the separation between the steps
      separation: SeparationBetween.modules,
      showSuccessOnStepComplete: false,
      renderedFormFactorOverrides: {
        minStepHeight: undefined,
        maxStepHeight: 300,
        showMoreBackgroundField: 'cardBackgroundColor',
        bodyPadding: {},
      },
    },
  },
  [Theme.timeline]: {
    [EmbedFormFactor.inline]: {
      stepTransition: StepTransition.slide,
      stepControlsTransition: StepTransition.slide,
      moduleTransition: StepTransition.accordion,
      moduleNameInStepView: false,
      defaultStepBodyOrientation: StepBodyOrientation.horizontal,
      verticalCtaPosition: StepCTAPosition.bottom,
      horizontalCtaPosition: StepCTAPosition.bottom,
      horizontalCtasBelowContent: true,
      ModuleCard: TimelineModuleCard,
      StepWrapper: TimelineStepWrapper,
      minStepHeight: 150,
      maxStepHeight: 300,
      stepContentGap: 8,
      showMoreBackgroundField: 'backgroundColor',
      separation: SeparationBetween.modules,
      skipModuleViewIfOnlyOne: true,
      showSuccessOnStepComplete: false,
      combineModules: true,
    },
    [EmbedFormFactor.sidebar]: {
      stepTransition: StepTransition.slide,
      stepControlsTransition: StepTransition.slide,
      moduleTransition: StepTransition.accordion,
      moduleNameInStepView: false,
      defaultStepBodyOrientation: StepBodyOrientation.vertical,
      verticalCtaPosition: StepCTAPosition.bottom,
      horizontalCtaPosition: StepCTAPosition.bottom,
      horizontalCtasBelowContent: true,
      ModuleCard: TimelineModuleCard,
      StepWrapper: TimelineStepWrapper,
      minStepHeight: undefined,
      maxStepHeight: undefined,
      bodyPadding: { x: 16 },
      stepContentGap: 8,
      stepScrolls: true,
      separation: SeparationBetween.modules,
      skipModuleViewIfOnlyOne: true,
      showSuccessOnStepComplete: false,
      combineModules: true,
      renderedFormFactorOverrides: {
        verticalCtaPosition: StepCTAPosition.bottom,
        horizontalCtaPosition: StepCTAPosition.bottom,
        minStepHeight: 150,
        maxStepHeight: 300,
        bodyPadding: {},
        showMoreBackgroundField: 'backgroundColor',
        stepScrolls: false,
      },
    },
  },
  [Theme.card]: {
    [EmbedFormFactor.inline]: {
      stepTransition: StepTransition.none,
      stepControlsTransition: StepTransition.none,
      moduleTransition: StepTransition.none,
      moduleNameInStepView: false,
      guideStyleBackgroundField: 'backgroundColor',
      defaultStepBodyOrientation: StepBodyOrientation.horizontal,
      verticalCtaPosition: StepCTAPosition.bottom,
      horizontalCtaPosition: StepCTAPosition.bottom,
      horizontalCtasBelowContent: false,
      ModuleCard: CardModuleCard,
      StepWrapper: CardStepWrapper,
      StepControls: CardStepControls,
      minStepHeight: undefined,
      maxStepHeight: undefined,
      stepContentGap: 8,
      separation: SeparationBetween.steps,
      skipModuleViewIfOnlyOne: true,
      showSuccessOnStepComplete: false,
      showMoreBackgroundField: 'cardBackgroundColor',
    },
    [EmbedFormFactor.sidebar]: {
      stepTransition: StepTransition.none,
      stepControlsTransition: StepTransition.none,
      moduleTransition: StepTransition.none,
      moduleNameInStepView: false,
      guideStyleBackgroundField: 'backgroundColor',
      defaultStepBodyOrientation: StepBodyOrientation.vertical,
      verticalCtaPosition: StepCTAPosition.bottom,
      horizontalCtaPosition: StepCTAPosition.bottom,
      horizontalCtasBelowContent: false,
      ModuleCard: CardModuleCard,
      StepWrapper: CardStepWrapper,
      StepControls: CardStepControls,
      minStepHeight: undefined,
      maxStepHeight: undefined,
      stepContentGap: 8,
      stepScrolls: true,
      separation: SeparationBetween.steps,
      skipModuleViewIfOnlyOne: true,
      showSuccessOnStepComplete: false,
      renderedFormFactorOverrides: {
        showMoreBackgroundField: 'cardBackgroundColor',
        stepScrolls: false,
      },
    },
  },
  [Theme.carousel]: {
    [EmbedFormFactor.inline]: {
      stepTransition: StepTransition.slide,
      stepControlsTransition: StepTransition.none,
      moduleTransition: StepTransition.accordion,
      moduleNameInStepView: false,
      guideStyleBackgroundField: 'backgroundColor',
      defaultStepBodyOrientation: StepBodyOrientation.horizontal,
      verticalCtaPosition: StepCTAPosition.bottom,
      horizontalCtaPosition: StepCTAPosition.bottom,
      horizontalCtasBelowContent: true,
      ModuleCard: CarouselModuleCard,
      StepWrapper: CarouselStepWrapper,
      StepControls: CarouselStepControls,
      minStepHeight: 150,
      maxStepHeight: undefined,
      stepContentGap: 8,
      showMoreBackgroundField: 'backgroundColor',
      separation: SeparationBetween.steps,
      skipModuleViewIfOnlyOne: true,
      showSuccessOnStepComplete: false,
      combineModules: true,
    },
    [EmbedFormFactor.sidebar]: {
      stepTransition: StepTransition.slide,
      stepControlsTransition: StepTransition.none,
      moduleTransition: StepTransition.accordion,
      moduleNameInStepView: false,
      guideStyleBackgroundField: 'backgroundColor',
      defaultStepBodyOrientation: StepBodyOrientation.vertical,
      verticalCtaPosition: StepCTAPosition.bottom,
      horizontalCtaPosition: StepCTAPosition.bottom,
      horizontalCtasBelowContent: true,
      ModuleCard: CarouselModuleCard,
      StepWrapper: CarouselStepWrapper,
      StepControls: CarouselStepControls,
      minStepHeight: undefined,
      maxStepHeight: undefined,
      stepContentGap: 8,
      stepScrolls: true,
      separation: SeparationBetween.steps,
      skipModuleViewIfOnlyOne: true,
      showSuccessOnStepComplete: false,
      combineModules: true,
      renderedFormFactorOverrides: {
        minStepHeight: 150,
        maxStepHeight: undefined,
        showMoreBackgroundField: 'backgroundColor',
        stepScrolls: false,
      },
    },
  },
  [Theme.videoGallery]: {
    [EmbedFormFactor.inline]: {
      stepTransition: StepTransition.none,
      stepControlsTransition: StepTransition.none,
      moduleTransition: StepTransition.none,
      moduleNameInStepView: false,
      guideStyleBackgroundField: 'backgroundColor',
      defaultStepBodyOrientation: StepBodyOrientation.horizontal,
      verticalCtaPosition: StepCTAPosition.bottom,
      horizontalCtaPosition: StepCTAPosition.bottom,
      horizontalCtasBelowContent: false,
      ModuleCard: VideoGalleryModuleCard,
      StepWrapper: VideoGalleryStepWrapper,
      minStepHeight: undefined,
      maxStepHeight: undefined,
      bodyPadding: { y: 16, x: 16 },
      stepContentGap: 8,
      separation: SeparationBetween.steps,
      skipModuleViewIfOnlyOne: true,
      showSuccessOnStepComplete: false,
    },
    [EmbedFormFactor.sidebar]: {
      stepTransition: StepTransition.none,
      stepControlsTransition: StepTransition.none,
      moduleTransition: StepTransition.none,
      moduleNameInStepView: false,
      guideStyleBackgroundField: 'backgroundColor',
      defaultStepBodyOrientation: StepBodyOrientation.vertical,
      verticalCtaPosition: StepCTAPosition.bottom,
      horizontalCtaPosition: StepCTAPosition.bottom,
      horizontalCtasBelowContent: false,
      ModuleCard: VideoGalleryModuleCard,
      StepWrapper: VideoGalleryStepWrapper,
      minStepHeight: undefined,
      maxStepHeight: undefined,
      bodyPadding: { x: 16 },
      stepContentGap: 8,
      stepScrolls: false,
      separation: SeparationBetween.steps,
      skipModuleViewIfOnlyOne: true,
      showSuccessOnStepComplete: false,
      renderedFormFactorOverrides: {
        bodyPadding: { y: 16, x: 16 },
        stepScrolls: false,
      },
    },
  },
};

const clearXPadding = (padding: GuideRenderConfig['bodyPadding']) => {
  return {
    ...(padding || {}),
    x: 0,
    l: 0,
    r: 0,
  };
};

const addTopPadding = (padding: GuideRenderConfig['bodyPadding']) => {
  return {
    ...(padding || {}),
    t: 12,
  };
};

const patchRenderConfig = (
  formFactor: EmbedFormFactor,
  theme: Theme | undefined,
  isCyoaGuide: boolean | undefined,
  view: View | undefined,
  stepType: StepType | undefined,
  config: GuideRenderConfig
): GuideRenderConfig => {
  const patchCyoa = isCyoaGuide;
  const patchActiveGuides = view && isActiveGuidesView(view);
  const patchBranchingStep = isBranching(stepType);

  if (!patchCyoa && !patchActiveGuides && !patchBranchingStep) return config;

  const newConfig = { ...config };

  if (patchCyoa) {
    newConfig.minStepHeight = 0;
    newConfig.maxStepHeight = undefined;
    newConfig.stepTransition = StepTransition.none;
    newConfig.moduleTransition = StepTransition.none;
    newConfig.StepWrapper = undefined;

    switch (formFactor) {
      case EmbedFormFactor.inline:
        newConfig.bodyPadding = clearXPadding(config.bodyPadding);
        break;
      case EmbedFormFactor.sidebar:
        newConfig.bodyPadding = addTopPadding(config.bodyPadding);
        break;
      default:
        break;
    }

    newConfig.renderedFormFactorOverrides = undefined;
  }

  if (patchActiveGuides) {
    newConfig.bodyPadding = clearXPadding(config.bodyPadding);
  }

  if (patchBranchingStep && !isNestedTheme(theme)) {
    newConfig.minStepHeight = 0;
    newConfig.maxStepHeight = undefined;

    if (newConfig.renderedFormFactorOverrides) {
      newConfig.renderedFormFactorOverrides.minStepHeight = 0;
      newConfig.renderedFormFactorOverrides.maxStepHeight = undefined;
    }
  }

  return newConfig;
};

export function getRenderConfig({
  theme,
  embedFormFactor,
  renderedFormFactor,
  isCyoaGuide,
  view,
  stepType,
}: {
  theme: Theme | undefined;
  embedFormFactor: EmbedFormFactor | undefined;
  renderedFormFactor: EmbedFormFactor | undefined;
  isCyoaGuide: boolean | undefined;
  view: View | undefined;
  stepType: StepType | undefined;
}): GuideRenderConfig {
  const renderFF = renderedFormFactor || EmbedFormFactor.inline;
  const embedFF = embedFormFactor || EmbedFormFactor.inline;
  let renderedFormFactorConfig =
    stepRenderConfigByTheme[theme || Theme.nested][renderFF];

  if (!renderedFormFactorConfig) return {} as GuideRenderConfig;

  if (!isCarouselTheme(theme))
    renderedFormFactorConfig = patchRenderConfig(
      renderFF,
      theme,
      isCyoaGuide,
      view,
      stepType,
      renderedFormFactorConfig
    );

  return {
    ...renderedFormFactorConfig,
    ...((embedFF !== renderFF &&
      renderedFormFactorConfig.renderedFormFactorOverrides) ||
      {}),
  };
}

export const getIsToggleCompletionDisabled = (step: Step) =>
  (step.isComplete && step.wasCompletedAutomatically) ||
  step.manualCompletionDisabled ||
  (isInputStep(step.stepType) &&
    !getAreInputsAnswered(step) &&
    !step.isComplete) ||
  (isBranching(step.stepType) &&
    !step.isComplete &&
    step.state !== StepState.skipped);
