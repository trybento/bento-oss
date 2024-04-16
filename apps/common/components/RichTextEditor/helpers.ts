import { v4 as uuidv4 } from 'uuid';
import {
  Editor,
  Range,
  Element,
  Transforms,
  Text as SlateText,
  Node as SlateNode,
  NodeEntry,
  Path,
  Location,
} from 'slate';
import cloneDeep from 'lodash/cloneDeep';
import reverse from 'lodash/reverse';
import last from 'lodash/last';
import isEqual from 'lodash/isEqual';
import isEqualWith from 'lodash/isEqualWith';
import Bowser from 'bowser';
import {
  ElementTypesMap,
  ElementType,
  ListType,
  BulletedListElement,
  NumberedListElement,
  BlockQuoteElement,
  EditorNode,
  FormattingType,
  EmbedLinkElement,
  EmbedLinkElementSources,
  SlateBodyElement,
} from 'bento-common/types/slate';
import { getEmptyStepBody, getTemplate } from 'bento-common/utils/templates';
import {
  AlignmentEnum,
  AttributeType,
  FillEnum,
  GuideFormFactor,
  StepType,
  Theme,
} from 'bento-common/types';
import { getWordCountMax } from 'bento-common/utils/slateWordCount';
import { DynamicAttributeSuggestion } from './extensions/DynamicAttribute/Suggestions';
import { embedLinkDefaltOptions } from 'bento-common/utils/embedSlate';
import { BentoUI } from '../../types/preview';

/** Used for guides that don't support media at all. */
export const RTE_MEDIA_NOT_SUPPORTED = 'Media is not supported';
/** Used for guides that support media through the updated interface. */
export const RTE_UPDATED_MEDIA_WARNING =
  '⚠️ Drag & drop is not supported. Please use the “add media” section below the text editor.';
export const ATTRIBUTES_TRIGGER = '{{';
export const NO_ATTRIBUTE_FOUND = 'No matches found';

export const EDITOR_HEIGHT = '400px';
export const EDITOR_INNER_HEIGHT = '325px';
export const EDITOR_MAX_HEIGHT = '70vh';

export const ATTRIBUTE_TYPE_OPTIONS: DynamicAttributeSuggestion[] = [
  { name: NO_ATTRIBUTE_FOUND, type: AttributeType.account, readonly: true },
  { name: NO_ATTRIBUTE_FOUND, type: AttributeType.accountUser, readonly: true },
];

export const createNode = <T>(
  type: SlateBodyElement['type'],
  override?: Partial<SlateBodyElement>
) =>
  cloneDeep({
    id: uuidv4(),
    type: type,
    children:
      type === 'paragraph' && !override
        ? [
            {
              text: '',
            },
          ]
        : [],
    ...override,
  }) as unknown as T;

const LIST_TYPES = new Set<ElementType>([
  'bulleted-list',
  'numbered-list',
  'code-block',
]);

const TEXT_TYPES = new Set<ElementType>(['paragraph']);

export function isListType(type: ElementType): type is ListType {
  return LIST_TYPES.has(type);
}

const isBlockQuote = (type: ElementType) => type === 'block-quote';
const isTextType = (type: ElementType) => TEXT_TYPES.has(type);

export const isBlockActive = (editor: Editor, format: ElementType) => {
  try {
    const [match] = Editor.nodes(editor, {
      match: (
        n: EditorNode & { alignment?: AlignmentEnum } & { fill?: FillEnum }
      ) =>
        n.type === format ||
        (AlignmentEnum[format] && n.alignment === AlignmentEnum[format]) ||
        (FillEnum[format] && n.fill === FillEnum[format]),
    });

    return !!match;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log({ isBlockActiveThrown: e });
    return false;
  }
};

/** Prevent empty editor crashes */
export const safelyRemoveNodes = (editor: Editor, opts?: { at?: Location }) => {
  if (editor.children.length === 1) {
    Transforms.setNodes(editor, getEmptyParagraph(), { at: [0] });
  } else {
    Transforms.removeNodes(editor, opts);
  }
};

/** Prevent empty editor crashes */
export const safelyRemoveVoidNodes = (
  editor: Editor,
  opts?: { at?: Location }
) => {
  if (editor.children.length === 1) {
    Transforms.setNodes(editor, getEmptyParagraph(), { at: [0] });
  } else {
    Transforms.delete(editor, opts);
  }
};

