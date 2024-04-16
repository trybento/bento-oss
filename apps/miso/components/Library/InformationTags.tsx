import React from 'react';
import { HStack } from '@chakra-ui/layout';
import { Tag, TagLabel } from '@chakra-ui/react';

interface InformationTagsProps<T> {
  elements: T[];
  labelKeys: string[];
  maxDisplayedElements?: number;
  fallbackText?: string | false;
  /** Return an element if the data matches a callback check */
  decorator?: (element: T) => JSX.Element;
  reverse?: boolean;
  useEllipses?: boolean;
}

export const tagStyle: React.CSSProperties = {
  margin: '0 5px 5px 0',
};

export default function InformationTags<T>({
  elements,
  labelKeys,
  fallbackText = '',
  maxDisplayedElements = 3,
  decorator,
  reverse,
  useEllipses,
}: InformationTagsProps<T>) {
  if (!elements?.length) return null;

  const hiddenElementsCount = elements.length - maxDisplayedElements;

  return (
    <HStack style={{ display: 'flex', flexWrap: 'wrap' }}>
      {elements.slice(0, maxDisplayedElements).map((element, idx) => {
        const _key =
          labelKeys.find(
            (key) =>
              element?.[key] !== undefined &&
              element?.[key] !== '' &&
              element?.[key] !== null
          ) || 'noop';

        if (!element?.[_key] && fallbackText === false) {
          return;
        }

        return (
          <Tag
            key={`information-tag-${idx}`}
            colorScheme="gray"
            borderRadius="full"
            size="sm"
            style={tagStyle}
          >
            <TagLabel
              display="inline-block"
              alignItems="center"
              {...(reverse ? { flexDirection: 'row-reverse' } : {})}
            >
              {!!decorator && decorator(element)}
              {element?.[_key] || fallbackText}
            </TagLabel>
          </Tag>
        );
      })}
      {hiddenElementsCount > 0 && (
        <Tag
          key={`information-tag-hidden-${hiddenElementsCount}`}
          borderRadius="full"
          colorScheme="gray"
          size="sm"
          style={tagStyle}
        >
          <TagLabel>
            {useEllipses ? '...' : `+ ${hiddenElementsCount}`}
          </TagLabel>
        </Tag>
      )}
    </HStack>
  );
}
