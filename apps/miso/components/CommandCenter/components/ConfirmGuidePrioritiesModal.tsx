import React, { useMemo } from 'react';
import {
  HStack,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  Tag,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ArrowDownward from '@mui/icons-material/ArrowDownward';

import ModalBody from 'system/ModalBody';
import Box from 'system/Box';
import Button from 'system/Button';
import Tooltip from 'system/Tooltip';

import { AutoLaunchableTarget } from 'components/EditorCommon/targeting.helpers';
import colors from 'helpers/colors';
import {
  computeRankChanges,
  ExtendedAutoLaunchableTarget,
} from './guidePriority.helpers';

type ConfirmGuidePrioritiesModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  originalRanking: AutoLaunchableTarget[];
  newRanking: AutoLaunchableTarget[];
};

type PriorityChangeDisplayProps = {
  target: ExtendedAutoLaunchableTarget;
};

function PriorityChangeDisplay({ target }: PriorityChangeDisplayProps) {
  const { Icon } = target;
  const movedUp = target.currentRank < target.previousRank;
  return (
    <HStack gap="2" w="full" overflowX="hidden">
      <Tooltip label={`Previously priority: ${target.previousRank + 1}`}>
        <Tag
          key={`tag-${target.entityId}`}
          colorScheme="gray"
          borderRadius="full"
          size="sm"
          minW="50px"
        >
          <Text mr="2" fontWeight="bold">
            {target.currentRank + 1}
          </Text>
          <ArrowDownward
            style={{
              width: '18px',
              color: movedUp ? colors.success.bright : colors.warning.bright,
              transform: `rotate(${movedUp ? '180' : '0'}deg)`,
            }}
          />
        </Tag>
      </Tooltip>
      {Icon && <Icon fontSize="small" role="presentation" />}
      <Text whiteSpace="nowrap" textOverflow="ellipsis" overflowX="hidden">
        {target.name}
      </Text>
    </HStack>
  );
}

export default function ConfirmGuidePrioritiesModal({
  isOpen,
  onConfirm,
  onClose,
  originalRanking,
  newRanking,
}: ConfirmGuidePrioritiesModalProps) {
  /**
   * Append previous and current rankings to data
   */
  const rankingChangeList = useMemo(() => {
    /* Punt calculations if modal isn't open */
    if (!isOpen) return [];

    return computeRankChanges({
      originalRanking,
      newRanking,
    });
  }, [originalRanking, newRanking, isOpen]);

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose} autoFocus={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm changes to guide priority</ModalHeader>
        <ModalCloseButton />
        <ModalBody pt="0">
          <VStack alignItems="flex-start">
            <Text fontWeight="semibold">Changed priorities:</Text>
            <VStack
              alignItems="flex-start"
              overflowY="auto"
              maxH="260px"
              border={`1px solid ${colors.gray[200]}`}
              borderRadius="sm"
              w="full"
              padding="2"
              spacing={3}
            >
              {rankingChangeList.map((target) => (
                <PriorityChangeDisplay key={target.entityId} target={target} />
              ))}
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack display="flex" justifyContent="flex-end">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Box>
              <Button onClick={onConfirm}>Apply changes</Button>
            </Box>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
