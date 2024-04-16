import React, { useCallback, useState } from 'react';
import { VStack } from '@chakra-ui/layout';

import InfoCard from 'system/InfoCard';
import Box from 'system/Box';
import TroubleshootInitializationCheckModule from './TroubleshooterModules/TroubleshootInitializationCheckModule';
import TroubleshootTemplateStateCheckModule from './TroubleshooterModules/TroubleshootTemplateStateCheckModule';
import { TroubleshootModuleProps } from './TroubleshooterModules/troubleshoot.helpers';
import TroubleshootTargetingCheck from './TroubleshooterModules/TroubleshootTargetingCheck';
import TroubleshootLaunchedCheck from './TroubleshooterModules/TroubleshootLaunchedCheck';
import TroubleshooterProvider, {
  CheckStep,
  useTroubleshooterContext,
} from './TroubleshooterProvider';
import TroubleshootLocationCheck from './TroubleshooterModules/TroubleshootLocationCheck';

const TroubleshootUserNotGettingContent: React.FC<
  TroubleshootModuleProps
> = () => {
  const { step } = useTroubleshooterContext();
  return (
    <Box mt="2" w="xl">
      {step === CheckStep.initial ? (
        <TroubleshootInitializationCheckModule />
      ) : step === CheckStep.templateState ? (
        <TroubleshootTemplateStateCheckModule />
      ) : step === CheckStep.targeting ? (
        <TroubleshootTargetingCheck />
      ) : step === CheckStep.location ? (
        <TroubleshootLocationCheck />
      ) : step === CheckStep.other ? (
        <TroubleshootLaunchedCheck />
      ) : (
        <VStack w="full">
          <InfoCard w="full">Module coming soon</InfoCard>
        </VStack>
      )}
    </Box>
  );
};

const TroubleshootUserNotGettingContentWrapper: React.FC<
  TroubleshootModuleProps
> = (props) => (
  <TroubleshooterProvider onReset={props.onReset}>
    <TroubleshootUserNotGettingContent {...props} />
  </TroubleshooterProvider>
);

export default TroubleshootUserNotGettingContentWrapper;