/** Create an empty list node with needed l-i within */
const getEmptyListNode = (type: ElementType) => ({
  type,
  children: [{ type: 'list-item', children: [{ text: '' }] }],
});

export const getEmptyParagraph = () => ({
  type: 'paragraph',
  children: [{ type: 'text', text: '' }],
});

export const getFocusedBlocks = (editor: Editor) =>
  SlateNode.fragment(editor, editor.selection);

/** Mostly for toggling listt nodes */
export function toggleBlock(editor: Editor, type: ElementType): void {
  const isAligning = !!AlignmentEnum[type];
  const isActive = isBlockActive(editor, type);
  const isList = isListType(type);

  const selectionArray = getBlocksSelection(editor, true, !isAligning);

  for (const selection of selectionArray) {
    const line = selection?.focus?.path?.[0];
    const focusedElement = editor.children[line] as EditorNode;
    const isText = isTextType(focusedElement?.type);

    if (isText || isActive || isAligning || isList) {
      Transforms.select(editor, selection);
      if (isAligning && isVoidBlockNode(editor, focusedElement)) {
        Transforms.setNodes(editor, {
          // eslint-disable-next-line no-nested-ternary
          ...focusedElement,
          alignment: AlignmentEnum[type],
        } as Partial<SlateNode>);
      } else {
        Transforms.unwrapNodes(editor, {
          match: (n: EditorNode) => isListType(n.type as ElementType),
          split: true,
        });

        Transforms.setNodes(editor, {
          // eslint-disable-next-line no-nested-ternary
          type: isList
            ? isActive
              ? 'paragraph'
              : 'list-item'
            : isAligning
            ? isBlockQuote(focusedElement?.type)
              ? 'block-quote'
              : 'paragraph'
            : isActive
            ? 'paragraph'
            : type,
          ...(isAligning && { alignment: AlignmentEnum[type] }),
        } as Partial<SlateNode>);

        if (!isActive && isList) {
          const block = { type, children: [] };
          Transforms.wrapNodes(editor, block);
        }
      }
    } else {
      /* If the selection is a custom block, add a list instead of replacing it */
      insertVoidBlockNode(editor, getEmptyListNode(type), true);
    }
  }
}

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const setMarkValue = (editor: Editor, format: string, value: string) => {
  const isActive = isMarkActive(editor, format);

  try {
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, value);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log({ setMarkValue: e });
  }
};

export const isMarkActive = (editor: Editor, format: string) => {
  try {
    const marks = Editor.marks(editor);

    return marks ? marks[format] === true : false;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log({ isMarkActive: e });
    return false;
  }
};

export const getMarkValue = (editor: Editor, format: string) => {
  try {
    const marks = Editor.marks(editor);

    return marks ? marks[format] : null;
  } catch (e) {
    return null;
  }
};

export const setCursorToLineHead = (editor: Editor) => {
  const { path } = editor.selection.anchor;

  Transforms.setSelection(editor, {
    anchor: { offset: 0, path: [path[0], 0] },
    focus: { offset: 0, path: [path[0], 0] },
  });
};

// LINK HELPERS
export function insertLink(editor: Editor, url: string): void {
  if (editor.selection) {
    wrapLink(editor, url);
  }
}

export function unwrapLink(editor: Editor): void {
  Transforms.unwrapNodes(editor, {
    match: (n: EditorNode) => n.type === 'link',
  });
}

export function wrapLink(editor: Editor, url: string): void {
  if (isBlockActive(editor, 'link')) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
  }
}

export function wrapEmbedLink<S extends EmbedLinkElementSources>(
  editor: Editor,
  url: string,
  source: S
): void {
  if (isBlockActive(editor, 'embed-link')) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const embedLink: EmbedLinkElement = {
    type: 'embed-link',
    url,
    children: [{ text: url, children: [] }],
    source,
    ...embedLinkDefaltOptions[source](),
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, embedLink);
  } else {
    Transforms.wrapNodes(editor, embedLink, { split: true });
  }
}

// IMAGE HELPERS
export function insertImage(
  editor: Editor,
  url: string,
  lightboxDisabled: boolean
) {
  const image = {
    type: 'image',
    url,
    lightboxDisabled,
    children: [{ text: '' }],
  };

  insertVoidBlockNode(editor, image);
}

