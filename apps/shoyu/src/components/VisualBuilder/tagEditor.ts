import {
  EmbedFormFactorsForGuideFormFactor,
  isOnboarding,
} from 'bento-common/data/helpers';
import {
  BentoInstance,
  EmbedFormFactor,
  GuideDesignType,
  GuideFormFactor,
  TagEditorData,
  WysiwygEditorMode,
  WysiwygEditorPreviewData,
} from 'bento-common/types';
import { TaggedElement } from 'bento-common/types/globalShoyuState';
import { PreviewDataPack } from 'bento-common/types/preview';
import { INJECTABLES_CONTAINER_ID } from 'bento-common/utils/constants';
import { isContextualChecklist } from 'bento-common/utils/formFactor';
import { cloneDeep } from 'bento-common/utils/lodash';

import { injectableQuerySelector } from '../../lib/helpers';
import mainStore from '../../stores/mainStore';
import { initializePreviewProgress } from './guidePreviewHelpers';
import {
  WysiwygEditorPreviewHandler,
  WysiwygEditorSpecializationHelpers,
} from './types';

const TAG_EDITOR_PREVIEW_ID = 'bentoPreview-tagBuilderSidebar';

let allTaggedElements: TaggedElement[] = [];
let previewData: WysiwygEditorPreviewData<TagEditorData> | undefined;
let sidebarPreview: HTMLElement | null;

function getContainer(): HTMLElement | null {
  return document.getElementById(INJECTABLES_CONTAINER_ID);
}

function shouldShowPreview(mode: WysiwygEditorMode) {
  return [
    WysiwygEditorMode.customize,
    WysiwygEditorMode.customizeContent,
    WysiwygEditorMode.preview,
  ].includes(mode);
}

function injectTag(
  tag: TaggedElement,
  forcefullyOpen: boolean,
  autoScroll: boolean
) {
  if (autoScroll) {
    const targetElement = tag.elementSelector
      ? document.querySelector(tag.elementSelector)
      : null;
    targetElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }

  const { guide } = previewData || {};

  if (!guide) return;

  mainStore.getState().setPreviewTaggedElement({
    ...tag,
    isSideQuest: guide.isSideQuest,
    designType: guide.designType || GuideDesignType.onboarding,
    formFactor: guide.formFactor || GuideFormFactor.sidebar,
    forcefullyOpen,
  });
}

function cleanupPreview() {
  allTaggedElements.forEach((tag) => {
    mainStore.getState().removePreviewTaggedElement({
      entityId: tag.entityId,
    });
  });
}

function initializePreviewData() {
  const { guide, enabledFeatureFlags } = previewData!;

  if (!guide) return;

  const previewDataPack: PreviewDataPack = {
    guide,
    uiSettings: {
      isSidebarAutoOpenOnFirstViewDisabled: true,
    },
    enabledFeatureFlags,
  };

  // Use built-in method to set the needed preview data
  (window.Bento as BentoInstance)?.setPreviewData(
    TAG_EDITOR_PREVIEW_ID,
    previewDataPack,
    !guide.formFactor || guide.formFactor === GuideFormFactor.legacy
      ? EmbedFormFactor.sidebar
      : EmbedFormFactorsForGuideFormFactor[guide.formFactor][0]
  );
}

const updatePreview: WysiwygEditorPreviewHandler<TagEditorData> = (
  elementSelector,
  wildcardUrl,
  payload
) => {
  /**
   * Wont do anything in case payload is undefined,
   * which can be a good indication of an underlying issue that needs to be resolved.
   */
  if (typeof payload === 'undefined') return;

  /**
   * NOTE: Investigate why guide becomes readonly.
   */
  payload.guide = cloneDeep(
    initializePreviewProgress(payload.guide, payload.initialLoad)
  );

  const tagData = payload.data.taggedElement;

  allTaggedElements = payload.data.allTaggedElements.map((t) => {
    const match =
      t.entityId === tagData.entityId ||
      (t.guide === tagData.guide && t.step === tagData.step);
    // Hydrate data received from the
    // update handler for the tag being edited.
    if (match) {
      return {
        ...t,
        ...tagData,
        ...(!payload.viewOnly && {
          elementSelector: elementSelector!,
          wildcardUrl,
        }),
      };
    }
    return t;
  });

  if (payload.guide) {
    payload.guide.taggedElements = allTaggedElements;
  }

  const { guide: oldGuide } = previewData || {};
  previewData = payload;

  if (payload.guide !== oldGuide) {
    initializePreviewData();
  }

  if (!sidebarPreview) {
    sidebarPreview = document.createElement('bento-sidebar');
  } else {
    const newSidebarPreview = document.querySelector(
      'bento-sidebar'
    ) as HTMLElement | null;
    if (newSidebarPreview && newSidebarPreview !== sidebarPreview) {
      sidebarPreview = newSidebarPreview;
      sidebarPreview.remove();
    }
  }

  const mode = previewData.mode;

  if (shouldShowPreview(mode)) {
    allTaggedElements.forEach((tag) => {
      injectTag(
        tag,
        mode &&
          [
            WysiwygEditorMode.customize,
            WysiwygEditorMode.customizeContent,
          ].includes(mode),
        tag.entityId === tagData.entityId
      );
    });
  } else {
    cleanupPreview();
  }

  /**
   * Show the sidebar component in Preview mode, but only for onboarding/contextual guides
   * since we're then editing "visual tags". This is to allow clicking "see more" on the
   * tooltip to open the sidebar.
   */
  if (previewData.mode === WysiwygEditorMode.preview && previewData.guide) {
    if (
      isOnboarding(previewData.guide.designType) ||
      isContextualChecklist(previewData.guide)
    ) {
      getContainer()?.appendChild(sidebarPreview);
      sidebarPreview.setAttribute('id', `${TAG_EDITOR_PREVIEW_ID}-sidebar`);
      sidebarPreview.setAttribute('uipreviewid', TAG_EDITOR_PREVIEW_ID);
    }
  } else if (sidebarPreview) {
    sidebarPreview.remove();
  }
};

/**
 * This modifies or removes existing embed components in order to
 * properly handle previews.
 */
function setUpExistingBentoEmbeds() {
  const componentsToRemoveSelector = [
    // because banners can't be targeted by visual tag
    injectableQuerySelector('bento-banner'),
    // because modals can't be targeted by visual tag
    injectableQuerySelector('bento-modal'),
  ].join(',');

  // Remove components that can't be targeted by visual tag and can't be part of previews
  document
    .querySelectorAll(componentsToRemoveSelector)
    ?.forEach((el) => el.remove());

  // Remove sidebars
  sidebarPreview = document.querySelector('bento-sidebar');
  if (sidebarPreview) {
    sidebarPreview.remove();
  }

  // Modifies the context element
  const contextElement = document.querySelector(
    injectableQuerySelector('bento-context')
  );
  contextElement?.setAttribute('id', `${TAG_EDITOR_PREVIEW_ID}-context`);
  contextElement?.setAttribute('uipreviewid', TAG_EDITOR_PREVIEW_ID);
}

export default function initialize(): WysiwygEditorSpecializationHelpers<TagEditorData> {
  setUpExistingBentoEmbeds();

  return {
    updatePreview,
    cleanupPreview,
  };
}
