import cx from 'classnames';
import React, { useContext, useMemo, useState } from 'react';
import {
  EmbedTypenames,
  Organization,
  Step,
} from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import {
  GuideFormFactor,
  StepCtaSettings,
  StepCtaStyle,
} from 'bento-common/types';
import {
  getButtonClickUrlTarget,
  getDefaultCtaSetting,
  parseCtaColors,
} from 'bento-common/data/helpers';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';

import UIButton from './shared/UIButton';
import { SidebarContext } from '../../../../providers/SidebarProvider';
import { getNodeStyle } from '../helpers';
import { CustomUIProviderValue } from '../../../../providers/CustomUIProvider';
import withMainStoreData from '../../../../stores/mainStore/withMainStore';
import withFormFactor from '../../../../hocs/withFormFactor';
import {
  guideSelector,
  selectedStepForFormFactorSelector,
} from '../../../../stores/mainStore/helpers/selectors';
import { FormFactorContextValue } from '../../../../providers/FormFactorProvider';
import { MainStoreState } from '../../../../stores/mainStore/types';
import { handleButtonClickUrl } from '../../../../lib/helpers';
import withCustomUIContext from '../../../../hocs/withCustomUIContext';
import { buttonToCta } from '../../../../components/layouts/common/StepControls';
import { getFormFactorFlags } from '../../../../lib/formFactors';
import {
  ButtonElement,
  SlateRendererProps,
  TextNode,
} from 'bento-common/types/slate';
import withSessionState from '../../../../stores/sessionStore/withSessionState';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';
import { AirTrafficStore } from '../../../../stores/airTrafficStore/types';
import withAirTrafficState from '../../../../stores/airTrafficStore/withAirTrafficState';

export enum ButtonNodeVariations {
  link = 'link',
}

type OuterProps = SlateRendererProps & {
  node: ButtonElement;
  onClick?: (e: React.MouseEvent) => void;
  [additionalProp: string]: any;
};

type SessionStoreData = {
  organization: Organization;
};

type AirTrafficData = Pick<AirTrafficStore, 'startJourney'>;

type BeforeAirTrafficData = OuterProps &
  WithLocationPassedProps &
  Pick<
    FormFactorContextValue & CustomUIProviderValue,
    | 'primaryColorHex'
    | 'secondaryColorHex'
    | 'fontColorHex'
    | 'additionalColors'
  > &
  SessionStoreData;

type MainStoreData = {
  step: Step;
  dispatch: MainStoreState['dispatch'];
  ctaColors: ReturnType<typeof parseCtaColors>;
  ctaStyle: StepCtaStyle;
  settings: StepCtaSettings;
};

type BeforeMainStoreData = BeforeAirTrafficData & AirTrafficData;

export type ButtonProps = BeforeMainStoreData & MainStoreData;

