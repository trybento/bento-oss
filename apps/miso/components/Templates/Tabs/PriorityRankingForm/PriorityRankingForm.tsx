import React, { ReactNode, useCallback, useState } from 'react';
import { Form, Formik } from 'formik';

import PriorityRankingSorter from './PriorityRankingSorter';
import { GenericPriorityFormValues } from './helpers';

interface Props {
  initialValues: GenericPriorityFormValues;
  onChange: (values: GenericPriorityFormValues) => void;
  /** Adds backwards support for template priority ranking. */
  onSubmit?: (values: GenericPriorityFormValues) => void;
  /** Adds backwards support for template priority ranking. */
  nestedFormObserver?: ReactNode;
  onDirtyStateChange?: (dirty: boolean) => void;
  isDisabled?: boolean;
  usePopover?: boolean;
  useOpenInNew?: boolean;
}

const PriorityRankingForm = ({
  initialValues,
  onChange,
  onSubmit,
  nestedFormObserver,
  onDirtyStateChange,
  isDisabled,
  usePopover,
  useOpenInNew,
}: Props) => {
  const [dirty, setDirty] = useState(false);
  const validate = useCallback((values: GenericPriorityFormValues) => {
    const errors = {};
    if (Object.keys(errors).length === 0) {
      onChange(values);
    }
    return errors;
  }, []);

  /**
   * Used to bubble up dirty state over the Formik component
   * @todo Remove the Formik state here so it re-uses a parent Formik
   *   depending where this form is used.
   */
  const onDirtyState = useCallback(
    (formikDirty: boolean) => {
      if (formikDirty === dirty) return;

      setDirty(formikDirty);
      onDirtyStateChange?.(formikDirty);
    },
    [dirty, onDirtyStateChange]
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      validateOnMount={false}
      validateOnChange
      enableReinitialize
    >
      {({ dirty }) => {
        onDirtyState(dirty);

        return (
          <Form>
            {nestedFormObserver}
            <PriorityRankingSorter
              isDisabled={isDisabled}
              usePopover={usePopover}
              useOpenInNew={useOpenInNew}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default PriorityRankingForm;
