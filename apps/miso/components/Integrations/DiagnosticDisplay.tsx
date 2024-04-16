import React, { useCallback } from 'react';
import {
  HStack,
  Text,
  Box,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  UnorderedList,
  ListItem,
  Link,
  Code,
} from '@chakra-ui/react';

import { DiagnosticModules, DiagnosticStates } from 'bento-common/types';
import {
  ENG_CALENDLY_URL,
  BENTO_DOCS_LINK,
} from 'bento-common/frontend/constants';

import Button from 'system/Button';
import CircularBadge from 'system/CircularBadge';
import H5 from 'system/H5';
import { CalloutTypes } from 'bento-common/components/CalloutText';

type DiagnosticCopyDict = Record<
  DiagnosticModules,
  {
    /** Display name in the menu */
    name: string;
    /** Title to show if something's wrong */
    title: string;
    /** Why this matters */
    explanations: Array<string>;
    /** How to fix */
    actions: Array<string | React.ReactNode>;
  }
>;

const DIAGNOSTIC_COPY: DiagnosticCopyDict = {
  [DiagnosticModules.successfulInitialization]: {
    name: 'Successful initialization',
    title: 'You may not have installed Bento',
    explanations: [
      'You will not be able to launch guides, or embed components if Bento’s snippet is not running',
    ],
    actions: [
      'Ask an engineer to install the Bento snippet',
      <Text>
        See the docs{' '}
        <Link target="_blank" href={BENTO_DOCS_LINK}>
          here
        </Link>
      </Text>,
    ],
  },
  [DiagnosticModules.validAccountUserIds]: {
    name: 'Valid user IDs',
    title: 'You may be using emails as IDs',
    explanations: [
      'Emails may not be unique, potentially making it difficult to target users effectively',
    ],
    actions: ['Pass in unique ID values, such as UUIDs'],
  },
  [DiagnosticModules.hasRecommendedAttributes]: {
    name: 'Recommended attributes detected',
    title: 'Recommended attributes missing',
    explanations: [
      'This will make it difficult for you to target users and customers effectively',
      'This increases the likelihood of “spamming” your users',
    ],
    actions: [
      <Text>
        Pass{' '}
        <Code fontSize="xs" bg="gray.200">
          createdAt
        </Code>{' '}
        timestamps (ISO8601 formatted) for customers and users
      </Text>,
      'Pass names for users and customers, as well as email addresses for users',
      <Link target="_blank" href={BENTO_DOCS_LINK}>
        See details here
      </Link>,
    ],
  },
  [DiagnosticModules.hardCodedAccounts]: {
    name: 'Your customers are flowing in',
    title: 'You may have hard-coded your customers',
    explanations: [
      'This will prevent you from targeting the correct customers',
    ],
    actions: [
      'Inspect your snippet and replace any hard coded values with correct objects',
    ],
  },
  [DiagnosticModules.hardCodedUsers]: {
    name: 'Your users are flowing in',
    title: 'You may have hard-coded your users',
    explanations: ['This will prevent you from targeting the correct users'],
    actions: [
      'Inspect your snippet and replace any hard coded values with correct objects',
    ],
  },
  [DiagnosticModules.nonIsoDates]: {
    name: 'Valid date format',
    title: 'Some dates are not in ISO 8601 format',
    explanations: [
      "Bento may recognize these dates as strings and you won't be able to successfully target based on them",
      'Bento may interpret the dates as being in a different timezone than intended',
    ],
    actions: [
      <Text>
        Pass dates as ISO 8601 formatted timestamps (e.g.{' '}
        <Code fontSize="xs" bg="gray.200">
          2023-02-02T14:24:17.251Z
        </Code>
        )
      </Text>,
      'Ensure dates are not hard coded',
    ],
  },
  [DiagnosticModules.inconsistentTypes]: {
    name: 'Consistent attributes',
    title: 'Some attribute data types have changed',
    explanations: [
      'This will make it difficult for you to effectively target users and customers based on those attributes',
    ],
    actions: ["Ensure the data types of attributes don't change"],
  },
};

export default function DiagnosticDisplay({
  name,
  state,
  bold,
}: {
  state: DiagnosticStates;
  name: DiagnosticModules;
  bold?: boolean;
}) {
  const noWarnings =
    state === DiagnosticStates.healthy || state === DiagnosticStates.noData;

  const copy = DIAGNOSTIC_COPY[name];

  const handleSupportUrlClick = useCallback(() => {
    window.open(ENG_CALENDLY_URL, '_blank');
  }, []);

  return (
    <AccordionItem
      border="none"
      pointerEvents={noWarnings ? 'none' : undefined}
    >
      <AccordionButton
        w="full"
        justifyContent="space-between"
        px="0"
        _focus={{ outline: 'none' }}
      >
        <HStack fontSize="md">
          <CircularBadge
            calloutType={noWarnings ? CalloutTypes.Tip : CalloutTypes.Warning}
          />
          <Text>{copy.name}</Text>
        </HStack>
        {!noWarnings && <AccordionIcon mr="2" />}
      </AccordionButton>
      <AccordionPanel ml="4" my="2" backgroundColor="bento.pale">
        <H5 mb="2">{copy.title}</H5>
        <Box my="1" fontWeight="semibold">
          Why this matters:
        </Box>
        <UnorderedList px="4">
          {copy.explanations.map((s) => (
            <ListItem>{s}</ListItem>
          ))}
        </UnorderedList>
        <Box my="1" fontWeight="semibold">
          Suggested actions:
        </Box>
        <UnorderedList px="4">
          {copy.actions.map((s) => (
            <ListItem>{s}</ListItem>
          ))}
        </UnorderedList>
        <Button mt="4" size="sm" onClick={handleSupportUrlClick}>
          Pair with our engineers
        </Button>
      </AccordionPanel>
    </AccordionItem>
  );
}
