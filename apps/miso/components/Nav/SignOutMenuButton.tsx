import React, { useCallback } from 'react';
import NextLink from 'next/link';
import { Menu, MenuButton, MenuItem, MenuList, Link } from '@chakra-ui/react';
import useAccessToken from 'hooks/useAccessToken';
import { useRouter } from 'next/router';
import Settings from '@mui/icons-material/SettingsOutlined';

import Icon from 'system/Icon';

import { useLoggedInUser } from 'providers/LoggedInUserProvider';
import UserCache from 'helpers/UserCache';
import env from '@beam-australia/react-env';
import { DEPLOYED_TO_PRODUCTION } from 'helpers/constants';

const SignOutMenuButton: React.FC = () => {
  const router = useRouter();

  const [isButtonFocused, setIsButtonFocused] = React.useState<boolean>(false);

  const setFocused = useCallback(
    () => setIsButtonFocused(true),
    [setIsButtonFocused]
  );
  const setUnfocused = useCallback(
    () => setIsButtonFocused(false),
    [setIsButtonFocused]
  );

  const API_HOST = env('API_HOST');

  const { accessToken, setAccessToken, removeAccessToken } = useAccessToken();

  const { loggedInUser } = useLoggedInUser();

  const handleChangeOrg = async () => {
    UserCache.invalidateUser();

    const result = await fetch(`${API_HOST}/login/set-organization`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organizationEntityId: null,
      }),
    });

    const data = await result.json();

    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      router.push('/login/select-organization');
    }
  };

  const handleSignOut = () => {
    removeAccessToken();
    UserCache.invalidateUser();
  };

  if (!loggedInUser) return null;

  const isMultiOrg = loggedInUser.isSuperadmin;

  return (
    <Menu placement="right-start">
      <MenuButton
        position="relative"
        p="2"
        mb="16px"
        onMouseEnter={setFocused}
        onMouseLeave={setUnfocused}
      >
        <Icon color={isButtonFocused ? 'white' : 'gray.300'} as={Settings} />
      </MenuButton>
      <MenuList>
        {isMultiOrg && (
          <MenuItem onClick={handleChangeOrg}>
            Switch organization ({loggedInUser.organization.name})
          </MenuItem>
        )}
        <NextLink href="/settings/organization" passHref>
          <MenuItem as={Link}>Org settings</MenuItem>
        </NextLink>
        {!!isMultiOrg && !DEPLOYED_TO_PRODUCTION && (
          <NextLink href="/qa-tools" passHref>
            <MenuItem color="bento.bright" as={Link}>
              QA Tools
            </MenuItem>
          </NextLink>
        )}
        <MenuItem onClick={handleSignOut}>
          Sign out {loggedInUser.fullName}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default SignOutMenuButton;
