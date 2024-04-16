import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
  FC,
  useMemo,
} from 'react';
import {
  Button,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalFooter,
  AccordionItem,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Flex,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ModalBody from 'system/ModalBody';
import csvToArray from 'bento-common/utils/csvStringToArray';
import Box from 'system/Box';
import FileUploadButton from 'system/FileUploadButton';
import Link from 'system/Link';
import { AttributeType } from 'bento-common/types';
import { readFileDataAsText } from 'helpers';
import useToast from 'hooks/useToast';
import { useOrganization } from 'providers/LoggedInUserProvider';
import useAccessToken from 'hooks/useAccessToken';
import {
  ImportActions,
  downloadCsvImportTemplate,
  requestCsvImport,
} from './data.helpers';
import RadioGroupField from 'components/common/InputFields/RadioGroupField';
import { Formik, useFormikContext } from 'formik';
import TextField from 'components/common/InputFields/TextField';
import colors from 'helpers/colors';
import useToastMessage from 'hooks/useToastMessage';
import { withErrorCatch } from 'utils/helpers';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

/** Actions are shown in the same order as this interface.  */
interface FormValues {
  type?: AttributeType;
  action?: ImportActions;
  downloadTemplate?: boolean;
  csv?: { value: string; filename: string };
  tagName?: string;
}

const typeOptions = [
  {
    label: 'Accounts',
    value: AttributeType.account,
  },
  {
    label: 'Users',
    value: AttributeType.accountUser,
  },
];

const TAG_ATTRIBUTE_NAME = 'Bento tag';

const AccordionRow: FC<
  React.PropsWithChildren<{
    label: ReactNode;
    value?: string;
    hidden?: boolean;
  }>
> = ({ label, value, hidden, children }) => {
  return (
    <AccordionItem
      border="none"
      bg="gray.50"
      display={hidden ? 'none' : undefined}
    >
      <AccordionButton>
        <Box fontSize="sm" isTruncated>
          <b>{label}</b>
          {value !== undefined && <> - {String(value)}</>}
        </Box>
        <AccordionIcon ml="2" />
      </AccordionButton>
      <AccordionPanel px="4" pt="0" pb="2">
        {children}
      </AccordionPanel>
    </AccordionItem>
  );
};

function CsvImportModal({ isOpen, onClose }: CsvImportModalProps) {
  const { values, setValues, submitForm, isSubmitting, resetForm } =
    useFormikContext<FormValues>();

  const submitDisabled =
    isSubmitting ||
    (values.action === ImportActions.createTag ? !values.tagName : !values.csv);

  const toastWrapper = useToastMessage();
  const [step, setStep] = useState<number>(0);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setStep(0);
    }
  }, [isOpen]);

  // Move user to the next step.
  useEffect(() => {
    if (isOpen) setStep((s) => (submitDisabled ? s + 1 : s));
  }, [values]);

  useEffect(() => {
    if (isOpen) {
      // Reset dependencies of "action".
      if (values.downloadTemplate) {
        setValues({
          type: values.type,
          action: values.action,
          downloadTemplate: true,
        });
      } else {
        // Make "Download template" optional.
        setValues({
          ...values,
          downloadTemplate: true,
        });
      }
      setStep((s) => s - 1);
    }
  }, [values.action]);

  const handleUploadedCsv = useCallback(
    async (file: File) => {
      /** Pop error message and reset the input */
      const handleError = (message: string): void => {
        toastWrapper.error(message);
        if (fileInput.current) fileInput.current.value = '';
      };

      const read = await withErrorCatch(() => readFileDataAsText(file));

      if (!read)
        return handleError('Unable to read file! Please try another file.');

      const parsed = withErrorCatch(() => csvToArray(read, undefined, 5));

      if (!parsed)
        return handleError(
          'Unable to parse CSV! Please check for proper formatting.'
        );
      if (parsed.length === 0) return handleError('CSV contains no data!');

      const valid =
        values.type === AttributeType.accountUser
          ? parsed.every((row) => 'user_id' in row || 'user_email' in row)
          : parsed.every((row) => 'account_id' in row);

      if (!valid)
        return handleError(
          'CSV invalid! Please check that the required columns are present.'
        );

      setValues({
        ...values,
        csv: { value: read, filename: file.name },
      });
    },
    [values]
  );

  const handleDownloadTemplate = useCallback(() => {
    downloadCsvImportTemplate(values.action, values.type);
    setStep((s) => s + 1);
    toastWrapper.success('Template downloaded!');
  }, [values]);

  const handleRowSelected = useCallback((selected: number) => {
    setStep(selected);
  }, []);

  const requiredAttrs =
    values.type === AttributeType.account ? (
      <>
        <b>account_id</b>
      </>
    ) : (
      <>
        <b>user_id</b> or <b>user_email</b>
      </>
    );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb="0">Upload CSV</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box pt="2" pb="4" color="gray.600">
            You can only add attributes to <b>existing</b> users or accounts in
            Bento.
          </Box>
          <Accordion index={step} onChange={handleRowSelected} allowToggle>
            <AccordionRow
              label="Attribute is for"
              value={
                values.type
                  ? typeOptions.find((o) => o.value === values.type)?.label ||
                    ''
                  : undefined
              }
            >
              <RadioGroupField
                name="type"
                fontSize="sm"
                label=""
                defaultValue={values.type}
                alignment="vertical"
                options={typeOptions}
              />
            </AccordionRow>

            <AccordionRow
              label="Attribute type"
              value={values.action}
              hidden={!values.type}
            >
              <RadioGroupField
                name="action"
                fontSize="sm"
                label=""
                defaultValue={values.action}
                alignment="vertical"
                options={[
                  {
                    label: (
                      <Flex flexDir="column">
                        <Box>{ImportActions.createTag} (aka "Bento tag")</Box>
                        <Box fontSize="xs" color="gray.500">
                          When you have a one-off list of users to target.{' '}
                          <Link
                            href="https://help.trybento.co/en/articles/6818267-tag-users-via-csv-for-targeting"
                            target="_blank"
                            color={colors.bento.bright}
                            fontWeight="bold"
                          >
                            Learn more
                          </Link>
                        </Box>
                      </Flex>
                    ),
                    value: ImportActions.createTag,
                  },
                  {
                    label: (
                      <Flex flexDir="column">
                        <Box>{ImportActions.createAttribute}</Box>
                        <Box fontSize="xs" color="gray.500">
                          When you want to add a new attribute on all users or
                          accounts. Long term, they should be passed in via an
                          integration or code.{' '}
                          <Link
                            href="https://help.trybento.co/en/articles/6825545-add-user-or-account-attributes-via-csv"
                            target="_blank"
                            color={colors.bento.bright}
                            fontWeight="bold"
                          >
                            Learn more
                          </Link>
                        </Box>
                      </Flex>
                    ),
                    value: ImportActions.createAttribute,
                  },
                ]}
              />
            </AccordionRow>

            <AccordionRow
              label="Download and fill out template"
              hidden={!values.action}
            >
              <Flex flexDir="column" gap="4">
                <Flex flexDir="column" gap="2">
                  {values.action === ImportActions.createTag ? (
                    <>
                      <Box>
                        🚫 <b>Do not</b> modify the column headers.
                      </Box>
                      <Box>
                        🧑 Each row should start with the {requiredAttrs}.
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box>
                        🧑 Each row should start with the {requiredAttrs}.
                      </Box>
                      <Box>
                        📐 Column headers should be the <b>attribute name</b>{' '}
                        and the cells should be the values.
                      </Box>
                    </>
                  )}
                </Flex>
                <Box>
                  <Button
                    variant="secondary"
                    onClick={handleDownloadTemplate}
                    fontSize="sm"
                  >
                    Download template
                  </Button>
                </Box>
              </Flex>
            </AccordionRow>

            <AccordionRow
              label="Upload CSV"
              value={values.csv?.filename}
              hidden={!values.downloadTemplate}
            >
              <Flex flexDir="column" gap="4">
                {values.action === ImportActions.createTag ? (
                  <Box>
                    After you’ve added {requiredAttrs} to each row for each
                    user, upload your file here
                  </Box>
                ) : (
                  <Box>
                    After you’ve added {requiredAttrs} to each row for each
                    user, and added your <b>attributes with their values</b> for
                    each user, upload your file here
                  </Box>
                )}
                {values.csv?.filename && (
                  <Flex>
                    <AttachFileIcon
                      style={{ height: '20px', color: colors.text.secondary }}
                    />
                    <Box mb="2" isTruncated>
                      {values.csv.filename}
                    </Box>
                  </Flex>
                )}
                <FileUploadButton
                  accept=".csv"
                  label={values.csv ? 'Upload different file' : 'Upload file'}
                  onSelected={handleUploadedCsv}
                  inputRef={fileInput}
                  fontSize="sm"
                  variant="secondary"
                />
              </Flex>
            </AccordionRow>

            <AccordionRow
              label="What value should be applied to the users?"
              hidden={
                !(values.action === ImportActions.createTag && values.csv)
              }
            >
              <TextField
                name="tagName"
                defaultValue=""
                fontSize="sm"
                autoFocus
              />
            </AccordionRow>
          </Accordion>
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={submitDisabled}
            isLoading={isSubmitting}
            onClick={submitForm}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function CsvImportModalWrapper(props: CsvImportModalProps) {
  const { onClose, onComplete } = props;
  const { organization } = useOrganization();
  const { accessToken } = useAccessToken();
  const initialValues: FormValues = useMemo(() => ({}), []);
  const toast = useToast();

  const handleError = useCallback((e) => {
    toast({
      title: e.message || 'Something went wrong',
      isClosable: true,
      status: 'error',
    });
  }, []);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      const commonFields = {
        accessToken,
        attributeType: values.type,
        csvString: values.csv.value,
        organizationEntityId: organization.entityId,
        onError: handleError,
      };

      try {
        if (values.action === ImportActions.createTag) {
          await requestCsvImport({
            ...commonFields,
            attributeName: TAG_ATTRIBUTE_NAME,
            defaultAttributeValue: values.tagName,
            onSuccess: (count) => {
              toast({
                title: count
                  ? `Import complete! ${count} users updated.`
                  : 'Import complete!',
                isClosable: true,
                status: 'success',
              });
              onComplete?.();
              onClose();
            },
          });
        } else {
          await requestCsvImport({
            ...commonFields,
            onSuccess: (count) => {
              toast({
                title: count
                  ? `Import complete! ${count} users updated.`
                  : 'Import complete!',
                isClosable: true,
                status: 'success',
              });
              onComplete?.();
              onClose();
            },
          });
        }

        toast({
          title: 'Import started! Please keep this page open.',
          isClosable: true,
          status: 'success',
        });
      } catch (e) {
        handleError(e);
        return;
      }
    },
    [onComplete, onClose]
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <CsvImportModal {...props} />
    </Formik>
  );
}
