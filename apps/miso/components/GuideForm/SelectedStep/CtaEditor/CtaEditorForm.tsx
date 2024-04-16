import React, { useCallback, useEffect, useMemo } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { get } from 'lodash';
import { Input, FormLabel, Flex, Text } from '@chakra-ui/react';
import cx from 'classnames';

import OpenInNew from '@mui/icons-material/OpenInNew';
import { DOCS_TRIGGERING_IN_APP_ACTIONS_URL } from 'bento-common/utils/docs';

import {
  Attribute,
  BannerStyle,
  CardStyle,
  CtaColorFields,
  CtaInput,
  GuideFormFactor,
  StepCtaStyle,
  StepCtaType,
  StepType,
  TooltipStyle,
} from 'bento-common/types';
import {
  getButtonClickUrlTarget,
  isUrlCta,
  MAX_STEP_CTA_TEXT_LENGTH,
} from 'bento-common/data/helpers';
import {
  isAnnouncementGuide,
  isTooltipGuide,
  isFlowGuide,
} from 'bento-common/utils/formFactor';
import { guidePrivateOrPublicNameOrFallback } from 'bento-common/utils/naming';

import Box from 'system/Box';
import Select, {
  OptionWithSubLabel,
  SelectOptions,
  ExtendedSelectOptions,
  SingleValueWithIcon,
} from 'system/Select';
import UrlInput from 'components/common/UrlInput';
import { ErrorCallout } from 'bento-common/components/CalloutText';
import {
  CTA_STYLE_OPTIONS,
  getCtaColorOptions,
} from 'bento-common/utils/buttons';
import SimpleCharCount from 'bento-common/components/CharCount/SimpleCharCount';
import { useUISettings } from 'queries/OrganizationUISettingsQuery';
import { useAllTemplates } from 'providers/AllTemplatesProvider';
import {
  guideComponentIcon,
  guideComponentLabel,
} from '../../../../helpers/presentational';
import { useTemplate } from 'providers/TemplateProvider';
import SelectField from 'components/common/InputFields/SelectField';
import PopoverTip from 'system/PopoverTip';
import DynamicAttributeInput from 'bento-common/components/ModalDynamicAttribute/DynamicAttributeInput';
import SwitchField from 'components/common/InputFields/SwitchField';
import FieldArrayErrorMessage from 'components/common/FieldArrayErrorMessage';
import { useOrganization } from 'providers/LoggedInUserProvider';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';
import { CtaEditorFormValues } from './types';
import { createCtaWithDefaults } from './helpers';
import SeparatorBox from 'components/EditorCommon/SeparatorBox';
import { GuideShape } from 'bento-common/types/globalShoyuState';
import { RichTextEditorUISettings } from 'bento-common/components/RichTextEditor/helpers';
import { useAttributes } from 'providers/AttributesProvider';
import HelperText from 'bento-common/components/HelperText';
import InlineLink from 'components/common/InlineLink';
import { areFlowCtasCompliant } from 'bento-common/validation/guide';
import colors from 'helpers/colors';

interface Props {
  stepType: StepType;
  formFactor: GuideFormFactor;
  formFactorStyle: CardStyle | TooltipStyle | BannerStyle | undefined;
  ctaTypeOptions: ExtendedSelectOptions[];
  /**
   * Path within the forms value that points to the target CTA data
   */
  formKey: string;
  uiSettings: ReturnType<typeof useUISettings>;
  /**
   * The URL of the next Step of the Flow, in case one exists and this is a Flow-type guide.
   */
  nextUrlOfFlow?: string;
}

