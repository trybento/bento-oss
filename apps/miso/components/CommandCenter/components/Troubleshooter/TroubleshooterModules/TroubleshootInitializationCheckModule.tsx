import React, { useEffect } from 'react';
import { Button, HStack } from '@chakra-ui/react';

import useSuccessfulInstallation from 'queries/OrgSuccessfulInstallation';
import TroubleshootFailState from '../common/TroubleshootFailState';
import { DOCS_INSTALLATION_URL } from 'bento-common/utils/docs';
import InfoCard from 'system/InfoCard';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import Box from 'system/Box';
import InlineLink from 'components/common/InlineLink';
import { useTroubleshooterContext } from '../TroubleshooterProvider';

const TroubleshootInitializationCheckModule: React.FC<{}> = () => {
  const { handleNext, onReset: handleBack } = useTroubleshooterContext();
  const successfulInstallation = useSuccessfulInstallation();

  /* Handle advancing global checks */
  useEffect(() => {
    if (successfulInstallation) handleNext();
  }, [successfulInstallation, handleNext]);

  if (successfulInstallation === null || successfulInstallation === true)
    return (
      <InfoCard w="full" h="xs">
        <BentoLoadingSpinner />
      </InfoCard>
    );

  return (
    <Box w="full">
      <TroubleshootFailState
        reason="Bento snippet hasn't been installed"
        recommendations={[
          'Work with your engineering team to install the Bento snippet',
          <>
            Share our{' '}
            <InlineLink
              href={DOCS_INSTALLATION_URL}
              color="blue.500"
              label="docs"
            />{' '}
            with them
          </>,
        ]}
      />
      <HStack justifyContent="flex-end">
        <Button variant="secondary" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleBack}>Done</Button>
      </HStack>
    </Box>
  );
};

export default TroubleshootInitializationCheckModule;
