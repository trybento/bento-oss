import React, { useCallback } from 'react';
import { Field, FieldConfig, useFormikContext } from 'formik';

type Props = { onChange?: (value: any) => void };

export type WithFormikFieldContextProps = {
  isFormikContext: boolean;
  onChange: (value: string) => void;
};

export type WithFormkikFieldProps<P extends object & Props> =
  | {
      onChange: P['onChange'];
      name?: never;
      validate?: never;
    }
  | {
      onChange?: P['onChange'];
      name: string;
      validate?: FieldConfig['validate'];
    };

export default function withFormikField<P extends object & Props>(
  WrappedComponent: React.ComponentType<P>
) {
  const hoc = React.forwardRef(
    (
      { onChange, validate, ...restProps }: P & WithFormkikFieldProps<P>,
      ref
    ) => {
      const formikContext = useFormikContext();

      const handleChange: WithFormikFieldContextProps['onChange'] = useCallback(
        (newValue) => {
          formikContext?.setFieldValue(restProps.name, newValue);
        },
        [formikContext?.setFieldValue, restProps.name]
      );

      return onChange ? (
        <WrappedComponent
          {...(restProps as P)}
          onChange={onChange}
          ref={ref}
          isFormikContext={false}
        />
      ) : (
        <Field name={restProps.name} validate={validate}>
          {({ form }) => (
            <WrappedComponent
              error={form.errors[restProps.name]}
              {...(restProps as P)}
              onChange={handleChange}
              ref={ref}
              isFormikContext
            />
          )}
        </Field>
      );
    }
  );
  hoc.displayName = 'withFormikField';
  return hoc;
}
