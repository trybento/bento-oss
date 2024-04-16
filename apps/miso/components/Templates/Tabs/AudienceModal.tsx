import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  HStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  FormLabel,
  Text,
} from '@chakra-ui/react';

import { Modal } from 'bento-common/components/Modal';
import { GroupTargeting } from 'bento-common/types/targeting';

import ModalBody from 'system/ModalBody';
import Box from 'system/Box';
import Button from 'system/Button';
import Input from 'system/Input';
import useToast from 'hooks/useToast';
import * as SaveNewAudienceMutation from 'mutations/SaveNewAudience';
import * as EditAudienceMutation from 'mutations/EditAudience';
import { SaveNewAudienceInput } from 'relay-types/SaveNewAudienceMutation.graphql';
import { useTargetingAudiencesContext } from 'components/EditorCommon/Audiences/TargetingAudiencesProvider';
import { sanitizeTargeting } from 'components/EditorCommon/targeting.helpers';

type Props = {
  isOpen?: boolean;
  onClose: () => void;
  onSave?: (audienceEntityId: string) => void;
  initialName?: string;
  entityId?: string;
  targets?: GroupTargeting;
};

export default function AudienceModal({
  isOpen,
  onClose,
  onSave,
  initialName = '',
  entityId,
  targets,
}: Props) {
  /** Possibly undefined if it is outside Formik's context. */
  const [audienceName, setAudienceName] = useState(initialName);
  const autoFocusInput = useCallback((el) => el?.focus(), []);
  const toast = useToast();
  const { nameExists } = useTargetingAudiencesContext();

  const handleAudienceNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setAudienceName(e.target.value),
    []
  );

  const handleOnConfirm = useCallback(async () => {
    try {
      let audienceEntityId = entityId;
      if (audienceEntityId) {
        await EditAudienceMutation.commit({
          entityId,
          name: audienceName,
        });
      } else {
        const newAudience = await SaveNewAudienceMutation.commit({
          name: audienceName,
          targets: sanitizeTargeting(targets),
        } as SaveNewAudienceInput);

        audienceEntityId = newAudience?.saveNewAudience?.audience?.entityId;
      }

      onSave?.(audienceEntityId);

      toast({
        title: 'Audience saved!',
        isClosable: true,
        status: 'success',
      });
    } catch (e) {
      const _e: Error = Array.isArray(e) ? e[0] : e;
      if (_e.message.includes('limit')) {
        toast({
          title: 'Audience limit exceeded!',
          status: 'error',
        });
        return;
      }

      console.error('Error saving audience', e);

      toast({
        title: 'Something went wrong',
        isClosable: true,
        status: 'error',
      });
    } finally {
      onClose();
    }
  }, [audienceName, targets, onClose, onSave, entityId]);

  useEffect(() => {
    setAudienceName(initialName);
  }, [isOpen, initialName]);

  const errorText = useMemo(() => {
    if (nameExists(audienceName, entityId))
      return 'You already have a saved audience with this name';

    return null;
  }, [nameExists, audienceName, entityId]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !errorText) handleOnConfirm();
    },
    [handleOnConfirm, errorText]
  );

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {entityId ? 'Rename audience' : 'Save audience'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pt="0">
          <Box>
            <FormLabel as="legend" fontSize="sm">
              Audience name
            </FormLabel>
            <Input
              value={audienceName}
              onChange={handleAudienceNameChange}
              ref={autoFocusInput}
              onKeyDown={handleKeyDown}
              isInvalid={!!errorText}
              errorBorderColor="error.bright"
            />
            {errorText && (
              <Text
                pos="absolute"
                fontSize="xs"
                color="error.bright"
                fontWeight="normal"
              >
                {errorText}
              </Text>
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <HStack display="flex" justifyContent="flex-end">
            <Box>
              <Button
                isDisabled={!audienceName || !!errorText}
                onClick={handleOnConfirm}
              >
                Save
              </Button>
            </Box>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
