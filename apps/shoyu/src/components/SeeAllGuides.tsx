import React, { useCallback } from 'react';
import { stopEvent } from 'bento-common/utils/dom';
import ArrowLeft from 'bento-common/icons/ArrowLeft';
import composeComponent from 'bento-common/hocs/composeComponent';
import { UIStateContextValue } from '../providers/UIStateProvider';
import withUIState from '../hocs/withUIState';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';
import withFormFactor from '../hocs/withFormFactor';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withCustomUIContext from '../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import {
  isEverboarding,
  showResourceCenterInline,
} from 'bento-common/data/helpers';
import withMainStoreData from '../stores/mainStore/withMainStore';
import { Guide } from 'bento-common/types/globalShoyuState';
import { selectedGuideForFormFactorSelector } from '../stores/mainStore/helpers/selectors';

type OuterProps = { action: SeeAllGuidesAction };

type Props = OuterProps &
  Pick<UIStateContextValue, 'uiActions'> &
  CustomUIProviderValue &
  WithLocationPassedProps &
  Pick<FormFactorContextValue, 'formFactor'>;

type MainStoreData = {
  guide: Guide | undefined;
};

export enum SeeAllGuidesAction {
  back = 'back',
  showActiveGuides = 'showActiveGuides',
}

/**
 * Currently used for Inline to handle special cases like inline embeds, cards
 */
const SeeAllGuides: React.FC<Props & MainStoreData> = ({
  uiActions,
  inlineEmptyBehaviour,
  action,
  guide,
}) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      e.preventDefault();
      action === SeeAllGuidesAction.back
        ? uiActions.handleBack()
        : uiActions.handleShowActiveGuides();
    },
    [action, uiActions]
  );

  const rcAllowed = showResourceCenterInline(inlineEmptyBehaviour);

  /**
   * Don't show the back button if any of the following are true:
   *
   * - We're previewing a guide
   * - We're viewing an everboarding guide
   * - The organization has the resource center set to sidebar only
   */
  if (guide?.isPreview || isEverboarding(guide?.designType) || !rcAllowed) {
    return null;
  }

  return (
    <div className="w-6 h-6 flex items-center justify-center">
      <ArrowLeft
        className="h-5 w-5 transition hover:opacity-60 fill-current cursor-pointer"
        onClick={handleClick}
        onMouseDown={stopEvent}
      />
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withUIState,
  withLocation,
  withMainStoreData<Props, MainStoreData>((state, { formFactor }) => {
    return {
      guide: selectedGuideForFormFactorSelector(state, formFactor),
    };
  }),
])(SeeAllGuides);
