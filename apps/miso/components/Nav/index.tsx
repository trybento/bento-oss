import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Tooltip } from '@chakra-ui/react';
import BarChart from '@mui/icons-material/BarChart';
import Group from '@mui/icons-material/GroupOutlined';
import { px } from 'bento-common/utils/dom';

import BentoLogo from 'components/BentoLogo';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooksOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import RocketIcon from '@mui/icons-material/RocketLaunchOutlined';
import Box from 'system/Box';
import Icon from 'system/Icon';

import SignOutMenuButton from './SignOutMenuButton';

import { getActiveTab, NavItems, preFetchQuery } from './helpers';
import { useLoggedInUser } from 'providers/LoggedInUserProvider';
import DotIndicator from 'components/common/DotIndicator';
import { MuiSvgIcon } from 'types';

export const NAV_WIDTH_PX = 56;
export const NAV_Z_INDEX = 100;

function BentoButton({ isActive }) {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const setFocused = React.useCallback(
    () => setIsFocused(true),
    [setIsFocused]
  );
  const setUnfocused = React.useCallback(
    () => setIsFocused(false),
    [setIsFocused]
  );

  return (
    <Link href="/" legacyBehavior>
      <Box
        position="relative"
        p="2"
        mb="38px"
        onMouseEnter={setFocused}
        onMouseLeave={setUnfocused}
      >
        <BentoLogo
          color={isActive || isFocused ? 'white' : 'gray.300'}
          w={6}
          h={6}
        />
      </Box>
    </Link>
  );
}

type NavButtonProps = {
  to?: string;
  icon: MuiSvgIcon;
  isActive?: boolean;
  onHover?: (hovered: boolean) => void;
};

function NavButton({ to, icon, isActive, onHover }: NavButtonProps) {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const setHover = (hovered: boolean) => {
    setIsFocused(hovered);
    onHover && hovered && onHover(hovered);
  };

  const setFocused = React.useCallback(() => setHover(true), [setIsFocused]);
  const setUnfocused = React.useCallback(() => setHover(false), [setIsFocused]);

  const href = to || '/';

  return (
    <Link href={href}>
      <Box
        position="relative"
        display="flex"
        p="2"
        pl="0"
        mb="16px"
        onMouseEnter={setFocused}
        onMouseLeave={setUnfocused}
        bg={isActive ? '#eff5ff33' : undefined}
        _hover={{ bg: isActive ? '#eff5ff33' : '#eff5ff1a' }}
        ml="2"
        borderRadius="8px 0px 0px 8px"
      >
        <Icon
          m="auto"
          color={isFocused || isActive ? 'white' : 'gray.300'}
          as={icon}
        />
      </Box>
    </Link>
  );
}

function NavTooltip({ children, label }) {
  return (
    <Tooltip
      label={label}
      placement="right"
      borderRadius="0 6px 6px 0"
      py={2}
      backgroundColor="white"
      color="bento.dark"
      fontSize="sm"
      offset={[0, 1]}
      fontWeight="bold"
    >
      <Box>{children}</Box>
    </Tooltip>
  );
}

const Nav: React.FC = () => {
  const router = useRouter();
  const { loggedInUser } = useLoggedInUser();

  const activeTab = getActiveTab(router);
  const showSettingsDot = loggedInUser?.organization?.hasDiagnosticWarnings;

  return (
    <Box
      bg="bento.dark"
      pos="fixed"
      width={px(NAV_WIDTH_PX)}
      height="100%"
      textAlign="center"
      pt="8px"
      zIndex={NAV_Z_INDEX}
    >
      <BentoButton isActive={router.pathname === '/'} />
      <NavTooltip label="Customers">
        <NavButton
          icon={Group}
          to="/customers"
          isActive={activeTab === NavItems.Customers}
          onHover={() => preFetchQuery(activeTab, NavItems.Customers)}
        />
      </NavTooltip>
      <NavTooltip label="Library">
        <NavButton
          icon={LibraryBooksIcon}
          to="/library"
          isActive={activeTab === NavItems.Library}
          onHover={() => preFetchQuery(activeTab, NavItems.Library)}
        />
      </NavTooltip>
      <NavTooltip label="Command center">
        <NavButton
          icon={RocketIcon}
          to="/command-center"
          isActive={activeTab === NavItems.CommandCenter}
        />
      </NavTooltip>
      <NavTooltip label="Resource center">
        <NavButton
          icon={SchoolOutlined}
          to="/resource-center"
          isActive={activeTab === NavItems.ResourceCenter}
        />
      </NavTooltip>
      <NavTooltip label="Styles">
        <NavButton
          icon={PaletteOutlinedIcon}
          to="/styles"
          isActive={activeTab === NavItems.Styles}
        />
      </NavTooltip>
      <NavTooltip label="Data and integrations">
        <Box position="relative">
          <NavButton
            icon={DeviceHubIcon}
            to="/data-and-integrations"
            isActive={activeTab === NavItems.Integrations}
          />
          {showSettingsDot && <DotIndicator right="10px" top="5px" />}
        </Box>
      </NavTooltip>
      <Box pos="absolute" bottom="0" textAlign="center" width="100%">
        <SignOutMenuButton />
      </Box>
    </Box>
  );
};

export default Nav;