export function isChildrenEmpty(node) {
  const children = node.children || [];
  return children.length === 1 && children[0].text === '';
}

/**
 * Checks if editor cursor is in the last item of a list, and the item is empty
 * if so, returns the containing list node.
 */
export function getContainingListIfInLastAndEmptyItem(
  editor: Editor
): BulletedListElement | NumberedListElement | undefined {
  try {
    const [text, listItem, list] = reverse(Array.from(Editor.nodes(editor)));
    if (text && listItem && list) {
      const [textNode] = text;
      const [listItemNode, listItemPath] = <[EditorNode, Path]>listItem;
      const [listNode] = <NodeEntry<EditorNode>>list;
      if (
        SlateText.isText(textNode) &&
        textNode.text === '' &&
        (listItemNode.children as unknown[]).length === 1
      ) {
        // in an empty text node
        if (
          listItemNode.type === 'list-item' &&
          isListType(listNode.type as ElementType)
        ) {
          // in a list
          const numberOfListItems = (listNode.children as unknown[]).length;
          if (
            last(listItemPath) === numberOfListItems - 1 &&
            listNode.type !== 'code-block'
          ) {
            // in the last element of the list
            return listNode as BulletedListElement | NumberedListElement;
          }
        }
      }
    }
    return undefined;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log({ isGetContainingListIfInLastAndEmptyItem: e });
    return undefined;
  }
}

export function getContainingListIfFirstAndEmptyItem(
  editor: Editor
): BulletedListElement | NumberedListElement | undefined {
  try {
    const [text, listItem, list] = reverse(Array.from(Editor.nodes(editor)));
    if (text && listItem && list) {
      const [textNode] = text;
      const [listItemNode] = <[EditorNode, Path]>listItem;
      const [listNode] = <NodeEntry<EditorNode>>list;
      if (
        SlateText.isText(textNode) &&
        textNode.text === '' &&
        (listItemNode.children as unknown[]).length === 1
      ) {
        // in an empty text node
        if (
          listItemNode.type === 'list-item' &&
          isListType(listNode.type as ElementType)
        ) {
          // in a list
          const numberOfListItems = (listNode.children as unknown[]).length;
          if (numberOfListItems === 1) {
            // in the last element of the list
            return listNode as BulletedListElement | NumberedListElement;
          }
        }
      }
    }
    return undefined;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log({ isGetContainingListIfInLastAndEmptyItem: e });
    return undefined;
  }
}

/**
 * Gets elements that are a container for other text elements
 */
export function getContainingTextBlockIfEmptyItem(
  editor: Editor
): BlockQuoteElement | undefined {
  try {
    const [text, blockElement] = reverse(
      Array.from(Editor.nodes<EditorNode>(editor))
    );
    if (text && blockElement) {
      const [textNode] = text;
      const [blockElementNode] = <NodeEntry<EditorNode>>blockElement;
      if (SlateText.isText(textNode) && textNode.text === '') {
        // in an empty text node
        if (blockElementNode.type === 'block-quote') {
          return blockElementNode as BlockQuoteElement;
        }
      }
    }
    return undefined;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log({ getContainingTextBlockIfEmptyItem: e });
    return undefined;
  }
}

export function isVoidBlockNode(editor, node) {
  return (
    Element.isElement(node) && editor.isVoid(node) && !editor.isInline(node)
  );
}

export function insertVoidBlockNode(
  editor,
  voidBlockNode,
  skipAddingEmptyNode = false
) {
  Transforms.insertNodes(editor, voidBlockNode);
  // Add an empty block after void block nodes to allow adding text after the node.
  if (
    isEqual(Editor.end(editor, []).path, editor?.selection?.focus?.path) &&
    !skipAddingEmptyNode
  ) {
    Transforms.insertNodes(editor, {
      type: 'paragraph',
      children: [{ text: '' }],
    } as SlateNode);
  }

  Transforms.move(editor);
}

export function getCurrentNodeAndParent(
  editor
): (EditorNode | null | undefined)[] {
  try {
    const focusPoint = editor?.selection?.anchor?.path;
    if (focusPoint) {
      const currentNode = SlateNode.parent(editor, focusPoint) as EditorNode;

      const currentParentNode =
        typeof focusPoint?.[0] === 'number'
          ? (SlateNode.parent(editor, [focusPoint[0], 0]) as EditorNode)
          : null;

      return [currentNode, currentParentNode];
    }
  } catch (e) {
    console.info('[RTE] getCurrentNodeAndParent resolving error:', e);
  }

  return [null, null];
}

