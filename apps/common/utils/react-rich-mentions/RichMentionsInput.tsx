import { setEndOfContenteditable } from 'bento-common/frontend/htmlElementHelpers';
import React, {
  HTMLProps,
  useRef,
  useContext,
  useEffect,
  useCallback,
  FormEvent,
  KeyboardEvent,
  useMemo,
} from 'react';
import { RichMentionsContext } from './RichMentionsContext';

interface TProps extends HTMLProps<HTMLDivElement> {
  defaultValue?: string;
}

export function RichMentionsInput({
  defaultValue,
  disabled,
  autoFocus,
  onPaste,
  ...divAttributes
}: TProps) {
  const maxLength = useMemo(
    () => divAttributes.maxLength || 0,
    [divAttributes.maxLength]
  );

  const ref = useRef<string | null>(null);
  const {
    setInputElement,
    onBeforeChanges,
    onKeyDown,
    onChanges,
    getInitialHTML,
    inputElement,
  } = useContext(RichMentionsContext);

  if (ref.current === null && defaultValue && getInitialHTML) {
    ref.current = getInitialHTML(defaultValue);
  }

  useEffect(() => {
    if (inputElement && autoFocus) {
      inputElement.focus();
      setEndOfContenteditable(inputElement);
    }
  }, [!!inputElement, autoFocus]);

  if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore
    divAttributes['data-cy'] = 'input';
  }

  const mergeOnKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (
        maxLength &&
        (inputElement?.innerText.length || 0) + 1 > maxLength &&
        e.key !== 'Delete' &&
        e.key !== 'Backspace' &&
        !e.key.startsWith('Arrow') &&
        !e.ctrlKey
      ) {
        e.preventDefault();
        return;
      }
      onKeyDown(e);
      divAttributes.onKeyDown?.(e);
    },
    [onKeyDown, divAttributes.onKeyDown, maxLength, inputElement]
  );

  const onInput = useCallback(
    (e: FormEvent<HTMLDivElement>) => {
      if (maxLength && (inputElement?.innerText.length || 0) > maxLength) {
        inputElement.innerText = inputElement.innerText.slice(0, maxLength);
      }
      divAttributes.onInput?.(e);
      onChanges(e);
    },
    [onChanges, divAttributes.onInput, maxLength, inputElement]
  );

  const onBeforeInput = useCallback(
    (event: FormEvent<HTMLDivElement>) => {
      onBeforeChanges(event);
      divAttributes.onBeforeInput?.(event);
    },
    [onBeforeChanges, divAttributes.onBeforeInput]
  );

  return (
    <div
      ref={setInputElement}
      {...divAttributes}
      contentEditable={!disabled}
      onBeforeInput={onBeforeInput}
      onKeyDown={mergeOnKeyDown}
      onInput={onInput}
      dangerouslySetInnerHTML={{ __html: ref.current || '' }}
      onPaste={onPaste}
    />
  );
}
