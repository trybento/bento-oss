import React from 'react';
import cx from 'classnames';
import { px } from '../../utils/dom';
import { VisualTagPulseLevel } from '../../types';

export const MIN_DOT_SIZE_PX = 3;
export const MAX_DOT_SIZE_PX = 30;

type Props = {
  size?: number;
  primaryColor: string;
  tagPulseLevel?: VisualTagPulseLevel;
};

const Dot = React.forwardRef<HTMLDivElement, Props>(function Dot(
  {
    size = MIN_DOT_SIZE_PX,
    primaryColor,
    tagPulseLevel = VisualTagPulseLevel.standard,
  },
  ref
) {
  return (
    <div
      className="flex"
      style={{
        width: px(size * 2),
        height: px(size * 2),
      }}
      ref={ref}
    >
      <div
        className={cx('rounded-full m-auto', {
          'bento-context-animated pulse':
            tagPulseLevel === VisualTagPulseLevel.standard,
        })}
        style={{
          background: primaryColor,
          width: px(size),
          height: px(size),
        }}
      />
    </div>
  );
});

export default Dot;
