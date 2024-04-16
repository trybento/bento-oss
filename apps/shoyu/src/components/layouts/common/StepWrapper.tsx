import React from 'react';
import cx from 'classnames';
import { ChecklistStyle, MediaOrientation } from 'bento-common/types';

import { StepWrapperProps } from '../../../lib/guideRenderConfig';
import TransitionWrapper from '../../TransitionWrapper';
import ExtractedRichContent from './ExtractedRichContent';

type Props = StepWrapperProps;

const CommonStepWrapper: React.FC<Props> = ({
  step,
  handleSelectedStep,
  isSelected,
  extractedNodes,
  transition,
  style,
  expanded,
  children,
  imageWidth,
  allowMarginlessImages,
  extractedNodesContainerStyle,
}) => {
  return (
    <div
      key={step?.entityId}
      onClick={isSelected ? undefined : handleSelectedStep}
      className="flex flex-row overflow-hidden h-full"
    >
      <TransitionWrapper
        transition={transition}
        expanded={expanded}
        key={`step-content-${step?.entityId}`}
      >
        <div
          className={cx('flex gap-4 w-full h-full overflow-hidden', {
            'flex-row-reverse':
              (style as ChecklistStyle)?.mediaOrientation ===
              MediaOrientation.Left,
          })}
        >
          <div className="overflow-hidden grow h-full">{children}</div>
          {extractedNodes &&
            Object.values(extractedNodes).some((nodes) => nodes.length > 0) && (
              <div className="shrink-0" style={extractedNodesContainerStyle}>
                <ExtractedRichContent
                  extractedNodes={extractedNodes}
                  width={imageWidth}
                  allowMarginless={allowMarginlessImages}
                  mediaOrientation={(style as ChecklistStyle)?.mediaOrientation}
                />
              </div>
            )}
        </div>
      </TransitionWrapper>
    </div>
  );
};

export default CommonStepWrapper;
