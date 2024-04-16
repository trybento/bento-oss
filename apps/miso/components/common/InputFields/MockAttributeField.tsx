import React, { FC, useEffect } from 'react';
import TextField, { TextFieldProps } from './TextField';
import { useMockedAttributesProvider } from 'providers/MockedAttributesProvider';
import { isNil } from 'bento-common/utils/lodash';
import NumberField from './NumberField';

interface Props extends Omit<TextFieldProps, 'onChange' | 'name'> {
  fieldToMock: string;
  defaultMockValue?: string;
  type?: 'number' | 'string';
}

const MockAttributeField: FC<Props> = ({
  fieldToMock,
  type,
  defaultMockValue,
  defaultValue,
  label,
  ...restProps
}) => {
  const { mockedAttributes, updateAttributeMock, trackAttributes } =
    useMockedAttributesProvider();

  useEffect(() => {
    trackAttributes(defaultValue, fieldToMock, defaultMockValue);
  }, [defaultValue]);

  return (
    <>
      {mockedAttributes[fieldToMock]
        ? Object.entries(mockedAttributes[fieldToMock]).map(([ak, av]) =>
            type === 'number' ? (
              <NumberField
                {...restProps}
                key={`${fieldToMock}-${ak}-mock`}
                name={fieldToMock}
                inputProps={{
                  min: 0,
                  minimalist: true,
                  defaultValue:
                    (isNil(defaultMockValue) ? av : defaultMockValue) || 0,
                }}
                label={label || ak}
                onChange={updateAttributeMock(fieldToMock, ak)}
              />
            ) : (
              <TextField
                {...restProps}
                key={`${fieldToMock}-${ak}-mock`}
                label={label || ak}
                onChange={updateAttributeMock(fieldToMock, ak)}
                defaultValue={
                  isNil(defaultMockValue) ? String(av) : defaultMockValue
                }
              />
            )
          )
        : null}
    </>
  );
};

export default MockAttributeField;
