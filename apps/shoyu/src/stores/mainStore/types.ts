import { WritableDraft } from 'immer/dist/internal';
import { AtLeast, EmbedFormFactor } from 'bento-common/types';
import {
  FullGuide,
  GlobalState,
  GlobalStateAction,
  GuideEntityId,
  TaggedElement,
  InlineEmbed,
  InlineEmbedEntityId,
  StepEntityId,
  StepAutoCompleteInteraction,
} from 'bento-common/types/globalShoyuState';

export type MainStoreState = GlobalState & {
  hydrateAvailableGuides: () => Promise<void>;
  hydrateStepAutoCompleteInteractions: () => Promise<void>;
  hydrateInlineEmbeds: () => Promise<void>;
  hydrateGuide: (guideEntityId: GuideEntityId) => void;
  hydrateNpsSurveys: () => Promise<void>;
  setPreviewGuide: (
    previewId: string,
    guide: FullGuide,
    additionalGuides: FullGuide[] | undefined,
    formFactor: EmbedFormFactor
  ) => void;
  removePreviewGuide: (previewId: string) => void;
  setPreviewTaggedElement: (taggedElement: TaggedElement) => void;
  removePreviewTaggedElement: (
    taggedElement: AtLeast<TaggedElement, 'entityId'>
  ) => void;
  setPreviewInlineEmbed: (inlineEmbed: InlineEmbed) => void;
  removePreviewInlineEmbed: (entityId: InlineEmbedEntityId) => void;
  launchDestinationGuide: (
    startedFromStepEntityId: StepEntityId,
    guide: FullGuide,
    stepAutoCompleteInteractions: StepAutoCompleteInteraction[],
    appLocation: string | undefined
  ) => void;
  dispatch: <P extends GlobalStateAction>(payload: P) => void;
};

export type WorkingState = WritableDraft<MainStoreState> | MainStoreState;
