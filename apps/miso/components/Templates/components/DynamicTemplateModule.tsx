import React from 'react';
import { Box, Link } from '@chakra-ui/react';
import { ExtendedCalloutTypes } from 'bento-common/types/slate';
import { GuideTypeEnum } from 'bento-common/types';

import CircularBadge from 'system/CircularBadge';
import colors from 'helpers/colors';
import RulesText from 'components/Templates/components/RulesText';
import { AccountTarget } from 'components/GuideAutoLaunchModal/Template/autolaunch.helpers';

interface Props {
  moduleEntityId: string;
  moduleName: string;
  targets: AccountTarget[];
}

const DynamicTemplateModule: React.FC<Props> = ({
  moduleEntityId,
  moduleName,
  targets,
}) => {
  return (
    <Box p="4" border="1px solid #EDF2F7" borderRadius="1">
      <Box display="flex" flexDir="column" gap="1">
        <Box display="flex" gap="2">
          <CircularBadge calloutType={ExtendedCalloutTypes.DynamicStepGroup} />
          <Box fontSize="lg" color={colors.text.secondary} fontWeight="bold">
            Step group:{' '}
            <Link
              href={`/library/step-groups/${moduleEntityId}`}
              target="_blank"
            >
              {moduleName}
            </Link>
          </Box>
        </Box>
        <Box>
          <RulesText typeLabel={GuideTypeEnum.account} targets={targets} />
        </Box>
      </Box>
    </Box>
  );
};

export default DynamicTemplateModule;
