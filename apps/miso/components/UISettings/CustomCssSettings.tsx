import React, { FC, useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { useFormikContext, Field } from 'formik';
import { Box, BoxProps, FormControl, FormLabel } from '@chakra-ui/react';
import CodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism.css';
import IntersectionObserver from 'components/IntersectionObserver';

import { ModalPosition, ModalSize, ModalStyle } from 'bento-common/types';
import { ContextTagType } from 'bento-common/types/globalShoyuState';
import {
  View,
  ResponsiveVisibilityBehavior,
} from 'bento-common/types/shoyuUIState';

import { BentoComponentsEnum } from 'types';
import PreviewContainer from 'components/Previews/PreviewContainer';
import { MAIN_PREVIEW_OPTIONS } from 'components/Previews/helpers';
import ButtonGroup from 'system/ButtonGroup';
import { SelectOption } from 'bento-common/components/RichTextEditor/extensions/Select/withSelect';
import H3 from 'system/H3';
import H4 from 'system/H4';
import SwitchField from 'components/common/InputFields/SwitchField';

import ResetStylesModal from './components/ResetStylesModal';
import { ComponentSelectorSize } from './styles.helpers';
import {
  PreviewColumn,
  SettingsColumn,
  SettingsWithPreviewRow,
} from './components/GridHelpers';
import {
  InfoCallout,
  WarningCallout,
} from 'bento-common/components/CalloutText';
import Tooltip from 'system/Tooltip';
import { StyleAnchors } from './styles.types';

interface Props {}

export const getDefaultCustomCssTemplate = async () => {
  const templateCss = await fetch(
    `${window.location.origin}/bento-template.css`
  );
  return await templateCss.text();
};

const previewOptions = [
  ...MAIN_PREVIEW_OPTIONS,
  {
    label: 'Resource center (inline)',
    value: BentoComponentsEnum.inline,
    view: View.activeGuides,
  },
  {
    label: 'Resource center (sidebar)',
    value: BentoComponentsEnum.sidebar,
    view: View.activeGuides,
  },
];

export const isUsingDefaultCssTemplate = async (currentCss: string | null) => {
  if (!currentCss) return true;

  const currentStylesheet = new CSSStyleSheet();
  currentStylesheet.replaceSync(currentCss);
  const defaultCssTemplateString = await getDefaultCustomCssTemplate();
  const defaultStyleSheet = new CSSStyleSheet();
  defaultStyleSheet.replaceSync(defaultCssTemplateString);

  if (currentStylesheet.cssRules.length !== defaultStyleSheet.cssRules.length)
    return false;

  let allRulesMatched = true;
  for (let i = 0; i < defaultStyleSheet.cssRules.length; i++) {
    if (
      currentStylesheet.cssRules[i].cssText !==
      defaultStyleSheet.cssRules[i].cssText
    ) {
      allRulesMatched = false;
      break;
    }
  }

  return allRulesMatched;
};

const CodeEditorWrapper: FC<
  {
    defaultCssTemplate?: string;
    label?: string;
    onChange?: (value: string) => void;
  } & BoxProps
> = ({ defaultCssTemplate, label, onChange, fontSize = 'md', ...boxProps }) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const [focused, setFocused] = useState<boolean>(false);
  const [editorState, setEditorState] = useState({
    newSelectorsAdded: false,
    inView: false,
  });

  const [content, setContent] = useState<string>(
    values.embedCustomCss || defaultCssTemplate
  );

  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => setFocused(false), []);

  const handleChange = useCallback(
    debounce((value: string) => {
      if (onChange) {
        onChange(value);
        return;
      }
      setFieldValue('embedCustomCss', value);
    }, 500),
    [setFieldValue, onChange]
  );

  const handleInput = useCallback(
    (value: string) => {
      setContent(value);
      handleChange(value);
    },
    [handleChange]
  );

  const handleOnInView = useCallback(() => {
    if (!editorState.inView) {
      setEditorState((v) => ({ ...values, inView: true }));
    }
  }, [editorState]);

  useEffect(() => {
    if (content.trim() === '') {
      setContent(defaultCssTemplate);
    }
  }, [defaultCssTemplate, content]);

  /**
   * Add missing selectors to the custom CSS field
   * if the user had already made modifications. Otherwise
   * the default stylesheet will be used.
   */
  useEffect(() => {
    if (
      values.embedCustomCss &&
      editorState.inView &&
      !editorState.newSelectorsAdded
    ) {
      setEditorState((v) => ({ ...v, newSelectorsAdded: true }));

      (async () => {
        const currentStylesheet = new CSSStyleSheet();
        currentStylesheet.replaceSync(content);
        const currentSelectorsMap: Record<string, string> = {};

        const defaultCssTemplateString = await getDefaultCustomCssTemplate();
        const defaultStyleSheet = new CSSStyleSheet();
        defaultStyleSheet.replaceSync(defaultCssTemplateString);
        const defaultSelectorsMap: Record<string, string> = {};

        [
          { stylesheet: currentStylesheet, selectorsMap: currentSelectorsMap },
          { stylesheet: defaultStyleSheet, selectorsMap: defaultSelectorsMap },
        ].forEach(({ stylesheet, selectorsMap }) => {
          for (let i = 0; i < stylesheet.cssRules.length; i++) {
            const selector = stylesheet.cssRules[i].cssText
              .split('{')[0]
              .trim();
            // Ignore "all" selector.
            if (selector !== '*')
              selectorsMap[selector] = stylesheet.cssRules[i].cssText;
          }
        });

        let newContent = '';
        Object.entries(defaultSelectorsMap).forEach(([selector, cssText]) => {
          if (!currentSelectorsMap[selector]) newContent += cssText + '\n\n';
        });

        if (newContent) {
          setContent((v) => v + '\n' + newContent);
        }
      })();
    }
  }, [editorState]);

  return (
    <Field>
      {() => (
        <FormControl as="fieldset" {...boxProps}>
          {!!label && (
            <FormLabel as="legend" fontSize={fontSize}>
              {label}
            </FormLabel>
          )}
          <Box
            borderRadius="md"
            outline={focused ? '2px solid' : '1px solid'}
            outlineColor={focused ? 'blue.500' : 'gray.200'}
            transition="all 0.1s ease-in"
            padding={1}
          >
            <Box overflow="auto" h="70vh" minH="700px" w="full">
              <IntersectionObserver onInView={handleOnInView} />
              <CodeEditor
                className="custom-styles-editor"
                value={content}
                onValueChange={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                highlight={(code) => highlight(code, languages.css)}
                padding={10}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 12,
                }}
              />
            </Box>
          </Box>
        </FormControl>
      )}
    </Field>
  );
};

