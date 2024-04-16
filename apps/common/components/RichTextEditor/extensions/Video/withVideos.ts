import {
  inlineElementNodesMap,
  isVideoNode,
  videoSourceToNodeType,
} from 'bento-common/utils/bodySlate';
import { ReactEditor } from 'slate-react';
import { insertVoidBlockNode } from '../../helpers';
import { SlateBodyElement, VideoSourceType } from 'bento-common/types/slate';

export const insertVideo = (
  editor: ReactEditor,
  videoId: string,
  source: VideoSourceType,
  playsInline = false
): void => {
  const nodeType = videoSourceToNodeType(source);
  const text = { type: 'text', text: '' };
  const video = { type: nodeType, videoId, children: [text], playsInline };
  insertVoidBlockNode(editor, video);
};

export const withVideos = (editor: ReactEditor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element: SlateBodyElement) => {
    return isVideoNode(element)
      ? !!inlineElementNodesMap[element.type]
      : isInline(element);
  };

  editor.isVoid = (element: SlateBodyElement) => {
    return isVideoNode(element) ? true : isVoid(element);
  };

  return editor;
};

export default withVideos;
