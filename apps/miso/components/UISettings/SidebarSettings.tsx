import React, { useCallback, useEffect, useMemo } from 'react';
import { Field, FieldArray, useFormikContext } from 'formik';
import {
  Box,
  Code,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Link,
  Switch,
  Text,
} from '@chakra-ui/react';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import debounce from 'lodash/debounce';
import Bowser from 'bowser';

import {
  CompletionStyle,
  EmbedToggleStyle,
  EmbedToggleStyleInverted,
  GuideHeaderCloseIcon,
  GuideHeaderProgressBar,
  GuideHeaderType,
  SidebarPosition,
  SidebarStyle,
} from 'bento-common/types';
import {
  GUIDE_HEADER_CLOSE_ICONS,
  GUIDE_HEADER_CLOSE_ICON_LABELS,
  GUIDE_HEADER_TYPES,
  PROGRESS_BAR_STYLES,
} from 'bento-common/utils/constants';
import { capitalizeFirstLetter } from 'bento-common/utils/strings';
import { px, twSize } from 'bento-common/utils/dom';
import { STANDARD_SHADOW } from 'bento-common/frontend/styles';
import SidebarHeader, {
  SidebarHeaderProps,
} from 'bento-common/components/SidebarHeader';
import {
  SidebarAvailability,
  SidebarVisibility,
  View,
} from 'bento-common/types/shoyuUIState';
import standardGuide from 'bento-common/sampleGuides/standardGuide';
import ProgressMeter from 'bento-common/components/ProgressMeter';
import { Guide, Module } from 'bento-common/types/globalShoyuState';
import useRandomKey from 'bento-common/hooks/useRandomKey';
import { DOCS_VISUAL_TAGS_TARGETING_URL } from 'bento-common/utils/docs';

import { massageToggleStyle, SIDEBAR_TOGGLE_TYPES } from './styles.helpers';
import PreviewContainer from 'components/Previews/PreviewContainer';
import AddButton from 'components/AddButton';
import { BentoComponentsEnum } from 'types';
import ColorField from 'bento-common/components/ColorField';
import RadioGroupField from '../common/InputFields/RadioGroupField';
import TextField from 'components/common/InputFields/TextField';
import NumberField from 'components/common/InputFields/NumberField';
import H4 from 'system/H4';
import HeadingSub from 'system/HeadingSub';
import RadioGroup from 'system/RadioGroup';
import Radio from 'system/Radio';
import {
  PreviewColumn,
  SettingsColumn,
  SettingsWithPreviewRow,
} from './components/GridHelpers';
import SidebarTogglePreview from './previews/SidebarTogglePreview';
import { UISettingsQuery } from 'relay-types/UISettingsQuery.graphql';
import UrlInput from 'components/common/UrlInput';
import SimpleInfoTooltip from 'system/SimpleInfoTooltip';
import { orgSettingsDefaults } from 'bento-common/data/orgSettingsDefaults';
import { BentoUI } from 'bento-common/types/preview';
import H3 from 'system/H3';
import { StyleAnchors } from './styles.types';
import { useAdvancedSidebarSettings } from 'hooks/useFeatureFlag';
import { UI_FONT_SIZE } from 'bento-common/utils/color';

export const accordionButtonProps = {
  _hover: { background: 'transparent', opacity: 0.8 },
  _focus: { outline: 'none' },
};

const SIDEBAR_VISIBILITY_HELP_URL =
  'https://help.trybento.co/en/articles/6866197-bento-toggle-styles-and-visibility';

