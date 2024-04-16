import React from 'react';
import { Flex, FlexProps, Icon } from '@chakra-ui/react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import H5 from 'system/H5';

type Props = {
  title: string;
} & FlexProps;

const TabInfoHeader: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  children,
  ...flexProps
}) => (
  <Flex flexDir="column" mb="4" {...flexProps}>
    <H5 mb="2">{title}</H5>
    <Flex alignItems="center">
      <Icon mr="2" color="gray.500" as={InfoOutlinedIcon} />
      {children}
    </Flex>
  </Flex>
);

export default TabInfoHeader;
