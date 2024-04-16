import React, { CSSProperties, useCallback, useMemo } from 'react';
import cx from 'classnames';
import Tooltip from 'react-tooltip';
import composeComponent from 'bento-common/hocs/composeComponent';
import Close from '../../../icons/close.svg';
import { StepWrapperProps } from '../../../lib/guideRenderConfig';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';
import withMainStoreData from '../../../stores/mainStore/withMainStore';
import withFormFactor from '../../../hocs/withFormFactor';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import { MainStoreState } from '../../../stores/mainStore/types';
import {
  selectedGuideForFormFactorSelector,
  stepSelector,
  stepsSelectorOfGuide,
} from '../../../stores/mainStore/helpers/selectors';
import { SingleNodeRenderer } from '../../../system/RichTextEditor/SlateContentRenderer';
import { isVideoNode } from 'bento-common/utils/bodySlate';
import {
  InlineContextualGuideStyles,
  VideoGalleryStyle,
} from 'bento-common/types';
import { Guide, Step } from 'bento-common/types/globalShoyuState';
import { getInlineContextPadding } from '../../../lib/helpers';

type OuterProps = StepWrapperProps;

type MainStoreData = {
  dispatch: MainStoreState['dispatch'];
  steps: Step[];
  guide: Guide | undefined;
};

type Props = OuterProps &
  MainStoreData &
  FormFactorContextValue &
  Pick<
    CustomUIProviderValue,
    'secondaryColorHex' | 'primaryColorHex' | 'inlineContextualStyle'
  >;

function VideoGalleryStepWrapper({
  guide,
  step: selectedStep,
  steps,
  formFactor,
  style,
  dispatch,
  primaryColorHex,
  secondaryColorHex,
  renderedFormFactorFlags: { isInline: isInlineRendered },
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

  const isSmall = !isInlineRendered;

  const stepSelectedHandlers = useMemo(
    () =>
      Object.fromEntries(
        steps.map((step) => [
          step.entityId,
          (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            const isSelected = step.entityId === selectedStep?.entityId;
            if (isSelected) return;
            dispatch({
              type: 'stepSelected',
              step: step.entityId,
              formFactor,
            });
          },
        ])
      ),
    [dispatch, steps, selectedStep?.entityId]
  );

  const handleDismiss = useCallback(() => {
    dispatch({
      type: 'contextualDismissed',
      formFactor,
      guideEntityId: selectedStep.guide,
    });
  }, [dispatch, formFactor, selectedStep]);

  const selectedVideo = {
    ...selectedStep.bodySlate[0],
    width: '100%',
    height: '100%',
  };

  const { canDismiss, textColor, selectedBackgroundColor, statusLabelColor } =
    (style || {}) as VideoGalleryStyle;

  return (
    <div>
      <div
        className="flex flex-col"
        style={{
          color: textColor,
          paddingLeft: inlineContextPadding?.l,
          paddingRight: inlineContextPadding?.r,
          paddingBottom: inlineContextPadding?.b,
          paddingTop: inlineContextPadding?.t,
        }}
      >
        {guide?.name && (
          <div className="text-xl font-semibold mb-4">{guide.name}</div>
        )}

        <div
          className={cx('flex', {
            'flex-row': !isSmall,
            'flex-col': isSmall,
          })}
        >
          <SingleNodeRenderer className="flex-1" node={selectedVideo} />
          <div className={cx('relative', { 'w-80': !isSmall })}>
            <div
              className={cx('w-full h-full', {
                'flex overflow-x-auto': isSmall,
                'absolute overflow-y-auto': !isSmall,
              })}
            >
              {steps.map((step) => {
                const isSelected = selectedStep.entityId === step.entityId;
                const isNext = selectedStep.nextStep === step.entityId;
                const videoNode = step.bodySlate[0];

                if (!isVideoNode(videoNode)) return null;

                return (
                  <div
                    className={cx('px-2 py-1.5 flex flex-row gap-2', {
                      'flex-none w-80': isSmall,
                      'cursor-pointer': !isSelected,
                      'cursor-default': isSelected,
                    })}
                    key={step.entityId}
                    style={{
                      background: isSelected
                        ? selectedBackgroundColor || secondaryColorHex
                        : undefined,
                    }}
                    onClick={stepSelectedHandlers[step.entityId]}
                  >
                    <SingleNodeRenderer
                      className="w-32"
                      node={{ ...videoNode, thumbnailOnly: true }}
                    />
                    <div className="flex flex-col flex-1 gap-1 font-semibold">
                      <div
                        style={{
                          fontSize: '10px',
                          color: statusLabelColor || primaryColorHex,
                        }}
                      >
                        {isSelected ? 'Playing' : isNext ? 'Next' : null}
                        &nbsp;
                      </div>
                      <div className="text-xs line-clamp-2" title={step.name}>
                        {step.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Dismiss btn */}
      {canDismiss && selectedStep && (
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
              data-for="dismissVideoGalleryTooltip"
              data-tip="Dismiss"
              data-test-id="video-gallery-dismiss-btn"
            >
              <span className="sr-only">Dismiss</span>
              <Close
                className="w-4 h-4"
                style={{
                  fill: textColor as CSSProperties['fill'],
                  stroke: textColor as CSSProperties['stroke'],
                }}
              />
            </button>
          </div>
          <Tooltip
            id="dismissVideoGalleryTooltip"
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
  withCustomUIContext,
  withFormFactor,
  withMainStoreData<Props, MainStoreData>((state, { formFactor, step }) => {
    const guide = selectedGuideForFormFactorSelector(state, formFactor);

    return {
      guide,
      step: step || stepSelector(guide?.steps?.[0], state),
      dispatch: state.dispatch,
      steps: stepsSelectorOfGuide(guide?.entityId, state),
    };
  }),
])(VideoGalleryStepWrapper);
