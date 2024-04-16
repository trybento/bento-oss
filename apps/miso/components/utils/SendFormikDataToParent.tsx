import { FormikProps, useFormikContext } from 'formik';
import { useEffect } from 'react';

type Props<V> = {
  bindFormData: (formData: FormikProps<V>) => void;
};

export default function SendFormikDataToParent<V>({ bindFormData }: Props<V>) {
  const formData = useFormikContext<V>();
  useEffect(() => {
    bindFormData(formData);
  }, [
    formData.values,
    formData.dirty,
    formData.touched,
    formData.errors,
    formData.isValid,
  ]);
  return null;
}
