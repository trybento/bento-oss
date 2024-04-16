import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormikContext } from 'formik';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Kbd,
  Link,
} from '@chakra-ui/react';
import {
  HelpCenterSource,
  IntegrationType,
  QuickLink,
} from 'bento-common/types';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Element } from 'react-scroll';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import isUrl from 'is-url';

import { IntegrationState } from 'bento-common/types/integrations';
import { zendeskPreviewFlag } from 'bento-common/data/helpers';

import { STANDARD_SHADOW } from 'bento-common/frontend/styles';
import {
  EmbedToggleBehavior,
  InlineEmptyBehaviour,
  SidebarVisibility,
  View,
} from 'bento-common/types/shoyuUIState';
import { BentoUI } from 'bento-common/types/preview';
import useMockAttributes from 'hooks/useMockAttributes';
import { ComponentSelectorSize } from '../UISettings/styles.helpers';
import TextField, {
  TextFieldInputType,
} from 'components/common/InputFields/TextField';
import { accordionButtonProps } from '../UISettings/CoreSettings';
import {
  PreviewColumn,
  SettingsColumn,
  SettingsWithPreviewRow,
} from '../UISettings/components/GridHelpers';
import H4 from 'system/H4';
import { BentoComponentsEnum } from 'types';
import RadioGroupField from '../common/InputFields/RadioGroupField';
import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';
import DragAndDropProvider from 'providers/DragAndDropProvider';
import colors from 'helpers/colors';
import AddButton from 'components/AddButton';
import QuickLinkModal from '../UISettings/components/QuicklinkModal';
import PreviewContainer from 'components/Previews/PreviewContainer';
import { SelectOptions } from 'system/Select';
import SelectField from 'components/common/InputFields/SelectField';
import H5 from 'system/H5';
import SwitchField from 'components/common/InputFields/SwitchField';
import { GUIDES_CHECKLISTS_PREVIEW_OPTIONS } from 'components/Previews/helpers';
import { SelectOption } from 'bento-common/components/RichTextEditor/extensions/Select/withSelect';
import ButtonGroup from 'system/ButtonGroup';
import { ResourceCenterFormValues } from './resourceCenterSettings.types';
import {
  ResourceCenterQuery,
  ResourceCenterQuery$data,
} from 'relay-types/ResourceCenterQuery.graphql';
import { UI_FONT_SIZE } from 'bento-common/utils/color';

type Props = {
  addValidator: (v: (vals: object) => object) => void;
  integrations: ResourceCenterQuery$data['orgSettings']['integrationApiKeys'];
  organization: ResourceCenterQuery['response']['organization'];
};

const fieldsWithDynamicAttributes = [
  'allGuidesStyle.allGuidesTitle',
  'allGuidesStyle.activeGuidesTitle',
  'allGuidesStyle.previousGuidesTitle',
  'allGuidesStyle.previousAnnouncementsTitle',
];

const allGuidesStyleWidth = '380px';

const GUIDES_SIDEBAR_FIRST = [...GUIDES_CHECKLISTS_PREVIEW_OPTIONS].reverse();

const helpCenterSourcesOptions: SelectOptions[] = [
  { label: 'Intercom', value: HelpCenterSource.intercom },
  // NOTE: I couldn't find any examples of any customers which use salesforce
  // for a help center anymore so I couldn't validate that this works and thus
  // we'll need to find an example to use to test before enabling this
  // { label: 'Salesforce', value: HelpCenterSource.salesforce },
  { label: 'Zendesk', value: HelpCenterSource.zendesk },
];

