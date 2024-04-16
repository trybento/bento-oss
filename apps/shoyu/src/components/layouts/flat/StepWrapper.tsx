import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import EmojiSpacingFixWrapper from 'bento-common/components/EmojiSpacingFixWrapper';
import composeComponent from 'bento-common/hocs/composeComponent';
import { COMPLETION_STYLE_CLASSES } from 'bento-common/utils/constants';
import { ChecklistStyle, MediaOrientation } from 'bento-common/types';
import { isInlineEmbed } from 'bento-common/utils/formFactor';
import useResizeObserver from 'bento-common/hooks/useResizeObserver';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import { throttle } from 'bento-common/utils/lodash';

import ArrowDown from '../../../icons/downArrow.svg';
import ArrowUp from '../../../icons/upArrow.svg';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';
import {
  getIsToggleCompletionDisabled,
  StepWrapperProps,
} from '../../../lib/guideRenderConfig';
import CircleIndex, { CircleIndexSize } from '../../CircleIndex';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import ExtractedRichContent from '../common/ExtractedRichContent';
import TransitionWrapper from '../../TransitionWrapper';
import withInlineEmbed from '../../../hocs/withIlnineEmbed';
import { InlineEmbedContextValue } from '../../../providers/InlineEmbedProvider';

type OuterProps = StepWrapperProps;

type Props = OuterProps &
  Pick<CustomUIProviderValue, 'stepCompletionStyle'> &
  Pick<InlineEmbedContextValue, 'isEverboardingInline'>;

const TOGGLE_SIZE_PX = '22px';

export const FlatStepWrapperComponent: React.FC<Props> = ({
  step,
  setAdditionalHeight,
  handleSelectedStep,
  handleStepCompletion,
  isSelected,
  style,
  renderedFormFactor,
  selectable,
  extractedNodes,
  children,
  stepCompletionStyle,
  transition,
  expanded,
  isEverboardingInline,
  singleStep,
  imageWidth,
  allowMarginlessImages,
  extractedNodesContainerStyle,
}) => {
  const extractedNodesCount = useMemo(
    () =>
      extractedNodes
        ? Object.entries(extractedNodes).reduce(
            (count, [, nodes]) => count + nodes.length,
            0
          )
        : 0,
    [extractedNodes]
  );

  const isToggleCompletionDisabled = useMemo(
    () => getIsToggleCompletionDisabled(step),
    [step]
  );
  const circleIndexSize = isInlineEmbed(renderedFormFactor)
    ? CircleIndexSize.xl
    : CircleIndexSize.md;

  const [headerRef, setHeaderRef] = useState<HTMLDivElement | null>(null);

  const updateAdditionalHeight = useCallbackRef(
    throttle(() => {
      if (headerRef) {
        // 8 = "mt-2" = margin between step header and content
        setAdditionalHeight(headerRef.clientHeight + 8);
      }
    }, 16),
    [setAdditionalHeight, headerRef],
    { callOnDepsChange: true }
  );

  useResizeObserver(updateAdditionalHeight, { element: headerRef });

  return (
    <div
      key={step?.entityId}
      onClick={isSelected ? undefined : handleSelectedStep}
      className={cx('flex flex-row overflow-hidden', {
        'cursor-pointer': selectable && !isSelected,
      })}
    >
      <div
        className={cx('flex gap-4 align-start w-full', {
          'flex-row-reverse':
            (style as ChecklistStyle)?.mediaOrientation ===
            MediaOrientation.Left,
        })}
      >
        {!isEverboardingInline && !singleStep && (
          <CircleIndex
            className={cx('bento-step-circular-index my-4', {
              'order-1':
                (style as ChecklistStyle)?.mediaOrientation ===
                MediaOrientation.Left,
              completed: step?.isComplete,
            })}
            index={(step?.orderIndex || 0) + 1}
            size={circleIndexSize}
            isComplete={step?.isComplete}
            onClick={
              isToggleCompletionDisabled
                ? handleSelectedStep
                : handleStepCompletion
            }
            disabled={isToggleCompletionDisabled}
          />
        )}
        <div
          className={cx('py-4', 'overflow-hidden', 'grow', 'flex', 'flex-col', {
            'pr-4': extractedNodesCount === 0,
          })}
        >
          <div
            onClick={isSelected && singleStep ? undefined : handleSelectedStep}
            className={cx(
              'bento-step-title transition truncate text-base font-semibold select-none',
              {
                'cursor-pointer': selectable && !singleStep,
                [COMPLETION_STYLE_CLASSES[stepCompletionStyle]]:
                  step?.isComplete,
              }
            )}
            ref={setHeaderRef}
          >
            <EmojiSpacingFixWrapper text={step?.name || ''} />
          </div>
          <div
            className={cx('flex-1', {
              'mt-2': expanded,
              // Smoothly remove margin in
              // sync with TransitionWrapper.
              'transition-[margin] delay-[400ms]': !expanded,
            })}
          >
            <TransitionWrapper transition={transition} expanded={expanded}>
              {children}
            </TransitionWrapper>
          </div>
        </div>
        {extractedNodes &&
          Object.values(extractedNodes).some((nodes) => nodes.length > 0) && (
            <div
              className="shrink-0 align-self-start"
              style={extractedNodesContainerStyle}
            >
              <TransitionWrapper transition={transition} expanded={expanded}>
                <ExtractedRichContent
                  extractedNodes={extractedNodes}
                  width={imageWidth}
                  allowMarginless={allowMarginlessImages}
                  mediaOrientation={(style as ChecklistStyle)?.mediaOrientation}
                />
              </TransitionWrapper>
            </div>
          )}
        {!isInlineEmbed && !singleStep && (
          <div
            className="my-4 cursor-pointer justify-self-end shrink-0"
            onClick={handleSelectedStep}
            style={{
              width: TOGGLE_SIZE_PX,
              height: TOGGLE_SIZE_PX,
            }}
          >
            {isSelected ? <ArrowUp /> : <ArrowDown />}
          </div>
        )}
      </div>
    </div>
  );
};

export default composeComponent<OuterProps>([
  withCustomUIContext,
  withInlineEmbed,
])(FlatStepWrapperComponent);
