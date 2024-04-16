import { Flex } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/react';
import NpsSurveyOverflowMenuButton from 'components/Library/LibraryNps/NpsSurveyOverflowMenuButton';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import Box from 'system/Box';
import Button from 'system/Button';
import { showErrors } from 'utils/helpers';
import LastSavedAt from '../GuideForm/LastSavedAt';

import { useNpsProvider } from './NpsProvider';

type Props = {};

const NpsTopBar: React.FC<Props> = () => {
  const {
    deletedAt,
    saveChanges,
    launchOrPause,
    dirty,
    isValid,
    launchedAt,
    refetch,
    name,
    entityId,
  } = useNpsProvider();
  const restrictedMode = !!deletedAt;
  const toast = useToast();
  const router = useRouter();

  const saveDisabled = !dirty || restrictedMode || !isValid;
  // Update with more labels when the
  // launch functionality is added.
  const saveButtonText = 'Save';

  const launchDisabled = dirty || !isValid;
  const launchButtonText = launchedAt ? 'Stop launching' : 'Launch';

  const handleLaunchOrPause = useCallback(async () => {
    try {
      await launchOrPause();
      void refetch();
      toast({
        title: 'Launch settings updated!',
        isClosable: true,
        status: 'success',
      });
      return true;
    } catch (e) {
      showErrors(e, toast);
    }
    return false;
  }, [launchOrPause]);

  const onDeleted = useCallback(
    (npsSurveyName: string) => {
      toast({
        title: `NPS survey "${npsSurveyName}" deleted!`,
        isClosable: true,
        status: 'success',
      });

      router.push('/library?tab=nps');
    },
    [router]
  );

  return (
    <>
      <Box marginRight="6" display="flex" alignItems="center">
        {restrictedMode ? (
          <></>
        ) : (
          <Flex gap="2" alignItems="center">
            <Box mr="6">
              <LastSavedAt />
            </Box>
            <Button
              minWidth="fit-content"
              isDisabled={saveDisabled}
              onClick={saveChanges}
              data-test="nps-editor-save-btn"
            >
              {saveButtonText}
            </Button>
            {!restrictedMode && (
              <Button
                minWidth="fit-content"
                isDisabled={launchDisabled}
                onClick={handleLaunchOrPause}
                data-test="nps-editor-save-btn"
                variant={launchedAt ? 'error' : 'secondary'}
              >
                {launchButtonText}
              </Button>
            )}

            <Box width="20px">
              <NpsSurveyOverflowMenuButton
                npsSurveyEntityId={entityId}
                npsSurveyName={name}
                onDeleted={onDeleted}
              />
            </Box>
          </Flex>
        )}
      </Box>
      {/**
       * Confirmation modal needs to be more generic.
       */}
      {/* <LaunchModal
        isOpen={toggleState.launchModal.isOn}
        onClose={toggleState.launchModal.off}
        onConfirm={onLaunchOrPause}
        template={template}
      /> */}
    </>
  );
};

export default NpsTopBar;
