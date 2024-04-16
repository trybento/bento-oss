import React, { useCallback, useMemo, useState } from 'react';
import { Box, Flex, FormLabel, Text } from '@chakra-ui/react';
import debounce from 'lodash/debounce';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { GuidePageTargetingType, TagContext } from 'bento-common/types';
import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';
import useRandomKey from 'bento-common/hooks/useRandomKey';

import { GuidePageTargetingEnumType } from 'relay-types/EditTemplateQuery.graphql';
import StepPrototypeTag from 'components/Tags/StepPrototypeTag';
import UrlInput from 'components/common/UrlInput';
import RadioGroup from 'system/RadioGroup';
import Radio from 'system/Radio';
import InteractiveTooltip from 'system/InteractiveTooltip';
import { TemplateFormValues } from 'components/Templates/Template';

const PAGE_TARGETING_OPTIONS = [
  { label: 'User is on any page', value: GuidePageTargetingType.anyPage },
  { label: 'On a specific page', value: GuidePageTargetingType.specificPage },
  { label: 'User clicks visual tag', value: GuidePageTargetingType.visualTag },
];
interface PageTargetingProps {
  pageTargetingType: GuidePageTargetingEnumType;
  pageTargetingUrl: string | null;
  optionsWhitelist?: GuidePageTargetingType[];
  optionsBlacklist?: GuidePageTargetingType[];
  disabled?: boolean;
  currentValues?: TemplateFormValues;

  handlePageTargetingTypeChange: (val: GuidePageTargetingEnumType) => void;
  handlePageTargetingUrlChange: (val: string) => void;
}

export default function PageTargeting({
  pageTargetingType,
  pageTargetingUrl,
  optionsWhitelist = Object.values(GuidePageTargetingType),
  optionsBlacklist = [],
  disabled,
  currentValues,
  handlePageTargetingTypeChange,
  handlePageTargetingUrlChange,
}: PageTargetingProps) {
  const displayPageTargetingUrl = useMemo<string | null>(
    () => (pageTargetingUrl ? wildcardUrlToDisplayUrl(pageTargetingUrl) : null),
    [pageTargetingUrl]
  );
  const urlInputKey = useRandomKey([pageTargetingUrl]);

  const debouncedSetPageTargetingUrl = useCallback(
    debounce((newValue: string) => {
      handlePageTargetingUrlChange(newValue);
    }, 250),
    [handlePageTargetingUrlChange]
  );

  const enabledPageTargetingOptions = useMemo(() => {
    return PAGE_TARGETING_OPTIONS.filter(
      (option) =>
        optionsWhitelist.includes(option.value) &&
        optionsBlacklist.includes(option.value) === false
    );
  }, [optionsWhitelist, optionsBlacklist]);

  const getInitialPageTargetingOption = useCallback(
    (pageTargetingType) => {
      return enabledPageTargetingOptions.find(
        (option) => option.value === pageTargetingType
      );
    },
    [enabledPageTargetingOptions]
  );

  const [selectedPageTargeting, setSelectedPageTargeting] = useState(
    getInitialPageTargetingOption(pageTargetingType)
  );

  const handleSelectedPageTargeting = useCallback(
    (option) => {
      setSelectedPageTargeting(option);
      // set the targeting mechanism as selected
      handlePageTargetingTypeChange(option.value);
      // reset whatever url entered previously
      handlePageTargetingUrlChange('');
    },
    [handlePageTargetingTypeChange, handlePageTargetingUrlChange]
  );

  return (
    <>
      {/* Targeting mechanism */}
      <Box display="flex" flexDir="column">
        <Box flex="1 0 0" mr="5">
          <RadioGroup
            defaultValue={selectedPageTargeting.value}
            alignment="vertical"
            isDisabled={disabled}
          >
            {enabledPageTargetingOptions.map((option, i) => (
              <Radio
                key={`template-page-targeting-type-${i}`}
                value={option.value}
                label={option.label}
                onChange={(e) => handleSelectedPageTargeting(option)}
              />
            ))}
          </RadioGroup>
        </Box>
        <Box display="flex" flexDir="column" mt="3">
          {selectedPageTargeting.value ===
            GuidePageTargetingType.specificPage && (
            <Box bgColor="#F7FAFC" px={6} py={3} maxW="xl">
              <Text mt={2}>
                Enter the page URL that you want the guide to show up on
              </Text>
              <Box my="4">
                <FormLabel>URL</FormLabel>
                {/* TODO: Add `Enter your destination URL` as placeholder */}
                <UrlInput
                  initialUrl={displayPageTargetingUrl}
                  onContentChange={debouncedSetPageTargetingUrl}
                  key={urlInputKey + displayPageTargetingUrl}
                  disabled={disabled}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      {/* Visual tags */}
      {selectedPageTargeting.value === GuidePageTargetingType.visualTag && (
        <Flex direction="column" bgColor="#F7FAFC" gap="4" px={6} py={3}>
          <Flex alignItems="center" gap="2">
            <Text>
              Create a visual tag on a particular page element that triggers
              this announcement
            </Text>
            <InteractiveTooltip
              placement="top"
              maxWidth="240px"
              label={
                <span>
                  Visual tags help users discover this guide or step. Read more{' '}
                  <a
                    href="https://help.trybento.co/en/?q=visual+tag"
                    target="_blank"
                    style={{ textDecoration: 'underline' }}
                  >
                    here
                  </a>
                  .
                </span>
              }
            >
              <InfoOutlinedIcon fontSize="inherit" />
            </InteractiveTooltip>
          </Flex>
          {currentValues && (
            <StepPrototypeTag
              disabled={disabled}
              label="Anchor location:"
              editLabel="Edit location"
              setLabel="Set location"
              context={TagContext.template}
              templateData={currentValues.templateData}
              warnWhenNotSet={true}
            />
          )}
        </Flex>
      )}
    </>
  );
}
