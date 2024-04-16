import React from 'react';

import LibraryBooksIcon from '../icons/LibraryBooks';
import { px } from '../utils/dom';

type Props = {
  primaryColor: string;
  bgColor: string;
  borderRadius: number;
  padding: number;
  iconUrl?: string | null;
  width?: number;
  height?: number;
};

const VisualTagIcon = React.forwardRef(
  (
    {
      primaryColor,
      bgColor,
      borderRadius,
      padding,
      iconUrl,
      width = 16,
      height = 16,
    }: React.PropsWithChildren<Props>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        className="flex"
        style={{
          backgroundColor: bgColor,
          width: px(width + padding * 2),
          height: px(height + padding * 2),
          borderRadius: px(borderRadius),
        }}
        ref={ref}
      >
        {iconUrl ? (
          <div
            className="h-4 w-4 bg-contain bg-center bg-no-repeat m-auto"
            style={{ backgroundImage: `url(${iconUrl})` }}
          />
        ) : (
          <div
            className="m-auto fill-current h-4 w-4"
            style={{ color: primaryColor }}
          >
            <LibraryBooksIcon />
          </div>
        )}
      </div>
    );
  }
);

export default React.memo(VisualTagIcon);
