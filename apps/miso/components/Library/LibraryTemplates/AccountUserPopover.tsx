import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  PopoverProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { format } from 'date-fns';

import { isIsoDate } from 'bento-common/utils/strings';

import { AccountUserEmailLookupQuery as AccountUserEmailLookupQueryType } from 'relay-types/AccountUserEmailLookupQuery.graphql';
import AccountUserEmailLookupQuery from 'queries/AccountUserEmailLookupQuery';
import { Highlight } from 'components/common/Highlight';
import { useLoggedInUser } from 'providers/LoggedInUserProvider';
import { burstConfetti } from 'utils/helpers';
import { useEasterEggs } from 'hooks/useFeatureFlag';

type AccountUserPopoverProps = {
  accountUserEmail?: string;
  hasAudiences?: boolean;
};

/**
 * Attribute information for a given account user
 */
const AccountUserPopover: React.FC<PopoverProps & AccountUserPopoverProps> = ({
  accountUserEmail,
  trigger = 'hover',
  placement,
  hasAudiences,
  ...props
}) => {
  const {
    loggedInUser: { extra, entityId: userEntityId },
  } = useLoggedInUser();
  const [accountUserInfo, setAccountUserInfo] =
    useState<AccountUserEmailLookupQueryType['response']['accountUser']>(null);

  const fetchAccountUserInfo = useCallback(async () => {
    const response = await AccountUserEmailLookupQuery({ accountUserEmail });

    if (response.accountUser) setAccountUserInfo(response.accountUser);
  }, [accountUserEmail]);

  const clearAccountUserInfo = useCallback(() => {
    /* Prevent spinner showing up a moment before popover closes */
    setTimeout(() => setAccountUserInfo(null), 150);
  }, []);

  const enableEasterEggs = useEasterEggs();

  useEffect(() => {
    if (!enableEasterEggs || !hasAudiences) return;
    void burstConfetti({ key: 'mountedFlightPaths', extra, userEntityId });
  }, [hasAudiences]);

  const attributes = useMemo(() => {
    if (!accountUserInfo?.attributes) return [];

    return Object.entries(accountUserInfo.attributes)
      .map(([key, value]) => {
        /* Format dates */
        const _value = isIsoDate(value)
          ? format(new Date(value), 'MM/dd/yyyy')
          : typeof value === 'boolean'
          ? String(value)
          : value;

        return [key, _value];
      })
      .sort(([keyA, _valA], [keyB, _valB]) => (keyA < keyB ? -1 : 1));
  }, [accountUserInfo?.attributes]);

  if (!accountUserEmail) return null;

  return (
    <Popover
      trigger={trigger}
      placement={placement || 'right-start'}
      onOpen={fetchAccountUserInfo}
      onClose={clearAccountUserInfo}
      {...props}
    >
      <PopoverTrigger>
        <Box
          ml="1"
          fontSize="15px"
          display="inline"
          color="icon.secondary"
          position="relative"
          top="15%"
        >
          <InfoOutlinedIcon fontSize="inherit" />
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          {!accountUserInfo ? (
            <Spinner m="auto" />
          ) : (
            <VStack alignItems="flex-start">
              <Text mb="1">
                {accountUserInfo.fullName ||
                  accountUserInfo.email ||
                  'Anonymous user'}
                , {accountUserInfo.account.name}
              </Text>
              <VStack alignItems="flex-start" gap="1">
                {attributes.map(([key, value]) => {
                  return (
                    <Box>
                      <Highlight>{`user:${key}`}</Highlight> is{' '}
                      <Highlight>{value}</Highlight>
                    </Box>
                  );
                })}
              </VStack>
            </VStack>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default AccountUserPopover;