const Button: React.FC<ButtonProps & MainStoreData> = ({
  node,
  onClick,
  as,
  narrow,
  fullWidth,
  noMargin,
  ctaColors,
  organization,
  ctaStyle,
  settings,
  formFactor,
  step,
  appLocation,
  startJourney,
}) => {
  const [divRef, setDivRef] = useState<HTMLDivElement | null>(null);
  const { isTooltip, isBanner, isModal, isSidebar } =
    getFormFactorFlags(formFactor);
  const isAnnouncement = isModal || isBanner;

  const isLink = ctaStyle === StepCtaStyle.link;
  const isOutline = ctaStyle === StepCtaStyle.outline;
  const isSolid = ctaStyle === StepCtaStyle.solid;

  const parentColor = useMemo(
    () =>
      divRef?.parentElement
        ? getComputedStyle(divRef.parentElement as Element).color
        : undefined,
    [divRef]
  );

  const style = {
    ...getNodeStyle(node),
    color: isSolid ? ctaColors.color : ctaColors.background,
    background: isSolid ? ctaColors.background || parentColor : 'transparent',
    borderColor: isOutline ? ctaColors.background || 'currentcolor' : undefined,
  };

  const { setIsSidebarExpanded, setSidebarOpenForLater } =
    useContext(SidebarContext);

  const url = node.url;
  const clickMessage = node.clickMessage;
  const shouldCollapseSidebar = !!node?.shouldCollapseSidebar;
  const deprecatedButtonText = (node.children?.[0] as TextNode)?.text;
  const buttonText = node.buttonText || deprecatedButtonText;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    let actionsDelay = 0;

    if (shouldCollapseSidebar) {
      actionsDelay = 200;
      setIsSidebarExpanded(false);
    }

    if (clickMessage) {
      document.dispatchEvent(
        new CustomEvent('bento-buttonClicked', {
          detail: {
            message: clickMessage,
          },
        })
      );
    } else {
      // Allow sidebar to be collapsed before executing further actions.
      setTimeout(() => {
        clickActions(e);
      }, actionsDelay);
    }
  };

  const clickActions = useCallbackRef(
    (e: React.MouseEvent) => {
      if (onClick) {
        onClick(e);
      } else if (url) {
        const opensInNewTab =
          settings.opensInNewTab === undefined
            ? getButtonClickUrlTarget(url, organization.domain) === '_blank'
            : settings.opensInNewTab;

        if (window) {
          // NOTE: this logic is copied between here and the step CTA renderer
          // (system/StepCta.tsx) so when modifying this you should also modify that
          // Expand sidebar if button was pressed in the inline embeddable and href is different.
          if (!shouldCollapseSidebar && window.location.href !== url) {
            setSidebarOpenForLater();

            if (step) {
              startJourney({
                type: EmbedTypenames.guide,
                selectedGuide: step.guide,
                selectedModule: step.module,
                selectedStep: step.entityId,
                selectedPageUrl: url,
                endingCriteria: {
                  closeSidebar: isSidebar,
                  navigateAway: true,
                },
              });
            }
          }
          handleButtonClickUrl(url, appLocation.href, opensInNewTab);
        }
      }
    },
    [
      step,
      settings,
      onClick,
      url,
      shouldCollapseSidebar,
      organization.domain,
      appLocation.href,
    ]
  );

  return (
    <div className="w-full" ref={setDivRef}>
      {as === ButtonNodeVariations.link ? (
        <div
          className="cursor-pointer h-full flex"
          onClick={handleClick}
          style={{ ...style }}
        >
          <div className="my-auto font-semibold">{buttonText}</div>
        </div>
      ) : (
        <UIButton
          className={cx({
            'font-semibold': !isLink,
            'text-right': isLink,
            'first:pl-0': isLink,
            border: isOutline,
            'px-0': isLink && (isTooltip || isAnnouncement),
            'px-4': !isLink,
            'py-1': isBanner,
            underline: isLink && isBanner,
          })}
          onClick={handleClick}
          style={style}
          narrow={narrow}
          fullWidth={fullWidth}
          noMargin={noMargin}
        >
          {buttonText}
        </UIButton>
      )}
    </div>
  );
};

export default composeComponent<OuterProps>([
  withLocation,
  withFormFactor,
  withCustomUIContext,
  withSessionState<ButtonProps, SessionStoreData>((state) => ({
    organization: state.organization!,
  })),
  withAirTrafficState<BeforeAirTrafficData, AirTrafficData>(
    ({ startJourney }): AirTrafficData => ({
      startJourney,
    })
  ),
  withMainStoreData<BeforeMainStoreData, MainStoreData>(
    (
      state,
      {
        formFactor,
        embedFormFactor,
        node,
        primaryColorHex,
        additionalColors,
        secondaryColorHex,
        fontColorHex,
      }
    ) => {
      // Fallback to legacy since Button nodes haven't had styling before.
      const settings =
        node.settings || getDefaultCtaSetting(GuideFormFactor.legacy);
      const style = node.style || StepCtaStyle.solid;
      const step = selectedStepForFormFactorSelector(state, formFactor)!;

      return {
        step,
        dispatch: state.dispatch,
        ctaColors: parseCtaColors(
          buttonToCta({ ...node, settings, style }, embedFormFactor),
          formFactor as GuideFormFactor,
          guideSelector(step?.guide, state)?.formFactorStyle,
          {
            primaryColorHex,
            additionalColors,
            secondaryColorHex,
            fontColorHex,
          }
        ),
        ctaStyle: style,
        settings,
      };
    }
  ),
])(Button);
