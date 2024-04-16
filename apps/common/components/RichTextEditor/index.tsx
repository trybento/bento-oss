import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
  CSSProperties,
  ReactNode,
} from 'react';
import {
  createEditor,
  Editor,
  Element as SlateElement,
  Node as SlateNode,
  Location,
  Range,
  Transforms,
  BaseRange,
  Path as SlatePath,
} from 'slate';
import { ReactEditor, Editable, Slate, withReact } from 'slate-react';
import { History, withHistory } from 'slate-history';
import debounce from 'lodash/debounce';
import { compose } from 'lodash/fp';
import isHotkey from 'is-hotkey';
import { withNodeId } from '@udecode/slate-plugins-node-id';
import { v4 as uuidv4 } from 'uuid';

import withButton from './extensions/Button/withButton';
import withImages from './extensions/Image/withImages';
import withLinks from './extensions/Link/withLinks';
import withSelect from './extensions/Select/withSelect';
import withInput from './extensions/Input/withInput';
import withVideos from './extensions/Video/withVideos';
import withParagraphs from './extensions/withParagraphs';
import withNormalizeVoidBlockNodes from './extensions/withNormalizeVoidBlockNodes';
import withShortcuts from './extensions/withShortcuts';
import withHtml from './extensions/Html/withHtml';
import {
  toggleBlock,
  toggleMark,
  isBlockActive,
  isBrowserChrome,
  isBrowserFirefox,
  filterDynamicAttributeSearch,
  shouldShowAttributeSuggestions,
  ATTRIBUTES_TRIGGER,
  insertLineAtHead,
  pathIsAtHead,
  EDITOR_INNER_HEIGHT,
  EDITOR_MAX_HEIGHT,
  isEmptyNode,
  unwrapLink,
  RTE_MEDIA_NOT_SUPPORTED,
  RTE_UPDATED_MEDIA_WARNING,
  RichTextEditorUISettings,
} from './helpers';
import { ElementTypesMap, EditorNode } from 'bento-common/types/slate';

import Element from './Element';
import Leaf from './Leaf';
import FormattingButtons from './FormattingButtons';
import ErrorBoundary from './ErrorBoundary';
import EditorContainer from './components/EditorContainer';
import RichTextEditorProvider, {
  isRteElementTypeAllowed,
} from './providers/RichTextEditorProvider';
import ImageDropzone from './extensions/Image/ImageDropzone';
import withDynamicAttributes, {
  insertDynamicAttribute,
} from './extensions/DynamicAttribute/withDynamicAttributes';
import DynamicAttributeSuggestions from './extensions/DynamicAttribute/Suggestions';
import { handleBackspace, handleDownArrow, handleEnterKey } from './actions';
import withCallout from './extensions/Callout/withCallout';
import useLocalStorage, { LS_KEYS } from '../../hooks/useClientStorage';
import RecoveryModeModal from './RecoveryModeModal';
import {
  Attribute,
  BannerStyle,
  CardStyle,
  CarouselStyle,
  GuideFormFactor,
  TooltipStyle,
  VideoGalleryStyle,
} from 'bento-common/types';
import { isEdgeToEdge } from 'bento-common/utils/image';
import {
  allowedTypesWithFillMap,
  getIdRecursively,
  inlineElementNodesMap,
  isVideoNode,
} from 'bento-common/utils/bodySlate';
import withDivider from './extensions/Divider/withDivider';
import withLists from './extensions/withLists';
import withEmbedLinks from './extensions/EmbedLink/withEmbedLinks';
import {
  ClipboardEvents,
  handleClipboardKeys,
} from 'bento-common/frontend/htmlElementHelpers';
import { isBannerGuide } from 'bento-common/utils/formFactor';

import { Box, CloseButton } from '@chakra-ui/react';
import colors from '../../frontend/colors';
import { WarningCallout } from '../CalloutText';
import { ClientStorage } from '../../utils/clientStorage';
import BentoSpinner from '../../icons/BentoSpinner';
import { FormEntityType } from '../../types/forms';

