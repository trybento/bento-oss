import { v4 as uuidv4 } from 'uuid';
import {
  BentoInstance,
  EmbedFormFactor,
  InlineInjectionEditorData,
  WysiwygEditorMode,
  WysiwygEditorPreviewData,
} from 'bento-common/types';
import {
  InlineEmbedEntityId,
  InlineEmbed,
} from 'bento-common/types/globalShoyuState';
import { PreviewDataPack } from 'bento-common/types/preview';

import mainStore from '../../stores/mainStore';

import {
  WysiwygEditorPreviewHandler,
  WysiwygEditorSpecializationHelpers,
} from './types';

const INLINE_INJECTION_EDITOR_PREVIEW_ID = 'inline-inlineInjectionPreview';
const INLINE_EMBED_ENTITY_ID = 'inlineInjectionPreview';

let previewData:
  | WysiwygEditorPreviewData<InlineInjectionEditorData>
  | undefined;

const entityId = uuidv4() as InlineEmbedEntityId;

function shouldShowPreview(mode: WysiwygEditorMode) {
  return (
    mode === WysiwygEditorMode.customize || mode === WysiwygEditorMode.preview
  );
}

function initializePreviewData() {
  const { guide, enabledFeatureFlags } = previewData!;

  if (!guide) return;

  const previewDataPack: PreviewDataPack = {
    guide,
    uiSettings: {},
    enabledFeatureFlags,
  };

  // Use built-in method to set the needed preview data
  (window.Bento as BentoInstance)?.setPreviewData(
    INLINE_INJECTION_EDITOR_PREVIEW_ID,
    previewDataPack,
    EmbedFormFactor.inline
  );
}

function injectInline(elementSelector: string, wildcardUrl: string) {
  const {
    guide,
    data: { inlineEmbed },
  } = previewData || { data: {} };

  if (!guide || !inlineEmbed) return;

  mainStore.getState().setPreviewInlineEmbed({
    ...inlineEmbed,
    elementSelector,
    wildcardUrl,
    entityId: INLINE_EMBED_ENTITY_ID,
    previewId: INLINE_INJECTION_EDITOR_PREVIEW_ID,
  } as InlineEmbed);
  setTimeout(() => {
    const targetElement = elementSelector
      ? document.querySelector(elementSelector)
      : null;
    targetElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }, 500);
}

function cleanupPreview() {
  [previewData?.data.inlineEmbed.entityId, INLINE_EMBED_ENTITY_ID].forEach(
    (inlineEmbedEntityId) =>
      mainStore
        .getState()
        .removePreviewInlineEmbed(inlineEmbedEntityId as InlineEmbedEntityId)
  );
}

const updatePreview: WysiwygEditorPreviewHandler<InlineInjectionEditorData> = (
  elementSelector,
  wildcardUrl,
  payload
) => {
  /**
   * Wont do anything in case payload is undefined,
   * which can be a good indication of an underlying issue that needs to be resolved.
   */
  if (typeof payload === 'undefined') return;

  const { guide: oldGuide } = previewData || {};
  previewData = payload;

  if (!previewData.data.inlineEmbed.entityId) {
    previewData.data.inlineEmbed.entityId = entityId;
  }

  if (payload.guide !== oldGuide) {
    initializePreviewData();
  }

  const inlineInjector = document.querySelector('bento-inline-embeds');
  inlineInjector?.setAttribute(
    'uipreviewid',
    INLINE_INJECTION_EDITOR_PREVIEW_ID
  );
  inlineInjector?.setAttribute('embedid', INLINE_INJECTION_EDITOR_PREVIEW_ID);

  if (shouldShowPreview(previewData.mode) && elementSelector) {
    injectInline(elementSelector, wildcardUrl);
  } else {
    cleanupPreview();
  }

  return `bento-embed[uipreviewid=${INLINE_INJECTION_EDITOR_PREVIEW_ID}]`;
};

// The auto-complete editor doesn't need any specialization
const initialize =
  (): WysiwygEditorSpecializationHelpers<InlineInjectionEditorData> => ({
    updatePreview,
    cleanupPreview,
  });

export default initialize;
