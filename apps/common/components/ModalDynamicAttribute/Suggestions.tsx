import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import groupBy from 'lodash/groupBy';
import { Box, Flex } from '@chakra-ui/react';
import { px } from 'bento-common/utils/dom';
import useElementSize from 'bento-common/hooks/useElementSize';

import {
  RichMentionsContext,
  TMentionConfig,
} from '../../utils/react-rich-mentions';
import AttributeTypeHeader from '../DynamicAttributeShared/AttributeTypeHeader';
import { DynamicAttributeSuggestion } from '../RichTextEditor/extensions/DynamicAttribute/Suggestions';
import useEventListener from '../../hooks/useEventListener';
import { throttle } from 'bento-common/utils/lodash';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import Portal from '../Portal';

interface TProps {
  fixed?: boolean;
  shouldShowTypeHeaders?: boolean;
}

interface OpenedState {
  config: TMentionConfig<any>;
  element: HTMLSpanElement;
  fixed: boolean;
  bottom: boolean;
  right: boolean;
  x: number;
  y: number;
}

export default function Suggestions({
  fixed = true,
  shouldShowTypeHeaders,
}: TProps) {
  const {
    opened,
    index,
    results,
    setActiveItemIndex,
    selectItem,
    setPositionFixed,
    inputElement,
  } = useContext(RichMentionsContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerDimensions = useElementSize(containerRef.current, 'throttle');
  const [windowBounds, setWindowBounds] = useState<Partial<DOMRect>>();

  const cursorPosition = useMemo(() => {
    if (inputElement && opened && windowBounds) {
      const inputRect = inputElement.getBoundingClientRect();
      return {
        x: inputRect.left + opened.x + windowBounds.left,
        y: inputRect.top + opened.y + windowBounds.top,
      };
    }
    return null;
  }, [inputElement, opened, windowBounds]);

  const position = useMemo<OpenedState>(() => {
    if (opened && containerDimensions && cursorPosition && windowBounds) {
      const leftX = cursorPosition.x - containerDimensions.width;
      const rightX = cursorPosition.x + containerDimensions.width;
      const topY = cursorPosition.y - opened.y - containerDimensions.height;
      const bottomY = cursorPosition.y + containerDimensions.height;

      const openLeft =
        rightX - windowBounds.right > 0 &&
        rightX - windowBounds.right > windowBounds.left - leftX;
      const openTop =
        bottomY - windowBounds.bottom > 0 &&
        bottomY - windowBounds.bottom > windowBounds.top - topY;

      const newPosition = {
        ...opened,
        y: openTop ? topY : cursorPosition.y,
        x: openLeft ? leftX : cursorPosition.x,
      };

      return newPosition;
    }
    return {} as OpenedState;
  }, [opened, containerDimensions, windowBounds, cursorPosition]);

  const resultsByType = useMemo<Record<string, DynamicAttributeSuggestion[]>>(
    () =>
      groupBy(
        results.map((r, i) => ({ ...r, index: i })),
        'type'
      ),
    [results]
  );

  const onSelectItemHandlers = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(resultsByType).map(([type, results]) => [
          type,
          results.map((item) => () => selectItem(item)),
        ])
      ),
    [selectItem, resultsByType]
  );
  const onHoverItemHandlers = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(resultsByType).map(([type, results]) => [
          type,
          results.map((attr) => () => setActiveItemIndex(attr.index)),
        ])
      ),
    [setActiveItemIndex, resultsByType]
  );

  const updateWindowBounds = useCallbackRef(
    throttle(
      () =>
        setWindowBounds({
          top: window.scrollY,
          bottom: window.scrollY + window.innerHeight,
          left: window.scrollX,
          right: window.scrollX + window.innerWidth,
        }),
      16
    ),
    [],
    { callOnLoad: true }
  );

  useEffect(() => {
    setPositionFixed(fixed);
  }, [fixed]);

  useEventListener('window', 'scroll', updateWindowBounds);
  useEventListener('window', 'resize', updateWindowBounds);

  return opened && results.length ? (
    <Portal>
      <Flex
        direction="column"
        alignItems="stretch"
        ref={containerRef}
        className="attribute-autocomplete-list"
        border="1px solid #cbd5e0ff"
        borderRadius="4px"
        background="white"
        padding="6px 10px"
        // WARNING: Although chakra seem to be using Portals, chakra Modals still have
        // high z-index values and therefore this needs to match that otherwise
        // we run the risk of having the suggestions menu rendered behind it
        zIndex="var(--chakra-zIndices-modal, 2)"
        position={fixed ? 'fixed' : 'absolute'}
        left={px(position.x)}
        top={px(position.y)}
        boxShadow="0 1px 5px rgba(0,0,0,.2)"
        maxHeight="400px"
        overflow="auto"
      >
        {Object.entries(resultsByType).map(([type, results]) => (
          <React.Fragment key={type}>
            {shouldShowTypeHeaders && (
              <AttributeTypeHeader attribute={results[0]} />
            )}
            {results.map((attribute, i) => (
              <button
                style={{
                  padding: '1px 3px',
                  borderRadius: '2px',
                  background:
                    attribute.index === index && !attribute.readonly
                      ? '#B4D5FF'
                      : 'transparent',
                  textAlign: 'left',
                  cursor: attribute.readonly ? 'unset' : 'pointer',
                  color: attribute.readonly ? '#cecece' : 'initial',
                }}
                type="button"
                key={`${type}-${attribute.ref}`}
                onClick={onSelectItemHandlers[type][i]}
                onMouseOver={onHoverItemHandlers[type][i]}
              >
                <Box pl="2">{attribute.name}</Box>
              </button>
            ))}
          </React.Fragment>
        ))}
      </Flex>
    </Portal>
  ) : null;
}
