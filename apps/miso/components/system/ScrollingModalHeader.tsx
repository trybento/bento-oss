import React from 'react';
import {
  ModalHeader as DefaultModalHeader,
  ModalHeaderProps,
} from '@chakra-ui/react';
import { STANDARD_SHADOW } from 'bento-common/frontend/styles';

export interface Props extends ModalHeaderProps {
  children: React.ReactNode;
}

/** Adds a shadow to indicate scrolling modal content */
const ScrollingModalHeader = React.forwardRef<HTMLParagraphElement, Props>(
  (props: Props, ref) => (
    <DefaultModalHeader
      boxShadow={STANDARD_SHADOW}
      mb="4"
      {...props}
      ref={ref}
    />
  )
);

export default ScrollingModalHeader;
