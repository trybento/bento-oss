import React, { useContext } from 'react';

import {
  InlineEmbedContext,
  InlineEmbedContextValue,
} from '../providers/InlineEmbedProvider';

export default function withInlineEmbed(
  WrappedComponent: React.ComponentType
): React.ForwardRefExoticComponent<
  Exclude<
    React.ComponentProps<typeof WrappedComponent>,
    InlineEmbedContextValue
  >
> {
  const hoc = React.forwardRef(
    (props: React.ComponentProps<typeof WrappedComponent>, _r) => (
      <WrappedComponent {...useContext(InlineEmbedContext)} {...props} />
    )
  );
  hoc.displayName = 'withInlineEmbed';
  return hoc;
}
