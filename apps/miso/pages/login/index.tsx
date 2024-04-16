import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import {
  Link,
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

import ForgotPasswordForm from 'components/ForgotPasswordForm';
import GoogleButton from 'system/Button/GoogleButton';
import { TAB_TITLE } from 'utils/constants';
import { checkStorage } from 'hooks/useClientStorage';
import env from '@beam-australia/react-env';

type EmailLoginData = {
  email: string;
  password: string;
};

const defaultEmailLoginData: EmailLoginData = {
  email: '',
  password: '',
};

const GOOGLE_REDIRECT_URL = `${env('API_HOST')}/auth/google`;
const EMAIL_LOGIN_URL = `${env('API_HOST')}/auth/email`;

const emailSignupValidationSchema = yup.object().shape({
  email: yup.string().email(),
  password: yup.string().min(10).max(64).required(),
});

export default function Login(): JSX.Element {
  const router = useRouter();
  const { isInvalid, isInvalidPasswordReset, verified } = router.query;
  const [isForgotPassswordLinkActive, setIsForgotPasswordLinkActive] =
    useState<boolean>(false);
  const toast = useToast({ position: 'top', isClosable: false, id: 'auth' });

  const [loginError, setLoginError] = useState<string | null>(
    isInvalid === 'true' ? 'Invalid Login' : null
  );

  const handleClick = useCallback(() => {
    window.location.href = GOOGLE_REDIRECT_URL;
  }, []);

  const submitEmailSignup = useCallback(async (data: EmailLoginData) => {
    try {
      const res = await fetch(EMAIL_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: data.email, password: data.password }),
      });
      const result = await res.json();
      if (res.ok) {
        window.location.href = result.url;
      } else {
        setLoginError(result.error || 'Invalid Login');
      }
    } catch (err) {
      toast({
        title: 'An error occurred. Please try again later.',
        status: 'error',
      });
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (verified === 'true') {
      toast({
        title: 'Account Activated! Please log in.',
        status: 'success',
      });
    }
  }, [verified]);

  useEffect(() => {
    if (loginError) {
      toast({
        title: loginError,
        status: 'error',
      });
      setLoginError(null);
    }
  }, [loginError]);

  useEffect(() => {
    if (isInvalidPasswordReset) {
      toast({
        title: 'Invalid password reset token',
        status: 'error',
      });
    }
  }, [isInvalidPasswordReset]);

  useEffect(() => {
    const isStorageAvailable = checkStorage('localStorage');
    if (!isStorageAvailable) {
      toast({
        title: 'Cookies and web storage must be enabled to use Bento',
        status: 'error',
        isClosable: false,
        duration: null, // will never dismiss
        id: 'storage-error', // prevent duplicates
      });
    }
  }, []);

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
          {isForgotPassswordLinkActive ? (
            <>
              <Text fontSize="40px" fontWeight="bold" mb="8">
                Forgot password
              </Text>
              <ForgotPasswordForm />
            </>
          ) : (
            <>
              <Text fontSize="40px" fontWeight="bold" mb="8">
                Log in to Bento
              </Text>
              <GoogleButton onClick={handleClick}>
                Log in with Google
              </GoogleButton>
              <Box
                borderTopWidth={1}
                borderTopColor="gray.200"
                my={6}
                pos="relative"
                w="100%"
              >
                <Text
                  pos="absolute"
                  px={4}
                  bg="white"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  fontWeight="bold"
                  fontSize="md"
                >
                  or
                </Text>
              </Box>
              <Formik
                initialValues={defaultEmailLoginData}
                onSubmit={submitEmailSignup}
                validationSchema={emailSignupValidationSchema}
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
                      <FormLabel htmlFor="email">Email Address</FormLabel>
                      <Field
                        as={Input}
                        name="email"
                        type="email"
                        value={values.email}
                        autoComplete="username"
                        id="email"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Field
                        as={Input}
                        name="password"
                        type="password"
                        value={values.password}
                        autoComplete="current-password"
                        id="password"
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      isDisabled={
                        isSubmitting ||
                        Object.keys(errors).length > 0 ||
                        Object.values(touched).every((t) => !t)
                      }
                      fontSize="lg"
                      fontWeight="bold"
                      h={px(44)}
                    >
                      Log in
                    </Button>
                  </Form>
                )}
              </Formik>
              <Box mt={4}>
                <Text
                  color="gray.700"
                  fontSize="s"
                  cursor="pointer"
                  onClick={() => setIsForgotPasswordLinkActive(true)}
                  data-test="forgot-password-link"
                >
                  Forgot your password or don't have one? Click here
                </Text>
              </Box>
              <Box mt={8}>
                <Text color="gray.500" fontSize="xs">
                  By logging in to Bento, you agree to our{' '}
                  <Link
                    color="blue.500"
                    href="https://www.trybento.co/legal/terms-of-service"
                  >
                    Terms of Service
                  </Link>
                  .
                </Text>
              </Box>
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
