/** Deprecated component, fragments are still used */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import Box from 'system/Box';

interface Props {}

/** Used to be for the big cards in create guide base */
export function TemplateOptionUnconnected(props: Props) {
  return <Box />;
}

export const NEW_TEMPLATE_DUMMY_ENTITY_ID = 'NEW_TEMPLATE';

interface NewTemplateOptionProps {}

export function NewTemplateOption(props: NewTemplateOptionProps) {
  return <TemplateOptionUnconnected />;
}

export default createFragmentContainer(TemplateOptionUnconnected, {
  account: graphql`
    fragment TemplateOption_account on Account {
      name
    }
  `,
  template: graphql`
    fragment TemplateOption_template on Template {
      name
      formFactor
      description
    }
  `,
});
