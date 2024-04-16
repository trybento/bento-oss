import React, { useCallback, useState } from 'react';
import { Button, Text, HStack, Input, VStack, Kbd } from '@chakra-ui/react';

import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';
import { GuidePageTargetingType } from 'bento-common/types';

import TroubleshootFailState from '../common/TroubleshootFailState';
import Box from 'system/Box';
import { useTroubleshooterContext } from '../TroubleshooterProvider';
import InfoCard from 'system/InfoCard';
import TroubleshootInputSection from '../common/TroubleshootInputSection';
import TroubleshootSelectedContentCard from '../common/TroubleshootSelectedContentCard';
import H5 from 'system/H5';
import HelperText from 'system/HelperText';
import { Highlight } from 'components/common/Highlight';
import { isTargetPage } from 'bento-common/utils/urls';
import FormLabel from 'system/FormLabel';
import InlineLink from 'components/common/InlineLink';
import { sanitizeAttributesAndExtract } from 'bento-common/data/helpers';

enum FailureReason {
  mismatch = 'mismatch',
  notSet = 'notSet',
  /** Temp failure case that flags dynamic attributes */
  dynamicAttributes = 'dynamicAttributes',
}

const TroubleshootLocationCheck: React.FC<{}> = () => {
  const [failed, setFailed] = useState<FailureReason | null>(null);
  const [expectedUrl, setExpectedUrl] = useState<string>();
  const {
    handleBack,
    handleNext,
    onReset,
    account,
    accountUser,
    contentDetails,
    contentSelection,
  } = useTroubleshooterContext();

  const handleExpectedUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setExpectedUrl(e.target.value);
    },
    []
  );

  const handleClearUrl = useCallback(() => setFailed(null), []);

  const handleTestAndNext = useCallback(() => {
    if (
      contentDetails.pageTargetingType !== GuidePageTargetingType.anyPage &&
      !contentDetails.locationShown
    )
      return setFailed(FailureReason.notSet);

    const [sanitizedUrl, attributesReplaced] = sanitizeAttributesAndExtract(
      contentDetails.locationShown ?? ''
    );

    const targetMatches = isTargetPage(expectedUrl, sanitizedUrl);

    if (attributesReplaced.length > 0 && targetMatches)
      return setFailed(FailureReason.dynamicAttributes);

    if (targetMatches) return handleNext();

    setFailed(FailureReason.mismatch);
  }, [contentDetails?.locationShown, expectedUrl]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleTestAndNext();
      }
    },
    [handleTestAndNext]
  );

  return failed ? (
    <Box w="full">
      <TroubleshootFailState
        reason={
          failed === FailureReason.notSet
            ? 'No location is set for this guide'
            : failed === FailureReason.dynamicAttributes
            ? 'Your location URL contains a dynamic attribute, and we don’t currently check whether your user’s attributes match.'
            : 'Your expected URL does not match the guide’s location targeting in Bento.'
        }
        recommendations={
          failed === FailureReason.dynamicAttributes
            ? [
                <>
                  Find your{' '}
                  <InlineLink
                    href="https://help.trybento.co/en/articles/9007282-how-to-find-account-and-user-attributes"
                    isExternal
                    label="user's attributes"
                  />{' '}
                  by searching for the Customer then the User
                </>,
                <>
                  Make sure the attribute value for that user matches the one
                  used in your url. For example, if their attribute for{' '}
                  <Kbd fontWeight="normal">{'{{orgName}}'}</Kbd> is{' '}
                  <Kbd fontWeight="normal">acmeCo</Kbd> and your url is
                  <Kbd fontWeight="normal">
                    piedpiper.com/<b>acme-co</b>
                  </Kbd>
                  , that could be one reason for a mismatch
                </>,
              ]
            : [
                <>
                  Check your{' '}
                  <InlineLink
                    href={`/library/templates/${contentSelection.entityId}?tab=content`}
                    label="guide's location"
                  />{' '}
                  targeting and adjust the URL{' '}
                </>,
                ...(failed === FailureReason.notSet
                  ? []
                  : [
                      <>
                        Double check wildcard and dynamic attribute placements
                      </>,
                    ]),
              ]
        }
      >
        <InfoCard w="full">
          <VStack alignItems="flex-start">
            <FormLabel fontSize="xs" label="Location set for experience:" />
            <Highlight fontSize="xs">
              {wildcardUrlToDisplayUrl(contentDetails?.locationShown ?? '')}
            </Highlight>
            <FormLabel fontSize="xs" mt="4" label="Location you provided:" />
            <Highlight fontSize="xs">{expectedUrl}</Highlight>
          </VStack>
        </InfoCard>
      </TroubleshootFailState>
      <HStack justifyContent="flex-end">
        <Button variant="secondary" onClick={handleClearUrl}>
          Back
        </Button>
        <Button onClick={onReset}>Done</Button>
      </HStack>
    </Box>
  ) : (
    <Box w="xl">
      <TroubleshootSelectedContentCard />
      {!!account && !!accountUser && (
        <InfoCard w="full">
          <TroubleshootInputSection showArrow>
            <H5>Which user?</H5>
            <Box>
              <Highlight>
                {accountUser.fullName ??
                  accountUser.email ??
                  accountUser.externalId}
              </Highlight>{' '}
              at <Highlight>{account.name ?? account.externalId}</Highlight>
            </Box>
          </TroubleshootInputSection>
        </InfoCard>
      )}
      <InfoCard w="full">
        <TroubleshootInputSection showArrow>
          <H5 mb="0">Where do you expect to see the experience?</H5>
          <HelperText>
            We need a little more information before we can help troubleshoot
          </HelperText>
          <Text mt="4" fontWeight="bold">
            Page URL
          </Text>
          <Input
            value={expectedUrl}
            onChange={handleExpectedUrlChange}
            placeholder="https://"
            onKeyDown={handleKeyDown}
          />
          <HelperText mt="2">
            Copy and paste in the exact URL from your app.{' '}
          </HelperText>
        </TroubleshootInputSection>
      </InfoCard>
      <HStack justifyContent="flex-end">
        <Button variant="secondary" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleTestAndNext}>Next</Button>
      </HStack>
    </Box>
  );
};

export default TroubleshootLocationCheck;
