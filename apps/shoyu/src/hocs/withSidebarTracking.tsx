import React, { useEffect } from 'react';
import usePrevious from 'bento-common/hooks/usePrevious';
import { GuideEntityId } from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';

import usePageVisibility from '../hooks/usePageVisibility';
import { selectedGuideForFormFactorSelector } from '../stores/mainStore/helpers/selectors';
import withMainStoreData from '../stores/mainStore/withMainStore';
import { SidebarProviderValue } from '../providers/SidebarProvider';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withFormFactor from './withFormFactor';

type OuterProps = {};

type Props = OuterProps &
  Pick<
    SidebarProviderValue,
    'isSidebarExpanded' | 'draggedPosition' | 'floatingAppPosition'
  > &
  Pick<CustomUIProviderValue, 'isFloatingSidebar'> &
  Pick<FormFactorContextValue, 'formFactor'>;

type MainStoreData = {
  guideEntityId: GuideEntityId | undefined;
};

export default function withSidebarTracking(
  WrappedComponent: React.ComponentType
) {
  const WithSidebarTracking: React.FC<Props & MainStoreData> = ({
    guideEntityId,
    ...props
  }) => {
    const { isSidebarExpanded } = props;
    const isGuideVisible = usePageVisibility() && guideEntityId;

    const previousIsSidebarExpanded = usePrevious(isSidebarExpanded);

    // Track sidebar expanded/collapsed
    useEffect(() => {
      if (
        previousIsSidebarExpanded === undefined ||
        previousIsSidebarExpanded === isSidebarExpanded ||
        !isGuideVisible
      )
        return;
    }, [isGuideVisible, isSidebarExpanded, previousIsSidebarExpanded]);

    return <WrappedComponent {...props} />;
  };
  return composeComponent<OuterProps>([
    withFormFactor,
    withMainStoreData<Props, MainStoreData>((state, { formFactor }) => ({
      guideEntityId: selectedGuideForFormFactorSelector(state, formFactor)
        ?.entityId,
    })),
  ])(WithSidebarTracking);
}
