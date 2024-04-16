import React, { useCallback } from 'react';
import {
  Text,
  Box,
  Accordion,
  Flex,
  UnorderedList,
  ListItem,
  Link,
  Button,
} from '@chakra-ui/react';
import Alert from '@mui/icons-material/ReportProblemOutlined';

import { DiagnosticModules, DiagnosticStates } from 'bento-common/types';
import useToast from 'hooks/useToast';
import Tooltip from 'system/Tooltip';
import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';
import { copyToClipboard } from 'utils/helpers';
import DiagnosticDisplay from './DiagnosticDisplay';
import {
  ENG_CALENDLY_URL,
  BENTO_DOCS_LINK,
} from 'bento-common/frontend/constants';
import H4 from 'system/H4';
import Span from 'system/Span';
import OrgDiagnosticsQuery from 'queries/OrgDiagnosticsQuery';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { useOrganization } from 'providers/LoggedInUserProvider';

const displayOrder: Array<DiagnosticModules> = [
  DiagnosticModules.successfulInitialization,
  DiagnosticModules.hardCodedUsers,
  DiagnosticModules.validAccountUserIds,
  DiagnosticModules.hardCodedAccounts,
  DiagnosticModules.hasRecommendedAttributes,
  DiagnosticModules.nonIsoDates,
  DiagnosticModules.inconsistentTypes,
];

export default function OrgDiagnosticsPanel() {
  const { data, loading } = useQueryAsHook(OrgDiagnosticsQuery, {});
  const { organization } = data ?? {};
  const {
    organization: { entityId: appId },
  } = useOrganization();
  const toast = useToast();

  const copyAppId = useCallback(() => {
    if (!appId) return;

    copyToClipboard(appId);
    toast({
      title: 'App ID copied!',
      isClosable: true,
      status: 'success',
    });
  }, [appId]);

  const handleSupportUrlClick = useCallback(() => {
    window.open(ENG_CALENDLY_URL, '_blank');
  }, []);

  const invalidInstallation =
    organization?.diagnostics[DiagnosticModules.successfulInitialization] !==
    DiagnosticStates.healthy;

  return (
    <Flex flexDir="column" w="md" gap="3" alignItems="flex-start">
      <H4>Bento installation health</H4>
      <Flex
        gap="2"
        borderRadius="md"
        borderWidth="1px"
        borderColor="gray.100"
        p="4"
        w="full"
      >
        <Text>App ID</Text>
        <Tooltip label="Click to copy" placement="top">
          <Box cursor="pointer" onClick={copyAppId}>
            {appId}
          </Box>
        </Tooltip>
      </Flex>
      {loading ? (
        <BentoLoadingSpinner mt="4" />
      ) : invalidInstallation ? (
        <CalloutText calloutType={CalloutTypes.Warning} w="full">
          <Flex direction="column" gap="2" py="2" w="full">
            <Flex gap="2" alignItems="center">
              <Flex
                borderRadius="full"
                bg="warning.bright"
                color="white"
                w="8"
                h="8"
                alignItems="center"
                justifyContent="center"
              >
                <Alert style={{ marginTop: '-2px' }} />
              </Flex>
              <Text color="warning.text" fontSize="md">
                Your snippet is not installed
              </Text>
            </Flex>
            <Flex gap="2" direction="column" pl="2" alignItems="flex-start">
              <Text>
                Please refer to our{' '}
                <Link
                  target="_blank"
                  color="bento.bright"
                  href={BENTO_DOCS_LINK}
                >
                  installation docs
                </Link>
                .
              </Text>
              <Flex direction="column" gap="1">
                <Text fontWeight="bold">Why this matters:</Text>
                <UnorderedList px="4">
                  <ListItem>
                    You will not be able to launch guides, or embed components
                    if Bento's snippet is not running
                  </ListItem>
                </UnorderedList>
              </Flex>
              <Flex direction="column" gap="1">
                <Text fontWeight="bold">
                  If your snippet is installed but you're seeing this error:
                </Text>
                <UnorderedList px="4">
                  <ListItem>
                    Please check your CSP and CORS settings to ensure{' '}
                    <Span fontWeight="semibold">trybento.co</Span> is
                    allowlisted.
                    <br />
                    <Link
                      target="_blank"
                      color="bento.bright"
                      href="https://docs.trybento.co/docs/guides/content-security-policy"
                    >
                      Read more here
                    </Link>
                  </ListItem>
                </UnorderedList>
              </Flex>
              <Flex direction="column" gap="1">
                <Text fontWeight="bold">Suggested actions:</Text>
                <UnorderedList px="4">
                  <ListItem>
                    Ask an engineer to install the Bento snippet
                  </ListItem>
                  <ListItem>
                    Contact us if you have questions about how to set up CSP or
                    CORS
                  </ListItem>
                </UnorderedList>
              </Flex>
              <Button size="sm" onClick={handleSupportUrlClick}>
                Pair with our engineers
              </Button>
            </Flex>
          </Flex>
        </CalloutText>
      ) : (
        <Accordion w="full" allowToggle>
          {displayOrder.map((diagnostic, i) => (
            <DiagnosticDisplay
              key={`${diagnostic}-${i}`}
              name={diagnostic as DiagnosticModules}
              state={organization?.diagnostics[diagnostic] as DiagnosticStates}
            />
          ))}
        </Accordion>
      )}
    </Flex>
  );
}
