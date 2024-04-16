import React, { useCallback, useMemo } from 'react';
import {
  Box,
  BoxProps,
  Flex,
  FormControl,
  FormLabel,
  Text,
} from '@chakra-ui/react';
import { Field, FieldProps, useFormikContext } from 'formik';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  GuideFormFactor,
  GuidePageTargetingType,
  TagContext,
  Theme,
  WysiwygEditorMode,
} from 'bento-common/types';
import StepPrototypeTag from '../../Tags/StepPrototypeTag';
import UrlInput from 'components/common/UrlInput';
import InlineEmbedForm from '../../Library/InlineEmbedForm';
import InteractiveTooltip from 'system/InteractiveTooltip';
import { useTemplate } from 'providers/TemplateProvider';
import {
  isCarousel,
  isSidebarContextualGuide,
  isSidebarInjectedAsInline,
} from 'bento-common/utils/formFactor';
import RadioGroupField from 'components/common/InputFields/RadioGroupField';
import colors from 'helpers/colors';
import { useAutoInjectInlineEmbed, useHideSidebar } from 'hooks/useFeatureFlag';
import OnboardingEmbedSettings from './OnboardingEmbedSettings';
import { TEMPLATE_TARGETING_OPTIONS } from 'components/Library/library.constants';
import { TemplateFormValues } from 'components/Templates/Template';
import { TemplateForm } from '../EditTemplate';
import { isVideoGalleryTheme } from 'bento-common/data/helpers';
import { WysiwygEditorAction } from 'components/WysiwygEditor/utils';

type EmbedLocationFormProps = {
  disabled?: boolean;
  template: TemplateForm;
  currentValues: TemplateFormValues;
  header?: string;
} & BoxProps;

const sidebarTargetingTypes = Object.keys(TEMPLATE_TARGETING_OPTIONS).flatMap(
  (option) =>
    option === GuidePageTargetingType.inline
      ? []
      : [
          {
            label: TEMPLATE_TARGETING_OPTIONS[option].label,
            value: option,
          },
        ]
);

const inlineTargetingTypes = [
  {
    label: TEMPLATE_TARGETING_OPTIONS.inline.label,
    value: GuidePageTargetingType.inline,
  },
];

/**
 * Displays location form for checklist type guides.
 */
