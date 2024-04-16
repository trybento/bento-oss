import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import { colord } from 'colord';
import composeComponent from 'bento-common/hocs/composeComponent';
import { Module, Step } from 'bento-common/types/globalShoyuState';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import Done from 'bento-common/icons/Done';
import Minus from 'bento-common/icons/Minus';
import useResizeObserver from 'bento-common/hooks/useResizeObserver';
import { px } from 'bento-common/utils/dom';
import { TransitionDirection } from 'bento-common/types/shoyuUIState';
import { throttle } from 'bento-common/utils/lodash';
import { isSkippedStep } from 'bento-common/utils/steps';

import {
  modulesSelectorOfGuide,
  stepsSelectorOfModule,
} from '../../../stores/mainStore/helpers/selectors';
import withMainStoreData, {
  withMainStoreDispatch,
  WithMainStoreDispatchData,
} from '../../../stores/mainStore/withMainStore';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';
import withUIState from '../../../hocs/withUIState';
import { UIStateContextValue } from '../../../providers/UIStateProvider';
import withFormFactor from '../../../hocs/withFormFactor';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';

type OuterProps = {
  selectedStep?: Step;
  module?: Module;
  combineModules?: boolean;
  className?: React.HTMLProps<HTMLDivElement>['className'];
};

type Props = OuterProps &
  Pick<CustomUIProviderValue, 'fontColorHex' | 'primaryColorHex'> &
  Pick<UIStateContextValue, 'uiActions'> &
  Pick<FormFactorContextValue, 'formFactor' | 'renderedFormFactorFlags'> &
  WithMainStoreDispatchData;

type MainStoreData = {
  modules: Module[];
  steps: Step[];
};

const DOT_WIDTH = 28;
const DOT_DASH_PADDING = 4;
const DASH_OFFSET = DOT_WIDTH / 2;
const DASH_WIDTH = 1;
const DASH_START = DASH_OFFSET + DOT_DASH_PADDING;
const DASH_COLOR_ALPHA = 0.3;

const TimelineProgress: React.FC<Props & MainStoreData> = ({
  selectedStep,
  module,
  modules,
  steps,
  fontColorHex,
  primaryColorHex,
  uiActions,
  dispatch,
  formFactor,
  renderedFormFactorFlags: { isInline, isSidebar },
  className,
}) => {
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);
  const [dashLength, setDashLength] = useState(0);

  const hasSelectedStep = useMemo(
    () => steps.some((step) => step.entityId === selectedStep?.entityId),
    [steps, selectedStep]
  );

  const primaryColorIsDark = useMemo(
    () => colord(primaryColorHex).isDark(),
    [primaryColorHex]
  );

  const lineStyle = useMemo(() => {
    const dashEnd = dashLength + DASH_START;
    const color = colord(fontColorHex).alpha(DASH_COLOR_ALPHA).toRgbString();
    return {
      backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent ${DASH_START}px, ${color} ${DASH_START}px, ${color} ${dashEnd}px, transparent ${dashEnd}px, transparent ${
        dashEnd + DASH_START
      }px)`,
      width: `calc(100% - ${DOT_WIDTH}px)`,
      height: px(DASH_WIDTH),
      left: px(DASH_OFFSET),
    };
  }, [dashLength, fontColorHex]);

  const updateDashLength = useCallbackRef(
    throttle(() => {
      if (wrapperEl) {
        setDashLength(
          (wrapperEl.clientWidth - DOT_WIDTH) / (steps.length - 1) -
            (DOT_WIDTH + 2 * DOT_DASH_PADDING)
        );
      }
    }, 16),
    [wrapperEl, steps],
    { callOnDepsChange: true }
  );

  const dotClickHandlers = useMemo(
    () =>
      steps.map((step) => (e: React.MouseEvent<HTMLDivElement>) => {
        if (step.entityId === selectedStep?.entityId) return;
        e.stopPropagation();
        uiActions.stepTransitionDirectionChanged(
          (modules.find((m) => step.module === m.entityId)?.orderIndex || 0) <
            (modules.find((m) => selectedStep?.module === m.entityId)
              ?.orderIndex || 0) ||
            step.orderIndex < (selectedStep?.orderIndex || 0)
            ? TransitionDirection.left
            : TransitionDirection.right
        );
        dispatch({
          type: 'stepSelected',
          step: step.entityId,
          formFactor,
        });
      }),
    [steps, selectedStep, modules]
  );

  useResizeObserver(updateDashLength, {
    element: wrapperEl,
    disabled: isSidebar,
  });
  return (
    <div
      ref={setWrapperEl}
      className={cx('shrink-0 self-start inline-flex relative', className, {
        'gap-12': isInline,
        'mb-4': isInline && hasSelectedStep,
        'mb-2 gap-2': isSidebar,
      })}
    >
      {isInline && <div className="absolute top-1/2" style={lineStyle} />}
      {steps.map((step, i) => {
        const isSelected = step.entityId === selectedStep?.entityId;
        const isComplete = step.isComplete;
        const isSkipped = isSkippedStep(step.state);
        const Icon = isComplete ? Done : isSkipped ? Minus : null;
        const iconColor = primaryColorIsDark ? 'white' : 'black';
        return (
          <div
            key={step.entityId}
            className={cx(
              'relative',
              'rounded-full',
              'flex',
              'items-center',
              'justify-center',
              {
                'w-7 h-7': isInline,
                'w-3.5 h-3.5': isSidebar,
                'cursor-pointer': !isSelected,
                'opacity-20': !isSelected && !isComplete && !isSkipped,
                'opacity-60':
                  !isSelected &&
                  (module?.isComplete ||
                    ((isComplete || isSkipped) &&
                      (isInline || hasSelectedStep))),
              }
            )}
            style={{ backgroundColor: primaryColorHex }}
            onClick={dotClickHandlers[i]}
          >
            {Icon && (
              <Icon
                className="w-3/4"
                style={{
                  filter: isSidebar
                    ? `drop-shadow(0 -0.5px 0 ${iconColor})`
                    : undefined,
                  color: iconColor,
                  marginTop: px(0.5),
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withUIState,
  withMainStoreDispatch,
  withMainStoreData<Props, MainStoreData>(
    (state, { selectedStep, module, combineModules }) => {
      const modules = combineModules
        ? modulesSelectorOfGuide(selectedStep?.guide, state)
        : module
        ? [module]
        : [];
      return {
        modules,
        steps: modules.flatMap((m) => stepsSelectorOfModule(m.entityId, state)),
      };
    }
  ),
])(TimelineProgress);
