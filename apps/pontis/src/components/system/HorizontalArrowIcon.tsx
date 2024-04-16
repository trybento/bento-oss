import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Icon, IconProps } from '@chakra-ui/react';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import React, { FC } from 'react';

type Variant = 'mui' | 'chakra';

interface Props
  extends Omit<IconProps, 'w' | 'h' | 'width' | 'height' | 'as' | 'invert'> {
  /** Size in pixels. */
  size?: string;
  isLeft?: boolean;
  variant?: Variant;
}

const ArrowIcon: Record<Variant, { left: FC; right: FC }> = {
  mui: { left: ArrowLeftIcon, right: ArrowRightIcon },
  chakra: { left: ChevronLeftIcon, right: ChevronRightIcon },
};

const HorizontalArrowIcon: FC<Props> = ({
  size = '18px',
  isLeft,
  variant = 'chakra',
  ...props
}) => {
  return (
    <Icon
      as={isLeft ? ArrowIcon[variant].left : ArrowIcon[variant].right}
      h={size}
      w={size}
      {...props}
    />
  );
};

export default HorizontalArrowIcon;
