import { useCallback, useRef } from 'react';

type ValidatorFn = (v: object) => object;

/**
 * Allow sub-components for a form to add their
 *   own validation methods independently
 */
export const useValidators = () => {
  const validators = useRef<ValidatorFn[]>([]);

  const validate = useCallback(
    (values: object) =>
      validators.current.length === 0
        ? {}
        : validators.current.reduce(
            (validation, validator) => ({
              ...validation,
              ...validator(values),
            }),
            {}
          ),
    []
  );

  const addValidator = useCallback((validator: ValidatorFn) => {
    validators.current.push(validator);
  }, []);

  return { validate, addValidator };
};
