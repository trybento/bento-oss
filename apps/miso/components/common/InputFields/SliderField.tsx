import React, { FC, FocusEvent } from 'react';

import {
  FormControl,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  BoxProps,
} from '@chakra-ui/react';
import withFormikField from '../../hocs/withFormikField';

interface Props extends Omit<BoxProps, 'onChange'> {
  min?: number;
  max?: number;
  label: string;
  value: number;
  units: string;
  onChange?: (value: number) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
}

const SliderField: FC<Props> = ({
  min,
  max,
  label,
  value = min,
  units,
  onChange,
  onFocus,
  fontSize = 'md',
  ...boxProps
}) => {
  return (
    <FormControl as="fieldset" {...boxProps}>
      <FormLabel as="legend" fontSize={fontSize}>
        {label}
      </FormLabel>
      <Box display="flex" flexDir="row">
        <Slider
          min={min}
          max={max}
          aria-label="slider-ex-1"
          defaultValue={value}
          onChangeEnd={onChange}
          onFocus={onFocus}
        >
          <SliderTrack h="2px" background="#C1CBD6">
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb bg="bento.bright" />
        </Slider>
        <Box
          w="60px"
          m="auto"
          textAlign="right"
          fontWeight="semibold"
          fontSize={fontSize}
        >
          {value}
          {units}
        </Box>
      </Box>
    </FormControl>
  );
};

export default withFormikField<Props>(SliderField);
