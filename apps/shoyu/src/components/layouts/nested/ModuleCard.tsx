import React, { useCallback, useMemo, useState } from 'react';
import cx from 'classnames';

import { Step, StepEntityId } from 'bento-common/types/globalShoyuState';
import useDomObserver from 'bento-common/hooks/useDomObserver';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import composeComponent from 'bento-common/hocs/composeComponent';
import { Theme } from 'bento-common/types';
import { getStepSeparationFlags } from 'bento-common/data/helpers';
import { debounce } from 'bento-common/utils/lodash';

import NestedStepListItem from './StepListItem';
import GuideModuleHeader from '../common/ModuleHeader';
import { MainStoreState } from '../../../stores/mainStore/types';
import withMainStoreData from '../../../stores/mainStore/withMainStore';
import {
  formFactorSelector,
  selectedGuideForFormFactorSelector,
  selectedStepForFormFactorSelector,
  stepsSelectorOfModule,
} from '../../../stores/mainStore/helpers/selectors';
import StepBody from '../../StepBody';
import { ModuleCardProps } from '../../../lib/guideRenderConfig';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import withFormFactor from '../../../hocs/withFormFactor';
import StepSeparator from '../../StepSeparator';
import withUIState from '../../../hocs/withUIState';
import TransitionWrapper from '../../TransitionWrapper';
import SuccessMessage from '../../SuccessMessage';

type OuterProps = ModuleCardProps;

type Props = OuterProps &
  Pick<
    CustomUIProviderValue,
    'secondaryColorHex' | 'borderColor' | 'stepSeparationStyle'
  > &
  Pick<FormFactorContextValue, 'formFactor' | 'renderedFormFactorFlags'>;

type MainStoreData = {
  steps: Step[];
  dispatch: MainStoreState['dispatch'];
  isSelected: boolean;
  selectedStep: Step | undefined;
  firstIncompleteStep: StepEntityId | undefined;
};

type NestedModuleCardProps = Props & MainStoreData;

const NestedModuleCard: React.FC<NestedModuleCardProps> = ({
  module,
  steps,
  isSelected,
  formFactor,
  renderedFormFactorFlags: { isInline, isSidebar },
  selectedStep,
  dispatch,
  theme,
  secondaryColorHex,
  borderColor,
  stepSeparationStyle,
  firstIncompleteStep,
  showSeparator,
  transition,
}) => {
  const [stepListContainerEl, setStepListContainerEl] =
    useState<HTMLDivElement | null>();
  const [stepListHeight, setStepListHeight] = useState<number>();

  const updateStepListHeight = useCallbackRef(
    debounce(() => {
      if (stepListContainerEl) {
        setStepListHeight(stepListContainerEl.clientHeight);
      }
    }, 100),
    [stepListContainerEl],
    { callOnDepsChange: true }
  );

  useDomObserver(updateStepListHeight, { element: stepListContainerEl });

  const selectModule = useCallback(() => {
    dispatch({
      type: 'moduleSelected',
      formFactor,
      module: isSelected ? undefined : module!.entityId,
    });
  }, [module!.entityId, formFactor, dispatch, isSelected]);

  const stepSelectionHandlers = useMemo(
    () =>
      Object.fromEntries(
        steps.map((s) => [
          s.entityId,
          () =>
            dispatch({ type: 'stepSelected', formFactor, step: s.entityId }),
        ])
      ),
    [steps, formFactor, dispatch]
  );

  const totalNumSteps = steps.length;
  const numCompletedSteps = steps.filter(
    (step: Step) => step.isComplete
  ).length;
  const moduleIsComplete = numCompletedSteps === totalNumSteps;

  const { isBoxed, isBordered } = getStepSeparationFlags(
    stepSeparationStyle.type
  );

  const stepList = (
    <div className="bento-step-group-list" ref={setStepListContainerEl}>
      {steps.map((step: Step) => {
        const isStepSelected = selectedStep?.entityId == step.entityId;
        return (
          <div
            key={step.entityId}
            className={cx('w-full', {
              'py-1 px-2': isInline,
              rounded: isInline && isBordered,
            })}
            style={{
              backgroundColor: isStepSelected ? secondaryColorHex : undefined,
            }}
          >
            <NestedStepListItem
              step={step}
              isSelected={isStepSelected}
              onSelect={stepSelectionHandlers[step.entityId]}
              isNext={step.entityId === firstIncompleteStep}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <StepSeparator
      theme={Theme.nested}
      entityId={undefined}
      isComplete={moduleIsComplete}
      isSelected={isSelected}
      enabled={showSeparator}
    >
      <div
        className={cx('cursor-pointer', { 'p-4': isInline })}
        onClick={selectModule}
      >
        <GuideModuleHeader
          module={module}
          index={module?.orderIndex}
          theme={Theme.nested}
          selectedStep={selectedStep}
          isSelected={isSelected}
        />
      </div>
      <div
        className={cx({
          'border-t': isInline && isSelected && isBoxed,
          'mt-2': isSidebar && isSelected,
        })}
        style={{ borderColor }}
      >
        <div className={`transition-all duration-300 ease-in-out`}>
          <TransitionWrapper transition={transition} expanded={isSelected}>
            {isInline ? (
              <div
                className="grid"
                style={{
                  gridTemplateColumns:
                    'minmax(200px, 310px) minmax(400px, 1fr)',
                }}
              >
                <div>{stepList}</div>
                <div
                  className={cx('relative', { 'border-l': isBoxed })}
                  style={{ borderColor }}
                >
                  <StepBody
                    theme={theme!}
                    step={selectedStep}
                    minHeight={stepListHeight}
                    isSelected
                  />
                  <SuccessMessage formFactor={formFactor} step={selectedStep} />
                </div>
              </div>
            ) : (
              stepList
            )}
          </TransitionWrapper>
        </div>
      </div>
    </StepSeparator>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withUIState,
  withMainStoreData<Props, MainStoreData>((state, { module, formFactor }) => ({
    steps: stepsSelectorOfModule(module?.entityId, state),
    selectedStep: selectedStepForFormFactorSelector(state, formFactor),
    isSelected:
      formFactorSelector(state, formFactor)?.selectedModule ===
      module?.entityId,
    dispatch: state.dispatch,
    firstIncompleteStep: selectedGuideForFormFactorSelector(state, formFactor)
      ?.firstIncompleteStep,
  })),
])(NestedModuleCard);
