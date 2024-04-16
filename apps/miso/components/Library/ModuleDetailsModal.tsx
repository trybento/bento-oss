import React, { useCallback, useEffect } from 'react';
import {
  HStack,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  useToast,
  ModalHeader,
  Flex,
  Link,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ModalBody from 'system/ModalBody';
import { capitalizeFirstLetter } from 'bento-common/utils/strings';

import Box from 'system/Box';
import Button from 'system/Button';
import Input from 'system/Input';
import Text from 'system/Text';

import * as CreateModuleMutation from 'mutations/CreateModule';
import * as EditModuleDetailsMutation from 'mutations/EditModuleDetails';
import { CreateModuleMutation as CreateModuleMutationType } from 'relay-types/CreateModuleMutation.graphql';
import { EditModuleDetailsTemplateInput } from 'relay-types/EditModuleDetailsMutation.graphql';
import { MODULE_ALIAS_SINGULAR } from 'helpers/constants';
import { getEmptyStep } from 'utils/getEmptyStep';
import { GuideFormFactor, Theme } from 'bento-common/types';
import PopoverTip from 'system/PopoverTip';

export interface EditedModuleDetails {
  entityId: string;
  name: string;
  displayTitle?: string;
  description?: string;
}

type CreatedModule =
  CreateModuleMutationType['response']['createModule']['module'];

interface ModuleDetailsModalProps {
  module?: EditedModuleDetails;
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (module: CreatedModule) => void;
  onUpdate?: (moduleData: EditModuleDetailsTemplateInput) => void;
  minimal?: boolean;
  theme: Theme | undefined;
  guideFormFactor: GuideFormFactor | undefined;
}

export default function ModuleDetailsModal({
  module,
  guideFormFactor,
  theme,
  isOpen,
  minimal,
  onClose,
  onCreate,
  onUpdate,
}: ModuleDetailsModalProps) {
  const isNewModule = !module;
  const autoFocusInput = useCallback((el) => el?.focus(), []);
  const [moduleName, setModuleName] = React.useState<string>(
    module?.name || ''
  );
  const [moduleDisplayTitle, setModuleDisplayTitle] = React.useState<string>(
    module?.displayTitle || ''
  );
  const [moduleDescription, setModuleDescription] = React.useState<string>(
    module?.description || ''
  );
  const toast = useToast();
  const isAddButtonDisabled = !moduleName && !moduleDescription;

  useEffect(() => {
    if (isOpen) {
      setModuleName(module?.name || '');
      setModuleDisplayTitle(module?.displayTitle || '');
      setModuleDescription;
    }
  }, [isOpen]);

  const handleAdd = useCallback(async () => {
    const moduleData = {
      ...(!isNewModule && { entityId: module.entityId }),
      name: moduleName,
      displayTitle: moduleDisplayTitle,
      description: moduleDescription,
      ...(isNewModule && {
        stepPrototypes: [
          getEmptyStep(guideFormFactor, theme, {
            name: 'Sample step',
            entityId: null,
          }),
        ],
      }),
    };

    if (isNewModule) {
      const result = await CreateModuleMutation.commit({
        // @ts-ignore
        moduleData,
      });

      const createdModule = result?.createModule?.module;
      if (createdModule) {
        onCreate && onCreate(createdModule);
      }
    } else {
      const result = await EditModuleDetailsMutation.commit({
        // @ts-ignore
        moduleData,
      });

      if (result) {
        // @ts-ignore
        onUpdate && onUpdate(moduleData);
        toast({
          title: `${capitalizeFirstLetter(
            MODULE_ALIAS_SINGULAR
          )} details updated!`,
          isClosable: true,
          status: 'success',
        });
      }
    }

    onClose && onClose();
  }, [
    module,
    moduleName,
    moduleDisplayTitle,
    moduleDescription,
    isNewModule,
    onCreate,
    onUpdate,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter' || isAddButtonDisabled || !minimal) return;
      handleAdd();
    },
    [isAddButtonDisabled, minimal, handleAdd]
  );

  const handleDisplayTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setModuleDisplayTitle(e.target.value);
      setModuleName(e.target.value);
    },
    []
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setModuleDescription(e.target.value);
    },
    []
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isNewModule
            ? `Add new ${MODULE_ALIAS_SINGULAR}`
            : `Edit ${MODULE_ALIAS_SINGULAR} details`}
        </ModalHeader>
        <ModalCloseButton top="4" right="4" />
        <ModalBody>
          <Flex flexDir="column" gap="4">
            {isNewModule && (
              <Flex flexDir="column" gap="2" color="gray.600">
                <Box>
                  Step groups are the groups of steps that make up guides.
                </Box>
                <Box>
                  🔄 They are reusable components; editing a step group in one
                  guide will apply changes everywhere else it’s used.
                </Box>
                <Link
                  href="https://help.trybento.co/en/articles/6123117-what-are-step-groups-aka-modules"
                  target="_blank"
                  color="bento.bright"
                  fontWeight="bold"
                >
                  Learn more
                </Link>
              </Flex>
            )}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={1}>
                {`${capitalizeFirstLetter(MODULE_ALIAS_SINGULAR)} name`}
                <PopoverTip placement="top">
                  Step group names are shown to users
                </PopoverTip>
              </Text>
              <Input
                value={moduleDisplayTitle}
                onChange={handleDisplayTitleChange}
                onKeyDown={handleKeyDown}
                ref={autoFocusInput}
              />
            </Box>
            {!minimal && (
              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>
                  Why should the user do this {MODULE_ALIAS_SINGULAR}?
                </Text>
                <Textarea
                  value={moduleDescription}
                  fontSize="sm"
                  onChange={handleDescriptionChange}
                />
              </Box>
            )}
          </Flex>
        </ModalBody>

        <ModalFooter>
          <HStack display="flex" justifyContent="flex-end">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Box>
              <Button isDisabled={isAddButtonDisabled} onClick={handleAdd}>
                {isNewModule ? 'Add' : 'Save'}
              </Button>
            </Box>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
