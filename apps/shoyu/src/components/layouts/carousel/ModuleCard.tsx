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

const CarouselModuleCard: React.FC<Props & MainStoreData> = ({
  module,
  selectedStep,
  moduleStep,
  formFactor,
  embedFormFactorFlags: { isInline: isInlineEmbed, isSidebar: isSidebarEmbed },
  transition,
  isSelected,
  dispatch,
  isFirstIncompleteModule,
}) => {
  const handleClick = useCallback(() => {
    if (isSidebarEmbed) {
      dispatch({
        type: 'stepSelected',
        step: module?.firstIncompleteStep || module?.steps![0],
        formFactor,
      });
    } else {
      dispatch({
        type: 'moduleSelected',
        module: isSelected ? undefined : module?.entityId,
        formFactor,
      });
    }
  }, [module, isSelected]);

  return (
    <StepSeparator
      theme={Theme.carousel}
      isComplete={false}
      entityId={undefined}
      isSelected={isSelected}
      enabled
      className={isInlineEmbed ? 'pointer-cursor' : undefined}
    >
      <CommonModuleHeader
        module={module}
        theme={Theme.carousel}
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
            theme={Theme.carousel}
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
  withMainStoreData<Props, MainStoreData>((state, { formFactor, module }) => ({
    selectedStep: selectedStepForFormFactorSelector(state, formFactor),
    moduleStep: stepSelector(module?.firstIncompleteStep, state),
    isFirstIncompleteModule:
      guideSelector(module?.guide, state)?.firstIncompleteModule ===
      module?.entityId,
  })),
])(CarouselModuleCard);
