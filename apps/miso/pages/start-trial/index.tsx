import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Link, Flex, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { px } from 'bento-common/utils/dom';

import Box from 'system/Box';
import Text from 'system/Text';
import Input from 'system/Input';
import Button from 'system/Button';
import PasswordMeter from 'components/PasswordMeter';
import GoogleButton from 'system/Button/GoogleButton';
import { ErrorCallout } from 'bento-common/components/CalloutText';
import { TAB_TITLE } from 'utils/constants';
import env from '@beam-australia/react-env';

type EmailSignupData = {
  orgName: string;
  fullName: string;
  email: string;
  password: string;
};

const googleRedirectUrl = new URL(`${env('API_HOST')}/auth/google/signup`);
const emailSignupUrl = `${env('API_HOST')}/auth/email/signup`;

const defaultEmailSignupData: EmailSignupData = {
  orgName: '',
  fullName: '',
  email: '',
  password: '',
};

const emailSignupValidationSchema = yup.object().shape({
  orgName: yup.string().required('Company name is required'),
  fullName: yup.string().required('Your name is required'),
  email: yup
    .string()
    .email('Please provide a valid email address')
    .required('Email is required')
    .test({
      message: 'Please use a work email',
      test: (email?: string) =>
        !['production', 'test'].includes(process.env.NODE_ENV) ||
        !email?.split('@')[1]?.includes('gmail'),
    }),
  password: yup
    .string()
    .min(10, 'Password must be at least 10 characters.')
    .max(64, 'Password must be at most 64 characters')
    .required('Password is required'),
});

export default function StartTrial(): JSX.Element {
  const router = useRouter();
  const { isInvalid } = router.query;

  const toast = useToast({ position: 'top', isClosable: false });

  const handleClick = useCallback(() => {
    window.location.href = googleRedirectUrl.toString();
  }, []);

  const submitEmailSignup = useCallback(async (data: EmailSignupData) => {
    try {
      const res = await fetch(emailSignupUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast({
          title: 'Account created!',
          description:
            "We've just sent you an activation email. Please click the link in the email to start your trial.",
          duration: null,
          status: 'success',
        });
      } else if (res.status === 400) {
        const err = await res.json();
        toast({
          title: err.message || 'An error occurred. Please try again later.',
          status: 'error',
        });
      } else {
        const err = await res.json();
        console.error(`[Signup Error] ${err.message}`);
        toast({
          title: 'An error occurred. Please try again later.',
          status: 'error',
        });
      }
    } catch (err) {
      toast({
        title: 'An error occurred. Please try again later.',
        status: 'error',
      });
    }
  }, []);

  useEffect(() => {
    if (isInvalid === 'true') {
      toast({
        title: 'Please use a work email.',
        status: 'error',
      });
    }
  }, [isInvalid]);

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
        <Text fontSize="40px" fontWeight="bold" mb="8">
          Start your 14-day free trial of Bento
        </Text>
        <Box w={px(500)}>
          <GoogleButton onClick={handleClick}>Sign up with Google</GoogleButton>
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
            initialValues={defaultEmailSignupData}
            onSubmit={submitEmailSignup}
            validationSchema={emailSignupValidationSchema}
          >
            {({ values, errors, touched, isSubmitting }) => (
              <Form
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: px(10),
                }}
              >
                <FormControl>
                  <FormLabel htmlFor="orgName">Company Name</FormLabel>
                  <Field
                    as={Input}
                    name="orgName"
                    value={values.orgName}
                    autoComplete="organization"
                    id="orgName"
                  />
                  <ErrorMessage name="orgName" component={ErrorCallout} />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="fullName">Your Name</FormLabel>
                  <Field
                    as={Input}
                    name="fullName"
                    value={values.fullName}
                    autoComplete="name"
                    id="fullName"
                  />
                  <ErrorMessage name="fullName" component={ErrorCallout} />
                </FormControl>
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
                  <ErrorMessage name="email" component={ErrorCallout} />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Field
                    as={Input}
                    name="password"
                    type="password"
                    value={values.password}
                    autoComplete="new-password"
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
                  className="trial-sign-up-btn"
                  isDisabled={
                    isSubmitting ||
                    Object.keys(errors).length > 0 ||
                    Object.values(touched).every((t) => !t)
                  }
                  fontSize="lg"
                  fontWeight="bold"
                  h={px(44)}
                >
                  Sign up
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
        <Text color="gray.500" fontSize="xs" mt="3">
          By creating an account in Bento, you agree to our{' '}
          <Link
            color="blue.500"
            href="https://www.trybento.co/legal/terms-of-service"
          >
            Terms of Service
          </Link>
          .
        </Text>
      </Flex>
    </Flex>
  );
}
