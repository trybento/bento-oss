import React, { useCallback } from 'react';
import { Step } from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import { Theme } from 'bento-common/types';

import withMainStoreData, {
  withMainStoreDispatch,
  WithMainStoreDispatchData,
} from '../../../stores/mainStore/withMainStore';
import {
  guideSelector,
  selectedStepForFormFactorSelector,
  stepSelector,
} from '../../../stores/mainStore/helpers/selectors';
import StepBody from '../../StepBody';
import withFormFactor from '../../../hocs/withFormFactor';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import { ModuleCardProps } from '../../../lib/guideRenderConfig';
import StepSeparator from '../../StepSeparator';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';
import TransitionWrapper from '../../TransitionWrapper';
import CommonModuleHeader from '../common/ModuleHeader';

type OuterProps = ModuleCardProps;

type MainStoreData = {
  selectedStep: Step | undefined;
  moduleStep: Step | undefined;
  isFirstIncompleteModule: boolean;
};

type Props = OuterProps &
  Pick<
    FormFactorContextValue,
    'formFactor' | 'embedFormFactorFlags' | 'renderedFormFactorFlags'
  > &
  Pick<CustomUIProviderValue, 'stepCompletionStyle'> &
  WithMainStoreDispatchData;

const TimelineModuleCard: React.FC<Props & MainStoreData> = ({
  guide,
  module,
  combineModules,
  selectedStep,
  moduleStep,
  formFactor,
  embedFormFactorFlags: { isInline: isInlineEmbed, isSidebar: isSidebarEmbed },
  showSeparator,
  transition,
  isSelected,
  dispatch,
  isFirstIncompleteModule,
}) => {
  const handleClick = useCallback(() => {
    if (isSidebarEmbed || combineModules) {
      dispatch({
        type: 'stepSelected',
        step: module
          ? module.firstIncompleteStep || module.steps![0]
          : guide?.firstIncompleteStep || guide?.steps![0],
        formFactor,
      });
    } else if (module) {
      dispatch({
        type: 'moduleSelected',
        module: isSelected ? undefined : module.entityId,
        formFactor,
      });
    }
  }, [module, combineModules, guide, isSelected]);

  return (
    <StepSeparator
      theme={Theme.timeline}
      entityId={undefined}
      isComplete={module ? module.isComplete : guide?.isComplete}
      isSelected={isSelected}
      enabled={showSeparator}
      className={isInlineEmbed ? 'pointer-cursor' : undefined}
    >
      <CommonModuleHeader
        guide={guide}
        module={module}
        combineModules={combineModules}
        theme={Theme.timeline}
        selectedStep={selectedStep}
        showGetStartedButton={isSidebarEmbed && isFirstIncompleteModule}
        isSelected={isSelected}
        onClick={handleClick}
        hideIndex
      />
      {isInlineEmbed && (
        <TransitionWrapper transition={transition} expanded={isSelected}>
          <StepBody
            step={isSelected ? selectedStep : moduleStep}
            theme={Theme.timeline}
            isSelected={isSelected}
          />
        </TransitionWrapper>
      )}
    </StepSeparator>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withMainStoreDispatch,
  withMainStoreData<Props, MainStoreData>(
    (state, { formFactor, module, guide }) => ({
      selectedStep: selectedStepForFormFactorSelector(state, formFactor),
      moduleStep: stepSelector(
        module?.firstIncompleteStep || guide?.firstIncompleteStep,
        state
      ),
      isFirstIncompleteModule: module
        ? guideSelector(module.guide, state)?.firstIncompleteModule ===
          module.entityId
        : false,
    })
  ),
])(TimelineModuleCard);
