import React, { useCallback, useMemo } from 'react';
import { Button, HStack, VStack } from '@chakra-ui/react';

import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';
import TroubleshootFailState from '../common/TroubleshootFailState';
import Box from 'system/Box';
import { useTroubleshooterContext } from '../TroubleshooterProvider';
import InlineLink from 'components/common/InlineLink';
import InfoCard from 'system/InfoCard';
import FormLabel from 'system/FormLabel';
import { Highlight } from 'components/common/Highlight';
import { getGeneralRecommendations } from './troubleshootingCopy';

const TroubleshootLaunchedCheck: React.FC<{}> = () => {
  const { handleBack, onReset, contentDetails, contentSelection, account } =
    useTroubleshooterContext();

  const anchorElement = contentDetails?.taggedElements?.[0]?.elementSelector;

  const generalRecommendations = useMemo(
    () =>
      getGeneralRecommendations({
        contentDetails,
        accountEntityId: account?.entityId,
        accountName: account?.name,
      }),
    [account.entityId, contentDetails]
  );

  return (
    <Box w="full">
      {anchorElement ? (
        <TroubleshootFailState
          reason="This user should be getting the guide. If you are not seeing it, please check that the CSS selector is present on the page."
          recommendations={[
            <>
              Check that your{' '}
              <InlineLink
                label="guide's"
                href={`/library/templates/${contentSelection.entityId}`}
              />{' '}
              CSS selector is valid and it is on the target page.
            </>,
            <>
              Reach out to your admins with the guide URL and user email if the
              problem persists
            </>,
          ]}
        >
          <InfoCard w="full">
            <VStack alignItems="flex-start">
              <FormLabel fontSize="xs" label="Location set for experience:" />
              <Highlight fontSize="xs">
                {wildcardUrlToDisplayUrl(contentDetails?.locationShown ?? '')}
              </Highlight>
              <FormLabel
                fontSize="xs"
                mt="4"
                label="CSS selector where this is anchored:"
              />
              <Highlight fontSize="xs">{anchorElement}</Highlight>
            </VStack>
          </InfoCard>
        </TroubleshootFailState>
      ) : (
        <TroubleshootFailState
          reason="This user should be getting the guide experience. If you've tried hard refreshing and it's still not working, please reach out to us."
          recommendations={generalRecommendations}
        />
      )}
      <HStack justifyContent="flex-end">
        <Button variant="secondary" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={onReset}>Done</Button>
      </HStack>
    </Box>
  );
};

export default TroubleshootLaunchedCheck;
