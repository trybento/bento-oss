import React from 'react';
import {
  Accordion,
  AccordionProps,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
  Flex,
  Box,
  BoxProps,
  Text,
  TextProps,
} from '@chakra-ui/react';

import colors from 'helpers/colors';
import OptionGroupBox from 'system/OptionGroupBox';

type Props = BoxProps & {
  title: string;
  accordionProps?: AccordionProps;
  textProps?: TextProps;
  variant?: 'box' | 'header';
};

/** A single expandable section in the accordion style. Comes with option box background */
const SingleAccordion: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  children,
  accordionProps = {},
  textProps = {},
  variant = 'box',
  ...boxProps
}: Props) => (
  <OptionGroupBox
    {...(variant === 'header' ? { p: '0', background: 'unset' } : {})}
    {...boxProps}
  >
    <Accordion
      allowToggle
      borderWidth="0"
      color={variant === 'box' ? 'text.secondary' : 'text.primary'}
      reduceMotion
      {...accordionProps}
    >
      <AccordionItem border="none">
        <AccordionButton
          pl={variant === 'header' ? '0' : undefined}
          pt={variant === 'header' ? '0' : undefined}
          pb={variant === 'header' ? '4' : undefined}
          _hover={variant === 'header' ? { background: 'unset' } : undefined}
        >
          <Flex w="full" gap="2" alignItems="center">
            <Text
              fontSize={variant === 'box' ? 'sm' : 'lg'}
              fontWeight="bold"
              mb="0"
              {...textProps}
            >
              {title}
            </Text>
            <Box>
              <AccordionIcon fontSize={variant === 'header' ? '2xl' : 'xl'} />
            </Box>
          </Flex>
        </AccordionButton>
        <AccordionPanel p={variant === 'header' ? '0' : undefined}>
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  </OptionGroupBox>
);

export default SingleAccordion;
