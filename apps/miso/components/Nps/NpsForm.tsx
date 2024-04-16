import React, { useMemo } from 'react';
import { TabPanel, HStack, Flex } from '@chakra-ui/react';
import Box from 'system/Box';
import useToggleState from 'hooks/useToggleState';
import { EditElementTabLabels } from '../EditorCommon/common';
import { EditorWrapperTab } from 'components/EditorCommon/types';
import EditorWrapper from 'components/EditorCommon/EditorWrapper';
import NpsTopBar from './NpsTopBar';
import { useSelectedTab } from 'hooks/useSelectedTab';
import EditableLabel from 'components/EditorCommon/EditableLabel';
import { useNpsProvider } from './NpsProvider';
import TextField from 'components/common/InputFields/TextField';
import SwitchField from 'components/common/InputFields/SwitchField';
import { NpsFollowUpQuestionType } from 'bento-common/types/netPromoterScore';
import { EDITOR_LEFT_WIDTH } from 'helpers/constants';
import NpsAnalytics from './NpsAnalytics';
import NpsTargetingTab from './NpsTargetingTab';
import TableRendererProvider from 'components/TableRenderer/TableRendererProvider';
import NpsSurveyStatus from 'components/Library/NpsSurveyStatus';

const NpsForm = () => {
  const {
    entityId,
    name,
    nameChange,
    fupType,
    fupSettings,
    state,
    question,
    questionChange,
    fupQuestionChange,
    fupTypeChange,
  } = useNpsProvider();
  const inputFocusedState = useToggleState(['name', 'description']);

  const tabOptions: EditorWrapperTab<EditElementTabLabels>[] = useMemo(() => {
    return [
      { title: EditElementTabLabels.content },
      { title: EditElementTabLabels.targeting },
      { title: EditElementTabLabels.analytics },
    ];
  }, []);

  const { selectedTabIndex, onTabChange } = useSelectedTab(tabOptions);

  return (
    <>
      <Flex
        width="100%"
        marginBottom="20px"
        justifyContent="space-between"
        zIndex={2}
        mt="-2"
      >
        <Flex flex="1" mr={2}>
          <Box
            flex={inputFocusedState.anyOn ? '1' : null}
            overflow="hidden"
            whiteSpace="nowrap"
            maxW="750px"
          >
            <Flex flexDir="row">
              <Box
                maxWidth="600px"
                w={inputFocusedState.name.isOn ? 'full' : 'auto'}
              >
                <EditableLabel
                  fontSize="24px"
                  fontWeight="bold"
                  mt="3"
                  onFocus={inputFocusedState.name.on}
                  onBlur={inputFocusedState.name.off}
                  initialDisplayTitle={name}
                  onChange={nameChange}
                  shouldAutoFocus={!name}
                />
              </Box>

              <HStack m="auto" mb="10px" ml="4">
                <NpsSurveyStatus state={state} />
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Flex>

      <EditorWrapper
        id="nps-editor-nav"
        selectedTabIndex={selectedTabIndex}
        onTabChange={onTabChange}
        tabs={tabOptions}
        topBar={<NpsTopBar />}
        tabPanelsProps={{ pt: 8 }}
      >
        <TabPanel p="0" h="full">
          <Flex gap="20">
            <Flex flexDir="column" w={EDITOR_LEFT_WIDTH} flex="none">
              <TextField
                label="NPS question"
                onChange={questionChange}
                defaultValue={question}
                fontSize="sm"
                mb="6"
              />
              <SwitchField
                onChange={fupTypeChange}
                checkedOption={{
                  value: NpsFollowUpQuestionType.universal,
                  label: 'Ask follow up question',
                }}
                uncheckedOption={{ value: NpsFollowUpQuestionType.none }}
                defaultValue={fupType}
                as="checkbox"
                fontSize="sm"
              />
              {fupType === NpsFollowUpQuestionType.universal && (
                <TextField
                  label="Follow up question"
                  onChange={fupQuestionChange}
                  defaultValue={fupSettings?.universalQuestion || ''}
                  fontSize="sm"
                  mt="4"
                />
              )}
            </Flex>
            {/* TO BE USED SOON.
            <InlineContentPreview
              component={BentoComponentsEnum.banner}
              formFactorStyle={{}}
              previewBoxProps={{ py: 0 }}
              contextual
            /> */}
          </Flex>
        </TabPanel>
        <TabPanel p="0" h="full">
          <NpsTargetingTab />
        </TabPanel>
        <TabPanel p="0" h="full">
          <TableRendererProvider>
            <NpsAnalytics npsSurveyEntityId={entityId} />
          </TableRendererProvider>
        </TabPanel>
      </EditorWrapper>

      {/* <UnsavedChangesModal
        isOpen={isUnsavedChangesModalOpen}
        onClose={handleCloseUnsavedChangesModal}
        onContinue={handleContinueUnsavedChanges}
        onDiscard={onChangesDiscarded}
      /> */}
    </>
  );
};

export default NpsForm;
