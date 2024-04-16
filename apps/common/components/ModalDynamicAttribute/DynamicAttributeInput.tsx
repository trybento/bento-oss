import React, {
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  useMemo,
} from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

import Suggestions from './Suggestions';
import {
  RichMentionsInput,
  RichMentionsProvider,
  TMentionConfig,
  TMentionContext,
} from '../../utils/react-rich-mentions';
import { looseInterleave } from '../../utils/looseInterleave';
import { filterDynamicAttributeSearch } from '../RichTextEditor/helpers';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import { Attribute, AttributeType } from 'bento-common/types';

const ATTRIBUTES_TRIGGER_REGEX = /{{([a-zA-Z0-9_\-.]+)?/;
const ATTRIBUTES_HTML_REGEX = /{{[\s\S]+?}}/g;

export interface DynamicAttributeInputContainerProps extends BoxProps {
  attributes: Attribute[];
  onContentChange: (newValue: string, valid: boolean) => void;
  validate?: (value: string) => boolean;
  initialValue?: string;
  disabled?: boolean;
  resetTriggers?: any[]; // Values should be truthy to reset.
  resetValue?: string;
  autoFocus?: boolean;
  maxLength?: number;
  mentionDisabled?: boolean;
  inputStyle?: Omit<React.CSSProperties, 'fontSize'>;
}

// TODO: Prevent adding an empty space after an attr
export default function DynamicAttributeInput({
  attributes,
  initialValue = '',
  onContentChange,
  onKeyDown,
  validate = () => true,
  disabled,
  resetTriggers = [],
  resetValue = '',
  onBlur,
  mentionDisabled,
  autoFocus,
  onPaste,
  maxLength,
  fontSize,
  inputStyle,
  ...boxProps
}: DynamicAttributeInputContainerProps) {
  const mentionsContextRef = useRef<TMentionContext>();

  const configs = useMemo<TMentionConfig[]>(
    () => [
      {
        query: ATTRIBUTES_TRIGGER_REGEX,
        match: ATTRIBUTES_HTML_REGEX,
        matchDisplay: '$&',
        allowValidCharactersBefore: true,
        onMention: (text: string) => {
          if (mentionDisabled) return [];

          const query = text.substr(2);

          const foundAttributes = filterDynamicAttributeSearch(
            attributes,
            query
          );

          return foundAttributes.map((attribute) => {
            const type =
              attribute.type === AttributeType.accountUser
                ? 'user'
                : attribute.type;
            const ref = `{{${type}:${attribute.name}}}`;

            return {
              readonly: attribute.readonly,
              name: attribute.name,
              type: type,
              ref,
            };
          });
        },
        customizeFragment(span: HTMLSpanElement, final: boolean) {
          mentionsContextRef.current.inputElement.scrollLeft =
            Number.MAX_SAFE_INTEGER;
          span.className = final ? 'final' : 'pending';

          if (final) {
            const value = mentionsContextRef.current.getTransformedValue();
            onContentChange(value, validate(value));
          }
        },
      },
    ],
    [mentionDisabled, attributes]
  );

  const isSuggestionsOpen = useCallback(
    () => !!mentionsContextRef.current?.opened,
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' && !isSuggestionsOpen()) {
        e.preventDefault();
        onKeyDown?.(e);
      }
    },
    [onKeyDown]
  );

  const handleInput = useCallbackRef(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      const value = mentionsContextRef.current.getTransformedValue();
      onContentChange(value, validate(value));
    },
    [disabled, onContentChange, validate]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      // opposite of key down handler to make sure we catch input while there
      // is an active selection (bug with RichMentionsInput which I couldn't
      // figure out how to fix internally)
      if (e.key !== 'Enter' || isSuggestionsOpen()) {
        handleInput(e);
      }
    },
    [handleInput]
  );

  const formatInitialValue = useCallback((_initialValue) => {
    const textParts = _initialValue.split(ATTRIBUTES_HTML_REGEX);
    const attributeParts = _initialValue.match(ATTRIBUTES_HTML_REGEX) || [];

    const attributeElements = attributeParts.map(
      (attribute: string) =>
        `<span data-rich-mentions="${attribute}" spellcheck="false" data-cy="final" class="final" data-integrity="${attribute}">${attribute}</span>`
    );

    const htmlString = looseInterleave(textParts, attributeElements).join('');

    return htmlString;
  }, []);

  useEffect(() => {
    const areAllValuesTruthy = resetTriggers?.filter((v) => !v).length === 0;

    if (resetTriggers.length && areAllValuesTruthy) {
      mentionsContextRef.current.setValue(resetValue);
      onContentChange(resetValue, validate(resetValue));
    }
  }, [...resetTriggers]);

  return (
    <Box
      width="100%"
      position="relative"
      fontSize={fontSize}
      bg="white"
      opacity={disabled ? 0.6 : 1}
      cursor={disabled ? 'not-allowed' : undefined}
      userSelect={disabled ? 'none' : undefined}
      {...boxProps}
    >
      <RichMentionsProvider
        configs={configs}
        getContext={mentionsContextRef}
        getInitialHTML={formatInitialValue}
      >
        <RichMentionsInput
          disabled={disabled}
          defaultValue={initialValue}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onInput={handleInput}
          className="dynamic-attribute-input"
          onBlur={onBlur}
          autoFocus={autoFocus}
          onPaste={onPaste}
          maxLength={maxLength}
          style={{ fontSize: fontSize ? 'inherit' : undefined, ...inputStyle }}
        />
        <Suggestions fixed={false} shouldShowTypeHeaders />
      </RichMentionsProvider>
    </Box>
  );
}
