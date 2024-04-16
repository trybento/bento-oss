import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Text,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Flex,
  Box,
  RadioGroup,
  Radio,
  FormLabel,
} from '@chakra-ui/react';
import ModalBody from '../ModalBody';
import UrlInput, { doUrlChecks } from '../UrlInput';
import {
  EmbedLinkStyle,
  EmbedLinkElement,
  EmbedLinkElementOptions,
  EmbedLinkElementSources,
} from 'bento-common/types/slate';
import ButtonStyles from './extensions/Button/ButtonStyles';
import {
  Attribute,
  FormFactorStyle,
  GuideFormFactor,
} from 'bento-common/types';
import { embedLinkDefaltOptions } from 'bento-common/utils/embedSlate';
import cloneDeep from 'lodash/cloneDeep';
import { RichTextEditorUISettings } from './helpers';
import { Modal } from '../Modal';

interface EmbedLinkModalProps<S extends EmbedLinkElementSources> {
  attributes: Attribute[];
  uiSettings: RichTextEditorUISettings;
  isOpen: boolean;
  onSave: (data: Partial<EmbedLinkElement>) => void;
  onCancel: () => void;
  initialUrl?: string;
  allowEmpty?: boolean;
  source: S;
  initialOptions: EmbedLinkElementOptions<S>;
  formFactor: GuideFormFactor;
  formFactorStyle?: FormFactorStyle;
}

// NOTE: Actions that handle opening and closing this modal can be found in slate/hooks/useEmbedLinkTrigger

export default function EmbedLinkModal<S extends EmbedLinkElementSources>({
  attributes,
  uiSettings,
  isOpen,
  onSave,
  initialUrl = '',
  onCancel,
  allowEmpty,
  source,
  initialOptions,
  formFactor,
  formFactorStyle,
}: EmbedLinkModalProps<S>) {
  const [url, setUrl] = useState(initialUrl);
  const [isValid, setIsValid] = useState(true);
  const [options, setOptions] = useState(initialOptions);

  useEffect(() => {
    isOpen && setUrl(initialUrl);
  }, [isOpen]);

  const cancelAndClear = useCallback((): void => {
    onCancel();
  }, [onCancel]);

  const onUrlChange = useCallback((newValue: string, valid: boolean) => {
    setUrl(newValue);
    setIsValid(valid);
  }, []);

  const onOptionChange = useCallback(
    (
      opt: keyof EmbedLinkElementOptions<S>,
      value: EmbedLinkElementOptions<S>[typeof opt]
    ) => {
      setOptions((opts) => ({ ...opts, [opt]: value }));
    },
    []
  );

  const onCalendlyStyleChange = useCallback((style: EmbedLinkStyle) => {
    if (style === EmbedLinkStyle.button) {
      setOptions((opts) => ({
        ...opts,
        buttonOptions: cloneDeep(
          embedLinkDefaltOptions.calendly(formFactor).buttonOptions
        ),
      }));
    }
    // @ts-ignore
    onOptionChange('style', style);
  }, []);

  const onButtonSyleChange = useCallback(
    (
      key: keyof EmbedLinkElement['buttonOptions'],
      value: EmbedLinkElement['buttonOptions'][typeof key]
    ) => {
      // @ts-ignore
      onOptionChange('buttonOptions', {
        ...(options.buttonOptions || {}),
        [key]: value,
      });
    },
    [options.buttonOptions]
  );

  const onConfirm = useCallback(() => {
    if (allowEmpty || url.trim() !== '') {
      onSave({ url: doUrlChecks(url), ...options });
    }
  }, [allowEmpty, url, options]);

  return (
    <Modal isOpen={isOpen} onClose={cancelAndClear} size="lg" closeOnEsc={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialUrl ? 'Update' : 'Add'} Embed</ModalHeader>
        <ModalBody>
          <Flex direction="column" gap="3">
            <Box>
              <FormLabel variant="secondary">URL</FormLabel>
              <UrlInput
                attributes={attributes}
                initialUrl={initialUrl}
                onContentChange={onUrlChange}
                onEnter={onConfirm}
                autoFocus
                allowWildcards={false}
              />
              <Text fontSize="xs" color="gray.600" mt={2}>
                We recommend using absolute urls (i.e. https://www.acmeco.co) so
                that your links preview correctly
              </Text>
            </Box>
            {source === 'calendly' ? (
              <>
                <Box>
                  <FormLabel variant="secondary">Embed type</FormLabel>
                  <RadioGroup
                    onChange={onCalendlyStyleChange}
                    defaultValue={initialOptions.style}
                    display="flex"
                    gap="3"
                  >
                    <Radio value={EmbedLinkStyle.link}>Link</Radio>
                    <Radio value={EmbedLinkStyle.button}>Button</Radio>
                    <Radio value={EmbedLinkStyle.inline}>Inline embed</Radio>
                  </RadioGroup>
                </Box>
                {options.style === EmbedLinkStyle.button && (
                  <ButtonStyles
                    attributes={attributes}
                    uiSettings={uiSettings}
                    initialValues={options.buttonOptions}
                    formFactor={formFactor}
                    formFactorStyle={formFactorStyle}
                    onChange={onButtonSyleChange}
                  />
                )}
              </>
            ) : null}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={cancelAndClear}>
              Cancel
            </Button>
            <Button
              isDisabled={useMemo(
                () => !isValid || (url.trim() === '' && !allowEmpty),
                [url, allowEmpty, isValid]
              )}
              onClick={onConfirm}
            >
              {initialUrl ? 'Save' : 'Create'}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
