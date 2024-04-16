import { Box, Button, Flex, Icon, Text, useToast } from '@chakra-ui/react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { EmojiList, EmojiListItem } from 'bento-common/components/EmojiList';
import { removeWhiteSpaces } from 'bento-common/data/helpers';
import {
  WYSIWYG_NAV_BAR_HEIGHT,
  WYSIWYG_TOGGLE_HEIGHT_PX,
  WYSIWYG_TOGGLE_WIDTH_PX,
} from 'bento-common/features/wysiwyg/constants';
import {
  Attribute,
  WysiwygEditorHelperText,
  WysiwygEditorMode,
  WysiwygEditorProgress,
  WysiwygEditorRecorderType,
  WysiwygPostMessageAction,
} from 'bento-common/types';
import { px } from 'bento-common/utils/dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useElementSelector } from '~src/providers/ElementSelectorProvider';
import { useSession } from '~src/providers/VisualBuilderSessionProvider';
import { makeLogger } from '~src/utils/debug';

import BentoLogo from '../BentoLogo';
import DeleteButton from '../system/DeleteButton';
import TextField from '../system/InputFields/TextField';
import { WYSIWYG_FLOATING_SHADOW } from './constants';
import CustomizePopup from './CustomizePopup';
import FloatingListPanel from './FloatingListPanel';
import FloatingPanel from './FloatingPanel';
import MenuItem from './MenuItem';
import NavSeparator from './NavSeparator';
import SelectorPopup from './SelectorPopup';
import StepContentPopup from './StepContentPopup';
import { FloatingPanelProgress } from './types';

const logger = makeLogger('content.editor');

export function postMessageToEmbed<D>(message: WysiwygPostMessageAction<D>) {
  logger(`Sending message of type '${message.action}' to embed`);
  window.postMessage(message, '*');
}

export type WysiwygEditorTab = {
  label: string;
  isActive: (
    mode: WysiwygEditorMode,
    progress: WysiwygEditorProgress,
  ) => boolean;
  isComplete: (
    mode: WysiwygEditorMode,
    progress: WysiwygEditorProgress,
  ) => boolean;
  isDisabled: (
    mode: WysiwygEditorMode,
    progress: WysiwygEditorProgress,
  ) => boolean;
  modeOnClick: WysiwygEditorMode;
};

export type WysiwygModeHelperTextGetter = (
  mode: WysiwygEditorMode,
) => string | undefined;
export type WysiwygSaveButtonLabelGetter = (
  mode: WysiwygEditorMode,
  progress: WysiwygEditorProgress,
) => string;
export type WysiwygSaveButtonDisabledGetter = (
  mode: WysiwygEditorMode,
  progress: WysiwygEditorProgress,
) => boolean;

type WysiwygEditorProps<D> = {
  showFinalSaveButton?: boolean;
  CustomizeForm?: React.FC;
  StepContentForm?: React.FC;
  title: string;
  tabs: WysiwygEditorTab[];
  floatingPanelProgress?: FloatingPanelProgress;
  getSaveButtonLabel?: WysiwygSaveButtonLabelGetter;
  getModeHelperText?: WysiwygModeHelperTextGetter;
  isSaveDisabled: WysiwygSaveButtonDisabledGetter;
  StepsList?: React.FC;
};

function getCurrentProgress(
  mode: WysiwygEditorMode,
  modes: WysiwygEditorMode[],
) {
  const modeIndex = modes.indexOf(mode);
  return Object.fromEntries(modes.map((m, i) => [m, i < modeIndex])) as Record<
    WysiwygEditorMode,
    boolean
  >;
}

