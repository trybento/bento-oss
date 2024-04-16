import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Flex } from '@chakra-ui/layout';

import {
  isGuideInActiveSplitTest,
  isGuideInDraftSplitTest,
} from 'bento-common/data/helpers';
import {
  GuideDesignType,
  GuidePageTargetingType,
  TemplateState,
} from 'bento-common/types';
import { TemplateValue } from 'bento-common/types/templateData';
import { isGuideEligibleForTagTargeting } from 'bento-common/utils/constants';

import Box from 'system/Box';
import Tooltip from 'system/Tooltip';
import Button from 'system/Button';
import useToast from '../../hooks/useToast';
import { useTemplate } from '../../providers/TemplateProvider';
import { useFormsProvider } from '../../providers/FormsProvider';
import LastSavedAt from '../GuideForm/LastSavedAt';
import TemplateOverflowMenuButton from './EditTemplate/TemplateOverflowMenuButton';
import LaunchModal from './LaunchModal';
import LaunchScheduleConfirmationModal from './components/LaunchScheduleConfirmationModal';
import CreateOrDuplicateTemplateModal from 'components/Library/CreateOrDuplicateTemplateModal';
import useSuccessfulInstallation from 'queries/OrgSuccessfulInstallation';
import { useGuideSchedulingThrottling } from 'hooks/useFeatureFlag';
import useToggleState from 'hooks/useToggleState';
import { copyToClipboard, getFormEntityLabel } from 'utils/helpers';
import CopyButton from 'components/Integrations/CopyButton';
import {
  changeUrlTabQueryByTabTitle,
  EditElementTabLabels,
} from 'components/EditorCommon/common';
import { GroupTargeting } from 'bento-common/types/targeting';

type TopBarProps = {
  templateData: TemplateValue;
  /** controls if we can save or launch */
  restrictedMode: boolean;
  onRefetch: () => void;
  isBentoTemplatingOrg?: boolean;
};

