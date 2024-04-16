import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Formik, useFormikContext } from 'formik';
import {
  EditorNode,
  FormattingType,
  SlateBodyElement,
} from 'bento-common/types/slate';
import {
  Text,
  HStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Flex,
  FormLabel,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import {
  Attribute,
  BannerStyle,
  CardStyle,
  CarouselStyle,
  GptErrors,
  GuideFormFactor,
  Theme,
  TooltipStyle,
  VideoGalleryStyle,
} from 'bento-common/types';
import Box from 'system/Box';
import Button from 'system/Button';
import RichTextEditor from 'bento-common/components/RichTextEditor';
import {
  getBodySlateString,
  getNodesByTypeAndSanitize,
} from 'bento-common/utils/bodySlate';
import { FormEntityType } from '../types';
import {
  createNode,
  getAllowedElementTypes,
  getDisallowedElementTypes,
  RichTextEditorUISettings,
  wordCountAlertColor,
} from 'bento-common/components/RichTextEditor/helpers';

import useRandomKey from 'bento-common/hooks/useRandomKey';
import { countWords } from 'bento-common/utils/slateWordCount';
import processSnappySuggestion from '../../utils/processSnappyContent';
import { noop } from 'bento-common/utils/functions';
import useAccessToken from 'hooks/useAccessToken';
import fetchSnappyStepChoices from 'utils/fetchSnappyStepChoices';
import colors from 'helpers/colors';
import { supportsUpdatedMediaHandling } from 'bento-common/utils/formFactor';
import { useUISettings } from 'queries/OrganizationUISettingsQuery';
import { useOrganization } from 'providers/LoggedInUserProvider';
import env from '@beam-australia/react-env';
import { useAttributes } from 'providers/AttributesProvider';

const API_HOST = env('API_HOST')!;
const UPLOADS_HOST = env('UPLOADS_HOST')!;

const formFactor = GuideFormFactor.legacy;
const rteHeight = 400;

interface SnappyModalProps {
  isOpen: boolean;
  body: EditorNode[];
  theme: Theme | undefined;
  wordCount: number;
  onConfirm: (newBody: EditorNode[], snappy?: boolean) => void;
  onClose: () => void;
  formFactorStyle:
    | CarouselStyle
    | CardStyle
    | TooltipStyle
    | BannerStyle
    | VideoGalleryStyle
    | undefined;
}

interface SnappyModalFormValues {
  original: EditorNode[];
  suggestion: EditorNode[];
  result: EditorNode[] | null;
}

interface SnappyModalContentProps
  extends Pick<SnappyModalProps, 'formFactorStyle' | 'theme'> {
  isOpen: boolean;
  onClose?: () => void;
  wordCount: number;
}

const ErrorMessage: React.FC<{ error: GptErrors }> = ({ error }) => {
  switch (error) {
    case GptErrors.apiError:
    case GptErrors.responseTimeout:
      return (
        <Flex direction="column" gap="4" p="6">
          <Box textAlign="center" fontSize="md" fontWeight="bold">
            🤕 uh oh!
          </Box>
          <Box>
            We’re unable to reach our friends at GPT at the moment. Try once
            more, and if that fails, let’s give it a go tomorrow.
          </Box>
        </Flex>
      );

    case GptErrors.limitReached:
      return (
        <Flex direction="column" gap="4" p="6">
          <Box textAlign="center" fontSize="md" fontWeight="bold">
            uh oh!
          </Box>
          <Box>Your usage limit has been reached for this month.</Box>
        </Flex>
      );

    default:
      return null;
  }
};

const SnappyModalBody: React.FC<SnappyModalContentProps> = ({
  onClose,
  isOpen,
  wordCount,
  formFactorStyle,
  theme,
}) => {
  const { values, resetForm, submitForm, setFieldValue, initialValues } =
    useFormikContext<SnappyModalFormValues>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resetChangesCount, setResetChangesCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<GptErrors | null>(null);
  const ranKey = useRandomKey([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newWordCount, setNewWordCount] = useState<number>(0);
  const { accessToken } = useAccessToken();
  const uiSettings = useUISettings('network-only');
  const { organization } = useOrganization();
  const { attributes } = useAttributes();

  useEffect(() => {
    if (isOpen && accessToken) {
      (async () => {
        try {
          setIsLoading(true);
          const { extractedNodes } = getNodesByTypeAndSanitize(
            initialValues.original as SlateBodyElement[],
            ['callout', 'button', 'media', 'block-quote', 'code-block']
          );
          const extractedNodesArray = Object.values(extractedNodes).flatMap(
            (nodes) =>
              nodes.flatMap((n) => [
                // Adds empty line between elements.
                createNode('paragraph'),
                n,
              ])
          );

          const { choices, error } = await fetchSnappyStepChoices(
            accessToken,
            getBodySlateString(initialValues.original as SlateBodyElement[])
          );
          setIsLoading(false);
          if (error) {
            setErrorMsg(error);
          } else {
            const newSuggestion = processSnappySuggestion(choices[0]);
            const result = [...newSuggestion, ...extractedNodesArray];
            setNewWordCount(countWords(result));
            setFieldValue('suggestion', result);
          }
        } catch (e) {
          setErrorMsg(GptErrors.apiError);
        }
      })();
    }
  }, [accessToken]);

  const revertModifications = useCallback(() => {
    setFieldValue('result', null);
    setResetChangesCount((v) => v + 1);
    setIsEditing(false);
  }, [setFieldValue, values.suggestion]);

  const handleOnSubmit = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleEditResult = useCallback(
    (newValue: EditorNode[]) => {
      setFieldValue('result', newValue);
    },
    [setFieldValue]
  );

  const disallowedElementTypes = useMemo(() => {
    const result = getDisallowedElementTypes(formFactor);
    if (supportsUpdatedMediaHandling(theme, formFactor)) {
      (['image', 'videos'] as FormattingType[]).forEach((k) => {
        result[k] = true;
      });
    }
    return result;
  }, [theme, formFactor]);

  const enableEdit = useCallback(() => setIsEditing(true), []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose?.();
  }, [onClose, resetForm]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      scrollBehavior="outside"
    >
      <ModalOverlay />
      <ModalContent maxW={['650px', '650px', '650px', '1200px']}>
        <ModalHeader pb="3">✨ Make it snappy</ModalHeader>
        <ModalCloseButton />
        <ModalBody key={ranKey} py="0">
          <Flex gap="4" flexDir="column">
            <Box color={colors.text.secondary} fontSize="xs">
              Users don’t read! Making steps short increases step completion
              rates
            </Box>
            <Flex gap="10" flexDir={['column', 'column', 'column', 'row']}>
              <Box flex="1">
                <Box display="flex" flexDir="row" mb="2">
                  <FormLabel variant="secondary" fontWeight="bold">
                    Original content
                  </FormLabel>
                  <Box display="flex" color="gray.600" ml="auto">
                    <Text mr="1">Word count:</Text>
                    <Text color={wordCountAlertColor(formFactor, wordCount)}>
                      {wordCount}
                    </Text>
                  </Box>
                </Box>

                <RichTextEditor
                  attributes={attributes as Attribute[]}
                  uiSettings={uiSettings as unknown as RichTextEditorUISettings}
                  organizationDomain={organization.domain}
                  accessToken={accessToken}
                  fileUploadConfig={{
                    apiHost: API_HOST,
                    uploadsHost: UPLOADS_HOST,
                  }}
                  initialBody={values.original}
                  onBodyChange={noop}
                  containerKey="snappy-red"
                  formEntityType={FormEntityType.template}
                  formFactor={formFactor}
                  pixelHeight={rteHeight}
                  formFactorStyle={formFactorStyle}
                  isReadonly
                />
              </Box>
              <Box flex="1">
                <Box display="flex" flexDir="row" mb="2">
                  <FormLabel variant="secondary" fontWeight="bold">
                    Suggested content
                  </FormLabel>
                  {newWordCount > 0 && (
                    <Box display="flex" color="gray.600" ml="auto">
                      <Text mr="1">Word count:</Text>
                      <Text
                        color={wordCountAlertColor(formFactor, newWordCount)}
                      >
                        {newWordCount}
                      </Text>
                    </Box>
                  )}
                </Box>
                <RichTextEditor
                  attributes={attributes as Attribute[]}
                  uiSettings={uiSettings as RichTextEditorUISettings}
                  organizationDomain={organization.domain}
                  accessToken={accessToken}
                  fileUploadConfig={{
                    apiHost: API_HOST,
                    uploadsHost: UPLOADS_HOST,
                  }}
                  key={`rte-${ranKey}-${resetChangesCount}`}
                  initialBody={values.suggestion}
                  onBodyChange={handleEditResult}
                  containerKey="snappy-edit"
                  formEntityType={FormEntityType.template}
                  disallowedElementTypes={disallowedElementTypes}
                  allowedElementTypes={getAllowedElementTypes(formFactor)}
                  formFactor={formFactor}
                  isReadonly={!isEditing}
                  pixelHeight={rteHeight}
                  error={errorMsg ? <ErrorMessage error={errorMsg} /> : null}
                  zIndex={1410}
                  formFactorStyle={formFactorStyle}
                  isLoading={isLoading}
                />
              </Box>
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <HStack display="flex" justifyContent="flex-end">
            {!isEditing && (
              <Button
                variant="secondary"
                onClick={enableEdit}
                isDisabled={isLoading || !!errorMsg}
              >
                Edit suggestion
              </Button>
            )}
            {values.result && (
              <Button variant="secondary" onClick={revertModifications}>
                Revert changes
              </Button>
            )}
            <Box>
              <Button
                onClick={handleOnSubmit}
                isDisabled={isLoading || !!errorMsg}
              >
                {values.result ? 'Use edited' : 'Use suggested'}
              </Button>
            </Box>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const SnappyModal: React.FC<SnappyModalProps> = ({
  body,
  isOpen,
  theme,
  wordCount,
  onConfirm,
  onClose,
  formFactorStyle,
}) => {
  // Main form context.
  const { setFieldValue: mainSetFieldValue } = useFormikContext();

  const handleSubmit = useCallback(
    (values: SnappyModalFormValues) => {
      onConfirm(values.result || values.suggestion, true);
      onClose?.();
    },
    [mainSetFieldValue, onClose]
  );

  const initialValues = useMemo(
    () => ({
      original: body,
      suggestion: [],
      result: null,
    }),
    [body]
  );

  if (!isOpen) return null;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize={false}
    >
      <SnappyModalBody
        onClose={onClose}
        isOpen={isOpen}
        wordCount={wordCount}
        formFactorStyle={formFactorStyle}
        theme={theme}
      />
    </Formik>
  );
};

export default SnappyModal;
