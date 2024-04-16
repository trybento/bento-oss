import React, { useCallback, useMemo } from 'react';
import cx from 'classnames';

import withCustomUIContext from '../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import composeComponent from 'bento-common/hocs/composeComponent';
import { pick } from 'bento-common/utils/lodash';

type OuterProps = React.AnchorHTMLAttributes<{}> & {
  ref?: React.Ref<HTMLAnchorElement>;
  ['data-for']?: string;
  ['data-tip']?: string;
};

type Props = OuterProps & Pick<CustomUIProviderValue, 'fontColorHex'>;

const Link = React.forwardRef(
  (
    {
      children,
      className,
      onClick,
      href,
      fontColorHex,
      ...otherProps
    }: React.PropsWithChildren<Props>,
    ref: React.Ref<HTMLAnchorElement>
  ) => {
    const clickHandler = useCallback(
      (e: React.MouseEvent) => {
        if (!href) {
          e.preventDefault();
        }
        onClick?.(e);
      },
      [onClick, href]
    );

    const props = useMemo(
      () =>
        pick(otherProps, [
          'download',
          'hrefLang',
          'media',
          'ping',
          'rel',
          'target',
          'type',
          'referrerPolicy',
          'data-for',
          'data-tip',
        ]),
      [...Object.values(otherProps)]
    );
    return (
      <a
        ref={ref}
        className={cx(
          'inline-block',
          'transition',
          'hover:opacity-60',
          'active:opacity-30',
          'cursor-pointer',
          {
            'text-current': fontColorHex,
            'text-gray-600': !fontColorHex,
          },
          className
        )}
        onClick={clickHandler}
        href={href}
        {...props}
      >
        {children}
      </a>
    );
  }
);

export default composeComponent<OuterProps>([withCustomUIContext])(Link);
