import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  HStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Text,
  Button,
  VStack,
  Box,
} from '@chakra-ui/react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { GroupTargeting } from 'bento-common/types/targeting';
import ModalBody from 'system/ModalBody';
import { Modal } from 'bento-common/components/Modal';
import { AudienceQuery$data } from 'relay-types/AudienceQuery.graphql';
import * as TestAutolaunchRulesMutation from 'mutations/TestAutolaunchRules';
import { sanitizeTargeting } from 'components/EditorCommon/targeting.helpers';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { pluralize } from 'bento-common/utils/pluralize';
import OptionGroupBox from 'system/OptionGroupBox';
import { guideComponentIcon } from 'helpers/presentational';
import { GuideShape } from 'bento-common/types/globalShoyuState';

type AudienceTemplate = AudienceQuery$data['audience']['templates'][number];

export enum AudienceModalVariant {
  edit,
  create,
}

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onSave: () => void;
  targets: GroupTargeting;
  affectedTemplates: AudienceTemplate[];
  variant?: AudienceModalVariant;
};

export default function EditAudienceConfirmModal({
  isOpen,
  onCancel,
  onSave,
  targets,
  affectedTemplates,
  variant = AudienceModalVariant.edit,
}: Props) {
  const [audienceSize, setAudienceSize] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAudienceSize = useCallback(async () => {
    try {
      setLoading(true);

      const res = await TestAutolaunchRulesMutation.commit({
        targets: sanitizeTargeting(targets, false),
      });

      setAudienceSize(res.testAutolaunchRules.accountUsers ?? 0);
    } catch (e) {
      console.error('Error loading audience count', e);
    } finally {
      setLoading(false);
    }
  }, [targets]);

  useEffect(() => {
    if (isOpen) getAudienceSize();
  }, [isOpen]);

  const enrichedTemplateList = useMemo(
    () =>
      affectedTemplates.map((t) => ({
        ...t,
        icon: guideComponentIcon(t as GuideShape),
      })),
    [affectedTemplates]
  );

  const handleOpenTemplate = useCallback(
    (templateEntityId: string) => () => {
      window.open(`/library/templates/${templateEntityId}`, '_blank');
    },
    []
  );

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {variant === AudienceModalVariant.edit
            ? 'Update saved audience'
            : 'Create saved audience'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <BentoLoadingSpinner />
          ) : (
            <VStack alignItems="flex-start">
              <Text>
                <b>{audienceSize}</b>{' '}
                {pluralize(audienceSize, 'person', 'people')} currently{' '}
                {pluralize(audienceSize, 'meets', 'meet')} these targeting rules
              </Text>
              {affectedTemplates.length > 0 && (
                <Box w="full">
                  <Text mb="2">
                    Updating this audience will immediately impact{' '}
                    {pluralize(affectedTemplates.length, 'this', 'these')}{' '}
                    <b>
                      {affectedTemplates.length} live{' '}
                      {pluralize(affectedTemplates.length, 'guide')}
                    </b>
                    :
                  </Text>
                  <OptionGroupBox w="full">
                    {enrichedTemplateList.map((t) => (
                      <HStack
                        justifyContent="space-between"
                        p="3"
                        background="white"
                      >
                        <HStack>
                          <t.icon style={{ fontSize: '16px' }} />
                          <Text>{t.privateName}</Text>
                        </HStack>
                        <Box
                          cursor="pointer"
                          onClick={handleOpenTemplate(t.entityId)}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </Box>
                      </HStack>
                    ))}
                  </OptionGroupBox>
                </Box>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent="flex-end">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button isDisabled={loading} onClick={onSave}>
              {variant === AudienceModalVariant.edit ? 'Update' : 'Create'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
