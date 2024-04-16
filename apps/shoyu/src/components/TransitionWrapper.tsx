import React, { useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import composeComponent from 'bento-common/hocs/composeComponent';
import usePrevious from 'bento-common/hooks/usePrevious';
import useResizeObserver from 'bento-common/hooks/useResizeObserver';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import { throttleWithExtraCall } from 'bento-common/utils/functions';
import { px } from 'bento-common/utils/dom';

import withSidebarContext from '../hocs/withSidebarContext';
import withUIState from '../hocs/withUIState';
import { UIStateContextValue } from '../providers/UIStateProvider';
import { SidebarProviderValue } from '../providers/SidebarProvider';
import { StepTransition } from '../../types/global';

type Props = {
  transition: StepTransition;
  expanded?: boolean;
  children?: React.ReactNode;
} & Pick<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

const TransitionWrapper: React.FC<
  Props &
    Pick<UIStateContextValue, 'stepTransitionDirection'> &
    Pick<SidebarProviderValue, 'transitionsEnabled'>
> = ({
  transition,
  expanded = true,
  children,
  transitionsEnabled,
  stepTransitionDirection,
  className,
  style = {},
}) => {
  const isSlide = transition === StepTransition.slide;
  const isAccordion = transition === StepTransition.accordion;
  const isNone = transition === StepTransition.none;

  const [contentWrapper, setContentWrapper] = useState<HTMLDivElement | null>();
  const [contentHeight, setContentHeight] = useState<number>();

  const wasExpanded = usePrevious(expanded);

  const [expand, setExpand] = useState<boolean>(false);

  const updateContentHeight = useCallbackRef(
    throttleWithExtraCall(
      () => {
        if (contentWrapper) {
          setContentHeight(contentWrapper.clientHeight);
        }
      },
      { throttleArgs: [16], extraDelay: 100 }
    ),
    [contentWrapper],
    { callOnDepsChange: true }
  );

  useResizeObserver(updateContentHeight, { element: contentWrapper });

  useEffect(() => {
    setExpand(expanded);
  }, [expanded]);

  return (
    <div
      className={cx(
        'overflow-hidden duration-[400ms] ease-out w-full',
        className,
        {
          'transition-[height]': transitionsEnabled && isAccordion,
          'transition-opacity': transitionsEnabled && isSlide,
          'opacity-0 absolute': isSlide && !expand,
        }
      )}
      style={useMemo(
        () => ({
          height: isAccordion
            ? expand && contentHeight
              ? px(contentHeight)
              : '0'
            : '100%',
          ...style,
        }),
        [isAccordion, isNone, expand, contentHeight, style]
      )}
    >
      <div
        ref={setContentWrapper}
        style={{
          /**
           * Fixes height animation glitch currently
           * only needed for Safari.
           */
          willChange: expand ? 'transform' : undefined,
        }}
        className={cx('duration-[400ms] ease-out origin-[top_center]', {
          'h-full': isSlide || isNone,
          'transition-transform': transitionsEnabled && isSlide,
          'translate-x-full':
            isSlide &&
            !expand &&
            ((wasExpanded && stepTransitionDirection !== 'right') ||
              (!wasExpanded && stepTransitionDirection === 'right')),
          '-translate-x-full':
            isSlide &&
            !expand &&
            ((wasExpanded && stepTransitionDirection === 'right') ||
              (!wasExpanded && stepTransitionDirection !== 'right')),
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default composeComponent<Props>([withSidebarContext, withUIState])(
  TransitionWrapper
);
