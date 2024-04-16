import React, { useContext } from 'react';
import {
  NpsSurveyContext,
  NpsSurveyProviderValue,
} from '../providers/NpsSurveyProvider';

export default function withNpsSurveyContext<P>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithNpsSurveyContext: React.FC<
    Exclude<
      React.ComponentProps<typeof WrappedComponent>,
      NpsSurveyProviderValue
    >
  > = (props) => (
    <WrappedComponent {...useContext(NpsSurveyContext)} {...props} />
  );
  return WithNpsSurveyContext;
}
