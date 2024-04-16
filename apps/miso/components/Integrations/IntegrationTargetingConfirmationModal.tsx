import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  HStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import { turnEverythingIntoValue } from 'bento-common/utils/targeting';
import ModalBody from 'system/ModalBody';
import Box from 'system/Box';
import Button from 'system/Button';
import { TestAutolaunchRulesMutation as TestAutolaunchRulesMutationType } from 'relay-types/TestAutolaunchRulesMutation.graphql';
import {
  AutolaunchContext,
  getAutoLaunchMutationArgs,
  testAutolaunchRules,
} from 'components/GuideAutoLaunchModal/Template/autolaunch.helpers';
import { pluralize } from 'bento-common/utils/pluralize';
import AudienceRulesDisplay from 'components/Templates/AudienceRulesDisplay';

type Props = {
  title: string;
  label?: React.ReactNode;
  autolaunchContext: AutolaunchContext;
  isOpen?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function IntegrationTargetingConfirmationModal({
  title,
  label,
  autolaunchContext,
  isOpen,
  onConfirm,
  onClose,
}: Props) {
  const { templateEntityId } = autolaunchContext;

  const [autoLaunchStats, setAutoLaunchStats] = useState<
    TestAutolaunchRulesMutationType['response']['testAutolaunchRules'] | null
  >(null);
  const count = autoLaunchStats?.accountUsers || 0;

  const autoLaunchRules = useMemo(() => {
    if (!isOpen) return undefined;
    const unmapped = getAutoLaunchMutationArgs(autolaunchContext);

    return {
      autoLaunchRules: unmapped?.autoLaunchRules?.map((original) => ({
        ...original,
        rules: original.rules?.map((rule) => turnEverythingIntoValue(rule)),
      })),
      targets: unmapped?.targets?.map((original) => ({
        ...original,
        rules: original.rules?.map((rule) => turnEverythingIntoValue(rule)),
      })),
    };
  }, [autolaunchContext, isOpen]);

  const getAutoLaunchStats = useCallback(async () => {
    if (!isOpen) return;

    const response = await testAutolaunchRules(autolaunchContext);
    setAutoLaunchStats(response);
  }, [templateEntityId, autolaunchContext, isOpen]);

  useEffect(() => {
    if (isOpen) {
      getAutoLaunchStats();
    } else {
      setAutoLaunchStats(null);
    }
  }, [isOpen]);

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pt="0">
          <Box>
            <Text>
              {label}{' '}
              <Box display="inline" fontWeight="semibold">
                {count}
              </Box>{' '}
              {pluralize(count, 'person', 'people')} currently{' '}
              {pluralize(count, 'meets', 'meet')} these targeting rules.
            </Text>
            <AudienceRulesDisplay
              label=""
              autoLaunchData={autoLaunchRules}
              mt="4"
              hideBlockedAccounts
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <HStack display="flex" justifyContent="flex-end">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Box>
              <Button onClick={onConfirm}>Save</Button>
            </Box>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
