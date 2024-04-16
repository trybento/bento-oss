import React, { CSSProperties, useCallback, useMemo } from 'react';
import cx from 'classnames';
import Tooltip from 'react-tooltip';
import {
  InlineContextualGuideStyles,
  MediaOrientation,
} from 'bento-common/types';
import composeComponent from 'bento-common/hocs/composeComponent';

import Close from '../../../icons/close.svg';
import { StepWrapperProps } from '../../../lib/guideRenderConfig';
import TransitionWrapper from '../../TransitionWrapper';
import ExtractedRichContent from '../common/ExtractedRichContent';
import withMainStoreData from '../../../stores/mainStore/withMainStore';
import { CarouselStyle } from '../../../graphql/schema.types';
import withFormFactor from '../../../hocs/withFormFactor';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import { MainStoreState } from '../../../stores/mainStore/types';
import { getInlineContextPadding } from '../../../lib/helpers';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import { guideSelector } from '../../../stores/mainStore/helpers/selectors';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';
import { Guide } from 'bento-common/types/globalShoyuState';

type OuterProps = StepWrapperProps;

type MainStoreData = {
  guide?: Guide;
  dispatch: MainStoreState['dispatch'];
};

type Props = OuterProps &
  MainStoreData &
  FormFactorContextValue &
  Pick<CustomUIProviderValue, 'inlineContextualStyle'>;

function CarouselStepWrapper({
  step: selectedStep,
  extractedNodes,
  transition,
  formFactor,
  children,
  style,
  dispatch,
  imageWidth,
  extractedNodesContainerStyle,
  allowMarginlessImages,
  guide,
  inlineContextualStyle,
}: React.PropsWithChildren<Props>) {
  const inlineContextPadding = useMemo(
    () =>
      getInlineContextPadding(
        guide?.formFactorStyle as InlineContextualGuideStyles,
        inlineContextualStyle
      ),
    [guide?.formFactorStyle, inlineContextualStyle]
  );

  const hasExtractedNodes = useMemo(
    () =>
      extractedNodes &&
      Object.values(extractedNodes).some((nodes) => nodes.length > 0),
    [extractedNodes]
  );

  const handleDismiss = useCallback(() => {
    dispatch({
      type: 'contextualDismissed',
      formFactor,
      guideEntityId: selectedStep.guide,
    });
  }, [dispatch, formFactor, selectedStep]);

  return (
    <div>
      <div className="flex flex-col">
        <div className={cx('grow')}>
          <TransitionWrapper
            transition={transition}
            expanded
            key={selectedStep?.entityId}
          >
            <div
              className={cx('flex gap-4 w-full h-full', {
                'pr-4': !hasExtractedNodes,
                'flex-row-reverse':
                  (style as CarouselStyle)?.mediaOrientation ===
                  MediaOrientation.Left,
              })}
            >
              <div className="grow overflow-hidden">{children}</div>
              {hasExtractedNodes && (
                <div className="shrink-0" style={extractedNodesContainerStyle}>
                  <ExtractedRichContent
                    extractedNodes={extractedNodes!}
                    width={imageWidth}
                    allowMarginless={allowMarginlessImages}
                    spacing={{
                      yPadding: inlineContextPadding?.t,
                    }}
                    mediaOrientation={
                      (style as CarouselStyle)?.mediaOrientation
                    }
                  />
                </div>
              )}
            </div>
          </TransitionWrapper>
        </div>
      </div>
      {/* Dismiss btn */}
      {(style as CarouselStyle)?.canDismiss && selectedStep && (
        <>
          <div className="absolute right-3 top-3">
            <button
              className="flex p-1 rounded-full opacity-60 hover:opacity-100 hover:shadow-sm bg-white focus:outline-none focus:ring-2"
              onClick={handleDismiss}
              role="button"
              aria-label="Dismiss"
              style={{
                // @ts-ignore TODO: is there a better way?!
                '--tw-ring-color': style.textColor,
                '--tw-bg-opacity': 0.4,
              }}
              data-for="dismissCarouselTooltip"
              data-tip="Dismiss"
              data-test-id="carousel-dismiss-btn"
            >
              <span className="sr-only">Dismiss</span>
              <Close
                className="w-4 h-4"
                style={{
                  fill: (style as CarouselStyle)
                    .textColor as CSSProperties['fill'],
                  stroke: (style as CarouselStyle)
                    .textColor as CSSProperties['stroke'],
                }}
              />
            </button>
          </div>
          <Tooltip
            id="dismissCarouselTooltip"
            effect="solid"
            place="top"
            delayShow={500}
            className="toggle-tooltip"
          />
        </>
      )}
    </div>
  );
}

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withMainStoreData<Props, MainStoreData>((state, { step }) => {
    const guide = guideSelector(step?.guide, state);

    return {
      guide,
      dispatch: state.dispatch,
    };
  }),
])(CarouselStepWrapper);
