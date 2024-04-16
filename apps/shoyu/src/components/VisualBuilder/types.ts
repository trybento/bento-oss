import { WysiwygEditorPreviewData } from 'bento-common/types';

export type WysiwygEditorPreviewHandler<D> = (
  elementSelector: string | undefined,
  wildcardUrl: string,
  previewData: WysiwygEditorPreviewData<D>
) => void | string;

export type WysiwygEditorSpecializationHelpers<D> = {
  updatePreview: WysiwygEditorPreviewHandler<D>;
  cleanupPreview: () => void;
};

export type WysiwygEditorSpecializationInitializer<D> =
  () => WysiwygEditorSpecializationHelpers<D>;
