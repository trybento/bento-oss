import React, { useCallback, useEffect } from 'react';
import cx from 'classnames';
import { StepState } from 'bento-common/types/globalShoyuState';
import withMainStoreData from '../stores/mainStore/withMainStore';
import {
  selectedGuideForFormFactorSelector,
  lastSerialCyoaInfoSelector,
} from '../stores/mainStore/helpers/selectors';
import { MainStoreState } from '../stores/mainStore/types';
import { px } from '../lib/helpers';
import { Theme } from 'bento-common/types';
import StepBody from './StepBody';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import composeComponent from 'bento-common/hocs/composeComponent';
import withFormFactor from '../hocs/withFormFactor';
import withCustomUIContext from '../hocs/withCustomUIContext';
import { allowedGuideTypesSettings } from 'bento-common/data/helpers';
import { SidebarVisibility } from 'bento-common/types/shoyuUIState';

type OuterProps = {};

type Props = OuterProps &
  Pick<FormFactorContextValue, 'formFactor'> &
  Pick<CustomUIProviderValue, 'orgTheme' | 'sidebarVisibility'>;

type MainStoreData = {
  dispatch: MainStoreState['dispatch'];
  serialCyoaData: ReturnType<typeof lastSerialCyoaInfoSelector>;
  theme: Theme | undefined;
};

/**
 * Used to determine if the current serial CYOA
 * should show under Resource center.
 */
export const shouldShowSerialCYOA = (
  serialCyoaData: ReturnType<typeof lastSerialCyoaInfoSelector>,
  sidebarVisibility: SidebarVisibility | undefined,
  formFactor: string
): boolean =>
  !!(
    serialCyoaData.guide &&
    serialCyoaData.total !== serialCyoaData.incomplete &&
    !serialCyoaData.branchInProgress &&
    serialCyoaData.step &&
    !serialCyoaData.isFinished &&
    allowedGuideTypesSettings(sidebarVisibility, formFactor).cyoa
  );

const CYOAPath: React.FC<Props & MainStoreData> = ({
  serialCyoaData,
  dispatch,
  formFactor,
  sidebarVisibility,
  theme,
}) => {
  const { guide, step } = serialCyoaData;

  const shouldShow = shouldShowSerialCYOA(
    serialCyoaData,
    sidebarVisibility,
    formFactor
  );

  useEffect(() => {
    if (!guide?.isComplete && shouldShow) {
      dispatch({
        type: 'stepSelected',
        formFactor,
        step: guide?.firstIncompleteStep,
      });
    }
  }, [guide, shouldShow]);

  const handleDismiss = useCallback(() => {
    if (serialCyoaData.dismissDisabled) return;
    dispatch({
      type: 'stepChanged',
      step: {
        entityId: step!.entityId,
        state: StepState.skipped,
      },
    });
  }, [step?.entityId, serialCyoaData.dismissDisabled]);

  if (!shouldShow) return null;

  return (
    <div className="mb-6">
      <div
        className={cx(
          'transition-all',
          'duration-500',
          'overflow-hidden',
          'pb-4'
        )}
        style={{ maxHeight: px(1000) }}
      >
        <StepBody step={step} theme={theme!} isSelected />
        {serialCyoaData.complete > 0 && !serialCyoaData.dismissDisabled && (
          <div
            className="text-xs hover:opacity-80 cursor-pointer"
            onClick={handleDismiss}
          >
            Hide / Dismiss
          </div>
        )}
      </div>
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withMainStoreData<Props, MainStoreData>((state, { formFactor, orgTheme }) => {
    return {
      dispatch: state.dispatch,
      serialCyoaData: lastSerialCyoaInfoSelector(state, formFactor),
      theme:
        selectedGuideForFormFactorSelector(state, formFactor)?.theme ||
        orgTheme,
    };
  }),
])(CYOAPath);
