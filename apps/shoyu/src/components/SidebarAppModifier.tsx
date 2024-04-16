import React, { useEffect, useState } from 'react';
import useDomObserver from 'bento-common/hooks/useDomObserver';
import composeComponent from 'bento-common/hocs/composeComponent';
import useAutoUpdatingRef from 'bento-common/hooks/useAutoUpdatingRef';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import { debounce } from 'bento-common/utils/lodash';

import withCustomUIContext from '../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';

type Props = {
  isSidebarExpanded: boolean;
  sidebarWidth: number;
  containerIdentifier?: string;
};

const SidebarAppModifier: React.FC<
  Props & Pick<CustomUIProviderValue, 'sidebarSide' | 'appContainerIdentifier'>
> = ({
  isSidebarExpanded,
  sidebarWidth,
  sidebarSide,
  appContainerIdentifier,
}) => {
  const [mainContainer, setMainContainer] = useState<HTMLElement | null>();
  const mainContainerRef = useAutoUpdatingRef(mainContainer);
  const sidebarSideRef = useAutoUpdatingRef(sidebarSide);

  const updateMainContainer = useCallbackRef(
    debounce(() => {
      setMainContainer(
        appContainerIdentifier
          ? (document.querySelector(
              appContainerIdentifier!
            ) as HTMLElement | null)
          : document.body
      );
    }, 250),
    [appContainerIdentifier],
    { callOnDepsChange: true }
  );

  useEffect(() => {
    if (mainContainer) {
      if (sidebarSide === 'right') {
        // Temprarily only for 'right' side to prevent flickering.
        mainContainer.style.transition =
          'width 1.2s cubic-bezier(0.1, 0.9, 0.32, 1)';
      }
      if (isSidebarExpanded) {
        // TODO: Add smooth transition for left side.
        if (sidebarSide === 'left') {
          mainContainer.style.position = 'relative';
          mainContainer.style.marginLeft = 'auto';
        }

        mainContainer.style.width = `calc(100% - ${sidebarWidth}px)`;
        mainContainer.style.overflowX = 'auto';
      } else {
        mainContainer.style.width = '100%';
        mainContainer.style.overflowX = '';

        if (sidebarSide === 'left') {
          mainContainer.style.position = '';
          mainContainer.style.left = '';
        }
      }
    }
    return () => {
      if (mainContainer) {
        mainContainer.style.position = '';
        mainContainer.style.left = '';
        mainContainer.style.width = '';
      }
    };
  }, [isSidebarExpanded, sidebarWidth, sidebarSide, mainContainer]);

  useEffect(
    () => () => {
      if (mainContainerRef.current && sidebarSideRef.current === 'right') {
        mainContainerRef.current.style.transition = '';
      }
    },
    []
  );

  useDomObserver(updateMainContainer, {
    disabled: !appContainerIdentifier,
  });

  return null;
};

export default composeComponent<Props>([withCustomUIContext])(
  SidebarAppModifier
);