const TopBar: React.FC<TopBarProps> = ({
  templateData,
  restrictedMode,
  onRefetch,
  isBentoTemplatingOrg,
}) => {
  const toast = useToast();
  const router = useRouter();

  // Locks up the launch button if snippet has not been installed yet.
  const launchLocked = !useSuccessfulInstallation();

  const { isAnyFormDirty, isAnyFormInvalid, lastError, resetForms } =
    useFormsProvider();

  const {
    template,
    isSplitTest,
    isFlow,
    allStepsHaveATag,
    isTargetedForSplitTesting,
    launchSchedule,
    handleSaveGuideBtnClick,
    isLaunchScheduleConfirmationModalOpen,
    onConfirmLaunchSchedule,
    onCloseLaunchScheduleConfirmationModal,
    setIsLaunchModalOpen,
    isLaunchModalOpen,
    handleLaunchOrPause,
    isSaving,
    isLaunchingOrPausing,
    editingTargetingForm,
  } = useTemplate();

  const formEntityLabel = getFormEntityLabel({ isSplitTest });
  const throttlingEnabled = useGuideSchedulingThrottling();
  const isInActiveSplitTest = isGuideInActiveSplitTest(
    isTargetedForSplitTesting
  );
  const isInDraftSplitTest = isGuideInDraftSplitTest(isTargetedForSplitTesting);

  const {
    isAutoLaunchEnabled,
    enableAutoLaunchAt,
    disableAutoLaunchAt,
    hasAutoLaunchedGuideBases,
    state,
  } = template || {};
  const modalState = useToggleState(['duplicate']);

  const onLaunchOrPause = useCallback(
    async (remove: boolean) => {
      await handleLaunchOrPause(remove);

      setIsLaunchModalOpen(false);
      onRefetch();
    },
    [toast, onRefetch, handleLaunchOrPause, isAutoLaunchEnabled]
  );

  const onDuplicateTemplate = useCallback(async (newEntityId: string) => {
    if (!newEntityId) return;

    router.push(`/library/templates/${newEntityId}`);
  }, []);

  const hasModules = isSplitTest || templateData.modules.length > 0;

  const launchThrottled =
    throttlingEnabled && !isAutoLaunchEnabled && !enableAutoLaunchAt;

  /**
   * Various conditions that should block launching
   * - We're waiting on a server response
   * - The guide is part of any split test
   * - Scheduling is active and there are pending changes
   */
  const launchDisabled =
    isLaunchingOrPausing ||
    isSaving ||
    isInActiveSplitTest ||
    isInDraftSplitTest ||
    (!isAutoLaunchEnabled &&
      (restrictedMode || !hasModules || isAnyFormDirty)) ||
    (launchSchedule.enableAutoLaunchAt || null) !==
      (enableAutoLaunchAt || null) ||
    (launchSchedule.disableAutoLaunchAt || null) !==
      (disableAutoLaunchAt || null);

  const schedulingLaunchWithoutModules =
    !isAutoLaunchEnabled && !!launchSchedule.enableAutoLaunchAt && !hasModules;

  const targetingError =
    isGuideEligibleForTagTargeting(template.designType as GuideDesignType) &&
    // Check if the guide is set to tag targeting.
    templateData.pageTargetingType === GuidePageTargetingType.visualTag &&
    // Check that there is a tag either in the first step
    // or at the guide level.
    !(
      templateData?.taggedElements?.[0] ||
      templateData?.modules?.[0]?.stepPrototypes?.[0]?.taggedElements?.[0]
    ) &&
    !isFlow
      ? 'You must add a visual tag or choose a different targeting method'
      : '';

  const saveDisabled =
    isLaunchingOrPausing ||
    isSaving ||
    isInActiveSplitTest ||
    !isAnyFormDirty ||
    isAnyFormInvalid ||
    restrictedMode ||
    editingTargetingForm ||
    schedulingLaunchWithoutModules;

  const saveButtonText = useMemo(() => {
    if (state === TemplateState.draft) {
      return 'Save';
    }

    if (
      launchSchedule.enableAutoLaunchAt &&
      launchSchedule.disableAutoLaunchAt &&
      !enableAutoLaunchAt &&
      !disableAutoLaunchAt
    ) {
      return 'Schedule';
    }

    if (launchSchedule.enableAutoLaunchAt && !enableAutoLaunchAt) {
      return 'Schedule launch';
    }

    if (launchSchedule.disableAutoLaunchAt && !disableAutoLaunchAt) {
      return 'Schedule stop';
    }

    return 'Update';
  }, [
    launchSchedule.enableAutoLaunchAt,
    launchSchedule.disableAutoLaunchAt,
    enableAutoLaunchAt,
    disableAutoLaunchAt,
    state,
  ]);

  const launchButtonText = useMemo(() => {
    if (isAutoLaunchEnabled) {
      return `Stop ${isSplitTest ? 'test' : 'launching'}`;
    }

    if (hasAutoLaunchedGuideBases) {
      return 'Restart launching';
    }

    return 'Auto-launch';
  }, [isAutoLaunchEnabled, isSplitTest, hasAutoLaunchedGuideBases]);

  const initialLaunchEnabled =
    !isAutoLaunchEnabled && !hasAutoLaunchedGuideBases;

  const selectTargetingTab = useCallback(() => {
    changeUrlTabQueryByTabTitle(EditElementTabLabels.launching, router);
  }, [router]);

  const handleTargetingClick = useCallback(() => {
    setIsLaunchModalOpen(false);
    onCloseLaunchScheduleConfirmationModal();
    selectTargetingTab();
  }, [selectTargetingTab]);

  const handleTemplateDeleted = useCallback(() => {
    if (isSplitTest) {
      router.push('/library?tab=split%20test');
    } else {
      router.push('/library?tab=guides');
    }
  }, [router, isSplitTest]);

  const handleLaunchClick = useCallback(async () => {
    if (!throttlingEnabled || isAutoLaunchEnabled) {
      setIsLaunchModalOpen(true);
    } else {
      await handleLaunchOrPause(false);
      onRefetch();
    }
  }, [throttlingEnabled, isAutoLaunchEnabled]);

  const handleTemplateDeleteStart = useCallback(() => {
    /* Reset so if delete takes a while we don't prompt for saves */
    resetForms();
  }, []);

  const errorMessageTooltip = editingTargetingForm
    ? 'Please save targeting first'
    : schedulingLaunchWithoutModules
    ? 'Please add content before scheduling a launch.'
    : lastError;

  const handleCopyTemplateLink = useCallback(() => {
    copyToClipboard(
      `${window.location.hostname}/bootstrap?target=${templateData.entityId}`
    );
    toast({
      title: 'Template link copied to clipboard',
      status: 'success',
    });
  }, [templateData.entityId]);

  const launchFlowGuideWarning =
    isFlow && !allStepsHaveATag && !isAutoLaunchEnabled
      ? 'Please add a visual tag to all steps before launching'
      : '';

  const launchButtonTooltip = useMemo(() => {
    if (targetingError) return targetingError;

    if (launchFlowGuideWarning) return launchFlowGuideWarning;

    if (launchLocked)
      return `The Bento snippet must be installed and live in order to launch a ${formEntityLabel}.`;

    if (launchThrottled)
      return `This ${formEntityLabel} cannot be manually launched, please set a scheduled launch start date instead`;

    if (editingTargetingForm) return 'Please save targeting before launching.';

    if (!isInActiveSplitTest && !isInDraftSplitTest && initialLaunchEnabled)
      return 'This will automatically launch the guide to anyone who matches your targeting rules';

    if (launchDisabled) return 'Please add content and save before launching';

    return null;
  }, [
    targetingError,
    launchFlowGuideWarning,
    launchLocked,
    launchThrottled,
    launchDisabled,
    isInActiveSplitTest,
    editingTargetingForm,
    isInDraftSplitTest,
    initialLaunchEnabled,
  ]);

  return (
    <>
      <Box marginRight="6" display="flex" alignItems="center">
        {restrictedMode ? (
          <>
            <Button minWidth="fit-content" onClick={modalState.duplicate.on}>
              Duplicate
            </Button>
            <CreateOrDuplicateTemplateModal
              template={template as any}
              isOpen={modalState.duplicate.isOn}
              onClose={modalState.duplicate.off}
              onDuplicate={onDuplicateTemplate}
            />
          </>
        ) : (
          <Flex alignItems="center" gap={3}>
            <Box>
              <LastSavedAt key="editedAt" />
            </Box>
            <Tooltip
              label={errorMessageTooltip}
              placement="left"
              isDisabled={!errorMessageTooltip}
              shouldWrapChildren
            >
              <Button
                isLoading={isSaving}
                minWidth="fit-content"
                isDisabled={saveDisabled}
                onClick={handleSaveGuideBtnClick}
                data-test="template-editor-save-btn"
              >
                {saveButtonText}
              </Button>
            </Tooltip>
            {isBentoTemplatingOrg ? (
              <CopyButton onClick={handleCopyTemplateLink} label="Copy link" />
            ) : (
              <Tooltip
                label={launchButtonTooltip}
                placement="left"
                isDisabled={!launchButtonTooltip}
                shouldWrapChildren
              >
                <Button
                  variant={isAutoLaunchEnabled ? 'error' : 'secondary'}
                  minWidth="fit-content"
                  isLoading={isLaunchingOrPausing}
                  isDisabled={
                    launchDisabled ||
                    editingTargetingForm ||
                    launchLocked ||
                    launchThrottled ||
                    !!launchFlowGuideWarning ||
                    !!targetingError
                  }
                  onClick={handleLaunchClick}
                  data-test="template-editor-autolaunch-btn"
                >
                  {launchButtonText}
                </Button>
              </Tooltip>
            )}
            <Box>
              <TemplateOverflowMenuButton
                template={template as any}
                onDeleted={handleTemplateDeleted}
                onRefetch={onRefetch}
                onDuplicateTemplate={
                  isSplitTest ? undefined : onDuplicateTemplate
                }
                onDeleteStart={handleTemplateDeleteStart}
                disableLaunch
                showDetails
              />
            </Box>
          </Flex>
        )}
      </Box>
      <LaunchModal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        onConfirm={onLaunchOrPause}
        template={template}
        targeting={template.targets as GroupTargeting}
      />
      <LaunchScheduleConfirmationModal
        templateEntityId={template.entityId}
        isOpen={isLaunchScheduleConfirmationModalOpen}
        // This check for isAutoLaunchEnabled is here just in case we're in a state where the template is already
        // launched but we still have an enableAutoLaunchAt date set.
        startTime={
          isAutoLaunchEnabled ? null : launchSchedule.enableAutoLaunchAt
        }
        endTime={launchSchedule.disableAutoLaunchAt}
        onTargetingClick={handleTargetingClick}
        onConfirm={onConfirmLaunchSchedule}
        onClose={onCloseLaunchScheduleConfirmationModal}
      />
    </>
  );
};

export default TopBar;
