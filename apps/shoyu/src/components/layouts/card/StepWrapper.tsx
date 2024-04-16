import React, { useCallback, useMemo } from 'react';
import cx from 'classnames';
import Tooltip from 'react-tooltip';
import composeComponent from 'bento-common/hocs/composeComponent';
import {
  CardStyle,
  InlineContextualGuideStyles,
  MediaOrientation,
} from 'bento-common/types';
import { isInlineEmbed } from 'bento-common/utils/formFactor';
import { pick } from 'bento-common/utils/lodash';
import { StepWrapperProps } from '../../../lib/guideRenderConfig';
import withMainStoreData from '../../../stores/mainStore/withMainStore';
import Close from '../../../icons/close.svg';
import ExtractedRichContent from '../common/ExtractedRichContent';
import withFormFactor from '../../../hocs/withFormFactor';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import { MainStoreState } from '../../../stores/mainStore/types';
import { getInlineContextPadding } from '../../../lib/helpers';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';
import { guideSelector } from '../../../stores/mainStore/helpers/selectors';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import { Guide } from 'bento-common/types/globalShoyuState';

type MainStoreData = {
  guide?: Guide;
  dispatch: MainStoreState['dispatch'];
};

type Props = StepWrapperProps &
  FormFactorContextValue &
  Pick<CustomUIProviderValue, 'inlineContextualStyle'>;

const CardStepWrapper: React.FC<Props & MainStoreData> = ({
  step,
  handleSelectedStep,
  isSelected,
  extractedNodes,
  formFactor,
  children,
  embedFormFactor,
  style,
  dispatch,
  imageWidth,
  extractedNodesContainerStyle,
  allowMarginlessImages,
  guide,
  inlineContextualStyle,
}) => {
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
      guideEntityId: step.guide,
    });
  }, [dispatch, formFactor, step]);

  return (
    <div key={step?.entityId}>
      <div
        onClick={isSelected ? undefined : handleSelectedStep}
        className="flex flex-row overflow-hidden h-full relative"
      >
        <div
          className={cx('flex gap-4 w-full h-full', {
            'flex-row-reverse':
              (style as CardStyle)?.mediaOrientation === MediaOrientation.Left,
          })}
        >
          <div className="grow">{children}</div>
          {hasExtractedNodes && (
            <div
              className="shrink-0 align-self-start"
              style={extractedNodesContainerStyle}
            >
              <ExtractedRichContent
                extractedNodes={extractedNodes!}
                width={imageWidth}
                allowMarginless={allowMarginlessImages}
                spacing={{
                  yPadding: inlineContextPadding?.t,
                }}
                {...pick((style || {}) as CardStyle, [
                  'mediaOrientation',
                  'verticalMediaAlignment',
                  'horizontalMediaAlignment',
                  'mediaFontSize',
                  'mediaTextColor',
                ])}
              />
            </div>
          )}
        </div>
      </div>
      {/* Dismiss btn */}
      {isInlineEmbed(embedFormFactor) && (style as CardStyle)?.canDismiss && (
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
              data-for="dismissCardTooltip"
              data-tip="Dismiss"
              data-test-id="card-dismiss-btn"
            >
              <span className="sr-only">Dismiss</span>
              <Close
                className="w-4 h-4"
                style={{
                  fill: (style as CardStyle).textColor,
                  stroke: (style as CardStyle).textColor,
                }}
              />
            </button>
          </div>
          <Tooltip
            id="dismissCardTooltip"
            effect="solid"
            place="top"
            delayShow={500}
            className="toggle-tooltip"
          />
        </>
      )}
    </div>
  );
};

export default composeComponent<StepWrapperProps>([
  withFormFactor,
  withCustomUIContext,
  withMainStoreData<Props, MainStoreData>((state, { step }) => {
    const guide = guideSelector(step?.guide, state);

    return {
      guide,
      dispatch: state.dispatch,
    };
  }),
])(CardStepWrapper);
