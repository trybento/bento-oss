import React, { useCallback, useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import debounce from 'lodash/debounce';
import { formatRelative } from 'date-fns';

import Text from 'system/Text';

const FormikAutosave = ({ autoSavedAt, onAutoSave }) => {
  const [wasAutoSaved, setWasAutosaved] = useState(false);
  const { values } = useFormikContext();

  const debouncedAutoSave = useCallback(
    debounce(() => {
      setWasAutosaved(true);
      onAutoSave(values);
    }, 5000),
    [onAutoSave, values]
  );

  useEffect(debouncedAutoSave, [debouncedAutoSave, values]);
  return wasAutoSaved ? (
    <Text color="gray.500" fontStyle="italic">
      Autosaved: {formatRelative(new Date(autoSavedAt), new Date())}
    </Text>
  ) : null;
};

export default FormikAutosave;
