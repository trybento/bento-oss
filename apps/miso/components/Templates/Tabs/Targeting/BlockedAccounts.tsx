import React, { useCallback, useMemo } from 'react';
import { Box, BoxProps, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import Link from 'system/Link';
import Text from 'system/Text';
import SingleAccordion from 'components/common/SingleAccordion';
import { BlockedAccountsQuery$data } from 'relay-types/BlockedAccountsQuery.graphql';

type Props = {
  blockedAccounts: BlockedAccountsQuery$data['accounts'];
} & BoxProps;

const DISPLAY_LIMIT = 3;

const TargetingBlockedAccounts: React.FC<Props> = ({
  blockedAccounts = [],
  ...rest
}) => {
  const router = useRouter();

  const handleGoToSettings = useCallback(() => {
    router.push('/command-center?tab=blocked%20accounts');
  }, [router]);

  const displayedAccounts = useMemo(
    () => blockedAccounts?.slice(0, DISPLAY_LIMIT) || [],
    [blockedAccounts]
  );

  if (!blockedAccounts || blockedAccounts.length === 0) return null;

  return (
    <SingleAccordion title="Blocked accounts" {...rest}>
      <VStack textAlign="left" gap="2">
        <Box fontSize="xs" w="full">
          Blocked accounts will always be excluded from getting guides. View and
          manage all blocked accounts in the{' '}
          <Link
            size="sm"
            fontWeight="semibold"
            color="blue.500"
            onClick={handleGoToSettings}
          >
            Command center
          </Link>
        </Box>
        <VStack w="full" alignItems="flex-start">
          {displayedAccounts.map((a, i) => (
            <Text key={i}>
              <Link href={`/customers/${a.entityId}`}>
                <b>{a.name}</b>
              </Link>
            </Text>
          ))}
          {blockedAccounts.length > DISPLAY_LIMIT && (
            <Box fontSize="xs" fontStyle="italic">{`+ ${
              blockedAccounts.length - DISPLAY_LIMIT
            } more`}</Box>
          )}
        </VStack>
      </VStack>
    </SingleAccordion>
  );
};

export default TargetingBlockedAccounts;
