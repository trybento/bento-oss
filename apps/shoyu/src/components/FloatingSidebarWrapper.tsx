import React, { useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import composeComponent from 'bento-common/hocs/composeComponent';
import { pxToNumber } from 'bento-common/frontend/htmlElementHelpers';

import useFloatingElement, {
  FloatingElementUIPosition,
  WINDOW_PADDING_PX,
} from '../hooks/useFloatingElement';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import { SidebarProviderValue } from '../providers/SidebarProvider';
import { px } from '../lib/helpers';
import { SIDEBAR_Z_INDEX } from '../lib/constants';
import withSidebarContext from '../hocs/withSidebarContext';
import withCustomUIContext from '../hocs/withCustomUIContext';
import SidebarToggleTab from './SidebarToggleTab';
import { SidebarWrapperProps } from '../lib/sidebarTypes';
import { SIDEBAR_OVERLAY_Z_INDEX } from '../lib/sidebarConstants';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withFormFactor from '../hocs/withFormFactor';
import withUIState from '../hocs/withUIState';
import { UIStateContextValue } from '../providers/UIStateProvider';
import { isKbArticleView } from 'bento-common/frontend/shoyuStateHelpers';

const HEIGHT = '580px';
const WIDTH = '435px';
const FADE_DELAY_SECONDS = 0.5;
const OVERLAY_MESSAGE_WIDTH = 185;

type OuterProps = SidebarWrapperProps;

type Props = OuterProps &
  Pick<
    CustomUIProviderValue,
    | 'sidebarSide'
    | 'fontColorHex'
    | 'floatingAnchorXOffset'
    | 'floatingAnchorYOffset'
    | 'floatingDragDisabled'
  > &
  Pick<
    SidebarProviderValue,
    'isSidebarExpanded' | 'setDraggedPosition' | 'setFloatingAppPosition'
  > &
  Pick<FormFactorContextValue, 'formFactor'> &
  Pick<UIStateContextValue, 'view'>;

const FloatingSidebarWrapper: React.FC<Props> = ({
  formFactor,
  sidebarSide,
  fontColorHex,
  floatingAnchorXOffset,
  floatingAnchorYOffset,
  floatingDragDisabled,
  children,
  isSidebarExpanded,
  setDraggedPosition,
  setFloatingAppPosition,
  isOverlayDisplayed,
  handleDismissOverlay,
  emphasizeToggle,
  headerRef,
  container,
  view,
}) => {
  const isSidebarOnRight = sidebarSide === 'right';
  const [floatingContainerRef, setFloatingContainerRef] =
    useState<HTMLDivElement | null>(null);

  const show = isSidebarExpanded && container !== null;

  const draggedPosition = useFloatingElement({
    disabled: floatingDragDisabled,
    dragTriggerElement: headerRef,
    draggableIdentifier: formFactor,
    draggableElement: floatingContainerRef,
    resetTriggers: [isSidebarExpanded, floatingDragDisabled],
    uiPosition: isSidebarOnRight
      ? FloatingElementUIPosition.bottomRight
      : FloatingElementUIPosition.bottomLeft,
    xAnchorOffset: floatingAnchorXOffset,
    yAnchorOffset: floatingAnchorYOffset,
    container,
  });

  const height = useMemo(
    () =>
      isKbArticleView(view)
        ? `${draggedPosition.windowHeight - WINDOW_PADDING_PX * 2}px`
        : draggedPosition.windowHeight - 2 * WINDOW_PADDING_PX >=
          pxToNumber(HEIGHT)
        ? HEIGHT
        : px(draggedPosition.windowHeight - 2 * WINDOW_PADDING_PX),
    [draggedPosition.windowHeight, view]
  );

  useEffect(() => {
    if (draggedPosition) {
      setFloatingAppPosition(draggedPosition);
    }
    setDraggedPosition(draggedPosition);
  }, [draggedPosition]);

  return (
    <>
      <div
        ref={setFloatingContainerRef}
        onMouseDown={isOverlayDisplayed ? handleDismissOverlay : undefined}
        className="fixed bento-floating-app-wrapper"
        style={{
          zIndex: show ? SIDEBAR_Z_INDEX : -1,
          width: WIDTH,
          opacity: show ? 1 : 0,
          transition: `opacity ${FADE_DELAY_SECONDS}s ease`,
          ...draggedPosition,
        }}
      >
        {isOverlayDisplayed && !floatingDragDisabled && (
          <div
            className={cx(
              'absolute text-white font-semibold text-lg cursor-pointer',
              { 'text-left': !isSidebarOnRight, 'text-right': isSidebarOnRight }
            )}
            style={{
              zIndex: SIDEBAR_OVERLAY_Z_INDEX + 1,
              width: px(OVERLAY_MESSAGE_WIDTH),
              left: isSidebarOnRight ? px(-OVERLAY_MESSAGE_WIDTH - 20) : 'auto',
              right: !isSidebarOnRight
                ? px(-OVERLAY_MESSAGE_WIDTH - 20)
                : 'auto',
              top: 0,
              userSelect: 'none',
            }}
            onClick={handleDismissOverlay}
          >
            Click to drag anywhere on the page
          </div>
        )}
        <div
          className="bento-floating-app rounded-lg shadow-md overflow-hidden w-full flex flex-col"
          style={{
            color: fontColorHex ? fontColorHex : 'inherit',
            transition: 'height 0.5s ease-in-out',
            height,
          }}
        >
          {children}
        </div>
      </div>
      <div
        className={cx('fixed h-full top-0', {
          'right-0': isSidebarOnRight,
          'left-0': !isSidebarOnRight,
        })}
        style={{ zIndex: SIDEBAR_Z_INDEX }}
      >
        <SidebarToggleTab isEmphasized={emphasizeToggle} />
      </div>
    </>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withUIState,
  withSidebarContext,
])(FloatingSidebarWrapper);
