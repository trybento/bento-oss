import React from 'react';
import ZendeskConfiguration from 'components/Integrations/Zendesk/ZendeskConfiguration';
import AppWrapper from 'layouts/AppWrapper';

export default function ZendeskPage() {
  return (
    <AppWrapper>
      <ZendeskConfiguration />
    </AppWrapper>
  );
}
