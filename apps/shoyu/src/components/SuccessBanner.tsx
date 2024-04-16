import cx from 'classnames';
import React, { useMemo } from 'react';
import hexToRgba from 'hex-to-rgba';
import { Guide } from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';
import { Organization } from 'bento-common/types/globalShoyuState';
import {
  colorOrFallback,
  notTransparentColorOrFallback,
} from 'bento-common/utils/color';

import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import { UIStateContextValue } from '../providers/UIStateProvider';
import withCustomUIContext from '../hocs/withCustomUIContext';
import withUIState from '../hocs/withUIState';
import withMainStoreData from '../stores/mainStore/withMainStore';
import {
  availableIncompleteChecklistGuidesSelector,
  lastFinishedGuideSelector,
  leadingGuideSelector,
} from '../stores/mainStore/helpers/selectors';
import withSessionState from '../stores/sessionStore/withSessionState';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withFormFactor from '../hocs/withFormFactor';

type OuterProps = {
  /** Determines the rendering style of the banner */
  renderingStyle: 'inline' | 'overlay';
  /** Determines className addons/overrides for the wrapper element */
  className?: string;
};

type Props = OuterProps &
  WithLocationPassedProps &
  Pick<UIStateContextValue, 'showSuccess'> &
  Pick<
    CustomUIProviderValue,
    | 'backgroundColor'
    | 'isFloatingSidebar'
    | 'secondaryColorHex'
    | 'isSecondaryColorDark'
    | 'isBackgroundDark'
    | 'sidebarStyle'
  > &
  Pick<FormFactorContextValue, 'formFactor'>;

type SessionStoreData = {
  organization: Organization;
};

type MainStoreData = {
  leadingGuide: Guide | undefined;
  lastFinishedGuide: Guide | undefined;
  allGuidesCompleted: boolean;
};

type SuccessBannerProps = Props & MainStoreData & SessionStoreData;

/** Shows Guide success state */
const SuccessBanner: React.FC<SuccessBannerProps> = ({
  renderingStyle,
  className,
  showSuccess,
  backgroundColor,
  secondaryColorHex,
  isFloatingSidebar,
  isSecondaryColorDark,
  isBackgroundDark,
  leadingGuide,
  lastFinishedGuide,
  allGuidesCompleted,
  organization,
}) => {
  const show = showSuccess && !!lastFinishedGuide;
  const inlineStyle = renderingStyle === 'inline';

  const background = useMemo<string>(() => {
    const fallback = '#ffffff';

    switch (renderingStyle) {
      // This needs to use the "Onboarding background" when inline and "sidebar backgorund"
      // when sidebar, but that is already handled within CustomUIProvider as simply 'backgroundColor'.
      case 'overlay':
        return hexToRgba(
          notTransparentColorOrFallback(backgroundColor, fallback),
          0.8
        );

      case 'inline':
      default:
        return isFloatingSidebar
          ? colorOrFallback(backgroundColor, fallback)
          : secondaryColorHex;
    }
  }, [isFloatingSidebar, renderingStyle, backgroundColor, secondaryColorHex]);

  if (!show) return null;

  return (
    <div
      className={cx(
        'bento-guide-success',
        'flex',
        'justify-center',
        'items-center',
        'overflow-hidden',
        {
          'absolute top-0 left-0 w-full h-full': !inlineStyle,
          'text-gray-100': isSecondaryColorDark,
          'text-gray-900': !isSecondaryColorDark,
        },
        className
      )}
      style={{
        zIndex: inlineStyle ? undefined : 1,
        background,
        padding: isFloatingSidebar ? '19px 24px' : '25px 5px',
        color: isFloatingSidebar && isBackgroundDark ? 'white' : undefined,
        height: inlineStyle ? '11.5em' : undefined,
        transition: inlineStyle ? 'height 0.1s ease-out' : undefined,
        animation: inlineStyle ? undefined : 'fadeIn 1s',
      }}
    >
      <div
        className={cx('grid', 'text-center', 'overflow-hidden', {
          'gap-2': isFloatingSidebar,
          'gap-4': !isFloatingSidebar,
        })}
      >
        <div className="leading-5">🎉</div>
        <div
          className={cx('font-semibold', {
            'text-xl leading-7': !isFloatingSidebar,
          })}
        >
          {leadingGuide && !leadingGuide.isViewed ? 'Congrats!' : 'Nice job!'}
        </div>
        <div
          style={{
            animation: inlineStyle ? 'fadeIn 1s' : undefined,
            animationTimingFunction: inlineStyle ? 'ease-in' : undefined,
          }}
        >
          {leadingGuide && !leadingGuide.isViewed ? (
            <>
              You finished &Prime;
              <span className="completed-guide">{lastFinishedGuide!.name}</span>
              &Prime; and have unlocked the next guide.
            </>
          ) : lastFinishedGuide?.isDone && !allGuidesCompleted ? (
            <>
              You're all set to continue your journey
              {organization?.name ? ` with ${organization.name}` : ''}
            </>
          ) : (
            <>
              You completed &Prime;
              <span className="completed-guide">{lastFinishedGuide!.name}</span>
              &Prime; and are set up to reach your goals{' '}
              {organization?.name && `with ${organization.name}`}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withUIState,
  withLocation,
  withSessionState<Props, SessionStoreData>((state) => ({
    organization: state.organization!,
  })),
  withMainStoreData<Props, MainStoreData>(
    (state, { formFactor, appLocation }): MainStoreData => ({
      leadingGuide: leadingGuideSelector(state, formFactor),
      lastFinishedGuide: lastFinishedGuideSelector(state, formFactor),
      allGuidesCompleted:
        availableIncompleteChecklistGuidesSelector(
          state,
          formFactor,
          appLocation.href
        ).length === 0,
    })
  ),
])(SuccessBanner);
