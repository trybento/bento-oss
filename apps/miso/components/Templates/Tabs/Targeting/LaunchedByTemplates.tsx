import React, { useMemo } from 'react';
import { Text, VStack, Fade } from '@chakra-ui/react';

import { useQueryAsHook } from 'hooks/useQueryAsHook';
import { TargetingTabProps } from '../TargetingTab';

import TemplatesLaunchingTemplateQuery from 'queries/TemplatesLaunchingTemplateQuery';
import EditorTabSection from '../EditorTabSection';
import GuideList from './GuideList';
import { templateToTargetTransformer } from '../PriorityRankingForm/helpers';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';

type Props = TargetingTabProps;

const LaunchedByTemplates: React.FC<Props> = ({ template }) => {
  const { data, loading } = useQueryAsHook(TemplatesLaunchingTemplateQuery, {
    templateEntityId: template.entityId,
  });

  const enableInternalGuideNames = useInternalGuideNames();

  const guideList = useMemo(
    () =>
      data?.template.launchedBy.map((t) =>
        templateToTargetTransformer(t, enableInternalGuideNames)
      ) ?? [],
    [data?.template.launchedBy]
  );

  const show = !(loading || (data && data.template.launchedBy.length === 0));

  return (
    <Fade in={show}>
      {show && (
        <EditorTabSection
          header="By other guides"
          helperText="This guide is launched via button clicks sand branching in other guides. 
Auto-launching is not recommended."
        >
          <VStack alignItems="flex-start" gap="2" w="full">
            <Text>Audience rules do not apply.</Text>
            <GuideList guides={guideList} />
          </VStack>
        </EditorTabSection>
      )}
    </Fade>
  );
};

export default LaunchedByTemplates;
