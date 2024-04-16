import React, { FC, useMemo } from 'react';
import { Button } from '@chakra-ui/react';
import env from '@beam-australia/react-env';
import { Flex, Text } from '@chakra-ui/layout';
import { MediaReferenceInput, MediaType } from 'bento-common/types/media';
import { UUID_REGEX_STR } from 'bento-common/graphql/EntityId';

import { Highlight } from 'components/common/Highlight';

interface Props {
  mediaReference: MediaReferenceInput;
  /** Callback func to run when the user clicks to edit */
  onEdit: () => void;
  /** Callback func to run when the user clicks to remove */
  onDelete: () => void;
}

const UPLOADS_HOST = env('UPLOADS_HOST')!;

const MediaItem: FC<Props> = ({ mediaReference, onEdit, onDelete }) => {
  const { media } = mediaReference;

  const previewUrl = useMemo(() => {
    const url = media?.url || '';
    return media?.type === MediaType.image
      ? url
          // User uploads.
          .replace(`${UPLOADS_HOST}/media/`, '')
          // Bento provided images.
          .replace(
            'https://s3.us-west-1.amazonaws.com/assets.trybento.co/images/',
            ''
          )
          // Remove UUIDs.
          .replace(new RegExp(`${UUID_REGEX_STR}/`), '')
          .replace(new RegExp(`${UUID_REGEX_STR}_`), '')
      : url;
  }, [media]);

  return (
    <>
      {/* Media meta and action buttons */}
      <Flex flexDir="row" justifyContent="space-between" overflow="hidden">
        {/* Meta */}
        <Flex flexDir="row" gap={2} alignItems="center" overflow="hidden">
          <Text
            color="text.secondary"
            fontWeight="semibold"
            whiteSpace="nowrap"
          >
            Media:
          </Text>
          {previewUrl ? (
            <Highlight fontSize="xs" isTruncated>
              {previewUrl}
            </Highlight>
          ) : (
            <Text fontStyle="italic">None</Text>
          )}
        </Flex>
        {/* Individual controls (i.e. edit or remove) */}
        <Flex flexDir="row" gap={4} alignItems="center" ml={8}>
          <Button
            fontSize="xs"
            variant="link"
            color="bento.bright"
            onClick={onEdit}
          >
            Edit media
          </Button>
          <Button
            fontSize="xs"
            variant="link"
            color="error.bright"
            onClick={onDelete}
          >
            Remove media
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default MediaItem;
