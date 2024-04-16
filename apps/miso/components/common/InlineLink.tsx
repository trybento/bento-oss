import React from 'react';
import { Link, LinkProps } from '@chakra-ui/react';

type Props = {
  /**
   * Label will not take effect if children are provided
   */
  label?: string;
} & LinkProps;

/**
 * Blue, bold link meant for use inside call-outs and helper texts
 */
const InlineLink: React.FC<React.PropsWithChildren<Props>> = ({
  label,
  children,
  ...linkProps
}) => (
  <Link color="bento.bright" fontWeight="semibold" isExternal {...linkProps}>
    {children ?? label}
  </Link>
);

export default InlineLink;
