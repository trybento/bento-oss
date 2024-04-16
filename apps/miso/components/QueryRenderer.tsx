import React, { useRef } from 'react';
import {
  QueryRenderer as DefaultQueryRenderer,
  ReactRelayContext,
  QueryRendererProps,
  FetchPolicy,
  Variables,
} from 'react-relay';
import { OperationType } from 'relay-runtime';

/** React-Relay's but we provide default variables and environment */
interface RendererProps<TOperation extends OperationType>
  extends Omit<
    Omit<QueryRendererProps<TOperation>, 'environment'>,
    'variables'
  > {
  fetchPolicy?: FetchPolicy;
  variables?: Variables;
}

interface SuspendedRendererProps<TOperation extends OperationType>
  extends Omit<RendererProps<TOperation>, 'render'> {
  render: (rProps: {
    error?: Error;
    props: any;
    retry: () => void;
    isFetching?: boolean;
  }) => React.ReactNode;
}

export function SuspendedQueryRenderer<TOperation extends OperationType>(
  rendererProps: SuspendedRendererProps<TOperation>
) {
  const suspendedProps = useRef(undefined);
  const origRender = rendererProps.render;

  return (
    <QueryRenderer
      {...rendererProps}
      render={({ props, retry, error }) => {
        if (props || suspendedProps.current === undefined)
          suspendedProps.current = props;

        return origRender({
          props: suspendedProps.current,
          retry,
          error,
          isFetching: !props,
        });
      }}
    />
  );
}

export default function QueryRenderer<TOperation extends OperationType>({
  variables,
  ...restProps
}: RendererProps<TOperation>) {
  return (
    <ReactRelayContext.Consumer>
      {({ environment }) => {
        if (!environment) throw new Error('No Relay environment found');

        return (
          // @ts-ignore
          <DefaultQueryRenderer<TOperation>
            {...restProps}
            variables={variables || {}}
            environment={environment}
          />
        );
      }}
    </ReactRelayContext.Consumer>
  );
}
