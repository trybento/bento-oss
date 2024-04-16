import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  ButtonGroup,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalFooter,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import Search from '@mui/icons-material/Search';

import { QATool } from 'bento-common/types';

import Tooltip from 'system/Tooltip';
import * as QARequestMutation from 'mutations/QARequest';
import ModalBody from 'system/ModalBody';
import Box from 'system/Box';
import useToast from 'hooks/useToast';
import colors from 'helpers/colors';
import TextField from 'components/common/InputFields/TextField';

interface FeatureFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FlagInfo = {
  name: string;
  enabledForAll: boolean;
  enabled: boolean;
};

export default function FeatureFlagModal({
  isOpen,
  onClose,
}: FeatureFlagModalProps) {
  const toast = useToast();
  const [flags, setFlags] = useState<FlagInfo[]>([]);
  const [filter, setFilter] = useState<string>(null);

  const getFfs = useCallback(async () => {
    const res = await QARequestMutation.commit({
      request: QATool.getFFs,
    });

    if (res.qaRequest.jsonString)
      setFlags(JSON.parse(res.qaRequest.jsonString).ffs);
  }, []);

  useEffect(() => {
    if (isOpen) void getFfs();
  }, [isOpen]);

  const filteredFlags = useMemo(
    () =>
      !filter
        ? flags
        : flags.filter((flag) =>
            flag.name.toLowerCase().includes(filter.toLowerCase().trim())
          ),
    [filter, flags]
  );

  const setFfFactory = useCallback(
    (name: string, currState: boolean) => async () => {
      const res = await QARequestMutation.commit({
        request: QATool.setFF,
        param: name,
        paramTwo: currState ? 'false' : 'true',
      });

      if (res.qaRequest.errors.length) {
        toast({
          title: res.qaRequest.errors[0],
          status: 'error',
        });
      }

      toast({
        title: res.qaRequest.result,
        status: 'success',
      });

      void getFfs();
    },
    []
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage feature flags</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack h="full" w="full" justifyContent="start">
            <TextField
              mt="22px"
              w="xs"
              px="0.5"
              onChange={setFilter}
              label=""
              fontSize="sm"
              defaultValue={filter}
              placeholder="Search feature flags"
              helperTextProps={{
                fontSize: 'xs',
              }}
              inputLeftElement={<Search style={{ width: '18px' }} />}
            />
            <VStack h="full" w="full" maxH="50vh" overflow="auto">
              {filteredFlags.map((flag) => (
                <HStack
                  key={flag.name}
                  w="80%"
                  onClick={
                    flag.enabledForAll
                      ? null
                      : setFfFactory(flag.name, flag.enabled)
                  }
                  display="flex"
                >
                  <Tooltip
                    label={
                      flag.enabledForAll
                        ? 'Enabled for all, cannot toggle'
                        : 'Click to toggle'
                    }
                    placement="left"
                  >
                    <Box
                      opacity={flag.enabledForAll ? 0.5 : 1}
                      cursor={flag.enabledForAll ? 'not-allowed' : 'pointer'}
                      fontWeight="semibold"
                      w="60%"
                    >
                      {flag.name}
                    </Box>
                  </Tooltip>
                  <Box
                    color={
                      flag.enabled || flag.enabledForAll
                        ? colors.success.bright
                        : colors.warning.bright
                    }
                  >
                    {flag.enabled || flag.enabledForAll
                      ? 'Enabled'
                      : 'Disabled'}
                  </Box>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
