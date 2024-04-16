import React, { useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import Tooltip from 'react-tooltip';

import ResetArrow from '../icons/reset.svg';
import { canResetOnboardingSelector } from '../stores/mainStore/helpers/selectors';
import withMainStoreData from '../stores/mainStore/withMainStore';
import composeComponent from 'bento-common/hocs/composeComponent';
import Link from './Link';
import { MainStoreState } from '../stores/mainStore/types';
import withFormFactor from '../hocs/withFormFactor';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import useRandomKey from 'bento-common/hooks/useRandomKey';
import ReactDOM from 'react-dom';

type OuterProps = React.AnchorHTMLAttributes<{}>;

type Props = OuterProps & Pick<FormFactorContextValue, 'formFactor'>;

type MainStoreData = {
  show: boolean;
  dispatch?: MainStoreState['dispatch'];
};

export const ResetOnboardingComponent: React.FC<Props & MainStoreData> = ({
  formFactor,
  show,
  className,
  onClick,
  dispatch,
  ...props
}) => {
  const [ref, setRef] = useState<HTMLAnchorElement | null>(null);
  const isOnboardingReset = useMemo(() => !onClick, [onClick]);
  const resetOnboarding = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      } else {
        dispatch?.({ type: 'onboardingReset', formFactor });
      }
    },
    [onClick, dispatch]
  );

  const tooltipId = useRandomKey();
  return show ? (
    <>
      <Link
        ref={setRef}
        data-for={tooltipId}
        data-tip="This guide was launched for you based on your earlier selection. You can reset your choice."
        className={cx(
          'font-normal',
          'select-none',
          'text-sm',
          'flex',
          'gap-1',
          'items-center',
          'whitespace-nowrap',
          className
        )}
        onClick={resetOnboarding}
        {...props}
      >
        <>
          <ResetArrow className="mb-1 w-3 mt-1" />
          <span>Reset my choice</span>
          {!!ref &&
            isOnboardingReset &&
            ReactDOM.createPortal(
              <Tooltip
                id={tooltipId}
                effect="solid"
                place="top"
                delayShow={500}
                className="toggle-tooltip"
              />,
              ref.getRootNode() as Element
            )}
        </>
      </Link>
    </>
  ) : null;
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withMainStoreData<Props, MainStoreData>((state, { formFactor }) => ({
    show: canResetOnboardingSelector(state, formFactor),
    dispatch: state.dispatch,
  })),
])(ResetOnboardingComponent);
