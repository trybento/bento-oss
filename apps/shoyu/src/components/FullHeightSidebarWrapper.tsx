import React, { useState } from 'react';
import cx from 'classnames';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import composeComponent from 'bento-common/hocs/composeComponent';
import { SidebarStyle } from 'bento-common/types';
import useResizeObserver from 'bento-common/hooks/useResizeObserver';
import { throttle } from 'bento-common/utils/lodash';

import withCustomUIContext from '../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import { SidebarProviderValue } from '../providers/SidebarProvider';
import SidebarAppModifier from './SidebarAppModifier';
import { HOSTED_GUIDE_SIDEBAR_WIDTH_PX } from '../lib/sidebarConstants';
import { SIDEBAR_Z_INDEX } from '../lib/constants';
import withSidebarContext from '../hocs/withSidebarContext';
import SidebarToggleTab from './SidebarToggleTab';
import { SidebarWrapperProps } from '../lib/sidebarTypes';

type OuterProps = SidebarWrapperProps;
type Props = OuterProps &
  Pick<
    CustomUIProviderValue,
    'fontColorHex' | 'backgroundColor' | 'sidebarSide' | 'sidebarStyle'
  > &
  Pick<SidebarProviderValue, 'isSidebarExpanded'>;

function FullHeightSidebarWrapper({
  children,
  fontColorHex,
  backgroundColor,
  sidebarSide,
  sidebarStyle,
  isSidebarExpanded,
  emphasizeToggle,
}: React.PropsWithChildren<Props>) {
  const isSidebarOnRight = sidebarSide === 'right';
  const [sidebarRef, setSidebarRef] = useState<HTMLDivElement | null>();
  const [sidebarWidth, setSidebarWidth] = useState<number>();

  const updateSidebarWidth = useCallbackRef(
    throttle(
      () => setSidebarWidth(sidebarRef?.getBoundingClientRect()?.width),
      100
    ),
    [sidebarRef]
  );

  useResizeObserver(updateSidebarWidth, { element: sidebarRef });

  return (
    <>
      {sidebarStyle === SidebarStyle.sideBySide && sidebarWidth && (
        <SidebarAppModifier
          isSidebarExpanded={isSidebarExpanded}
          sidebarWidth={sidebarWidth}
        />
      )}
      <div
        ref={setSidebarRef}
        className={cx(
          'flex',
          'flex-col',
          'fixed',
          'h-full',
          'top-0',
          'bg-white',
          'bento-sidebar-shadow',
          'bento-sidebar-wrapper',
          {
            'right-0': isSidebarOnRight,
            'left-0': !isSidebarOnRight,
            'translate-x-0': isSidebarExpanded,
            'translate-x-full': !isSidebarExpanded && isSidebarOnRight,
            '-translate-x-full': !isSidebarExpanded && !isSidebarOnRight,
          }
        )}
        style={{
          ...(fontColorHex ? { color: fontColorHex } : {}),
          ...(backgroundColor ? { backgroundColor } : {}),
          width: `${HOSTED_GUIDE_SIDEBAR_WIDTH_PX}px`,
          transition: 'all 1.2s cubic-bezier(0.1, 0.9, 0.32, 1)',
          zIndex: SIDEBAR_Z_INDEX,
        }}
      >
        {children}
        <SidebarToggleTab isEmphasized={emphasizeToggle} />
      </div>
    </>
  );
}

export default composeComponent<OuterProps>([
  withCustomUIContext,
  withSidebarContext,
])(FullHeightSidebarWrapper);
