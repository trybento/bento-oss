import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { graphql } from 'react-relay';
import { useRouter } from 'next/router';
import { Formik, Form, useFormikContext } from 'formik';
import { Button, Link } from '@chakra-ui/react';
import { Link as ScrollLink } from 'react-scroll';
import debounce from 'lodash/debounce';
import * as SetUISettings from 'mutations/SetUISettings';
import QueryRenderer from 'components/QueryRenderer';
import UnsavedChangesManager from 'components/UnsavedChangesManager';
import useToast from 'hooks/useToast';
import {
  useAdvancedSidebarSettings,
  useCustomCSSFlag,
} from 'hooks/useFeatureFlag';
import { UISettingsQuery } from 'relay-types/UISettingsQuery.graphql';
import {
  isSidebarToggleInverted,
  massageInitialToggleStyle,
  massageToggleStyle,
  StylesTabLabels,
  tabOptions,
} from './styles.helpers';
import Box from 'system/Box';
import CoreSettings from './CoreSettings';
import GuidesSettings from './GuidesSettings';
import SidebarSettings from './SidebarSettings';
import CustomCssSettings, {
  isUsingDefaultCssTemplate,
} from './CustomCssSettings';
import DotIndicator from 'components/common/DotIndicator';
import AttributesProvider from 'providers/AttributesProvider';
import { SetUISettingsInput } from 'relay-types/SetUISettingsMutation.graphql';
import { useSelectedTab } from 'hooks/useSelectedTab';
import {
  customCssTitle,
  getNavSettingId,
  NavigationOption,
  NAV_ITEMS,
  UISettingsProps,
  NavigationItems,
  SectionName,
  StyleAnchors,
  NavigationSection,
} from './styles.types';
import { useValidators } from 'hooks/useValidators';
import Page from 'components/layout/Page';

const NotificationWrapper: React.FC<{ optionTitle: string }> = ({
  optionTitle,
}) => {
  const { values } = useFormikContext<any>();
  const [notification, setNotification] = useState<string>('');

  const checkNotification = useCallback(async (values) => {
    if (optionTitle === customCssTitle) {
      setNotification(
        optionTitle === customCssTitle &&
          (await isUsingDefaultCssTemplate(values.embedCustomCss))
          ? ''
          : 'You have custom styling applied'
      );
    }
  }, []);

  useEffect(() => {
    checkNotification(values);
  }, [values.embedCustomCss]);

  return <>{notification && <DotIndicator tooltip={notification} />}</>;
};

