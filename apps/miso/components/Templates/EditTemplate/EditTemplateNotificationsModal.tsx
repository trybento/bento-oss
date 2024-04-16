import React, { useCallback, useMemo } from 'react';
import { FormControl, Text, Switch, VStack, Box } from '@chakra-ui/react';
import { useFormikContext, Formik } from 'formik';

import Link from 'system/Link';
import { useTemplate } from 'providers/TemplateProvider';
import { TemplateFormValues } from '../Template';
import Modal, { ModalCta } from 'components/layout/Modal';
import HelperText from 'system/HelperText';
import useToast from 'hooks/useToast';

type CProps = {
  isOpen: boolean;
  onClose: () => void;
  disabled?: boolean;
};

function EditTemplateNotificationsModal({ isOpen, onClose, disabled }: CProps) {
  const {
    values: { notificationSettings },
    submitForm,
    setFieldValue,
    resetForm,
    dirty,
  } = useFormikContext<EditTemplateNotificationsForm>();

  const {
    template: { isCyoa, isSideQuest },
  } = useTemplate();

  const onCancel = useCallback(() => {
    resetForm();
    onClose();
  }, []);

  const handleEnableToggleChange = useCallback(
    (key: keyof EditTemplateNotificationsForm['notificationSettings']) =>
      () => {
        setFieldValue(
          `notificationSettings.${key}`,
          !notificationSettings?.[key]
        );
      },
    [notificationSettings]
  );

  const notificationsEnabled = !notificationSettings?.disable;
  const showDetailedOptions = !isSideQuest && !isCyoa;

  const modalCtas: ModalCta[] = useMemo(
    () => [
      { label: 'Cancel', onClick: onCancel, variant: 'secondary' },
      { label: 'Done', isDisabled: !dirty, onClick: submitForm },
    ],
    [dirty, submitForm, onCancel]
  );

  return (
    <Modal
      title="Configure notifications"
      isOpen={isOpen}
      onClose={onCancel}
      size="xl"
      ctas={modalCtas}
    >
      <HelperText mt="0">
        Bento can send notifications for users completing steps and completing
        the guide. You can enable this for{' '}
        <Link href="/settings/organization" isExternal color="blue.500">
          email
        </Link>
        .
      </HelperText>
      <FormControl maxW="xl" isDisabled={disabled} my="4">
        <Box>
          <Switch
            disabled={disabled}
            onChange={handleEnableToggleChange('disable')}
            isChecked={notificationsEnabled}
            mr="3"
          />
          Notify when user takes action
        </Box>
        {notificationsEnabled && showDetailedOptions && (
          <VStack
            mt="2"
            py="4"
            px="6"
            backgroundColor="gray.50"
            alignItems="start"
          >
            <Text fontWeight="semibold">Notifications by step type</Text>
            <Box>
              <Switch
                disabled={disabled}
                onChange={handleEnableToggleChange('branching')}
                isChecked={!notificationSettings?.branching}
                mr="3"
              />
              Branching
            </Box>
            <Box>
              <Switch
                disabled={disabled}
                onChange={handleEnableToggleChange('input')}
                isChecked={!notificationSettings?.input}
                mr="3"
              />
              Input
            </Box>
            <Box>
              <Switch
                disabled={disabled}
                onChange={handleEnableToggleChange('action')}
                isChecked={!notificationSettings?.action}
                mr="3"
              />
              Action
            </Box>
            <Box>
              <Switch
                disabled={disabled}
                onChange={handleEnableToggleChange('info')}
                isChecked={!notificationSettings?.info}
                mr="3"
              />
              Info
            </Box>
          </VStack>
        )}
      </FormControl>
    </Modal>
  );
}

type EditTemplateNotificationsForm = {
  notificationSettings: TemplateFormValues['templateData']['notificationSettings'];
};

export default function EditTemplateNotificationsModalContainer(props: CProps) {
  const {
    setFieldValue,
    values: { templateData },
  } = useFormikContext<TemplateFormValues>();

  const toast = useToast();

  const onSubmit = useCallback((values: EditTemplateNotificationsForm) => {
    setFieldValue(
      'templateData.notificationSettings',
      values.notificationSettings
    );

    toast({
      title: 'Save this guide for changes to take effect',
      status: 'info',
    });

    props.onClose();
  }, []);

  const initialValues = useMemo<EditTemplateNotificationsForm>(
    () => ({
      notificationSettings: templateData.notificationSettings,
    }),
    [templateData]
  );

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSubmit}
    >
      <EditTemplateNotificationsModal {...props} />
    </Formik>
  );
}
