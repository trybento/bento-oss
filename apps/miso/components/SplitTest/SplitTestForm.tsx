import React, { useCallback, useMemo, useState } from 'react';
import { FormikHelpers, useFormikContext } from 'formik';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
  Flex,
} from '@chakra-ui/react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useRouter } from 'next/router';
import { STANDARD_SHADOW } from 'bento-common/frontend/styles';
import Box from 'system/Box';
import DragAndDropProvider from 'providers/DragAndDropProvider';
import TargetingTab from '../Templates/Tabs/TargetingTab';
import { TAB_STYLE } from 'helpers/uiDefaults';
import {
  changeUrlTabQueryByIndex,
  currentTab,
  getTabIndex,
  EditElementTabLabels,
} from '../EditorCommon/common';
import TemplateTopBar from '../Templates/TemplateTopBar';
import { FocusableIds } from 'hooks/useNextFocus';
import EditableLabel from 'components/EditorCommon/EditableLabel';
import { EditSplitTestProps, SplitTestForm } from './EditSplitTest';
import useToggleState from 'hooks/useToggleState';
import { useTemplate } from 'providers/TemplateProvider';
import { GuideTypeEnum, SplitTestState } from 'bento-common/types';
import Tooltip from 'system/Tooltip';
import AnalyticsTab from 'components/Templates/Tabs/AnalyticsTab';
import TemplateCard from './TemplateCard';
import SplitTestStatus from 'components/Library/SplitTestStatus';

const SplitTestTemplateForm = ({
  query,
  refetch,
}: {
  query: EditSplitTestProps;
  refetch: any;
}) => {
  const router = useRouter();
  const { values, isValid, errors, touched, ...formikHelpers } =
    useFormikContext<SplitTestForm>();
  const { setFieldValue } = formikHelpers as FormikHelpers<any>;
  const inputFocusedState = useToggleState(['name', 'description']);
  const { template } = useTemplate();
  const tabOptions = useMemo(() => {
    return [
      { title: EditElementTabLabels.content },
      { title: EditElementTabLabels.launching },
      { title: EditElementTabLabels.analytics },
    ];
  }, []);

  const tabOptionStrings = useMemo(
    () => tabOptions.map((o) => o.title),
    [tabOptions]
  );

  const [tabIndex, setTabIndex] = useState<number>(
    currentTab(router.query, tabOptionStrings)
  );

  const onTabChange = useCallback((index: number) => {
    changeUrlTabQueryByIndex(index, tabOptionStrings, router);
    setTabIndex(index);
  }, []);

  const isTargetingActive = useMemo(() => {
    return (
      tabIndex === getTabIndex(EditElementTabLabels.launching, tabOptionStrings)
    );
  }, [tabIndex, tabOptionStrings]);

  return (
    <>
      <DragAndDropProvider dragShadow={STANDARD_SHADOW}>
        <Box
          width="100%"
          marginBottom="20px"
          display="flex"
          justifyContent="space-between"
          zIndex={2}
          mt="-2"
        >
          <Box display="flex" flex="1" mr={2}>
            <Box
              flex={inputFocusedState.anyOn ? '1' : null}
              overflow="hidden"
              whiteSpace="nowrap"
              maxW="750px"
            >
              <Box display="flex" flexDir="row">
                <Box
                  maxWidth="600px"
                  w={inputFocusedState.name.isOn ? 'full' : 'auto'}
                >
                  <EditableLabel
                    fontSize="24px"
                    fontWeight="bold"
                    nextFocusTargetId={FocusableIds.templateDescription}
                    mt="3"
                    onFocus={inputFocusedState.name.on}
                    onBlur={inputFocusedState.name.off}
                    initialDisplayTitle={values.templateData.name}
                    onChange={(value: string) =>
                      setFieldValue(`templateData.name`, value)
                    }
                    placeholder="Test name"
                    shouldAutoFocus={!values.templateData.name}
                    isDisabled={false}
                  />
                </Box>

                <HStack m="auto" mb="10px" ml="4">
                  <SplitTestStatus
                    state={values.templateData.splitTestState as SplitTestState}
                  />
                </HStack>
              </Box>
            </Box>
          </Box>
        </Box>

        <Tabs
          id="template-editor-nav"
          index={tabIndex}
          onChange={onTabChange}
          lazyBehavior="keepMounted"
          isLazy
        >
          <TabList
            position="sticky"
            top="0"
            backgroundColor="white"
            zIndex="2"
            boxShadow="0 2px 4px -2px rgb(0 0 0 / 6%)"
            w="full"
          >
            <Box display="flex" justifyContent="space-between" w="full">
              <Box display="flex">
                {tabOptions.map(({ title }) => (
                  <Tab {...TAB_STYLE} minWidth="155px" key={title}>
                    {title}
                  </Tab>
                ))}
              </Box>
              <TemplateTopBar
                templateData={values.templateData as any}
                onRefetch={refetch}
                restrictedMode={false}
              />
            </Box>
          </TabList>
          <TabPanels h="full" position="relative" zIndex="1">
            <TabPanel px="0" py="8" h="full">
              <EditableLabel
                id={FocusableIds.templateDescription}
                initialDisplayTitle={values.templateData.description}
                onFocus={inputFocusedState.description.on}
                onBlur={inputFocusedState.description.off}
                placeholder="Test description (optional)"
                onChange={(value: string) =>
                  setFieldValue(`templateData.description`, value)
                }
                mb="6"
                maxW="lg"
              />
              <Flex fontSize="xl" fontWeight="bold" mb="6">
                Guides in split test
                <Tooltip
                  placement="top"
                  label="Traffic will be split evenly amongst these guides."
                  maxWidth="240px"
                >
                  <Box color="gray.600" ml="2" fontSize="sm">
                    <InfoOutlinedIcon fontSize="inherit" />
                  </Box>
                </Tooltip>
              </Flex>
              <Flex flexDir="column" gap="4">
                {query.splitTest?.splitTargets?.map((t) => (
                  <TemplateCard template={t as any} maxW="800px" h="92px" />
                ))}
              </Flex>
            </TabPanel>
            <TabPanel px="0" py="8" h="full">
              <Box h="full" display="flex" flexDirection="column">
                <TargetingTab
                  template={template as any}
                  stepPrototype={undefined}
                  launchedNpsSurveys={query.launchedNpsSurveys}
                  autoLaunchableTemplates={query.autoLaunchableTemplates as any}
                  currentValues={values as any}
                />
              </Box>
            </TabPanel>
            <TabPanel px="0" py="8">
              <Box h="full" display="flex" flexDirection="column">
                <AnalyticsTab
                  templateEntityId={query.splitTest.entityId}
                  type={GuideTypeEnum.splitTest}
                />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </DragAndDropProvider>
    </>
  );
};

export default SplitTestTemplateForm;
