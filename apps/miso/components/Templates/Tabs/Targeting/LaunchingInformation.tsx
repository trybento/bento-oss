import React from 'react';
import { Flex } from '@chakra-ui/layout';

import { useTargetingInformation } from 'components/EditorCommon/targeting.helpers';
import { useTemplate } from 'providers/TemplateProvider';
import LoadingState from 'system/LoadingState';
import TargetingBlockedAccounts from './BlockedAccounts';
import TargetingManuallyLaunchedAccounts from './ManuallyLaunchedAccounts';

const LaunchingInformation: React.FC = () => {
  const { template } = useTemplate();

  const entityId = template?.entityId;

  const { loading, data } = useTargetingInformation(entityId);

  if (loading) return <LoadingState />;

  return (
    <Flex flexDirection="column" gap="4">
      <TargetingManuallyLaunchedAccounts
        templateEntityId={template.entityId}
        manuallyLaunchedAccounts={data.manualLaunches}
        p={0}
      />

      <TargetingBlockedAccounts blockedAccounts={data.blockedAccounts} p={0} />
    </Flex>
  );
};

export default LaunchingInformation;
