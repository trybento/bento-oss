import React from 'react';
import { Flex, BoxProps } from '@chakra-ui/react';
import Text from 'system/Text';
import NextLink from 'next/link';
import Link from 'system/Link';
import SingleAccordion from 'components/common/SingleAccordion';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import TemplateManuallyLaunchedQuery from 'queries/TemplateManuallyLaunchedQuery';
import { TemplateManuallyLaunchedQuery$data } from 'relay-types/TemplateManuallyLaunchedQuery.graphql';

type Props = {
  templateEntityId: string;
  manuallyLaunchedAccounts: TemplateManuallyLaunchedQuery$data['template']['manuallyLaunchedAccounts'];
} & BoxProps;

const MAX_ACCOUNTS = 3;

const TargetingManuallyLaunchedAccounts: React.FC<Props> = ({
  templateEntityId,
  manuallyLaunchedAccounts = [],
  ...rest
}) => {
  if (manuallyLaunchedAccounts.length === 0) {
    return null;
  }

  return (
    <SingleAccordion title="Manually launched accounts" {...rest}>
      <Flex direction="column" alignContent="flex-start" gap={2}>
        <Text fontSize="xs">
          This experience was explicitly launched to some accounts from their
          Customers page. To see all the accounts that have this experience,
          view the{' '}
          <Link
            as={NextLink}
            color="bento.bright"
            href={`/library/templates/${templateEntityId}?tab=analytics`}
          >
            analytics page.
          </Link>
        </Text>
        {manuallyLaunchedAccounts
          .slice(0, MAX_ACCOUNTS)
          .map(({ entityId, name }) => (
            <Text key={`account-${entityId}`}>
              <Link href={`/customers/${entityId}`}>
                <b>{name}</b>
              </Link>
            </Text>
          ))}
        {manuallyLaunchedAccounts.length > MAX_ACCOUNTS && (
          <Text fontSize="xs">
            <i>+{manuallyLaunchedAccounts.length - MAX_ACCOUNTS} more</i>
          </Text>
        )}
      </Flex>
    </SingleAccordion>
  );
};

export default TargetingManuallyLaunchedAccounts;