const CtaEditorForm: React.FC<Props> = ({
  ctaTypeOptions,
  formFactor,
  formFactorStyle,
  formKey,
  stepType,
  uiSettings,
  nextUrlOfFlow,
}) => {
  const {
    setFieldValue,
    setFieldTouched,
    values: formValues,
  } = useFormikContext<CtaEditorFormValues>();
  const { organization } = useOrganization();

  const ctaColorOptions = useMemo(
    () =>
      getCtaColorOptions(
        formFactor,
        uiSettings as RichTextEditorUISettings,
        formFactorStyle,
        [CtaColorFields.guideBackgroundColor]
      ),
    [uiSettings, formFactorStyle, formFactor]
  );

  const ctaTextColorOptions = useMemo(
    () =>
      getCtaColorOptions(
        formFactor,
        uiSettings as RichTextEditorUISettings,
        formFactorStyle
      ),
    [uiSettings, formFactorStyle, formFactor]
  );

  const values = useMemo<CtaInput>(
    () => get(formValues, formKey),
    [formValues, formKey]
  );

  const { entityId, text, url, type, style, settings } = values;

  const ctaTypeValue = useMemo<ExtendedSelectOptions | undefined>(() => {
    const targetValue =
      type === StepCtaType.urlComplete ? StepCtaType.url : type;
    return ctaTypeOptions.find((opt) => opt.value === targetValue);
  }, [ctaTypeOptions, type]);

  /** @todo improve types on the provider below based on $withMeta switch */
  const { templates, isLoading: isLoadingTemplates } = useAllTemplates();
  const { template } = useTemplate();
  const { entityId: currentTemplateEntityId } = template || {};
  const enabledPrivateNames = useInternalGuideNames();

  const { attributes } = useAttributes();

  // Set the default value for 'opensInNewTab'
  // if undefined.
  useEffect(() => {
    if (settings.opensInNewTab === undefined && organization) {
      const fieldKey = `${formKey}.settings.opensInNewTab`;
      setFieldValue(
        fieldKey,
        getButtonClickUrlTarget(url, organization.domain) === '_blank'
      );
      setFieldTouched(fieldKey, true, false);
    }
  }, [formKey, type]);

  const handleTypeChange = useCallback(
    (option: SelectOptions<StepCtaType>) => {
      // if the type is the same, do nothing...
      if (option.value === type) return;

      const newCta = createCtaWithDefaults(option.value, formFactor, stepType);
      if (newCta) {
        setFieldValue(formKey, {
          ...newCta,
          // keeps the entity id in case we're changing the type of a persisted instance
          entityId,
        });
      }
    },
    [entityId, type, formKey, stepType, formFactor]
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const fieldKey = `${formKey}.text`;
      setFieldValue(fieldKey, e.target.value);
      setFieldTouched(fieldKey, true, false);
    },
    [formKey]
  );

  const handleUrlChange = useCallback(
    (value: string) => {
      const fieldKey = `${formKey}.url`;
      setFieldValue(fieldKey, value);
      setFieldTouched(fieldKey, true, false);
    },
    [formKey]
  );

  const showConflictingFlowCtaWarning = useMemo(() => {
    if (isFlowGuide(formFactor) && values && nextUrlOfFlow) {
      return areFlowCtasCompliant([values], nextUrlOfFlow) === false;
    }
    return false;
  }, [formFactor, values, nextUrlOfFlow]);

  const destinationGuideOptions = useMemo(() => {
    return type === StepCtaType.launch
      ? templates.reduce((list, template) => {
          const isInlineContextual =
            template?.isSideQuest &&
            template?.formFactor === GuideFormFactor.inline;

          if (
            template.entityId === currentTemplateEntityId ||
            isInlineContextual ||
            template.isCyoa
          )
            return list;

          const IconElement = guideComponentIcon(template as GuideShape);
          list.push({
            Icon: <IconElement />,
            alt: guideComponentLabel(template as GuideShape),
            label: guidePrivateOrPublicNameOrFallback(
              enabledPrivateNames,
              template
            ),
            value: template.entityId,
            extra: {
              title: 'Open in new window',
              icon: OpenInNew,
              callback: () =>
                window.open(
                  `/library/templates/${template.entityId}`,
                  '_blank'
                ),
            },
          });

          return list;
        }, [] as ExtendedSelectOptions[])
      : [];
  }, [type, templates, enabledPrivateNames]);

  const selectedDestinationGuide = useMemo(() => {
    return destinationGuideOptions.find(
      (option) => option.value === values.destinationGuide
    );
  }, [values.destinationGuide, destinationGuideOptions]);

  const destinationGuideSelected = useCallback(
    (option: SelectOptions) => {
      const fieldKey = `${formKey}.destinationGuide`;
      setFieldValue(fieldKey, option.value);
      setFieldTouched(fieldKey, true, false);
    },
    [formKey]
  );

  const handleChangeUrlCtaType = useCallback(
    (value: StepCtaType) => {
      const fieldKey = `${formKey}.type`;
      setFieldValue(fieldKey, value);
      setFieldTouched(fieldKey, true, false);
    },
    [formKey]
  );

  const handleEventNameChange = useCallback(
    (value: string) => {
      const fieldKey = `${formKey}.settings.eventName`;
      setFieldValue(fieldKey, value);
      setFieldTouched(fieldKey, true, false);
    },
    [formKey]
  );

  const styleOptionSelected = style
    ? CTA_STYLE_OPTIONS.find((o) => o.value === style)
    : CTA_STYLE_OPTIONS[0];

  const ctaBgColorOptionSelected = settings?.bgColorField
    ? ctaColorOptions.find((o) => o.value === settings.bgColorField) ||
      ctaColorOptions[0]
    : ctaColorOptions[0];

  const ctaTextColorOptionSelected = settings?.textColorField
    ? ctaTextColorOptions.find((o) => o.value === settings.textColorField) ||
      ctaTextColorOptions[1]
    : ctaTextColorOptions[1];

  const showStyles = !!(styleOptionSelected && CTA_STYLE_OPTIONS.length > 1);

  return (
    <SeparatorBox variant="secondary" flexDir="column" gap="6">
      {!settings.implicit && (
        <Field name={`${formKey}.type`}>
          {({ field }: FieldProps) => (
            <Box>
              <FormLabel variant="secondary">
                What do you want your button to do?
              </FormLabel>
              <Select
                isSearchable={false}
                options={ctaTypeOptions}
                value={ctaTypeValue}
                onChange={handleTypeChange}
                components={{
                  Option: OptionWithSubLabel(),
                }}
              />
              <FieldArrayErrorMessage
                name={field.name}
                component={ErrorCallout}
                className="my-2"
              />
            </Box>
          )}
        </Field>
      )}

      {isUrlCta(type) && (
        <Field name={`${formKey}.url`}>
          {({ field }: FieldProps) => (
            <Box>
              <FormLabel variant="secondary">Destination URL</FormLabel>
              <UrlInput
                // avoid conflicts across instances
                key={`${formKey}.url`}
                initialUrl={url}
                onContentChange={handleUrlChange}
                warnOnRelativeUrls
                allowWildcards={false}
                inputStyle={{
                  borderColor: showConflictingFlowCtaWarning
                    ? colors.warning.bright
                    : undefined,
                }}
              />
              {showConflictingFlowCtaWarning && (
                <Text fontSize="xs" my={2} color={colors.warning.text}>
                  This redirects to a URL that’s different from the next step,
                  which will disrupt the flow. Consider having the link open in
                  a new tab.
                </Text>
              )}
              <FieldArrayErrorMessage
                name={field.name}
                component={ErrorCallout}
                className="my-2"
              />
              <SwitchField
                // avoid conflicts across instances
                key={`${formKey}.settings.opensInNewTab`}
                name={`${formKey}.settings.opensInNewTab`}
                defaultValue={settings.opensInNewTab}
                checkedOption={{
                  value: true,
                  label: 'Open link in new tab',
                }}
                uncheckedOption={{ value: false }}
                mt="2"
                as="checkbox"
              />
              <SwitchField
                // avoid conflicts across instances
                key={`${formKey}.type`}
                defaultValue={values.type}
                checkedOption={{ value: StepCtaType.urlComplete }}
                uncheckedOption={{
                  value: StepCtaType.url,
                  label: 'Also mark step as completed',
                }}
                mt="2"
                onChange={handleChangeUrlCtaType}
                as="checkbox"
              />
            </Box>
          )}
        </Field>
      )}
      {values.type === StepCtaType.launch && (
        <Field name={`${formKey}.destinationGuide`}>
          {({ field }: FieldProps) => (
            <Box>
              <FormLabel variant="secondary">Destination guide</FormLabel>
              <Select
                options={destinationGuideOptions}
                defaultValue={selectedDestinationGuide}
                isLoading={isLoadingTemplates}
                onChange={destinationGuideSelected}
                components={{
                  Option: OptionWithSubLabel(),
                  SingleValue: SingleValueWithIcon(),
                }}
                key={`${formKey}.settings.destination`}
              />
              <HelperText>
                You don't need to auto-launch or set targeting rules on the
                linked guide. Read more{' '}
                <InlineLink
                  href="https://help.trybento.co/en/articles/6476679-launch-guide-cta"
                  target="_blank"
                >
                  here
                </InlineLink>
              </HelperText>
              {/* Announcements and tooltips should always mark the step as complete */}
              <SwitchField
                // avoid conflicts across instances
                key={`${formKey}.settings.markComplete`}
                name={`${formKey}.settings.markComplete`}
                defaultValue={
                  isAnnouncementGuide(formFactor) ||
                  isTooltipGuide(formFactor) ||
                  isFlowGuide(formFactor) ||
                  !!values.settings?.markComplete
                }
                checkedOption={{ value: true }}
                uncheckedOption={{
                  value: false,
                  label: 'Also mark step as completed',
                }}
                disabled={
                  isAnnouncementGuide(formFactor) ||
                  isFlowGuide(formFactor) ||
                  isTooltipGuide(formFactor)
                }
                mt="2"
                as="checkbox"
              />
              <FieldArrayErrorMessage
                name={field.name}
                component={ErrorCallout}
                className="my-2"
              />
            </Box>
          )}
        </Field>
      )}
      {values.type === StepCtaType.event && (
        <Field name={`${formKey}.settings.eventName`}>
          {({ field }: FieldProps) => (
            <Box>
              <FormLabel variant="secondary">
                Event message
                <PopoverTip>
                  Learn more about Bento events{' '}
                  <a href={DOCS_TRIGGERING_IN_APP_ACTIONS_URL} target="_blank">
                    here
                  </a>
                </PopoverTip>
              </FormLabel>
              <DynamicAttributeInput
                attributes={attributes as Attribute[]}
                initialValue={field.value}
                onContentChange={handleEventNameChange}
                key={`${formKey}.settings.eventName`}
              />
              <SwitchField
                // avoid conflicts across instances
                key={`${formKey}.settings.markComplete`}
                name={`${formKey}.settings.markComplete`}
                defaultValue={!!values.settings?.markComplete}
                checkedOption={{ value: true }}
                uncheckedOption={{
                  value: false,
                  label: 'Also mark step as completed',
                }}
                mt="2"
                as="checkbox"
              />
              <FieldArrayErrorMessage
                name={field.name}
                component={ErrorCallout}
                className="my-2"
              />
            </Box>
          )}
        </Field>
      )}

      <Box>
        <Flex gap="2">
          <Box flexGrow="1">
            <FormLabel variant="secondary">Text</FormLabel>
            <Input
              name={`${formKey}.text`}
              fontSize="sm"
              value={values.text}
              onChange={handleTextChange}
              maxLength={MAX_STEP_CTA_TEXT_LENGTH}
            />
            <SimpleCharCount limit={MAX_STEP_CTA_TEXT_LENGTH} text={text} />
          </Box>
          {showStyles && (
            <SelectField
              // avoid conflicts across instances
              name={`${formKey}.style`}
              key={`${formKey}.style`}
              label="Style"
              variant="secondary"
              alignSelf="self-start"
              options={CTA_STYLE_OPTIONS}
              defaultValue={styleOptionSelected.value}
              w="140px"
              flexShrink="0"
              selectWidth="full"
              components={{
                Option: OptionWithSubLabel({
                  color: uiSettings?.primaryColorHex,
                }),
                SingleValue: SingleValueWithIcon({
                  color: uiSettings?.primaryColorHex,
                }),
              }}
            />
          )}
        </Flex>
        <FieldArrayErrorMessage
          name={`${formKey}.text`}
          component={ErrorCallout}
          className="my-2"
        />
      </Box>

      <SelectField
        name={`${formKey}.settings.bgColorField`}
        label="Color"
        variant="secondary"
        alignSelf="self-start"
        options={ctaColorOptions}
        defaultValue={ctaBgColorOptionSelected.value}
        components={{
          Option: OptionWithSubLabel(),
          SingleValue: SingleValueWithIcon(),
        }}
      />
      {style === StepCtaStyle.solid && (
        <SelectField
          name={`${formKey}.settings.textColorField`}
          label="Text color"
          variant="secondary"
          alignSelf="self-start"
          options={ctaTextColorOptions}
          defaultValue={ctaTextColorOptionSelected.value}
          components={{
            Option: OptionWithSubLabel(),
            SingleValue: SingleValueWithIcon(),
          }}
        />
      )}
    </SeparatorBox>
  );
};

export default CtaEditorForm;
