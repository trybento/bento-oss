import {
  Button,
  Flex,
  FormLabel,
  Link,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import React, { ReactNode, useCallback, useMemo } from 'react';
import {
  ErrorMessage,
  Field,
  FieldProps,
  Form,
  Formik,
  useFormikContext,
} from 'formik';
import cx from 'classnames';
import { any, Describe, dynamic, nonempty, string, type } from 'superstruct';
import { validateStruct } from 'bento-common/validation/formik';
import { Url, withMessage } from 'bento-common/validation/customRules';
import { isDynamicUrl } from 'bento-common/utils/wildcardUrlHelpers';
import { removeWhiteSpaces } from 'bento-common/data/helpers';

import ModalBody from 'system/ModalBody';
import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';
import UrlInput from 'components/common/UrlInput';
import colors from 'helpers/colors';
import withAttributesProvider from './hocs/withAttributesProvider';
import Input from 'system/Input';
import useChromeExtensionInstalled from 'hooks/useChromeExtensionInstalled';
import ExtensionRequiredTooltip from './WysiwygEditor/ExtensionRequiredTooltip';
import ErrorText from 'system/ErrorText';

type LocationData = {
  /** Location URL where the element will be injected. */
  wildcardUrl: string;
  /** Preview URL. Pass undefined if no preview is needed. */
  url: string | undefined;
  /** CSS selector */
  elementSelector?: string;
};

type Props = {
  title: string;
  data: LocationData;
  onDelete?: () => void;
  onWysiwyg?: () => void;
  onClose: () => void;
  onSubmit: (
    newWildcardUrl: string,
    newUrl: string | undefined,
    newElementSelector: string | undefined
  ) => void;
  isOpen: boolean;
  warningMessage?: ReactNode;
  submitLabel: ReactNode;
  withSelector?: boolean;
};

const EditElementLocationContent: React.FC<
  Pick<Props, 'warningMessage' | 'withSelector'>
> = ({ warningMessage, withSelector }) => {
  const { initialValues, values, setFieldValue, setFieldTouched } =
    useFormikContext<LocationData>();

  const showPreviewUrl = useMemo(
    () => isDynamicUrl(values.wildcardUrl) && values.url !== undefined,
    [values.wildcardUrl, values.url]
  );

  const handleWildcardUrlChanged = useCallback(
    (value: string, _valid: boolean) => {
      setFieldValue('wildcardUrl', value);
      setFieldTouched(
        'wildcardUrl',
        initialValues.wildcardUrl !== value,
        false
      );
    },
    [initialValues.wildcardUrl]
  );

  const handlePlaceholderUrlChanged = useCallback(
    (value: string, _valid: boolean) => {
      setFieldValue('url', value);
      setFieldTouched('url', initialValues.url !== value, false);
    },
    [initialValues.url]
  );

  const handleElementSelectorChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setFieldValue('elementSelector', newValue);
      setFieldTouched(
        'elementSelector',
        initialValues.elementSelector !== newValue,
        false
      );
    },
    [initialValues.elementSelector]
  );

  const hideWarning = values.url === undefined;

  return (
    <Flex flexDir="column" gap="4">
      {/* Wildcard URL */}
      <Field name="wildcardUrl">
        {({ field }: FieldProps) => (
          <Flex flexDir="column">
            <FormLabel variant="secondary">
              Show on all pages that match:
            </FormLabel>
            <UrlInput
              onContentChange={handleWildcardUrlChanged}
              initialUrl={field.value}
              fontSize="sm"
            />
            <ErrorMessage name={field.name} component={ErrorText} />
          </Flex>
        )}
      </Field>

      {/* Placeholder URL */}
      {showPreviewUrl && (
        <Field name="url">
          {({ field }: FieldProps) => (
            <Flex flexDir="column">
              <FormLabel variant="secondary">
                Placeholder URL (for previews)
              </FormLabel>
              <UrlInput
                initialUrl={field.value}
                onContentChange={handlePlaceholderUrlChanged}
                fontSize="sm"
                allowWildcards={false}
                allowDynamicAttributes={false}
                warnOnUrlWithWildcard={false}
                helperText={
                  <>
                    Provide a valid URL without wildcards.{' '}
                    <Link
                      href="https://help.trybento.co/en/articles/5979053-dynamic-urls-content"
                      target="_blank"
                      color={colors.bento.bright}
                    >
                      Learn more
                    </Link>
                  </>
                }
              />
              <ErrorMessage name={field.name} component={ErrorText} />
            </Flex>
          )}
        </Field>
      )}

      {/* CSS Selector */}
      {withSelector && (
        <Field name="elementSelector">
          {({ field }: FieldProps) => (
            <Flex flexDir="column">
              <FormLabel variant="secondary">CSS Selector</FormLabel>
              <Input
                name={field.name}
                defaultValue={field.value}
                onChange={handleElementSelectorChanged}
              />
              <ErrorMessage name={field.name} component={ErrorText} />
              {!hideWarning && (
                <CalloutText calloutType={CalloutTypes.Warning} mt={6}>
                  {warningMessage ? (
                    warningMessage
                  ) : (
                    <>
                      ⚠️ We don’t recommend major changes this way since you
                      can’t verify that the targeted CSS element is present.
                    </>
                  )}
                </CalloutText>
              )}
            </Flex>
          )}
        </Field>
      )}
    </Flex>
  );
};