const MARK_HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
  'mod+k': 'link',
};

const BULLETED_LIST_HOTKEY = 'mod+shift+l';

// We use a function instead of a const here so as to not share the value between multiple Slate instances
export function createEmptyBody(): SlateNode[] {
  return [
    {
      id: uuidv4(),
      type: 'paragraph',
      children: [{ text: '' }],
    } as SlateNode,
  ];
}

interface RTEOverlayProps {
  isUploading?: boolean;
  isLoading?: boolean;
  /** Show Bento errors. */
  error?: ReactNode;
  isFileDropped?: boolean;
  disabledMessage?: string;
}

const RTESpinnerSize = '80px';
const RTEOverlay: React.FC<React.PropsWithChildren<RTEOverlayProps>> = ({
  isUploading,
  isLoading,
  isFileDropped,
  error,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const _show = show || error;
  useEffect(() => {
    if (isUploading) {
      setShow(true);
    }
  }, [isUploading]);

  useEffect(() => {
    setShow(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (isFileDropped) {
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 4000);
    }
  }, [isFileDropped]);

  return (
    <Box
      opacity={_show ? '1' : '0'}
      zIndex={_show ? 0 : -1}
      transition="opacity .218s"
      style={{
        transitionDelay: '0, .3s',
        transitionProperty: 'opacity, z-index',
      }}
      borderRadius="4px"
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      display="grid"
      background={
        error
          ? 'gray.50'
          : _show
          ? isLoading
            ? '#ffffff99'
            : '#e6efff99'
          : 'transparent'
      }
    >
      {error ? (
        <Box m="auto">{error}</Box>
      ) : (
        <BentoSpinner
          fill="transparent"
          style={{
            margin: 'auto',
            width: RTESpinnerSize,
            height: RTESpinnerSize,
          }}
        />
      )}
    </Box>
  );
};

interface RichTextEditorProps {
  attributes: Attribute[];
  initialBody: SlateNode[] | undefined;
  onBodyChange: (slateBody: SlateNode[]) => void;
  isReadonly?: boolean;
  hideControls?: boolean;
  isLoading?: boolean;
  error?: ReactNode;
  containerKey: string;
  onInteracted?: () => void;
  formEntityType: FormEntityType | undefined;
  disallowedElementTypes?: ElementTypesMap;
  allowedElementTypes?: ElementTypesMap;
  pixelHeight?: number;
  /** Wether or not the editor value should be kept/recoverable from sessionStorage */
  recoverable?: boolean;
  /** Unique Id to tie the recoverable content to, preventing conflicts between instances */
  recoverableId?: string;
  formFactor: GuideFormFactor;
  /** Used to indicate floating components to render above modals */
  zIndex?: number;
  addMenuDisabled?: boolean;
  formFactorStyle?:
    | CarouselStyle
    | CardStyle
    | TooltipStyle
    | BannerStyle
    | VideoGalleryStyle;
  uiSettings: RichTextEditorUISettings;
  organizationDomain?: string;
  accessToken: string;
  fileUploadConfig: {
    apiHost: string;
    uploadsHost: string;
  };
}

interface EditorWithHistory extends ReactEditor {
  history: History;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  attributes,
  initialBody,
  isReadonly,
  hideControls,
  isLoading,
  error,
  onBodyChange,
  containerKey,
  onInteracted,
  formEntityType,
  disallowedElementTypes,
  allowedElementTypes,
  pixelHeight,
  recoverable = true,
  recoverableId = btoa(containerKey),
  formFactor,
  formFactorStyle = {},
  zIndex,
  addMenuDisabled,
  uiSettings,
  organizationDomain,
  accessToken,
  fileUploadConfig,
}) => {
  const mediaFullyUnsupported = useMemo(
    () => isBannerGuide(formFactor),
    [formFactor]
  );

  /**
   * Use ref instead of memo
   * See: https://stackoverflow.com/questions/65852411/slate-js-throws-an-error-when-inserting-a-new-node-at-selected-region
   */
  const editorRef = useRef();

  if (!editorRef.current)
    editorRef.current = withReact(
      compose(
        withHistory,
        withHtml,
        withImages,
        withVideos,
        withEmbedLinks,
        withLinks,
        withSelect,
        withInput,
        withButton,
        withParagraphs,
        withLists,
        withCallout,
        withNormalizeVoidBlockNodes,
        withShortcuts,
        withDynamicAttributes,
        withDivider,
        withNodeId({ idCreator: uuidv4 })
      )(createEditor())
    );

  const editor = editorRef.current as EditorWithHistory;

  const [warningMessage, setWarningMessage] = useState<ReactNode | null>(null);
  const [editorValue, setEditorValue] = useState<SlateNode[]>(
    createEmptyBody()
  );
  const [persistedSelection, setPersistedSelection] = useState<Location | null>(
    null
  );
  const [isFocused, setFocused] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Used for advanced hotkey functionality.
  const [customHotkeyEnabled, setCustomHotkeyEnabled] = useState<string | null>(
    null
  );
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [filesDropped, setFilesDropped] = useState<any>(null);
  const dropzoneCount = useRef<number>(0);
  const historyRefs = useRef({});

  const dismissWarning = useCallback(() => {
    setWarningMessage(null);
  }, []);

  const { value: recoveryMode, clearValue: discardRecoveryMode } =
    useLocalStorage(
      ClientStorage.sessionStorage,
      LS_KEYS.RteRecoveryMode,
      null
    );

  const {
    value: serializedRecoveryValue,
    setValue: saveRecoveryValue,
    clearValue: discardRecoveryValue,
  } = useLocalStorage(
    ClientStorage.sessionStorage,
    `${LS_KEYS.RteRecoveryValue}-${recoverableId}`,
    null
  );

  const recoveredEditorValue = useMemo<EditorNode[] | null>(() => {
    try {
      const parsed = JSON.parse(serializedRecoveryValue);
      return isEmptyNode(parsed) ? null : parsed;
    } catch (err) {
      // fail silently
      console.error('RTE wasn`t able to recover from previous session');
    }

    return null;
  }, [serializedRecoveryValue]);

  const shouldDisplayRecoveryMode = useMemo<boolean>(
    () => recoverable && !!recoveryMode && !!recoveredEditorValue,
    [recoverable, recoveryMode, recoveredEditorValue]
  );

  const handleRecoveryModeDismiss = useCallback(() => {
    discardRecoveryValue();
    discardRecoveryMode();
  }, [discardRecoveryValue, discardRecoveryMode]);

  const handleRecoveryModeConfirmation = useCallback(() => {
    if (!recoveredEditorValue) return;

    setPersistedSelection(null);
    Transforms.deselect(editor);

    // Update the editor and trigger callback to let parent container know
    [setEditorValue, onBodyChange].forEach((fn) => fn(recoveredEditorValue));

    // Reset history refs
    historyRefs.current[containerKey] = { redos: [], undos: [] };
    editor.history = historyRefs.current[containerKey];

    discardRecoveryMode();
  }, [recoveredEditorValue, discardRecoveryMode, setEditorValue, onBodyChange]);

  const snapshotEditorValue = useCallback(
    debounce((value: EditorNode[]): void => {
      // discard any previously set recovery mode
      discardRecoveryMode();
      saveRecoveryValue(JSON.stringify(value));
    }, 500),
    [discardRecoveryMode, saveRecoveryValue]
  );

  const [dynamicAttributeSearch, setDynamicAttributeSearch] = useState('');

  const dynamicAttributes = useMemo(
    () => filterDynamicAttributeSearch(attributes, dynamicAttributeSearch),
    [dynamicAttributeSearch]
  );

  const dragDisabled = !isRteElementTypeAllowed(
    allowedElementTypes,
    disallowedElementTypes
  )('image');
  const suggestionsRef = useRef<HTMLDivElement>();
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [areAttributeSuggestionsOpen, setAreAttributeSuggestionsOpen] =
    useState(false);
  const [shouldShowSuggestions, setShouldShowSuggestions] = useState(false);

  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const renderElement = useCallback(
    (props) => {
      const firstElementId = getIdRecursively(editor?.children?.[0]);
      const currentId = getIdRecursively(props.element);

      const isMarginless =
        isEdgeToEdge(props.element?.fill) &&
        allowedTypesWithFillMap[props.element.type];

      const element = (
        <Element
          {...props}
          uiSettings={uiSettings}
          formEntityType={formEntityType}
          formFactor={formFactor}
          formFactorStyle={formFactorStyle}
          accessToken={accessToken}
          fileUploadConfig={fileUploadConfig}
          dynamicAttributes={attributes}
        />
      );

      if (inlineElementNodesMap[props.element.type]) {
        return <>{element}</>;
      }

      return (
        <Box
          px={isMarginless ? undefined : '4'}
          pt={
            firstElementId === currentId
              ? isMarginless
                ? undefined
                : '4'
              : undefined
          }
        >
          {element}
        </Box>
      );
    },
    [editor?.children?.[0], formFactor, formFactorStyle]
  );

  const onFocus = useCallback(() => {
    setFocused(true);
  }, [setFocused]);

  const onBlur = useCallback(() => {
    setFocused(false);

    if (editor.selection) {
      setPersistedSelection(editor.selection);
    }
  }, [editor, setFocused]);

  const debounceOnBodyChange = useCallback(debounce(onBodyChange, 500), [
    onBodyChange,
  ]);

  // Might not be needed if 'editor.insertFragment' is used properly.
  // NOTE: Might deprecate soon, check modals and branching editor
  // before removing.
  const filterBody = useCallback(
    (body: EditorNode[] = []) => {
      // Return body if all types are allowed.
      if (!disallowedElementTypes) return body;
      if (!Object.keys(disallowedElementTypes).length) return body;

      let changeDetected = false;
      // Replace disabled element types to avoid undefined descendant errors.
      const newBody = body.map((n) => {
        const _type = isVideoNode(n as any) ? 'videos' : n.type;
        const shouldReplace = disallowedElementTypes[_type];
        if (shouldReplace) {
          changeDetected = true;
          return { type: 'text', text: '' };
        }
        return n;
      });
      return changeDetected ? newBody : body;
    },
    [disallowedElementTypes]
  );

  useEffect(() => {
    if (recoveryMode) return;

    setPersistedSelection(null);
    Transforms.deselect(editor);

    // Prevent empty bodySlates from being loaded.
    const _initialBody =
      !initialBody || (Array.isArray(initialBody) && initialBody.length === 0)
        ? createEmptyBody()
        : initialBody;

    setEditorValue(filterBody(_initialBody as EditorNode[]));

    if (!historyRefs.current[containerKey]) {
      historyRefs.current[containerKey] = {
        redos: [],
        undos: [],
      };
    }

    editor.history = historyRefs.current[containerKey];

    return () => {
      historyRefs.current[containerKey] = editor.history;
      setPersistedSelection(null);
      Transforms.deselect(editor);
    };
  }, [initialBody]);

  if (dynamicAttributeSearch && !isFocused) {
    setDynamicAttributeSearch('');
  }

  useEffect(() => {
    const _shouldShowSuggestions = shouldShowAttributeSuggestions(
      editor,
      dynamicAttributeSearch
    );
    if (_shouldShowSuggestions) {
      const el = suggestionsRef.current;
      const domRange = ReactEditor.toDOMRange(
        editor,
        editor.selection as BaseRange
      );
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 24}px`;
        el.style.left = `${rect.left + window.pageXOffset}px`;
      }
    } else {
      setDynamicAttributeSearch('');
      setAreAttributeSuggestionsOpen(false);
    }

    setShouldShowSuggestions(_shouldShowSuggestions);
  }, [editor.selection, areAttributeSuggestionsOpen]);

  useEffect(() => {
    if (!areAttributeSuggestionsOpen && shouldShowSuggestions) {
      setDynamicAttributeSearch('');
      setAreAttributeSuggestionsOpen(true);
    }
  }, [shouldShowSuggestions]);

  const onChange = useCallback(
    (newBody) => {
      if (isReadonly) return;
      const filteredBody = filterBody(newBody);

      setEditorValue(filteredBody);
      debounceOnBodyChange(filteredBody);

      const isAstChange = editor.operations.some(
        (op) => 'set_selection' !== op.type
      );

      // Serialize the value and save the string value to local storage
      isAstChange && snapshotEditorValue(newBody);
    },
    [debounceOnBodyChange, snapshotEditorValue, isReadonly]
  );

  const handleKeyDown = (event: KeyboardEvent<unknown>) => {
    if (isReadonly) {
      handleClipboardKeys(event, [ClipboardEvents.copy]);
      return;
    }
    const focusPoint: SlatePath = editor.selection?.focus?.path;

    if (event.key === 'Enter') {
      if (areAttributeSuggestionsOpen) {
        handleSuggestionSelected(event);
        return;
      }
      handleEnterKey({ editor, event });
    }

    if (event.key === 'Backspace') {
      handleBackspace({ editor, event });
    }

    if (event.key === 'Tab') {
      if (isBlockActive(editor, 'code-block')) {
        event.preventDefault();
        editor.insertText('  ');
      }
    }

    if (event.key === ' ') {
      const currentParentNode = SlateNode.parent(
        editor,
        focusPoint
      ) as EditorNode;
      if (currentParentNode.type === 'dynamic-attribute') {
        event.preventDefault();
      }
    }

    if (event.key === 'ArrowLeft') {
      /* If we're on the first item and it's a special element */
      const anchor = editor?.selection?.anchor;
      if (anchor) {
        const atStart = pathIsAtHead(editor?.selection);

        const currentNode = SlateNode.parent(editor, anchor.path);
        if (currentNode && SlateElement.isElement(currentNode) && atStart) {
          if (editor.isVoid(currentNode as SlateElement)) {
            insertLineAtHead(editor);
            event.preventDefault();
          }
        }
      }
    }

    if (event.key === 'ArrowDown') {
      if (areAttributeSuggestionsOpen) {
        event.preventDefault();
        if (suggestionIndex >= dynamicAttributes.length - 1) {
          setSuggestionIndex(0);
        } else {
          setSuggestionIndex(suggestionIndex + 1);
        }
      } else {
        handleDownArrow({ editor, event });
      }
    } else if (event.key === 'ArrowUp' && areAttributeSuggestionsOpen) {
      event.preventDefault();

      if (suggestionIndex <= 0) {
        setSuggestionIndex(dynamicAttributes.length - 1);
      } else {
        setSuggestionIndex(suggestionIndex - 1);
      }
    } else if (
      event.key.length === 1 &&
      event.key.match(/[a-zA-Z0-9:-_]/) &&
      areAttributeSuggestionsOpen
    ) {
      setSuggestionIndex(0);
      setDynamicAttributeSearch(dynamicAttributeSearch + event.key);

      const currentParentNode = SlateNode.parent(
        editor,
        focusPoint
      ) as EditorNode;
      if (currentParentNode.type === 'dynamic-attribute') {
        event.preventDefault();
      }
    } else if (event.key === 'Backspace' && dynamicAttributeSearch) {
      setDynamicAttributeSearch(dynamicAttributeSearch.slice(0, -1));
    } else {
      setAreAttributeSuggestionsOpen(false);
    }

    Object.keys(MARK_HOTKEYS).forEach((hotKey) => {
      if (isHotkey(hotKey, event.nativeEvent)) {
        event.preventDefault();
        const mark = MARK_HOTKEYS[hotKey];

        if (mark === 'link') {
          if (isBlockActive(editor, mark)) {
            unwrapLink(editor);
          } else {
            setCustomHotkeyEnabled(mark);
          }
        } else {
          toggleMark(editor, mark);
        }
      }
    });

    if (isHotkey(BULLETED_LIST_HOTKEY, event.nativeEvent)) {
      event.preventDefault();
      toggleBlock(editor, 'bulleted-list');
    }

    onInteracted?.();
  };

  const handleFocusEditor = useCallback(
    (e = null) => {
      // MouseDown breaks editor focus in Chrome but is needed in Firefox.
      if (e?.type === 'mousedown' && isBrowserChrome()) return null;

      if (!isFocused) {
        const el = ReactEditor.toDOMNode(editor, editor);
        const isFocusedOnClick = document.activeElement === el;
        setFocused(true);
        el.focus();

        const shouldSelect =
          !e ||
          !isBrowserFirefox() ||
          (e?.type === 'click' && isBrowserFirefox());

        if (e?.type === 'drop' && persistedSelection) {
          Transforms.select(editor, persistedSelection);
        } else if (!isFocusedOnClick && shouldSelect) {
          if (persistedSelection) {
            Transforms.select(editor, persistedSelection);
          } else {
            Transforms.select(editor, Editor.end(editor, []));
          }
        }
      }
    },
    [editor, setFocused, persistedSelection, isFocused]
  );

  const handleSuggestionSelected = (event) => {
    event?.preventDefault();
    const [start] = Range.edges(editor.selection);
    const queryWithTriggerLength =
      dynamicAttributeSearch.length + ATTRIBUTES_TRIGGER.length;
    const wordBefore = Editor.before(editor, start, {
      unit: 'character',
      distance: queryWithTriggerLength - 1,
    });
    const before = wordBefore && Editor.before(editor, wordBefore);
    const beforeRange = before && Editor.range(editor, before, start);

    const { name, type, readonly } = dynamicAttributes[suggestionIndex] || {};

    if (!readonly) {
      Transforms.select(editor, beforeRange);
      insertDynamicAttribute(editor, name, type);
    }

    // Delayed to allow node to be inserted.
    setTimeout(() => {
      setAreAttributeSuggestionsOpen(false);
      setDynamicAttributeSearch('');
    }, 500);
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setIsDraggingFile(true);
    dropzoneCount.current++;
  }, []);

  const handleDragLeave = useCallback(() => {
    dropzoneCount.current--;
    if (dropzoneCount.current === 0) {
      setIsDraggingFile(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      handleFocusEditor(e);
      if (e.dataTransfer.files) {
        setFilesDropped(e.dataTransfer.files);
      }
      setIsDraggingFile(false);
      dropzoneCount.current = 0;

      if (dragDisabled) {
        setWarningMessage(
          mediaFullyUnsupported
            ? `${RTE_MEDIA_NOT_SUPPORTED} in ${formFactor}s.`
            : RTE_UPDATED_MEDIA_WARNING
        );
        setTimeout(() => {
          setFilesDropped(null);
        }, 500);
      }
    },
    [handleFocusEditor, dragDisabled, mediaFullyUnsupported, formFactor]
  );

  const handleImageUploadStart = useCallback(() => {
    setIsUploading(true);
    setFilesDropped(null);
  }, []);

  const handleImageUploaded = useCallback(() => {
    /**
     * Hacky way of setting the callback at the end
     * of the call queue to allow image to be rendered.
     */
    setTimeout(() => {
      setIsUploading(false);
    }, 0);
  }, []);

  const handleResetHotkey = useCallback(() => {
    setCustomHotkeyEnabled(null);
  }, []);

  const containerStyle: CSSProperties = pixelHeight
    ? {
        height: `${pixelHeight}px`,
        minHeight: `${pixelHeight}px`,
      }
    : {};

  /**
   * Needed to update Slate's internal state after the initial render.
   * @see https://github.com/ianstormtaylor/slate/pull/4540#issuecomment-951380551
   */
  editor.children = editorValue;

  const noop = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }, []);

  const componentStyle =
    formFactorStyle.backgroundColor || formFactorStyle.textColor
      ? {
          backgroundColor: formFactorStyle.backgroundColor,
          color: formFactorStyle.textColor,
        }
      : undefined;

  if (!editor) return null;

  return (
    <ErrorBoundary>
      <RecoveryModeModal
        isOpen={shouldDisplayRecoveryMode}
        onClose={handleRecoveryModeDismiss}
        onDiscard={handleRecoveryModeDismiss}
        onContinue={handleRecoveryModeConfirmation}
      />
      <RichTextEditorProvider
        persistedSelection={persistedSelection}
        setPersistedSelection={setPersistedSelection}
        disallowedElementTypes={disallowedElementTypes}
        allowedElementTypes={allowedElementTypes}
        isReadonly={isReadonly}
        zIndex={zIndex}
      >
        <Slate editor={editor} value={editorValue} onChange={onChange}>
          <Box
            position="relative"
            onPasteCapture={(isReadonly ? noop : undefined) as any}
            onCutCapture={(isReadonly ? noop : undefined) as any}
          >
            <EditorContainer
              opacity={isDraggingFile ? '0.6' : '1'}
              hasWarning={!!warningMessage}
              transition="opacity .218s"
              isFocused={(isFocused || isDraggingFile) && !isReadonly}
              onClick={handleFocusEditor}
              onMouseDown={handleFocusEditor}
              onDragEnter={handleDragEnter}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              componentStyle={componentStyle}
              style={{
                maxHeight: EDITOR_MAX_HEIGHT,
                ...containerStyle,
              }}
            >
              <Editable
                as={Box}
                renderLeaf={renderLeaf}
                renderElement={renderElement}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
                style={{
                  minHeight: pixelHeight
                    ? `${pixelHeight - 60}px`
                    : EDITOR_INNER_HEIGHT,
                  maxHeight: EDITOR_MAX_HEIGHT,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  /**
                   * Since we still want certain elements to be focused
                   * for copy/cut, just hide the caret to prevent users
                   * from thinking it is editable.
                   */
                  caretColor: isReadonly ? 'transparent' : undefined,
                }}
                autoCapitalize="false"
                autoCorrect="false"
                spellCheck="true"
              />
              {isReadonly || hideControls ? null : (
                <FormattingButtons
                  attributes={attributes}
                  uiSettings={uiSettings}
                  organizationDomain={organizationDomain}
                  accessToken={accessToken}
                  fileUploadConfig={fileUploadConfig}
                  handleFocusEditor={handleFocusEditor}
                  hotkeyEnabled={customHotkeyEnabled}
                  resetHotkey={handleResetHotkey}
                  formFactor={formFactor}
                  formFactorStyle={formFactorStyle}
                  addMenuDisabled={addMenuDisabled}
                />
              )}
              {(shouldShowSuggestions || areAttributeSuggestionsOpen) && (
                <DynamicAttributeSuggestions
                  ref={suggestionsRef}
                  {...{
                    setSuggestionIndex: setSuggestionIndex,
                    onMouseDown: handleSuggestionSelected,
                    attributes: dynamicAttributes,
                    suggestionIndex: suggestionIndex,
                  }}
                />
              )}
            </EditorContainer>

            {!dragDisabled && (
              <ImageDropzone
                accessToken={accessToken}
                fileUploadConfig={fileUploadConfig}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                isDraggingFile={isDraggingFile}
                filesDropped={filesDropped}
                onUploadStart={handleImageUploadStart}
                onUploaded={handleImageUploaded}
              />
            )}

            <RTEOverlay
              isUploading={isUploading && !dragDisabled}
              error={error}
              isLoading={isLoading}
              isFileDropped={!dragDisabled && filesDropped}
            />
            {warningMessage && (
              <WarningCallout
                position="absolute"
                bottom="70px"
                w="90%"
                left="50%"
                transform="translateX(-50%)"
                fontSize="sm"
              >
                {warningMessage}
                <CloseButton
                  position="absolute"
                  onClick={dismissWarning}
                  size="sm"
                  top="0"
                  right="0"
                  color={colors.warning.text}
                />
              </WarningCallout>
            )}
          </Box>
        </Slate>
      </RichTextEditorProvider>
    </ErrorBoundary>
  );
};

export default RichTextEditor;