/**
 * Get selection split by blocks.
 * Use 'filterVoidBlocks' to remove special type blocks from selection
 * to prevent block toggling from unwrapping them.
 */
export function getBlocksSelection(
  editor,
  shouldReverseResult: boolean,
  filterVoidBlocks = true
) {
  if (!editor?.selection?.focus) {
    return [];
  }

  let startLine = editor.selection.focus.path[0];
  let lastLine = editor.selection.anchor.path[0];

  if (startLine > lastLine) {
    startLine = editor.selection.anchor.path[0];
    lastLine = editor.selection.focus.path[0];
  }

  const newSelection = [];

  if (filterVoidBlocks) {
    let newStart = null;
    let previousChild = null;
    let endOffset = 0;

    for (let line = startLine; line <= lastLine; line++) {
      const child = editor.children[line];
      if (child) {
        const isLast = line === lastLine;

        const focus = { offset: 0, path: [newStart || startLine, 0] };
        const anchor = {
          offset: endOffset,
          path: [isLast ? line : line - 1, 0],
        };

        if (isVoidBlockNode(editor, child)) {
          if (!isVoidBlockNode(editor, previousChild)) {
            newSelection.push({ focus, anchor });
          }
          newStart = line + 1;
        } else if (isLast && newSelection.length !== 0) {
          newSelection.push({ focus, anchor });
        }

        endOffset = child?.children?.[0]?.text?.length || 0;
      }
      previousChild = child;
    }

    if (newSelection.length === 0) {
      newSelection.push(editor.selection);
    }
  } else {
    for (let line = startLine; line <= lastLine; line++) {
      const focus = { offset: 0, path: [line, 0] };
      const anchor = { offset: 0, path: [line, 0] };

      newSelection.push({ focus, anchor });
    }

    if (newSelection.length === 0) {
      newSelection.push(editor.selection);
    }
  }

  return shouldReverseResult ? newSelection.reverse() : newSelection;
}

export function shouldShowAttributeSuggestions(editor, searchQuery: string) {
  if (editor && editor.selection && Range.isCollapsed(editor.selection)) {
    const [start] = Range.edges(editor.selection);
    if (start && !(start.path.length === 1 && start.path[0] === 0)) {
      const queryWithTriggerLength =
        searchQuery.length + ATTRIBUTES_TRIGGER.length;
      const wordBefore = Editor.before(editor, start, {
        unit: 'character',
        distance: queryWithTriggerLength - 1,
      });
      const before = wordBefore && Editor.before(editor, wordBefore);
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);

      return beforeText && beforeText.startsWith(ATTRIBUTES_TRIGGER);
    }
  }

  return false;
}

export function filterDynamicAttributeSearch(
  attributes,
  searchQuery
): DynamicAttributeSuggestion[] {
  if (!searchQuery) return attributes;

  const result: DynamicAttributeSuggestion[] = attributes
    .filter((attr) =>
      attr.name.toLowerCase().startsWith(searchQuery?.toLowerCase())
    )
    .slice(0, 10);

  return result.length ? result : ATTRIBUTE_TYPE_OPTIONS;
}

export function isBrowserChrome() {
  return (
    Bowser.getParser(window.navigator.userAgent).getBrowserName() === 'Chrome'
  );
}

export function isBrowserFirefox() {
  return (
    Bowser.getParser(window.navigator.userAgent).getBrowserName() === 'Firefox'
  );
}

/**
 * Creates a blank text node only, to enable the text editor cursor
 * @param editor
 */
export function insertBlankNode(editor: Editor) {
  Transforms.insertNodes(editor, {
    type: 'paragraph',
    children: [{ text: '' }],
  } as SlateNode);
}

/**
 * Create a new line before a special object
 * whilst making sure it won't swap elements or error.
 * @param editor
 */
export function insertLineAtHead(editor: Editor) {
  /* If we don't insert, it'll either error or swap places with next node */
  insertBlankNode(editor);

  /* Move the image down */
  Transforms.moveNodes(editor, {
    at: [0],
    to: [1],
  });

  /* Create the newline */
  Transforms.insertNodes(
    editor,
    [
      {
        text: '',
      } as SlateNode,
    ],
    {
      at: Editor.start(editor, [0]),
    }
  );
}

