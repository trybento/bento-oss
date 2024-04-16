import React from 'react';
import { Flex, Tab, FlexProps } from '@chakra-ui/react';
import { TAB_STYLE } from 'helpers/uiDefaults';

type Props = {
  tabOptions: { title: string }[];
} & FlexProps;

const TabBar = React.forwardRef<HTMLDivElement, Props>(
  ({ tabOptions, ...flexProps }: Props, ref) => (
    <Flex mt="4" w="full" background="white" ref={ref} {...flexProps}>
      {tabOptions.map(({ title }) => (
        <Tab {...TAB_STYLE} minW="155px" key={title}>
          {title}
        </Tab>
      ))}
    </Flex>
  )
);

export default TabBar;
