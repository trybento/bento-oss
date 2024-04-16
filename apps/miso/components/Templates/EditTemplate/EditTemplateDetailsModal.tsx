import React, { useCallback, useMemo } from 'react';
import { FormControl, FormLabel, Text, VStack } from '@chakra-ui/react';
import { Field, FieldProps, useFormikContext, Formik } from 'formik';

import { useInternalGuideNames } from 'hooks/useFeatureFlag';
import { useTemplate } from 'providers/TemplateProvider';
import {
  GuideDesignType,
  GuideFormFactor,
  GuideState,
  GuideTypeEnum,
  Theme,
} from 'bento-common/types';
import { TemplateFormValues } from '../Template';
import Input from 'system/Input';
import Radio from 'system/Radio';
import Modal, { ModalCta } from 'components/layout/Modal';
import RadioGroup from 'system/RadioGroup';
import { TEMPLATE_SCOPE_OPTIONS } from 'components/Library/library.constants';
import { getGuideTypeString } from 'helpers';
import {
  isAnnouncementGuide,
  isInlineContextualGuide,
  isSidebarContextualGuide,
} from 'bento-common/utils/formFactor';
import { isOnboarding, isVideoGalleryTheme } from 'bento-common/data/helpers';
import Tooltip from 'system/Tooltip';
import { Highlight } from 'components/common/Highlight';
import { isDesignType, isFormFactor } from 'helpers/transformedHelpers';
import useToast from 'hooks/useToast';

type CProps = {
  isOpen: boolean;
  onClose: () => void;
  disabled?: boolean;
};

function EditTemplateDetailsModal({ isOpen, onClose, disabled }: CProps) {
  const enabledPrivateNames = useInternalGuideNames();

  const {
    values: { privateName, type, name },
    submitForm,
    resetForm,
    dirty,
  } = useFormikContext<EditTemplateDetailsForm>();

  const { template } = useTemplate();

  const onCancel = useCallback(() => {
    resetForm();
    onClose();
  }, []);

  const allowScopeChanges = template.state === GuideState.draft;

  /** If false, these are usually strictly user-scoped */
  const guideTypeSupportsScopeChanges =
    !isFormFactor.tooltip(template.formFactor) &&
    !isFormFactor.flow(template.formFactor) &&
    !isInlineContextualGuide(template.theme as Theme) &&
    !isDesignType.announcement(template.designType);

  const nameHelperText = useMemo(() => {
    /** @todo can we do this without all the casting? */
    const castTemplate = template as {
      formFactor: GuideFormFactor;
      theme: Theme;
      isSideQuest: boolean;
    };

    if (isFormFactor.modal(castTemplate.formFactor))
      return 'Only visible to end users in the Resource center';

    if (
      isOnboarding(template.designType as GuideDesignType) ||
      isSidebarContextualGuide(castTemplate) ||
      isVideoGalleryTheme(castTemplate.theme)
    )
      return 'Visible to end users';

    return 'Not visible to end users';
  }, [template, enabledPrivateNames]);

  const modalCtas: ModalCta[] = useMemo(
    () => [
      { label: 'Cancel', onClick: onCancel, variant: 'secondary' },
      { label: 'Done', isDisabled: !dirty, onClick: submitForm },
    ],
    [dirty, submitForm, onCancel]
  );

  return (
    <Modal
      title="Edit guide details"
      ctas={modalCtas}
      isOpen={isOpen}
      onClose={onCancel}
      size="xl"
    >
      <VStack alignItems="flex-start" gap="6" w="full" mb="6">
        <FormControl maxW="xl" isDisabled={disabled}>
          <FormLabel htmlFor="name">Guide title</FormLabel>
          <Field
            autoFocus={false}
            as={Input}
            type="text"
            name="name"
            value={name}
            id="name"
          />
          <Text fontSize="sm" color="gray.600" mt={2}>
            {nameHelperText}
          </Text>
        </FormControl>

        {enabledPrivateNames && (
          <FormControl maxW="xl" isDisabled={disabled}>
            <FormLabel htmlFor="privateName">Private name</FormLabel>
            <Field
              autoFocus={false}
              as={Input}
              type="text"
              name="privateName"
              value={privateName}
              id="privateName"
            />
            <Text fontSize="sm" color="gray.600" mt={2}>
              Not visible to end users
            </Text>
          </FormControl>
        )}

        <VStack alignItems="flex-start" w="full">
          <Field name="type">
            {({ field }: FieldProps) => (
              <FormControl position="relative">
                <FormLabel htmlFor={field.name}>Guide scope</FormLabel>
                {guideTypeSupportsScopeChanges ? (
                  <Tooltip
                    placement="top-start"
                    label={
                      allowScopeChanges
                        ? undefined
                        : 'Guide scope cannot be changed once a guide is live. To change scope, duplicate this guide and adjust before launching.'
                    }
                  >
                    <RadioGroup
                      defaultValue={field.value}
                      alignment="horizontal"
                      isDisabled={disabled || !allowScopeChanges}
                    >
                      {Object.keys(TEMPLATE_SCOPE_OPTIONS).map((option, i) => (
                        <Radio
                          key={`template-type-${i}`}
                          {...field}
                          value={option}
                          label={TEMPLATE_SCOPE_OPTIONS[option].label}
                        />
                      ))}
                    </RadioGroup>
                  </Tooltip>
                ) : (
                  <Highlight>
                    <Tooltip
                      placement="top-start"
                      label={
                        type === GuideTypeEnum.user
                          ? 'Guide is shown individually to each user, and tracks progress at a user level'
                          : undefined
                      }
                    >
                      <Text display="inline" color="gray.600">
                        {getGuideTypeString(type as GuideTypeEnum, '')}
                      </Text>
                    </Tooltip>
                  </Highlight>
                )}
                {guideTypeSupportsScopeChanges && (
                  <Text fontSize="sm" color="gray.600" mt={2}>
                    {TEMPLATE_SCOPE_OPTIONS[field.value]?.description}
                  </Text>
                )}
              </FormControl>
            )}
          </Field>
        </VStack>
      </VStack>
    </Modal>
  );
}

type EditTemplateDetailsForm = {
  type: GuideTypeEnum;
  privateName: string;
  name: string;
};

export default function EditTemplateDetailsModalContainer(props: CProps) {
  const {
    setFieldValue,
    values: { templateData },
  } = useFormikContext<TemplateFormValues>();

  const toast = useToast();

  const onSubmit = useCallback((values: EditTemplateDetailsForm) => {
    setFieldValue('templateData.type', values.type);
    setFieldValue('templateData.privateName', values.privateName);
    setFieldValue('templateData.name', values.name);

    toast({
      title: 'Save this guide for changes to take effect',
      status: 'info',
    });

    props.onClose();
  }, []);

  const initialValues = useMemo<EditTemplateDetailsForm>(
    () => ({
      type: templateData.type!,
      privateName: templateData.privateName,
      name: templateData.name,
    }),
    [templateData]
  );

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSubmit}
    >
      <EditTemplateDetailsModal {...props} />
    </Formik>
  );
}
