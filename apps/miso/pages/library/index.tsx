import React from 'react';
import AppWrapper from 'layouts/AppWrapper';
import Library from 'components/Library';
import AttributesProvider from 'providers/AttributesProvider';
import { BoxProps } from '@chakra-ui/react';

export const templatesPagePx: BoxProps['px'] = '40px';

export default function LibraryPage() {
  return (
    <AppWrapper>
      <AttributesProvider>
        <Library />
      </AttributesProvider>
    </AppWrapper>
  );
}
