import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  HStack,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  Accordion,
  ModalHeader,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ModalBody from 'system/ModalBody';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Checkbox from 'system/Checkbox';
import Input from 'system/Input';
import Box from 'system/Box';
import Text from 'system/Text';
import Button from 'system/Button';
import useToast from 'hooks/useToast';

import * as CreateTemplateMutation from 'mutations/CreateTemplate';
import * as DuplicateTemplateMutation from 'mutations/DuplicateTemplate';

import { TemplateForm } from 'components/Templates/EditTemplate';
import { useOrganization } from 'providers/LoggedInUserProvider';
import {
  GuideDesignType,
  GuideFormFactor,
  GuideTypeEnum,
  Theme,
} from 'bento-common/types';
import {
  GuideScopeSelector,
  GuideThemeSelector,
} from './LibraryCreateModal/LibraryCreateModal';
import { duplicateName } from 'bento-common/data/helpers';
import { useUISettings } from 'queries/OrganizationUISettingsQuery';
import {
  CreateTemplateMutation as CreateTemplateMutationType,
  ThemeType,
} from 'relay-types/CreateTemplateMutation.graphql';
import Tooltip from 'system/Tooltip';
import {
  isSidebarEmbed,
  isSidebarInjectedAsInline,
  isFlowGuide,
} from 'bento-common/utils/formFactor';

type CreatedTemplate =
  CreateTemplateMutationType['response']['createTemplate']['template'];

type Props = {
  isOpen: boolean;
  template: TemplateForm | null;
  onDuplicate?: (newEntityId: string) => void;
  onCreate?: (template: CreatedTemplate) => void;
  onClose: () => void;
};