/**
 * We want to see if the anchor is at the 0 coordinate with no offset to determine being at top-left of editor
 * @param range
 */
export function pathIsAtHead(range: Range): boolean {
  if (!range) return false;

  const anchor = range.anchor;

  if (!anchor) return false;

  return (
    anchor.path &&
    anchor.offset === 0 &&
    anchor.path.reduce((a: number, b: number) => a + b, 0) === 0
  );
}

/** Idle cursor, nothing highlighted */
export function noSelection(editor: Editor) {
  return editor ? Range.isCollapsed(editor.selection) : true;
}

export const isEmptyNode = (nodes: EditorNode[]) => {
  if (
    !nodes ||
    nodes.length === 0 ||
    !nodes[0].children ||
    (nodes[0].children?.length || 0) === 0
  )
    return true;

  const childNodesOfFirstParagraph = nodes[0].children;

  if (
    nodes.length === 1 &&
    childNodesOfFirstParagraph.length === 1 &&
    typeof childNodesOfFirstParagraph[0].text === 'string' &&
    childNodesOfFirstParagraph[0].text.trim() === '' &&
    !nodes[0].placeholder
  )
    return true;

  return false;
};

export const isEmptySlate = (body: EditorNode[]) => {
  if (!body || !Array.isArray(body)) return true;
  return body.every(
    (node) =>
      (node.type === 'paragraph' || node.type == null) && isEmptyNode([node])
  );
};

/**
 * Check if a slate body is a template based on the expected format of one
 * In the future we may want a better way to detect since if a user edits the body
 *   but leaves the indicator string, it'll be treated as template
 */
export const isStepTemplateBody = (
  bodySlate: EditorNode[],
  stepType: StepType,
  theme: Theme
) => {
  const template = getTemplate(stepType, theme);
  const isSame = isEqualWith(bodySlate, template, (_v1, _v2, key) =>
    key === 'id' ? true : undefined
  );
  return isSame;
};

/**
 * Remove stuff we don't want to show users, such as templates
 */
export const sanitizeSlateBody = (
  bodySlate: EditorNode[],
  stepType: StepType,
  theme: Theme
) => {
  if (!bodySlate || bodySlate.length === 0) return bodySlate;
  const isTemplate = isStepTemplateBody(bodySlate, stepType, theme);
  if (isTemplate) {
    /* Don't submit a template to the server. */
    return getEmptyStepBody();
  }
  return bodySlate;
};

/**
 * @todo add unit tests
 */
export function getDisallowedElementTypes(
  formFactor: GuideFormFactor
): ElementTypesMap {
  let typesArray: FormattingType[] = ['input'];

  switch (formFactor) {
    case GuideFormFactor.modal:
      typesArray = ['button', 'select', 'input'];
      break;

    default:
      break;
  }

  return typesArray.reduce((o, k) => ({ ...o, [k]: true }), {});
}

/**
 * @todo add unit tests
 */
export function getAllowedElementTypes(
  formFactor: GuideFormFactor
): ElementTypesMap {
  switch (formFactor) {
    case GuideFormFactor.banner:
      return {
        link: true,
      };
    default:
      return undefined;
  }
}

export interface ContentLimit {
  character: number | null;
  image: number | null;
  line: number | null;
}

export function wordCountAlertColor(
  formFactor: GuideFormFactor,
  wordCount: number
) {
  const [warn, alert] = getWordCountMax(formFactor);

  if (wordCount > alert) {
    return 'red.500';
  } else if (wordCount > warn) {
    return 'orange';
  }
  return undefined;
}

export type RichTextEditorUISettings = Pick<
  BentoUI,
  | 'embedBackgroundHex'
  | 'primaryColorHex'
  | 'secondaryColorHex'
  | 'additionalColors'
  | 'fontColorHex'
  | 'theme'
  | 'cyoaOptionBackgroundColor'
  | 'isCyoaOptionBackgroundColorDark'
  | 'cyoaTextColor'
  | 'borderColor'
  | 'tagPrimaryColor'
  | 'tagDotSize'
  | 'tagPulseLevel'
  | 'tagBadgeIconBorderRadius'
  | 'tagTextColor'
  | 'tagBadgeIconPadding'
  | 'tagCustomIconUrl'
  | 'tagVisibility'
>;
