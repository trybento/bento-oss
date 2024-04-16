import {
  Flex,
  Box,
  Tab as ChakraTab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs as ChakraTabs,
} from '@chakra-ui/react';
import Head from 'next/head';
import H2 from 'system/H2';
import Breadcrumbs, { Breadcrumb } from '../common/Breadcrumbs';
import { TAB_STYLE } from 'helpers/uiDefaults';
import { useSelectedTab } from 'hooks/useSelectedTab';
import { useEffect, useMemo } from 'react';

interface Tab {
  title: string;
  disabled?: boolean;
  component?: () => React.ReactNode;
  paddingTop?: string | number;
}

interface Props {
  children?: React.ReactNode;
  title: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  tabs?: Tab[];
  /** A node to display instead of header */
  headerComponent?: React.ReactNode;
  onTabIndexChange?: (index: number) => void;
}

const Page: React.FC<Props> = ({
  title,
  children,
  breadcrumbs,
  actions,
  tabs,
  headerComponent,
  onTabIndexChange,
}) => {
  const { selectedTabIndex, onTabChange } = useSelectedTab(tabs || []);

  useEffect(() => {
    onTabIndexChange?.(selectedTabIndex);
  }, [selectedTabIndex]);

  const innerContent = useMemo(
    () => (
      <>
        <Box flex="0 0 auto">
          <Flex flexDirection="column" gap={2} pb={2}>
            {breadcrumbs && <Breadcrumbs trail={breadcrumbs} />}
            <Flex alignItems="center">
              {!headerComponent ? <H2>{title}</H2> : headerComponent}
              {!tabs && <Box ml="auto">{actions}</Box>}
            </Flex>
          </Flex>
          {tabs && (
            <TabList
              boxShadow="0 2px 4px -2px rgb(0 0 0 / 6%)"
              display="flex"
              justifyContent="space-between"
              w="full"
              alignItems="center"
              pt="2"
            >
              <Flex>
                {tabs.map(({ title, disabled }) => (
                  <ChakraTab
                    {...TAB_STYLE}
                    display={disabled ? 'none' : undefined}
                    minWidth="144px"
                    key={title}
                  >
                    {title}
                  </ChakraTab>
                ))}
              </Flex>
              {actions}
            </TabList>
          )}
        </Box>
        <Box
          id="page-content-wrapper"
          flex="1 1 auto"
          position="relative"
          overflowY="auto"
        >
          {tabs && (
            <TabPanels>
              {tabs.map(({ title, component, paddingTop }) => (
                <TabPanel p={0} key={title} w="full">
                  {component && (
                    <Box
                      pt={paddingTop !== undefined ? paddingTop : '8'}
                      pb="8"
                    >
                      {component()}
                    </Box>
                  )}
                </TabPanel>
              ))}
            </TabPanels>
          )}
          <Box pt="8" pb="32">
            {children}
          </Box>
        </Box>
      </>
    ),
    [children, breadcrumbs, actions, tabs]
  );

  const commonPageProperties = useMemo(
    () => ({
      height: '100%',
      px: '16',
      pt: '8',
    }),
    []
  );

  return (
    <Box h="100%">
      <Head>
        <title>{title} | Bento</title>
      </Head>
      {tabs ? (
        <ChakraTabs
          index={selectedTabIndex}
          onChange={onTabChange}
          lazyBehavior="unmount"
          isLazy
          display="flex"
          flexDirection="column"
          {...commonPageProperties}
        >
          {innerContent}
        </ChakraTabs>
      ) : (
        <Flex direction="column" {...commonPageProperties}>
          {innerContent}
        </Flex>
      )}
    </Box>
  );
};

export default Page;
