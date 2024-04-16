import React from 'react';
import { BoxProps } from '@chakra-ui/react';
import { px } from 'bento-common/utils/dom';

import Box from 'components/system/Box';
import Nav, { NAV_WIDTH_PX } from 'components/Nav';

interface AppWrapperProps extends BoxProps {
  children: React.ReactNode;
}

export const APP_CONTENT_ID = 'appContentWrapper';

const AppWrapper: React.FC<AppWrapperProps> = ({
  children,
  ...contentWrapperProps
}) => (
  <Box display="flex" height="100vh" backgroundColor="white" color="gray.700">
    <Nav />
    <Box
      id={APP_CONTENT_ID}
      paddingLeft={px(NAV_WIDTH_PX)}
      width="100%"
      {...contentWrapperProps}
    >
      {children}
    </Box>
  </Box>
);

export default AppWrapper;
