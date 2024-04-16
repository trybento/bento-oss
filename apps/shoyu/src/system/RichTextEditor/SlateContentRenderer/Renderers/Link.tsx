import { LinkElement, SlateRendererProps } from 'bento-common/types/slate';
import { omit } from 'bento-common/utils/lodash';
import React, { useCallback } from 'react';

interface LinkProps extends SlateRendererProps {
  node: LinkElement;
  onClick?: (ev: React.MouseEvent) => void;
}

export default function Link({ node, onClick, ...restProps }: LinkProps) {
  const url = node.url;
  let openInNewWindow = true;
  if (url && url.includes(window.location.host)) {
    openInNewWindow = false;
  }

  // Needed since function 'stopEvent' disables
  // the default behavior for links.
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      } else {
        window.open(node.url, openInNewWindow ? '_blank' : '_self');
      }
    },
    [node, openInNewWindow, onClick]
  );

  return (
    <a
      className="hover:underline"
      style={{
        color: `var(--bento-link-color, rgb(37 99 235))`,
      }}
      onClick={handleClick}
      target={openInNewWindow ? '_blank' : '_self'}
      href={node.url}
      {...omit(restProps, ['isFirst', 'isLast'])}
    />
  );
}