const CoreSettings: React.FC = () => {
  const browserPlatform = Bowser.getParser(
    window.navigator.userAgent
  ).getPlatform() as unknown as 'mobile' | 'tablet';

  const isMobile = browserPlatform === 'mobile' || browserPlatform === 'tablet';

  const { values, setFieldValue } =
    useFormikContext<UISettingsQuery['response']['uiSettings']>();

  const xOffsetInputProps = useMemo(
    () => ({
      inputMode: 'numeric',
      defaultValue: values.floatingAnchorXOffset,
      min: 0,
      max: 300,
      neverEmpty: true,
      minimalist: true,
    }),
    [values.floatingAnchorXOffset]
  );

  const yOffsetInputProps = useMemo(
    () => ({
      inputMode: 'numeric',
      defaultValue: values.floatingAnchorYOffset,
      min: 0,
      max: 300,
      neverEmpty: true,
      minimalist: true,
    }),
    [values.floatingAnchorYOffset]
  );

  const advancedSidebarEnabled = useAdvancedSidebarSettings();
  const sidebarDisabled =
    values.sidebarAvailability === SidebarAvailability.hide;

  useEffect(() => {
    /**
     * Protect against FF turned off and org set in hidden state
     */
    if (
      !advancedSidebarEnabled &&
      values.sidebarAvailability === SidebarAvailability.hide
    )
      setFieldValue('sidebarAvailability', SidebarAvailability.default);
  }, [advancedSidebarEnabled, values.sidebarAvailability]);

  const advancedSidebarOptions = useMemo(
    () => [
      {
        label: (
          <Flex>
            Bento default
            <Flex my="auto" ml="1">
              <SimpleInfoTooltip label="Auto opens for page-targeted contextual guides. On page transition from inline onboarding to “follow user”" />
            </Flex>
          </Flex>
        ),
        value: SidebarAvailability.default,
      },
      {
        label: <Flex>Never auto-open the sidebar</Flex>,
        value: SidebarAvailability.neverOpen,
      },
      {
        label: (
          <Flex>
            Never open the sidebar
            <Flex my="auto" ml="1">
              <SimpleInfoTooltip label="This blocks usage of sidebar contextual guides and the resource center" />
            </Flex>
          </Flex>
        ),
        value: SidebarAvailability.hide,
      },
    ],
    []
  );

  const handleToggleStyleChanged = useCallback((value) => {
    setFieldValue('toggleStyle', value);
  }, []);

  const handleHeaderStyleChanged = useMemo(() => {
    return ['type', 'closeIcon'].reduce((acc, field) => {
      acc[field] = (value) => {
        setFieldValue('sidebarHeader', {
          ...values.sidebarHeader,
          [field]: value,
        });
      };
      return acc;
    }, {} as Record<'type' | 'closeIcon', (value: any) => void>);
  }, [values.sidebarHeader]);

  const handleProgressBarToggled = useCallback(
    (_value) => {
      setFieldValue(
        'sidebarHeader.progressBar',
        values.sidebarHeader.progressBar
          ? undefined
          : GuideHeaderProgressBar.sections
      );
    },
    [values.sidebarHeader.progressBar]
  );

  const handleProgressBarStyleChanged = useCallback((value) => {
    setFieldValue('sidebarHeader.progressBar', value);
  }, []);

  const handleShowModuleNameToggled = useCallback(() => {
    setFieldValue(
      'sidebarHeader.showModuleNameInStepView',
      !values.sidebarHeader.showModuleNameInStepView
    );
  }, [values.sidebarHeader.showModuleNameInStepView]);

  const [hoveredBlocklistUrl, setHoveredBlocklistUrl] = React.useState(-1);

  const blocklistRandomKey = useRandomKey([values.sidebarBlocklistedUrls]);

  /**
   * These values will be later transformed into wildcardUrls when
   * submitting the request.
   *
   * See `handleSave` on the parent uiSettings page.
   */
  const handleBlocklistUrlChanged = useCallback(
    debounce((index: number, value: string | null | undefined) => {
      setFieldValue(`sidebarBlocklistedUrls.${index}`, value || undefined);
    }, 500),
    []
  );

  const handleTooltipLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.stopPropagation();
    },
    []
  );

  const sidebarHeaderProps: SidebarHeaderProps = useMemo(() => {
    return {
      type: values.sidebarHeader.type as GuideHeaderType,
      primaryColor: values.primaryColorHex,
      secondaryColor: values.secondaryColorHex,
      backgroundColor: values.embedBackgroundHex,
      progressBar: values.sidebarHeader.progressBar as GuideHeaderProgressBar,
      showModuleNameInStepView: !!values.sidebarHeader.showModuleNameInStepView,
      guide: standardGuide as unknown as Guide,
      module: standardGuide.modules[0] as unknown as Module,
      step: standardGuide.modules[0].steps[1],
      stepCompletionStyle: values.stepCompletionStyle as CompletionStyle,
      allGuidesStyle: orgSettingsDefaults.allGuidesStyle,
      closeIcon: values.sidebarHeader.closeIcon as GuideHeaderCloseIcon,
      view: View.step,
      showBackButton: true,
      isFloating: true,
      classNames: { content: 'rounded-t-lg' },
    };
  }, [
    values.sidebarHeader,
    values.primaryColorHex,
    values.secondaryColorHex,
    values.embedBackgroundHex,
    values.stepCompletionStyle,
  ]);

  const toggleVisibilityOptions = useMemo(
    () => [
      {
        label: (
          <Flex>
            Always
            <Flex my="auto" ml="1">
              <SimpleInfoTooltip
                label={
                  <span>
                    If the user has any available onboarding or contextual
                    guides, even if they are completed. This is best for easy
                    repeat access. Read more{' '}
                    <Link
                      href={SIDEBAR_VISIBILITY_HELP_URL}
                      target="_blank"
                      textDecoration="underline"
                      onClick={handleTooltipLinkClick}
                    >
                      here
                    </Link>
                    .
                  </span>
                }
              />
            </Flex>
          </Flex>
        ),
        value: SidebarVisibility.show,
      },
      {
        label: (
          <Flex>
            There are live guides
            <Flex my="auto" ml="1">
              <SimpleInfoTooltip
                label={
                  <span>
                    Will show if user has onboarding or sidebar contextual
                    guides. Read more{' '}
                    <Link
                      href={SIDEBAR_VISIBILITY_HELP_URL}
                      target="_blank"
                      textDecoration="underline"
                      onClick={handleTooltipLinkClick}
                    >
                      here
                    </Link>
                  </span>
                }
              />
            </Flex>
          </Flex>
        ),
        value: SidebarVisibility.activeGuides,
      },
      {
        label: (
          <Flex>
            <span>
              There are live <b>onboarding</b> guides
            </span>
            <Flex my="auto" ml="1">
              <SimpleInfoTooltip
                label={
                  <span>
                    Will show if the user has an onboarding guide in progress.
                    Read more{' '}
                    <Link
                      href={SIDEBAR_VISIBILITY_HELP_URL}
                      target="_blank"
                      textDecoration="underline"
                      onClick={handleTooltipLinkClick}
                    >
                      here
                    </Link>
                  </span>
                }
              />
            </Flex>
          </Flex>
        ),
        value: SidebarVisibility.activeOnboardingGuides,
      },
      {
        label: (
          <Flex>
            Never
            <Flex my="auto" ml="1">
              <SimpleInfoTooltip label="Only select if you are implementing a custom toggle!" />
            </Flex>
          </Flex>
        ),
        value: SidebarVisibility.hide,
      },
    ],
    []
  );

  return (
    <>
      {/* Sidebar style */}
      <SettingsWithPreviewRow spyId={StyleAnchors.sidebarStyle} pt="0">
        <SettingsColumn>
          <H3 mb="6">Sidebar</H3>
          <H4>Style</H4>

          <RadioGroupField
            name="sidebarStyle"
            mt="6"
            fontSize={UI_FONT_SIZE}
            label="Sidebar type"
            defaultValue={values.sidebarStyle}
            alignment="vertical"
            options={useMemo(
              () => [
                { label: 'Floating container', value: SidebarStyle.floating },
                {
                  label: 'Full height slide-out',
                  value: SidebarStyle.slideOut,
                },
                {
                  label: 'Side-by-side with my app (beta)',
                  value: SidebarStyle.sideBySide,
                },
              ],
              []
            )}
          />
          <ColorField
            name="sidebarBackgroundColor"
            label="Sidebar background"
            defaultValue={values.sidebarBackgroundColor}
            mt="6"
            isRequired
          />
          <RadioGroupField
            name="sidebarSide"
            mt="6"
            fontSize={UI_FONT_SIZE}
            label="Sidebar location"
            defaultValue={values.sidebarSide}
            alignment="vertical"
            options={useMemo(
              () => [
                { label: 'Left', value: SidebarPosition.left },
                { label: 'Right', value: SidebarPosition.right },
              ],
              []
            )}
          />
          {/**
           * @todo check why pixel offset is not immediately reflecting in preview
           */}
          {values.sidebarStyle === SidebarStyle.floating && (
            <>
              <Box mt={4}>
                <Box
                  bgColor="gray.50"
                  display="flex"
                  flexDir="row"
                  gridGap="2"
                  px={6}
                  py={3}
                  maxW="340px"
                >
                  <NumberField
                    name="floatingAnchorXOffset"
                    variant="secondary"
                    maxW="140px"
                    fontSize={UI_FONT_SIZE}
                    label={`Pixels from ${values.sidebarSide}`}
                    // @ts-ignore
                    inputProps={xOffsetInputProps}
                  />
                  <NumberField
                    name="floatingAnchorYOffset"
                    variant="secondary"
                    maxW="140px"
                    fontSize={UI_FONT_SIZE}
                    label="Pixels from bottom"
                    // @ts-ignore
                    inputProps={yOffsetInputProps}
                  />
                </Box>
              </Box>
            </>
          )}
          {values.sidebarStyle === SidebarStyle.sideBySide && (
            <TextField
              maxW={300}
              mt="6"
              label="Element that identifies your app container"
              name="appContainerIdentifier"
              fontSize={UI_FONT_SIZE}
              placeholder="e.g., #app #div"
              defaultValue={values.appContainerIdentifier}
            />
          )}
        </SettingsColumn>
        <PreviewColumn>
          <PreviewContainer
            uiSettings={values as BentoUI}
            component={BentoComponentsEnum.sidebar}
            contextual={false}
            sidebarAlwaysExpanded
          />
        </PreviewColumn>
      </SettingsWithPreviewRow>

      {/** Header style */}
      <SettingsWithPreviewRow spyId={StyleAnchors.headerStyle}>
        <SettingsColumn>
          <H4>Header</H4>

          <Text mt="6" fontWeight="semibold">
            Style
          </Text>
          <Field>
            {() => (
              <FormControl as="fieldset" mt="6">
                <RadioGroup
                  defaultValue={sidebarHeaderProps.type}
                  onChange={handleHeaderStyleChanged.type}
                  alignment="vertical"
                >
                  {GUIDE_HEADER_TYPES.map((sidebarHeaderStyle) => (
                    <Radio
                      key={`radio-${sidebarHeaderStyle}`}
                      name="sidebarHeaderStyle"
                      value={sidebarHeaderStyle}
                      position="relative"
                      display="flex"
                      alignItems="start"
                      h={twSize(22.5)}
                    >
                      <>
                        <Box
                          fontSize={UI_FONT_SIZE}
                          fontWeight="semibold"
                          mt={-1}
                        >
                          {capitalizeFirstLetter(sidebarHeaderStyle)}
                        </Box>
                        <Box
                          position="absolute"
                          top={2}
                          left={0}
                          overflow="hidden"
                          transform="scale(0.75)"
                          p={1}
                          h={twSize(23)}
                          ml={-9}
                        >
                          <Box
                            borderRadius={twSize(2)}
                            boxShadow={STANDARD_SHADOW}
                            w={px(435)}
                          >
                            <SidebarHeader
                              {...sidebarHeaderProps}
                              type={sidebarHeaderStyle as GuideHeaderType}
                            />
                            <Box
                              h={twSize(6)}
                              w="full"
                              backgroundColor={values.embedBackgroundHex}
                            />
                          </Box>
                        </Box>
                      </>
                    </Radio>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          </Field>

          <Text mt="4" fontWeight="semibold">
            Close/minimize icon
          </Text>
          <Field>
            {() => (
              <FormControl as="fieldset" mt="6">
                <RadioGroup
                  defaultValue={sidebarHeaderProps.closeIcon}
                  onChange={handleHeaderStyleChanged.closeIcon}
                  alignment="vertical"
                >
                  {GUIDE_HEADER_CLOSE_ICONS.map((sidebarHeaderCloseIcon) => (
                    <Radio
                      key={`radio-${sidebarHeaderCloseIcon}`}
                      name="sidebarHeaderCloseIcon"
                      value={sidebarHeaderCloseIcon}
                      position="relative"
                      display="flex"
                      alignItems="start"
                      h={sidebarHeaderCloseIcon ? twSize(22.5) : 'auto'}
                    >
                      <>
                        <Box
                          fontSize={UI_FONT_SIZE}
                          fontWeight="semibold"
                          mt={-1}
                        >
                          {
                            GUIDE_HEADER_CLOSE_ICON_LABELS[
                              sidebarHeaderCloseIcon
                            ]
                          }
                        </Box>
                        <Box
                          position="absolute"
                          top={2}
                          left={0}
                          overflow="hidden"
                          transform="scale(0.75)"
                          p={1}
                          h={twSize(23)}
                          ml={-9}
                        >
                          <Box
                            borderRadius={twSize(2)}
                            boxShadow={STANDARD_SHADOW}
                            w={px(435)}
                          >
                            <SidebarHeader
                              {...sidebarHeaderProps}
                              closeIcon={sidebarHeaderCloseIcon}
                            />
                            <Box
                              h={twSize(6)}
                              w="full"
                              backgroundColor={values.embedBackgroundHex}
                            />
                          </Box>
                        </Box>
                      </>
                    </Radio>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          </Field>

          <Field>
            {() => (
              <FormControl as="fieldset" mt="6">
                <FormLabel as="legend" fontSize={UI_FONT_SIZE}>
                  Progress bar visibility (checklists in sidebar)
                </FormLabel>
                <Box mb="3" mt="2">
                  <Switch
                    size="md"
                    isChecked={!!values.sidebarHeader.progressBar}
                    onChange={handleProgressBarToggled}
                    mr="3"
                  />
                  {values.sidebarHeader.progressBar ? 'Visible' : 'Hidden'}
                </Box>
              </FormControl>
            )}
          </Field>

          {values.sidebarHeader.progressBar && (
            <Field>
              {() => (
                <FormControl as="fieldset" mt="6">
                  <FormLabel as="legend" fontSize={UI_FONT_SIZE}>
                    Style
                  </FormLabel>
                  <RadioGroup
                    defaultValue={values.sidebarHeader.progressBar}
                    onChange={handleProgressBarStyleChanged}
                    alignment="vertical"
                  >
                    {PROGRESS_BAR_STYLES.map((progressBarStyle) => (
                      <>
                        <Radio
                          key={`radio-${progressBarStyle}`}
                          name="progressBarStyle"
                          value={progressBarStyle}
                          label={capitalizeFirstLetter(progressBarStyle)}
                        />
                        <Box py={1} pr={4} pl={6}>
                          <ProgressMeter
                            primaryColorHex={values.primaryColorHex}
                            totalSteps={5}
                            completedSteps={2}
                            type={progressBarStyle}
                          />
                        </Box>
                      </>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            </Field>
          )}

          <Field>
            {() => (
              <FormControl as="fieldset" mt="6">
                <FormLabel as="legend" fontSize={UI_FONT_SIZE}>
                  Sub-header visibility (in step detail view)
                </FormLabel>
                <Box mb="3" mt="2">
                  <Switch
                    size="md"
                    isChecked={!!values.sidebarHeader.showModuleNameInStepView}
                    onChange={handleShowModuleNameToggled}
                    mr="3"
                  />
                  {values.sidebarHeader.showModuleNameInStepView
                    ? 'Visible'
                    : 'Hidden'}
                </Box>
              </FormControl>
            )}
          </Field>
        </SettingsColumn>
        <PreviewColumn>&nbsp;</PreviewColumn>
      </SettingsWithPreviewRow>

      {/* Sidebar toggle */}
      <SettingsWithPreviewRow spyId={StyleAnchors.toggleStyle}>
        <SettingsColumn>
          <H4 mb={4}>Toggle style</H4>
          <Text fontWeight="bold">Style</Text>
          <Field>
            {() => (
              <FormControl as="fieldset" mt="4">
                <RadioGroup
                  defaultValue={values.toggleStyle}
                  onChange={handleToggleStyleChanged}
                  alignment="vertical"
                >
                  <Grid templateColumns="repeat(3, min-content)" gap={6}>
                    {SIDEBAR_TOGGLE_TYPES.map((toggleStyle) => {
                      const needsShadow = [
                        EmbedToggleStyle.text,
                        EmbedToggleStyleInverted.text,
                      ].includes(toggleStyle);

                      return (
                        <Radio
                          key={`radio-${toggleStyle}`}
                          name="toggleStyle"
                          value={toggleStyle}
                        >
                          <Box
                            position="relative"
                            borderRadius={needsShadow && twSize(2)}
                            boxShadow={needsShadow && STANDARD_SHADOW}
                          >
                            <SidebarTogglePreview toggleStyle={toggleStyle} />
                          </Box>
                        </Radio>
                      );
                    })}
                  </Grid>
                </RadioGroup>
              </FormControl>
            )}
          </Field>
          {massageToggleStyle(values.toggleStyle) === EmbedToggleStyle.text && (
            <TextField
              maxW={280}
              mt="6"
              label="Toggle Text"
              name="toggleText"
              fontSize={UI_FONT_SIZE}
              helperText="The text shown on the toggle"
              defaultValue={values.toggleText || 'Onboarding'}
            />
          )}
          <ColorField
            name="toggleColorHex"
            label="Toggle color"
            helperText="Uses “Primary color” by default"
            defaultValue={values.toggleColorHex || values.primaryColorHex}
            isRequired
            shouldBeDark
            mt="6"
          />
          <ColorField
            name="toggleTextColor"
            label="Toggle text color"
            helperText="Uses “Primary color” by default"
            defaultValue={values.toggleTextColor}
            isRequired
            mt="6"
          />
        </SettingsColumn>
        <PreviewColumn>&nbsp;</PreviewColumn>
      </SettingsWithPreviewRow>

      {/* Toggle visibility */}
      <SettingsWithPreviewRow spyId={StyleAnchors.toggleVisibility}>
        <SettingsColumn>
          <H4>Toggle visibility</H4>

          {sidebarDisabled ? (
            <Text>
              The sidebar toggle is automatically hidden if your sidebar is
              hidden
            </Text>
          ) : (
            <RadioGroupField
              name="sidebarVisibility"
              mt="6"
              fontSize={UI_FONT_SIZE}
              disabled={sidebarDisabled}
              label={
                <Flex>
                  When should the toggle show?
                  <Flex my="auto" ml="1">
                    <SimpleInfoTooltip
                      label={
                        <span>
                          The toggle will <b>always</b> show if the user has a
                          saved announcement, regardless of setting.
                        </span>
                      }
                    />
                  </Flex>
                </Flex>
              }
              defaultValue={values.sidebarVisibility}
              alignment="vertical"
              options={toggleVisibilityOptions}
            />
          )}

          {/* Setting: sidebar_blocklisted_urls */}
          {!sidebarDisabled && (
            <FieldArray
              name="sidebarBlocklistedUrls"
              render={({ push, remove }) => (
                <FormControl as="fieldset" mt="6">
                  <FormLabel as="legend" fontSize={UI_FONT_SIZE}>
                    Hide Bento toggle on certain pages
                  </FormLabel>
                  <FormHelperText mt={0}>
                    If not set, the toggle will be available on all pages where
                    the Bento snippet is present
                  </FormHelperText>
                  {/* Dynamic urls blocklist */}
                  <Box
                    mt={2}
                    display="flex"
                    flexDir="column"
                    bgColor="gray.50"
                    width="100%"
                    gap={2}
                    p={4}
                  >
                    {/* List of input fields */}
                    {values.sidebarBlocklistedUrls.length > 0 && (
                      <Box display="flex" flexDirection="column" gap={2}>
                        {values.sidebarBlocklistedUrls.map((value, index) => {
                          return (
                            <Box
                              key={`sidebar-blocklist-url-${blocklistRandomKey}-${index}`}
                              display="flex"
                              gap={1}
                              onMouseLeave={() => setHoveredBlocklistUrl(-1)}
                              onMouseEnter={() => setHoveredBlocklistUrl(index)}
                            >
                              <Box
                                flex="1"
                                maxWidth={`calc(400px - ${twSize(4 * 3 + 1)})`}
                              >
                                <UrlInput
                                  fontSize={UI_FONT_SIZE}
                                  withCallout={false}
                                  initialUrl={value}
                                  onContentChange={(newValue) =>
                                    handleBlocklistUrlChanged(index, newValue)
                                  }
                                />
                              </Box>
                              <Box width={4} my="auto">
                                {hoveredBlocklistUrl === index || isMobile ? (
                                  <Box
                                    cursor="pointer"
                                    color="gray.600"
                                    opacity=".4"
                                    _hover={{ opacity: '.8' }}
                                    onClick={() => remove(index)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </Box>
                                ) : null}
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                    {/* Add url button */}
                    <Box display="flex">
                      <AddButton
                        onClick={() => push('http://')}
                        fontSize="xs"
                        iconSize="sm"
                      >
                        Add url
                      </AddButton>
                    </Box>
                    {/* Wildcards tip */}
                    <Box display="flex">
                      <Text fontSize="xs" color="gray.500">
                        Use{' '}
                        <Code fontSize="xs" color="gray.500" bg="gray.50">
                          *
                        </Code>{' '}
                        to denote wildcards. Read more about URL targeting{' '}
                        <Link
                          href={DOCS_VISUAL_TAGS_TARGETING_URL}
                          target="_blank"
                          color="bento.bright"
                        >
                          here.
                        </Link>
                      </Text>
                    </Box>
                  </Box>
                </FormControl>
              )}
            />
          )}
        </SettingsColumn>
        <PreviewColumn>
          <Box />
        </PreviewColumn>
      </SettingsWithPreviewRow>

      {advancedSidebarEnabled && (
        <SettingsWithPreviewRow spyId={StyleAnchors.sidebarVisibility}>
          <SettingsColumn>
            <H4>Sidebar visibility ⚠️</H4>

            <HeadingSub>
              These are advanced features that could disrupt your Bento
              experience.
            </HeadingSub>
            <RadioGroupField
              name="sidebarAvailability"
              mt="6"
              fontSize={UI_FONT_SIZE}
              defaultValue={values.sidebarAvailability}
              alignment="vertical"
              options={advancedSidebarOptions}
            />
          </SettingsColumn>
          <PreviewColumn>
            <Box />
          </PreviewColumn>
        </SettingsWithPreviewRow>
      )}
    </>
  );
};

export default CoreSettings;
