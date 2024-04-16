import React, { useMemo } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { AutoLaunchableTemplateType } from '../../../EditorCommon/targeting.helpers';
import { GenericPriorityFormValues } from './helpers';
import PriorityRankingForm from './PriorityRankingForm';
import { useNpsProvider } from 'components/Nps/NpsProvider';

export interface PriorityFormValues {
  priorityRanking: {
    autoLaunchableTemplates: AutoLaunchableTemplateType[];
  };
}

const NpsPriorityForm = () => {
  const {
    name,
    priorityRankingsChanged,
    priorityRankings: initialPriorityRankings,
  } = useNpsProvider();

  const initialValues = useMemo<GenericPriorityFormValues>(() => {
    return {
      ...initialPriorityRankings,
      currentTarget: { ...initialPriorityRankings.currentTarget, name },
    };
  }, [initialPriorityRankings, name]);

  return (
    <Box bgColor="#F7FAFC" px={6} py={3} borderRadius="4px">
      <Text mb={3}>
        Drag and drop this survey to determine the order it should launch in
      </Text>
      <PriorityRankingForm
        onChange={priorityRankingsChanged}
        initialValues={initialValues}
      />
    </Box>
  );
};

export default NpsPriorityForm;
