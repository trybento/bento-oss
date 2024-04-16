import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Flex, FormLabel } from '@chakra-ui/react';
import { noop } from 'bento-common/utils/functions';
import {
  Attribute,
  CtaColorFields,
  StepCtaSettings,
  StepCtaStyle,
} from 'bento-common/types';

import DynamicAttributeInput from '../../../ModalDynamicAttribute/DynamicAttributeInput';
import { MAX_STEP_CTA_TEXT_LENGTH } from 'bento-common/data/helpers';
import SimpleCharCount from '../../../CharCount/SimpleCharCount';
import SelectField from '../../../SelectField';
import { OptionWithSubLabel, SingleValueWithIcon } from '../../../Select';
import type { ButtonModalProps } from './ButtonModal';
import {
  CTA_STYLE_OPTIONS,
  getButtonStyles,
  getCtaColorOptions,
  undefinedCtaColorFallbacks,
} from '../../../../utils/buttons';
import { RichTextEditorUISettings } from '../../helpers';

type Props = {
  attributes: Attribute[];
  uiSettings: RichTextEditorUISettings;
  onChange: (field: string, value: any) => void;
} & Pick<ButtonModalProps, 'formFactor' | 'formFactorStyle' | 'initialValues'>;

export default function ButtonStyles({
  attributes,
  uiSettings,
  initialValues,
  formFactor,
  formFactorStyle,
  onChange,
}: Props) {
  const ctaColorOptions = useMemo(
    () =>
      getCtaColorOptions(formFactor, uiSettings, formFactorStyle, [
        CtaColorFields.guideBackgroundColor,
      ]),
    [uiSettings, formFactorStyle, formFactor]
  );

  const ctaTextColorOptions = useMemo(
    () => getCtaColorOptions(formFactor, uiSettings, formFactorStyle),
    [uiSettings, formFactorStyle, formFactor]
  );

  const [text, setText] = useState(initialValues.text);
  const [style, setStyle] = useState<StepCtaStyle>(initialValues.style);
  const [settings, setSettings] = useState<StepCtaSettings>(
    initialValues.settings
  );

  const styleOptionSelected = useMemo(
    () => CTA_STYLE_OPTIONS.find((o) => o.value === style),
    [style]
  );
  const showStyles = !!(styleOptionSelected && CTA_STYLE_OPTIONS.length > 1);

  const ctaBgColorOptionSelected =
    ctaColorOptions.find((o) => o.value === settings.bgColorField) ||
    ctaColorOptions[0];

  const ctaTextColorOptionSelected =
    ctaTextColorOptions.find((o) => o.value === settings.textColorField) ||
    ctaTextColorOptions[1];

  useEffect(() => {
    onChange('text', text);
  }, [text]);

  useEffect(() => {
    onChange('style', style);
  }, [style]);

  useEffect(() => {
    onChange('settings', settings);
  }, [settings]);

  return (
    <>
      <Box>
        <FormLabel variant="secondary">Preview</FormLabel>
        <Box textAlign="center">
          <Button
            onClick={noop}
            {...getButtonStyles(
              { settings, style },
              uiSettings,
              formFactorStyle,
              formFactor,
              undefinedCtaColorFallbacks
            )}
            _hover={{ opacity: 0.8 }}
          >
            {text}
          </Button>
        </Box>
      </Box>

      <Flex gap="2">
        <Box flex="1">
          <FormLabel variant="secondary">Text</FormLabel>
          <DynamicAttributeInput // TODO: autofocus
            attributes={attributes}
            initialValue={initialValues.text}
            onContentChange={setText}
            maxLength={MAX_STEP_CTA_TEXT_LENGTH}
          />
          <Box display="flex">
            <SimpleCharCount
              limit={MAX_STEP_CTA_TEXT_LENGTH}
              text={text}
              textAlign="right"
              mr="auto"
            />
          </Box>
        </Box>
        {showStyles && (
          <SelectField
            label="Style"
            variant="secondary"
            alignSelf="self-start"
            name="style"
            options={CTA_STYLE_OPTIONS}
            defaultValue={styleOptionSelected.value}
            onChange={(o) => setStyle(o.value as StepCtaStyle)}
            w="140px"
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
      <SelectField
        label="CTA color"
        variant="secondary"
        alignSelf="self-start"
        name="bgColorField"
        options={ctaColorOptions}
        defaultValue={ctaBgColorOptionSelected.value}
        onChange={(o) => setSettings((s) => ({ ...s, bgColorField: o.value }))}
        components={{
          Option: OptionWithSubLabel(),
          SingleValue: SingleValueWithIcon(),
        }}
      />
      {style === StepCtaStyle.solid && (
        <SelectField
          label="Text color"
          variant="secondary"
          alignSelf="self-start"
          name="textColorField"
          options={ctaTextColorOptions}
          onChange={(o) =>
            setSettings((s) => ({ ...s, textColorField: o.value }))
          }
          defaultValue={ctaTextColorOptionSelected.value}
          components={{
            Option: OptionWithSubLabel(),
            SingleValue: SingleValueWithIcon(),
          }}
        />
      )}
    </>
  );
}
