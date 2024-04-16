import React from 'react';
import Head from 'next/head';
import { Flex, Stack } from '@chakra-ui/react';
import Box from 'system/Box';
import Text from 'system/Text';
import { TAB_TITLE } from 'utils/constants';
import BentoLogo from 'components/BentoLogo';

export default function Login(): JSX.Element {
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
      <Stack spacing="8" align="center">
        <BentoLogo color="bento.bright" w="64px" h="64px" />
        <Box textAlign="center" width="full">
          <Text color="gray.600" fontSize="20px" fontWeight="normal">
            Your company is not yet set up to use Bento, but we'd love to learn
            more about your needs.
            <br />
            Please find time with us{' '}
            <Box color="b-primary.300" display="inline-block">
              <a href="https://www.trybento.co/demo">here</a>
            </Box>
            .
          </Text>
        </Box>
      </Stack>
    </Flex>
  );
}
