import React from 'react';
import {
  Text,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';

type Props = React.PropsWithChildren<{
  header: string;
  selectedLabel: string;
  isHidden?: boolean;
}>;

/** Provide consistent accordion style and layout */
const ModalOptionsContainer: React.FC<Props> = ({
  children,
  header,
  selectedLabel,
  isHidden,
}) => {
  return (
    <AccordionItem
      aria-label={header}
      border="none"
      borderRadius="1"
      backgroundColor="gray.50"
      mb="2"
      display={isHidden ? 'none' : undefined}
    >
      <AccordionButton>
        <Text fontSize="md" fontWeight="bold">
          {header}
        </Text>
        {selectedLabel && <Text mx="2">{` - ${selectedLabel}`}</Text>}
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>{children}</AccordionPanel>
    </AccordionItem>
  );
};

export default ModalOptionsContainer;
