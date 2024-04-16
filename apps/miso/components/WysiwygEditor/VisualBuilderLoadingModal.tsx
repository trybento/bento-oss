import {
  Flex,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import { noop } from 'bento-common/utils/functions';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { useMemo } from 'react';

export enum VisualBuilderLoadingModalState {
  Launching = 'launching',
  InProgress = 'in_progress',
  Closing = 'closing',
}

interface Props {
  state: VisualBuilderLoadingModalState;
}

const STATE_TITLE: Record<VisualBuilderLoadingModalState, string> = {
  [VisualBuilderLoadingModalState.Launching]: 'Launching Visual Builder',
  [VisualBuilderLoadingModalState.InProgress]:
    'Visual Builder session in progress',
  [VisualBuilderLoadingModalState.Closing]: 'Closing Visual Builder',
};

const STATE_DESCRIPTION: Record<
  VisualBuilderLoadingModalState,
  string | undefined
> = {
  [VisualBuilderLoadingModalState.Launching]:
    'The Visual Builder will launch in a new tab shortly.',
  [VisualBuilderLoadingModalState.InProgress]:
    'A Visual Builder session is currently in progress. Do not close this window.',
  [VisualBuilderLoadingModalState.Closing]: undefined,
};

export const VisualBuilderLoadingModal: React.FC<Props> = ({
  state,
}): JSX.Element => {
  const title = useMemo(() => STATE_TITLE[state], [state]);
  const description = useMemo(() => STATE_DESCRIPTION[state], [state]);

  return (
    <Modal isOpen onClose={noop} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody p="8">
          <Flex direction="column" gap="8">
            <BentoLoadingSpinner size={60} />
            <Flex direction="column" gap="4" alignItems="center">
              <Text fontSize="lg" fontWeight="bold">
                {title}
              </Text>
              {description && (
                <Text fontSize="sm" textAlign="center">
                  {description}
                </Text>
              )}
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VisualBuilderLoadingModal;
