import React, { useContext } from 'react';
import cx from 'classnames';
import { px } from '../../lib/helpers';
import { CustomUIContext } from '../../providers/CustomUIProvider';
import { VisualTagPulseLevel } from 'bento-common/types';

interface ContextualDotProps {
  size?: number;
}

const ContextualDot = React.forwardRef(
  ({ size }: ContextualDotProps, ref: React.Ref<HTMLDivElement>) => {
    const { tagPrimaryColor, tagDotSize, tagPulseLevel } =
      useContext(CustomUIContext);
    const _size = size || tagDotSize;

    return (
      <div
        className="flex w-4 h-4"
        style={{ width: px(_size * 2), height: px(_size * 2) }}
        ref={ref}
      >
        <div
          className={cx('rounded-full m-auto', {
            'bento-context-animated pulse':
              tagPulseLevel === VisualTagPulseLevel.standard,
          })}
          style={{
            background: tagPrimaryColor,
            width: px(_size),
            height: px(_size),
          }}
        />
      </div>
    );
  }
);

export default ContextualDot;
