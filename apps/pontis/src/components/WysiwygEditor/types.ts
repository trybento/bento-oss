import { WysiwygEditorMode } from 'bento-common/types';

export type ElementDimensions = {
  dimensions: DOMRect;
  scroll: { top: number; left: number };
  innerText: string;
  elementType: HTMLElement['tagName'];
};

export type ContentDimensions = {
  dimensions: DOMRect;
};

export type PopupPosition = {
  left: number;
  top: number;
};

export enum FloatingPanelSide {
  left = 'left',
  right = 'right',
}

export type FloatingPanelProgress = Partial<Record<WysiwygEditorMode, number>>;
