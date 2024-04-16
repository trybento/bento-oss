import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  Spinner,
  Box,
  VStack,
  Text,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ModalBody from 'system/ModalBody';
import { format, utcToZonedTime } from 'date-fns-tz';
import loadable from '@loadable/component';
const ReactJson = loadable(() => import('react-json-view'));
import IntegrationInstructionsOutlinedIcon from '@mui/icons-material/IntegrationInstructionsOutlined';

import { getLocalTz } from 'utils/constants';
import Button from 'system/Button';
import useToast from 'hooks/useToast';
import EventDetailsQuery from 'queries/EventDetailsQuery';
import { EventDetailsQuery as EventDetailsQueryType } from 'relay-types/EventDetailsQuery.graphql';
import { copyToClipboard } from 'utils/helpers';
import H5 from 'system/H5';
import DataDisplayBox from 'system/DataDisplayBox';

interface EventDetailsModalProps {
  eventEntityId?: string;
  onClose: () => void;
}

export default function EventDetailsModal({
  eventEntityId,
  onClose,
}: EventDetailsModalProps) {
  const toast = useToast();

  const [eventDetails, setEventDetails] =
    useState<EventDetailsQueryType['response']['customApiEvent']>(null);

  const getEventDetails = useCallback(async () => {
    const res = await EventDetailsQuery({
      customApiEventEntityId: eventEntityId,
    });
    if (res) setEventDetails(res.customApiEvent);
  }, [eventEntityId]);

  useEffect(() => {
    if (eventEntityId) getEventDetails();
    else setEventDetails(null);
  }, [eventEntityId]);

  const copyPayloadToClipboard = useCallback(() => {
    if (eventDetails.debugInformation.payload) {
      copyToClipboard(
        JSON.stringify(eventDetails.debugInformation.payload, null, 2)
      );

      toast({
        title: 'Payload copied!',
        isClosable: true,
        status: 'success',
      });
    }
  }, [eventDetails?.debugInformation?.payload]);

  const stepsCompletedString = useMemo(
    () =>
      (eventDetails?.debugInformation?.autoCompletedSteps || [])
        .map((s) => s.name)
        .join(','),
    [eventDetails?.debugInformation?.autoCompletedSteps]
  );

  const lastReceivedString = useMemo(() => {
    if (!eventDetails?.lastSeen) return '';

    const d = new Date(eventDetails.lastSeen as string);
    const convertedDate = utcToZonedTime(d, getLocalTz());
    return format(convertedDate, 'MMM dd, yyyy pp z');
  }, [eventDetails?.lastSeen]);

  return (
    <Modal isOpen={!!eventEntityId} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Event details</ModalHeader>
        <ModalCloseButton />
        <ModalBody pt="0">
          {!eventDetails ? (
            <Box w="full" py="4">
              <Spinner margin="auto" />
            </Box>
          ) : (
            <Box overflow="hidden" maxH="70vh">
              <VStack w="full" alignItems="flex-start" h="full" pb="4">
                <H5 mb="2" pt="0">
                  Metadata
                </H5>
                <Text fontWeight="bold">Time received</Text>
                <DataDisplayBox>{lastReceivedString}</DataDisplayBox>
                {!!eventDetails.debugInformation?.autoCompletedSteps
                  ?.length && (
                  <>
                    <Text fontWeight="bold">Autocompleted steps</Text>
                    <DataDisplayBox>{stepsCompletedString}</DataDisplayBox>
                  </>
                )}
                {!!eventDetails.debugInformation?.triggeredByAccountUser && (
                  <>
                    <Text fontWeight="bold">Associated user</Text>
                    <DataDisplayBox>{`${eventDetails.debugInformation.triggeredByAccountUser.fullName}, ${eventDetails.debugInformation.triggeredByAccountUser.account.name}`}</DataDisplayBox>
                  </>
                )}
                {!!eventDetails.debugInformation?.payload && (
                  <Box h="full" w="full">
                    <H5>Payload</H5>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={copyPayloadToClipboard}
                    >
                      <IntegrationInstructionsOutlinedIcon fontSize="small" />{' '}
                      <Text ml={1}>Copy to clipboard</Text>
                    </Button>
                    <Box
                      w="full"
                      borderRadius="4"
                      bgColor="gray.50"
                      p="2"
                      mt="2"
                      maxH="300px"
                      overflowY="scroll"
                    >
                      {/** @ts-ignore */}
                      <ReactJson
                        src={eventDetails.debugInformation.payload as object}
                        enableClipboard={false}
                        style={{
                          minWidth: '100%',
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </VStack>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