export default function CreateOrDuplicateTemplateModal({
  template,
  isOpen,
  onDuplicate,
  onCreate,
  onClose,
}: Props) {
  const toast = useToast();

  const uiSettings = useUISettings('store-or-network');

  const {
    organization: { name: orgName },
  } = useOrganization();
  const {
    name: originalName,
    privateName,
    type: guideType,
    theme,
    designType,
    entityId,
    isTemplate,
    formFactor,
    isCyoa,
  } = template || {};

  const {
    isDuplicating,
    modalTitle,
    submitBtnTitle,
    isOnboardingChecklist,
    isEverboardingGuide,
  } = useMemo(() => {
    const isDuplicating = !!entityId;
    return {
      isDuplicating,
      modalTitle: isDuplicating
        ? `Duplicate "${originalName}"`
        : 'Create new guide',
      submitBtnTitle: isDuplicating ? 'Duplicate guide' : 'Create',
      isOnboardingChecklist: designType === GuideDesignType.onboarding,
      isEverboardingGuide: designType === GuideDesignType.everboarding,
    };
  }, [entityId, originalName, designType]);

  const [newName, setNewName] = useState<string>(
    duplicateName(privateName || originalName)
  );
  const [selectedTheme, setSelectedTheme] = useState<Theme>(
    (theme as Theme) || Theme.flat
  );
  const defaultTemplateType = useMemo(
    () => (guideType || GuideTypeEnum.account) as GuideTypeEnum,
    [guideType]
  );
  const [selectedTemplateType, setSelectedTemplateType] =
    useState<null | GuideTypeEnum>(defaultTemplateType);

  const [duplicateStepGroups, setDuplicateStepGroups] = useState<boolean>(true);

  useEffect(() => {
    const defaultName = privateName || originalName;

    if (!newName && isDuplicating) setNewName(duplicateName(defaultName));
  }, [privateName, originalName]);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewName(e.target.value);
    },
    []
  );

  const handleScopeSelection = useCallback((value: GuideTypeEnum) => {
    setSelectedTemplateType(value);
  }, []);

  const handleThemeSelection = useCallback((value: Theme) => {
    setSelectedTheme(value);
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (isDuplicating) {
        const result = await DuplicateTemplateMutation.commit({
          entityId,
          theme: selectedTheme as ThemeType,
          type: selectedTemplateType,
          name: newName,
          duplicateStepGroups,
        });

        if (!result || !result.duplicateTemplate?.template) {
          throw new Error('Something went wrong');
        }

        const newEntityId = result.duplicateTemplate?.template?.entityId;
        newEntityId && onDuplicate?.(newEntityId);
      } else {
        const result = await CreateTemplateMutation.commit({
          templateData: {
            name: newName,
            privateName: newName,
            description: '',
            modules: [],
            theme: selectedTheme as ThemeType,
            type: selectedTemplateType,
          },
        });

        const createdTemplate = result?.createTemplate?.template;
        createdTemplate && onCreate?.(createdTemplate);
      }

      toast({
        title: isDuplicating
          ? `Template "${originalName}" duplicated!`
          : 'New template created!',
        isClosable: true,
        status: 'success',
      });
    } catch (err) {
      toast({
        title: err.message || 'Something went wrong',
        isClosable: true,
        status: 'error',
      });
    }
  }, [
    isDuplicating,
    newName,
    selectedTheme,
    selectedTemplateType,
    entityId,
    isTemplate,
    duplicateStepGroups,
  ]);

  const submitDisabled = useMemo(
    () => !selectedTemplateType,
    [selectedTemplateType]
  );

  const handleInputKeyUp = useCallback(
    (e) => {
      if (e.key === 'Enter' && !submitDisabled) {
        handleSubmit();
      }
    },
    [submitDisabled, handleSubmit]
  );

  const handleDuplicateStepGroupChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setDuplicateStepGroups(e.target.checked),
    []
  );

  /**
   * Determines if the user is allowed to change duplicate step
   * group settings while duplicating a template.
   *
   * @todo unify back/front-end logic in common
   */
  const shouldShowDuplicateStepGroupsToggle =
    isDuplicating &&
    !isCyoa &&
    !isFlowGuide(formFactor as GuideFormFactor) &&
    (isOnboardingChecklist ||
      isSidebarInjectedAsInline(
        theme as Theme,
        template.isSideQuest,
        formFactor as GuideFormFactor
      ) ||
      (isEverboardingGuide && isSidebarEmbed(formFactor)));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton top="4" right="4" />
        <ModalBody>
          <Box mb="4">
            <Text fontSize="sm" fontWeight="semibold" mb={1}>
              Guide name
            </Text>
            <Input
              value={newName}
              onChange={handleNameChange}
              onKeyUp={handleInputKeyUp}
            />
          </Box>
          {(isOnboardingChecklist || !isDuplicating) && (
            <Accordion allowToggle>
              <GuideScopeSelector
                selectedTemplateType={selectedTemplateType}
                defaultValue={defaultTemplateType}
                onChange={handleScopeSelection}
              />
              {!isCyoa && (
                <GuideThemeSelector
                  selectedGuideTheme={selectedTheme}
                  defaultValue={selectedTheme}
                  onChange={handleThemeSelection}
                  orgDefault={uiSettings?.theme as Theme}
                  orgName={orgName}
                  isChangingTheme={{
                    from: theme as Theme,
                    to: selectedTheme,
                  }}
                />
              )}
            </Accordion>
          )}

          {shouldShowDuplicateStepGroupsToggle && (
            <Box mt={4}>
              {/* Toggle to determine if step groups need to be duplicated */}
              <Checkbox
                isChecked={duplicateStepGroups}
                onChange={handleDuplicateStepGroupChanged}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <span>Duplicate step groups</span>
                  <Tooltip
                    label="Duplicate if you intend to change step content. Otherwise, keep same step groups if you mean to rearrange them."
                    placement="top"
                    maxWidth="260px"
                  >
                    <InfoOutlined fontSize="inherit" />
                  </Tooltip>
                </Box>
              </Checkbox>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <HStack display="flex" justifyContent="flex-end">
            <Box>
              <Button isDisabled={submitDisabled} onClick={handleSubmit}>
                {submitBtnTitle}
              </Button>
            </Box>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
