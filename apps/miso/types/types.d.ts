import { HTMLAttributes, CSSProperties } from 'react';
import { BentoInstance, BentoSettings } from 'bento-common/types';
import '@tanstack/react-table';

export as namespace JSX;

export interface IntrinsicElements {
  'bento-context': {
    id: string;
    type: ContextTagType;
    alignment:
      | 'top-left'
      | 'top-right'
      | 'center-left'
      | 'center-right'
      | 'bottom-left'
      | 'bottom-right';
    'y-offset': string;
    'x-offset': string;
    'relative-to-text': string;
    uipreviewid?: string;
  } & HTMLAttributes;
  'bento-embed': { uipreviewid?: string } & HTMLAttributes;
  'bento-sidebar': { uipreviewid?: string } & HTMLAttributes;
  'bento-modal': { uipreviewid?: string } & HTMLAttributes;
  'bento-banner': { uipreviewid?: string; container?: string } & HTMLAttributes;
  'bento-tooltip': { uipreviewid?: string } & HTMLAttributes;
}

declare global {
  interface Window {
    // bellow types come from us having Bento within Bento
    Bento?: BentoInstance;
    bentoSettings?: BentoSettings;
  }
}
declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    column?: {
      width?: string;
    };
    header?: {
      onMouseEnter?: () => void;
      onMouseLeave?: () => void;
      whiteSpace?: CSSProperties['whiteSpace'];
      padding?: CSSProperties['padding'];
    };
    cell?: {
      onMouseEnter?: () => void;
      onMouseLeave?: () => void;
      padding?: CSSProperties['padding'];
      verticalAlign?: CSSProperties['verticalAlign'];
    };
  }
}