const makeValidationSchema: (
  withSelector: boolean
) => Describe<LocationData> = (withSelector) =>
  type({
    wildcardUrl: withMessage(nonempty(string()), 'Please provide a URL.'),
    url: dynamic((_value, { branch }) => {
      const wildcardUrl = branch[0]?.wildcardUrl;
      if (isDynamicUrl(wildcardUrl)) {
        return withMessage(
          Url,
          'Please provide a valid URL without wildcards.'
        );
      }
      return any() as any; // to not fail the types
    }),
    elementSelector: dynamic(() => {
      if (withSelector) {
        return withMessage(
          nonempty(string()),
          'CSS selector must be provided for this element. If you would like to start from scratch, remove or edit in your app.'
        );
      }

      return any() as any; // to not fail the types
    }),
  });

/**
 * Edit the URL location for an element.
 */
const EditElementLocationModal: React.FC<Props> = ({
  isOpen,
  data,
  warningMessage,
  onDelete,
  onClose,
  onWysiwyg,
  onSubmit,
  title,
  submitLabel,
  withSelector = true,
}) => {
  const extension = useChromeExtensionInstalled();

  const handleSubmit = useCallback(async (values: LocationData) => {
    const newUrl = isDynamicUrl(values.wildcardUrl)
      ? values.url
      : values.wildcardUrl;

    onSubmit(
      removeWhiteSpaces(values.wildcardUrl),
      removeWhiteSpaces(newUrl),
      values.elementSelector
    );
  }, []);

  const editInAppDisabled = useMemo(
    () => onWysiwyg && !extension.installed,
    [extension.installed, onWysiwyg]
  );

  const validate = useMemo(
    () => validateStruct<LocationData>(makeValidationSchema(withSelector)),
    [withSelector]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="800px">
        <Formik
          onSubmit={handleSubmit}
          initialValues={data}
          validate={validate}
        >
          {({ isValid }) => {
            return (
              <Form>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <EditElementLocationContent
                    warningMessage={warningMessage}
                    withSelector={withSelector}
                  />
                </ModalBody>
                <ModalFooter>
                  <Flex
                    className={cx('w-full', {
                      'justify-between': !!onDelete,
                      'justify-end': !onDelete,
                    })}
                  >
                    {onDelete && (
                      <Button
                        variant="link"
                        textColor={colors.error.text}
                        onClick={onDelete}
                      >
                        Remove
                      </Button>
                    )}
                    <Flex gap={2}>
                      <ExtensionRequiredTooltip
                        isDisabled={!editInAppDisabled}
                        withPortal={false}
                      >
                        <Button
                          variant="secondary"
                          onClick={onWysiwyg || onClose}
                          isDisabled={editInAppDisabled}
                        >
                          {onWysiwyg ? 'Edit in your app' : 'Cancel'}
                        </Button>
                      </ExtensionRequiredTooltip>
                      <Button type="submit" isDisabled={!isValid}>
                        {submitLabel}
                      </Button>
                    </Flex>
                  </Flex>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default withAttributesProvider<Props>(EditElementLocationModal);