export function UISettings({
  uiSettings,
  onRefetch,
  orgSettings,
}: UISettingsProps) {
  const router = useRouter();
  const toast = useToast();
  const isCustomCSSFlagEnabled = useCustomCSSFlag();
  const advancedSidebarEnabled = useAdvancedSidebarSettings();

  const [preventPageChange, setPreventPageChange] = useState(true);
  const [selectedNavigationAnchor, setSelectedNavigationAnchor] = useState(
    router.query.anchor
  );
  const { selectedTabIndex, onTabChange } = useSelectedTab(tabOptions);
  const { validate, addValidator } = useValidators();

  const onTabChangeHandler = useCallback(
    (tabIndex: number) => {
      /* Resets all anchors */
      router.replace(
        {
          pathname: '/styles',
          query: {},
        },
        undefined,
        { shallow: true }
      );

      onTabChange(tabIndex);
    },
    [router.query]
  );

  const { navigationOptionsAvailable, SettingsAvailable } = useMemo(() => {
    const navigationOptionsAvailable: Partial<NavigationItems<SectionName>> =
      {};

    const tab = tabOptions[selectedTabIndex];

    const navItems = NAV_ITEMS[tab.title];

    Object.keys(navItems)
      .filter(
        (navSection) => navSection !== 'advanced' || isCustomCSSFlagEnabled
      )
      .forEach((navSection) => {
        const section: NavigationSection = {
          ...navItems[navSection],
          options: navItems[navSection].options.filter(
            (navOption) =>
              navOption.anchor !== StyleAnchors.sidebarVisibility ||
              advancedSidebarEnabled
          ),
        };

        navigationOptionsAvailable[navSection] = section;
      });

    let SettingsAvailable = [];

    switch (tab.title) {
      case StylesTabLabels.guideSpecific:
        SettingsAvailable = [GuidesSettings];
        break;
      default: {
        SettingsAvailable = [CoreSettings, SidebarSettings];
        if (isCustomCSSFlagEnabled) SettingsAvailable.push(CustomCssSettings);
      }
    }

    return { navigationOptionsAvailable, SettingsAvailable };
  }, [isCustomCSSFlagEnabled, selectedTabIndex, advancedSidebarEnabled]);

  const refreshAnchorUrl = useCallback(
    debounce((anchor: string) => {
      router.replace(
        {
          pathname: '/styles',
          query: {
            /*
             * This was to preserve the tab query, but a number of async
             * ops when changing tabs would leave this outdated when switching
             * tabs, causing the viewer to revert back to the previous tab.
             */
            // ...router.query,
            anchor,
          },
        },
        undefined,
        { shallow: true }
      );
    }, 100),
    [router.query]
  );

  const refreshAnchor = useCallback(
    (anchor: string) => {
      setSelectedNavigationAnchor(anchor);
      refreshAnchorUrl(anchor);
    },
    [router.query]
  );

  const handleNavigationClicked = useCallback(
    (
      event: React.MouseEvent<HTMLElement>,
      navigationOption: NavigationOption
    ) => {
      event.preventDefault();

      const { anchor } = navigationOption;

      refreshAnchor(anchor);

      const elements = document.getElementsByName(anchor);
      const [element] = elements;

      if (element) {
        element.scrollIntoView();
      }
    },
    [router.query]
  );

  /**
   * Control effects when a section changes
   */
  const handleAnchorChanged = useCallback(
    (anchor: string, _el: HTMLElement) => {
      refreshAnchor(anchor);
    },
    [router.query]
  );

  const isSelected = useCallback(
    (option: NavigationOption, sectionIndex: number, optionIndex: number) => {
      /* Default selection */
      if (sectionIndex === 0 && optionIndex === 0 && !selectedNavigationAnchor)
        return true;
      return !!option && option.anchor === selectedNavigationAnchor;
    },
    [selectedNavigationAnchor]
  );

  const handleSave = useCallback(
    async (values: Record<string, unknown>, _actions) => {
      try {
        const massagedValues = {
          ...values,
          toggleStyle: massageToggleStyle(values.toggleStyle as string),
          isEmbedToggleColorInverted: isSidebarToggleInverted(
            values.toggleStyle as string
          ),
        };
        await SetUISettings.commit(massagedValues as SetUISettingsInput);

        toast({
          title: 'Saved!',
          status: 'success',
          isClosable: true,
        });

        onRefetch?.();
      } catch (e) {
        toast({
          title:
            e?.[0]?.message || 'There was a problem saving. Please try again.',
          status: 'error',
          isClosable: true,
        });
      }
    },
    [onRefetch]
  );

  const initialValues = useMemo(
    () => ({
      ...uiSettings,
      toggleStyle: uiSettings.isEmbedToggleColorInverted
        ? massageInitialToggleStyle(uiSettings.toggleStyle)
        : uiSettings.toggleStyle,
    }),
    [uiSettings]
  );

  const navOptsAvailableKeys = useMemo(
    () => Object.keys(navigationOptionsAvailable),
    [navigationOptionsAvailable]
  );

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={handleSave}
      validate={validate}
      validateOnChange
    >
      {({ dirty, isValid, isSubmitting, handleSubmit, submitForm }) => (
        <Page
          title="Styles"
          tabs={[{ title: 'General' }, { title: 'Guide-specific' }]}
          actions={
            <Button
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!dirty || !isValid}
              onClick={submitForm}
            >
              Save changes
            </Button>
          }
          onTabIndexChange={onTabChangeHandler}
        >
          <Form onSubmit={handleSubmit}>
            <Box display="flex" gap="10" pb={6}>
              {/* Vertical nav */}
              <Box
                position="sticky"
                top="4"
                display="flex"
                flexDirection="column"
                gap="3"
                minWidth="40"
                height="min"
              >
                {navOptsAvailableKeys.map((section, sectionIndex) => {
                  const navOpt: NavigationItems<SectionName>[SectionName] =
                    navigationOptionsAvailable[section];

                  return (
                    <Box
                      key={`settings-nav-${sectionIndex}`}
                      display="flex"
                      flexDirection="column"
                      gap="2"
                    >
                      {navOptsAvailableKeys.length > 1 && (
                        <Box fontWeight="bold" fontSize="sm">
                          {navOpt.title}
                        </Box>
                      )}
                      {(navOpt.options as NavigationOption[]).map(
                        (navItem, optionIndex) => {
                          const selected = isSelected(
                            navItem,
                            sectionIndex,
                            optionIndex
                          );

                          return (
                            <Link
                              key={`settings-nav-${sectionIndex}-option-${optionIndex}`}
                              id={getNavSettingId(navItem.anchor)}
                              onClick={(event) =>
                                handleNavigationClicked(event, navItem)
                              }
                              className="p-0.5 pl-4 rounded-l-md border-l-4"
                              backgroundColor={
                                selected ? 'bento.pale' : 'transparent'
                              }
                              borderColor={
                                selected ? 'bento.bright' : 'transparent'
                              }
                              as={ScrollLink as any}
                              to={navItem.anchor}
                              onSetActive={handleAnchorChanged}
                              offset={-190}
                              spy
                              isDynamic
                              containerId="page-content-wrapper"
                            >
                              <Box position="relative" display="inline">
                                {navItem.title}
                                <NotificationWrapper
                                  optionTitle={navItem.title}
                                />
                              </Box>
                            </Link>
                          );
                        }
                      )}
                    </Box>
                  );
                })}
              </Box>
              {/* Page content */}
              <Box display="flex" flexDirection="column" gap={24} pb={24}>
                {SettingsAvailable.map((SettingsComponent: any, i) => (
                  <Box key={`branding-settings-sec-${i}`}>
                    <SettingsComponent
                      addValidator={addValidator}
                      integrations={orgSettings.integrationApiKeys}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Form>
          <UnsavedChangesManager
            warningEnabled={preventPageChange && dirty}
            onContinue={handleSubmit}
            onDiscard={() => setPreventPageChange(false)}
            exceptionUrlRegExp={[/^\/styles\??(?:&?[^=&]*=[^=&]*)*/]}
          />
        </Page>
      )}
    </Formik>
  );
}

export const UI_SETTINGS_FRAGMENT = graphql`
  fragment UISettings_all on OrganizationUISettings {
    primaryColorHex
    additionalColors {
      value
    }
    secondaryColorHex
    sidebarStyle
    appContainerIdentifier
    fontColorHex
    borderColor
    embedBackgroundHex
    sidebarBackgroundColor
    cardBackgroundColor
    toggleStyle
    toggleColorHex
    toggleText
    sidebarSide
    toggleTextColor
    isEmbedToggleColorInverted
    embedCustomCss
    embedToggleBehavior
    tagPrimaryColor
    tagTextColor
    tagDotSize
    tagPulseLevel
    tagBadgeIconPadding
    tagBadgeIconBorderRadius
    tagCustomIconUrl
    tagVisibility
    paragraphFontSize
    sidebarVisibility
    sidebarAvailability
    paragraphLineHeight
    cyoaOptionBackgroundColor
    cyoaOptionBorderColor
    cyoaOptionShadow
    cyoaOptionShadowHover
    cyoaTextColor
    theme
    floatingAnchorXOffset
    floatingAnchorYOffset
    stepCompletionStyle
    stepSeparationStyle {
      type
      boxCompleteBackgroundColor
      boxActiveStepShadow
      boxBorderRadius
    }
    inlineContextualStyle {
      borderRadius
      borderColor
      shadow
      padding
    }
    inlineEmptyBehaviour
    sidebarHeader {
      type
      progressBar
      closeIcon
      showModuleNameInStepView
    }
    sidebarBlocklistedUrls
    allGuidesStyle {
      allGuidesTitle
      activeGuidesTitle
      previousGuidesTitle
      previousAnnouncementsTitle
    }
    quickLinks {
      url
      title
      icon
    }
    helpCenter {
      source
      url
      liveChat
      issueSubmission
      kbSearch
      targeting {
        account {
          type
          rules {
            attribute
            ruleType
            valueType
            value
          }
          grouping
        }
        accountUser {
          type
          rules {
            attribute
            ruleType
            valueType
            value
          }
          grouping
        }
      }
    }
    helpCenterStyle {
      supportTicketTitle
      chatTitle
    }
    modalsStyle {
      paddingX
      paddingY
      shadow
      borderRadius
      backgroundOverlayColor
      backgroundOverlayOpacity
    }
    tooltipsStyle {
      paddingX
      paddingY
      shadow
      borderRadius
    }
    ctasStyle {
      paddingX
      paddingY
      fontSize
      lineHeight
      borderRadius
    }
    bannersStyle {
      padding
      shadow
      borderRadius
    }
    responsiveVisibility {
      all
    }
  }
`;

const UI_SETTINGS_QUERY = graphql`
  query UISettingsQuery {
    uiSettings {
      ...UISettings_all @relay(mask: false)
    }
    orgSettings {
      integrationApiKeys {
        type
        state
        zendeskState {
          liveChat
          kbSearch
        }
      }
    }
  }
`;

export default function UISettingsQueryRenderer() {
  return (
    <QueryRenderer<UISettingsQuery>
      query={UI_SETTINGS_QUERY}
      render={({ props, retry }) => {
        if (!props) return null;
        return (
          <AttributesProvider>
            <UISettings {...props} onRefetch={retry} />
          </AttributesProvider>
        );
      }}
    />
  );
}