export default function WysiwygEditor<D>({
  showFinalSaveButton = true,
  title,
  tabs,
  getSaveButtonLabel = () => 'Save',
  getModeHelperText,
  CustomizeForm,
  StepContentForm,
  StepsList,
  isSaveDisabled,
  floatingPanelProgress,
}: React.PropsWithChildren<WysiwygEditorProps<D>>) {
  const {
    progressData,
    previewData,
    setProgressData,
    closeEditor,
    enabledFeatureFlags,
    type,
    attributes,
    returnMode,
    setReturnMode,
    changeMode,
  } = useSession();
  const toast = useToast();
  const { regenerateSelector } = useElementSelector();

  const isRecorder =
    progressData.recorderType === WysiwygEditorRecorderType.auto;

  const canCustomizeStepContent = useMemo(
    () => progressData.modes.includes(WysiwygEditorMode.customizeContent),
    [progressData.modes],
  );

  const [expanded, setExpanded] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const currentMode = useMemo(() => progressData.mode, [progressData.mode]);
  const modes = useMemo(() => progressData.modes, [progressData.modes]);
  const progress = useMemo(
    () => getCurrentProgress(progressData.mode, modes),
    [currentMode, modes],
  );

  const recordedActions = useMemo(
    () => progressData.recordedActions || [],
    [progressData.recordedActions],
  );

  const hideNavToggle = currentMode === WysiwygEditorMode.recordInfo;

  const showFloatingMenu = useMemo(
    () =>
      !isRecorder &&
      expanded &&
      [
        WysiwygEditorMode.confirmElement,
        WysiwygEditorMode.customize,
        WysiwygEditorMode.customizeContent,
      ].includes(currentMode),
    [isRecorder, expanded, currentMode],
  );

  const showStepsList = useMemo(
    () =>
      !isRecorder &&
      expanded &&
      [WysiwygEditorMode.preview].includes(currentMode),
    [isRecorder, expanded, currentMode],
  );

  const toggleClicked = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      setExpanded((expanded) => !expanded);
    },
    [],
  );

  const syncPreviewData = useCallback(() => {
    postMessageToEmbed({
      action: 'previewData',
      payload: {
        guide: previewData,
        initialLoad: !!progressData.initialLoad,
        data: progressData.data,
        mode: currentMode,
        enabledFeatureFlags,
        elementSelector: progressData.elementSelector,
        wildcardUrl: progressData.wildcardUrl,
        type,
      },
    });

    if (progressData.initialLoad) {
      setProgressData((prev) => ({
        ...prev,
        initialLoad: false,
      }));
    }
  }, [progressData, previewData, currentMode]);

  useEffect(() => {
    syncPreviewData();
  }, [progressData, previewData, currentMode]);

  const onEmbedMessage = useCallback(
    ({ data: { action } }: MessageEvent) => {
      if (action === 'visualBuilderInitialized') {
        logger('Received onEmbedMessage for "visualBuilderInitialized"');

        /**
         * Do an initial sync of preview data once the embed side
         * has been setup, in case the embed only initializes
         * after the editor
         */
        syncPreviewData();
      }
    },
    [syncPreviewData],
  );

  useEffect(() => {
    logger('Adding event listener for embed messages');
    window.addEventListener('message', onEmbedMessage);

    return () => {
      logger('Removing event listener for embed messages');
      window.removeEventListener('message', onEmbedMessage);
    };
  }, [syncPreviewData]);

  const save = useCallback(async () => {
    try {
      setIsSaving(true);
      await closeEditor(true);
    } catch (err) {
      const errorMsg = err.message || 'Something went wrong';

      toast({
        title: errorMsg,
        isClosable: true,
        status: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }, [closeEditor, progressData]);

  const startDesign = useCallback(() => {
    if (returnMode) {
      setReturnMode(null);
      changeMode(returnMode);
    } else {
      const newMode =
        isRecorder && currentMode === WysiwygEditorMode.navigate
          ? WysiwygEditorMode.recordInfo
          : WysiwygEditorMode.selectElement;

      changeMode(newMode);
    }
  }, [changeMode, isRecorder, currentMode, returnMode]);

  const customizeElement = useCallback(() => {
    changeMode(WysiwygEditorMode.customize);
  }, [changeMode]);

  const reRecord = useCallback(() => {
    setProgressData((prev) => {
      return {
        ...prev,
        mode: WysiwygEditorMode.selectElement,
        recordedActions: [],
      };
    });
  }, []);

  const onSelectorChange = useCallback((selector: string, url: string) => {
    setProgressData((prev) => {
      return {
        ...prev,
        elementSelector: selector,
        wildcardUrl: removeWhiteSpaces(url),
      };
    });
  }, []);

  const saveSelector = useCallback(() => {
    changeMode(WysiwygEditorMode.customize);
  }, []);

  const saveCustomization = useCallback(() => {
    const nextMode = canCustomizeStepContent
      ? WysiwygEditorMode.customizeContent
      : WysiwygEditorMode.preview;

    changeMode(nextMode);
  }, [showFinalSaveButton, save, changeMode, canCustomizeStepContent]);

  const modeChangeHandlers = useMemo(
    () =>
      Object.fromEntries(modes.map((mode) => [mode, () => changeMode(mode)])),
    [modes, changeMode],
  );

  const modeHelperText = useMemo(
    () =>
      isRecorder && isSaving
        ? WysiwygEditorHelperText.aiSave
        : getModeHelperText?.(currentMode),
    [currentMode, getModeHelperText, isRecorder, isSaving],
  );

  const isRecording = useMemo(
    () => isRecorder && currentMode === WysiwygEditorMode.selectElement,
    [isRecorder, currentMode],
  );

  const recordedActionHandler = useMemo(() => {
    return recordedActions.map((_a, i) => {
      const edit = (newAction: string) => {
        setProgressData((prev) => {
          return {
            ...prev,
            recordedActions: prev.recordedActions.map((a, index) => ({
              ...a,
              actions: index === i ? newAction : a.action,
            })),
          };
        });
      };

      const remove = () => {
        setProgressData((prev) => {
          return {
            ...prev,
            recordedActions: prev.recordedActions.filter(
              (_, index) => index !== i,
            ),
          };
        });
      };

      return { edit, remove };
    });
  }, [recordedActions]);

  return (
    <Flex
      height={expanded ? `${WYSIWYG_NAV_BAR_HEIGHT}px` : '0px'}
      width="full"
      boxShadow="0px -3px 6px 0px rgb(0 0 0 / 25%)"
      background="bento.bright"
      position="absolute"
      bottom="0"
      transition="transform 0.1s ease 0s">
      <Flex
        height="full"
        w="full"
        px="10"
        alignItems="center"
        gap="8"
        display={expanded ? undefined : 'none'}>
        <Flex gap="4" alignItems="center">
          <Box color="white" w="6" h="6">
            <BentoLogo />
          </Box>
          <Box
            fontSize={['sm', 'sm', 'md', 'lg']}
            color="white"
            fontWeight="semibold"
            my="auto">
            {title}
          </Box>
        </Flex>
        <Flex flex="1" gap="6">
          {tabs.map(
            ({ label, isActive, isComplete, isDisabled, modeOnClick }) => {
              return (
                <MenuItem
                  key={label}
                  label={label}
                  isActive={isActive(currentMode, progress)}
                  isComplete={isComplete(currentMode, progress)}
                  disabled={isDisabled(currentMode, progress)}
                  onClick={modeChangeHandlers[modeOnClick]}
                />
              );
            },
          )}
          {modeHelperText && (
            <>
              <NavSeparator my="auto" />
              <Flex gap="2">
                {isRecording && (
                  <Box
                    className="recorder-indicator"
                    w="2"
                    h="2"
                    borderRadius="full"
                    my="auto"
                  />
                )}
                <Box color="white" fontWeight="bold" my="auto" lineHeight="4">
                  {modeHelperText}
                </Box>
              </Flex>
            </>
          )}
        </Flex>
        <Flex position="relative" w="auto" mr="20px" gap="4">
          {(showFinalSaveButton ||
            currentMode === WysiwygEditorMode.navigate) && (
            <>
              <Button
                my="auto"
                fontSize="sm"
                variant="solid"
                bg="white"
                color="bento.bright"
                disabled={isSaveDisabled(currentMode, progress) || isSaving}
                onClick={
                  [
                    WysiwygEditorMode.navigate,
                    WysiwygEditorMode.recordInfo,
                  ].includes(currentMode)
                    ? startDesign
                    : isRecorder &&
                      currentMode === WysiwygEditorMode.selectElement
                    ? customizeElement
                    : isRecorder && currentMode === WysiwygEditorMode.customize
                    ? reRecord
                    : save
                }>
                {returnMode
                  ? 'Resume'
                  : getSaveButtonLabel(currentMode, progress)}
              </Button>
              {isRecorder && currentMode === WysiwygEditorMode.customize && (
                <Button
                  my="auto"
                  fontSize="sm"
                  variant="solid"
                  color="white"
                  bg="bento.dark"
                  onClick={save}>
                  Build guide
                </Button>
              )}
              <NavSeparator my="auto" />
            </>
          )}
          <Button fontSize="sm" my="auto" onClick={() => closeEditor(false)}>
            Exit
          </Button>
        </Flex>
        {isRecorder &&
          expanded &&
          currentMode !== WysiwygEditorMode.navigate &&
          (currentMode === WysiwygEditorMode.recordInfo ? (
            <Flex
              position="absolute"
              flexDir="column"
              w="500px"
              bottom="90px"
              right="40px"
              bg="white"
              borderRadius="md"
              p="6"
              boxShadow={WYSIWYG_FLOATING_SHADOW}>
              <Text size="h4">Create a flow with Bento AI</Text>
              <EmojiList color="gray.600">
                <EmojiListItem emoji="📚">
                  Click through your app, mimicking the workflow you want to
                  create a guide for
                </EmojiListItem>
                <EmojiListItem emoji="🤖">
                  BentoAI will record your actions and generate a flow
                </EmojiListItem>
              </EmojiList>
            </Flex>
          ) : (
            <FloatingListPanel
              title={`Actions (${recordedActions.length})`}
              right="40px">
              <Flex flexDir="column" gap="2">
                {recordedActions.length > 0 ? (
                  recordedActions.map((ra, i) => (
                    <Flex key={`recorded-action-${ra.elementSelector}-${i}`}>
                      <TextField
                        attributes={attributes as Attribute[]}
                        fontSize="xs"
                        h="7"
                        pr="1"
                        onChange={recordedActionHandler[i].edit}
                        defaultValue={ra.action}
                      />
                      <DeleteButton
                        className="step-row-icon"
                        ml="auto"
                        my="auto"
                        tooltip="Delete action"
                        tooltipPlacement="top"
                        height="20px"
                        onClick={recordedActionHandler[i].remove}
                      />
                    </Flex>
                  ))
                ) : (
                  <Box>No actions</Box>
                )}
              </Flex>
            </FloatingListPanel>
          ))}
        {showFloatingMenu && (
          <FloatingPanel
            floatingPanelProgress={floatingPanelProgress}
            currentMode={currentMode}>
            {currentMode === WysiwygEditorMode.confirmElement && (
              <SelectorPopup
                onCancel={() => changeMode(WysiwygEditorMode.selectElement)}
                onSave={
                  canCustomizeStepContent ||
                  modes.includes(WysiwygEditorMode.preview)
                    ? saveSelector
                    : showFinalSaveButton
                    ? undefined
                    : save
                }
                onChange={onSelectorChange}
                onRegenerateSelector={regenerateSelector}
              />
            )}
            {currentMode === WysiwygEditorMode.customize && CustomizeForm && (
              <CustomizePopup
                onCancel={() => changeMode(WysiwygEditorMode.confirmElement)}
                onSave={showFinalSaveButton ? saveCustomization : save}
                isSubmitEnabled={!isSaving}
                CustomizeForm={CustomizeForm}
              />
            )}
            {currentMode === WysiwygEditorMode.customizeContent && (
              <StepContentPopup
                onCancel={() => changeMode(WysiwygEditorMode.customize)}
                onSave={() => changeMode(WysiwygEditorMode.preview)}
                StepContentForm={StepContentForm}
              />
            )}
          </FloatingPanel>
        )}
        {showStepsList && StepsList && <StepsList />}
      </Flex>

      {!hideNavToggle && (
        <Flex
          position="absolute"
          background="bento.bright"
          textAlign="center"
          width={px(WYSIWYG_TOGGLE_WIDTH_PX)}
          height={px(WYSIWYG_TOGGLE_HEIGHT_PX)}
          top={px(-WYSIWYG_TOGGLE_HEIGHT_PX)}
          left={`calc(50% - ${px(WYSIWYG_TOGGLE_WIDTH_PX / 2)})`}
          color="white"
          fontSize="xs"
          borderTopRadius="md"
          cursor="pointer"
          onClick={toggleClicked}>
          <Flex alignItems="center" m="auto">
            <Icon
              as={ArrowDropDownIcon}
              transform={expanded ? null : 'rotate(180deg)'}
            />{' '}
            <Box mr="3">{expanded ? 'Hide' : 'Show'}</Box>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
