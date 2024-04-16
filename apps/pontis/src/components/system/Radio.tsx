import {
  Radio as DefaultRadio,
  RadioProps as DefaultRadioProps,
  Text,
  TextProps,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';

import { RADIO_STYLE } from '~src/ui/helpers';

interface RadioProps extends DefaultRadioProps {
  label?: ReactNode;
  textStyles?: TextProps;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (props: RadioProps, ref) => (
    <DefaultRadio {...RADIO_STYLE} {...props} ref={ref}>
      {props.label && !props.children ? (
        <Text fontSize="sm" {...(props.textStyles || {})}>
          {props.label}
        </Text>
      ) : (
        props.children
      )}
    </DefaultRadio>
  ),
);

export default Radio;
