import React, { HTMLAttributes } from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';

type Props = ReactDatePickerProps & {
  selectedDate: Date | undefined;
};

const DatePicker = ({
  selectedDate,
  onChange,
  isClearable = false,
  showPopperArrow = false,
  ...props
}: Props & HTMLAttributes<HTMLElement>) => {
  return (
    <ReactDatePicker
      selected={selectedDate}
      onChange={onChange}
      isClearable={isClearable}
      showPopperArrow={showPopperArrow}
      {...props}
    />
  );
};

export default DatePicker;
