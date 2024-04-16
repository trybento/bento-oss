import React from 'react';
import { Flex, HStack, Text, Box } from '@chakra-ui/react';
import { graphql } from 'react-relay';

import useAccessToken from 'hooks/useAccessToken';
import useToast from 'hooks/useToast';
import { IntegrationOption } from './types';
import IntegrationBlock from './IntegrationBlock';
import {
  getBentoApiIntegration,
  getWebhookIntegration,
  getZendeskIntegration,
} from './integrations';
import { removeUrlQueries } from 'helpers';
import { useWebhooks, useZendesk } from 'hooks/useFeatureFlag';
import OrgDiagnosticsPanel from './OrgDiagnostics';
import QueryRenderer from 'components/QueryRenderer';
import { IntegrationsQuery } from 'relay-types/IntegrationsQuery.graphql';
import H4 from 'system/H4';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';

export type IntegrationsProps = {
  refetch: () => void;
} & IntegrationsQuery['response'];

export type IntegrationsFormValues = IntegrationsQuery['response'];

function Integrations({ orgSettings, refetch }: IntegrationsProps) {
  const toast = useToast();
  const { accessToken } = useAccessToken();
  const webhooksEnabled = useWebhooks();
  const zendeskEnabled = useZendesk();

  /** All the behaviors */
  const INTEGRATIONS = React.useMemo(() => {
    const propPack = {
      values: { ...orgSettings },
      refetch,
      toast,
      getToken: () => accessToken,
    };

    const res: IntegrationOption[] = [
      getWebhookIntegration(propPack, !webhooksEnabled),
      getBentoApiIntegration(propPack),
      getZendeskIntegration(propPack, !zendeskEnabled),
    ];

    return res;
  }, [orgSettings, webhooksEnabled]);

  return (
    <HStack alignItems="start" gap="20">
      <Box>
        <OrgDiagnosticsPanel />
      </Box>
      <Box mt="1">
        <H4 fontSize="18px">Other integrations</H4>
        <Flex pt="2" id="integrations-deck" flexWrap="wrap">
          {INTEGRATIONS.map((integration) => (
            <IntegrationBlock key={integration.name} {...integration} />
          ))}
          {INTEGRATIONS.length === 0 && (
            <Text>Integrations coming very soon!</Text>
          )}
        </Flex>
      </Box>
    </HStack>
  );
}

const INTEGRATIONS_QUERY = graphql`
  query IntegrationsQuery {
    orgSettings {
      bentoApiKey {
        key
        integratedAt
      }
      integrationApiKeys {
        type
        state
        key
      }
      webhooks {
        webhookUrl
        eventType
        state
        secretKey
      }
    }
  }
`;

export default function IntegrationsRenderer() {
  return (
    <QueryRenderer<IntegrationsQuery>
      query={INTEGRATIONS_QUERY}
      render={({ props, retry }) => {
        if (props) {
          return <Integrations refetch={retry} {...props} />;
        } else {
          return <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} />;
        }
      }}
    ></QueryRenderer>
  );
}
