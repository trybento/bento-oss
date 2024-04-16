import React from 'react';
import Data from 'components/Data';
import AppWrapper from 'layouts/AppWrapper';

/**
 * If this page is moved, remember to update any callback URLs e.g. with an integration.
 *
 * Otherwise we will redirect users to 404s
 */
export default function DataAndIntegrationsPage() {
  return (
    <AppWrapper>
      <Data />
    </AppWrapper>
  );
}
