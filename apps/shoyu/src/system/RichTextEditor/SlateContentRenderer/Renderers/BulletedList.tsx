import { SlateRendererProps } from 'bento-common/types/slate';
import React from 'react';
import cx from 'classnames';

export default function BulletedList({
  children,
  isLast,
}: React.PropsWithChildren<SlateRendererProps>) {
  return (
    <ul className={cx('pl-4 list-disc list-outside', { 'mb-2': !isLast })}>
      {children}
    </ul>
  );
}
