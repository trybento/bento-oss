import React from 'react';
import { Input as DefaultInput, InputProps } from '@chakra-ui/react';

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, ref) => (
    <DefaultInput borderColor="border" fontSize="sm" {...props} ref={ref} />
  )
);

export default Input;
