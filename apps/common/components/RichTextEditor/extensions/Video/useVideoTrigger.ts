import React from 'react';
import { useSlate } from 'slate-react';
import { Transforms, Location } from 'slate';

import { insertVideo } from './withVideos';

type UseVideoTriggerHook = {
  isVideoModalOpen: boolean;
  onVideoModalClose: () => void;
  onVideo: (
    videoId: string,
    source: VideoSourceType,
    playsInline?: boolean
  ) => void;
  onTriggerVideoModal: () => void;
};

import { useRichTextEditorProvider } from '../../providers/RichTextEditorProvider';
import { VideoSourceType } from 'bento-common/types/slate';

export default function useVideoTrigger(): UseVideoTriggerHook {
  const editor = useSlate();
  const [isOpen, setOpen] = React.useState(false);
  const { persistedSelection, setPersistedSelection } =
    useRichTextEditorProvider();

  const onClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const onVideo = (
    videoId: string,
    source: VideoSourceType | undefined,
    playsInline = false
  ): void => {
    if (persistedSelection) {
      Transforms.select(editor, persistedSelection as Location);
    }
    insertVideo(editor as any, videoId, source, playsInline);
    onClose();
  };

  const onTriggerVideoModal = (): void => {
    setPersistedSelection(editor.selection as Location);
    setOpen(true);
  };

  return {
    isVideoModalOpen: isOpen,
    onVideoModalClose: onClose,
    onVideo,
    onTriggerVideoModal,
  };
}
