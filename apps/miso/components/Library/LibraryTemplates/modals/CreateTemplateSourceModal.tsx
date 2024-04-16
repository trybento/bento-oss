import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Input,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import noop from 'lodash/noop';

import ModalBody from 'system/ModalBody';
import Text from 'system/Text';
import { DEFAULT_COLORS } from 'helpers/uiDefaults';
import TemplateLookupQuery from 'queries/TemplateLookupQuery';
import InfoCard from 'system/InfoCard';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (eId: string) => void;
};

export default function CreateTemplateSourceModal({
  isOpen,
  onClose,
  onCreate,
}: Props): JSX.Element {
  const [isDeleting, setDeleting] = useState(false);
  const [target, setTarget] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const isCreateDisabled = target.length !== 36;

  const findTemplate = useCallback(async () => {
    const res = await TemplateLookupQuery(target);

    if (res.findTemplate?.name)
      setInfo(
        `${res.findTemplate.organization.name} : ${res.findTemplate.name}`
      );
  }, [target]);

  useEffect(() => {
    if (!isCreateDisabled) void findTemplate();
    else setInfo(null);
  }, [isCreateDisabled]);

  useEffect(() => {
    if (!isOpen) setTarget('');
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={isDeleting ? noop : onClose}
      size="lg"
      id="confirm-delete"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new template source</ModalHeader>
        <ModalBody color={DEFAULT_COLORS.secondaryText}>
          <Text>
            This allows you to clone any template to the Bento Template org,
            which can then be used to seed templates to other orgs.
          </Text>
          <>
            <Text marginBottom="4" mt="4" color={DEFAULT_COLORS.primaryText}>
              Enter the entityId of the template you wish to create a source
              from
            </Text>
            <Input
              size="lg"
              value={target}
              onChange={(e: FormEvent<HTMLInputElement>) =>
                setTarget(e.currentTarget.value)
              }
            />
            {info && (
              <InfoCard my="4" w="full">
                <Text fontWeight="semibold">Targeted template:</Text>
                <Text>{info}</Text>
              </InfoCard>
            )}
          </>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button
              variant="secondary"
              isDisabled={isDeleting}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              isDisabled={isCreateDisabled || !target}
              isLoading={isDeleting}
              onClick={async () => {
                setDeleting(true);
                onCreate(target);
                onClose();
              }}
            >
              Confirm
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
