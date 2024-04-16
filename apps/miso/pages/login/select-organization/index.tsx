import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Head from 'next/head';

import useAccessToken from 'hooks/useAccessToken';
import Button from 'system/Button';
import Select from 'system/Select';

import { Flex, Stack, useToast } from '@chakra-ui/react';

import Text from 'system/Text';
import { TAB_TITLE } from 'utils/constants';
import { useRouter } from 'next/router';
import env from '@beam-australia/react-env';

export default function SelectOrganization(): JSX.Element {
  const API_HOST = env('API_HOST');
  const { accessToken, setAccessToken } = useAccessToken();
  const accessTokenRef = useRef<string | undefined>(undefined);
  const [orgs, setOrgs] = useState([]);
  const [selectedOrgEntityId, setSelectedOrgEntityId] = useState(null);
  const router = useRouter();
  const toast = useToast({ id: 'select-org', isClosable: true });

  const fetchUserOrganizations = useCallback(async () => {
    /**
     * Protects against fetching without a token, re-fething orgs
     * when we the token is the same, and re-fetching when we have already
     * selected an org since this is supposed to change the token.
     */
    if (
      !accessToken ||
      accessTokenRef.current === accessToken ||
      selectedOrgEntityId
    )
      return;

    const result = await fetch(`${API_HOST}/login/organizations`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await result.json();

    // if request fails or there is no organizations available
    if (result.status > 400 || !data?.organizations?.length) {
      return router.push('/login');
    }

    // memoizes the accessToken last used when fetching
    accessTokenRef.current = accessToken;

    // when a single org is found...
    if (data.organizations.length === 1) {
      setOrgs(data.organizations);
      setSelectedOrgEntityId(data.organizations[0].entityId);
      return;
    }

    // when there are many orgs...
    setOrgs(data.organizations);
  }, [accessToken, orgs, selectedOrgEntityId]);

  useEffect(() => {
    fetchUserOrganizations();
  }, [accessToken]);

  useEffect(() => {
    if (orgs.length === 1 && selectedOrgEntityId) handleSetUserOrganization();
  }, [orgs, selectedOrgEntityId]);

  const handleSetUserOrganization = useCallback(async () => {
    if (!selectedOrgEntityId) return null;

    const result = await fetch(`${API_HOST}/login/set-organization`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organizationEntityId: selectedOrgEntityId,
      }),
    });

    if (result.status >= 400) {
      toast({ title: 'Something went wrong', status: 'error' });
      return;
    }

    const data = await result.json();
    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.location = '/?redirectIfGuideComplete=true';
      }
    }
  }, [selectedOrgEntityId, accessToken]);

  const orgOptions = useMemo(
    () =>
      orgs.map((org) => ({
        label: org.name,
        value: org.entityId,
      })),
    [orgs]
  );

  return (
    <Flex width="100%" height="100vh" align="center" justify="center">
      <Head>
        <title>{TAB_TITLE}</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Stack spacing="8" align="center">
        <Text color="b-primary.300" fontSize="40px" fontWeight="bold">
          Select an organization
        </Text>
        <Select
          options={orgOptions}
          onChange={(option) => {
            setSelectedOrgEntityId(option.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSetUserOrganization();
            }
          }}
          styles={{
            container: (provided) => ({
              ...provided,
              minWidth: '220px',
            }),
          }}
        />
        <Button
          bg="b-primary.300"
          isDisabled={!selectedOrgEntityId}
          onClick={handleSetUserOrganization}
        >
          Log in
        </Button>
      </Stack>
    </Flex>
  );
}
