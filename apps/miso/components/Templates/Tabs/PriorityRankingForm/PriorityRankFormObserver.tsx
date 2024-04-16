import { FC, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { GenericPriorityFormValues } from './helpers';
import { useFormsProvider } from 'providers/FormsProvider';
import { FormKeys } from 'helpers/constants';

const PriorityRankFormObserver: FC = () => {
  const { dirty, submitForm, isValid, resetForm } =
    useFormikContext<GenericPriorityFormValues>();
  const { setForms } = useFormsProvider();

  useEffect(() => {
    setForms?.([
      {
        formKey: FormKeys.priorityRanking,
        dirty,
        submitForm,
        isValid,
        resetForm,
      },
    ]);
  }, [isValid, dirty, submitForm]);

  return <></>;
};

export default PriorityRankFormObserver;
