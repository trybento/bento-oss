import { Box, Flex } from '@chakra-ui/react';
import RichTextEditor from 'bento-common/components/RichTextEditor';
import {
  getAllowedElementTypes,
  getDisallowedElementTypes,
  RichTextEditorUISettings,
} from 'bento-common/components/RichTextEditor/helpers';
import { TagEditorData } from 'bento-common/types';
import { FormEntityType } from 'bento-common/types/forms';
import { Step, StepEntityId } from 'bento-common/types/globalShoyuState';
import { SlateBodyElement } from 'bento-common/types/slate';
import { isFlowGuide } from 'bento-common/utils/formFactor';
import { patchObject } from 'bento-common/utils/objects';
import React, { useCallback, useMemo } from 'react';

import { useSession } from '~src/providers/VisualBuilderSessionProvider';
import colors from '~src/ui/colors';

import { pickTagDataFromEditorState } from './constants';
import { createTaggedElement } from './helpers';

const updateStepContent = ({
  steps,
  stepEntityId,
  bodySlate,
}: {
  steps: Step[];
  stepEntityId: StepEntityId;
  bodySlate: SlateBodyElement[];
}) => {
  steps.some((s) => {
    const match = s.entityId === stepEntityId;
    if (match) {
      patchObject(s, { bodySlate });
    }
    return match;
  });
};

const StepContentForm: React.FC = () => {
  const {
    uiSettings,
    organizationDomain,
    accessToken,
    progressData,
    setProgressData,
    attributes,
  } = useSession<TagEditorData>();

  const formFactor = progressData.data.guide.formFactor;
  const isFlow = isFlowGuide(formFactor);

  const updateStep = useCallback(
    (bodySlate: SlateBodyElement[]) => {
      const data = progressData.data;

      let selectedTag = isFlow
        ? data.allTaggedElements.find((t) => t.step === data.taggedElement.step)
        : data.allTaggedElements[0];

      if (!selectedTag) {
        /**
         * For tooltips, we should always have a tag given there is only
         * ever one.
         */
        if (!isFlow) {
          return;
        }

        const { newTag } = createTaggedElement(data.guide, {
          context: 'step',
          stepEntityId: data.taggedElement.step,
        });

        selectedTag = newTag;

        data.allTaggedElements.push(newTag);
        data.guide.taggedElements.push(newTag);
      }

      patchObject(selectedTag, pickTagDataFromEditorState(progressData));

      if (isFlow) {
        data.taggedElement = selectedTag;
        data.guide.firstIncompleteStep = data.taggedElement.step;
      }

      const updatePayload = {
        stepEntityId: data.taggedElement.step || data.guide.steps[0].entityId,
        bodySlate,
      };

      updateStepContent({
        steps: data.guide.steps,
        ...updatePayload,
      });

      updateStepContent({
        steps: data.guide.modules[0].steps,
        ...updatePayload,
      });

      setProgressData((prev) => {
        return {
          ...prev,
          data,
          initialLoad: true,
          ...(isFlow
            ? {
                elementHtml: '',
                elementText: '',
                elementSelector: selectedTag.elementSelector,
                url: selectedTag.url,
                wildcardUrl: selectedTag.wildcardUrl,
              }
            : {}),
        };
      });
    },
    [progressData],
  );

  const bodySlate = useMemo(() => {
    const data = progressData.data;

    if (isFlow) {
      const stepEntityId = data.taggedElement.step;

      return (
        data.guide.steps.find((s, i) =>
          stepEntityId ? s.entityId === stepEntityId : i === 0,
        )?.bodySlate || []
      );
    }

    return data.guide.steps[0]?.bodySlate || [];
  }, [
    /**
     * IMPORTANT: Do not memoize other variables other than the
     * currently selected step to prevent the RTE from re-rendering
     * whenever the editorState changes. It is only desired to load
     * the initial body of a step and not its changes.
     */
    progressData.data.taggedElement.entityId,
  ]);

  const { rteAllowed, rteDisallowed } = useMemo(
    () => ({
      rteAllowed: getAllowedElementTypes(formFactor),
      rteDisallowed: getDisallowedElementTypes(formFactor),
    }),
    [formFactor],
  );

  return (
    <Flex flexDir="column" fontSize="sm" color={colors.text.secondary}>
      <Box fontWeight="bold" mb="1">
        Tooltip content
      </Box>
      <RichTextEditor
        attributes={attributes}
        uiSettings={uiSettings as unknown as RichTextEditorUISettings}
        organizationDomain={organizationDomain}
        accessToken={accessToken}
        fileUploadConfig={{
          apiHost: process.env.PLASMO_PUBLIC_API_URL,
          uploadsHost: process.env.PLASMO_PUBLIC_UPLOADS_HOST,
        }}
        initialBody={bodySlate}
        onBodyChange={updateStep}
        containerKey="wysiwyg-step-content-form"
        formEntityType={FormEntityType.template}
        disallowedElementTypes={rteDisallowed}
        allowedElementTypes={rteAllowed}
        formFactor={formFactor}
        pixelHeight={180}
        formFactorStyle={{}}
        addMenuDisabled
        recoverable={false}
      />
      <Box mt="2">
        Additional customization and styling available once tour has been
        created in Bento
      </Box>
    </Flex>
  );
};

export default StepContentForm;
