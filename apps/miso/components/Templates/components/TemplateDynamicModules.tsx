import React, { useMemo } from 'react';

import { moduleNameOrFallback } from 'bento-common/utils/naming';

import DynamicTemplateModule from 'components/Templates/components/DynamicTemplateModule';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import TemplateDynamicModulesQuery from 'queries/TemplateDynamicModulesQuery';
import LoadingState from 'system/LoadingState';
import { useDynamicModules } from 'hooks/useFeatureFlag';
import Box from 'system/Box';

type Props = {
  templateEntityId: string;
};

const TemplateDynamicModules: React.FC<Props> = ({ templateEntityId }) => {
  const enableDynamicModules = useDynamicModules();

  const { loading, data } = useQueryAsHook(
    TemplateDynamicModulesQuery,
    { templateEntityId },
    {
      disable: !enableDynamicModules,
    }
  );

  const dynamicModulesData = useMemo(
    () =>
      (data?.template?.dynamicModules || []).reduce(
        (acc, dm) => {
          dm.targetingData.forEach((td) => {
            if (td.targetTemplate === templateEntityId)
              acc.push({
                entityId: dm.entityId,
                name: moduleNameOrFallback(dm),
                targets: td.autoLaunchRules as any[],
              });
          });
          return acc;
        },
        [] as {
          entityId: string;
          name: string;
          targets: any[];
        }[]
      ),
    [data?.template?.dynamicModules, templateEntityId]
  );

  if (!enableDynamicModules) return null;
  if (loading) return <LoadingState />;

  return (
    <Box pb="4" display="flex" flexDir="column" gap="4">
      {dynamicModulesData.map((dmd) => (
        <DynamicTemplateModule
          key={`dmd-${dmd.entityId}`}
          moduleEntityId={dmd.entityId}
          moduleName={dmd.name}
          targets={dmd.targets}
        />
      ))}
    </Box>
  );
};

export default TemplateDynamicModules;
