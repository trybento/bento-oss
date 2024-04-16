import React from 'react';
import cx from 'classnames';
import { SlateRendererProps } from 'bento-common/types/slate';

export default function NumberedList({
  children,
  isLast,
}: React.PropsWithChildren<SlateRendererProps>) {
  return (
    <ol
      className={cx('mb-2 pl-4 list-decimal list-outside', { 'mb-2': !isLast })}
    >
      {children}
    </ol>
  );
}