export default function AllGuidesSettings({
  addValidator,
  integrations,
}: Props) {
  const { values, setFieldValue } =
    useFormikContext<ResourceCenterFormValues>();

  const zendeskIntegration = useMemo(
    () =>
      integrations.find(
        (integration) => integration.type === IntegrationType.zendesk
      ),
    []
  );

  const zendeskIntegrationActive =
    zendeskIntegration?.state === IntegrationState.Active;

  const { mockedAttributes, updateAttributeMock } = useMockAttributes(
    values,
    fieldsWithDynamicAttributes
  );

  const [selectedComponent, setSelectedComponent] =
    useState<BentoComponentsEnum>(BentoComponentsEnum.sidebar);
  // Used to clear default value of its inputs.
  const [quicklinksCloseCount, setQuicklinksCloseCount] = useState<number>(0);
  const [quicklinkToEdit, setQuicklinkToEdit] = useState<QuickLink>();
  const [quickLinkModalOpen, setQuickLinkModalOpen] = useState<boolean>(false);

  const previewGuides = useMemo(
    () =>
      values.inlineEmptyBehaviour === InlineEmptyBehaviour.hide
        ? GUIDES_SIDEBAR_FIRST.filter(
            (o) => o.value === BentoComponentsEnum.sidebar
          )
        : GUIDES_SIDEBAR_FIRST,
    [values.inlineEmptyBehaviour]
  );

  useEffect(() => {
    if (
      values.inlineEmptyBehaviour === InlineEmptyBehaviour.hide &&
      selectedComponent !== BentoComponentsEnum.sidebar
    )
      setSelectedComponent(BentoComponentsEnum.sidebar);
  }, [values.inlineEmptyBehaviour, selectedComponent]);

  const defaultChecklistIndexSelected = useMemo(
    () => previewGuides.findIndex((o) => o.value === selectedComponent),
    [previewGuides.length, selectedComponent]
  );

  const handleSelectComponent = useCallback((selection: SelectOption) => {
    setSelectedComponent(selection.value as BentoComponentsEnum);
  }, []);

  const mockAttributesFields = useMemo(
    () =>
      fieldsWithDynamicAttributes.reduce((acc, field) => {
        acc[field] =
          Object.keys(mockedAttributes[field] || {}).length > 0 ? (
            <Accordion allowToggle>
              <AccordionItem border="none" mt="1">
                <AccordionButton pl="0" border="none" {...accordionButtonProps}>
                  <Box
                    flex="1"
                    textAlign="left"
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    Preview attributes
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel p="0">
                  {Object.entries(mockedAttributes[field]).map(([ak, av]) => (
                    <TextField
                      key={`${field}-${ak}`}
                      maxW={allGuidesStyleWidth}
                      variant="secondary"
                      mt="1"
                      label={ak}
                      onChange={updateAttributeMock(field, ak)}
                      fontSize={UI_FONT_SIZE}
                      defaultValue={String(av)}
                    />
                  ))}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          ) : (
            <></>
          );
        return acc;
      }, {}),
    [mockedAttributes]
  );

  const editQuickLinkFactory = useCallback(
    (idx: number) => () => {
      setQuicklinkToEdit(values.quickLinks[idx]);
      setQuickLinkModalOpen(true);
    },
    [values.quickLinks]
  );
  const deleteQuickLinkFactory = useCallback(
    (idx: number) => () =>
      setFieldValue(
        'quickLinks',
        values.quickLinks.slice(0, idx).concat(values.quickLinks.slice(idx + 1))
      ),
    [values.quickLinks]
  );

  const closeQuickLinkModal = useCallback(() => {
    setQuickLinkModalOpen(false);
    setQuicklinkToEdit(undefined);
    setQuicklinksCloseCount((v) => v + 1);
  }, []);
  const createQuickLink = useCallback(() => {
    setQuickLinkModalOpen(true);
  }, []);
  const saveQuickLink = useCallback(
    (quickLink) => {
      if (!quicklinkToEdit) {
        setFieldValue('quickLinks', values.quickLinks.concat([quickLink]));
      } else {
        const idx = values.quickLinks.findIndex((ql) => ql === quicklinkToEdit);
        const updatedQuickLinks = values.quickLinks.slice();
        updatedQuickLinks[idx] = quickLink;
        setFieldValue('quickLinks', updatedQuickLinks);
      }
      closeQuickLinkModal();
    },
    [quicklinkToEdit, values.quickLinks]
  );

  const handleHelpCenterPropertyToggle = useCallback(
    (key: keyof ResourceCenterFormValues['helpCenter']) => () => {
      const baseSettings = values.helpCenter ?? {
        source: HelpCenterSource.zendesk,
        url: '',
      };
      const currValue = values.helpCenter?.[key] ?? false;

      setFieldValue('helpCenter', {
        ...(baseSettings || {}),
        [key]: !currValue,
      });
    },
    [values.helpCenter]
  );

  /**
   * @todo use superstruct
   * @todo add types
   */
  const validate = useCallback(
    (values) => {
      const errors = {};

      // wont validate if disabled
      if (!values.helpCenter?.kbSearch) return errors;

      if (values.helpCenter && !zendeskIntegrationActive) {
        if (!values.helpCenter.url?.trim()) {
          errors['helpCenter.url'] = 'Help center URL is required';
        } else if (!isUrl(values.helpCenter.url)) {
          errors['helpCenter.url'] = 'Help center URL is not valid';
        }
      }
      return errors;
    },
    [zendeskIntegrationActive]
  );

  useEffect(() => {
    addValidator(validate);
    zendeskPreviewFlag.set(true);
    return () => {
      zendeskPreviewFlag.set(false);
    };
  }, []);

  const urlInvalid = useMemo(() => {
    // TODO: Combine with validate logic above
    if (
      !zendeskIntegrationActive &&
      values.helpCenter &&
      !values.helpCenter.url?.trim()
    )
      return true;
    return values.helpCenter?.url?.length && !isUrl(values.helpCenter.url);
  }, [values.helpCenter?.url, zendeskIntegrationActive]);

  return (
    <SettingsWithPreviewRow spyId="resourceCenterPage" pt={0} gap="40">
      <SettingsColumn>
        <H4 mb="4">Visibility</H4>
        <RadioGroupField
          name="inlineEmptyBehaviour"
          mb="8"
          fontSize={UI_FONT_SIZE}
          label="Where does the resource center show up?"
          defaultValue={values.inlineEmptyBehaviour}
          alignment="vertical"
          options={[
            {
              label: 'Only in the sidebar',
              value: InlineEmptyBehaviour.hide,
            },
            {
              label:
                'Sidebar and inline (same location as onboarding checklist)',
              value: InlineEmptyBehaviour.show,
            },
          ]}
        />
        <RadioGroupField
          name="embedToggleBehavior"
          fontSize={UI_FONT_SIZE}
          label="Default behavior when sidebar is opened"
          defaultValue={values.embedToggleBehavior}
          alignment="vertical"
          options={useMemo(
            () => [
              {
                label: 'Always open sidebar to resource center',
                value: EmbedToggleBehavior.resourceCenter,
              },
              {
                label: 'Open sidebar to latest active guide',
                value: EmbedToggleBehavior.default,
              },
            ],
            []
          )}
        />
        <Element name="resourceCenterTitles">
          <H4 mt="16">Section titles</H4>
          <TextField
            maxW={allGuidesStyleWidth}
            mt="4"
            label="Title text"
            helperText={
              <>
                Use <Kbd>{'{{'}</Kbd> for dynamic attributes
              </>
            }
            name="allGuidesStyle.allGuidesTitle"
            fontSize={UI_FONT_SIZE}
            defaultValue={values.allGuidesStyle.allGuidesTitle}
            inputType={TextFieldInputType.dynamic}
          />
          {mockAttributesFields['allGuidesStyle.allGuidesTitle']}
          <TextField
            maxW={allGuidesStyleWidth}
            label="Section title: guides that are “in progress”"
            helperText="This includes onboarding and contextual checklist guides"
            mt="8"
            name="allGuidesStyle.activeGuidesTitle"
            fontSize={UI_FONT_SIZE}
            defaultValue={values.allGuidesStyle.activeGuidesTitle}
            inputType={TextFieldInputType.dynamic}
          />
          {mockAttributesFields['allGuidesStyle.activeGuidesTitle']}
          <TextField
            maxW={allGuidesStyleWidth}
            label="Section title: guides that are completed"
            helperText="This includes onboarding and contextual checklist guides"
            mt="8"
            name="allGuidesStyle.previousGuidesTitle"
            fontSize={UI_FONT_SIZE}
            defaultValue={values.allGuidesStyle.previousGuidesTitle}
            inputType={TextFieldInputType.dynamic}
          />
          {mockAttributesFields['allGuidesStyle.previousGuidesTitle']}
          <TextField
            w="full"
            maxW={allGuidesStyleWidth}
            label="Section title: modals dismissed"
            helperText="This includes modals but not banners"
            mt="8"
            name="allGuidesStyle.previousAnnouncementsTitle"
            fontSize={UI_FONT_SIZE}
            defaultValue={values.allGuidesStyle.previousAnnouncementsTitle}
            inputType={TextFieldInputType.dynamic}
          />
          {mockAttributesFields['allGuidesStyle.previousAnnouncementsTitle']}
        </Element>
        <Element name="links">
          <H4 mt="16">Links</H4>
          <Box fontSize="xs" mt="2">
            Links will show below your list of guides and announcements. They
            will show in both the sidebar and inline.{' '}
            <Link
              href="https://help.trybento.co/en/articles/7179726-bento-resource-center"
              target="_blank"
              color={colors.bento.bright}
              fontWeight="bold"
            >
              Learn more
            </Link>
          </Box>
          {values.quickLinks.length > 0 && (
            <>
              {values.sidebarVisibility !== SidebarVisibility.show && (
                <CalloutText calloutType={CalloutTypes.Warning} mt="2">
                  Users without active guides won't be able to access these in
                  the sidebar unless the sidebar toggle visibility is set to
                  &quot;Always&quot;
                </CalloutText>
              )}
              <DragAndDropProvider
                formItemsKey="quickLinks"
                dragShadow={STANDARD_SHADOW}
              >
                {/* @ts-ignore */}
                <Droppable droppableId="quickLinks">
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      bgColor="gray.50"
                      p="4"
                      mt="4"
                    >
                      {values.quickLinks.map((quickLink, idx) => (
                        // @ts-ignore
                        <Draggable
                          key={idx}
                          draggableId={`quickLinks[${idx}]`}
                          index={idx}
                        >
                          {(provided) => (
                            <Flex
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              alignItems="center"
                              justifyContent="stretch"
                              gap="2"
                              className="hoverable-row"
                              bgColor="white"
                              p="2"
                            >
                              <Flex
                                alignItems="center"
                                {...provided.dragHandleProps}
                              >
                                <DragIndicatorIcon
                                  style={{ color: colors.gray[500] }}
                                />
                              </Flex>
                              <Box fontWeight="semibold" flex="1">
                                {quickLink.title}
                              </Box>
                              <Flex
                                alignItems="center"
                                color="gray.600"
                                className="hoverable-row-hidden"
                                gap="2"
                              >
                                <Box
                                  onClick={editQuickLinkFactory(idx)}
                                  cursor="pointer"
                                >
                                  <EditOutlinedIcon
                                    style={{ color: colors.gray[600] }}
                                  />
                                </Box>
                                <Box
                                  onClick={deleteQuickLinkFactory(idx)}
                                  cursor="pointer"
                                >
                                  <DeleteIcon
                                    style={{ color: colors.gray[600] }}
                                  />
                                </Box>
                              </Flex>
                            </Flex>
                          )}
                        </Draggable>
                      ))}
                    </Box>
                  )}
                </Droppable>
              </DragAndDropProvider>
            </>
          )}
          <AddButton mt="6" onClick={createQuickLink}>
            Add a basic link
          </AddButton>
          <QuickLinkModal
            key={`quicklinks-modal-${quicklinksCloseCount}`}
            isOpen={quickLinkModalOpen}
            quickLink={quicklinkToEdit}
            onClose={closeQuickLinkModal}
            onSave={saveQuickLink}
          />
        </Element>

        <Element name="helpCenterIntegration">
          <H4 mt="16">Help center integration</H4>
          <H5 mt="4" mb="2">
            Search
          </H5>

          {!zendeskIntegrationActive && (
            <Box fontSize="xs">
              Advanced searching and rendering results in the sidebar requires
              an{' '}
              <Link
                color={colors.bento.bright}
                fontWeight="bold"
                href="/data-and-integrations?tab=integrations"
              >
                integration
              </Link>{' '}
              with your help center platform.{' '}
              <Link
                href="https://help.trybento.co/en/articles/7180005-search-your-help-center"
                target="_blank"
                color={colors.bento.bright}
                fontWeight="bold"
              >
                Learn more
              </Link>
            </Box>
          )}
          <SwitchField
            name="helpCenterEnabled"
            mt="4"
            fontSize={UI_FONT_SIZE}
            checkedOption={{
              value: 'on',
            }}
            uncheckedOption={{
              value: 'off',
            }}
            defaultValue={values.helpCenter?.kbSearch ? 'on' : 'off'}
            onChange={handleHelpCenterPropertyToggle('kbSearch')}
            helperText="Users can search articles in the in-app resource center."
          />
          {values.helpCenter?.kbSearch && !zendeskIntegrationActive && (
            <>
              <SelectField
                name="helpCenter.source"
                label="Help center platform"
                defaultValue={values.helpCenter.source}
                options={helpCenterSourcesOptions}
                mt="6"
                fontSize="sm"
              />

              <TextField
                name="helpCenter.url"
                label="Help center URL"
                defaultValue={values.helpCenter.url}
                isInvalid={urlInvalid}
                required
                mt="6"
                fontSize="sm"
                helperText="Allows article search and returns articles in a separate tab. "
              />
            </>
          )}

          {zendeskIntegrationActive && (
            <Flex flexDir="column" gap="4" mt="6">
              <Box>
                <H5 mt="4" mb="2">
                  Support ticket
                </H5>
                <SwitchField
                  name="helpCenter.issueSubmission"
                  mt="4"
                  fontSize={UI_FONT_SIZE}
                  checkedOption={{
                    value: 'on',
                  }}
                  uncheckedOption={{
                    value: 'off',
                  }}
                  defaultValue={
                    values.helpCenter?.issueSubmission ? 'on' : 'off'
                  }
                  onChange={handleHelpCenterPropertyToggle('issueSubmission')}
                  helperText="Submit support tickets from the resource center."
                />
                {values.helpCenter?.issueSubmission && (
                  <TextField
                    mt="4"
                    name="helpCenterStyle.supportTicketTitle"
                    label="Support ticket title"
                    defaultValue={values.helpCenterStyle.supportTicketTitle}
                    required
                    fontSize="sm"
                  />
                )}
              </Box>
              <Box>
                <H5 mt="4" mb="2">
                  Chat
                </H5>
                <SwitchField
                  name="helpCenter.liveChat"
                  mt="4"
                  fontSize={UI_FONT_SIZE}
                  checkedOption={{
                    value: 'on',
                  }}
                  uncheckedOption={{
                    value: 'off',
                  }}
                  defaultValue={values.helpCenter?.liveChat ? 'on' : 'off'}
                  onChange={handleHelpCenterPropertyToggle('liveChat')}
                  helperText="Hides resource center and opens Zendesk chat."
                />
                {values.helpCenter?.liveChat && (
                  <TextField
                    mt="4"
                    name="helpCenterStyle.chatTitle"
                    label="Chat title"
                    defaultValue={values.helpCenterStyle.chatTitle}
                    required
                    fontSize="sm"
                  />
                )}
              </Box>
            </Flex>
          )}
        </Element>
      </SettingsColumn>
      <PreviewColumn>
        <Box position="sticky" top="0px">
          <ButtonGroup
            options={previewGuides}
            onOptionSelected={handleSelectComponent}
            defaultIndex={defaultChecklistIndexSelected}
            buttonProps={{ minW: ComponentSelectorSize.sm }}
            selectedIndex={defaultChecklistIndexSelected}
          />
          <PreviewContainer
            uiSettings={values as unknown as BentoUI}
            component={selectedComponent}
            view={View.activeGuides}
            mockedAttributes={mockedAttributes}
            sidebarAlwaysExpanded
          />
        </Box>
      </PreviewColumn>
    </SettingsWithPreviewRow>
  );
}
