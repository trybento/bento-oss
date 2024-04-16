import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import {
  Flex,
  FormControl,
  FormLabel,
  useToast,
  Text,
  Box,
  Input,
  Button,
} from '@chakra-ui/react';
import { px } from 'bento-common/utils/dom';
import env from '@beam-australia/react-env';

import PasswordMeter from 'components/PasswordMeter';
import { TAB_TITLE } from 'utils/constants';

type ResetPasswordValues = {
  password: string;
};

const defaultValues: ResetPasswordValues = {
  password: '',
};

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(10, 'Password must be at least 10 characters.')
    .max(64, 'Password must be at most 64 characters')
    .required('Password is required'),
});

const loginRedirectUrl = `${env(
  'CLIENT_HOST'
)}/login?isInvalidPasswordReset=true`;

export default function ForgotPassword(): JSX.Element {
  const router = useRouter();
  const toast = useToast({ position: 'top', isClosable: false });
  const { token } = router.query;

  useEffect(() => {
    if (router.isReady && !token) {
      console.error('Reset password token not set');
      window.location.href = loginRedirectUrl;
    }
  }, [router.isReady, token]);

  const handleSubmit = useCallback(
    async (
      { password }: ResetPasswordValues,
      _actions: FormikHelpers<ResetPasswordValues>
    ) => {
      try {
        const res = await fetch(`${env('API_HOST')}/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password }),
        });

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        window.location.href = (await res.json()).url;
      } catch (err) {
        toast({
          title: 'An error occurred. Please try again later.',
          status: 'error',
        });
        console.error(err);
      }
    },
    [token]
  );

  return (
    <Flex width="100%" height="100vh" align="center" justify="center">
      <Head>
        <title>{TAB_TITLE}</title>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Flex alignItems="center" direction="column">
        <Box textAlign="center" width={px(400)}>
          <Text fontSize="40px" fontWeight="bold" mb="8">
            Reset your Bento password
          </Text>
          <Formik
            initialValues={defaultValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, touched, errors, isSubmitting }) => (
              <Form
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: px(10),
                }}
              >
                <FormControl>
                  <FormLabel htmlFor="password">New password</FormLabel>
                  <Field
                    as={Input}
                    name="password"
                    type="password"
                    value={values.password}
                    autoComplete="off"
                    id="password"
                  />
                  <PasswordMeter
                    password={values.password}
                    errors={errors.password}
                    showErrors={
                      touched.password ||
                      (values.password !== '' && !!errors.password)
                    }
                  />
                </FormControl>
                <Button
                  type="submit"
                  isDisabled={
                    isSubmitting || !touched?.password || !!errors?.password
                  }
                  fontSize="lg"
                  fontWeight="bold"
                  h={px(44)}
                >
                  Save and login
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Flex>
  );
}
