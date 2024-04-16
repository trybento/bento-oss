import React, { useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Link, Flex, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import jwt from 'jsonwebtoken';
import { px } from 'bento-common/utils/dom';

import Box from 'system/Box';
import Text from 'system/Text';
import Input from 'system/Input';
import Button from 'system/Button';
import PasswordMeter from 'components/PasswordMeter';
import { ErrorCallout } from 'bento-common/components/CalloutText';
import { TAB_TITLE } from 'utils/constants';
import env from '@beam-australia/react-env';

type EmailSignupData = {
  fullName: string;
  password: string;
};

const inviteSignUpUrl = `${env('API_HOST')}/auth/invite/signup`;

const defaultEmailSignupData: EmailSignupData = {
  fullName: '',
  password: '',
};

const emailSignupValidationSchema = yup.object().shape({
  fullName: yup.string().required('Your name is required'),
  password: yup
    .string()
    .min(10, 'Password must be at least 10 characters.')
    .max(64, 'Password must be at most 64 characters')
    .required('Password is required'),
});

const InviteSignUp: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;

  const toast = useToast({ position: 'top', isClosable: false });

  const decodedToken = token && jwt.decode(token as string);

  const submitEmailSignup = useCallback(
    async (data: EmailSignupData) => {
      try {
        const res = await fetch(inviteSignUpUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, token }),
        });
        if (res.ok) {
          toast({
            title: 'Account created!',
            duration: null,
            status: 'success',
          });

          router.push('/login');
        } else {
          const err = await res.json();

          toast({
            title: err.message,
            status: 'error',
          });
        }
      } catch (err) {
        toast({
          title: 'An error occurred. Please try again later.',
          status: 'error',
        });
      }
    },
    [token]
  );

  if (!decodedToken) return null;

  const { orgName } = decodedToken as jwt.JwtPayload;

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
        <Text fontSize="40px" fontWeight="bold" mb="8" textAlign="center">
          You were invited to join <br />
          {orgName} in using Bento!
        </Text>
        <Box w={px(500)}>
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
};

export default InviteSignUp;
