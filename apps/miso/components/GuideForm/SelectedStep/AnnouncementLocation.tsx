import React, { useCallback, useMemo } from 'react';
import { Flex, FormLabel, Box, Button } from '@chakra-ui/react';
import { useFormikContext, Formik } from 'formik';

import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';

import { Highlight } from 'components/common/Highlight';
import useToggleState from 'hooks/useToggleState';
import AnnouncementLocationForm from 'components/Templates/Tabs/AnnouncementLocationForm';
import { useTemplate } from 'providers/TemplateProvider';
import { TemplateFormValues } from 'components/Templates/Template';
import { GuidePageTargetingType } from 'bento-common/types';
import Modal from 'components/layout/Modal';

type CProps = {
  disabled?: boolean;
};

type Props = CProps & {
  initialValues: TemplateFormValues;
};

function AnnouncementLocation({ disabled, initialValues }: Props) {
  const { template } = useTemplate();
  const { values, resetForm, submitForm, dirty } =
    useFormikContext<TemplateFormValues>();
  const toggleState = useToggleState(['modal']);
  const targeted =
    initialValues.templateData?.pageTargetingType ===
    GuidePageTargetingType.specificPage;

  const onCancel = useCallback(() => {
    toggleState.modal.off();
    resetForm();
  }, []);

  const onSubmit = useCallback(() => {
    submitForm();
    toggleState.modal.off();
  }, []);

  const displayUrl = useMemo(
    () =>
      targeted
        ? wildcardUrlToDisplayUrl(
            initialValues.templateData?.pageTargetingUrl ?? ''
          )
        : 'User is on any page',
    [initialValues.templateData?.pageTargetingUrl, targeted]
  );

  const modifiedTemplateData = useMemo(
    () => ({
      ...template,
      pageTargetingUrl: initialValues.templateData?.pageTargetingUrl,
      pageTargetingType: initialValues.templateData?.pageTargetingType,
    }),
    [template, initialValues]
  );

  const isGuideBaseForm = !template;

  if (isGuideBaseForm) return null;

  return (
    <Flex
      flexDir="column"
      gap="2"
      pointerEvents={disabled ? 'none' : undefined}
    >
      <Flex gap="2">
        <FormLabel variant="secondary" my="auto" mr="0">
          Location:
        </FormLabel>
        <Flex gap="2" overflow="hidden">
          <Highlight fontSize="xs" isTruncated>
            {displayUrl}
          </Highlight>
        </Flex>
        <Box ml="auto">
          <Button
            fontSize="xs"
            variant="link"
            onClick={toggleState.modal.on}
            isDisabled={disabled}
          >
            Edit location
          </Button>
        </Box>
      </Flex>

      <Modal
        title="Edit location"
        isOpen={toggleState.modal.isOn}
        onClose={onCancel}
        size="xl"
        ctas={[
          {
            label: 'Cancel',
            variant: 'secondary',
            onClick: onCancel,
          },
          {
            label: 'Done',
            onClick: onSubmit,
            isDisabled: !dirty,
          },
        ]}
      >
        <AnnouncementLocationForm
          template={modifiedTemplateData}
          currentValues={values}
        />
      </Modal>
    </Flex>
  );
}

/**
 * Compact form to modify location
 *
 * Intended to be displayed with the content tab in an editor.
 */
export default function AnnouncementLocationContainer(props: CProps) {
  const { values, setFieldValue } = useFormikContext<TemplateFormValues>();

  const onSubmit = useCallback((val: TemplateFormValues) => {
    setFieldValue(
      'templateData.pageTargetingType',
      val.templateData.pageTargetingType
    );
    setFieldValue(
      'templateData.pageTargetingUrl',
      val.templateData.pageTargetingUrl
    );
  }, []);

  const initialValues = useMemo(() => values, [values]);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSubmit}
    >
      <AnnouncementLocation initialValues={initialValues} {...props} />
    </Formik>
  );
}
