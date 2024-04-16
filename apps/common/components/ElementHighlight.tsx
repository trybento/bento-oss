import React, { useMemo } from 'react';
import cx from 'classnames';

import { VisualTagHighlightSettings, VisualTagHighlightType } from '../types';
import { px } from '../utils/dom';
import useRandomKey from '../hooks/useRandomKey';

type OverlayHighlightProps = {
  color: string;
  opacity: number;
  pulse: boolean;
  radius: number | string;
  left: number | string;
  top: number | string;
  width: number | string;
  height: number | string;
  zIndex: number | undefined;
  containerDimensions: { width: number; height: number };
};

export function OverlayHighlight({
  left,
  top,
  width,
  height,
  opacity,
  radius,
  color,
  zIndex,
  containerDimensions,
  pulse,
}: React.PropsWithChildren<OverlayHighlightProps>) {
  const transformOrigin = useMemo(
    () =>
      `${px((left as number) + (width as number) / 2)} ${px(
        (top as number) + (height as number) / 2
      )}`,
    [left, top, width, height]
  );

  const id = useRandomKey();
  if (!containerDimensions) return null;

  return (
    <div
      className="absolute left-0 top-0 overflow-hidden min-w-full min-h-full"
      style={{ opacity, zIndex, ...containerDimensions }}
    >
      {/*
        NOTE: after much trial and error it turned out best to animate the size
        of the entire svg rather than just the mask. SVG animations were very
        verbose (and didn't really work well) and just adding the animation
        class to the mask made the animation very stuttery.
      */}
      <div
        className={cx('w-full h-full', { 'pulse-size': pulse })}
        style={{ transformOrigin }}
      >
        <svg
          viewBox={`0 0 ${containerDimensions.width} ${containerDimensions.height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask id={id}>
            {/* white areas will be seen */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* black areas will not be seen */}
            <rect
              x={left}
              y={top}
              width={width}
              height={height}
              rx={radius}
              fill="black"
            />
          </mask>
          <rect
            width="100%"
            height="100%"
            x="0"
            y="0"
            fill={color}
            // apply the mask to a rectangle filling the entire page
            mask={`url(#${id})`}
          />
        </svg>
      </div>
      {/*
        Create a cutout where pointer events can fall through with a border of
        elements which capture pointer events so they don't fall through to the
        underlying page
      */}
      <div
        className="absolute top-0 left-0 w-full pointer-events-auto"
        style={{ height: typeof top === 'number' ? px(top) : top }}
      />
      <div
        className="absolute left-0 pointer-events-auto"
        style={{
          top: typeof top === 'number' ? px(top) : top,
          width: typeof left === 'number' ? px(left) : left,
          height: typeof height === 'number' ? px(height) : height,
        }}
      />
      <div
        className="absolute right-0 pointer-events-auto"
        style={{
          top: typeof top === 'number' ? px(top) : top,
          left:
            typeof left === 'number' && typeof width === 'number'
              ? px(left + width)
              : `calc(${left} + ${width})`,
          height: typeof height === 'number' ? px(height) : height,
        }}
      />
      <div
        className="absolute left-0 bottom-0 w-full pointer-events-auto"
        style={{
          top:
            typeof top === 'number' && typeof height === 'number'
              ? px(top + height)
              : `calc(${top} + ${height})`,
        }}
      />
    </div>
  );
}

export default function ElementHighlight({
  radius,
  color,
  type,
  thickness,
  pulse,
}: React.PropsWithChildren<VisualTagHighlightSettings>) {
  return (
    <div
      className={cx('w-full h-full', {
        'pulse-size': pulse,
        halo: type === VisualTagHighlightType.halo,
      })}
      style={{
        borderRadius: px(radius),
        borderWidth: type === VisualTagHighlightType.solid && px(thickness),
        borderColor: color,
        // @ts-ignore
        '--halo-radius': px(radius),
        '--halo-color': color,
        '--halo-thickness': px(thickness),
      }}
    ></div>
  );
}
