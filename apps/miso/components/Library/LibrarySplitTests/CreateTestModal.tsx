import React, { useCallback, useMemo } from 'react';
import { Formik, useFormikContext } from 'formik';
import {
  HStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Flex,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import useToast from 'hooks/useToast';
import ModalBody from 'system/ModalBody';
import Box from 'system/Box';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import Button from 'system/Button';
import {
  ExtendedSelectOptions,
  OptionWithSubLabel,
  SelectOptions,
  SingleValueWithIcon,
} from 'system/Select';
import SelectField from 'components/common/InputFields/SelectField';
import TextField from 'components/common/InputFields/TextField';
import AllTemplatesProvider, {
  useAllTemplates,
} from 'providers/AllTemplatesProvider';
import { GuideState, SplitTestState } from 'bento-common/types';
import * as CreateSplitTestTemplateMutation from 'mutations/CreateSplitTestTemplate';
import PopoverTip from 'system/PopoverTip';
import {
  guideComponentIcon,
  guideComponentLabel,
} from 'helpers/presentational';
import { guidePrivateOrPublicNameOrFallback } from 'bento-common/utils/naming';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';
import { GuideShape } from 'bento-common/types/globalShoyuState';

export interface CreateTestFormValues {
  name: string;
  targetOneTemplate: string;
  targetTwoTemplate: string;
}

interface CreateTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (entityId: string | undefined) => void;
}

const tipMessage =
  'Only draft guides can be part of a split test. To test an active guide, make a duplicate of it.';

const CreateTestModalBody: React.FC<{}> = () => {
  const { values, handleSubmit, isValid } =
    useFormikContext<CreateTestFormValues>();

  const { templates } = useAllTemplates();
  const enabledInternalNames = useInternalGuideNames();

  const { targetOneOptions, targetTwoOptions } = useMemo(() => {
    const targetOneOptions: SelectOptions[] = [];
    const targetTwoOptions: SelectOptions[] = [];

    (
      [
        // Empty option.
        { name: 'No guide', entityId: null },
        ...(templates || []),
      ] as typeof templates
    ).forEach((t) => {
      const isEmptyOption = t.entityId === null;
      const allow =
        isEmptyOption ||
        (t.state === GuideState.draft &&
          t.isTargetedForSplitTesting === SplitTestState.none);

      if (!allow) return;

      const IconElement = isEmptyOption
        ? DoNotDisturbAltIcon
        : guideComponentIcon(t as GuideShape);

      const option: ExtendedSelectOptions = {
        Icon: <IconElement />,
        alt: isEmptyOption ? t.name : guideComponentLabel(t as GuideShape),
        label: guidePrivateOrPublicNameOrFallback(enabledInternalNames, t),
        value: t.entityId,
        ...(!isEmptyOption && {
          extra: {
            title: 'Open in new window',
            icon: OpenInNewIcon,
            callback: () =>
              window.open(`/library/templates/${t.entityId}`, '_blank'),
          },
        }),
      };
      if (t.entityId !== values.targetOneTemplate)
        targetOneOptions.push(option);
      if (t.entityId !== values.targetTwoTemplate)
        targetTwoOptions.push(option);
    });

    return {
      targetOneOptions,
      targetTwoOptions,
    };
  }, [templates, values, enabledInternalNames]);

  const handleOnSubmit = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <ModalContent>
      <ModalHeader>Create new split test</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Flex direction="column" gap="6">
          <TextField
            name="name"
            label="Name"
            defaultValue={values.name}
            fontSize="sm"
          />
          <SelectField
            label={
              <>
                Control guide
                <PopoverTip>{tipMessage}</PopoverTip>
              </>
            }
            name="targetOneTemplate"
            defaultValue={values.targetOneTemplate}
            options={targetTwoOptions}
            components={{
              Option: OptionWithSubLabel(),
              SingleValue: SingleValueWithIcon(),
            }}
            isSearchable
          />
          <SelectField
            label={
              <>
                Guide to test against control
                <PopoverTip>{tipMessage}</PopoverTip>
              </>
            }
            name="targetTwoTemplate"
            defaultValue={values.targetTwoTemplate}
            options={targetOneOptions}
            components={{
              Option: OptionWithSubLabel(),
              SingleValue: SingleValueWithIcon(),
            }}
            isSearchable
          />
        </Flex>
      </ModalBody>
      <ModalFooter>
        <HStack display="flex" justifyContent="flex-end">
          <Box>
            <Button onClick={handleOnSubmit} isDisabled={!isValid}>
              Create
            </Button>
          </Box>
        </HStack>
      </ModalFooter>
    </ModalContent>
  );
};

const CreateTestModal: React.FC<CreateTestModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const toast = useToast();
  const validate = useCallback((values: CreateTestFormValues) => {
    const errors: Record<string, string> = {};
    (
      [
        'name',
        'targetOneTemplate',
        'targetTwoTemplate',
      ] as (keyof CreateTestFormValues)[]
    ).forEach((key) => {
      if (!values[key] && values[key] !== null)
        errors[key] = 'This field is required';
    });
    return errors;
  }, []);

  const handleSubmit = useCallback(
    async (values: CreateTestFormValues) => {
      const { name, targetOneTemplate, targetTwoTemplate } = values;

      try {
        const response = await CreateSplitTestTemplateMutation.commit({
          templateData: {
            name,
            targetTemplates: [targetOneTemplate, targetTwoTemplate],
          },
        });

        toast({
          title: 'Split test created!',
          isClosable: true,
          status: 'success',
        });
        onCreate?.(response?.createSplitTestTemplate?.template?.entityId);
      } catch (e) {
        toast({
          title: e.message || 'Something went wrong',
          isClosable: true,
          status: 'error',
        });
        onCreate?.(undefined);
      }
    },
    [onCreate]
  );

  const initialValues = useMemo(() => {
    return {
      name: '',
      targetOneTemplate: undefined,
      targetTwoTemplate: undefined,
    };
  }, []);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onEsc={onClose}
      onClose={onClose}
      size="lg"
      scrollBehavior="outside"
    >
      <ModalOverlay />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={validate}
        enableReinitialize
        validateOnMount
        validateOnChange
      >
        <AllTemplatesProvider>
          <CreateTestModalBody />
        </AllTemplatesProvider>
      </Formik>
    </Modal>
  );
};

export default CreateTestModal;
