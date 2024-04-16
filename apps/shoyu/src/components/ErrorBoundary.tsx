import React from 'react';

import catchException from '../lib/catchException';
import mainStore from '../stores/mainStore';
import sessionStore from '../stores/sessionStore';

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren<any>,
  State
> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    catchException(error, 'Embedded Component');
    sessionStore.persist.clearStorage();
    mainStore.persist.clearStorage();
  }

  render(): React.ReactNode {
    // This means a Bento component crashed and should almost never happen,
    // therefore it is okay to output an error to the console.
    if (this.state.hasError) {
      // eslint-disable-next-line no-console
      console.error(
        '[BENTO] Sorry, something went wrong loading the Bento Embeddable. \
        The issue has been reported to our team.'
      );
      return null;
    }

    return this.props.children;
  }
}
