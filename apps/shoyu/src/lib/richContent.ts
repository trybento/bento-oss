import {
  EmbedFormFactor,
  StepBodyOrientation,
  StepCtaType,
  StepType,
  Theme,
  VerticalMediaOrientation,
} from 'bento-common/types';
import { Step, StepCTA } from 'bento-common/types/globalShoyuState';
import {
  getNodesByTypeAndSanitize,
  isEdgeToEdgeImageFirst,
  isVideoNode,
} from 'bento-common/utils/bodySlate';
import {
  isSidebarEmbed,
  supportsUpdatedMediaHandling,
} from 'bento-common/utils/formFactor';
import { StepCTAPosition } from '../../types/global';
import {
  CustomElementType,
  ElementType,
  ExtractedNodes,
  ImageElement,
  MediaElement,
  SlateBodyElement as SlateBodyElement,
} from 'bento-common/types/slate';
import { getCtaFullWidth, mediaReferencesToNodes } from './helpers';
import { getAreInputsAnswered } from './inputHelpers';
import { isEdgeToEdge } from 'bento-common/utils/image';
import { GuideFormFactorsForEmbedFormFactor } from 'bento-common/data/helpers';

const nodesToExtract: {
  [key in StepBodyOrientation]: {
    [key in EmbedFormFactor.sidebar | EmbedFormFactor.inline]: (
      | ElementType
      | CustomElementType
    )[];
  };
} = {
  [StepBodyOrientation.horizontal]: {
    [EmbedFormFactor.inline]: ['media'],
    [EmbedFormFactor.sidebar]: [],
  },
  [StepBodyOrientation.vertical]: {
    [EmbedFormFactor.inline]: [],
    [EmbedFormFactor.sidebar]: [],
  },
};

const processStepCtas = (step: Step | undefined): StepCTA[] => {
  if (!step?.ctas) return [];
  switch (step.stepType) {
    case StepType.input: {
      const areInputsAnswered = getAreInputsAnswered(step);

      return step.ctas.map((cta) => ({
        ...cta,
        disabled:
          (cta.type === StepCtaType.complete ||
            cta.type === StepCtaType.event) &&
          !areInputsAnswered,
      }));
    }

    case StepType.branching: {
      const branchingPathsSelected =
        step?.branching?.branches?.some((b) => b.selected) || step?.isComplete;

      return step.ctas.map((cta) => ({
        ...cta,
        disabled: cta.type === StepCtaType.complete && !branchingPathsSelected,
      }));
    }

    default: {
      return step.ctas;
    }
  }
};

export const extractRichContent = (
  embedFormFactor: EmbedFormFactor,
  theme: Theme,
  orientation: StepBodyOrientation,
  verticalOrientation: VerticalMediaOrientation | undefined,
  verticalCtaPosition: StepCTAPosition,
  step: Step | undefined
): {
  position: StepCTAPosition;
  ctas: StepCTA[];
  fullWidth: boolean;
  boldCtas: boolean;
  sanitizedStepBody: SlateBodyElement[];
  extractedNodes: ExtractedNodes;
  allowMarginlessImages: boolean;
  edgeToEdgePositions: {
    first: boolean;
    last: boolean;
    horizontal: boolean;
  };
  hasExtractedNodes: boolean;
  mediaReferenceFlags: {
    hasVideo: boolean | undefined;
    hasImage: boolean;
    hasAttribute: boolean;
  };
} => {
  if (!step) {
    return {
      position: verticalCtaPosition,
      fullWidth: false,
      boldCtas: false,
      ctas: [],
      sanitizedStepBody: [],
      extractedNodes: {},
      allowMarginlessImages: false,
      hasExtractedNodes: false,
      edgeToEdgePositions: { first: false, last: false, horizontal: false },
      mediaReferenceFlags: {
        hasVideo: false,
        hasImage: false,
        hasAttribute: false,
      },
    };
  }

  const formFactor = embedFormFactor
    ? GuideFormFactorsForEmbedFormFactor[embedFormFactor][0]
    : embedFormFactor;

  const isSidebar = isSidebarEmbed(formFactor);
  const isHorizontal = orientation === StepBodyOrientation.horizontal;
  const isVertical = orientation === StepBodyOrientation.vertical;

  const useUpdatedMediaHandling = supportsUpdatedMediaHandling(
    theme,
    formFactor
  );

  const {
    extractedNodes: { media = [] },
    sanitizedBodySlate,
  } =
    isHorizontal || useUpdatedMediaHandling
      ? getNodesByTypeAndSanitize<'media'>(
          step?.bodySlate || [],
          useUpdatedMediaHandling
            ? ['media']
            : nodesToExtract[orientation][embedFormFactor] || []
        )
      : { extractedNodes: {}, sanitizedBodySlate: step.bodySlate || [] };

  const ctas = processStepCtas(step);

  const mediaReferenceNodes = useUpdatedMediaHandling
    ? mediaReferencesToNodes(step.mediaReferences)
    : [];

  // TODO: Possibly deprecate CTA positioning to the right.
  const position: StepCTAPosition | null = verticalCtaPosition;

  const extractedNodes = {
    // @ts-ignore
    media: isHorizontal
      ? useUpdatedMediaHandling
        ? mediaReferenceNodes
        : media || []
      : [],
  };

  const allExtractedNodes = Object.values(extractedNodes).flat();
  const allowMarginlessImages =
    isVertical ||
    (allExtractedNodes.length > 0 &&
      allExtractedNodes.every((n) => isEdgeToEdge((n as MediaElement).fill)));

  const sanitizedStepBody = isHorizontal
    ? sanitizedBodySlate
    : !verticalOrientation ||
      verticalOrientation === VerticalMediaOrientation.top
    ? [...mediaReferenceNodes, ...sanitizedBodySlate]
    : [...sanitizedBodySlate, ...mediaReferenceNodes];

  const edgeToEdgePositions = {
    first: isEdgeToEdgeImageFirst(sanitizedStepBody),
    last:
      !!sanitizedStepBody.length &&
      isEdgeToEdge(
        (sanitizedStepBody[sanitizedStepBody.length - 1] as ImageElement)?.fill
      ),
    horizontal: !!(allExtractedNodes.length && allowMarginlessImages),
  };

  const hasExtractedNodes =
    extractedNodes &&
    Object.values(extractedNodes).some((nodes) => nodes.length > 0);

  const mediaReferenceFlags = {
    hasVideo: isVideoNode(mediaReferenceNodes[0]?.type as any),
    hasImage: mediaReferenceNodes[0]?.type === 'image',
    hasAttribute: mediaReferenceNodes[0]?.type === 'dynamic-attribute-block',
  };

  return {
    position,
    ctas,
    sanitizedStepBody,
    fullWidth: isSidebar && (isHorizontal || getCtaFullWidth(ctas)),
    boldCtas: isHorizontal && ctas.length === 1,
    edgeToEdgePositions,
    extractedNodes,
    allowMarginlessImages,
    hasExtractedNodes,
    mediaReferenceFlags,
  };
};
