import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionProps,
  Box,
} from '@chakra-ui/react';
import React, { FC, ReactNode, useCallback, useState } from 'react';

import AccordionIcon from './AccordionIcon';
import { WYSIWYG_FLOATING_SHADOW } from './constants';

interface Props extends Omit<AccordionProps, 'title'> {
  children: ReactNode;
  title?: ReactNode;
}

const FloatingListPanel: FC<Props> = ({
  children,
  title,
  ...accordionProps
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleAccordion = useCallback(() => {
    setIsOpen((open) => !open);
  }, []);

  return (
    <Accordion
      position="absolute"
      bottom="90px"
      borderRadius="md"
      background="bento.bright"
      boxShadow={WYSIWYG_FLOATING_SHADOW}
      w="350px"
      allowToggle
      reduceMotion
      index={isOpen ? 0 : -1}
      onChange={toggleAccordion}
      {...accordionProps}>
      <AccordionItem border="none">
        <AccordionButton
          color="white"
          fontSize="sm"
          h="12"
          _focus={{ outline: 'none' }}>
          <Box as="span" flex="1" textAlign="left" fontWeight="bold">
            {title}
          </Box>
          <AccordionIcon inverted />
        </AccordionButton>
        <AccordionPanel
          pb="4"
          fontSize="xs"
          bg="white"
          maxH="250px"
          overflowY="auto"
          borderBottomRadius="md">
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default FloatingListPanel;
