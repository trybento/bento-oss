import React, { FC, useCallback, useMemo, useState } from 'react';
import { Box, Button, Flex, FormLabel, Text } from '@chakra-ui/react';
import { FieldArray } from 'formik';
import { MediaReferenceInput, MediaType } from 'bento-common/types/media';
import {
  AttributeType,
  AttributeValueType,
  GuideFormFactor,
} from 'bento-common/types';

import MediaEditorModal, { getDefaultMediaReference } from './MediaEditorModal';
import { useAttributes } from 'providers/AttributesProvider';
import { useTemplate } from 'providers/TemplateProvider';
import MediaItem from './MediaItem';
import colors from 'helpers/colors';

interface Props {
  formKey: string;
  formFactor: GuideFormFactor;
  mediaReferences: MediaReferenceInput[];
}

const SelectedStepMedia: FC<Props> = ({
  formKey,
  mediaReferences,
  formFactor,
}) => {
  const { attributes } = useAttributes();
  const { setMediaPositionDefaults } = useTemplate();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<
    number | undefined
  >(undefined);

  const attributeOptions = useMemo(() => {
    return attributes.reduce(
      (acc, attribute) => {
        const { type, name, valueType } = attribute;
        const displayType = type === AttributeType.accountUser ? 'user' : type;
        const label = `${displayType}:${name}`;

        if (valueType === AttributeValueType.number) {
          acc.number.push({
            label,
            value: `{{${label}}}`,
          });
        }
        return acc;
      },
      { number: [] }
    );
  }, []);

  const handleEditorOpened = useCallback(
    (index: number) => {
      const actualIndex = index === -1 ? mediaReferences.length : index;
      setIsEditing(true);
      setSelectedMediaIndex(actualIndex);
    },
    [mediaReferences]
  );

  const handleEditorDismissed = useCallback(() => {
    setIsEditing(false);
    setSelectedMediaIndex(undefined);
  }, []);

  const handleEditorConfirmed = useCallback((...args: any) => {
    setIsEditing(false);
  }, []);

  const selectedMediaReference =
    typeof selectedMediaIndex !== undefined
      ? mediaReferences[selectedMediaIndex]
      : undefined;

  return (
    <Box>
      <FieldArray
        name={`${formKey}.mediaReferences`}
        render={({ push, remove }) =>
          mediaReferences.length > 0 ? (
            mediaReferences.map((mr, idx) => (
              <Flex
                key={`media-reference-${mr?.entityId}-${idx}`}
                flexDir="column"
                gap="4"
                mb={2}
                className="last:mb-0"
              >
                <MediaItem
                  mediaReference={mr}
                  onEdit={() => handleEditorOpened(idx)}
                  onDelete={() => remove(idx)}
                />
              </Flex>
            ))
          ) : (
            <Flex flexDir="row" justifyContent="space-between">
              <Flex flexDir="row" gap={2} alignItems="center">
                <FormLabel variant="secondary" m="0">
                  Media:
                </FormLabel>
                <Text fontStyle="italic">None</Text>
              </Flex>
              <Button
                fontSize="xs"
                variant="link"
                color={colors.bento.bright}
                onClick={() => {
                  const defaultMediaType = MediaType.image;
                  push(getDefaultMediaReference(defaultMediaType));
                  setMediaPositionDefaults({ newMediaType: defaultMediaType });
                  handleEditorOpened(-1);
                }}
              >
                Add media
              </Button>
            </Flex>
          )
        }
      />
      {/* Renders the media editor only when there is  */}
      {selectedMediaReference && (
        <MediaEditorModal
          mediaReference={selectedMediaReference}
          formFactor={formFactor}
          formKey={`${formKey}.mediaReferences[${selectedMediaIndex}]`}
          numberAttributeOptions={attributeOptions.number}
          isOpen={isEditing}
          onDismiss={handleEditorDismissed}
          onSubmit={handleEditorConfirmed}
        />
      )}
    </Box>
  );
};

export default SelectedStepMedia;
