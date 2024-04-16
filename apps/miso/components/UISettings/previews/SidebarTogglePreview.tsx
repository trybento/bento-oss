import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import React from 'react';

import { EmbedToggleStyle, EmbedToggleStyleInverted } from 'bento-common/types';

import { isSidebarToggleInverted } from '../styles.helpers';
import ProgressCircle from './ProgressCircle';

interface Props extends BoxProps {
  toggleStyle: EmbedToggleStyle | EmbedToggleStyleInverted;
}

const PreviewBox: React.FC<BoxProps> = (props) => (
  <Box
    w="12"
    h="12"
    borderRadius="8"
    style={{
      boxShadow:
        '1px 2px 6px rgba(0, 0, 0, 0.16), 0px 1px 4px rgba(0, 0, 0, 0.08)',
      ...props.style,
    }}
    {...props}
  >
    <Flex alignItems="center" justifyContent="center">
      {props.children}
    </Flex>
  </Box>
);

const PreviewProgressRingToggle: React.FC<{
  toggleColorHex: string;
  toggleTextColor: string;
  secondaryColorHex: string;
  isEmbedToggleColorInverted: boolean;
}> = (props) => {
  return (
    <PreviewBox
      backgroundColor={
        props.isEmbedToggleColorInverted ? props.toggleColorHex : '#fff'
      }
      display="flex"
      w={13}
      h={13}
      p={1}
    >
      <Box w="10" h="10" m="auto">
        <ProgressCircle
          numerator={1}
          denominator={4}
          {...props}
          primaryColorHex={props.toggleColorHex}
        />
      </Box>
    </PreviewBox>
  );
};

const PreviewArrowToggle: React.FC<{}> = (props) => {
  return (
    <PreviewBox backgroundColor={'#fff'} w={13} h={13} p={1.5}>
      <svg
        width="40px"
        height="40px"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        focusable="false"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
        />
      </svg>
    </PreviewBox>
  );
};

const PreviewTextToggle: React.FC<{
  text: string;
  isEmbedToggleColorInverted: boolean;
  toggleColorHex: string;
  toggleTextColor: string;
}> = (props) => {
  return (
    <PreviewBox
      h="auto"
      style={{
        backgroundColor: props.isEmbedToggleColorInverted
          ? props.toggleColorHex
          : '#fff',
      }}
      color={props.isEmbedToggleColorInverted ? 'white' : props.toggleTextColor}
      w="10"
    >
      <Flex direction="column" my="2" lineHeight="20px">
        <Box
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          <Text>{props.text}</Text>
        </Box>
        <Box mt="2">
          <svg
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{
              opacity: '50%',
              height: '16px',
              transform: 'translateX(7px)',
              fill: 'currentcolor',
            }}
          >
            <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"></path>
          </svg>
        </Box>
      </Flex>
    </PreviewBox>
  );
};

const getTogglePreview = (
  toggleStyle: EmbedToggleStyle | EmbedToggleStyleInverted,
  uiValues: any
) => {
  switch (toggleStyle) {
    case EmbedToggleStyle.progressRing:
    case EmbedToggleStyleInverted.progressRing:
      return (
        <PreviewProgressRingToggle
          isEmbedToggleColorInverted={isSidebarToggleInverted(toggleStyle)}
          toggleColorHex={uiValues.toggleColorHex}
          toggleTextColor={uiValues.toggleTextColor}
          secondaryColorHex={uiValues.secondaryColorHex}
        />
      );
    case EmbedToggleStyle.arrow:
      return <PreviewArrowToggle key={toggleStyle} />;
    case EmbedToggleStyle.text:
    case EmbedToggleStyleInverted.text:
      return (
        <PreviewTextToggle
          isEmbedToggleColorInverted={isSidebarToggleInverted(toggleStyle)}
          toggleColorHex={uiValues.toggleColorHex}
          toggleTextColor={uiValues.toggleTextColor}
          key={toggleStyle}
          text={uiValues.toggleText || 'Toggle Guide'}
        />
      );
    default:
      return null;
  }
};

const SidebarTogglePreview: React.FC<Props> = ({ toggleStyle, ...props }) => {
  const { values } = useFormikContext<any>();
  return <Box {...props}>{getTogglePreview(toggleStyle, values)}</Box>;
};

export default SidebarTogglePreview;
