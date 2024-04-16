import React, { useCallback, useMemo } from 'react';
import { Box, Text } from '@chakra-ui/react';

import { Theme } from 'bento-common/types';
import { isInlineContextualGuide } from 'bento-common/utils/formFactor';
import { isSplitTestGuide } from 'bento-common/data/helpers';
import EditorTabSection from '../EditorTabSection';
import useToast from 'hooks/useToast';
import { TargetingTabProps } from '../TargetingTab';
import { AutoLaunchableTemplateType } from '../../../EditorCommon/targeting.helpers';
import { useTemplate } from 'providers/TemplateProvider';
import {
  GenericPriorityFormValues,
  preparePriorityRankingsForTemplateOrTest,
} from './helpers';
import PriorityRankingForm from './PriorityRankingForm';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';
import PriorityRankFormObserver from './PriorityRankFormObserver';
import { FormEntityLabel } from 'components/GuideForm/types';
import { submitPriorityMutation } from 'components/GuideAutoLaunchModal/Template/autolaunch.helpers';

interface Props extends TargetingTabProps {
  /** Show edited template name for new, unsaved templates */
  editedTemplateName?: string | null;
  /** TEMP: Render without the editorSection wrapper */
  unwrap?: boolean;
}

export interface PriorityFormValues {
  priorityRanking: {
    autoLaunchableTemplates: AutoLaunchableTemplateType[];
  };
}

const TemplatePriorityForm = ({
  template,
  editedTemplateName,
  autoLaunchableTemplates,
  launchedNpsSurveys,
  unwrap,
}: Props) => {
  const toast = useToast();
  const enabledInternalNames = useInternalGuideNames();
  const isSplitTest = isSplitTestGuide(template.type as any);
  const { setLaunchPriority, canEditTemplate } = useTemplate();

  const rankingDisabled = isInlineContextualGuide(template.theme as Theme);

  const handleChange = useCallback(
    ({ autoLaunchableTargets, currentTarget }: GenericPriorityFormValues) => {
      const order = autoLaunchableTargets.findIndex(
        (autoLaunchable) => autoLaunchable.entityId === currentTarget.entityId
      );
      setLaunchPriority(order);
    },
    []
  );

  const handleSavePriorities = useCallback(
    async (newValues: GenericPriorityFormValues) => {
      try {
        await submitPriorityMutation(newValues);

        toast({
          title: 'Priority updated!',
          isClosable: true,
          status: 'success',
        });
      } catch (e) {
        toast({
          title: e.message || 'Something went wrong',
          isClosable: true,
          status: 'error',
        });
      }
    },
    []
  );

  const initialValues = useMemo<GenericPriorityFormValues>(() => {
    return preparePriorityRankingsForTemplateOrTest({
      formEntityLabel: isSplitTest
        ? FormEntityLabel.test
        : FormEntityLabel.guide,
      templateOrTest: template,
      editedName: editedTemplateName,
      enabledInternalNames,
      templates: autoLaunchableTemplates,
      surveys: launchedNpsSurveys,
    });
  }, [
    editedTemplateName,
    template,
    enabledInternalNames,
    isSplitTest,
    autoLaunchableTemplates,
    launchedNpsSurveys,
  ]);

  const Content = (
    <Box bgColor="#F7FAFC" p="4" borderRadius="4px">
      <Text mb={3}>
        {isSplitTest
          ? 'Initial onboarding checklists are shown one-at-a-time, using the design principle of “progressive disclosure”'
          : 'Drag and drop this guide to determine the order it should launch in'}
      </Text>
      <PriorityRankingForm
        nestedFormObserver={<PriorityRankFormObserver />}
        onChange={handleChange}
        onSubmit={handleSavePriorities}
        initialValues={initialValues}
      />
    </Box>
  );

  /** @todo fully deprecate editor tab section once launching revamp is GA */
  return rankingDisabled || !canEditTemplate ? null : unwrap ? (
    Content
  ) : (
    <EditorTabSection
      header="Priority: When should it be available?"
      helperText='Initial onboarding checklists are shown one at a time, using the design principle of "progressive disclosure." '
    >
      {Content}
    </EditorTabSection>
  );
};

export default TemplatePriorityForm;
