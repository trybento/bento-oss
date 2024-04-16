import React, { useCallback, useEffect, useState } from 'react';
import {
  HStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ModalBody from 'system/ModalBody';
import Box from 'system/Box';
import Button from 'system/Button';

import GuideBaseResetQuery from './GuideBaseResetQuery';
import { BentoLoadingSpinner } from 'components/TableRenderer';

type Props = {
  accountEntityId: string;
  isOpen?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ResetGuideBasesModal({
  accountEntityId,
  isOpen,
  onConfirm,
  onClose,
}: Props) {
  const [hasGuides, setHasGuides] = useState<boolean>(null);

  const getCounts = useCallback(async () => {
    const response = await GuideBaseResetQuery(accountEntityId);
    setHasGuides(!!response?.account?.hasGuides);
  }, [accountEntityId]);

  useEffect(() => {
    isOpen ? getCounts() : setHasGuides(null);
  }, [isOpen]);

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reset guide progress</ModalHeader>
        <ModalCloseButton />
        <ModalBody pt="0">
          {hasGuides === null ? (
            <Box>
              <Box mb="4">
                Checking to see if you're eligible to reset guides
              </Box>
              <BentoLoadingSpinner />
            </Box>
          ) : hasGuides ? (
            <Box>
              All progress on existing guides will be reset. Users will have
              access to the guides and start from scratch. Stats on this table
              may take ~1 hour to reset.
            </Box>
          ) : !hasGuides ? (
            <Box>There are no guides to reset.</Box>
          ) : (
            <Box>
              There are too many guides to reset. You'll need to delete and
              relaunch each guide individually
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <HStack display="flex" justifyContent="flex-end">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            {hasGuides && (
              <Box>
                <Button onClick={onConfirm}>Reset</Button>
              </Box>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
