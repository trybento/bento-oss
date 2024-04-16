import React from 'react';
import { ErrorMessageProps, Field, FieldProps, isFunction } from 'formik';

/**
 * Custom error message component built for easily handling errors for fieldArrays,
 * as per the documentation says.
 *
 * NOTE: Implementation was heavily inspired on Formik's own ErrorMessage component (link below)
 *
 * @see https://formik.org/docs/api/errormessage
 * @see https://github.com/jaredpalmer/formik/blob/main/packages/formik/src/ErrorMessage.tsx
 */
const FieldArrayErrorMessage: React.FC<ErrorMessageProps> = ({
  name,
  render,
  component,
  children,
  ...rest
}) => (
  <Field
    name={name}
    render={({ meta }: FieldProps) => {
      return !!meta.touched && !!meta.error
        ? render
          ? isFunction(render)
            ? render(meta.error)
            : null
          : children
          ? isFunction(children)
            ? children(meta.error)
            : null
          : component
          ? React.createElement(component, rest as any, meta.error)
          : meta.error
        : null;
    }}
  />
);

export default FieldArrayErrorMessage;
