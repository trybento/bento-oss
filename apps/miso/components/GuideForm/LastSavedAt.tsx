import React from 'react';
import { formatRelative } from 'date-fns';
import get from 'lodash/get';
import Text from 'system/Text';
import { useFormikContext } from 'formik';

export default function LastSavedAt({ key = 'updatedAt' }) {
  const { values } = useFormikContext();
  const lastUpdatedAt: string = get(values, key);

  if (!lastUpdatedAt) return null;

  return (
    <Text color="gray.500" fontStyle="italic" minW="70px" textAlign="end">
      Last saved: {formatRelative(new Date(lastUpdatedAt), new Date())}
    </Text>
  );
}