const formFactorStyle = {
  modalSize: ModalSize.large,
  hasBackgroundOverlay: true,
  position: ModalPosition.center,
} as ModalStyle;
const buttonProps = { minW: ComponentSelectorSize.lg };

const CustomCssSettings: React.FC<Props> = () => {
  const [componentSelected, setComponentSelected] = useState<{
    component: BentoComponentsEnum;
    isContextual: boolean;
  }>({ component: BentoComponentsEnum.inline, isContextual: false });
  const [view, setView] = useState<View | null>(null);
  const [defaultCssTemplate, setDefaultCssTemplate] = useState<string>('');
  const [resetCount, setResetCount] = useState<number>(0);
  const [isResetStylesModalOpen, setIsResetStylesModalOpen] =
    useState<boolean>(false);

  const { values, setFieldValue } = useFormikContext<any>();

  const handleComponentSelected = useCallback((selection: SelectOption) => {
    setComponentSelected({
      component:
        (selection.value as BentoComponentsEnum) || BentoComponentsEnum.inline,
      isContextual: selection.label.toLowerCase().includes('contextual'),
    });
    setView(selection.view ?? null);
  }, []);

  const getCssTemplate = useCallback(async () => {
    const templateCssString = await getDefaultCustomCssTemplate();
    setDefaultCssTemplate(templateCssString || '');
  }, []);

  const handleReset = useCallback(() => {
    setIsResetStylesModalOpen(true);
  }, [setFieldValue]);

  const handleCloseResetStylesModal = useCallback(() => {
    setIsResetStylesModalOpen(false);
  }, []);

  const resetCssStyles = useCallback(() => {
    setFieldValue('embedCustomCss', '');
    setResetCount((v) => v + 1);
  }, [setFieldValue]);

  useEffect(() => {
    getCssTemplate();
  }, []);

  return (
    <>
      {/**
       * Mobile
       */}
      <SettingsWithPreviewRow spyId={StyleAnchors.mobileAppearance} pt={0}>
        <SettingsColumn>
          <H3 mb="6">Advanced</H3>
          <H4 mb={3}>Mobile appearance</H4>
          <WarningCallout mb="3">
            All Bento components are responsive, but overlay components are
            automatically hidden for small viewports (600px width or height).
            You can override this, but please test your guides carefully.
          </WarningCallout>
          <SwitchField
            name={`responsiveVisibility.all`}
            fontSize="sm"
            variant="secondary"
            label="Guide visibility on small viewport"
            checkedOption={{
              value: ResponsiveVisibilityBehavior.show,
              label: 'Show guides',
            }}
            uncheckedOption={{
              value: ResponsiveVisibilityBehavior.hide,
              label: 'Hidden',
            }}
            defaultValue={values.responsiveVisibility.all}
          />
        </SettingsColumn>
      </SettingsWithPreviewRow>
      {/* Custom styles */}
      <SettingsWithPreviewRow spyId={StyleAnchors.customCss} pt={0}>
        <SettingsColumn>
          <H4 mb={4} display="flex" alignItems="center">
            Custom styles
            <Tooltip
              label="Resetting exposes the latest set of CSS classes! Make a copy of your current changes to add back if necessary."
              placement="top"
            >
              <Box
                ml="auto"
                mt="3px"
                fontWeight="normal"
                fontSize="xs"
                color="bento.bright"
                cursor="pointer"
                userSelect="none"
                _hover={{ opacity: 0.8 }}
                onClick={handleReset}
              >
                Reset styles
              </Box>
            </Tooltip>
          </H4>
          <CodeEditorWrapper
            key={`custom-css-wrapper-${resetCount}`}
            defaultCssTemplate={defaultCssTemplate}
          />
          <InfoCallout mt="6">
            You may need to add !important and explicitly define styles (i.e,
            "solid") consistent with standard CSS conventions.
          </InfoCallout>
        </SettingsColumn>
        <PreviewColumn minW="760px">
          <ButtonGroup
            options={previewOptions}
            onOptionSelected={handleComponentSelected}
            buttonProps={buttonProps}
          />
          <PreviewContainer
            uiSettings={values}
            component={componentSelected.component}
            tagType={
              componentSelected.isContextual ? ContextTagType.dot : undefined
            }
            formFactorStyle={formFactorStyle}
            sidebarAlwaysExpanded={
              componentSelected.component !== BentoComponentsEnum.modal
            }
            view={view}
          />
        </PreviewColumn>
      </SettingsWithPreviewRow>
      <ResetStylesModal
        isOpen={isResetStylesModalOpen}
        onReset={resetCssStyles}
        onClose={handleCloseResetStylesModal}
      />
    </>
  );
};

export default CustomCssSettings;
