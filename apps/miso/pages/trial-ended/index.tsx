import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import { Flex, Text, Box, Link } from '@chakra-ui/react';
import { px } from 'bento-common/utils/dom';

import LoggedInUserProvider, {
  useOrganization,
} from 'providers/LoggedInUserProvider';
import useAccessToken from 'hooks/useAccessToken';
import { OrganizationStateType } from 'types';
import UserCache from 'helpers/UserCache';
import { TAB_TITLE } from 'utils/constants';
import env from '@beam-australia/react-env';

const redirectUrl = `${env('CLIENT_HOST')}/?redirectIfGuideComplete=true`;

function TrialEndedWall(): JSX.Element {
  const { removeAccessToken } = useAccessToken();
  const { organization } = useOrganization();

  /**
   * If the Org is active but the User somehow ends up here,
   * simply redirect back to the app.
   */
  useEffect(() => {
    if (organization.state !== OrganizationStateType.inactive) {
      window.location.href = redirectUrl;
      return;
    }
  }, [organization]);

  const handleSignOut = useCallback(() => {
    removeAccessToken();
    UserCache.invalidateUser();
  }, [removeAccessToken]);

  return (
    <Flex alignItems="center" direction="column">
      <Box textAlign="center" width={px(600)}>
        <Text fontSize="40px" fontWeight="bold" mb="8">
          Your trial of Bento has ended
        </Text>
        <Text fontSize="md">
          Please contact{' '}
          <Link href="mailto:support@trybento.co" fontWeight="bold">
            support@trybento.co
          </Link>{' '}
          if you'd like to reactivate your account.
        </Text>
        <Box mt={8}>
          <Link onClick={handleSignOut}>Sign out</Link>
        </Box>
      </Box>
    </Flex>
  );
}

const TrialEndedPage: React.FC = () => {
  return (
    <Flex width="100%" height="100vh" align="center" justify="center">
      <Head>
        <title>{TAB_TITLE}</title>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <LoggedInUserProvider>
        <TrialEndedWall />
      </LoggedInUserProvider>
    </Flex>
  );
};

export default TrialEndedPage;
