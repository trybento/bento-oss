import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  HStack,
  ListItem,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ModalBody from 'system/ModalBody';
import Button from 'system/Button';
import Box from 'system/Box';
import { pluralize } from 'bento-common/utils/pluralize';
import AudienceRulesDisplay from '../AudienceGroupRulesDisplay';
import Link from 'system/Link';
import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';
import type { AutoLaunchStatsQuery as AutoLaunchStatsQueryType } from 'relay-types/AutoLaunchStatsQuery.graphql';
import AutoLaunchStatsQuery from '../AutoLaunchStatsQuery';
import { useGuideSchedulingThrottling } from 'hooks/useFeatureFlag';
import { roundToPSTHour } from 'bento-common/utils/dates';
import SimpleDateWithTimezoneTooltip from 'components/SimpleDateWithTimezoneTooltip';
import { GroupTargeting } from 'bento-common/types/targeting';

type LaunchScheduleConfirmationModalProps = {
  templateEntityId: string;
  isOpen: boolean;
  startTime: string | null;
  endTime: string | null;
  onTargetingClick: () => void;
  onConfirm: () => void;
  onClose: () => void;
};

const LaunchScheduleConfirmationModal: React.FC<
  LaunchScheduleConfirmationModalProps
> = ({
  templateEntityId,
  isOpen,
  startTime,
  endTime,
  onTargetingClick,
  onConfirm,
  onClose,
}) => {
  const [autoLaunchStats, setAutoLaunchStats] =
    useState<AutoLaunchStatsQueryType['response']['template']>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const throttlingEnabled = useGuideSchedulingThrottling();

  const getAutoLaunchStats = useCallback(async () => {
    try {
      const response = await AutoLaunchStatsQuery(templateEntityId);
      setAutoLaunchStats(response.template);
    } catch (err) {
      setQueryError(
        err.message || 'Something went wrong querying for launch statistics.'
      );
    }
  }, [templateEntityId]);

  useEffect(() => {
    if (isOpen) {
      void getAutoLaunchStats();
    } else {
      setAutoLaunchStats(null);
    }
  }, [isOpen, getAutoLaunchStats]);

  const start = useMemo(
    () =>
      startTime &&
      (throttlingEnabled
        ? roundToPSTHour(3, new Date(startTime))
        : new Date(startTime)),
    [startTime, throttlingEnabled]
  );
  const end = useMemo(() => endTime && new Date(endTime), [endTime]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule {startTime ? 'launch' : 'stop'}</ModalHeader>
        <ModalBody>
          {queryError && (
            <CalloutText calloutType={CalloutTypes.Error} my={4}>
              {queryError}
            </CalloutText>
          )}
          <Text>
            {start ? (
              <>
                You are scheduling this guide to launch on{' '}
                <SimpleDateWithTimezoneTooltip date={start} />
                {end && (
                  <>
                    {' '}
                    and to stop at <SimpleDateWithTimezoneTooltip date={end} />
                  </>
                )}
                .
              </>
            ) : (
              <>
                You are scheduling this guide to stop on{' '}
                <SimpleDateWithTimezoneTooltip date={end} />.
              </>
            )}
          </Text>
          {start ? (
            <>
              <Text mt="3">
                <Box display="inline" fontWeight="semibold">
                  {autoLaunchStats?.autoLaunchAudienceCount || 0}
                </Box>{' '}
                {pluralize(
                  autoLaunchStats?.autoLaunchAudienceCount || 0,
                  'person',
                  'people'
                )}{' '}
                currently{' '}
                {pluralize(
                  autoLaunchStats?.autoLaunchAudienceCount || 0,
                  'meets',
                  'meet'
                )}{' '}
                these targeting rules.
              </Text>
              {autoLaunchStats && (
                <AudienceRulesDisplay
                  targets={autoLaunchStats.targets as GroupTargeting}
                  mt="4"
                  compact
                />
              )}
              <Box mt="2">
                <Link
                  onClick={onTargetingClick}
                  color="blue.500"
                  fontSize="xs"
                  fontWeight="semibold"
                >
                  Change targeting rules in Targeting
                </Link>
              </Box>
              <CalloutText calloutType={CalloutTypes.Themeless} my={4}>
                Any people who meet these rules in the future will also receive
                this guide when they log into your app.
              </CalloutText>
            </>
          ) : (
            end && (
              <Box>
                <UnorderedList ml="6" mt="2">
                  <ListItem>
                    This will stop it from being launched to new users after the
                    selected time is reached.
                  </ListItem>
                  <ListItem>
                    Users that already have the guide will keep it.
                  </ListItem>
                </UnorderedList>
                <CalloutText mt={4} calloutType={CalloutTypes.Themeless}>
                  If you want to remove it for all users,{' '}
                  <Text display="inline" fontWeight="semibold">
                    delete
                  </Text>{' '}
                  the guide instead.
                </CalloutText>
              </Box>
            )
          )}
        </ModalBody>
        <ModalFooter>
          <HStack display="flex" justifyContent="flex-end">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Box>
              <Button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Confirm
              </Button>
            </Box>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LaunchScheduleConfirmationModal;
