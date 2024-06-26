import React, { useCallback, useEffect, useMemo } from 'react';
import { FormikHelpers, useFormikContext } from 'formik';
import {
  TabPanel,
  HStack,
  Flex,
  Text,
  Icon,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import get from 'lodash/get';

import { STANDARD_SHADOW } from 'bento-common/frontend/styles';
import {
  GuideFormFactor,
  Theme,
  TemplateState,
  GuideTypeEnum,
} from 'bento-common/types';
import { guideNameOrFallback } from 'bento-common/utils/naming';
import {
  isGuideInActiveSplitTest,
  isGuideInDraftSplitTest,
} from 'bento-common/data/helpers';
import {
  BranchingType,
  TemplateModuleValue,
} from 'bento-common/types/templateData';
import { isSidebarContextualGuide } from 'bento-common/utils/formFactor';

import { ModuleOption, ComposedComponentsEnum } from 'types';
import { filterAllowedModules, getModuleOptions } from 'helpers';
import Link from 'system/Link';
import Box from 'system/Box';
import Button from 'system/Button';
import { MainFormKeys } from 'helpers/constants';
import useToast from 'hooks/useToast';
import { useTemplate } from 'providers/TemplateProvider';
import useToggleState from 'hooks/useToggleState';

import SelectedStep from 'components/GuideForm/SelectedStep/SelectedStep';
import DragAndDropProvider from 'providers/DragAndDropProvider';
import UnsavedChangesModal from 'components/UnsavedChangesModal';
import ModuleDetailsModal from 'components/Library/ModuleDetailsModal';
import TemplateStatus, { LayoutBadge } from '../Library/TemplateStatus';
import TemplateModules from './TemplateModules';
import { TemplateFormValues } from './Template';
import EditableLabel from '../EditorCommon/EditableLabel';
import { TemplateFormProps } from './EditTemplate';
import TargetingTab from './Tabs/TargetingTab';
import HistoryTab from './Tabs/HistoryTab';
import { useAllModules } from 'providers/AllModulesProvider';
import AnalyticsTab from './Tabs/AnalyticsTab';
import StyleTab from './Tabs/StyleTab';
import { EditElementTabLabels } from '../EditorCommon/common';
import { FormEntityType } from 'components/GuideForm/types';
import TemplateTopBar from './TemplateTopBar';
import VideoGalleryForm from 'components/GuideForm/VideoGalleryForm';
import { InfoCallout } from 'bento-common/components/CalloutText';
import AutoGenerateContentModal, {
  AutoGeneratedContentLoadingModal,
} from './BentoAIBuilder/AutoGenerateContentModal';
import BootstrapTemplateModal from './EditTemplate/BootstrapTemplateModal';
import { useBootstrapHooks } from './Tabs/templateTabs.helpers';
import { useOrganization } from 'providers/LoggedInUserProvider';
import { INTERNAL_TEMPLATE_ORG } from 'bento-common/utils/constants';
import InlineContentPreview from '../EditorCommon/InlineContentPreview';
import { EditorWrapperTab } from 'components/EditorCommon/types';
import EditorWrapper from 'components/EditorCommon/EditorWrapper';
import { useSelectedTab } from 'hooks/useSelectedTab';
import { transformGeneratedGuideContent } from './BentoAIBuilder/autoGenerateContent.helpers';
import { GPTGeneratedGuide } from 'bento-common/types/integrations';
import TargetingAudienceProvider from 'components/EditorCommon/Audiences/TargetingAudiencesProvider';

const formEntityType = FormEntityType.template;

const TemplateForm = ({
  query,
  initialSelectedStepPrototype,
  refetch,
}: TemplateFormProps) => {
  const toast = useToast();
  const { values, isValid, errors, touched, dirty, ...formikHelpers } =
    useFormikContext<TemplateFormValues>();

  const { setFieldValue } = formikHelpers as FormikHelpers<TemplateFormValues>;

  const { autoLaunchableTemplates, launchedNpsSurveys } = query;

  const {
    template,
    isTemplate,
    isAnnouncement,
    isTooltip,
    isFlow,
    isTargetedForSplitTesting,
    isCard,
    isVideoGallery,
    tempModuleRef,
    handleSaveWithPropagation,
    handleContinueUnsavedChanges,
    handleModuleDuplicate,
    onChangesDiscarded,
    handleNewElementFromBranching,
    handleCloseUnsavedChangesModal,
    isUnsavedChangesModalOpen,
    canEditTemplate,
    namePlaceholder,
    selectedStep,
    selectedTag,
    guideTitleInputKey,
    setGuideTitles,
    modalStates,
    rteRenderKey,
  } = useTemplate();
  const { formFactor, state, theme, isCyoa } = template;

  const inputFocusedState = useToggleState(['name', 'description']);
  const { modules } = useAllModules();
  const [bootstrapping, setBootstrapping] = useBootstrapHooks(
    modalStates.bootstrap.on
  );
  const {
    organization: { slug: orgSlug },
  } = useOrganization();

  const isInActiveSplitTest = isGuideInActiveSplitTest(
    isTargetedForSplitTesting
  );
  const isInDraftSplitTest = isGuideInDraftSplitTest(isTargetedForSplitTesting);
  const isReadonlyForm = isTemplate || isInActiveSplitTest;
  const isEmptyGuide = values.templateData.modules.length === 0;
  const isOnboardingGuide = !template.isSideQuest;
  const isContextualChecklist = isSidebarContextualGuide(
    template as {
      formFactor: GuideFormFactor;
      theme: Theme;
      isSideQuest: boolean;
    }
  );
  const isBentoTemplatingOrg = orgSlug === INTERNAL_TEMPLATE_ORG;

  const moduleOptions: ModuleOption[] = getModuleOptions(modules, {
    branchingTypes: true,
  });

  const isChecklist = isOnboardingGuide || isContextualChecklist;

  const tabOptions: EditorWrapperTab<EditElementTabLabels>[] = useMemo(() => {
    return [
      { title: EditElementTabLabels.content },
      {
        title:
          isCyoa || isChecklist
            ? EditElementTabLabels.checklistStyle
            : EditElementTabLabels.style,
      },
      {
        title: EditElementTabLabels.launching,
        isDisabled: isReadonlyForm,
      },
      { title: EditElementTabLabels.history, isDisabled: isTemplate },
      { title: EditElementTabLabels.analytics, isDisabled: isTemplate },
    ];
  }, [isCyoa, isTemplate, isReadonlyForm]);

  const { selectedTabIndex, onTabChange } = useSelectedTab(tabOptions);

  useEffect(() => {
    /*
     * Name changed and we are in bootstrap setup state, submit changes and exit state
     * Necessary because Formik/setStates are async
     */
    if (bootstrapping && dirty) {
      setBootstrapping(false);
      setTimeout(() => handleSaveWithPropagation().then(refetch), 0);
    }
  }, [dirty, bootstrapping, handleSaveWithPropagation, refetch]);

  const allowedModules = useMemo(
    () =>
      filterAllowedModules(
        moduleOptions,
        values.templateData,
        theme as Theme,
        isCyoa
      ),
    [moduleOptions, values.templateData, theme, isCyoa]
  );

  const onCreateModule = useCallback(
    async (
      {
        setFieldValue,
        values,
      }: {
        setFieldValue: FormikHelpers<TemplateFormValues>['setFieldValue'];
        values: TemplateFormValues;
      },
      newElement: { [key: string]: any; entityId: string }
    ) => {
      const newModuleIdx = values.templateData.modules.length;
      setFieldValue(`templateData.modules.[${newModuleIdx}]`, newElement);

      tempModuleRef.current = newElement as TemplateModuleValue;

      // Shows success toast and re-fetches.
      handleNewElementFromBranching(BranchingType.module);
    },
    []
  );

  const handleContentGenerated = useCallback((content: GPTGeneratedGuide) => {
    setGuideTitles(content.guideTitle);

    setFieldValue(
      'templateData.modules.[0]',
      transformGeneratedGuideContent(content)
    );

    toast({
      title: 'Guide generated!',
      status: 'success',
    });

    modalStates.autoGenerate.off();

    onTabChange(
      tabOptions.findIndex(
        (t) =>
          t.title === EditElementTabLabels.preview ||
          t.title === EditElementTabLabels.checklistStyle ||
          t.title === EditElementTabLabels.style
      )
    );
  }, []);

  const handleAutoGenerateError = useCallback((message?: string) => {
    toast({
      title: message || 'Something went wrong',
      status: 'error',
    });
  }, []);

  /**
   * Little hack to be able to add visual tags to everboarding
   * guides at first, bc atm they can only be tied to a step.
   */
  const firstStepPrototype = useMemo(
    () => template?.modules[0]?.stepPrototypes[0],
    [template?.modules[0]?.stepPrototypes[0]]
  );

  // Announcements.
  const firstStepKey = `${MainFormKeys.template}.modules[0].stepPrototypes[0]`;
  const firstStep =
    isAnnouncement || isTooltip || isCard ? get(values, firstStepKey) : null;

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
                  key={`guide-name-${guideTitleInputKey}`}
                  fontSize="24px"
                  fontWeight="bold"
                  mt="3"
                  onFocus={inputFocusedState.name.on}
                  onBlur={inputFocusedState.name.off}
                  initialDisplayTitle={values.templateData.name}
                  onChange={(value: string) =>
                    setFieldValue(`templateData.name`, value)
                  }
                  placeholder={namePlaceholder}
                  shouldAutoFocus={!values.templateData.name}
                  isDisabled={!canEditTemplate}
                />
              </Box>

              <HStack m="auto" mb="10px" ml="4">
                {(!template.isSideQuest ||
                  template.formFactor === GuideFormFactor.inline ||
                  isFlow) && (
                  <LayoutBadge
                    theme={template.theme as Theme}
                    isCyoa={template.isCyoa}
                    formFactor={formFactor as GuideFormFactor}
                  />
                )}
                <TemplateStatus
                  state={state as TemplateState}
                  isTemplate={template.isTemplate}
                />
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Flex>

      <TargetingAudienceProvider>
        <EditorWrapper
          id="template-editor-nav"
          selectedTabIndex={selectedTabIndex}
          onTabChange={onTabChange}
          tabs={tabOptions}
          topBar={
            <TemplateTopBar
              templateData={values.templateData}
              onRefetch={refetch}
              restrictedMode={isTemplate || !!template.archivedAt}
              isBentoTemplatingOrg={isBentoTemplatingOrg}
            />
          }
        >
          <TabPanel px="0" h="full">
            <DragAndDropProvider dragShadow={STANDARD_SHADOW}>
              <Flex h="full" flexDirection="column">
                {(isInActiveSplitTest || isInDraftSplitTest) && (
                  <InfoCallout mt="4" mb="5" maxW="940px" pr="2">
                    <Flex gap="6">
                      {isInActiveSplitTest ? (
                        <Box>
                          This guide is part of an active split test,{' '}
                          <i>
                            “
                            {guideNameOrFallback(template.splitSources[0].name)}
                            ”
                          </i>
                          . Guides in an active split test cannot have their
                          content changed. Stop a test to edit this guide.
                        </Box>
                      ) : (
                        <Box>
                          This guide is part of a split test,{' '}
                          <i>
                            “
                            {guideNameOrFallback(template.splitSources[0].name)}
                            ”
                          </i>
                          . Once the test is launched and live, you will not be
                          able to edit this guide’s content. While part of the
                          split test, this guide can only be launched as part of
                          the test.
                        </Box>
                      )}

                      <Link
                        whiteSpace="nowrap"
                        color="bento.bright"
                        my="auto"
                        href={`/library/split-tests/${template.splitSources[0].entityId}`}
                        target="_blank"
                      >
                        View split test
                      </Link>
                    </Flex>
                  </InfoCallout>
                )}
                {/** Content editor */}
                <Flex
                  flexDir={isFlow ? 'row' : 'column'}
                  gridGap={isFlow ? '10' : undefined}
                  mt={isFlow ? '4' : undefined}
                >
                  {!isAnnouncement &&
                    !isTooltip &&
                    !isCard &&
                    !isVideoGallery && (
                      <>
                        {!isFlow && (
                          <EditableLabel
                            initialDisplayTitle={
                              values.templateData.description
                            }
                            onFocus={inputFocusedState.description.on}
                            onBlur={inputFocusedState.description.off}
                            placeholder="Guide description (optional)"
                            onChange={(value: string) =>
                              setFieldValue(`templateData.description`, value)
                            }
                            isDisabled={!canEditTemplate}
                            mb="1"
                            maxW="lg"
                          />
                        )}
                        <TemplateModules
                          onModuleDuplicate={handleModuleDuplicate}
                          handleCreateModule={modalStates.creatingModule.on}
                          templateValue={values.templateData}
                          allModules={modules}
                          allowedModules={allowedModules}
                          canDelete={!isFlow}
                          formEntityType={formEntityType}
                          formFactor={formFactor}
                          formFactorStyle={values.templateData.formFactorStyle}
                          disabled={!canEditTemplate}
                          initialSelectedStepPrototype={
                            initialSelectedStepPrototype
                          }
                          disabledAddStepGroupBtn={isFlow}
                          theme={theme}
                          isCyoa={isCyoa}
                          rteRenderKey={rteRenderKey}
                          {...(isFlow && { w: '580px', flex: 'none' })}
                        />
                        {isFlow && (
                          <InlineContentPreview
                            component={ComposedComponentsEnum.flow}
                            tagType={selectedTag?.type}
                            tagStyle={selectedTag?.style}
                            selectedStep={selectedStep}
                            formFactorStyle={
                              values.templateData.formFactorStyle
                            }
                            previewBoxProps={{ py: 0 }}
                            contextual
                          />
                        )}

                        {isEmptyGuide &&
                          (isOnboardingGuide || isContextualChecklist) && (
                            <Flex mt="16">
                              <Flex
                                flexDir="column"
                                gap="6"
                                justifyContent="center"
                                mx="auto"
                              >
                                <Box fontWeight="bold">✨ Now in beta</Box>
                                <Box>
                                  <Box>
                                    Let us auto-magically generate your guide
                                    for you.
                                  </Box>
                                  <Box>All you'll need is:</Box>
                                  <UnorderedList pl="2">
                                    <ListItem>
                                      A recording of yourself walking through
                                      your onboarding flow
                                    </ListItem>
                                    <ListItem>
                                      Grab the transcript (tools like Loom will
                                      generate that for you!)
                                    </ListItem>
                                  </UnorderedList>
                                </Box>

                                <Button
                                  variant="secondary"
                                  mx="auto"
                                  onClick={modalStates.autoGenerate.on}
                                >
                                  <Icon
                                    w="16px"
                                    h="16px"
                                    as={LightbulbOutlinedIcon}
                                  />
                                  <Text ml="1">Generate my guide!</Text>
                                </Button>
                              </Flex>
                            </Flex>
                          )}
                      </>
                    )}
                  {(isAnnouncement || isTooltip || isCard) && firstStep && (
                    <SelectedStep
                      formFactor={formFactor as GuideFormFactor}
                      formEntityType={formEntityType}
                      formKey={firstStepKey}
                      isCyoa={isCyoa}
                      guideType={values.templateData.type}
                      stepValue={firstStep}
                      theme={theme as Theme}
                      formFactorStyle={values.templateData.formFactorStyle}
                      templateEntityId={template.entityId}
                      contextual={isTooltip || isCard}
                      isSelected
                      rteRenderKey={rteRenderKey}
                    />
                  )}
                  {isVideoGallery && (
                    <VideoGalleryForm formEntityType={formEntityType} />
                  )}
                </Flex>
              </Flex>
            </DragAndDropProvider>
          </TabPanel>

          <TabPanel px="0" h="full">
            <Flex h="full" flexDirection="column">
              <StyleTab
                templateEntityId={template.entityId}
                formFactor={formFactor as GuideFormFactor}
                guideType={values.templateData.type as GuideTypeEnum}
                step={selectedStep || firstStep}
                formEntityType={FormEntityType.template}
                formFactorStyle={values.templateData.formFactorStyle}
              />
            </Flex>
          </TabPanel>
          <TabPanel py="8" px="0" h="full">
            <Flex h="full" flexDirection="column">
              <TargetingTab
                template={template}
                stepPrototype={firstStepPrototype as any}
                autoLaunchableTemplates={autoLaunchableTemplates}
                launchedNpsSurveys={launchedNpsSurveys}
                currentValues={values}
              />
            </Flex>
          </TabPanel>
          <TabPanel px="0" py="8">
            <Flex h="full" flexDirection="column">
              <HistoryTab templateEntityId={template.entityId} />
            </Flex>
          </TabPanel>
          <TabPanel px="0">
            <Flex h="full" flexDirection="column">
              <AnalyticsTab templateEntityId={template.entityId} />
            </Flex>
          </TabPanel>
        </EditorWrapper>
      </TargetingAudienceProvider>

      <UnsavedChangesModal
        isOpen={isUnsavedChangesModalOpen}
        onClose={handleCloseUnsavedChangesModal}
        onContinue={handleContinueUnsavedChanges}
        onDiscard={onChangesDiscarded}
      />
      <ModuleDetailsModal
        isOpen={modalStates.creatingModule.isOn}
        onClose={modalStates.creatingModule.off}
        onCreate={(newModule) =>
          onCreateModule({ setFieldValue, values }, newModule)
        }
        theme={theme as Theme}
        guideFormFactor={formFactor as GuideFormFactor}
        minimal
      />
      <AutoGenerateContentModal
        isOpen={modalStates.autoGenerate.isOn}
        onCancel={modalStates.autoGenerate.off}
        onConfirm={handleContentGenerated}
        onError={handleAutoGenerateError}
      />
      <BootstrapTemplateModal
        isOpen={modalStates.bootstrap.isOn}
        onClose={modalStates.bootstrap.off}
        onCreate={setGuideTitles}
      />
      <AutoGeneratedContentLoadingModal
        isOpen={modalStates.contentGenerating.isOn}
      />
    </>
  );
};

export default TemplateForm;
