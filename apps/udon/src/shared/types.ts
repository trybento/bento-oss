// TODO: Use for Slate body types
export interface EditorNode {
  id?: string;
  type?: string;
  text?: string;
  children: EditorNode[];

  /** Indicates node can be overwritten. */
  template?: boolean;

  /** Send by server on new CYOA guides */
  placeholder?: string;
}

export enum EmbedViewSource {
  embedInline = 'embed_inline',
  embedSidebar = 'embed_sidebar',
  /** Step was not actually viewed */
  none = 'none',
}
