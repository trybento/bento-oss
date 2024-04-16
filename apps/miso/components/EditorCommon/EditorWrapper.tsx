import React, { ReactNode } from 'react';
import {
  BoxProps,
  Flex,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  TabsProps,
} from '@chakra-ui/react';
import { TAB_STYLE } from 'helpers/uiDefaults';
import { EditorWrapperTab } from './types';

type Props<T extends string> = {
  id?: string;
  /** Tab headers. */
  tabs: EditorWrapperTab<T>[];
  /** Global header that handles saving, delete, etc. */
  topBar?: ReactNode;
  selectedTabIndex?: number;
  /** The tab panels. */
  children?: ReactNode;
  onTabChange?: (index: number) => void;
  tabPanelsProps?: BoxProps;
} & TabsProps;

/**
 * Standard component used accross all
 * edit pages.
 */
const EditorWrapper = <T extends string>({
  id,
  tabs,
  topBar,
  children,
  selectedTabIndex,
  onTabChange,
  tabPanelsProps,
  ...tabsProps
}: Props<T>) => {
  return (
    <Tabs
      id={id}
      lazyBehavior="keepMounted"
      index={selectedTabIndex}
      onChange={onTabChange}
      isLazy
      {...tabsProps}
    >
      <TabList
        position="sticky"
        top="0"
        background="white"
        zIndex="2"
        boxShadow="0 2px 4px -2px rgb(0 0 0 / 6%)"
        w="full"
      >
        <Flex justifyContent="space-between" w="full">
          <Flex>
            {tabs.map(({ title, isDisabled }) => (
              <Tab
                {...TAB_STYLE}
                minWidth="155px"
                key={title}
                isDisabled={isDisabled}
                display={isDisabled ? 'none' : undefined}
              >
                {title}
              </Tab>
            ))}
          </Flex>
          {topBar}
        </Flex>
      </TabList>
      <TabPanels h="full" position="relative" zIndex="1" {...tabPanelsProps}>
        {children}
      </TabPanels>
    </Tabs>
  );
};

export default EditorWrapper;
