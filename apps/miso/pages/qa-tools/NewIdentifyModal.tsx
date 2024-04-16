import React, { useCallback, useMemo, useState } from 'react';
import {
  Button,
  ButtonGroup,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalFooter,
  VStack,
  Text,
  Textarea,
  Grid,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import loadable from '@loadable/component';
const ReactJson = loadable(() => import('react-json-view'));

import { validJson } from 'bento-common/utils/strings';
import { slugify } from 'bento-common/data/helpers';
import useToast from 'hooks/useToast';
import ModalBody from 'system/ModalBody';
import Box from 'system/Box';
import { useOrganization } from 'providers/LoggedInUserProvider';
import H5 from 'system/H5';
import Input from 'system/Input';
import { BentoSettings } from 'bento-common/types';
import useAccessToken from 'hooks/useAccessToken';
import { API_HOST } from 'helpers/constants';

interface NewIdentifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewIdentifyModal({
  isOpen,
  onClose,
}: NewIdentifyModalProps) {
  const toast = useToast();
  const {
    organization: { entityId: appId },
  } = useOrganization();
  const { accessToken } = useAccessToken();

  const [customAppId, setCustomAppId] = useState(appId);
  const [fullName, setFullName] = useState('');
  const [userAttrs, setUserAttrs] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountAttrs, setAccountAttrs] = useState('');

  const validUserAttrs = useMemo(() => validJson(userAttrs), [userAttrs]);
  const validAccountAttrs = useMemo(
    () => validJson(accountAttrs),
    [accountAttrs]
  );

  const inputHandlerFactory = useCallback(
    (setter: React.Dispatch<string>) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setter(e.target.value),
    []
  );
  const textAreaHandlerFactory = useCallback(
    (setter: React.Dispatch<string>) =>
      (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setter(e.target.value),
    []
  );

  const sendDisabled = false;

  const bentoSettings: BentoSettings = useMemo(() => {
    const accountSlug = slugify(accountName);
    const userSlug = slugify(fullName);
    const now = new Date().toISOString();

    return {
      appId: customAppId,
      account: {
        id: accountSlug,
        name: accountName,
        createdAt: now,
        ...(validAccountAttrs ? JSON.parse(accountAttrs) : {}),
      },
      accountUser: {
        id: userSlug,
        fullName: fullName,
        email: `${userSlug}@${accountSlug}.fake`,
        createdAt: now,
        ...(validUserAttrs ? JSON.parse(userAttrs) : {}),
      },
    };
  }, [
    accountName,
    fullName,
    validAccountAttrs,
    validUserAttrs,
    userAttrs,
    accountAttrs,
    customAppId,
  ]);

  const handleTest = useCallback(async () => {
    try {
      const status = await testIdentify(bentoSettings);
      toast({
        title: 'Sent: ' + status,
        status: 'success',
      });
    } catch (e) {
      toast({
        title: e.message || 'Something went wrong',
        status: 'error',
      });
    }
  }, [bentoSettings]);

  const handleRandomize = useCallback(async () => {
    if (!accessToken) return;

    const ran = await requestRandomness(accessToken);

    setFullName(ran.accountUserName);
    setAccountName(ran.accountName);
  }, [accessToken]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Identify custom account/user</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack alignItems="flex-start">
            <Text>
              Perform a random identify as some account/user to test launches
              and such. Custom attributes appended only if valid JSON provided.
            </Text>
            <Grid w="full" gridTemplateColumns="1fr 1fr" gridGap="4">
              <VStack alignItems="flex-start">
                <H5>Account name</H5>
                <Input
                  value={accountName}
                  onChange={inputHandlerFactory(setAccountName)}
                />
                <H5>Account attributes</H5>
                <Textarea
                  value={accountAttrs}
                  onChange={textAreaHandlerFactory(setAccountAttrs)}
                />
              </VStack>
              <VStack alignItems="flex-start">
                <H5>Account user name</H5>
                <Input
                  value={fullName}
                  onChange={inputHandlerFactory(setFullName)}
                />
                <H5>Account user attributes</H5>
                <Textarea
                  value={userAttrs}
                  onChange={textAreaHandlerFactory(setUserAttrs)}
                />
              </VStack>
              <Box>
                <H5>App ID</H5>
                <Input
                  value={customAppId}
                  onChange={inputHandlerFactory(setCustomAppId)}
                />
              </Box>
            </Grid>
            <Box py="4">
              <Button variant="secondary" onClick={handleRandomize}>
                Randomize
              </Button>
            </Box>
            <H5>Bento settings preview</H5>
            <Box maxH="50vh" overflowY="auto" mt="2">
              <ReactJson
                src={bentoSettings}
                enableClipboard={false}
                style={{
                  minWidth: '100%',
                }}
              />
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button isDisabled={sendDisabled} onClick={handleTest}>
              Test
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const testIdentify = async (bentoSettings: BentoSettings) => {
  if (!bentoSettings) throw new Error('No bentoSettings');
  const res = await fetch(`${API_HOST}/embed/identify`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bentoSettings),
  });

  return `${res.status} ${res.statusText || ''}`;
};

const requestRandomness = async (
  accessToken: string
): Promise<{ accountUserName: string; accountName: string }> => {
  const res = await fetch(`${API_HOST}/internal/random-user-util`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await res.json();
};
