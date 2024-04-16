import React, { useCallback, useState } from 'react';
import {
  Button,
  ButtonGroup,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Link,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import loadable from '@loadable/component';
const ReactJson = loadable(() => import('react-json-view'));

import { QATool } from 'bento-common/types';
import ModalBody from 'system/ModalBody';
import Input from 'system/Input';
import Box from 'system/Box';
import * as QARequestMutation from 'mutations/QARequest';
import useToast from 'hooks/useToast';

interface LaunchingDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: QATool.availableGuides | QATool.launchDiagnostics;
  title: string;
}

export default function LaunchingDiagnosticsModal({
  isOpen,
  onClose,
  variant,
  title,
}: LaunchingDiagnosticsModalProps) {
  const [accountUserExternalId, setAccountUserExternalId] = useState<string>();
  const [data, setData] = useState<object>();
  const toast = useToast();

  const handleTest = useCallback(async () => {
    try {
      const res = await QARequestMutation.commit({
        request: variant,
        param: accountUserExternalId,
      });

      if (!res.qaRequest.jsonString)
        return toast({
          title: 'No data returned',
          status: 'error',
        });

      setData(JSON.parse(res.qaRequest.jsonString));
    } catch (e) {
      toast({
        title: e.message || 'Something went wrong',
        status: 'error',
      });
      setData(null);
    }
  }, [onClose, accountUserExternalId]);

  const handleAccountUserExternalIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setAccountUserExternalId(e.target.value),
    []
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <>
            Enter an external ID below and hit "Test". Use{' '}
            <Link
              href="/customers"
              target="_blank"
              color="bento.bright"
              as="span"
            >
              the customers page
            </Link>{' '}
            to find IDs.
            <Input
              value={accountUserExternalId}
              onChange={handleAccountUserExternalIdChange}
              placeholder="Enter account user external ID here"
              mt="2"
            />
          </>

          {data && (
            <Box maxH="60vh" overflowY="auto" mt="2">
              {/** @ts-ignore */}
              <ReactJson
                src={data}
                enableClipboard={false}
                style={{
                  minWidth: '100%',
                }}
              />
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              isDisabled={!accountUserExternalId?.length}
              onClick={handleTest}
            >
              Test
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
