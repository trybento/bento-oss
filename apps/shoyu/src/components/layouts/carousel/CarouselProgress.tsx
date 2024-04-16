import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import { colord } from 'colord';
import composeComponent from 'bento-common/hocs/composeComponent';
import { Module, Step } from 'bento-common/types/globalShoyuState';
import Done from 'bento-common/icons/Done';
import Minus from 'bento-common/icons/Minus';
import { px } from 'bento-common/utils/dom';
import { TransitionDirection } from 'bento-common/types/shoyuUIState';
import { ctaColorFieldToHexValue } from 'bento-common/data/helpers';
import { CarouselStyle, CtaColorFields } from 'bento-common/types';
import { isSkippedStep } from 'bento-common/utils/steps';

import {
  guideSelector,
  modulesSelectorOfGuide,
  selectedStepForFormFactorSelector,
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
  className?: React.HTMLProps<HTMLDivElement>['className'];
};

type Props = OuterProps &
  Pick<
    CustomUIProviderValue,
    | 'primaryColorHex'
    | 'secondaryColorHex'
    | 'fontColorHex'
    | 'additionalColors'
  > &
  Pick<UIStateContextValue, 'uiActions'> &
  Pick<FormFactorContextValue, 'formFactor' | 'renderedFormFactorFlags'> &
  WithMainStoreDispatchData;

type MainStoreData = {
  steps: Step[];
  modules: Module[];
  selectedStep: Step | undefined;
  dotsColor: string;
};

const CarouselProgress: React.FC<Props & MainStoreData> = ({
  selectedStep,
  modules,
  steps,
  primaryColorHex,
  uiActions,
  dotsColor,
  dispatch,
  formFactor,
  renderedFormFactorFlags: { isInline, isSidebar },
  className,
}) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const hasSelectedStep = useMemo(
    () => steps.some((step) => step.entityId === selectedStep?.entityId),
    [steps, selectedStep]
  );

  const parentColor = useMemo(
    () =>
      ref?.parentElement
        ? getComputedStyle(ref.parentElement as Element).color
        : undefined,
    [ref]
  );

  const primaryColorIsDark = useMemo(
    () => colord(primaryColorHex).isDark(),
    [primaryColorHex]
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

  if (steps.length <= 1) return null;

  return (
    <div
      className={cx(
        'shrink-0 self-start inline-flex relative gap-2',
        className
      )}
      ref={setRef}
    >
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
              'w-4',
              'h-4',
              'relative',
              'rounded-full',
              'flex',
              'items-center',
              'justify-center',
              {
                'cursor-pointer': !isSelected,
                'opacity-20': !isSelected && !isComplete && !isSkipped,
                'opacity-60':
                  !isSelected &&
                  (isComplete || isSkipped) &&
                  (isInline || hasSelectedStep),
              }
            )}
            style={{ backgroundColor: dotsColor || parentColor }}
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
    (
      state,
      {
        formFactor,
        primaryColorHex,
        secondaryColorHex,
        fontColorHex,
        additionalColors,
      }
    ) => {
      const selectedStep = selectedStepForFormFactorSelector(state, formFactor);
      const modules = modulesSelectorOfGuide(selectedStep?.guide, state);
      const guide = guideSelector(selectedStep?.guide, state);
      const dotsColor = (guide?.formFactorStyle as CarouselStyle)?.dotsColor
        ? ctaColorFieldToHexValue(
            {
              primaryColorHex,
              secondaryColorHex,
              additionalColors,
              fontColorHex,
            },
            guide!.formFactorStyle as CarouselStyle,
            guide?.formFactor,
            (guide!.formFactorStyle as CarouselStyle)
              .dotsColor as CtaColorFields,
            undefined,
            CtaColorFields.primaryColorHex
          ).value
        : primaryColorHex;

      return {
        modules,
        steps: modules.flatMap((m) => stepsSelectorOfModule(m.entityId, state)),
        selectedStep,
        dotsColor,
      };
    }
  ),
])(CarouselProgress);