const EmbedLocationForm = ({
  template,
  disabled,
  currentValues,
  header,
  ...boxProps
}: EmbedLocationFormProps) => {
  const {
    initialValues,
    values: { templateData },
    setFieldValue,
  } = useFormikContext<TemplateFormValues>();

  const {
    handleTargetingTypeChange,
    isTooltip,
    isOnboarding,
    handleEditOrCreateInlineEmbed,
  } = useTemplate();

  const isInline =
    template.formFactor === GuideFormFactor.inline &&
    !isSidebarInjectedAsInline(
      template.theme as Theme,
      template.isSideQuest,
      template.formFactor as GuideFormFactor
    );
  const disableSidebar = useHideSidebar();

  const showOnboardingTargeting = isOnboarding;
  const autoInjectEnabled = useAutoInjectInlineEmbed();

  /**
   * There are two forms that need to have the targeting updated:
   * - The edit template form
   * - The template settings form
   * This is needed as far as forms aren't
   * consolidated.
   */
  const handleTargetingChange = useCallback(
    (option) => {
      const newType = option as GuidePageTargetingType;
      setFieldValue('templateData.pageTargetingType', newType);
      /**
       * Also update the main form.
       */
      handleTargetingTypeChange(newType);
      setFieldValue(
        'templateData.pageTargetingUrl',
        initialValues.templateData.pageTargetingUrl &&
          newType !== GuidePageTargetingType.specificPage
          ? ''
          : initialValues.templateData.pageTargetingUrl,
        false
      );
    },
    [
      initialValues.templateData.pageTargetingUrl,
      handleTargetingTypeChange,
      setFieldValue,
    ]
  );

  const handleTargetingUrlChange = useCallback(
    (fieldName: string) => (value: string) => {
      setFieldValue(fieldName, value, true);
    },
    [setFieldValue]
  );

  const shouldShow = useMemo(() => {
    if (showOnboardingTargeting) return true;

    /** @todo can we do this without all the casting? */
    const castTemplate = template as {
      formFactor: GuideFormFactor;
      theme: Theme;
      isSideQuest: boolean;
    };

    if (
      isSidebarContextualGuide(castTemplate) ||
      isCarousel(castTemplate) ||
      isVideoGalleryTheme(template.theme as Theme)
    )
      return true;

    return false;
  }, [template, showOnboardingTargeting]);

  const openInlineEmbedEditor = useCallback(async () => {
    if (disabled) {
      return;
    }

    const action = currentValues.templateData.inlineEmbed
      ? WysiwygEditorAction.edit
      : WysiwygEditorAction.create;

    const initialMode = currentValues.templateData.inlineEmbed
      ? WysiwygEditorMode.customize
      : undefined;

    handleEditOrCreateInlineEmbed(action, initialMode);
  }, [currentValues.templateData.inlineEmbed, disabled]);

  return !shouldShow ? null : (
    <Box {...boxProps}>
      {header && (
        <Text mb="2" fontSize="lg" fontWeight="bold" color="gray.800">
          {header}
        </Text>
      )}
      {/* Org onboarding targeting */}
      {showOnboardingTargeting &&
        (!autoInjectEnabled ? (
          <Box pt="4">
            <Text>
              ⚠️ Your organization has hard-coded the inline embed into your
              app.
            </Text>
            <Text>
              We will be reaching out to migrate you onto the ✨no-code
              experience so you’ll have more design flexibility
            </Text>
          </Box>
        ) : (
          <OnboardingEmbedSettings disabled={disabled} />
        ))}

      {/* Targeting */}
      {!isTooltip && !isInline && !showOnboardingTargeting && (
        <Flex flexDir="column" gap="4">
          <RadioGroupField
            name=""
            label="Embedded inline"
            fontSize="sm"
            value={templateData.pageTargetingType}
            onChange={handleTargetingChange}
            alignment="vertical"
            options={inlineTargetingTypes}
          />
          {templateData.pageTargetingType === GuidePageTargetingType.inline && (
            <InlineEmbedForm
              inlineEmbed={currentValues.templateData.inlineEmbed}
              label="Choose location in your app"
              disabled={disabled}
              openInlineEmbedEditor={openInlineEmbedEditor}
            />
          )}
          {!disableSidebar && (
            <>
              <Box color={colors.text.secondary}>or</Box>
              <RadioGroupField
                name=""
                label="In sidebar"
                fontSize="sm"
                value={templateData.pageTargetingType}
                onChange={handleTargetingChange}
                alignment="vertical"
                options={sidebarTargetingTypes}
              />
            </>
          )}
        </Flex>
      )}

      {/* Targeting by Page URL */}
      {templateData.pageTargetingType ===
        GuidePageTargetingType.specificPage && (
        <Field name="templateData.pageTargetingUrl">
          {({ field }: FieldProps) => (
            <Box bgColor="#F7FAFC" px={6} py={3} maxW="xl" mt="4">
              <Text mt={2}>
                Enter the page URL that you want the guide to show up on
              </Text>
              <FormControl my={4}>
                <FormLabel>URL</FormLabel>
                <UrlInput
                  disabled={disabled}
                  initialUrl={templateData.pageTargetingUrl}
                  onContentChange={handleTargetingUrlChange(field.name)}
                />
              </FormControl>
            </Box>
          )}
        </Field>
      )}
      {/* Targeting by Visual tag */}
      {templateData.pageTargetingType === GuidePageTargetingType.visualTag && (
        <Box bgColor="#F7FAFC" px={6} py={3} mt="4">
          <Flex alignItems="center" gap="2">
            <Text my={2}>
              Create a visual tag on a particular page element that triggers
              this guide
            </Text>
            <InteractiveTooltip
              placement="top"
              maxWidth="240px"
              label={
                <span>
                  Visual tags help users discover this guide or step. Read more{' '}
                  <a
                    href="https://help.trybento.co/en/?q=visual+tag"
                    target="_blank"
                    style={{ textDecoration: 'underline' }}
                  >
                    here
                  </a>
                  .
                </span>
              }
            >
              <InfoOutlinedIcon fontSize="inherit" />
            </InteractiveTooltip>
          </Flex>
          <StepPrototypeTag
            disabled={disabled}
            context={TagContext.template}
            templateData={currentValues.templateData}
            warnWhenNotSet={true}
          />
        </Box>
      )}

      {isInline && (
        <InlineEmbedForm
          inlineEmbed={currentValues.templateData.inlineEmbed}
          label="Choose location in your app"
          disabled={disabled}
          openInlineEmbedEditor={openInlineEmbedEditor}
        />
      )}
    </Box>
  );
};

export default EmbedLocationForm;
