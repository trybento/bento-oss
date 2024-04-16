import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Icon, IconProps, useAccordionItemState } from '@chakra-ui/react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import React, { FC } from 'react';

type Variant = 'mui' | 'chakra';

interface Props
  extends Omit<IconProps, 'w' | 'h' | 'width' | 'height' | 'as' | 'invert'> {
  /** Size in pixels. */
  size?: string;
  inverted?: boolean;
  variant?: Variant;
}

const ArrowIcon: Record<Variant, { up: FC; down: FC }> = {
  mui: { down: ArrowDropDownIcon, up: ArrowDropUpIcon },
  chakra: { down: ChevronDownIcon, up: ChevronUpIcon },
};

/**
 * Custom accordion icon that supports an inverted state.
 */
const AccordionIcon: FC<Props> = ({
  size = '18px',
  inverted,
  variant = 'chakra',
  ...props
}) => {
  const accordionItemState = useAccordionItemState();

  return (
    <Icon
      as={
        accordionItemState.isOpen
          ? inverted
            ? ArrowIcon[variant].down
            : ArrowIcon[variant].up
          : inverted
          ? ArrowIcon[variant].up
          : ArrowIcon[variant].down
      }
      h={size}
      w={size}
      {...props}
    />
  );
};

export default AccordionIcon;
