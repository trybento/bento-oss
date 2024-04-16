import React from 'react';

import { useTemplate } from '../../providers/TemplateProvider';
import { isGuideInActiveSplitTest } from 'bento-common/data/helpers';

export default function withTemplateDisabled<
  P extends object & { disabled?: boolean }
>(WrappedComponent: React.ComponentType<P>) {
  const hoc = React.forwardRef((props: P, ref) => {
    const { isTemplate, isTargetedForSplitTesting } = useTemplate();
    return (
      <WrappedComponent
        {...props}
        ref={ref}
        disabled={
          props.disabled ||
          isTemplate ||
          isGuideInActiveSplitTest(isTargetedForSplitTesting)
        }
      />
    );
  });
  hoc.displayName = 'withTemplateDisabled';
  return hoc;
}
