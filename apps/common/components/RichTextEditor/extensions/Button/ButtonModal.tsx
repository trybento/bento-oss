import React, { useRef, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import pick from 'lodash/pick';
import set from 'lodash/set';
import {
  getButtonClickUrlTarget,
  getDefaultCtaSetting,
} from 'bento-common/data/helpers';
import {
  Attribute,
  BannerStyle,
  CardStyle,
  CarouselStyle,
  GuideFormFactor,
  StepCtaSettings,
  StepCtaStyle,
  TooltipStyle,
  VideoGalleryStyle,
} from 'bento-common/types';
import { DOCS_TRIGGERING_IN_APP_ACTIONS_URL } from 'bento-common/utils/docs';

import ModalBody from '../../../ModalBody';
import Select, { SelectOptions } from '../../../Select';
import PopoverTip from '../../../PopoverTip';
import DynamicAttributeInput from '../../../ModalDynamicAttribute/DynamicAttributeInput';
import UrlInput, { doUrlChecks, hasInvalidWildcards } from '../../../UrlInput';
import { UseButtonTriggerHook } from './useButtonTrigger';
import SwitchField from '../../../SwitchField';
import ButtonStyles from './ButtonStyles';
import { RichTextEditorUISettings } from '../../helpers';
import { Modal } from '../../../Modal';

enum ButtonTypes {
  url = 'url',
  event = 'event',
}
export interface ButtonModalProps {
  attributes: Attribute[];
  uiSettings: RichTextEditorUISettings;
  organizationDomain?: string;
  formFactor: GuideFormFactor;
  formFactorStyle:
    | CarouselStyle
    | CardStyle
    | TooltipStyle
    | BannerStyle
    | VideoGalleryStyle
    | undefined;
  isOpen: boolean;
  initialValues?: {
    clickMessage?: string;
    shouldCollapseSidebar?: boolean;
    url?: string;
    text?: string;
    style?: StepCtaStyle;
    settings?: StepCtaSettings;
  };
  onButton: UseButtonTriggerHook['onButton'];
  onCancel: () => void;
}

const DEFAULT_BUTTON_TEXT = 'Save';
const DEFAULT_URL = 'https://';
const DEFAULT_CLICK_MESSAGE = 'action_name';

const buttonTypeOptions: SelectOptions[] = [
  {
    label: 'Take user to a page',
    value: ButtonTypes.url,
  },
  { label: 'Fire an event to your app', value: ButtonTypes.event },
];

export default function ButtonModal({
  attributes,
  uiSettings,
  organizationDomain,
  isOpen,
  onButton,
  initialValues,
  formFactor,
  formFactorStyle,
  onCancel,
}: ButtonModalProps): JSX.Element {
  const isEditing = !!initialValues;

  const defaultValues: ButtonModalProps['initialValues'] = useMemo(() => {
    const result = {
      clickMessage: initialValues?.clickMessage || '',
      shouldCollapseSidebar: !!initialValues?.shouldCollapseSidebar,
      url: initialValues?.url || DEFAULT_URL,
      text: initialValues?.text || DEFAULT_BUTTON_TEXT,
      style: initialValues?.style || StepCtaStyle.solid,
      settings: {
        ...(initialValues?.settings || getDefaultCtaSetting(formFactor)),
      },
    };

    if (result.settings.opensInNewTab === undefined) {
      result.settings.opensInNewTab =
        getButtonClickUrlTarget(result.url, organizationDomain) === '_blank';
    }

    return result;
  }, [initialValues, organizationDomain]);

  const [selectedButtonType, setSelectedButtonType] = useState<SelectOptions>(
    buttonTypeOptions.find(
      (o) =>
        o.value ===
        (initialValues?.clickMessage ? ButtonTypes.event : ButtonTypes.url)
    )
  );

  const [buttonOptions, setButtonOptions] = useState<
    Pick<ButtonModalProps['initialValues'], 'text' | 'style' | 'settings'>
  >(pick(defaultValues, ['text', 'style', 'settings']));

  const [shouldCollapseSidebar, setShouldCollapseSidebar] = useState<boolean>(
    initialValues?.shouldCollapseSidebar
  );
  const [url, setUrl] = useState(defaultValues.url);
  const [isUrlValid, setIsUrlValid] = useState(
    !hasInvalidWildcards(defaultValues.url, false)
  );
  const [clickMessage, setClickMessage] = useState<string | undefined>(
    defaultValues.clickMessage
  );
  const shouldDispatchEventOnClick =
    selectedButtonType.value === ButtonTypes.event;

  const initialRef = useRef();

  const cancelAndClear = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleShouldCollapseSidebar = useCallback(
    (v: boolean) => setShouldCollapseSidebar(v),
    []
  );

  const handleSelectedButtonType = useCallback(
    (optionSelected) => {
      setSelectedButtonType(optionSelected);

      switch (optionSelected.value) {
        case ButtonTypes.url:
          setUrl(defaultValues.url);
          setClickMessage('');
          break;
        case ButtonTypes.event:
          setUrl('');
          setClickMessage(defaultValues.clickMessage || DEFAULT_CLICK_MESSAGE);
          break;
        default:
          break;
      }
    },
    [defaultValues]
  );

  const handleUrlChange = useCallback((url: string, valid: boolean) => {
    setUrl(url);
    setIsUrlValid(valid);
  }, []);

  const handleOptionsChange = useCallback(
    (
      opt: keyof typeof buttonOptions,
      value: (typeof buttonOptions)[typeof opt]
    ) => {
      setButtonOptions((opts) => ({ ...opts, [opt]: value }));
    },
    []
  );

  const handleSettingChange = useCallback(
    (settingKey: keyof StepCtaSettings) => (value: boolean) => {
      setButtonOptions((state) => {
        const newState = { ...state };
        set(newState, `settings.${settingKey}`, value);
        return newState;
      });
    },
    []
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={cancelAndClear}
      size="xl"
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? 'Edit button' : 'Add a button'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap="3">
            <Box>
              <FormLabel variant="secondary">
                What do you want your button to do?
              </FormLabel>
              <Select
                defaultValue={selectedButtonType}
                onChange={handleSelectedButtonType}
                isSearchable={false}
                options={buttonTypeOptions}
                styles={{
                  container: (provided) => ({
                    ...provided,
                  }),
                }}
              />
            </Box>
            <ButtonStyles
              attributes={attributes}
              uiSettings={uiSettings}
              initialValues={defaultValues}
              formFactor={formFactor}
              formFactorStyle={formFactorStyle}
              onChange={handleOptionsChange}
            />

            {selectedButtonType.value === ButtonTypes.url && (
              <Box>
                <FormLabel variant="secondary">Destination URL</FormLabel>
                <UrlInput
                  attributes={attributes}
                  initialUrl={defaultValues.url}
                  onContentChange={handleUrlChange}
                  warnOnRelativeUrls
                  allowWildcards={false}
                />
              </Box>
            )}
            {selectedButtonType.value === ButtonTypes.event && (
              <Box>
                <FormLabel variant="secondary">
                  Event message
                  <PopoverTip>
                    Learn more about Bento events{' '}
                    <a
                      href={DOCS_TRIGGERING_IN_APP_ACTIONS_URL}
                      target="_blank"
                    >
                      here
                    </a>
                  </PopoverTip>
                </FormLabel>
                <DynamicAttributeInput
                  attributes={attributes}
                  initialValue={
                    defaultValues.clickMessage || DEFAULT_CLICK_MESSAGE
                  }
                  onContentChange={(newValue: string) => {
                    setClickMessage(newValue);
                  }}
                />
              </Box>
            )}
            {selectedButtonType.value === ButtonTypes.url && (
              <SwitchField
                defaultValue={buttonOptions.settings.opensInNewTab}
                checkedOption={{
                  value: true,
                  label: 'Open link in new tab',
                }}
                uncheckedOption={{
                  value: false,
                }}
                onChange={handleSettingChange('opensInNewTab')}
                fontWeight="normal"
                fontSize="sm"
                color="gray.500"
                as="checkbox"
              />
            )}
            <SwitchField
              defaultValue={shouldCollapseSidebar}
              checkedOption={{ value: true }}
              uncheckedOption={{
                value: false,
                label: 'Collapse sidebar on click',
              }}
              onChange={handleShouldCollapseSidebar}
              fontWeight="normal"
              fontSize="sm"
              color="gray.500"
              as="checkbox"
            />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={cancelAndClear}>
              Cancel
            </Button>
            <Button
              isDisabled={useMemo(
                () =>
                  selectedButtonType.value === ButtonTypes.url &&
                  (!isUrlValid ||
                    (url.trim() === '' && !shouldCollapseSidebar)),
                [
                  url,
                  shouldCollapseSidebar,
                  selectedButtonType.value,
                  isUrlValid,
                ]
              )}
              onClick={useCallback(() => {
                const _url =
                  url === DEFAULT_URL || shouldDispatchEventOnClick
                    ? ''
                    : doUrlChecks(url);
                onButton(
                  buttonOptions.text,
                  _url,
                  shouldCollapseSidebar,
                  clickMessage,
                  buttonOptions.settings,
                  buttonOptions.style
                );
              }, [buttonOptions, url, clickMessage, shouldCollapseSidebar])}
            >
              {isEditing ? 'Save' : 'Add'}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
