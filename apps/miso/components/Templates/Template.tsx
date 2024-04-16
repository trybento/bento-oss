import React from 'react';
import { graphql } from 'react-relay';
import Head from 'next/head';
import QueryRenderer from 'components/QueryRenderer';

import useToast from 'hooks/useToast';
import { useRouter } from 'next/router';

import EditTemplate from './EditTemplate';
import { TemplateValue } from 'bento-common/types/templateData';
import { TemplateQuery } from 'relay-types/TemplateQuery.graphql';
import { templateNotFound } from 'components/EditorCommon/common';

interface ContainerProps {
  templateEntityId: string;
  step?: string;
}

export type TemplateFormValues = {
  templateData: TemplateValue;
};

const Template: React.FC<{
  template: TemplateQuery['response']['template'];
  stepPrototypeEntityId?: string;
}> = ({ template, stepPrototypeEntityId }) => {
  if (!template) return null;
  const { entityId } = template;

  return (
    <EditTemplate
      templateEntityId={entityId}
      stepPrototypeEntityId={stepPrototypeEntityId}
    />
  );
};

const TEMPLATE_QUERY = graphql`
  query TemplateQuery($templateEntityId: EntityId!) {
    template: findTemplate(entityId: $templateEntityId) {
      entityId
      name
    }
  }
`;

export default function TemplateQueryRenderer(cProps: ContainerProps) {
  const { templateEntityId, step } = cProps;
  const toast = useToast();
  const router = useRouter();

  return (
    <QueryRenderer<TemplateQuery>
      query={TEMPLATE_QUERY}
      variables={{
        templateEntityId,
      }}
      render={({ props, error }) => {
        if (props && props.template) {
          return (
            <>
              <Head>
                <title>{props.template?.name || 'Guides'} | Bento</title>
              </Head>
              <Template {...props} stepPrototypeEntityId={step} />
            </>
          );
        } else if (error || (props && !props.template)) {
          templateNotFound(router, toast);
        }
      }}
    />
  );
}
