import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Input,
  Text,
  Flex,
  Link,
  VStack,
  BoxProps,
} from '@chakra-ui/react';
import { graphql } from 'react-relay';

import { IntegrationType } from 'bento-common/types';
import { IntegrationState } from 'bento-common/types/integrations';

import * as SetIntegrationApiKeyMutation from 'mutations/SetIntegrationApiKey';
import ConfigureZendeskMutation from 'mutations/ConfigureZendesk';
import { EventHookState } from 'components/Integrations/types';
import Box from 'system/Box';
import QueryRenderer from 'components/QueryRenderer';
import { ZendeskConfigurationQuery } from 'relay-types/ZendeskConfigurationQuery.graphql';
import { useLoggedInUser } from 'providers/LoggedInUserProvider';
import useToast from 'hooks/useToast';
import useToggleState from 'hooks/useToggleState';
import colors from 'helpers/colors';
import EditorTabSection from 'components/Templates/Tabs/EditorTabSection';
import Page from 'components/layout/Page';

const integrationType = IntegrationType.zendesk;

const ConfigurationCard: React.FC<{ title?: string } & BoxProps> = ({
  title,
  children,
  ...restProps
}) => {
  return (
    <Flex flexDirection="column" gap="2" {...restProps}>
      {title && (
        <Text fontSize="lg" fontWeight="bold">
          {title}
        </Text>
      )}
      <Box mt="2" rounded="base" borderColor="gray.300" borderWidth="1px" p="6">
        {children}
      </Box>
    </Flex>
  );
};

type ZendeskConfigurationProps = {
  refetch: () => void;
} & ZendeskConfigurationQuery['response'];

function ZendeskIssuesConfigurationComponent({
  orgSettings,
  refetch,
}: ZendeskConfigurationProps) {
  const integration = useMemo(
    () =>
      orgSettings.integrationApiKeys?.find((i) => i.type === integrationType),
    [orgSettings.integrationApiKeys]
  );
  const isIntegrationEnabled = integration?.state === IntegrationState.Active;
  const [currentKey, setCurrentKey] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const pageStates = useToggleState(['loading', 'confirm']);

  const toast = useToast();

  const {
    loggedInUser: { email },
  } = useLoggedInUser();

  useEffect(() => {
    const originalKey = integration?.key;

    if (originalKey !== undefined) {
      setCurrentKey(originalKey);
    }

    if (integration?.zendeskState)
      setSubdomain(integration.zendeskState.subdomain);
  }, [integration]);

  const handleApiKeyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentKey(e.target.value);
    },
    []
  );

  const handleSubdomainChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSubdomain(e.target.value);
    },
    []
  );

  const onEnableClicked = useCallback(async () => {
    if (currentKey !== null && currentKey !== '') {
      pageStates.loading.on();

      try {
        await SetIntegrationApiKeyMutation.commit({
          integrationType,
          state: EventHookState.Active,
          key: currentKey,
          entityId: integration?.entityId,
        });
        await ConfigureZendeskMutation({
          username: email,
          subdomain,
        });

        toast({
          title: 'Zendesk enabled!',
          status: 'success',
        });
      } finally {
        pageStates.loading.off();
        refetch();
      }
    }
  }, [currentKey, refetch, subdomain, email, pageStates, integration]);

  const onDisableClicked = useCallback(async () => {
    pageStates.loading.on();

    try {
      await SetIntegrationApiKeyMutation.commit({
        integrationType,
        state: EventHookState.Inactive,
        key: currentKey,
        entityId: integration?.entityId,
      });

      toast({
        title: 'Zendesk disabled!',
        status: 'success',
      });
    } finally {
      pageStates.loading.off();
      setCurrentKey('');
      setSubdomain('');
      refetch();
    }
  }, [refetch, pageStates, integration]);

  return (
    <Page
      title="Zendesk integration"
      breadcrumbs={[
        { label: 'Integrations', path: '/data-and-integrations' },
        { label: 'Zendesk' },
      ]}
    >
      <Flex flexDir="column" gap="10">
        <EditorTabSection
          header="Configuration: What features should be available?"
          borderBottom="unset"
          helperText={
            <Box>
              An API token is required to enable article search and to submit
              tickets.
              <Link
                href="https://help.trybento.co/en/articles/8059349-zendesk-integration"
                target="_blank"
                color={colors.bento.bright}
                fontWeight="bold"
                ml="1"
              >
                Learn more
              </Link>
            </Box>
          }
        >
          <VStack w="full" alignItems="flex-start" gap="8">
            <ConfigurationCard w="xl">
              <Flex gap="4" mt="4" alignItems="center">
                <Input
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  disabled={pageStates.loading.isOn || isIntegrationEnabled}
                />
                <Text>.zendesk.com</Text>
              </Flex>
              <Text fontSize="sm" fontWeight="bold" mt="6">
                API token
              </Text>
              <Flex gap="4" mt="1">
                <Input
                  value={currentKey}
                  onChange={handleApiKeyChange}
                  disabled={pageStates.loading.isOn || isIntegrationEnabled}
                />
              </Flex>
              <Flex>
                <Button
                  variant={isIntegrationEnabled ? 'red' : 'secondary'}
                  onClick={
                    isIntegrationEnabled ? onDisableClicked : onEnableClicked
                  }
                  disabled={
                    pageStates.loading.isOn ||
                    (!isIntegrationEnabled && !subdomain && !currentKey)
                  }
                  mt="6"
                >
                  {isIntegrationEnabled ? 'Disable' : 'Save'}
                </Button>
              </Flex>
            </ConfigurationCard>
          </VStack>
        </EditorTabSection>
      </Flex>
    </Page>
  );
}

const ZENDESK_CONFIGURATION_QUERY = graphql`
  query ZendeskConfigurationQuery {
    attributes {
      type
      name
      valueType
    }
    organization {
      id
      branchingQuestions {
        id
        question
        branchingKey
        choices {
          id
          choiceKey
          label
        }
      }
    }
    orgSettings {
      integrationApiKeys {
        entityId
        type
        state
        key
        zendeskState {
          username
          subdomain
        }
      }
    }
  }
`;

export default function ZendeskConfiguration() {
  return (
    <QueryRenderer<ZendeskConfigurationQuery>
      query={ZENDESK_CONFIGURATION_QUERY}
      render={({ props, retry }) =>
        props && (
          <ZendeskIssuesConfigurationComponent {...props} refetch={retry} />
        )
      }
    />
  );
}
