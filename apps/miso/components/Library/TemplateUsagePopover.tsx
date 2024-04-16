import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { graphql } from 'react-relay';
import NextLink from 'next/link';
import Link from 'system/Link';

import QueryRenderer from 'components/QueryRenderer';
import { TemplateUsagePopoverQuery } from 'relay-types/TemplateUsagePopoverQuery.graphql';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { pluralize } from 'bento-common/utils/pluralize';

interface ContainerProps {
  templateEntityId: string;
}

type TemplateUsagePopoverQueryResponse = TemplateUsagePopoverQuery['response'];

interface Props extends TemplateUsagePopoverQueryResponse {
  templateEntityId: string;
}

/**
 *
 * @deprecated Not in use because the numbers are confusing. We may revisit tho
 */
function TemplateUsagePopover({ template, templateEntityId }: Props) {
  if (!template) return null;

  const { usage } = template;

  return (
    <Box display="grid" padding="1em 0em 1em 1em">
      <Text color="gray.600">Based on your auto-launch rules:</Text>
      <Text marginBottom={2} fontWeight="bold">
        {`${usage.autoLaunchedAccounts} ${pluralize(
          usage.autoLaunchedAccounts,
          'account'
        )} and ${usage.autoLaunchedUsers} ${pluralize(
          usage.autoLaunchedUsers,
          'user'
        )} have received this guide`}
      </Text>
      <Text color="gray.600">Based on your manual launch history:</Text>
      <Text marginBottom={2} fontWeight="bold">
        {`${usage.manualLaunchedAccounts} ${pluralize(
          usage.manualLaunchedAccounts,
          'account'
        )} and ${usage.manualLaunchedUsers} ${pluralize(
          usage.manualLaunchedUsers,
          'user'
        )} have received this guide`}
      </Text>
      <NextLink href={`/library/templates/${templateEntityId}?tab=analytics`}>
        <Link color="bento.bright">View performance</Link>
      </NextLink>
    </Box>
  );
}

const TEMPLATE_USAGE_QUERY = graphql`
  query TemplateUsagePopoverQuery($templateEntityId: EntityId!) {
    template: findTemplate(entityId: $templateEntityId) {
      usage {
        autoLaunchedAccounts
        autoLaunchedUsers
        manualLaunchedAccounts
        manualLaunchedUsers
      }
    }
  }
`;

export default function TemplateUsagePopoverQueryRenderer({
  templateEntityId,
}: ContainerProps) {
  if (!templateEntityId) return null;

  return (
    <QueryRenderer<TemplateUsagePopoverQuery>
      query={TEMPLATE_USAGE_QUERY}
      variables={{
        templateEntityId,
      }}
      render={({ props }) => {
        return props ? (
          <TemplateUsagePopover
            {...props}
            templateEntityId={templateEntityId}
          />
        ) : (
          <Box my="2">
            <BentoLoadingSpinner />
          </Box>
        );
      }}
    />
  );
}
