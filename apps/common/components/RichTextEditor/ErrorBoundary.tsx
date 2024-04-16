import React from 'react';

import { LS_KEYS } from '../../hooks/useClientStorage';
import Text from '../Text';

interface Props {
  children: React.ReactNode;
}

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state = {
    hasError: false,
  };

  constructor(props: Props) {
    super(props);
  }

  componentDidCatch(error: Error) {
    console.error('Slate.JS editor error', error);

    /**
     * Needed to tell the editor to load its state from
     * local storage instead of whatever initialValue is passed in.
     */
    window.sessionStorage.setItem(
      LS_KEYS.RteRecoveryMode,
      new Date().toISOString()
    );

    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Text>
          Sorry, something went wrong with our text editor. Please reload the
          page and try again.
        </Text>
      );
    } else {
      return this.props.children;
    }
  }
}
