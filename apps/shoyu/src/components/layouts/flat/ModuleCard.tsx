import React from 'react';
import cx from 'classnames';

import {
  HideOnCompletionData,
  Step,
} from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';

import withMainStoreData from '../../../stores/mainStore/withMainStore';
import {
  selectedStepForFormFactorSelector,
  shouldHideCompleteModuleSelector,
  stepsSelectorOfModule,
} from '../../../stores/mainStore/helpers/selectors';
import StepBody from '../../StepBody';
import withFormFactor from '../../../hocs/withFormFactor';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import { ModuleCardProps } from '../../../lib/guideRenderConfig';
import EmojiSpacingFixWrapper from 'bento-common/components/EmojiSpacingFixWrapper';
import { ChecklistStyle } from 'bento-common/types';
import withUIState from '../../../hocs/withUIState';
import { UIState } from 'bento-common/types/shoyuUIState';
import useDelayedOn from '../../../hooks/useDelayedOn';
import { HIDE_STEP_DELAY_MS } from '../../../constants';

type OuterProps = ModuleCardProps;

type MainStoreData = {
  steps: Step[];
  shouldHideIfComplete: HideOnCompletionData;
  selectedStep: Step | undefined;
};

type Props = OuterProps &
  Pick<FormFactorContextValue, 'formFactor' | 'embedFormFactorFlags'> &
  Pick<UIState, 'showSuccess'>;

const FlatModuleCard: React.FC<Props & MainStoreData> = ({
  guide,
  theme,
  embedFormFactorFlags: { isSidebar },
  module,
  shouldHideIfComplete,
  steps,
  selectedStep,
  multiModule,
  sidebarContentWrapperRef,
}) => {
  /**
   * Delayed flag used to allow the fade out animation
   * to finish before fully removing the element from
   * the page.
   */
  const hide = useDelayedOn(
    shouldHideIfComplete.value,
    shouldHideIfComplete.delayed ? HIDE_STEP_DELAY_MS : 0
  );

  const hideStepGroupTitle =
    !isSidebar &&
    (guide?.formFactorStyle as ChecklistStyle | undefined)?.hideStepGroupTitle;

  return (
    <div
      className={cx({
        hidden: hide,
        'mb-3 last:mb-0': !hideStepGroupTitle && multiModule && module?.name,
        'mb-2 last:mb-0': hideStepGroupTitle && multiModule && module?.name,
      })}
    >
      {multiModule && module?.name && !hideStepGroupTitle && (
        <div className="text-md mb-3">
          <EmojiSpacingFixWrapper text={module.name} />
        </div>
      )}
      <div className="flex flex-col gap-2">
        {steps.map((step) => (
          <StepBody
            key={`step-${step.entityId}`}
            step={step}
            isSelected={step.entityId === selectedStep?.entityId}
            theme={theme!}
            sidebarContentWrapperRef={sidebarContentWrapperRef}
          />
        ))}
      </div>
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withUIState,
  withMainStoreData<Props, MainStoreData>(
    (state, { module, formFactor, showSuccess }) => {
      return {
        steps: stepsSelectorOfModule(module?.entityId, state),
        shouldHideIfComplete: shouldHideCompleteModuleSelector(
          state,
          module?.entityId,
          showSuccess
        ),
        selectedStep: selectedStepForFormFactorSelector(state, formFactor),
      };
    }
  ),
])(FlatModuleCard);
