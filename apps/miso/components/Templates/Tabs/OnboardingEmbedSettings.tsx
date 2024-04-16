import React, { useCallback, useMemo, useState, useEffect } from 'react';
import pick from 'lodash/pick';
import { Flex, Button, VStack } from '@chakra-ui/react';
import { InlineEmbedState, WysiwygEditorMode } from 'bento-common/types';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import useToast from 'hooks/useToast';
import Radio from 'system/Radio';
import RadioGroup from 'system/RadioGroup';
import InlineEmbedForm from 'components/Library/InlineEmbedForm';
import { COMMON_INLINE_EMBED_EDIT_ARGS } from 'mutations/EditInlineEmbed';
import { useHideSidebar } from 'hooks/useFeatureFlag';
import { useOrganizationInlineEmbed } from 'providers/OrganizationInlineEmbedProvider';
import { useFormikContext } from 'formik';
import { TemplateFormValues } from '../Template';

type Props = {
  disabled?: boolean;
};

enum InlineEmbedSettings {
  both = 'both',
  sidebarOnly = 'sidebarOnly',
}

/**
 * Edits org-wide embed settings in particular, as opposed to specific settings e.g. for a vTag or tooltip.
 *
 * Changes made here reflect across onboarding guides.
 */
const OnboardingEmbedSettings: React.FC<Props> = ({ disabled }) => {
  const { values } = useFormikContext<TemplateFormValues>();
  const {
    inlineEmbed,
    loading,
    deleteInlineEmbed,
    updateInlineEmbed,
    handleEditOrCreateOrganizationInlineEmbed,
  } = useOrganizationInlineEmbed();
  const [displaySetting, setDisplaySetting] = useState<InlineEmbedSettings>(
    InlineEmbedSettings.both
  );
  const [removeInlineEmbed, setRemoveInlineEmbed] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (!loading && !initialLoad) {
      setInitialLoad(true);

      setDisplaySetting(
        inlineEmbed?.state === InlineEmbedState.active
          ? InlineEmbedSettings.both
          : InlineEmbedSettings.sidebarOnly
      );
    }
  }, [loading]);

  const saveEnabled = useMemo(() => {
    if (removeInlineEmbed) {
      return true;
    }

    if (
      inlineEmbed?.state === InlineEmbedState.inactive &&
      displaySetting === InlineEmbedSettings.both &&
      !!inlineEmbed
    ) {
      return true;
    }

    if (
      inlineEmbed?.state === InlineEmbedState.active &&
      displaySetting === InlineEmbedSettings.sidebarOnly
    ) {
      return true;
    }

    return false;
  }, [inlineEmbed, removeInlineEmbed, displaySetting]);

  const handleEmbedSettingChange = useCallback((val: InlineEmbedSettings) => {
    setDisplaySetting(val);
  }, []);

  const sidebarHidden = useHideSidebar();

  const onRemoveInline = useCallback(() => {
    setRemoveInlineEmbed(true);
    setDisplaySetting(InlineEmbedSettings.sidebarOnly);
  }, []);

  const handleSaveEmbedSettings = useCallback(async () => {
    const newState =
      displaySetting === InlineEmbedSettings.sidebarOnly
        ? InlineEmbedState.inactive
        : InlineEmbedState.active;

    try {
      if (removeInlineEmbed) {
        await deleteInlineEmbed();
        setRemoveInlineEmbed(false);
      } else {
        await updateInlineEmbed({
          ...pick(inlineEmbed, COMMON_INLINE_EMBED_EDIT_ARGS),
          state: newState,
        });
      }

      toast({
        title: 'Onboarding guide settings saved',
        isClosable: true,
        status: 'success',
      });
    } catch (e: any) {
      toast({
        title: e.message || 'Something went wrong',
        isClosable: true,
        status: 'error',
      });
    }
  }, [displaySetting, inlineEmbed, removeInlineEmbed]);

  const openInlineEmbedEditor = useCallback(async () => {
    if (disabled) {
      return;
    }

    handleEditOrCreateOrganizationInlineEmbed(
      values.templateData,
      WysiwygEditorMode.customize
    );
  }, [
    disabled,
    handleEditOrCreateOrganizationInlineEmbed,
    values.templateData,
  ]);

  return (
    <Flex h="full">
      {!initialLoad ? (
        <BentoLoadingSpinner />
      ) : (
        <VStack pt="4" w="full" alignItems="flex-start" gap="4">
          <RadioGroup
            value={displaySetting}
            alignment="vertical"
            onChange={handleEmbedSettingChange}
          >
            <Radio
              value={InlineEmbedSettings.sidebarOnly}
              label="Only in the sidebar"
              isDisabled={sidebarHidden}
            />
            <Radio
              value={InlineEmbedSettings.both}
              label={
                sidebarHidden ? 'Only in the inline' : 'Both inline and sidebar'
              }
            />
          </RadioGroup>
          {displaySetting !== InlineEmbedSettings.sidebarOnly && (
            <InlineEmbedForm
              label="Choose location in your app"
              w="full"
              inlineEmbed={inlineEmbed as any}
              disabled={disabled}
              onRemove={onRemoveInline}
              editingGlobal
              openInlineEmbedEditor={openInlineEmbedEditor}
            />
          )}
          <Button
            variant="secondary"
            onClick={handleSaveEmbedSettings}
            isDisabled={!saveEnabled}
          >
            Save
          </Button>
        </VStack>
      )}
    </Flex>
  );
};

export default OnboardingEmbedSettings;
