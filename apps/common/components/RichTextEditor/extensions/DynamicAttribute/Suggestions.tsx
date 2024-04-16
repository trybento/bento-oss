import React, { forwardRef, MouseEvent, useCallback, useRef } from 'react';
import Portal from '../../../Portal';
import AttributeTypeHeader from '../../../DynamicAttributeShared/AttributeTypeHeader';
import { AttributeType } from 'bento-common/types';
import { Box } from '@chakra-ui/react';

export interface DynamicAttributeSuggestion {
  name: string;
  type: AttributeType;
  readonly: boolean;
  /** Provided by react-rich-mentions */
  ref?: string;
  index?: number;
}

interface Props {
  attributes: DynamicAttributeSuggestion[];
  suggestionIndex: number;
  onMouseDown: (e: MouseEvent) => void;
  setSuggestionIndex: (index: number) => void;
}

const Suggestions = forwardRef<HTMLDivElement, Props>(
  ({ attributes, suggestionIndex, onMouseDown, setSuggestionIndex }, ref) => {
    const currentAttributeType = useRef<any>(null);
    const isDifferentAtributeType = useCallback((type): boolean => {
      if (currentAttributeType.current !== type) {
        currentAttributeType.current = type;
        return true;
      }
      return false;
    }, []);

    const handleMouseEnter = useCallback(
      (index: number) => () => {
        setSuggestionIndex(index);
      },
      [setSuggestionIndex]
    );

    return (
      <Portal>
        <Box
          ref={ref}
          top="-9999px"
          left="-9999px"
          position="absolute"
          zIndex={2}
          padding="6px 10px"
          background="white"
          borderRadius="4px"
          boxShadow="0 1px 5px rgba(0,0,0,.2)"
          maxHeight="400px"
          overflow="auto"
        >
          {attributes.map((attribute, i) => (
            <React.Fragment key={i}>
              {isDifferentAtributeType(attribute.type) && (
                <AttributeTypeHeader attribute={attribute} />
              )}
              <Box
                key={`${attribute.name}-${attribute.type}`}
                className={attribute.readonly ? '' : 'cursor-pointer'}
                style={{
                  color: attribute.readonly ? '#cecece' : 'initial',
                  padding: '1px 3px',
                  borderRadius: '2px',
                  background:
                    i === suggestionIndex && !attribute.readonly
                      ? '#B4D5FF'
                      : 'transparent',
                }}
                onMouseEnter={handleMouseEnter(i)}
                onMouseDown={onMouseDown}
              >
                <Box pl="2">{attribute.name}</Box>
              </Box>
            </React.Fragment>
          ))}
        </Box>
      </Portal>
    );
  }
);

export default Suggestions;
