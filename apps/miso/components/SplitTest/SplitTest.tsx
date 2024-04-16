import React from 'react';
import { graphql } from 'react-relay';
import Head from 'next/head';
import QueryRenderer from 'components/QueryRenderer';
import useToast from 'hooks/useToast';
import { useRouter } from 'next/router';
import EditSplitTest from './EditSplitTest';
import { SplitTestQuery } from 'relay-types/SplitTestQuery.graphql';
import { testNotFound } from 'components/EditorCommon/common';

interface ContainerProps {
  splitTestEntityId: string;
}

const SplitTest: React.FC<{
  splitTest: any;
}> = ({ splitTest }) => {
  if (!splitTest) return null;
  const { entityId } = splitTest;

  return <EditSplitTest splitTestEntityId={entityId} />;
};

const QUERY = graphql`
  query SplitTestQuery($splitTestEntityId: EntityId!) {
    splitTest: findTemplate(entityId: $splitTestEntityId) {
      entityId
      name
    }
  }
`;

export default function SplitTestQueryRenderer(cProps: ContainerProps) {
  const { splitTestEntityId } = cProps;
  const toast = useToast();
  const router = useRouter();

  return (
    <QueryRenderer<SplitTestQuery>
      query={QUERY}
      variables={{
        splitTestEntityId,
      }}
      render={({ props, error }) => {
        if (props?.splitTest) {
          return (
            <>
              <Head>
                <title>{props.splitTest?.name || 'Split tests'} | Bento</title>
              </Head>
              <SplitTest {...props} />
            </>
          );
        } else if (error || (props && !props.splitTest)) {
          testNotFound(router, toast);
        }
      }}
    />
  );
}
