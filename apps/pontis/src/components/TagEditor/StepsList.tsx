import { Box, Button, Flex } from '@chakra-ui/react';
import { TagEditorData, WysiwygEditorMode } from 'bento-common/types';
import { Step } from 'bento-common/types/globalShoyuState';
import { cloneDeep } from 'lodash';
import React, { useCallback } from 'react';

import { useSession } from '~src/providers/VisualBuilderSessionProvider';
import colors from '~src/ui/colors';

import DeleteButton from '../system/DeleteButton';
import EditButton from '../system/EditButton';
import FloatingListPanel from '../WysiwygEditor/FloatingListPanel';
import { createTaggedElement } from './helpers';

const newStepNamePrefix = 'Step ';

const StepCard: React.FC<{
  step: Step;
  selected: boolean;
  deleteEnabled: boolean;
}> = ({ step, selected, deleteEnabled }) => {
  const { progressData, setProgressData } = useSession<TagEditorData>();

  const deleteStep = useCallback(() => {
    const data = progressData.data;

    if (data.allTaggedElements.length <= 1) {
      return;
    }

    const tagIndex = data.allTaggedElements.findIndex(
      (t) => t.step === step.entityId,
    );

    const stepIndex = data.guide.steps.findIndex(
      (s) => s.entityId === step.entityId,
    );

    // Step not found.
    if (tagIndex === -1 || stepIndex === -1) {
      return;
    }

    const steps = data.guide.steps.reduce((acc, s) => {
      if (s.entityId !== step.entityId) {
        acc.push({
          ...s,
          name: s.name.startsWith(newStepNamePrefix)
            ? `${newStepNamePrefix}${acc.length + 1}`
            : s.name,
        });
      }

      return acc;
    }, []);

    data.guide.steps = steps;

    /**
     * We need to clone the steps here, as otherwise both
     * `data.guide.steps` and `data.guide.modules[0].steps`
     * point to the same object reference, which causes oddities
     * when editing state in other areas of the flow (e.g., when
     * adding a new step, we push the new step to both of these
     * arrays).
     */
    data.guide.modules[0].steps = cloneDeep(steps);

    data.allTaggedElements = data.allTaggedElements.filter(
      (t) => t.step !== step.entityId,
    );

    // If the step we're deleting is the currently-selected step, select the following step
    const selectedTag =
      data.taggedElement.step === step.entityId
        ? data.allTaggedElements[
            tagIndex > data.allTaggedElements.length - 1
              ? data.allTaggedElements.length - 1
              : tagIndex
          ]
        : data.taggedElement;

    data.taggedElement = selectedTag;
    data.guide.firstIncompleteStep = selectedTag.step;

    const redirectTo =
      data.taggedElement.url !== '' &&
      data.taggedElement.url !== window.location.href
        ? data.taggedElement.url
        : undefined;

    setProgressData((prev) => {
      return {
        ...prev,
        data,
        elementHtml: '',
        elementText: '',
        elementSelector: selectedTag.elementSelector,
        url: selectedTag.url,
        wildcardUrl: selectedTag.wildcardUrl,
        initialLoad: true,
        redirectTo,
      };
    });
  }, [progressData, step.entityId, window.location.href]);

  const selectStep = useCallback(
    (mode?: WysiwygEditorMode) => {
      const data = progressData.data;

      const selectedTag = data.allTaggedElements.find(
        (t) => t.step === step.entityId,
      );

      if (!selectedTag) {
        return;
      }

      // Select the tag for the WYSIWYG editor.
      data.taggedElement = selectedTag;
      data.guide.firstIncompleteStep = step.entityId;

      const redirectTo =
        data.taggedElement.url !== '' &&
        data.taggedElement.url !== window.location.href
          ? data.taggedElement.url
          : undefined;

      setProgressData((prev) => {
        return {
          ...prev,
          data,
          elementHtml: '',
          elementText: '',
          elementSelector: selectedTag.elementSelector,
          url: selectedTag.url,
          wildcardUrl: selectedTag.wildcardUrl,
          initialLoad: true,
          redirectTo,
          ...(mode ? { mode } : {}),
        };
      });
    },
    [step.entityId, progressData, window.location.href],
  );

  return (
    <Flex
      className="hoverable-row"
      cursor="pointer"
      onClick={() => selectStep()}
      borderRadius="md"
      fontSize="sm"
      py="3"
      pl="3"
      pr="6"
      boxShadow="0px 1px 4px 0px #0019FF29"
      border={`1px solid ${selected ? colors.bento.bright : '#E2E8F0'}`}>
      <Flex flex="1" gap="2" my="auto" overflow="hidden">
        <Box flex="1" color={colors.text.secondary} isTruncated>
          {step.name}
        </Box>
        <Box
          onClick={() => selectStep(WysiwygEditorMode.customizeContent)}
          className="hoverable-row-hidden"
          w="5">
          <EditButton style={{ height: '20px' }} />
        </Box>
        {deleteEnabled && (
          <Box onClick={deleteStep} className="hoverable-row-hidden" w="5">
            <DeleteButton style={{ height: '20px' }} />
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

const StepsList: React.FC = () => {
  const { progressData, setProgressData } = useSession<TagEditorData>();
  const deleteEnabled = progressData.data.guide.steps.length > 1;

  const createNewTag = useCallback(() => {
    const data = progressData.data;
    const { newStep, newTag } = createTaggedElement(data.guide);
    newStep.name = newStepNamePrefix + (data.guide.steps.length + 1);

    newTag.url = progressData.url;
    newTag.wildcardUrl = progressData.wildcardUrl;
    newTag.elementSelector = progressData.elementSelector;

    data.guide.modules[0].steps.push(newStep);
    data.guide.steps.push(newStep);
    data.taggedElement = newTag;
    data.allTaggedElements.push(newTag);
    data.guide.taggedElements.push(newTag);
    data.guide.firstIncompleteStep = newTag.step;

    setProgressData((prev) => {
      return {
        ...prev,
        data,
        mode: WysiwygEditorMode.navigate,
        elementHtml: '',
        elementText: '',
        elementSelector: newTag.elementSelector,
        url: newTag.url,
        wildcardUrl: newTag.wildcardUrl,
        initialLoad: true,
      };
    });
  }, [progressData]);

  return (
    <FloatingListPanel
      title={`Steps (${progressData.data.guide.steps.length})`}
      right="40px">
      <Flex flexDir="column" gap="4">
        {progressData.data.guide.steps.map((s, i) => {
          return (
            <StepCard
              key={`step-card-${i}-${s.entityId}`}
              step={s}
              deleteEnabled={deleteEnabled}
              selected={progressData.data?.taggedElement?.step === s.entityId}
            />
          );
        })}
        <Button onClick={createNewTag} variant="secondary">
          Add a step
        </Button>
      </Flex>
    </FloatingListPanel>
  );
};

export default StepsList;
