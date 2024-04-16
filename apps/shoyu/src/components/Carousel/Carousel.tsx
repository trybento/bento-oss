import React, { useState, useMemo } from 'react';
import { px } from 'bento-common/utils/dom';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import useResizeObserver from 'bento-common/hooks/useResizeObserver';
import { throttle } from 'bento-common/utils/lodash';

import NavButton from './NavButton';
import DotsIndicator, { DotsStyling } from './DotsIndicator';
import { SlateRendererOptions } from 'bento-common/types/slate';

type Props = DotsStyling & {
  options?: SlateRendererOptions;
};

const style = { minWidth: '40px' };

const Carousel: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  dotColor,
}) => {
  const [slider, setSlider] = useState<HTMLDivElement | null>(null);
  const totalImages = useMemo(() => React.Children.count(children), [children]);
  const [dotsTop, setDotsTop] = useState<number>(0);
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  const transformValue = useMemo(
    () => `-${currentIdx * (100 / (totalImages - 1))}%`,
    [currentIdx, totalImages]
  );

  const changeIndex = useCallbackRef(
    (newIdx: number) => {
      setCurrentIdx(Math.max(0, Math.min(newIdx, totalImages - 1)));
    },
    [currentIdx, totalImages]
  );

  const [goNext, goPrev] = useMemo(
    () =>
      [1, -1].map((offset) => (e: React.MouseEvent) => {
        e.stopPropagation();
        changeIndex(currentIdx + offset);
      }),
    [currentIdx]
  );

  const setDotsPosition = useCallbackRef(
    throttle(() => {
      const activeChild = slider?.children[currentIdx] as HTMLElement;
      if (!activeChild) return;
      let newTop = activeChild.offsetTop + activeChild.offsetHeight;
      if (newTop >= slider!.offsetHeight) newTop = slider!.offsetHeight - 20;
      setDotsTop(newTop);
    }, 100),
    [slider, currentIdx],
    { callOnDepsChange: true }
  );

  useResizeObserver(setDotsPosition, { element: slider });

  if (totalImages <= 1)
    return (
      <div className="flex items-center w-full h-full" style={style}>
        {children}
      </div>
    );

  return (
    <div className="relative w-full h-full" style={style}>
      <NavButton className="left-2" direction="backward" onClick={goPrev} />
      <div className="w-full h-full overflow-hidden">
        <div
          ref={setSlider}
          className="h-full flex items-center justify-start transition ease-out duration-700"
          style={{ transform: `translateX(${transformValue})` }}
        >
          {children}
        </div>
      </div>
      <NavButton className="right-2" direction="forward" onClick={goNext} />
      {dotsTop > 0 && (
        <DotsIndicator
          total={totalImages}
          current={currentIdx}
          dotColor={dotColor}
          style={{ top: px(dotsTop) }}
        />
      )}
    </div>
  );
};

const CarouselWrapper: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  ...props
}) =>
  props.options?.carousel ? (
    <Carousel {...props}>{children}</Carousel>
  ) : (
    <>{children}</>
  );

export default CarouselWrapper;
