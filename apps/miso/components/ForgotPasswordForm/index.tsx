import React, { useCallback, useState } from 'react';
import {
  FormControl,
  FormLabel,
  useToast,
  Text,
  Input,
  Button,
} from '@chakra-ui/react';
import { Field, Form, Formik, ErrorMessage, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { px } from 'bento-common/utils/dom';
import env from '@beam-australia/react-env';

import { ErrorCallout } from 'bento-common/components/CalloutText';

type ForgotPasswordValues = {
  email: string;
};

const defaultValues: ForgotPasswordValues = {
  email: '',
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please provide a valid email address')
    .required('Email is required'),
});

export default function ForgotPasswordForm() {
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const toast = useToast({ position: 'top', isClosable: false });

  const handleSubmit = useCallback(
    async (
      { email }: ForgotPasswordValues,
      _actions: FormikHelpers<ForgotPasswordValues>
    ) => {
      try {
        const res = await fetch(
          `${env('API_HOST')}/auth/forgot-password-link`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
            }),
          }
        );

        if (!res.ok) {
          let result = { message: null };
          try {
            result = await res.json();
          } catch {
            // pass
          }
          throw new Error(result.message);
        }

        setIsComplete(true);
      } catch (err) {
        setIsComplete(false);
        toast({
          title: err.message || 'An error occurred. Please try again later.',
          status: 'error',
        });
        console.error(err);
      }
    },
    []
  );

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, touched, errors, isSubmitting }) => (
        <>
          {isComplete ? (
            <Text mb="2" color="gray.600" data-test="forgot-password-success">
              If a valid Bento user has been found, you will receive an email at{' '}
              <strong>{values.email}</strong> with a link to reset the password
              of your Bento account.
            </Text>
          ) : (
            <Form
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: px(10),
              }}
            >
              <FormControl>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <Field
                  as={Input}
                  name="email"
                  type="email"
                  value={values.email}
                  autoComplete="off"
                  id="email"
                  mb={1}
                />
                <ErrorMessage name="email" component={ErrorCallout} />
              </FormControl>
              <Button
                type="submit"
                isDisabled={isSubmitting || !touched?.email || !!errors?.email}
                fontSize="lg"
                fontWeight="bold"
                h={px(44)}
              >
                Continue
              </Button>
            </Form>
          )}
        </>
      )}
    </Formik>
  );
}
